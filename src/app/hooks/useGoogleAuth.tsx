'use client';

import { auth } from '@/app/firebase/firebaseClient';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export async function signInWithGoogle(): Promise<string> {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  if (!user.emailVerified) {
    // Optional: only allow verified users
    throw new Error('email-not-verified');
  }

  const token = await user.getIdToken();

  const res = await fetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Token issue: server couldn’t verify.');
  }

  return user.uid;
}
