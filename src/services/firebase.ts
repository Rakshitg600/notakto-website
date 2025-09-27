import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
// Using environment variables for Firebase configuration with fallback for build environments
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAFRKoQm30ekwQQOeunqB3X6D26wOP8huk",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "notakto-3359b.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "notakto-3359b",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "notakto-3359b.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "467221757682",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:467221757682:web:9d896324f25e6dce03da6b",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MLBPJWB1C2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In error:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const onAuthStateChangedListener = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
