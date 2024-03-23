"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMufasaFunctions = void 0;
// See a full list of supported triggers at https://firebase.google.com/docs/functions
// Start writing functions: https://firebase.google.com/docs/functions/typescript
// Writing Callable Functions: https://firebase.google.com/docs/functions/callable?gen=2nd
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const uuid_1 = require("uuid");
const logger_1 = require("firebase-functions/logger");
function initializeMufasaFunctions({ firestore, auth, }) {
    // SECTION: Utils
    const callableOptions = {
        cors: true,
        ingressSettings: "ALLOW_ALL",
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
            var _a, _b, _c;
            // Validate user
            if (request.auth === undefined)
                throw new Error("Unauthorized");
            const user = await firestore
                .doc(`${getStage(request.data.stage)}-UserMetadata/${request.auth.uid}`)
                .get();
            const userIsAlreadyInAWorkspace = user.exists && ((_a = user.data()) === null || _a === void 0 ? void 0 : _a.workspaceId) !== null;
            if (userIsAlreadyInAWorkspace)
                throw new Error("Must leave your current workspace before you can start another.");
            // Start Workspace
            await setUserWorkspace({
                uid: request.auth.uid,
                workspaceId: request.auth.token.email !== undefined &&
                    [
                        `peter@axiomhoist.com`,
                        `peterhotrum@axiomhoist.com`,
                        `melchiahmauck@gmail.com`,
                    ].includes((_b = request.auth.token.email) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase())
                    ? `axiom-hoist`
                    : (0, uuid_1.v4)(),
                role: `owner`,
                email: (_c = request.auth.token.email) !== null && _c !== void 0 ? _c : null,
                stage: request.data.stage,
            });
            return {};
        }),
        joinWorkspace: (0, https_1.onCall)(callableOptions, async (request) => {
            var _a, _b;
            // Validate user
            if (request.auth === undefined)
                throw new Error("Unauthorized");
            const user = await firestore
                .doc(`${getStage(request.data.stage)}-UserMetadata/${request.auth.uid}`)
                .get();
            const userIsAlreadyInAWorkspace = user.exists && typeof ((_a = user.data()) === null || _a === void 0 ? void 0 : _a.workspaceId) === `string`;
            if (userIsAlreadyInAWorkspace) {
                throw new Error(`You must leave workspace before you can join another.: ${JSON.stringify(user.data(), null, 2)} - ${JSON.stringify(request.data, null, 2)}`);
            }
            // Validate invite
            const inviteDocRef = firestore.doc(`${getStage(request.data.stage)}-WorkspaceInvites/${request.data.inviteCode.trim()}`);
            const inviteDoc = await inviteDocRef.get();
            if (!inviteDoc.exists)
                throw new Error("Invalid invite code.");
            const invite = inviteDoc.data(); //OrgInvite;
            if (Date.now() / 1000 - invite.createdAt.seconds >
                invite.validForDays * 24 * 60 * 60) {
                await inviteDocRef.delete();
                throw new Error("Invite has expired.");
            }
            // Join workspace
            await setUserWorkspace({
                uid: request.auth.uid,
                workspaceId: invite.workspaceId,
                role: `member`,
                email: (_b = request.auth.token.email) !== null && _b !== void 0 ? _b : null,
                stage: request.data.stage,
            });
            await inviteDocRef.delete();
            return {};
        }),
        leaveWorkspace: (0, https_1.onCall)(callableOptions, async (request) => {
            var _a;
            (0, logger_1.log)("leaveWorkspace", request);
            if (request.auth === undefined)
                throw new Error("Unauthorized");
            (0, logger_1.log)("uid", request.auth.uid);
            await setUserWorkspace({
                uid: request.auth.uid,
                workspaceId: null,
                email: (_a = request.auth.token.email) !== null && _a !== void 0 ? _a : null,
                stage: request.data.stage,
            });
            return {};
        }),
        // TODO: deleteWorkspace
    };
}
exports.initializeMufasaFunctions = initializeMufasaFunctions;
//# sourceMappingURL=FirebaseFunctions.js.map