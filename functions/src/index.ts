import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define the expected data shape for the callable function
interface VerifySessionData {
  sessionCookie: string;
}

// Define possible return types
interface VerifySessionResponse {
  status: "authorized" | "unauthenticated" | "unauthorized" | "error";
  redirectTo?: string;
  role?: string;
  message?: string;
}

export const verifySession = functions.https.onCall(
  async (data: functions.https.CallableRequest<VerifySessionData>)
    : Promise<VerifySessionResponse> => {
    const sessionCookie = data.data.sessionCookie;

    if (!sessionCookie) {
      return {status: "unauthenticated", redirectTo: "/login"};
    }

    try {
      const decodedClaims = await admin.auth()
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
