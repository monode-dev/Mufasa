import { GetPersister, LocalJsonPersister, PersisterSetup } from "../DocStore.js";
export declare function capacitorPersister(getDirectoryPath?: (setup: PersisterSetup) => string): GetPersister<LocalJsonPersister>;
