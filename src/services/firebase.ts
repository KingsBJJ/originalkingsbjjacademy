
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, memoryLocalCache, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This check prevents invalid path errors by ensuring the config is loaded.
if (!firebaseConfig.projectId) {
  console.error(
    "Firebase projectId is not configured. Check your environment variables and next.config.js. Firestore will not be initialized."
  );
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let db;

try {
  // Initialize Firestore with modern cache settings.
  // This prevents errors during Server-Side Rendering (SSR).
  db = initializeFirestore(app, {
    cache: typeof window !== 'undefined'
      ? persistentLocalCache({ tabManager: 'NONE' }) // Use IndexedDB for browsers
      : memoryLocalCache(), // Use in-memory cache for the server
  });
} catch (e) {
  // If Firestore has already been initialized (e.g., during hot-reloading), get the existing instance.
  db = getFirestore(app);
}

// Connect to the Firestore emulator only in the development environment.
if (process.env.NODE_ENV === 'development') {
    try {
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        console.log("🔥 Connected to Firestore Emulator");
    } catch (e) {
        // The emulator might already be connected, which is safe to ignore.
        // console.warn("Could not connect to Firestore emulator", e);
    }
}


export { app, db };
