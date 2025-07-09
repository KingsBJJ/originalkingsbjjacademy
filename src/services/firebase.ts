
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

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let db;

try {
  // Inicializa o Firestore com cache persistente para o navegador e em memória para o servidor.
  // Isso previne erros durante a renderização no lado do servidor (SSR).
  db = initializeFirestore(app, {
    localCache: typeof window !== 'undefined'
      ? persistentLocalCache({ tabManager: 'NONE' }) // 'NONE' evita conflitos entre abas
      : memoryLocalCache(),
  });
} catch (e) {
  // Se o Firestore já foi inicializado (ex: durante o hot-reload), pega a instância existente.
  db = getFirestore(app);
}

// Conecta ao emulador do Firestore apenas em ambiente de desenvolvimento.
if (process.env.NODE_ENV === 'development') {
    try {
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        console.log("🔥 Connected to Firestore Emulator");
    } catch (e) {
        // O emulador pode já estar conectado, o que é seguro ignorar.
        // console.warn("Could not connect to Firestore emulator", e);
    }
}


export { app, db };
