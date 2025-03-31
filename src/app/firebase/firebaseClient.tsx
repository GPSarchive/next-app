// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

if (
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_EMULATORS === 'true'
) {
  console.log('🔌 Connecting to Firebase Auth Emulator...');
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}

export { app, auth };
