"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMufasaFunctions = void 0;
// See a full list of supported triggers at https://firebase.google.com/docs/functions
// Start writing functions: https://firebase.google.com/docs/functions/typescript
// Writing Callable Functions: https://firebase.google.com/docs/functions/callable?gen=2nd
// Server sending errors: https://firebase.google.com/docs/functions/callable?gen=2nd#handle_errors
// Error codes: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md
// Client catching errors: https://firebase.google.com/docs/functions/callable?gen=2nd#web-modular-api_5
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const uuid_1 = require("uuid");
const logger_1 = require("firebase-functions/logger");
function initializeMufasaFunctions({ firestore, auth, storage, }) {
    // SECTION: Utils
    const callableOptions = {
        cors: true,
        ingressSettings: "ALLOW_ALL",
        timeoutSeconds: 20 * 60,
    };
    function getStage(stage) {
        return stage !== null && stage !== void 0 ? stage : `Dev`;
    }
    async function setUserWorkspace(params) {
        var _a, _b;
        (0, logger_1.log)("setUserWorkspace", params);
        // We need to set CustomUserClaims first, and then let the user know they have new permission.
        await auth.setCustomUserClaims(params.uid, {
            workspaceId: params.workspaceId,
            role: (_a = params.role) !== null && _a !== void 0 ? _a : null,
        });
        (0, logger_1.log)("updated custom claims");
        await firestore
            .doc(`${getStage(params.stage)}-UserMetadata/${params.uid}`)
            .set({
            uid: params.uid,
            workspaceId: params.workspaceId,
            mx_changeDate: firestore_1.FieldValue.serverTimestamp(),
            role: (_b = params.role) !== null && _b !== void 0 ? _b : null,
            email: params.email,
        } /* satisfies UserMetadata */);
        (0, logger_1.log)("updated firestore");
    }
    // SECTION: Functions
    return {
        createWorkspace: (0, https_1.onCall)(callableOptions, async (request) => {
            var _a, _b;
            // Validate user
            if (request.auth === undefined)
                throw new https_1.HttpsError(`unauthenticated`, "Unauthorized");
            const user = await firestore
                .doc(`${getStage(request.data.stage)}-UserMetadata/${request.auth.uid}`)
                .get();
            const userIsAlreadyInAWorkspace = user.exists && ((_a = user.data()) === null || _a === void 0 ? void 0 : _a.workspaceId) !== null;
            if (userIsAlreadyInAWorkspace)
                throw new https_1.HttpsError(`already-exists`, "Must leave your current workspace before you can start another.");
            // Start Workspace
            await setUserWorkspace({
                uid: request.auth.uid,
                workspaceId: (0, uuid_1.v4)(),
                role: `owner`,
                email: (_b = request.auth.token.email) !== null && _b !== void 0 ? _b : null,
                stage: request.data.stage,
            });
            return {};
        }),
        joinWorkspace: (0, https_1.onCall)(callableOptions, async (request) => {
            var _a, _b, _c;
            // Validate user
            if (request.auth === undefined)
                throw new https_1.HttpsError(`unauthenticated`, "Unauthorized");
            const user = await firestore
                .doc(`${getStage(request.data.stage)}-UserMetadata/${request.auth.uid}`)
                .get();
            const userIsAlreadyInAWorkspace = user.exists && typeof ((_a = user.data()) === null || _a === void 0 ? void 0 : _a.workspaceId) === `string`;
            if (userIsAlreadyInAWorkspace) {
                throw new https_1.HttpsError(`already-exists`, `You must leave workspace before you can join another.: ${JSON.stringify(user.data(), null, 2)} - ${JSON.stringify(request.data, null, 2)}`);
            }
            // Validate invite
            const inviteCode = ((_b = request.data.inviteCode) !== null && _b !== void 0 ? _b : ``).trim();
            if (inviteCode === ``)
                throw new https_1.HttpsError(`invalid-argument`, "Invite code is required.");
            const inviteDocRef = (() => {
                try {
                    return firestore.doc(`${getStage(request.data.stage)}-WorkspaceInvites/${inviteCode}`);
                }
                catch (e) {
                    throw new https_1.HttpsError(`invalid-argument`, "That invite code looks wrong.");
                }
            })();
            const inviteDoc = await (async () => {
                try {
                    return await inviteDocRef.get();
                }
                catch (e) {
                    throw new https_1.HttpsError(`not-found`, "Invalid invite code.");
                }
            })();
            if (!inviteDoc.exists)
                throw new https_1.HttpsError(`not-found`, "Invalid invite code.");
            const invite = inviteDoc.data(); //OrgInvite;
            if (Date.now() / 1000 - invite.createdAt.seconds >
                invite.validForDays * 24 * 60 * 60) {
                await inviteDocRef.delete();
                throw new https_1.HttpsError(`deadline-exceeded`, "Invite has expired.");
            }
            // TODO: Ensure workspace exists maybe use `out-of-range` if it doesn't
            // Join workspace
            await setUserWorkspace({
                uid: request.auth.uid,
                workspaceId: invite.workspaceId,
                role: `member`,
                email: (_c = request.auth.token.email) !== null && _c !== void 0 ? _c : null,
                stage: request.data.stage,
            });
            await inviteDocRef.delete();
            return {};
        }),
        leaveWorkspace: (0, https_1.onCall)(callableOptions, async (request) => {
            var _a;
            (0, logger_1.log)("leaveWorkspace", request);
            if (request.auth === undefined)
                throw new https_1.HttpsError(`unauthenticated`, "Unauthorized");
            (0, logger_1.log)("uid", request.auth.uid);
            await setUserWorkspace({
                uid: request.auth.uid,
                workspaceId: null,
                email: (_a = request.auth.token.email) !== null && _a !== void 0 ? _a : null,
                stage: request.data.stage,
            });
            return {};
        }),
        removeMember: (0, https_1.onCall)(callableOptions, async (request) => {
            var _a, _b, _c;
            (0, logger_1.log)("removeMember", request);
            if (request.auth === undefined)
                throw new https_1.HttpsError(`unauthenticated`, "Unauthorized");
            (0, logger_1.log)("uid", request.auth.uid);
            if (request.auth.token.role !== `owner`)
                throw new https_1.HttpsError(`permission-denied`, "Only the owner can remove members.");
            if (typeof request.data.uid !== `string`)
                throw new https_1.HttpsError(`invalid-argument`, "uid is required.");
            const userDoc = await firestore
                .doc(`${getStage(request.data.stage)}-UserMetadata/${request.data.uid}`)
                .get();
            if (!userDoc.exists)
                throw new https_1.HttpsError(`not-found`, "User not found.");
            if (((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.workspaceId) !== request.auth.token.workspaceId)
                throw new https_1.HttpsError(`not-found`, "User not in workspace.");
            await setUserWorkspace({
                uid: request.data.uid,
                workspaceId: null,
                email: (_c = (_b = userDoc.data()) === null || _b === void 0 ? void 0 : _b.email) !== null && _c !== void 0 ? _c : null,
                stage: request.data.stage,
            });
            return {};
        }),
        deleteWorkspace: (0, https_1.onCall)(callableOptions, async (request) => {
            if (request.auth === undefined)
                throw new https_1.HttpsError(`unauthenticated`, "Unauthorized");
            if (request.auth.token.workspaceId === null)
                throw new https_1.HttpsError(`not-found`, "You are not in a workspace to delete.");
            if (request.auth.token.role !== `owner`)
                throw new https_1.HttpsError(`permission-denied`, "Only the owner can delete the workspace.");
            await deleteWorkspace({
                stage: request.data.stage,
                workspaceId: request.auth.token.workspaceId,
                storage,
                firestore,
            });
            return {};
        }),
        deleteAccount: (0, https_1.onCall)(callableOptions, async (request) => {
            if (request.auth === undefined)
                throw new https_1.HttpsError(`unauthenticated`, "Unauthorized");
            const workspaceToDelete = request.auth.token.workspaceId !== null &&
                request.auth.token.role === `owner`
                ? request.auth.token.workspaceId
                : null;
            // Delete user
            await auth.deleteUser(request.auth.uid);
            await firestore
                .doc(`${getStage(request.data.stage)}-UserMetadata/${request.auth.uid}`)
                .delete()
                .catch((e) => {
                (0, logger_1.log)(e);
            });
            // Delete workspace
            if (workspaceToDelete !== null) {
                await deleteWorkspace({
                    stage: request.data.stage,
                    workspaceId: workspaceToDelete,
                    storage,
                    firestore,
                });
            }
        }),
    };
    async function deleteWorkspace(props) {
        (0, logger_1.log)("deleting", props.workspaceId);
        // TODO: If there is a subscription, email the owner a link to cancel the subscription.
        // Get all members
        const members = await props.firestore
            .collection(`${props.stage}-UserMetadata`)
            .where("workspaceId", "==", props.workspaceId)
            .get();
        // Remove all members
        await Promise.all(members.docs.map(async (member) => {
            var _a;
            await setUserWorkspace({
                uid: member.id,
                workspaceId: null,
                email: (_a = member.data().email) !== null && _a !== void 0 ? _a : null,
                stage: props.stage,
            });
        }));
        await firestore
            .doc(`${getStage(props.stage)}-Workspaces/${props.workspaceId}`)
            .delete();
        const files = await storage.bucket().getFiles({
            prefix: `/Prod-Workspace-Files/${props.workspaceId}/`,
        });
        files[0].forEach((file) => {
            (0, logger_1.log)(`deleting ${file.name}`);
        });
        await storage
            .bucket()
            .deleteFiles({
            prefix: `/Prod-Workspace-Files/${props.workspaceId}/`,
        })
            .catch((e) => {
            (0, logger_1.log)(e);
        });
        (0, logger_1.log)(`Finished deleting workspace ${props.workspaceId}`);
    }
}
exports.initializeMufasaFunctions = initializeMufasaFunctions;
//# sourceMappingURL=FirebaseFunctions.js.map