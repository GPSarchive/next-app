import { NextResponse } from 'next/server';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { House } from '@/app/types/house';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const db = getFirebaseAdminDB();
  if (!db) {
    console.error('❌ Firebase DB not initialized');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  try {
    const docRef = db.collection('houses').doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      console.warn('❌ House not found:', id);
      return NextResponse.json({ error: 'House not found' }, { status: 404 });
    }

    const property: House = { id: snapshot.id, ...snapshot.data() } as House;

    const rawLat = property.location?.latitude;
    const rawLng = property.location?.longitude;
    
    const latitude = typeof rawLat === 'string' ? parseFloat(rawLat) : rawLat;
    const longitude = typeof rawLng === 'string' ? parseFloat(rawLng) : rawLng;
    
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
      console.warn('❌ Invalid lat/lng for house');
      return NextResponse.json({ error: 'Invalid house data' }, { status: 400 });
    }
    
    const responseData = {
      id: property.id,
      title: property.title,
      price: property.price,
      description: property.description,
      images: property.images || [],
      latitude,
      longitude,
      bedrooms: property.bedrooms,
      kitchens: property.kitchens,
      floor: property.floor,
      size: property.size,
      yearBuilt: property.yearBuilt,
      windowType: property.windowType,
      energyClass: property.energyClass,
      hasHeating: property.hasHeating,
      heatingType: property.heatingType,
      parking: property.parking,
      suitableFor: property.suitableFor,
      specialFeatures: property.specialFeatures,
    };

    return NextResponse.json(responseData);
  } catch (err) {
    console.error('🔥 Error loading house data:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}