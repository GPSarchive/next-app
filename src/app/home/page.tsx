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
       question: 'What are the steps involved in buying properties for sale in Ibiza?',
       answer: (
         <ol className="list-decimal list-inside space-y-1">
           <li>Obtain an NIE (foreigner ID number).</li>
           <li>Open a Spanish bank account.</li>
           <li>Sign a Reservation Contract & pay deposit.</li>
           <li>Sign the private purchase contract.</li>
           <li>Complete at the Notary and pay the balance.</li>
         </ol>
       ),
     },
     {
       question: 'Do I need to be a Spanish resident to buy an Ibiza villa for sale?',
       answer: <p>No – non-residents are free to purchase property in Spain. We’ll help you with all the paperwork.</p>,
     },
     {
       question: 'What are the advantages of investing in properties for rental income?',
       answer: <p>Ibiza offers year-round tourism, strong yields, and capital appreciation. You can legally rent out through the high season to maximize returns.</p>,
     },
     // …more items
   ];

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
          <FAQ items={faqItems} />
       <Footer />
     </div>
    </>
  );
}