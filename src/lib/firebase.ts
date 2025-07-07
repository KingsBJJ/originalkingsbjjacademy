
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Valida se as chaves essenciais da configuração do Firebase estão presentes.
// Se não estiverem, o app irá falhar com uma mensagem clara, em vez de quebrar silenciosamente.
const requiredConfigKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
    // Este erro é INTENCIONAL. Ele para a execução se o Firebase não estiver configurado.
    throw new Error(`CONFIGURAÇÃO DO FIREBASE INCOMPLETA. Chaves faltando: ${missingKeys.join(', ')}. Verifique as variáveis de ambiente.`);
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa o Firestore com cache em memória e força o long-polling para
// garantir uma conexão mais estável em ambientes de rede restritivos.
const db = initializeFirestore(app, {
    localCache: memoryLocalCache(),
    experimentalForceLongPolling: true,
});

export { app, db };
