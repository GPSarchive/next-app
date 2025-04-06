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
  // Get session cookie synchronously in server components
  const sessionCookie = (await cookies()).get('__session')?.value;

  if (!sessionCookie) {
    console.log('No session cookie, redirecting to login');
    redirect('/login');
  }

  let responseData;

  try {
    // Call the Cloud Function to verify the session
    const response = await fetch(
      `https://us-central1-real-estate-5ca52.cloudfunctions.net/verifySession`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { sessionCookie } }),
      }
    );

    // If the fetch fails, redirect to login
    if (!response.ok) {
      console.error('Fetch failed with status:', response.status);
      redirect('/login');
    }

    // Parse the response
    const result = await response.json();
    console.log('Raw Cloud Function response:', result);

    // Extract the status (assuming the response is { result: { status: 'authorized', role: 'admin' } })
    const responseData = result.result; // Adjust this based on your Cloud Function's response structure

    // Check if status is 'authorized'
    if (responseData?.status !== 'authorized') {
      console.log('Redirecting due to unauthorized status:', responseData?.status);
      redirect('/login');
    }
  } catch (error) {
    console.error('Error fetching from Cloud Function:', error);
    redirect('/login');
  }

  // If we reach here, status is 'authorized', so fetch houses and render page
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