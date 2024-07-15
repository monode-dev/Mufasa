// See a full list of supported triggers at https://firebase.google.com/docs/functions
// Start writing functions: https://firebase.google.com/docs/functions/typescript
// Writing Callable Functions: https://firebase.google.com/docs/functions/callable?gen=2nd
import { initializeApp as initializeFirebase } from "firebase-admin/app";
import { initializeFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { initializeMufasaFunctions } from "@mufasa-orm/firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { log } from "firebase-functions/logger";
import { getStorage } from "firebase-admin/storage";

const firebase = initializeFirebase({
  storageBucket: `ninety-percent.appspot.com`,
});
const firestore = initializeFirestore(firebase, {
  preferRest: true,
});
const auth = getAuth();
const storage = getStorage(firebase);

// SECTION: Mufasa Functions
export const {
  createWorkspace,
  joinWorkspace,
  leaveWorkspace,
  removeMember,
  deleteWorkspace,
  deleteAccount,
} = initializeMufasaFunctions({
  firestore,
  auth,
  storage,
});

// type CustomClaims = {
//   role: `owner` | `member`;
//   workspaceId: string;
//   workspaceEntitlements: Set<string>;
// };
// https://handlerevenuecatnotification-d5ftfn3a4a-uc.a.run.app
export const handleRevenueCatNotification = onRequest(
  // TODO: Maybe lock cors to only RevenueCat servers
  { cors: true },
  async (request, response) => {
    log(`Received RevenueCat request ${JSON.stringify(request.body, null, 2)}`);
    const authToken = request.headers.authorization?.split(" ")[1];
    if (!authToken || authToken !== process.env.REV_CAT_AUTH) {
      response.status(401).send();
      log(`Unauthorized RevenueCat request`);
      return;
    }

    // Get all user metadata from workspace
    const workspacesToUpgrade = new Set<string>();
    const workspacesToDowngrade = new Set<string>();
    if (request.body.event.type === `INITIAL_PURCHASE`) {
      workspacesToUpgrade.add(request.body.event.app_user_id);
    } else if (request.body.event.type === `RENEWAL`) {
      workspacesToUpgrade.add(request.body.event.app_user_id);
    } else if (request.body.event.type === `EXPIRATION`) {
      workspacesToDowngrade.add(request.body.event.app_user_id);
    } else if (request.body.event.type === `TRANSFER`) {
      workspacesToUpgrade.add(
        request.body.event.transferred_from.filter(
          (id: string) => !id.startsWith(`$RCAnonymousID:`),
        )[0],
      );
      workspacesToDowngrade.add(
        request.body.event.transferred_to.filter(
          (id: string) => !id.startsWith(`$RCAnonymousID:`),
        )[0],
      );
    } else {
      log(`Skipping because event type = ${request.body.event.type}`);
      return;
    }
    await Promise.all([
      ...Array.from(workspacesToUpgrade).map((workspaceId) =>
        updateWorkspaceEntitlements(workspaceId, [`pro`]),
      ),
      ...Array.from(workspacesToDowngrade).map((workspaceId) =>
        updateWorkspaceEntitlements(workspaceId, []),
      ),
    ]);
    /* We must return at the end otherwise the function runs super slow.
     * See https://stackoverflow.com/a/67472607 */
    response.status(200).send();
    async function updateWorkspaceEntitlements(
      workspaceId: string,
      entitlements: string[],
    ) {
      await firestore.doc(`Prod-Workspaces/${workspaceId}`).set(
        {
          entitlements: entitlements,
        },
        { merge: true },
      );
    }
  },
);
