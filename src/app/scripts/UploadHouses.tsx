import { getFirebaseAdmin } from '@/app/lib/firebaseAdmin';
import fs from 'fs';
import path from 'path';

export async function uploadHousesFromFile() {
  if (process.env.NODE_ENV !== 'development') {
    console.log('🛑 uploadHousesFromFile is dev-only');
    return;
  }

  const filePath = path.resolve(process.cwd(), 'public/seed/houses.json');
  if (!fs.existsSync(filePath)) {
    console.error('❌ JSON file not found at', filePath);
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const houses = JSON.parse(raw);

  if (!Array.isArray(houses)) {
    console.error('❌ JSON is not an array');
    return;
  }

  const firebase = getFirebaseAdmin();
  if (!firebase) {
    console.error('❌ Firebase Admin not initialized');
    return;
  }

  const { db } = firebase;

  console.log(`📦 Uploading ${houses.length} houses...`);

  for (const house of houses) {
    try {
      const docRef = db.collection('houses').doc();
      await docRef.set(house);
      console.log(`✅ Uploaded house: ${house.title || docRef.id}`);
    } catch (err) {
      console.error('🔥 Failed to upload house:', house.title, err);
    }
  }

  console.log('✅ All houses uploaded.');
}
