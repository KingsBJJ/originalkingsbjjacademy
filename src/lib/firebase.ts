import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulators in development mode.
if (process.env.NODE_ENV === 'development') {
    try {
        // This connects the SDK to the local Firestore emulator.
        // The try/catch prevents errors during Next.js hot-reloads.
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
    } catch (e) {
        // This can happen on hot-reloads, so we can safely ignore it.
    }
}

// Enable offline persistence on the client-side.
// This check ensures the code only runs in the browser.
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch((error) => {
        if (error.code == 'failed-precondition') {
            // This happens if multiple tabs are open. Persistence can only be enabled in one.
            // It's a normal occurrence and not a critical error.
        } else if (error.code == 'unimplemented') {
            // The browser doesn't support all features for persistence.
        }
    });
}

export { app, db };
