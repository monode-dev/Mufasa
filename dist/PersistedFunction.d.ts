import { Json, LocalJsonFilePersister } from "./DocStore.js";
type AddStep<PrevIn extends Json[], PrevOut> = {
    addStep: <NewOut>(func: (args: PrevOut) => Promise<NewOut>) => ((...args: PrevIn) => Promise<NewOut>) & AddStep<PrevIn, NewOut>;
};
export declare function createPersistedFunction<Params extends Json[], Return>(localJsonFilePersister: LocalJsonFilePersister, func: (...args: Params) => Promise<Return>): ((...args: Params) => Return) & AddStep<Params, Return>;
export {};
