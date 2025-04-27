import NavBar from '@/app/lib/NavBar';
import ListingsClientWrapper from '@/app/components/ListingsPageComponents/ListingsClientWrapper';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { House } from '@/app/types/house';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RawSearchParams = Partial<{
  category: string
  bedrooms: number
  minPrice: string
  maxPrice: string
}>;

export default async function SecureListingsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  // 1) unpack and parse
  const {
    category,
    bedrooms: bStr,
    minPrice: minStr,
    maxPrice: maxStr,
  } = await searchParams;
  const bedrooms = typeof bStr === 'string' ? parseInt(bStr, 10) : undefined;
  const minPrice = minStr ? parseInt(minStr, 10) : undefined;
  const maxPrice = maxStr ? parseInt(maxStr, 10) : undefined;

  // 2) fetch
  const db = getFirebaseAdminDB();
  if (!db) throw new Error('Firebase Admin DB not initialized.');
  const snapshot = await db
    .collection('houses')
    .where('isPublic', '==', true)
    .get();
  const publicHouses: House[] = snapshot.docs.map(doc => {
    const data = doc.data() as House;
    return {
      ...data,
      id: doc.id,
      location: {
        ...data.location,
        longitude: Number(data.location.longitude),
      },
      isAdditional: false,
    };
  });

  // 3) apply filters in-memory
  let filtered = publicHouses;

  if (category) {
    filtered = filtered.filter(h => h.category === category);
  }

  if (bedrooms !== undefined) {
    filtered = filtered.filter(h => {
      // h.bedrooms is a string like "3" — parse it to a number before comparing
      const b = typeof h.bedrooms === 'string'
        ? parseInt(h.bedrooms, 10)
        : h.bedrooms;
      return b === bedrooms;
    });
  }

  if (minPrice !== undefined) {
    filtered = filtered.filter(h => parseInt(h.price, 10) >= minPrice);
  }

  if (maxPrice !== undefined) {
    filtered = filtered.filter(h => parseInt(h.price, 10) <= maxPrice);
  }


  return (
    <div className="flex flex-col h-screen overflow-hidden pt-[60px]">
      <NavBar />
      <ListingsClientWrapper initialHouses={filtered} />
    </div>
  );
}