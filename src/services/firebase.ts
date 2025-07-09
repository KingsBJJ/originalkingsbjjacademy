
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyA5gI17mgL43m90iUzyWllxIznvCE_D33U",
  authDomain: "kings-bjj-training-hub.firebaseapp.com",
  projectId: "kings-bjj-training-hub",
  storageBucket: "kings-bjj-training-hub.appspot.com",
  messagingSenderId: "662081766502",
  appId: "1:662081766502:web:30c8fb4798aca5a32c59a7"
};

// Initialize Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Connect to the Firestore emulator only in the development environment.
if (process.env.NODE_ENV === 'development') {
    try {
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        console.log("🔥 Connected to Firestore Emulator");
    } catch (e: any) {
        // The emulator might already be connected, which is safe to ignore.
        // This can happen with Next.js fast refresh.
        if (e.code !== 'failed-precondition') {
             console.error("Firestore emulator connection failed:", e);
        }
    }
}

export { app, db };
