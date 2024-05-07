// See a full list of supported triggers at https://firebase.google.com/docs/functions
// Start writing functions: https://firebase.google.com/docs/functions/typescript
// Writing Callable Functions: https://firebase.google.com/docs/functions/callable?gen=2nd
// Server sending errors: https://firebase.google.com/docs/functions/callable?gen=2nd#handle_errors
// Error codes: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md
// Client catching errors: https://firebase.google.com/docs/functions/callable?gen=2nd#web-modular-api_5
import {
  onCall,
  CallableOptions,
  HttpsError,
} from "firebase-functions/v2/https";
import { Timestamp, FieldValue, Firestore } from "firebase-admin/firestore";
import { Auth } from "firebase-admin/auth";
import { v4 as uuidv4 } from "uuid";
import { log } from "firebase-functions/logger";

export function initializeMufasaFunctions({
  firestore,
  auth,
}: {
  firestore: Firestore;
  auth: Auth;
}) {
  // SECTION: Utils
  const callableOptions: CallableOptions = {
    cors: true,
    ingressSettings: "ALLOW_ALL",
  };
  function getStage(stage: string | undefined) {
    return stage ?? `Dev`;
  }
  async function setUserWorkspace(
    params: {
      uid: string;
      email: string | null;
      stage: string;
    } & (
      | {
          workspaceId: string;
          role: `member` | `owner`;
        }
      | {
          workspaceId: null;
          role?: undefined;
        }
    ),
  ) {
    log("setUserWorkspace", params);
    // We need to set CustomUserClaims first, and then let the user know they have new permission.
    await auth.setCustomUserClaims(params.uid, {
      workspaceId: params.workspaceId,
      role: params.role ?? null,
    });
    log("updated custom claims");
    await firestore
      .doc(`${getStage(params.stage)}-UserMetadata/${params.uid}`)
      .set(
        {
          uid: params.uid,
          workspaceId: params.workspaceId,
          mx_changeDate: FieldValue.serverTimestamp() as any,
          role: params.role ?? null,
          email: params.email,
        } /* satisfies UserMetadata */,
      );
    log("updated firestore");
  }

  // SECTION: Functions
  return {
    createWorkspace: onCall(callableOptions, async (request) => {
      // Validate user
      if (request.auth === undefined)
        throw new HttpsError(`unauthenticated`, "Unauthorized");
      const user = await firestore
        .doc(`${getStage(request.data.stage)}-UserMetadata/${request.auth.uid}`)
        .get();
      const userIsAlreadyInAWorkspace =
        user.exists && user.data()?.workspaceId !== null;
      if (userIsAlreadyInAWorkspace)
        throw new HttpsError(
          `already-exists`,
          "Must leave your current workspace before you can start another.",
        );

      // Start Workspace
      await setUserWorkspace({
        uid: request.auth.uid,
        workspaceId: uuidv4(),
        role: `owner`,
        email: request.auth.token.email ?? null,
        stage: request.data.stage,
      });
      return {};
    }),
    joinWorkspace: onCall(callableOptions, async (request) => {
      // Validate user
      if (request.auth === undefined)
        throw new HttpsError(`unauthenticated`, "Unauthorized");
      const user = await firestore
        .doc(`${getStage(request.data.stage)}-UserMetadata/${request.auth.uid}`)
        .get();
      const userIsAlreadyInAWorkspace =
        user.exists && typeof user.data()?.workspaceId === `string`;
      if (userIsAlreadyInAWorkspace) {
        throw new HttpsError(
          `already-exists`,
          `You must leave workspace before you can join another.: ${JSON.stringify(
            user.data(),
            null,
            2,
          )} - ${JSON.stringify(request.data, null, 2)}`,
        );
      }

      // Validate invite
      const inviteCode = (request.data.inviteCode ?? ``).trim();
      if (inviteCode === ``)
        throw new HttpsError(`invalid-argument`, "Invite code is required.");
      const inviteDocRef = (() => {
        try {
          return firestore.doc(
            `${getStage(request.data.stage)}-WorkspaceInvites/${inviteCode}`,
          );
        } catch (e) {
          throw new HttpsError(
            `invalid-argument`,
            "That invite code looks wrong.",
          );
        }
      })();
      const inviteDoc = await (async () => {
        try {
          return await inviteDocRef.get();
        } catch (e) {
          throw new HttpsError(`not-found`, "Invalid invite code.");
        }
      })();
      if (!inviteDoc.exists)
        throw new HttpsError(`not-found`, "Invalid invite code.");
      const invite = inviteDoc.data() as any; //OrgInvite;
      if (
        Date.now() / 1000 - (invite.createdAt as Timestamp).seconds >
        invite.validForDays * 24 * 60 * 60
      ) {
        await inviteDocRef.delete();
        throw new HttpsError(`deadline-exceeded`, "Invite has expired.");
      }
      // TODO: Ensure workspace exists maybe use `out-of-range` if it doesn't
      // Join workspace
      await setUserWorkspace({
        uid: request.auth.uid,
        workspaceId: invite.workspaceId,
        role: `member`,
        email: request.auth.token.email ?? null,
        stage: request.data.stage,
      });
      await inviteDocRef.delete();
      return {};
    }),
    leaveWorkspace: onCall(callableOptions, async (request) => {
      log("leaveWorkspace", request);
      if (request.auth === undefined)
        throw new HttpsError(`unauthenticated`, "Unauthorized");
      log("uid", request.auth.uid);
      await setUserWorkspace({
        uid: request.auth.uid,
        workspaceId: null,
        email: request.auth.token.email ?? null,
        stage: request.data.stage,
      });
      return {};
    }),
    // TODO: removeMember
    // TODO: deleteWorkspace
  };
}
