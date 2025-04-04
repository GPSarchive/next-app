// lib/firebaseClient.ts
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  initializeFirestore,
  Firestore,
} from 'firebase/firestore';
import {
  getFunctions,
  connectFunctionsEmulator,
  Functions,
} from 'firebase/functions';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from 'firebase/app-check';

// =======================
// Firebase App Init (Client-only)
// =======================

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let functions: Functions;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') {
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
  console.log('Firebase config:', firebaseConfig);
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // ✅ App Check (ReCaptcha V3)
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_KEY!
    ),
    isTokenAutoRefreshEnabled: true,
  });

  // ✅ Init Firebase services
  auth = getAuth(app);
  db = initializeFirestore(app, { experimentalForceLongPolling: true });
  functions = getFunctions(app);
  storage = getStorage(app);

  // ✅ Connect to Emulators if enabled
  if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
    console.log('🧪 Connecting to Firebase Emulators...');
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectStorageEmulator(storage, 'localhost', 9199);
  }
}

export { app, auth, db, functions, storage };
