import { Json, LocalJsonFilePersister } from "./DocStore.js";
import { v4 as uuidv4 } from "uuid";

type AddStep<PrevIn extends Json[], PrevOut> = {
  addStep: <NewOut>(
    func: (args: PrevOut) => Promise<NewOut>,
  ) => ((...args: PrevIn) => Promise<NewOut>) & AddStep<PrevIn, NewOut>;
};

export function createPersistedFunction<Params extends Json[], Return>(
  localJsonFilePersister: LocalJsonFilePersister,
  func: (...args: Params) => Promise<Return>,
): ((...args: Params) => Promise<Return>) & AddStep<Params, Return> {
  const steps: Function[] = [func];
  const savedJson = localJsonFilePersister.start({
    activeFunctions: {} as {
      [instanceId: string]: {
        step: number;
        args: Json[];
      };
    },
  });
  async function doNextStep(instanceId: string): Promise<Return> {
    const funcConfig = savedJson.data.activeFunctions[instanceId];
    if (funcConfig.step >= steps.length) return {} as any;
    const stepFunc = steps[funcConfig.step];
    const stepResult = await stepFunc(...funcConfig.args);
    const nextStepIndex = funcConfig.step + 1;
    if (nextStepIndex < steps.length) {
      savedJson.batchUpdate((data) => {
        data.activeFunctions[instanceId] = {
          step: nextStepIndex,
          args: [stepResult],
        };
      });
      return await doNextStep(instanceId);
    } else {
      savedJson.batchUpdate((data) => {
        delete data.activeFunctions[instanceId];
      });
      return stepResult;
    }
  }
  savedJson.loadedFromLocalStorage.then(() => {
    Object.keys(savedJson.data.activeFunctions).forEach(doNextStep);
  });
  return Object.assign(
    async (...args: Params) => {
      const instanceId = uuidv4();
      savedJson.batchUpdate(async (data) => {
        data.activeFunctions[instanceId] = { step: 0, args };
      });
      return await doNextStep(instanceId);
    },
    {
      addStep(newStep: Function) {
        steps.push(newStep);
        return this;
      },
    },
  ) as any;
}
