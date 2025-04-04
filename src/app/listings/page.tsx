import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NavBar from "@/app/components/NavBar";
import HouseGridWrapper from "@/app/components/HouseGridWrapper";
import FiltersWrapper from "@/app/components/FiltersWrapper";
import styles from "@/app/components/HousesMapPage.module.css";
import { getAllHouses } from "@/app/lib/firestore/houses";
import type { House } from "@/app/types/house";
import ClientMapWrapper from "@/app/components/CleintMapWrapper";

export const runtime = 'nodejs';

export default async function SecureListingsPage() {
  const cookieStore = cookies();
  const sessionCookie = (await (await cookieStore).get('__session'))?.value;

  if (!sessionCookie) {
    console.log('No session cookie, redirecting to login');
    redirect('/login');
  }

  let responseData;

  try {
    const response = await fetch(
      `https://us-central1-real-estate-5ca52.cloudfunctions.net/verifySession`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { sessionCookie } }),
      }
    );

    console.log('Fetch status:', response.status);
    if (!response.ok) {
      console.error('Fetch failed with status:', response.status, await response.text());
      redirect('/login');
    }else{
      console.log('Secure Listings page Fetch succeeded:', await response.text());
    }

    const result = await response.json();
    console.log('Raw Cloud Function response:', result);

    // Adjust for emulator response structure (result) vs production (data)
    const isEmulator = process.env.NODE_ENV === 'development';
    responseData = isEmulator
      ? (result.result as { status: string; redirectTo?: string; role?: string; message?: string })
      : (result.data as { status: string; redirectTo?: string; role?: string; message?: string });

    if (!responseData || typeof responseData !== 'object' || !('status' in responseData)) {
      console.error('Unexpected response structure:', result);
      redirect('/login');
    }

    console.log('Parsed response data:', responseData);
  } catch (error) {
    console.error('Error fetching from Cloud Function:', error);
    redirect('/login');
  }

  if (responseData.status !== 'authorized') {
    console.log('Redirecting due to status:', responseData.status);
    redirect(responseData.redirectTo || '/login');
  }

  const houses = await getAllHouses();

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <div className={styles.filtersWrapper}>
            <FiltersWrapper resultsCount={houses.length} />
          </div>
          <HouseGridWrapper houses={houses} />
        </div>
        <div className={styles.rightPanel}>
          <ClientMapWrapper houses={houses} />
        </div>
      </div>
    </div>
  );
}