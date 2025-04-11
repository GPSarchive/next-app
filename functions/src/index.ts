import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";
import cookie from "cookie";

// Initialize Firebase Admin
admin.initializeApp();

// Initialize CORS middleware
const corsHandler = cors({
  origin: true, // In production, restrict origins to your trusted domains.
  credentials: true,
});

export const getHouses = functions
  .https.onRequest((req, res): Promise<void> => {
    return new Promise((resolve) => {
      corsHandler(req, res, async () => {
        try {
          console.log("[getHouses] Incoming request...");

          // Accept GET requests only.
          if (req.method !== "GET") {
            res.status(405).send("Method Not Allowed");
            return resolve();
          }

          // 1. App Check token verification.
          const appCheckToken = req.header("X-Firebase-AppCheck");
          if (!appCheckToken) {
            console.error("[getHouses] Missing App Check token");
            res.status(401).send("Missing App Check token.");
            return resolve();
          }
          await admin.appCheck().verifyToken(appCheckToken);
          console.log("[getHouses] App Check verified.");

          // 2. Get session cookie (using cookie parsing)
          const parsedCookies = req
            .headers.cookie ? cookie.parse(req.headers.cookie) : {};
          const sessionCookie = parsedCookies[process.env
            .COOKIE_NAME || "__session"];
          if (!sessionCookie) {
            console.error("[getHouses] Missing session cookie");
            res.status(401).send("Missing session cookie.");
            return resolve();
          }

          // 3. Verify session cookie and check custom claims.
          const decodedClaims = await admin.auth()
            .verifySessionCookie(sessionCookie, true);
          // Prefer a single key such as "tier" for clarity:
          const userTier = decodedClaims.tier || decodedClaims.role;
          console.log("[getHouses] User tier:", userTier);
          if (userTier !== "admin" && userTier !== "premium") {
            res.status(403).send("Insufficient privileges.");
            return resolve();
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
        } catch (error: any) {
          console.error("[getHouses] Error:", error.message || error);
          res.status(500)
            .send("Error processing request: " + (error.message || error));
        } finally {
          resolve();
        }
      });
    });
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
