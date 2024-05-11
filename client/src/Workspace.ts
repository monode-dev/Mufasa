import { Device, Session, Cloud } from "./DocStore.js";
import { ReadonlyProp } from "mosa-js";
import { isValid } from "./Utils.js";
import { userInfo } from "os";

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
>[`value`];
export function initializeAuth<T extends SignInFuncs>(config: {
  stage: string;
  sessionPersister: Session.Persister;
  directoryPersister: Device.DirectoryPersister;
  getCloudAuth: GetCloudAuth<T>;
}): {
  get value(): UserState<T>;
} {
  const { useProp, useFormula, doNow, onDispose, useRoot } =
    config.sessionPersister;

  // SECTION: User
  return doNow(() => {
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
        emailVerified: useFormula(
          () => _userInfo.value?.emailVerified ?? false,
        ),
      }));
    });
    const isSigningIn = useRoot(() => useProp(false));
    const isSigningOut = useRoot(() => useProp(false));
    async function signOut() {
      // isSigningOut.value = true;
      await cloudAuth.signOut();
      // isSigningOut.value = false;
    }
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

    return useRoot(() =>
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
  });
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

  type PendingAsJson = typeof PendingAsJson;
  const PendingAsJson = null;
  type NoneAsJson = typeof NoneAsJson;
  const NoneAsJson = 0;
  const userMetadata = doNow(() => {
    type SavedUserMetadata =
      | PendingAsJson
      | NoneAsJson
      | Readonly<NonNullUserMetadata>;
    console.log(`Workspace - Setting up userMetadata for uid: ${uid}`);
    const userMetadata = useProp<SavedUserMetadata>(PendingAsJson);
    const savedMetadata = config.directoryPersister
      .jsonFile(`${uid}.json`)
      .load(PendingAsJson as SavedUserMetadata);
    savedMetadata.loadedFromLocalStorage.then(() => {
      userMetadata.value = savedMetadata.data as any;
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
          console.log(
            `Workspace savedMetadata.fileName: ${
              savedMetadata.fileName
            }, newMetadataValue: ${JSON.stringify(newMetadataValue, null, 2)}`,
          );
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
              async deleteAccount() {
                await workspaceIntegration.deleteAccount({
                  stage: config.stage,
                });
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
      : WorkspaceStates.createJoinedInst(userMetadata.value /**, onCleanup */),
  );
}
