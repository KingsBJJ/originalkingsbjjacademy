
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, memoryLocalCache, connectFirestoreEmulator, type Firestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let db: Firestore | null = null;

// Initialize Firebase and Firestore only if the configuration is valid.
if (firebaseConfig.projectId) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);

    try {
      db = initializeFirestore(app, {
        cache: typeof window !== 'undefined'
          ? persistentLocalCache({ tabManager: 'NONE' })
          : memoryLocalCache(),
      });
    } catch (e) {
      db = getFirestore(app);
    }
    
    // Connect to the Firestore emulator only in the development environment.
    if (process.env.NODE_ENV === 'development') {
        try {
            if (db) {
                connectFirestoreEmulator(db, '127.0.0.1', 8080);
                console.log("🔥 Connected to Firestore Emulator");
            }
        } catch (e) {
            // The emulator might already be connected, which is safe to ignore.
            // console.warn("Could not connect to Firestore emulator", e);
        }
    }
} else {
    console.error(
      "Firebase projectId is not configured. Check your environment variables and next.config.js. Firestore will not be initialized."
    );
}

export { app, db };
