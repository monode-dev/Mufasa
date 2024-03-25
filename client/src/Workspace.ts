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
import { Prop, ReadonlyProp } from "@monode/mosa";
import { isValid } from "./Utils.js";

// SECTION: Types
export type UserInfo = {
  uid: string;
  email: string | null;
};
export type Member = {
  uid: string;
  email: string | null;
  role: `member` | `owner`;
};
export type UserMetadata = {
  workspaceId: string | null;
  role: `member` | `owner` | null;
};
export type NonNullUserMetadata = {
  [K in keyof UserMetadata]-?: NonNullable<UserMetadata[K]>;
};
export type WorkspaceIntegration = {
  onUserMetadata: (
    handle: (metadata: UserMetadata | null) => void,
  ) => () => void;
  watchMembers: (
    workspaceId: string,
    handle: (members: Member[]) => void,
  ) => void;
  generateInviteCode: () => Promise<string>;
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

// SECTION: Cloud Auth
export type GetCloudAuth<T extends SignInFuncs> = (config: {
  onAuthStateChanged: (user: UserInfo | null) => void;
  stage: string;
}) => CloudAuth<T>;
export type CloudAuth<T extends SignInFuncs> = {
  signInFuncs: T;
  signOut: () => Promise<void>;
  getWorkspaceIntegration: (uid: string) => WorkspaceIntegration;
};
export type SignInFuncs = {
  [key: string]: () => Promise<void>;
};
export function initializeAuth<T extends SignInFuncs>(config: {
  stage: string;
  sessionPersister: Session.Persister;
  directoryPersister: Device.DirectoryPersister;
  getCloudAuth: GetCloudAuth<T>;
}) {
  const { useProp, useFormula, doNow, exists, onDispose } =
    config.sessionPersister;
  function createWorkspaceInterface(
    userId: string,
    workspaceIntegration: WorkspaceIntegration,
    onDispose: (dispose: () => void) => void,
  ) {
    const isCreatingWorkspace = useProp(false);
    const isJoiningWorkspace = useProp(false);
    const isLeavingWorkspace = useProp(false);
    // const isDeletingWorkspace = useProp(false);

    type PendingAsJson = typeof PendingAsJson;
    const PendingAsJson = null;
    type NoneAsJson = typeof NoneAsJson;
    const NoneAsJson = 0;
    const userMetadata = doNow(() => {
      type SavedUserMetadata = PendingAsJson | NoneAsJson | NonNullUserMetadata;
      const userMetadata = useProp<SavedUserMetadata>(PendingAsJson);
      const savedMetadata = config.directoryPersister
        .jsonFile(`${userId}.json`)
        .start(PendingAsJson as SavedUserMetadata);
      savedMetadata.loadedFromLocalStorage.then(() => {
        userMetadata.value = savedMetadata.data;
      });
      const disposeOnSnapshot = workspaceIntegration.onUserMetadata(
        (newMetadata) => {
          savedMetadata.batchUpdate((data) => {
            const newMetadataValue =
              exists(newMetadata?.workspaceId) && exists(newMetadata?.role)
                ? {
                    workspaceId: newMetadata.workspaceId,
                    role: newMetadata.role,
                  }
                : NoneAsJson;
            data.value = newMetadataValue;
            userMetadata.value = newMetadataValue;
          });
        },
      );
      onDispose(disposeOnSnapshot);
      return userMetadata as ReadonlyProp<SavedUserMetadata>;
    });

    const WorkspaceStates = {
      pending: {
        isPending: true,
      },
      none: {
        isNone: true,
        async createWorkspace() {
          isCreatingWorkspace.value = true;
          await workspaceIntegration.createWorkspace({
            stage: config.stage,
          });
          isCreatingWorkspace.value = false;
        },
        async joinWorkspace(props: { inviteCode: string }) {
          isJoiningWorkspace.value = true;
          await workspaceIntegration.joinWorkspace({
            inviteCode: props.inviteCode,
            stage: config.stage,
          });
          isJoiningWorkspace.value = false;
        },
      },
      creating: {
        isCreating: true,
      },
      joining: {
        isJoining: true,
      },
      createJoinedInst(userMetadata: NonNullUserMetadata) {
        const otherMembers = doNow(() => {
          const otherMembers = useProp<Member[]>([]);
          let haveStartedWatching = false;
          return {
            get value() {
              if (!haveStartedWatching) {
                workspaceIntegration.watchMembers(
                  userMetadata.workspaceId,
                  (allMembers) => {
                    otherMembers.value = allMembers.filter((member) => {
                      return member.uid !== userId;
                    });
                  },
                );
                haveStartedWatching = true;
              }
              return otherMembers.value;
            },
          };
        });
        const result = {
          haveJoined: true,
          id: userMetadata.workspaceId,
          get otherMembers() {
            return otherMembers.value;
          },
        };
        const roleBasedProps = useFormula(() =>
          userMetadata.role === `owner`
            ? {
                isOwner: true,
                role: userMetadata.role,
                async createWorkspaceInvite() {
                  if (userMetadata.role !== `owner`) {
                    console.error(
                      `Attempted to create a workspace invite without permission.`,
                    );
                    return;
                  }
                  if (userMetadata.workspaceId === null) {
                    console.error(
                      `Attempted to create a workspace invite without a workspace.`,
                    );
                    return;
                  }
                  const validForDays = 14;
                  const inviteCode =
                    await workspaceIntegration.generateInviteCode();
                  await workspaceIntegration.createWorkspaceInterface({
                    inviteCode,
                    workspaceId: userMetadata.workspaceId,
                    validForDays,
                  });
                  return { inviteCode, validForDays };
                },
                async kickMember() {
                  console.error(`Not implemented`);
                },
                // async deleteWorkspace() {
                //   isLeavingWorkspace.value = true;
                //   await workspaceIntegration.deleteWorkspace();
                //   isLeavingWorkspace.value = false;
                // },
              }
            : {
                role: userMetadata.role,
                async leaveWorkspace() {
                  isLeavingWorkspace.value = true;
                  await workspaceIntegration.leaveWorkspace({
                    stage: config.stage,
                  });
                  isLeavingWorkspace.value = false;
                },
              },
        ).value;
        Object.keys(roleBasedProps).forEach((key) => {
          Object.defineProperty(result, key, {
            get: () => roleBasedProps[key as keyof typeof roleBasedProps],
            set: (newValue) => {
              (roleBasedProps as any)[key] = newValue;
            },
          });
        });
        return result as typeof result & typeof roleBasedProps;
      },
      leaving: {
        isLeaving: true,
      },
      // deleting: {
      //   isDeleting: true,
      // },
    } as const;

    return useFormula(() => {
      console.log(`userMetadata.value`, userMetadata.value);
      return userMetadata.value === PendingAsJson
        ? WorkspaceStates.pending
        : userMetadata.value === NoneAsJson
        ? isCreatingWorkspace.value
          ? WorkspaceStates.creating
          : isJoiningWorkspace.value
          ? WorkspaceStates.joining
          : WorkspaceStates.none
        : isLeavingWorkspace.value
        ? WorkspaceStates.leaving
        : WorkspaceStates.createJoinedInst(userMetadata.value);
    });
  }

  // SECTION: User
  return doNow(() => {
    const userInfo = useProp<undefined | null | UserInfo>(undefined);
    const cloudAuth = config.getCloudAuth({
      onAuthStateChanged: (user) => (userInfo.value = user),
      stage: config.stage,
    });
    const isSigningIn = useProp(false);
    const isSigningOut = useProp(false);
    async function signOut() {
      isSigningOut.value = true;
      await cloudAuth.signOut();
      isSigningOut.value = false;
    }
    const UserStates = {
      pending: {
        isPending: true,
      },
      signedOut: doNow(() => {
        const signedOut = { isSignedOut: true } as {
          isSignedOut: true;
        } & T;
        // TODO: Force these to be single threaded.
        Object.keys(cloudAuth.signInFuncs).forEach((key) => {
          (signedOut as any)[key] = async () => {
            isSigningIn.value = true;
            await cloudAuth.signInFuncs[key]();
            isSigningIn.value = false;
          };
        });
        return signedOut;
      }),
      signingIn: {
        isSigningIn: true,
      },
      createAwaitingVerificationInst(userInfo: UserInfo) {
        return {
          isAwaitingVerification: true,
          get email() {
            return userInfo.email ?? null;
          },
          signOut,
        };
      },
      // TODO: Maybe swap out the whole object when the user changes.
      createSignedInInst(
        userInfo: UserInfo,
        onDispose: (dispose: () => void) => void,
      ) {
        const workspace = createWorkspaceInterface(
          userInfo.uid,
          cloudAuth.getWorkspaceIntegration(userInfo.uid),
          onDispose,
        );
        return {
          uid: userInfo.uid,
          email: userInfo.email,
          isSignedIn: true,
          // TODO: Leaving a workspace is not updating this.
          // TODO: Maybe use a query to watch this value.
          get workspace() {
            return workspace.value;
          },
          signOut,
        };
      },
      signingOut: {
        isSigningOut: true,
      },
    };

    return useFormula(
      () =>
        userInfo.value === undefined
          ? UserStates.pending
          : userInfo.value === null
          ? isSigningIn.value
            ? UserStates.signingIn
            : UserStates.signedOut
          : isSigningOut.value
          ? UserStates.signingOut
          : UserStates.createSignedInInst(userInfo.value, onDispose),
      // createAwaitingVerificationInst,
    );
  });
}

// SECTION: Workspace Instances
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
  onStoreInit?: (store: DocStore) => void;
}): DocStore {
  return getWorkspaceInst(params).getDocStore(params);
}
export function getFileStore(params: {
  stage: string;
  workspaceId: string | null;
  docType: string;
  getStoreConfig: () => PersistanceConfig;
  onStoreInit?: (store: FileStore) => void;
}): FileStore {
  return getWorkspaceInst(params).getFileStore(params);
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
    getDocStore(params: {
      docType: string;
      getStoreConfig: () => PersistanceConfig;
      onStoreInit?: (store: DocStore) => void;
    }): DocStore {
      if (!docStores.has(params.docType)) {
        docStores.set(
          params.docType,
          createDocStore(
            initDocStoreConfig({
              stage: workspaceConfig.stage,
              workspaceId: workspaceConfig.workspaceId,
              docType: params.docType,
              persistance: params.getStoreConfig(),
            }),
          ),
        );
        params.onStoreInit?.(docStores.get(params.docType)!);
      }
      return docStores.get(params.docType)!;
    },
    getFileStore(params: {
      docType: string;
      getStoreConfig: () => PersistanceConfig;
      onStoreInit?: (store: FileStore) => void;
    }): FileStore {
      if (!fileStores.has(params.docType)) {
        fileStores.set(
          params.docType,
          createFileStore(
            initDocStoreConfig({
              stage: workspaceConfig.stage,
              workspaceId: workspaceConfig.workspaceId,
              docType: params.docType,
              persistance: params.getStoreConfig(),
            }),
          ),
        );
        params.onStoreInit?.(fileStores.get(params.docType)!);
      }
      return fileStores.get(params.docType)!;
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
