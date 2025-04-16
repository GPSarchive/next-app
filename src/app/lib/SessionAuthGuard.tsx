import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

interface SessionAuthGuardProps {
  children: ReactNode;
  houseId: string;
}

export default async function SessionAuthGuard({ children, houseId }: SessionAuthGuardProps) {
  const sessionCookie = (await cookies()).get('__session')?.value;

  try {
    const response = await fetch('/api/check-house-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionCookie, houseId }),
    });

    if (!response.ok) {
      console.error('Fetch failed with status:', response.status);
      redirect('/login');
    }

    const result = await response.json();

    if (result.status === 'allowed') {
      return <>{children}</>;
    } else if (result.status === 'unauthenticated') {
      redirect('/login');
    } else if (result.status === 'unauthorized') {
      redirect('/unauthorized');
    } else if (result.status === 'not_found') {
      redirect('/404');
    } else {
      redirect('/login');
    }
  } catch (error) {
    console.error('Error fetching from API:', error);
    redirect('/login');
  }
}