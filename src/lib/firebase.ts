
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyA5gI17mgL43m90iUzyWllxIznvCE_D33U",
  authDomain: "kings-bjj-training-hub.firebaseapp.com",
  projectId: "kings-bjj-training-hub",
  storageBucket: "kings-bjj-training-hub.appspot.com",
  messagingSenderId: "662081766502",
  appId: "1:662081766502:web:30c8fb4798aca5a32c59a7"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
