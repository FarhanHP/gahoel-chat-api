import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../../gahoel-chat-firebase-adminsdk-cwqaq-1314454b27.json';

export const initializeFirebaseAdmin = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
  });  
}
