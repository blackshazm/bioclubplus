import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const FIREBASE_SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!FIREBASE_SERVICE_ACCOUNT_PATH) {
  console.warn(
    'Atenção: FIREBASE_SERVICE_ACCOUNT_PATH não definido no .env. ' +
    'Serviços do Firebase Admin (como FCM e Firestore Admin) podem não funcionar.'
  );
}

try {
  if (FIREBASE_SERVICE_ACCOUNT_PATH) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(FIREBASE_SERVICE_ACCOUNT_PATH); // Carrega o arquivo JSON

    if (admin.apps.length === 0) { // Evita re-inicialização
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // databaseURL: `https://${serviceAccount.project_id}.firebaseio.com` // Opcional, se for usar Realtime Database
      });
      console.log('Firebase Admin SDK inicializado com sucesso.');
    }
  } else if (process.env.NODE_ENV !== 'test') { // Não mostrar warning em testes se path não estiver definido
     console.warn(
      'Firebase Admin SDK não inicializado pois o caminho para o arquivo de credenciais não foi fornecido. ' +
      'Defina FIREBASE_SERVICE_ACCOUNT_PATH no seu arquivo .env.'
     );
  }
} catch (error) {
  console.error('Erro ao inicializar Firebase Admin SDK:', error);
  // Não sair do processo, pois a aplicação pode funcionar parcialmente sem Firebase
}

export default admin;
