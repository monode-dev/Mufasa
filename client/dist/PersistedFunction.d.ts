import { Device } from "./DocStore.js";
type AddStep<PrevIn extends Device.Json[], PrevOut> = {
    addStep: <NewOut>(func: (args: PrevOut) => Promise<NewOut>) => ((...args: PrevIn) => Promise<NewOut>) & AddStep<PrevIn, NewOut>;
};
export declare function createPersistedFunction<Params extends Device.Json[], Return>(localJsonFilePersister: Device.JsonPersister, func: (...args: Params) => Promise<Return>): ((...args: Params) => Promise<Return>) & AddStep<Params, Return>;
export {};
