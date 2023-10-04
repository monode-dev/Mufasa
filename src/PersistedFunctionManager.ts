import { uuid } from "uuidv4";
import { DeepReadonly, Json, Unpromise, exists, sleep } from "./utils";
import { MfsFileSystem } from "./Implement";

type _RunStage<P extends _StageProps, R extends _StageReturn> = (
  props: P,
) => Promise<R>;
type _StageProps = Json;
type _StageReturn = _StageProps | void | QUIT_PERSISTED_FUNCTION;
export type QUIT_PERSISTED_FUNCTION = typeof QUIT_PERSISTED_FUNCTION;
export const QUIT_PERSISTED_FUNCTION = "QUIT_PERSISTED_FUNCTION";
export type FunctionState = {
  functionTypeName: string;
  stageIndex: number;
  props: any;
};

export type PersistedFunctionManager = ReturnType<
  typeof initializePersistedFunctionManager
>;
export function initializePersistedFunctionManager(
  managerId: string,
  fileSystem: MfsFileSystem,
) {
  // Persisted Executions
  const _persistedExecutions = fileSystem
    .readFile(managerId)
    .then((saveFileString) => {
      return exists(saveFileString)
        ? (JSON.parse(saveFileString) as {
            [functionId: string]: FunctionState;
          })
        : {};
    });
  async function getPersistedExecution(
    functionId: string,
  ): Promise<DeepReadonly<FunctionState> | undefined> {
    const persistedExecutions = await _persistedExecutions;
    return persistedExecutions[functionId];
  }
  async function updatePersistedExecution(
    functionId: string,
    state: FunctionState | undefined,
  ) {
    const persistedExecutions = await _persistedExecutions;
    if (exists(state)) {
      persistedExecutions[functionId] = state;
    } else {
      delete persistedExecutions[functionId];
    }
    requestSave();
  }
  // Start save Loop
  let saveIndex = 0;
  let lastSaveIndex = saveIndex;
  function requestSave() {
    saveIndex += 1;
  }
  _persistedExecutions.then(async (persistedExecutions) => {
    while (true) {
      if (lastSaveIndex !== saveIndex) {
        await fileSystem.writeFile(
          managerId,
          JSON.stringify(persistedExecutions),
        );
        lastSaveIndex = saveIndex;
      }
      await sleep(250);
    }
  });

  // Resume Functions
  const functionTypes: {
    [functionTypeName: string]: ((props: any) => Promise<any>)[];
  } = {};
  _persistedExecutions.then((persistedExecutions) => {
    for (const functionId in Object.keys(persistedExecutions)) {
      resumeFunction(functionId);
    }
  });
  async function resumeFunction(functionId: string) {
    // Load the function data
    const functionData = await getPersistedExecution(functionId);
    if (!exists(functionData)) return;
    const {
      functionTypeName,
      stageIndex: stageIndexToResumeFrom,
      props,
    } = functionData;

    // Wait for the function stages to be registered
    while (!Object.keys(functionTypes).includes(functionTypeName)) {
      await sleep(100);
    }

    // Run the remaining stages
    const stages = functionTypes[functionTypeName];
    let shouldQuit = false;
    for (
      let stageIndex = stageIndexToResumeFrom;
      !shouldQuit && stageIndex < stages.length;
      stageIndex++
    ) {
      const runStage = stages[stageIndex];
      const stageResult = await runStage(props);
      shouldQuit =
        stageResult === QUIT_PERSISTED_FUNCTION ||
        stageIndex === stages.length - 1;
      // Update Storage
      updatePersistedExecution(
        functionId,
        shouldQuit
          ? undefined
          : {
              functionTypeName,
              stageIndex: stageIndex + 1,
              props: stageResult,
            },
      );
    }
  }

  // Register Function Types
  return {
    createPersistedFunction<P extends _StageProps, R extends _StageReturn>(
      functionTypeName: string,
      runStage: _RunStage<P, R>,
    ) {
      functionTypes[functionTypeName] = [runStage];
      function wrapInAddStage<
        P extends _StageProps,
        R extends _StageReturn,
      >(wrapProps: { funcReturnType: R; func: (props: P) => void }) {
        return Object.assign(wrapProps.func, {
          addStage: <T extends _StageReturn>(
            runStage: (
              props: Exclude<R, void | QUIT_PERSISTED_FUNCTION>,
            ) => Promise<T>,
          ) => {
            functionTypes[functionTypeName].push(runStage);
            return wrapInAddStage({
              funcReturnType: {} as T,
              func: wrapProps.func,
            });
          },
        });
      }

      return wrapInAddStage({
        funcReturnType: {} as R,
        func: async (props: Exclude<P, string>) => {
          while (!exists(_persistedExecutions)) sleep(100);
          const functionId = uuid();
          updatePersistedExecution(functionId, {
            functionTypeName,
            stageIndex: 0,
            props: props ?? {},
          });
          resumeFunction(functionId);
        },
      });
    },

    /**  */
    findFunctionData(where: (state: FunctionState) => boolean) {
      return Object.values(_persistedExecutions ?? {}).find(where);
    },
  };
}
