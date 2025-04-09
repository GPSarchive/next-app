// SessionAuthGuard.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

interface SessionAuthGuardProps {
  children: ReactNode;
}

export default async function SessionAuthGuard({ children }: SessionAuthGuardProps) {
  // Read the session cookie securely from the server-side
  const sessionCookie = (await cookies()).get('__session')?.value;

  if (!sessionCookie) {
    console.error('No session cookie, redirecting to login');
    redirect('/login');
  }

  try {
    // Verify the session by calling the secure Cloud Function
    const response = await fetch(
      `https://us-central1-real-estate-5ca52.cloudfunctions.net/verifySession`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { sessionCookie } }),
      }
    );

    // If fetch fails or returns a non-OK status, redirect to login
    if (!response.ok) {
      console.error('Fetch failed with status:', response.status);
      redirect('/login');
    }

    // Parse the response
    const result = await response.json();
    console.log('Raw Cloud Function response:', result);

    // Check if the session is authorized (adjust based on your API’s response structure)
    const responseData = result.result;
    if (responseData?.status !== 'authorized') {
      console.log('Redirecting due to unauthorized status:', responseData?.status);
      redirect('/login');
    }
  } catch (error) {
    console.error('Error fetching from Cloud Function:', error);
    redirect('/login');
  }

  // If all checks pass, render the child components
  return <>{children}</>;
}
