import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  getIdToken,
  linkWithCredential,
  signInWithPopup,
  signOut,
  type AuthError,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

const facebookProvider = new FacebookAuthProvider();

facebookProvider.setCustomParameters({
  display: "popup",
});

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithFacebookPopup = async () => {
  try {
    return await signInWithPopup(auth, facebookProvider);
  } catch (error) {
    const authError = error as AuthError;

    if (authError.code !== "auth/account-exists-with-different-credential") {
      throw error;
    }

    const facebookCredential =
      FacebookAuthProvider.credentialFromError(authError);

    if (!facebookCredential) {
      throw new Error("Unable to retrieve Facebook credential");
    }

    const email = authError.customData?.email;

    if (typeof email !== "string") {
      throw new Error("Unable to determine the existing Firebase account");
    }

    const googleResult = await signInWithPopup(auth, googleProvider);

    await linkWithCredential(googleResult.user, facebookCredential);

    return googleResult;
  }
};

export const getFirebaseIdToken = async (user: User): Promise<string> => {
  return getIdToken(user, true);
};

export const signOutFirebase = () => signOut(auth);
