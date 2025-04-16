'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';
import { getFunctions, Functions, connectFunctionsEmulator } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Log config for debugging (optional)
console.log('Firebase config:', firebaseConfig);

// Initialize Firebase app (only once)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize App Check (only once)
let appCheckInstance: AppCheck | null = null;
if (typeof window !== 'undefined' && !appCheckInstance) {
  try {
    console.log('Initializing App Check');
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_KEY!),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.error('Error initializing App Check:', error);
  }
}

// Initialize services
export const auth: Auth = getAuth(app);
export const db: Firestore = initializeFirestore(app, { experimentalForceLongPolling: true });
export const functions: Functions = getFunctions(app);

// Optional: Connect to emulators for local development (uncomment if needed)
// if (process.env.NODE_ENV === 'development') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFunctionsEmulator(functions, 'localhost', 5001);
// }

export default app;