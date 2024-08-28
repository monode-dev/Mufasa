import { Device, Session, Cloud } from "./DocStore.js";
import { ReadonlyProp } from "mosa-js";
import { isValid } from "./Utils.js";
import { v4 as uuidv4 } from "uuid";

// SECTION: Types
export type UserInfo = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
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
  watchEntitlements: (
    workspaceId: string,
    handle: (entitlements: string[]) => void,
  ) => void;
  refreshToken: () => Promise<void>;
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
  leaveWorkspace: (params: { stage: string }) => Promise<void>;
  removeMember: (params: { stage: string; uid: string }) => Promise<void>;
  deleteWorkspace: (params: { stage: string }) => Promise<void>;
  deleteAccount: (params: { stage: string }) => Promise<void>;
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
  [key: string]: (...args: any) => Promise<any>;
};
export type User<T extends Cloud.Persister<any>> = ReturnType<
  typeof initializeAuth<ReturnType<T[`getCloudAuth`]>[`signInFuncs`]>
>[`user`];
export function initializeAuth<T extends SignInFuncs>(config: {
  stage: string;
  sessionPersister: Session.Persister;
  directoryPersister: Device.DirectoryPersister;
  getCloudAuth: GetCloudAuth<T>;
}): {
  get user(): UserState<T>;
  get workspaceCacheId(): string | null | undefined;
} {
  const { useProp, useFormula, doNow, doWatch, onDispose, useRoot } =
    config.sessionPersister;

  // Connect to the cloud auth
  const { cloudAuth, uid, email, emailVerified } = doNow(() => {
    const _userInfo = useProp<undefined | null | UserInfo>(undefined);
    return useRoot(() => ({
      cloudAuth: config.getCloudAuth({
        onAuthStateChanged: (user) => {
          if (user === null && _userInfo.value === user) return;
          if (
            _userInfo.value !== undefined &&
            _userInfo.value?.uid === user?.uid &&
            _userInfo.value?.email === user?.email &&
            _userInfo.value?.emailVerified === user?.emailVerified
          )
            return;
          _userInfo.value = user;
        },
        stage: config.stage,
      }),
      uid: useFormula(() =>
        isValid(_userInfo.value) ? _userInfo.value.uid : _userInfo.value,
      ),
      email: useFormula(() => _userInfo.value?.email ?? null),
      emailVerified: useFormula(() => _userInfo.value?.emailVerified ?? false),
    }));
  });
  const isSigningIn = useRoot(() => useProp(false));
  const isSigningOut = useRoot(() => useProp(false));
  async function signOut() {
    // isSigningOut.value = true;
    await cloudAuth.signOut();
    // isSigningOut.value = false;
  }

  // Provide a useful tool for managing the user state.
  /* The reason we define these here is so that we can check if the object changes.
   * In reality we should do a more complicated reactive object, with a single state
   * property or something like that. */
  const UserStates = {
    pending: {
      isPending: true,
    },
    signedOut: doNow(() => {
      const signedOut = {
        isSignedOut: true,
        get isSigningIn() {
          return isSigningIn.value;
        },
      } as {
        isSignedOut: true;
        readonly isSigningIn: boolean;
      } & T;
      // TODO: Force these to be single threaded.
      Object.keys(cloudAuth.signInFuncs).forEach((key) => {
        (signedOut as any)[key] = async (...args: any[]) => {
          let error: any = null;
          isSigningIn.value = true;
          let result: any = undefined;
          try {
            result = await cloudAuth.signInFuncs[key](...(args as []));
          } catch (e) {
            error = e;
          }
          isSigningIn.value = false;
          if (isValid(error)) throw error;
          return result;
        };
      });
      return signedOut;
    }),
    createSignedInButNotVerifiedInst: (userInfo: Readonly<UserInfo>) => ({
      isSignedInButNotVerified: true as const,
      get uid() {
        return userInfo.uid;
      },
      get email() {
        return userInfo.email;
      },
      signOut,
    }),
    // TODO: Maybe swap out the whole object when the user changes.
    createSignedInInst(
      userInfo: Readonly<UserInfo>,
      onDispose: (dispose: () => void) => void,
    ) {
      const workspace = createWorkspaceInterface({
        uid: userInfo.uid,
        workspaceIntegration: cloudAuth.getWorkspaceIntegration(userInfo.uid),
        onDispose,
        directoryPersister: config.directoryPersister,
        sessionPersister: config.sessionPersister,
        stage: config.stage,
      });
      return {
        uid: userInfo.uid,
        email: userInfo.email,
        isSignedIn: true,
        // TODO: Leaving a workspace is not updating this.
        // TODO: Maybe use a query to watch this value.
        get workspace() {
          return workspace.value;
        },
        get isSigningOut() {
          return isSigningOut.value;
        },
        signOut,
      };
    },
  };

  // Compute the current user state.
  const user = useRoot(() =>
    useFormula(() =>
      uid.value === undefined
        ? UserStates.pending
        : uid.value === null
          ? UserStates.signedOut
          : emailVerified.value
            ? UserStates.createSignedInInst(
                {
                  uid: uid.value,
                  email: email.value,
                  emailVerified: emailVerified.value,
                },
                onDispose,
              )
            : UserStates.createSignedInButNotVerifiedInst({
                uid: uid.value,
                email: email.value,
                emailVerified: emailVerified.value,
              }),
    ),
  ) as any;

  // Use a separate workspace cache ID each time a user joins a workspace, even the same workspace twice.
  /* TODO: There are two big problems with this:
   *
   * 1. This needs to be set at the same time as workspace Id, otherwise they might fall out of sync.
   * There is a bigger issue here that we are caching aspects of the UserMetadata doc several different
   * places. This caching should all happen in one place so there is a single source of truth.
   * 
   * 2. We need to delete the old store when the cacheId changes. We can't rely on reactivity for this
   * since listeners may join after the cacheId has changed and never get a chance to delete the old store
   * associated with the old cache Id. */
  const workspaceCacheId = doNow(() => {
    const workspaceCacheId = useRoot(() =>
      useProp<string | null | undefined>(undefined),
    );

    // Start watching the cloud signature
    const signatureFromCloud = useRoot(() =>
      useFormula(() =>
        user.isSignedIn && !user.workspace.isPending
          ? isValid(user.uid) && isValid(user.workspace.id)
            ? {
                uid: user.uid as string,
                workspaceId: user.workspace.id as string,
              }
            : null
          : undefined,
      ),
    );

    // Workspace cache ID from device
    const signatureFromDevice = config.directoryPersister
      .jsonFile(`currentWorkspaceInstConfig.json`)
      .load<
        | (typeof signatureFromCloud.value & {
            cacheId: string;
          })
        | null
      >(null);

    // Load the last known workspace signature, and then watch for changes.
    signatureFromDevice.loadedFromLocalStorage.then(() => {
      // Start with the last remembered workspace signature
      workspaceCacheId.value = signatureFromDevice.data?.cacheId;

      // Watch for changes in the cloud signature
      useRoot(() =>
        doWatch(
          () => {
            // Wait to update stuff until we have a workspace signature from the cloud.
            if (signatureFromCloud.value === undefined) return;

            // Only do something if the workspace signature has changed.
            const uidIsTheSame =
              signatureFromCloud.value?.uid === signatureFromDevice.data?.uid;
            const workspaceIdIsTheSame =
              signatureFromCloud.value?.workspaceId ===
              signatureFromDevice.data?.workspaceId;
            if (uidIsTheSame && workspaceIdIsTheSame) return;

            // Apply the new workspace signature and cache ID.
            const newWorkspaceSignature = isValid(signatureFromCloud.value)
              ? { ...signatureFromCloud.value, cacheId: uuidv4() }
              : null;
            signatureFromDevice.batchUpdate((data) => {
              data.value = newWorkspaceSignature;
            });
            workspaceCacheId.value = newWorkspaceSignature?.cacheId;

              // Dispose of the old store.
              if (isValid(oldInstConfig?.instId)) {
                params.deleteStoreInst({
                  docType: params.docType,
                  instId: oldInstConfig.instId,
                  store: oldStore,
                });
              }
          },
          {
            on: [signatureFromCloud],
          },
        ),
      );
    });

    return workspaceCacheId;
  });

  return {
    get user() {
      return user.value;
    },
    get workspaceCacheId() {
      return workspaceCacheId.value;
    },
  };
}
export type UserState<T extends SignInFuncs> = _Or<_UserStates<T>>;
type _UserStates<T extends SignInFuncs> = {
  pending: {
    isPending: true;
  };
  signedOut: {
    isSignedOut: true;
    isSigningIn: boolean;
  } & T;
  signedIn: {
    uid: string;
    email: string | null;
    isSignedIn: true;
    workspace: ReturnType<typeof createWorkspaceInterface>[`value`];
    signOut: () => Promise<void>;
    isSigningOut: boolean;
  };
  signedInButNotVerified: {
    isSignedInButNotVerified: true;
    uid: string;
    email: string | null;
    signOut: () => Promise<void>;
  };
};
type _Or<T extends { [key: string]: {} }> = {
  [K in keyof T]: T[K] & {
    [K2 in Exclude<_AllKeys<T>, keyof T[K]>]?: undefined;
  };
}[keyof T];
type _AllKeys<T extends { [key: string]: {} }> = {
  [K in keyof T]: keyof T[K];
}[keyof T];
// type ksjdakf<T extends { [key: string]: {} }> = {
//   [K in keyof T]: T[K] & {
//     [K2 in Exclude<_AllKeys<T>, keyof T[K]>]?: undefined;
//   };
// };
// type AJSKDFjsa = ksjdakf<_UserStates<{}>>[`signedIn`];

function createWorkspaceInterface(config: {
  uid: string;
  workspaceIntegration: WorkspaceIntegration;
  onDispose: (dispose: () => void) => void;
  directoryPersister: Device.DirectoryPersister;
  sessionPersister: Session.Persister;
  stage: string;
}) {
  const { uid, workspaceIntegration, sessionPersister } = config;
  const { useProp, useFormula, doNow, exists, onDispose } = sessionPersister;
  const isCreatingWorkspace = useProp(false);
  const isJoiningWorkspace = useProp(false);
  const isLeavingWorkspace = useProp(false);
  const isDeletingWorkspace = useProp(false);

  // Connect to cloud
  type PendingAsJson = typeof PendingAsJson;
  const PendingAsJson = null;
  type NoneAsJson = typeof NoneAsJson;
  const NoneAsJson = 0;
  const userMetadata = doNow(() => {
    type SavedUserMetadata =
      | PendingAsJson
      | NoneAsJson
      | Readonly<NonNullUserMetadata>;
    const userMetadata = useProp<SavedUserMetadata>(PendingAsJson);
    const savedMetadata = config.directoryPersister
      .jsonFile(`${uid}.json`)
      .load(PendingAsJson as SavedUserMetadata);
    savedMetadata.loadedFromLocalStorage.then(() => {
      userMetadata.value = savedMetadata.data as any;
    });
    const disposeOnSnapshot = workspaceIntegration.onUserMetadata(
      (newMetadata) => {
        savedMetadata.batchUpdate((savedData) => {
          const newMetadataValue =
            exists(newMetadata?.workspaceId) && exists(newMetadata?.role)
              ? {
                  workspaceId: newMetadata.workspaceId,
                  role: newMetadata.role,
                }
              : NoneAsJson;
          savedData.value = newMetadataValue;
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
        let error: any = null;
        try {
          await workspaceIntegration.createWorkspace({
            stage: config.stage,
          });
        } catch (e) {
          error = e;
        }
        isCreatingWorkspace.value = false;
        if (error !== null) throw error;
      },
      async joinWorkspace(props: { inviteCode: string }) {
        isJoiningWorkspace.value = true;
        let error: any = null;
        try {
          await workspaceIntegration.joinWorkspace({
            inviteCode: props.inviteCode,
            stage: config.stage,
          });
        } catch (e) {
          error = e;
        }
        isJoiningWorkspace.value = false;
        if (error !== null) throw error;
      },
      get isCreating() {
        return isCreatingWorkspace.value;
      },
      get isJoining() {
        return isJoiningWorkspace.value;
      },
    },
    createJoinedInst(userMetadata: NonNullUserMetadata) {
      const entitlements = doNow(() => {
        const entitlements = useProp<string[]>([]);
        let haveStartedWatching = false;
        return {
          get value() {
            if (!haveStartedWatching) {
              workspaceIntegration.watchEntitlements(
                userMetadata.workspaceId,
                (allEntitlements) => {
                  entitlements.value = allEntitlements;
                },
              );
              haveStartedWatching = true;
            }
            return entitlements.value;
          },
        };
      });
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
                    return member.uid !== uid;
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
        get workspaceEntitlements() {
          return entitlements.value;
        },
        get isLeaving() {
          return isLeavingWorkspace.value;
        },
        get isDeleting() {
          return isDeletingWorkspace.value;
        },
        async refreshToken() {
          await workspaceIntegration.refreshToken();
        },
        async deleteAccount() {
          await workspaceIntegration.deleteAccount({
            stage: config.stage,
          });
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
              async removeMember(params: { uid: string }) {
                return await workspaceIntegration.removeMember({
                  stage: config.stage,
                  uid: params.uid,
                });
              },
              async deleteWorkspace() {
                isDeletingWorkspace.value = true;
                await workspaceIntegration.deleteWorkspace({
                  stage: config.stage,
                });
                isDeletingWorkspace.value = false;
              },
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
    // deleting: {
    //   isDeleting: true,
    // },
  } as const;

  return useFormula(() =>
    userMetadata.value === PendingAsJson
      ? WorkspaceStates.pending
      : userMetadata.value === NoneAsJson
        ? WorkspaceStates.none
        : WorkspaceStates.createJoinedInst(
            userMetadata.value /**, onCleanup */,
          ),
  );
}
