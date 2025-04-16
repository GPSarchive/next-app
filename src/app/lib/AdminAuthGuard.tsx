import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

interface AdminAuthGuardProps {
  children: ReactNode;
}

export default async function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  // Fetch the __session cookie
  const sessionCookie = (await cookies()).get('__session')?.value;
  console.log("AdminAuthGuard: sessionCookie:", sessionCookie);

  // If no session cookie, redirect to login
  if (!sessionCookie) {
    console.log("AdminAuthGuard: No session cookie found. Redirecting to /login.");
    redirect('/login');
  }

  try {
    console.log("AdminAuthGuard: Calling verifySession Cloud Function");
    const response = await fetch(
      `https://us-central1-real-estate-5ca52.cloudfunctions.net/verifySession`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { sessionCookie } }),
      }
    );

    console.log("AdminAuthGuard: Response status:", response.status);
    if (!response.ok) {
      console.log("AdminAuthGuard: Response not ok. Redirecting to /login.");
      redirect('/login');
    }

    const result = await response.json();
    console.log("AdminAuthGuard: Cloud Function result:", result);
    const responseData = result.result;

    // Check that the user is authorized and has the admin role.
    if (!responseData || responseData.status !== 'authorized' || responseData.role !== 'admin') {
      console.log("AdminAuthGuard: Unauthorized access. Redirecting to /unauthorized.");
      redirect('/unauthorized');
    }
    console.log("AdminAuthGuard: User is authorized.");
  } catch (error) {
    console.error('AdminAuthGuard: Error fetching from Cloud Function:', error);
    redirect('/login');
  }

  // If everything is valid, render the children.
  return <>{children}</>;
}
