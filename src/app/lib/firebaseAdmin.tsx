import { cert, getApps, initializeApp, getApp } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let firebaseAdminAuth: Auth | null = null;
let firebaseAdminDB: Firestore | null = null;

function initializeFirebaseAdmin() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    console.log('Initializing Firebase Admin SDK:', projectId, clientEmail, privateKey ? '***' : 'missing private key');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('❌ Firebase Admin SDK missing env variables in /firebaseAdmin.');
      return;
    }

    const app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });

    firebaseAdminAuth = getAuth(app);
    firebaseAdminDB = getFirestore(app);
  } else {
    const app = getApp();
    firebaseAdminAuth = firebaseAdminAuth || getAuth(app);
    firebaseAdminDB = firebaseAdminDB || getFirestore(app);
  }
}

export function getFirebaseAdminAuth(): Auth | null {
  if (!firebaseAdminAuth) {
    initializeFirebaseAdmin();
  }
  return firebaseAdminAuth;
}

export function getFirebaseAdminDB(): Firestore | null {
  if (!firebaseAdminDB) {
    initializeFirebaseAdmin();
  }
  return firebaseAdminDB;
}