import { Device } from "./DocStore.js";
type AddStep<PrevIn extends Device.Json[], PrevOut> = {
    addStep: <NewOut>(func: (args: PrevOut) => Promise<NewOut>) => ((...args: PrevIn) => void) & {
        pauseAll: () => Promise<void>;
        resumeAll: () => Promise<void>;
    } & AddStep<PrevIn, NewOut>;
};
export declare function createPersistedFunction<Params extends Device.Json[], Return>(localJsonFilePersister: Device.JsonPersister, func: (...args: Params) => Promise<Return>): ((...args: Params) => void) & AddStep<Params, Return> & {
    pauseAll: () => Promise<void>;
    resumeAll: () => Promise<void>;
};
export {};
