import { SignInWithApple } from "@capacitor-community/apple-sign-in";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  indexedDBLocalPersistence,
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { useProp, exists, doNow } from "miwi";
import { Cloud } from "mufasa";
import { firebasePersister } from "mufasa/firebase";
import { mfs } from "./DataModel";
import shajs from "sha.js";
import firebaseConfig from "@/assets/firebase-config.json";
import appleAuthConfig from "@/assets/apple-auth-config.json";

export const firebase = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebase);
export const firebaseStorage = getStorage(firebase);
export const firebaseAuth = Capacitor.isNativePlatform()
  ? initializeAuth(firebase, {
      persistence: indexedDBLocalPersistence,
    })
  : getAuth();
export const appleSignInLogs = useProp(``);
export async function signInWithApple() {
  try {
    await mfs.user.signInWithApple?.();
  } catch (error) {
    appleSignInLogs.value = `${appleSignInLogs.value}${JSON.stringify(
      error,
      null,
      2,
    )}\n`;
  }
}

export const cloudPersister = firebasePersister({
  firestore: firestore,
  firebaseStorage: firebaseStorage,
  firebaseFunctions: getFunctions(firebase),
  // Was helpful with Android Google Auth: https://github.com/CodetrixStudio/CapacitorGoogleAuth/issues/291
  firebaseAuth: firebaseAuth,
  signUpWithEmail: async (email, password) => {
    const credentials = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );
    sendEmailVerification(credentials.user);
    return credentials;
  },
  signInWithEmail: async (email, password) => {
    return await signInWithEmailAndPassword(firebaseAuth, email, password);
  },
  authProviders: {
    google: {
      signIn: async () => {
        const googleUser = await GoogleAuth.signIn();
        const idToken = googleUser.authentication?.idToken;
        if (!exists(idToken)) return;
        return GoogleAuthProvider.credential(idToken);
      },
      signOut: async () => {
        await GoogleAuth.signOut();
      },
    },
    apple: {
      signIn: async () => {
        try {
          appleSignInLogs.value = `Starting Apple Sign In\n`;
          const { rawNonce, hashedNonce } = doNow(() => {
            /** Pieced together from:
             * https://stackoverflow.com/a/73264281
             * https://firebase.google.com/docs/auth/ios/apple?hl=en&authuser=0&_gl=1*tky0is*_ga*MTI4MzU4MTc3Mi4xNzAzNjI2NzA5*_ga_CW55HF8NVT*MTcxMjk4MzUwOC40LjEuMTcxMjk4MzYxNi4yOS4wLjA.#sign_in_with_apple_and_authenticate_with_firebase
             * https://firebase.google.com/docs/auth/web/apple?hl=en&authuser=0&_gl=1*1wn7xm6*_ga*MTI4MzU4MTc3Mi4xNzAzNjI2NzA5*_ga_CW55HF8NVT*MTcxMzAzMjk3OC42LjAuMTcxMzAzMjk3OC42MC4wLjA.#advanced_authenticate_with_firebase_in_nodejs
             */
            const nonceChars =
              "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._";
            let rawNonce = "";
            for (let i = 0; i < 32; i++) {
              rawNonce += nonceChars.charAt(
                Math.floor(Math.random() * nonceChars.length),
              );
            }
            const hashedNonce = shajs("sha256").update(rawNonce).digest("hex");
            return { rawNonce, hashedNonce };
          });
          const response = await SignInWithApple.authorize({
            clientId: appleAuthConfig.clientId,
            redirectURI: appleAuthConfig.redirectURI,
            scopes: "email name",
            // state: "123456",
            nonce: hashedNonce,
          });
          appleSignInLogs.value = `${appleSignInLogs.value}Getting Credentials\n`;
          // See: https://firebase.google.com/docs/auth/web/apple#advanced_authenticate_with_firebase_in_nodejs
          const credentials = new OAuthProvider("apple.com").credential({
            idToken: response.response.identityToken,
            rawNonce: rawNonce,
          });
          appleSignInLogs.value = `${appleSignInLogs.value}Signing in with Apple: ${credentials.signInMethod}\n`;
          return credentials;
        } catch (error) {
          appleSignInLogs.value = `${appleSignInLogs.value}${JSON.stringify(
            error,
            null,
            2,
          )}\n`;
          return;
        }
      },
      // I don't think we need to sign out of Apple
      signOut: async () => {},
    },
  },
  async signOutFromFirebase() {
    await firebaseAuth.signOut();
  },
}) satisfies Cloud.Persister<{}>;
