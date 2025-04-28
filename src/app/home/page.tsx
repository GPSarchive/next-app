// app/home/page.tsx

import NavBar from '@/app/lib/NavBar';
import HomeCarousel from '@/app/components/HomePageComponents/HomeCarousel';
import Filters from '@/app/components/HomePageComponents/Filters';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { House } from '@/app/types/house';
import HomeHouseGrid from '@/app/components/HomePageComponents/HomeHouseGrid';
import FAQ, { FAQItem } from '@/app/components/HomePageComponents/FAQ';
import Footer from '@/app/lib/Footer';

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

  // Define your FAQ items here (or fetch from CMS)
  const faqItems: FAQItem[] = [
     {
       question: 'What are the steps involved in buying properties for sale in Greece?',
       answer: (
         <ol className="list-decimal list-inside space-y-1">
           <li>Obtain an foreigner ID number.</li>
           <li>Open a Greek bank account.</li>
           <li>Sign a Reservation Contract & pay deposit.</li>
           <li>Sign the private purchase contract.</li>
           <li>Complete at the Notary and pay the balance.</li>
         </ol>
       ),
     },
     {
       question: 'Do I need to be a Greek resident to buy an Greece villa for sale?',
       answer: <p>No – non-residents are free to purchase property in Greece. We’ll help you with all the paperwork.</p>,
     },
     {
       question: 'What are the advantages of investing in properties for rental income?',
       answer: <p>Greece offers year-round tourism, strong yields, and capital appreciation. You can legally rent out through the high season to maximize returns.</p>,
     },
     // …more items
   ];

  return (
    <>
  <NavBar />
  <div className=" bg-[#D6D2C4]  min-h-screen">

    {/* ✅ Carousel + Filters (relative positioning only inside this block) */}
    
    <div className="relative w-full bg-white shadow-lg rounded-md">
      <HomeCarousel houses={houses} />

      {/* Filters floating over */}
      <div className="absolute w-full bottom-6 shadow-lg rounded-md left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
        <Filters houses={houses} />
      </div>
    </div>

    {/* ✅ Spacer div to push page content down */}
    

    {/* ✅ Now real page content starts */}
    
    {/* ✅ Featured Properties For Sale */}
      <div className="w-full mt-12 shadow-lg bg-[#D6D2C4] p-12">
        <div className="max-w-7xl mx-auto bg-[#D6D2C4] p-12">
          <h1 className="text-4xl font-extrabold text-center text-[#361e1a] mb-8">
            Featured Properties For Sale
          </h1>
          <HomeHouseGrid houses={houses} />
        </div>
      </div>

      {/* ✅ Shadow Separator */}
      <div className="w-full h-6 shadow-inner shadow-lg bg-white" />

      {/* ✅ Featured Rental Properties */}
      <div className="bg-white shadow-lg rounded-md w-full">
        <div className="max-w-7xl mx-auto bg-white border-2 border-white-300 rounded-lg  p-6">
          <h1 className="text-4xl font-extrabold text-center mb-8">
            Featured Rental Properties
          </h1>
          <HomeHouseGrid houses={houses} />
        </div>
      </div>
    <FAQ items={faqItems} />
    
  </div>
</>
  );
}