'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getToken } from 'firebase/app-check';
import { appCheck } from '@/app/firebase/firebaseConfig';

type AppCheckContextType = {
  token: string | null;
};

const AppCheckContext = createContext<AppCheckContextType>({ token: null });

export const AppCheckProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!appCheck) return;

    getToken(appCheck, true)
      .then((result) => setToken(result.token))
      .catch((err) => console.error('Failed to get App Check token', err));
  }, []);

  return (
    <AppCheckContext.Provider value={{ token }}>
      {children}
    </AppCheckContext.Provider>
  );
};

export const useAppCheck = () => useContext(AppCheckContext);
