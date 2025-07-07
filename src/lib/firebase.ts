
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// As credenciais do Firebase são configuradas no ambiente de hospedagem.
// Não é necessário preencher estes valores manualmente.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firestore DB initialized:", db);

// Habilita a persistência offline para garantir que os dados não sejam perdidos.
try {
    enableIndexedDbPersistence(db)
} catch (error: any) {
    if (error.code == 'failed-precondition') {
        // Múltiplas abas abertas, a persistência só pode ser ativada em uma.
        // Isso é um comportamento esperado e não um erro crítico.
    } else if (error.code == 'unimplemented') {
        // O navegador não suporta todas as funcionalidades necessárias para a persistência.
    }
}

export { app, db };
