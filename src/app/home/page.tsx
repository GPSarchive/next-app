// app/home/page.tsx

import NavBar from '@/app/lib/NavBar';
import HomeCarousel from '@/app/components/HomePageComponents/HomeCarousel';
import Filters from '@/app/components/HomePageComponents/Filters';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { House } from '@/app/types/house';
import HomeHouseGrid from '@/app/components/HomePageComponents/HomeHouseGrid';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function HomePage() {
  const db = getFirebaseAdminDB();
  if (!db) throw new Error('Firebase Admin DB not initialized.');

  const snapshot = await db
    .collection('houses')
    .where('isPublic', '==', true)
    .get();

  const houses: House[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<House, 'id'>),
  }));

  return (
    <>
      <NavBar />
      <div className="bg-[#D6D2C4] min-h-screen">
        
        {/* ✅ Full-width Carousel outside the padded <main> */}
        <div className="w-full bg-white shadow-lg">
          <HomeCarousel houses={houses} />
          <Filters houses={houses} />
        </div>
          <div className="max-w-7xl mx-auto mt-12 bg-white border-2 border-white-300 rounded-lg shadow-md p-6">
            <h1 className="text-4xl font-extrabold text-center mb-8">
              Featured Properties For Sale In Zakynthos
            </h1>
            <HomeHouseGrid houses={houses} />
          </div>
       
      </div>
    </>
  );
}

