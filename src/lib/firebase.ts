
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { 
    initializeFirestore, 
    persistentLocalCache, 
    persistentMultipleTabManager 
} from "firebase/firestore";

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
  // Check if the essential config is loaded. If not, the app is unusable.
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
    console.error("FATAL: Firebase configuration is missing or incomplete.");
    console.error("This is likely because the FIREBASE_WEBAPP_CONFIG environment variable is not set or is invalid.");
    // We return nulls here to be handled by consuming code.
    // The app is in an unrecoverable state.
    return { app: null, db: null };
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  
  let db = null;
  try {
    // Use the modern initializeFirestore with persistent cache settings
    // This replaces the deprecated enableIndexedDbPersistence call
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });
  } catch(e) {
    console.error("Error initializing Firestore:", e);
  }
  
  return { app, db };
}

const { app, db } = initializeFirebase();

export { app, db };
