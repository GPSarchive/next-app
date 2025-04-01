'use client';

import { auth } from '@/app/firebase/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();

  const res = await fetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Token issue: server couldn’t verify.');
  }
}
