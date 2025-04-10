'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  initializeAppCheck,
  getToken,
  ReCaptchaV3Provider,
  AppCheck,
} from 'firebase/app-check';
import { app } from '@/app/firebase/firebaseConfig';

interface AppCheckWrapperProps {
  children: (appCheckToken: string) => ReactNode;
}

let appCheckInstance: AppCheck | null = null;

export default function AppCheckWrapper({ children }: AppCheckWrapperProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initAppCheck() {
      try {
        if (!appCheckInstance) {
          appCheckInstance = initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(
              process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_KEY!
            ),
            isTokenAutoRefreshEnabled: true,
          });
        }

        const tokenResult = await getToken(appCheckInstance, false);
        setToken(tokenResult.token);
      } catch (err: any) {
        console.error('[AppCheckWrapper] App Check error:', err.message);
        setError(err.message);
      }
    }

    initAppCheck();
  }, []);

  if (error) return <div>Error loading security: {error}</div>;
  if (!token) return <div>Loading security check...</div>;

  return <>{children(token)}</>;
}
