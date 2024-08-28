import { isValid } from "./Utils.js";
export function initializeAuth(config) {
    const { useProp, useFormula, doNow, onDispose, useRoot } = config.sessionPersister;
    // SECTION: User
    return doNow(() => {
        const { cloudAuth, uid, email, emailVerified } = doNow(() => {
            const _userInfo = useProp(undefined);
            return useRoot(() => ({
                cloudAuth: config.getCloudAuth({
                    onAuthStateChanged: (user) => {
                        if (user === null && _userInfo.value === user)
                            return;
                        if (_userInfo.value !== undefined &&
                            _userInfo.value?.uid === user?.uid &&
                            _userInfo.value?.email === user?.email &&
                            _userInfo.value?.emailVerified === user?.emailVerified)
                            return;
                        _userInfo.value = user;
                    },
                    stage: config.stage,
                }),
                uid: useFormula(() => isValid(_userInfo.value) ? _userInfo.value.uid : _userInfo.value),
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
        return useRoot(() => useFormula(() => uid.value === undefined
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
                    })));
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
    const isDeletingWorkspace = useProp(false);
    console.log(`createWorkspaceInterface(${JSON.stringify(config, null, 2)})`);
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
        const disposeOnSnapshot = workspaceIntegration.onUserMetadata(async (newMetadata) => {
            // Wait for userMetadata to get set up.
            await savedMetadata.loadedFromLocalStorage;
            console.log(`workspaceIntegration.onUserMetadata called!`);
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
            get isCreating() {
                return isCreatingWorkspace.value;
            },
            get isJoining() {
                return isJoiningWorkspace.value;
            },
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
                    async removeMember(params) {
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
        // deleting: {
        //   isDeleting: true,
        // },
    };
    return useFormula(() => userMetadata.value === PendingAsJson
        ? WorkspaceStates.pending
        : userMetadata.value === NoneAsJson
            ? WorkspaceStates.none
            : WorkspaceStates.createJoinedInst(userMetadata.value /**, onCleanup */));
}
