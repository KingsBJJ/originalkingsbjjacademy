
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { initializeFirestore, memoryLocalCache, getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let db;

try {
  // This check prevents re-initializing the app in hot-reload scenarios
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  // Initialize Firestore with memory cache for stability, avoiding IndexedDB issues.
  // Using getFirestore() ensures we get the instance associated with the app.
  db = getFirestore(app);
  
} catch (error) {
  console.error("FIREBASE INITIALIZATION FAILED:", error);
  // We log the error but do not throw, to prevent the entire Next.js server
  // from crashing during startup. Features requiring Firebase will fail gracefully at runtime.
  app = undefined;
  db = undefined;
}


export { app, db };
