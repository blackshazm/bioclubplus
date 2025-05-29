import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
// import { getAnalytics } from "firebase/analytics"; // Opcional

// Configuração do Firebase a partir das variáveis de ambiente VITE_
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Opcional
};

// Inicializar o Firebase
// Verifica se já existe uma instância para evitar erros de re-inicialização (importante para HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app); // Firestore Database
const messaging = getMessaging(app);
// const analytics = getAnalytics(app); // Opcional

// É uma boa prática verificar se as variáveis de ambiente foram carregadas
if (!firebaseConfig.apiKey) {
  console.warn(
    'Chave de API do Firebase (VITE_FIREBASE_API_KEY) não configurada no arquivo .env. ' +
    'Funcionalidades do Firebase podem não operar corretamente.'
  );
}

export { app, auth, db, messaging };
