import { isValid } from "./Utils.js";
export function initializeAuth(config) {
    const { useProp, useFormula, doNow, exists, onDispose } = config.sessionPersister;
    // SECTION: User
    return doNow(() => {
        const { cloudAuth, uid, email, emailVerified } = doNow(() => {
            const _userInfo = useProp(undefined);
            return {
                cloudAuth: config.getCloudAuth({
                    onAuthStateChanged: (user) => (_userInfo.value = user),
                    stage: config.stage,
                }),
                uid: useFormula(() => isValid(_userInfo.value) ? _userInfo.value.uid : _userInfo.value),
                email: useFormula(() => _userInfo.value?.email ?? null),
                emailVerified: useFormula(() => _userInfo.value?.emailVerified ?? false),
            };
        });
        const isSigningIn = useProp(false);
        const isSigningOut = useProp(false);
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
                };
                // TODO: Force these to be single threaded.
                Object.keys(cloudAuth.signInFuncs).forEach((key) => {
                    signedOut[key] = async (...args) => {
                        let error = null;
                        isSigningIn.value = true;
                        let result = undefined;
                        try {
                            result = await cloudAuth.signInFuncs[key](...args);
                        }
                        catch (e) {
                            error = e;
                        }
                        isSigningIn.value = false;
                        if (isValid(error))
                            throw error;
                        return result;
                    };
                });
                return signedOut;
            }),
            createSignedInButNotVerifiedInst: (userInfo) => ({
                isSignedInButNotVerified: true,
                get uid() {
                    return userInfo.uid;
                },
                get email() {
                    return userInfo.email;
                },
                signOut,
            }),
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
                    get isSigningOut() {
                        return isSigningOut.value;
                    },
                    signOut,
                };
            },
        };
        return useFormula(() => uid.value === undefined
            ? UserStates.pending
            : uid.value === null
                ? UserStates.signedOut
                : emailVerified.value
                    ? UserStates.createSignedInInst({
                        uid: uid.value,
                        email: email.value,
                        emailVerified: emailVerified.value,
                    }, onDispose)
                    : UserStates.createSignedInButNotVerifiedInst({
                        uid: uid.value,
                        email: email.value,
                        emailVerified: emailVerified.value,
                    }));
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
            .load(PendingAsJson);
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
                let error = null;
                try {
                    await workspaceIntegration.createWorkspace({
                        stage: config.stage,
                    });
                }
                catch (e) {
                    error = e;
                }
                isCreatingWorkspace.value = false;
                if (error !== null)
                    throw error;
            },
            async joinWorkspace(props) {
                isJoiningWorkspace.value = true;
                let error = null;
                try {
                    await workspaceIntegration.joinWorkspace({
                        inviteCode: props.inviteCode,
                        stage: config.stage,
                    });
                }
                catch (e) {
                    error = e;
                }
                isJoiningWorkspace.value = false;
                if (error !== null)
                    throw error;
            },
        },
        creating: {
            isCreating: true,
        },
        joining: {
            isJoining: true,
        },
        createJoinedInst(userMetadata) {
            const entitlements = doNow(() => {
                const entitlements = useProp([]);
                let haveStartedWatching = false;
                return {
                    get value() {
                        if (!haveStartedWatching) {
                            workspaceIntegration.watchEntitlements(userMetadata.workspaceId, (allEntitlements) => {
                                entitlements.value = allEntitlements;
                            });
                            haveStartedWatching = true;
                        }
                        return entitlements.value;
                    },
                };
            });
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
                get workspaceEntitlements() {
                    return entitlements.value;
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
                : WorkspaceStates.createJoinedInst(userMetadata.value /**, onCleanup */));
}
