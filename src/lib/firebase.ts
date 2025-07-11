
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

console.log('Firebase config:', firebaseConfig); // Log para depuração
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
console.log('Firestore db initialized:', db); // Log para depuração
console.log('Firebase Auth initialized:', auth); // Log para depuração
