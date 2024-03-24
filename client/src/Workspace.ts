import { v4 as uuidv4 } from "uuid";
import {
  Device,
  DocStore,
  PersistanceConfig,
  Session,
  initDocStoreConfig,
  createDocStore,
} from "./DocStore.js";
import { FileStore, createFileStore } from "./FileStore.js";

export type WorkspaceIntegration = {
  onUserMetadata: (
    handle: (metadata: UserMetadata | null) => void,
  ) => () => void;
  createWorkspace: (params: { stage: string }) => Promise<void>;
  createWorkspaceInterface: (params: {
    inviteCode: string;
    workspaceId: string;
    validForDays: number;
  }) => Promise<void>;
  joinWorkspace: (params: {
    inviteCode: string;
    stage: string;
  }) => Promise<void>;
  leaveWorkspace: (params: { stage: string } | undefined) => Promise<void>;
  // deleteWorkspace: (params: { stage: string } | undefined) => Promise<void>;
};
export type UserMetadata = {
  workspaceId: string | null;
  role: `member` | `owner` | null;
};

export function initializeWorkspaceInstManager(config: {
  sessionPersister: Session.Persister;
  jsonFile: Device.JsonPersister;
}) {
  const instIdMap = config.jsonFile.start(
    {} as {
      [workspaceId: string]: string;
    },
  );
  const docStores = new Map<string | null, Map<string, DocStore>>();
  const fileStores = new Map<string | null, Map<string, FileStore>>();
  return {
    registerWorkspace(workspaceId: string): string {
      const instId = uuidv4();
      instIdMap.batchUpdate((data) => {
        data.value[workspaceId] = instId;
      });
      docStores.set(instId, new Map());
      fileStores.set(instId, new Map());
      return instId;
    },
    getWorkspaceInstId(workspaceId: string | null): string | null {
      if (workspaceId === null) return null;
      return instIdMap.data[workspaceId] ?? null;
    },
    getDocStore(params: {
      workspaceId: string | null;
      docType: string;
      createDocStore: () => DocStore;
    }): DocStore | null {
      const instId = this.getWorkspaceInstId(params.workspaceId);
      if (instId === null) return null;
      if (!docStores.get(instId)!.has(params.docType)) {
        docStores.get(instId)!.set(params.docType, params.createDocStore());
      }
      return docStores.get(instId)!.get(params.docType)!;
    },

    ejectWorkspace(workspaceId: string) {
      instIdMap.batchUpdate((data) => {
        delete data.value[workspaceId];
      });
    },
  };
}

const workspaceInsts = new Map<string | null, WorkspaceInst>();
function getWorkspaceInst(params: {
  stage: string;
  workspaceId: string | null;
}) {
  if (!workspaceInsts.has(params.workspaceId)) {
    workspaceInsts.set(params.workspaceId, createWorkspaceInst(params));
  }
  return workspaceInsts.get(params.workspaceId)!;
}
export function getDocStore(params: {
  stage: string;
  workspaceId: string | null;
  docType: string;
  getStoreConfig: () => PersistanceConfig;
}): DocStore {
  return getWorkspaceInst(params).getDocStore(
    params.docType,
    params.getStoreConfig,
  );
}
export function getFileStore(params: {
  stage: string;
  workspaceId: string | null;
  docType: string;
  getStoreConfig: () => PersistanceConfig;
}): FileStore {
  return getWorkspaceInst(params).getFileStore(
    params.docType,
    params.getStoreConfig,
  );
}

type WorkspaceInst = ReturnType<typeof createWorkspaceInst>;
function createWorkspaceInst(workspaceConfig: {
  workspaceId: string | null;
  stage: string;
}) {
  const docStores = new Map<string, DocStore>();
  const fileStores = new Map<string, FileStore>();
  return {
    get stage() {
      return workspaceConfig.stage;
    },
    get workspaceId() {
      return workspaceConfig.workspaceId;
    },
    getDocStore(
      docType: string,
      getStoreConfig: () => PersistanceConfig,
    ): DocStore {
      if (!docStores.has(docType)) {
        docStores.set(
          docType,
          createDocStore(
            initDocStoreConfig({
              persistance: getStoreConfig(),
              stage: workspaceConfig.stage,
              workspaceId: workspaceConfig.workspaceId,
              docType: docType,
            }),
          ),
        );
      }
      return docStores.get(docType)!;
    },
    getFileStore(
      docType: string,
      getStoreConfig: () => PersistanceConfig,
    ): FileStore {
      if (!fileStores.has(docType)) {
        fileStores.set(
          docType,
          createFileStore(
            initDocStoreConfig({
              stage: workspaceConfig.stage,
              workspaceId: workspaceConfig.workspaceId,
              docType: docType,
              persistance: getStoreConfig(),
            }),
          ),
        );
      }
      return fileStores.get(docType)!;
    },
  };
}
