import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const initFirebase = () => {
  if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Only initialize if real credentials are present
    if (!privateKey || privateKey.includes('your-private-key')) {
      console.warn('[Firebase] No valid credentials — Firebase features disabled in dev mode');
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  }
};

initFirebase();

export default admin;
