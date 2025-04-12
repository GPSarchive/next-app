import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const getHouses = functions.https
  .onCall(async (request: functions.https.CallableRequest) => {
    try {
      console.log("[getHouses] Incoming request...");
      // 1. Verify App Check
      if (!request.app) {
        throw new functions.https
          .HttpsError("failed-precondition", "Missing App Check token.");
      }
      // 2. Check if user is authenticated
      if (!request.auth) {
        throw new functions.https
          .HttpsError("unauthenticated", "User must be authenticated.");
      }
      // 3. Check user tier
      const userTier = request.auth.token.role;
      console.log("[getHouses] User tier:", userTier);
      if (userTier !== "admin" && userTier !== "premium") {
        throw new functions.https
          .HttpsError("permission-denied", "Insufficient privileges.");
      }
      // 4. Query the Firestore houses collection
      const snapshot = await admin.firestore()
        .collection("houses").get();
      const houses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console
        .log("[getHouses] Returning", houses.length, "houses.");
      return {houses};
    } catch (error) {
      console.error("[getHouses] Error:", error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      } else {
        throw new functions.https
          .HttpsError("internal", "Internal server error.");
      }
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
