// app/houses/[id]/page.js
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getFirebaseAdminAuth, getFirebaseAdminDB } from '@/app/lib/firebaseAdmin'
import NavBar from '@/app/lib/NavBar'
import DetailsContent from '@/app/components/DetailsPageComponents/DetailsContent'

export const metadata = {
  title: 'Property Details',
}

export default async function PropertyPage({ params }) {
  const adminDb = getFirebaseAdminDB()
  if (!adminDb) throw new Error('Firebase Admin not initialized')

  // 1. Fetch the house
  const houseSnap = await adminDb.collection('houses').doc(params.id).get()
  if (!houseSnap.exists) notFound()
  const houseData = houseSnap.data()

  // 2. Public → show
  if (houseData.isPublic) {
    return (
      <>
        <NavBar />
        <DetailsContent property={houseData} />
      </>
    )
  }

  // 3. Private → check session cookie
  const sessionCookie = cookies().get('__session')?.value
  if (!sessionCookie) redirect('/login')

  const adminAuth = getFirebaseAdminAuth()
  if (!adminAuth) throw new Error('Firebase Auth not initialized')

  let decoded
  try {
    decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
  } catch (err) {
    console.error('Invalid session cookie:', err)
    return redirect('/login')
  }

  const { uid, role } = decoded

  // 4a. Admins always see it
  if (role === 'admin') {
    return (
      <>
        <NavBar />
        <DetailsContent property={houseData} />
      </>
    )
  }

  // 4b. Otherwise must be in allowedUsers[]
  if (
    Array.isArray(houseData.allowedUsers) &&
    houseData.allowedUsers.includes(uid)
  ) {
    return (
      <>
        <NavBar />
        <DetailsContent property={houseData} />
      </>
    )
  }

  // 5. No access
  redirect('/login')
}