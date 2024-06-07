import { Branded } from "./Utils.js";

type DocStore = Record<DocId, Doc | "deleted">;
type Doc = Record<PropKey, PropValue>;
type DocId = Branded<string, "DocId">;
type PropKey = string | symbol;
type PropValue =
  | string
  | number
  | boolean
  | {
      type: string;
      value: string | number | boolean;
    };

/** */
export async function initCachedQuery(config: {
  //instanceId?: string;
  cloudQueryPersister: any;
  directoryPersister: any;
  sessionStore: any;
}): Promise<{
  readonly docs: DocStore;
  batchUpdate: (updates: DocStore) => Promise<void>;
  toJson: () => Record<string, Record<string, PropValue>>;
  readonly deleteCachedQuery: () => Promise<void>;
}> {
  return {} as any;
}
