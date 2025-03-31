// lib/firebaseAdmin.ts

import { cert, getApps, initializeApp, getApp } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

type FirebaseAdminServices = {
  auth: Auth;
  db: Firestore;
};

let firebaseAdminServices: FirebaseAdminServices | null = null;

export function getFirebaseAdmin(): FirebaseAdminServices | null {
  if (firebaseAdminServices) return firebaseAdminServices;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('❌ Firebase Admin SDK missing env variables.');
    return null;
  }

  const app = getApps().length === 0
    ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    : getApp();

  firebaseAdminServices = {
    auth: getAuth(app),
    db: getFirestore(app),
  };

  return firebaseAdminServices;
}
