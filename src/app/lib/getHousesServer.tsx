// lib/getHousesServer.ts
import { cookies } from 'next/headers';

export async function getHousesFromServer() {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) throw new Error('Missing session cookie');

  const res = await fetch(
    'https://us-central1-real-estate-5ca52.cloudfunctions.net/getHouses',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionCookie }),
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  const { houses } = await res.json();
  return houses;
}
