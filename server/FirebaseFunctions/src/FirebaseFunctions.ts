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
import { Storage } from "firebase-admin/storage";
import { Auth } from "firebase-admin/auth";
import { v4 as uuidv4 } from "uuid";
import { log } from "firebase-functions/logger";

export function initializeMufasaFunctions({
  firestore,
  auth,
  storage,
}: {
  firestore: Firestore;
  auth: Auth;
  storage: Storage;
}) {
  // SECTION: Utils
  const callableOptions: CallableOptions = {
    cors: true,
    ingressSettings: "ALLOW_ALL",
    timeoutSeconds: 20 * 60,
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
    // We need to set CustomUserClaims first, and then let the user know they have new permission.
    await auth.setCustomUserClaims(params.uid, {
      workspaceId: params.workspaceId,
      role: params.role ?? null,
    });
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
      if (request.auth === undefined)
        throw new HttpsError(`unauthenticated`, "Unauthorized");
      await setUserWorkspace({
        uid: request.auth.uid,
        workspaceId: null,
        email: request.auth.token.email ?? null,
        stage: request.data.stage,
      });
      return {};
    }),
    removeMember: onCall(callableOptions, async (request) => {
      if (request.auth === undefined)
        throw new HttpsError(`unauthenticated`, "Unauthorized");
      if (request.auth.token.role !== `owner`)
        throw new HttpsError(
          `permission-denied`,
          "Only the owner can remove members.",
        );
      if (typeof request.data.uid !== `string`)
        throw new HttpsError(`invalid-argument`, "uid is required.");
      const userDoc = await firestore
        .doc(`${getStage(request.data.stage)}-UserMetadata/${request.data.uid}`)
        .get();
      if (!userDoc.exists) throw new HttpsError(`not-found`, "User not found.");
      if (userDoc.data()?.workspaceId !== request.auth.token.workspaceId)
        throw new HttpsError(`not-found`, "User not in workspace.");
      await setUserWorkspace({
        uid: request.data.uid,
        workspaceId: null,
        email: userDoc.data()?.email ?? null,
        stage: request.data.stage,
      });
      return {};
    }),
    deleteWorkspace: onCall(callableOptions, async (request) => {
      if (request.auth === undefined)
        throw new HttpsError(`unauthenticated`, "Unauthorized");
      if (request.auth.token.workspaceId === null)
        throw new HttpsError(
          `not-found`,
          "You are not in a workspace to delete.",
        );
      if (request.auth.token.role !== `owner`)
        throw new HttpsError(
          `permission-denied`,
          "Only the owner can delete the workspace.",
        );
      await deleteWorkspace({
        stage: request.data.stage,
        workspaceId: request.auth.token.workspaceId,
        storage,
        firestore,
      });
      return {};
    }),
    deleteAccount: onCall(callableOptions, async (request) => {
      if (request.auth === undefined)
        throw new HttpsError(`unauthenticated`, "Unauthorized");
      const workspaceToDelete =
        request.auth.token.workspaceId !== null &&
        request.auth.token.role === `owner`
          ? request.auth.token.workspaceId
          : null;

      // Delete user
      await auth.deleteUser(request.auth.uid);
      await firestore
        .doc(`${getStage(request.data.stage)}-UserMetadata/${request.auth.uid}`)
        .delete()
        .catch((e) => {
          log(e);
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

  async function deleteWorkspace(props: {
    stage: string;
    workspaceId: string;
    storage: Storage;
    firestore: Firestore;
  }) {
    log("deleting", props.workspaceId);
    // TODO: If there is a subscription, email the owner a link to cancel the subscription.
    // Get all members
    const members = await props.firestore
      .collection(`${props.stage}-UserMetadata`)
      .where("workspaceId", "==", props.workspaceId)
      .get();
    // Remove all members
    await Promise.all(
      members.docs.map(async (member) => {
        await setUserWorkspace({
          uid: member.id,
          workspaceId: null,
          email: member.data().email ?? null,
          stage: props.stage,
        });
      }),
    );
    const workspaceDocRef = props.firestore.doc(
      `${props.stage}-Workspaces/${props.workspaceId}`,
    );
    // Delete all sub-collections
    await workspaceDocRef.listCollections().then(async (collections) => {
      collections.forEach(async (collection) => {
        while (true) {
          const snapshot = await collection.limit(500).get();
          if (snapshot.size === 0) return;
          const batch = firestore.batch();
          snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
        }
      });
    });
    await firestore
      .doc(`${getStage(props.stage)}-Workspaces/${props.workspaceId}`)
      .delete();
    // Delete all files
    await storage
      .bucket()
      .deleteFiles({
        prefix: `Prod-Workspace-Files/${props.workspaceId}`,
      })
      .catch((e) => {
        log(e);
      });
  }
}
