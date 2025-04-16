import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

interface VerifySessionResponse {
  status: string;
  role?: string;
  redirectTo?: string;
  message?: string;
}


export const getHouses = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    console
      .log("[gH] Function called. App Check:", !!request
        .app, "Auth:", !!request.auth);
    if (request.auth) {
      console
        .log("[getHouses] ID:", request.auth.uid, "Role:", request
          .auth.token.role);
    }
    if (!request.app) {
      console.log("[getHouses] Missing App Check token.");
      throw new functions
        .https.HttpsError("failed-precondition", "Missing App Check token.");
    }
    if (!request.auth) {
      console.log("[getHouses] Non-authenticated request: unauthorized.");
      throw new functions
        .https.HttpsError("unauthenticated", "User must be authenticated.");
    }
    try {
      let snapshot;
      const userRole = request.auth.token.role;
      if (userRole === "admin") {
        console.log("[gH] Admin request: fetching all non-public houses.");
        snapshot = await admin.firestore()
          .collection("houses").where("isPublic", "==", false).get();
        console.log("[gH] Fetched", snapshot
          .size, "non-public houses (admin).");
      } else {
        console
          .log("[getHouses]Authenticatednon-adminrequest:fetch privateID:",
            request.auth.uid);
        snapshot = await admin.firestore().collection("houses")
          .where("isPublic", "==", false)
          .where("allowedUsers", "array-contains", request.auth.uid)
          .get();
        console.log("[gH] Fetched", snapshot.size, "private houses for UID:",
          request.auth.uid);
      }
      const houses = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      console.log("[getHouses] Returning", houses.length, "houses.");
      return houses;
    } catch (error) {
      console.error("[getHouses] Error:", error);
      if (error instanceof Error) {
        console.error("[getHouses] Error stack:", error.stack);
      }
      throw new functions
        .https.HttpsError("internal", "Internal server error.");
    }
  }
);

// verifySession function
export const verifySession = functions.https.onCall(
  async (request: functions.https.CallableRequest):
  Promise<VerifySessionResponse> => {
    console.log("verifySession:Receivedrequestwithdata:",
      request.data);

    const sessionCookie = request.data.sessionCookie;
    if (!sessionCookie) {
      console
        .log("vS: NosessioncookieprovidedReturningunauthenticated.");
      return {status: "unauthenticated", redirectTo: "/login"};
    }
    // For security, log only the first few characters of the session cookie.
    console.log("verifySession: Received session cookie:",
      sessionCookie.substring(0, 20) + "...");
    try {
      const decodedClaims = await admin.auth()
        .verifySessionCookie(sessionCookie, true);
      console.log("verifySession: Decoded claims:", decodedClaims);
      const userRole = decodedClaims.role;
      if (!userRole || userRole !== "admin") {
        console.log("verifySession: User unauthorized, role:", userRole);
        return {status: "unauthorized", redirectTo: "/unauthorized"};
      }
      console
        .log("verifySession: User authorized with role:", userRole);
      return {status: "authorized", role: userRole};
    } catch (error) {
      console
        .error("verifySession: Error verifying session cookie:", error);
      return {
        status: "error",
        redirectTo: "/login",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
);


// addHouse function
export const addHouse = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    if (!request.app) {
      throw new functions
        .https.HttpsError("failed-precondition", "Missing App Check token.");
    }
    if (!request.auth || request.auth.token.role !== "admin") {
      throw new functions
        .https.HttpsError("permission-denied", "Only admins can add houses.");
    }
    try {
      const docRef = await admin
        .firestore().collection("houses").add(request.data);
      return {id: docRef.id};
    } catch (error) {
      console.error("Error adding house:", error);
      throw new functions.https.HttpsError("internal", "Failed to add house.");
    }
  }
);

// updateHouse function
export const updateHouse = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    if (!request.app) {
      throw new functions
        .https.HttpsError("failed-precondition", "Missing App Check token.");
    }
    if (!request.auth || request.auth.token.role !== "admin") {
      throw new functions
        .https
        .HttpsError("permission-denied", "Only admins can update houses.");
    }
    try {
      const {id, ...houseData} = request.data;
      await admin.firestore().collection("houses").doc(id).update(houseData);
      return {success: true};
    } catch (error) {
      console.error("Error updating house:", error);
      throw new functions
        .https.HttpsError("internal", "Failed to update house.");
    }
  }
);

// deleteHouse function
export const deleteHouse = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    if (!request.app) {
      throw new functions
        .https.HttpsError("failed-precondition", "Missing App Check token.");
    }
    if (!request.auth || request.auth.token.role !== "admin") {
      throw new functions.https
        .HttpsError("permission-denied", "Only admins can delete houses.");
    }
    try {
      const {id} = request.data;
      await admin.firestore().collection("houses").doc(id).delete();
      return {success: true};
    } catch (error) {
      console.error("Error deleting house:", error);
      throw new functions
        .https.HttpsError("internal", "Failed to delete house.");
    }
  }
);
