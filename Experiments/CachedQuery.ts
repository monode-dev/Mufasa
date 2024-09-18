// import { createMutable } from "solid-js/store";
// import { Branded } from "./Utils";
// import { createEffect } from "solid-js/types/server/reactive";

// type DocStore = Record<DocId, Doc | "deleted" | undefined>;
// type Doc = Record<PropKey, PropValue | undefined>;
// type DocId = Branded<string, "DocId">;
// type PropKey = string | symbol;
// type PropValue =
//   | string
//   | number
//   | boolean
//   | null
//   | {
//       type: string;
//       value: string; // | number | boolean | null;
//     };

// // Device
// type DeviceFilePersister = {
//   readFile: () => Promise<string | undefined>;
//   writeFile: (base64String: string) => Promise<void>;
// };

// /** */
// export async function initCachedQuery(config: {
//   //instanceId?: string;
//   // cloudQueryPersister: any;
//   devicePersister?: DeviceFilePersister;
//   // sessionStore: any;
// }): Promise<{
//   readonly docs: DocStore;
//   batchUpdate: (updates: DocStore) => Promise<void>;
//   toJson: () => Record<string, Record<string, PropValue>>;
//   readonly deleteCachedQuery: () => Promise<void>;
// }> {
//   const store = createMutable<DocStore>(
//     JSON.parse((await config.devicePersister?.readFile()) ?? `{}`),
//   );
//   createEffect(() => {
//     config.devicePersister?.writeFile(JSON.stringify(store));
//   });
//   return {} as any;
// }

// export async function savedJson<T extends {}>(config: {
//   initJson: T;
//   //instanceId?: string;
//   // cloudQueryPersister: any;
//   devicePersister?: DeviceFilePersister;
//   // sessionStore: any;
// }): Promise<{
//   readonly docs: DocStore;
//   batchUpdate: (updates: DocStore) => Promise<void>;
//   toJson: () => Record<string, Record<string, PropValue>>;
//   readonly deleteCachedQuery: () => Promise<void>;
// }> {
//   const store = createMutable<DocStore>(
//     JSON.parse((await config.devicePersister?.readFile()) ?? `{}`),
//   );
//   createEffect(() => {
//     config.devicePersister?.writeFile(JSON.stringify(store));
//   });
//   return {} as any;
// }
