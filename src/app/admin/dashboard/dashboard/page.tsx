import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getFirebaseAdmin } from "@/app/lib/firebaseAdmin";

export default async function AdminDashboard() {
  // Retrieve session cookie
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("__session")?.value;

  // Redirect if no session exists
  if (!sessionCookie) {
    redirect("/login");
  }

  const admin = getFirebaseAdmin();
  let decodedToken;

  try {
    // Verify session cookie and obtain token details
    if (!admin) {
      console.error("Firebase Admin SDK is not initialized.");
      redirect("/login");
    }
    decodedToken = await admin.auth.verifySessionCookie(sessionCookie, true);
  } catch (err) {
    console.error("Session verification failed:", err);
    redirect("/login");
  }

  // Check for admin claim; redirect if user is not an admin
  if (!decodedToken.admin) {
    console.warn("Unauthorized access attempt by non-admin user:", decodedToken.uid);
    redirect("/login");
  }

  // If the user is an admin, render the dashboard
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {decodedToken.email}. You have admin access.</p>
      {/* Additional admin functionality goes here */}
    </div>
  );
}
