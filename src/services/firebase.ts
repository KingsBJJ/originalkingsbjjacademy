
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, memoryLocalCache, connectFirestoreEmulator, type Firestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyA5gI17mgL43m90iUzyWllxIznvCE_D33U",
  authDomain: "kings-bjj-training-hub.firebaseapp.com",
  projectId: "kings-bjj-training-hub",
  storageBucket: "kings-bjj-training-hub.appspot.com",
  messagingSenderId: "662081766502",
  appId: "1:662081766502:web:30c8fb4798aca5a32c59a7"
};

let app;
let db: Firestore | null = null;

// Initialize Firebase and Firestore.
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
    }
}

export { app, db };
