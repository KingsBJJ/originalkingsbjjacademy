
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This function provides a single point of failure and clear error messaging.
function initializeFirebase() {
  // Check if the essential config is loaded.
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
    console.error("FATAL: Firebase configuration is missing or incomplete. Data will not load.");
    return { app: null, db: null };
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  
  // Using initializeFirestore with bare minimum config to ensure stability
  // This avoids multi-tab persistence which might be causing issues in some environments.
  const db = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  });
  
  return { app, db };
}

const { app, db } = initializeFirebase();

export { app, db };
