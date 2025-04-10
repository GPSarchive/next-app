'use client';

import { ReactNode, useEffect, useState } from 'react';
import { initializeAppCheck, getToken, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from '@/app/firebase/firebaseConfig';

interface AppCheckWrapperProps {
  children: (appCheckToken: string) => ReactNode;
}

export default function AppCheckWrapper({ children }: AppCheckWrapperProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initAppCheck() {
      try {
        const appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_KEY!),
          isTokenAutoRefreshEnabled: true,
        });

        const tokenResult = await getToken(appCheck, false);
        setToken(tokenResult.token);
      } catch (err: any) {
        console.error('[AppCheckWrapper] Failed to init App Check:', err.message);
        setError(err.message);
      }
    }

    initAppCheck();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!token) return <div>Loading security...</div>;

  return <>{children(token)}</>;
}
