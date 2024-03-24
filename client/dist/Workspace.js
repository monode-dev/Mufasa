import { initDocStoreConfig, createDocStore, } from "./DocStore.js";
import { createFileStore } from "./FileStore.js";
const workspaceInsts = new Map();
function getWorkspaceInst(params) {
    if (!workspaceInsts.has(params.workspaceId)) {
        workspaceInsts.set(params.workspaceId, createWorkspaceInst(params));
    }
    return workspaceInsts.get(params.workspaceId);
}
export function getDocStore(params) {
    return getWorkspaceInst(params).getDocStore(params);
}
export function getFileStore(params) {
    return getWorkspaceInst(params).getFileStore(params);
}
function createWorkspaceInst(workspaceConfig) {
    const docStores = new Map();
    const fileStores = new Map();
    return {
        get stage() {
            return workspaceConfig.stage;
        },
        get workspaceId() {
            return workspaceConfig.workspaceId;
        },
        getDocStore(params) {
            if (!docStores.has(params.docType)) {
                docStores.set(params.docType, createDocStore(initDocStoreConfig({
                    stage: workspaceConfig.stage,
                    workspaceId: workspaceConfig.workspaceId,
                    docType: params.docType,
                    persistance: params.getStoreConfig(),
                })));
                params.onStoreInit?.(docStores.get(params.docType));
            }
            return docStores.get(params.docType);
        },
        getFileStore(params) {
            if (!fileStores.has(params.docType)) {
                fileStores.set(params.docType, createFileStore(initDocStoreConfig({
                    stage: workspaceConfig.stage,
                    workspaceId: workspaceConfig.workspaceId,
                    docType: params.docType,
                    persistance: params.getStoreConfig(),
                })));
                params.onStoreInit?.(fileStores.get(params.docType));
            }
            return fileStores.get(params.docType);
        },
    };
}
// export function initializeWorkspaceInstManager(config: {
//   sessionPersister: Session.Persister;
//   jsonFile: Device.JsonPersister;
// }) {
//   const instIdMap = config.jsonFile.start(
//     {} as {
//       [workspaceId: string]: string;
//     },
//   );
//   const docStores = new Map<string | null, Map<string, DocStore>>();
//   const fileStores = new Map<string | null, Map<string, FileStore>>();
//   return {
//     registerWorkspace(workspaceId: string): string {
//       const instId = uuidv4();
//       instIdMap.batchUpdate((data) => {
//         data.value[workspaceId] = instId;
//       });
//       docStores.set(instId, new Map());
//       fileStores.set(instId, new Map());
//       return instId;
//     },
//     getWorkspaceInstId(workspaceId: string | null): string | null {
//       if (workspaceId === null) return null;
//       return instIdMap.data[workspaceId] ?? null;
//     },
//     getDocStore(params: {
//       workspaceId: string | null;
//       docType: string;
//       createDocStore: () => DocStore;
//     }): DocStore | null {
//       const instId = this.getWorkspaceInstId(params.workspaceId);
//       if (instId === null) return null;
//       if (!docStores.get(instId)!.has(params.docType)) {
//         docStores.get(instId)!.set(params.docType, params.createDocStore());
//       }
//       return docStores.get(instId)!.get(params.docType)!;
//     },
//     ejectWorkspace(workspaceId: string) {
//       instIdMap.batchUpdate((data) => {
//         delete data.value[workspaceId];
//       });
//     },
//   };
// }
