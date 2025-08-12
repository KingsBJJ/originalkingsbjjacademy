// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Importando o Storage
// As variáveis de ambiente NEXT_PUBLIC_* são injetadas diretamente pelo Next.js no processo do navegador.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyA5gI17mgL43m90iUzyWllxIznvCE_D33U",
  authDomain: "kings-bjj-training-hub.firebaseapp.com",
  projectId: "kings-bjj-training-hub",
  storageBucket: "kings-bjj-training-hub.firebasestorage.app",
  messagingSenderId: "662081766502",
  appId: "1:662081766502:web:30c8fb4798aca5a32c59a7"
};

// Adiciona uma verificação para garantir que a chave da API está presente.
if (!firebaseConfig.apiKey) {
    console.error('Firebase API Key is missing. Please check your environment variables in .env file.');
}

// Inicializa o Firebase de forma segura, evitando reinicializações.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa o Firestore, Auth e Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Inicializando o Storage

export { db, auth, storage, app }; // Exportando o Storage também
