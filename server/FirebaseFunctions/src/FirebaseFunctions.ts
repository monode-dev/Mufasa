// See a full list of supported triggers at https://firebase.google.com/docs/functions
// Start writing functions: https://firebase.google.com/docs/functions/typescript
// Writing Callable Functions: https://firebase.google.com/docs/functions/callable?gen=2nd
import { onCall, CallableOptions } from "firebase-functions/v2/https";
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
      if (request.auth === undefined) throw new Error("Unauthorized");
      const user = await firestore
        .doc(`${getStage(request.data.stage)}-UserMetadata/${request.auth.uid}`)
        .get();
      const userIsAlreadyInAWorkspace =
        user.exists && user.data()?.workspaceId !== null;
      if (userIsAlreadyInAWorkspace)
        throw new Error(
          "Must leave your current workspace before you can start another.",
        );

      // Start Workspace
      await setUserWorkspace({
        uid: request.auth.uid,
        workspaceId:
          request.auth.token.email !== undefined &&
          [
            `peter@axiomhoist.com`,
            `peterhotrum@axiomhoist.com`,
            `melchiahmauck@gmail.com`,
          ].includes(request.auth.token.email?.trim().toLowerCase())
            ? `axiom-hoist`
            : uuidv4(),
        role: `owner`,
        email: request.auth.token.email ?? null,
        stage: request.data.stage,
      });
      return {};
    }),
    joinWorkspace: onCall(callableOptions, async (request) => {
      // Validate user
      if (request.auth === undefined) throw new Error("Unauthorized");
      const user = await firestore
        .doc(`${getStage(request.data.stage)}-UserMetadata/${request.auth.uid}`)
        .get();
      const userIsAlreadyInOrg = user.exists && user.data()?.orgId !== null;
      if (userIsAlreadyInOrg)
        throw new Error("Must leave workspace before you can join another.");

      // Validate invite
      const inviteDocRef = firestore.doc(
        `${getStage(
          request.data.stage,
        )}-WorkspaceInvites/${request.data.inviteCode.trim()}`,
      );
      const inviteDoc = await inviteDocRef.get();
      if (!inviteDoc.exists) throw new Error("Invalid invite code.");
      const invite = inviteDoc.data() as any; //OrgInvite;
      if (
        Date.now() / 1000 - (invite.createdAt as Timestamp).seconds >
        invite.validForDays * 24 * 60 * 60
      ) {
        await inviteDocRef.delete();
        throw new Error("Invite has expired.");
      }
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
      if (request.auth === undefined) throw new Error("Unauthorized");
      log("uid", request.auth.uid);
      await setUserWorkspace({
        uid: request.auth.uid,
        workspaceId: null,
        email: request.auth.token.email ?? null,
        stage: request.data.stage,
      });
      return {};
    }),
    // TODO: deleteWorkspace
  };
}
