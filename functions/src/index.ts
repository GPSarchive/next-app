import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";

admin.initializeApp();

// Initialize CORS middleware
const corsHandler = cors({
  origin: true, // In production, restrict origins to your trusted domains.
  credentials: true,
});

export const getHouses = functions.https.onRequest(async (req, res) => {
  // Wait for the CORS middleware to complete.
  await new Promise((resolve) => {
    corsHandler(req, res, resolve);
  });

  try {
    console.log("[getHouses] Incoming request...");

    // Accept POST requests only (httpsCallable sends POST)
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // 1. App Check token verification.
    const appCheckToken = req.header("X-Firebase-AppCheck");
    if (!appCheckToken) {
      console.error("[getHouses] Missing App Check token");
      res.status(401).send("Missing App Check token.");
      return;
    }
    await admin.appCheck().verifyToken(appCheckToken);
    console.log("[getHouses] App Check verified.");

    // 2. Get session cookie from the request payload.
    // If the body is a string, attempt to parse it.
    let payload: any;
    if (typeof req.body === "string") {
      try {
        payload = JSON.parse(req.body);
      } catch (parseError) {
        res.status(400).send("Bad request: invalid JSON.");
        return;
      }
    } else {
      payload = req.body;
    }
    const sessionCookie = payload.sessionCookie;
    if (!sessionCookie) {
      console.error("[getHouses] Missing session cookie in payload");
      res.status(401).send("Missing session cookie.");
      return;
    }
    // 3. Verify session cookie and check custom claims.
    const decodedClaims = await admin.auth()
      .verifySessionCookie(sessionCookie, true);
    const userTier = decodedClaims.tier || decodedClaims.role;
    console.log("[getHouses] User tier:", userTier);
    if (userTier !== "admin" && userTier !== "premium") {
      res.status(403).send("Insufficient privileges.");
      return;
    }
    // 4. Query the Firestore houses collection.
    const snapshot = await admin.firestore()
      .collection("houses").get();
    const houses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("[getHouses] Returning", houses.length, "houses.");
    res.status(200).json({houses});
  } catch (error: unknown) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Unknown error";
    }
    console.error("[getHouses] Error:", errorMessage);
    res.status(500).send("Error processing request: " + errorMessage);
  }
});


// ---------------------------------------------------------
// verifySession: Callable Function for session validation
// ---------------------------------------------------------
interface VerifySessionData {
  sessionCookie: string;
}

interface VerifySessionResponse {
  status: "authorized" | "unauthenticated" | "unauthorized" | "error";
  redirectTo?: string;
  role?: string;
  message?: string;
}

export const verifySession = functions.https.onCall(
  async (
    data: functions.https.CallableRequest<VerifySessionData>
  ): Promise<VerifySessionResponse> => {
    const sessionCookie = data.data.sessionCookie;

    if (!sessionCookie) {
      return {status: "unauthenticated", redirectTo: "/login"};
    }

    try {
      const decodedClaims = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true);
      const userRole = decodedClaims.role;

      if (!userRole || (userRole !== "premium" && userRole !== "admin")) {
        return {status: "unauthorized", redirectTo: "/unauthorized"};
      }

      return {status: "authorized", role: userRole};
    } catch (error) {
      console.error("Error verifying session cookie:", error);
      return {
        status: "error",
        redirectTo: "/login",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
);
