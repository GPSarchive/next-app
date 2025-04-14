import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

interface AdminAuthGuardProps {
  children: ReactNode;
}

export default async function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const sessionCookie = (await cookies()).get('__session')?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const response = await fetch(
      `https://us-central1-real-estate-5ca52.cloudfunctions.net/verifySession`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { sessionCookie } }),
      }
    );

    if (!response.ok) {
      redirect('/login');
    }

    const result = await response.json();
    const responseData = result.result;

    if (!responseData || responseData.status !== 'authorized' || responseData.role !== 'admin') {
      redirect('/unauthorized');
    }
  } catch (error) {
    console.error('Error fetching from Cloud Function:', error);
    redirect('/login');
  }

  return <>{children}</>;
}