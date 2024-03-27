import { initDocStoreConfig, createDocStore, } from "./DocStore.js";
import { createFileStore } from "./FileStore.js";
export function initializeAuth(config) {
    const { useProp, useFormula, doNow, exists, onDispose } = config.sessionPersister;
    // SECTION: User
    return doNow(() => {
        const userInfo = useProp(undefined);
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
                const signedOut = { isSignedOut: true };
                // TODO: Force these to be single threaded.
                Object.keys(cloudAuth.signInFuncs).forEach((key) => {
                    signedOut[key] = async () => {
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
            createAwaitingVerificationInst(userInfo) {
                return {
                    isAwaitingVerification: true,
                    get email() {
                        return userInfo.email ?? null;
                    },
                    signOut,
                };
            },
            // TODO: Maybe swap out the whole object when the user changes.
            createSignedInInst(userInfo, onDispose) {
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
                    signOut,
                };
            },
            signingOut: {
                isSigningOut: true,
            },
        };
        return useFormula(() => userInfo.value === undefined
            ? UserStates.pending
            : userInfo.value === null
                ? isSigningIn.value
                    ? UserStates.signingIn
                    : UserStates.signedOut
                : isSigningOut.value
                    ? UserStates.signingOut
                    : UserStates.createSignedInInst(userInfo.value, onDispose));
    });
}
// type ksjdakf<T extends { [key: string]: {} }> = {
//   [K in keyof T]: T[K] & {
//     [K2 in Exclude<_AllKeys<T>, keyof T[K]>]?: undefined;
//   };
// };
// type AJSKDFjsa = ksjdakf<_UserStates<{}>>[`signedIn`];
function createWorkspaceInterface(config) {
    const { uid, workspaceIntegration, sessionPersister } = config;
    const { useProp, useFormula, doNow, exists, onDispose } = sessionPersister;
    const isCreatingWorkspace = useProp(false);
    const isJoiningWorkspace = useProp(false);
    const isLeavingWorkspace = useProp(false);
    const PendingAsJson = null;
    const NoneAsJson = 0;
    const userMetadata = doNow(() => {
        const userMetadata = useProp(PendingAsJson);
        const savedMetadata = config.directoryPersister
            .jsonFile(`${uid}.json`)
            .start(PendingAsJson);
        savedMetadata.loadedFromLocalStorage.then(() => {
            userMetadata.value = savedMetadata.data;
        });
        const disposeOnSnapshot = workspaceIntegration.onUserMetadata((newMetadata) => {
            savedMetadata.batchUpdate((data) => {
                const newMetadataValue = exists(newMetadata?.workspaceId) && exists(newMetadata?.role)
                    ? {
                        workspaceId: newMetadata.workspaceId,
                        role: newMetadata.role,
                    }
                    : NoneAsJson;
                data.value = newMetadataValue;
                userMetadata.value = newMetadataValue;
            });
        });
        onDispose(disposeOnSnapshot);
        return userMetadata;
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
            async joinWorkspace(props) {
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
        createJoinedInst(userMetadata) {
            const otherMembers = doNow(() => {
                const otherMembers = useProp([]);
                let haveStartedWatching = false;
                return {
                    get value() {
                        if (!haveStartedWatching) {
                            workspaceIntegration.watchMembers(userMetadata.workspaceId, (allMembers) => {
                                otherMembers.value = allMembers.filter((member) => {
                                    return member.uid !== uid;
                                });
                            });
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
            const roleBasedProps = useFormula(() => userMetadata.role === `owner`
                ? {
                    isOwner: true,
                    role: userMetadata.role,
                    async createWorkspaceInvite() {
                        if (userMetadata.role !== `owner`) {
                            console.error(`Attempted to create a workspace invite without permission.`);
                            return;
                        }
                        if (userMetadata.workspaceId === null) {
                            console.error(`Attempted to create a workspace invite without a workspace.`);
                            return;
                        }
                        const validForDays = 14;
                        const inviteCode = await workspaceIntegration.generateInviteCode();
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
                }).value;
            Object.keys(roleBasedProps).forEach((key) => {
                Object.defineProperty(result, key, {
                    get: () => roleBasedProps[key],
                    set: (newValue) => {
                        roleBasedProps[key] = newValue;
                    },
                });
            });
            return result;
        },
        leaving: {
            isLeaving: true,
        },
        // deleting: {
        //   isDeleting: true,
        // },
    };
    return useFormula(() => userMetadata.value === PendingAsJson
        ? WorkspaceStates.pending
        : userMetadata.value === NoneAsJson
            ? isCreatingWorkspace.value
                ? WorkspaceStates.creating
                : isJoiningWorkspace.value
                    ? WorkspaceStates.joining
                    : WorkspaceStates.none
            : isLeavingWorkspace.value
                ? WorkspaceStates.leaving
                : WorkspaceStates.createJoinedInst(userMetadata.value));
}
// SECTION: Workspace Instances
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
