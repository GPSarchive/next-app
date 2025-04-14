import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();


interface VerifySessionResponse {
  status: "authorized" | "unauthenticated" | "unauthorized" | "error";
  redirectTo?: string;
  role?: string;
  message?: string;
}


// getHouses function
export const getHouses = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    if (!request.app) {
      throw new functions.https
        .HttpsError("failed-precondition", "Missing App Check token.");
    }
    try {
      let allDocs = [];
      if (!request.auth) {
        // Non-authenticated: get public houses
        const snapshot = await admin.firestore()
          .collection("houses").where("isPublic", "==", true).get();
        allDocs = snapshot.docs;
      } else {
        const userRole = request.auth.token.role;
        if (userRole === "admin") {
          // Admins get all houses
          const snapshot = await admin.firestore().collection("houses")
            .get();
          allDocs = snapshot.docs;
        } else {
          // Authenticated non-admin: get public + allowed private houses
          const publicSnapshot = await admin.firestore()
            .collection("houses").where("isPublic", "==", true).get();
          const privateSnapshot = await admin.firestore()
            .collection("houses")
            .where("allowedUsers", "array-contains", request.auth.uid)
            .get();
          allDocs = [...publicSnapshot.docs, ...privateSnapshot.docs];
        }
      }
      return allDocs.map((doc) => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      console.error("[getHouses] Error:", error);
      throw new functions.https
        .HttpsError("internal", "Internal server error.");
    }
  }
);

// verifySession function
export const verifySession = functions.https.onCall(
  async (request: functions.https.CallableRequest):
  Promise<VerifySessionResponse> => {
    if (!request.app) {
      throw new functions.https
        .HttpsError("failed-precondition", "Missing App Check token.");
    }
    const sessionCookie = request.data.sessionCookie;
    if (!sessionCookie) {
      return {status: "unauthenticated", redirectTo: "/login"};
    }
    try {
      const decodedClaims = await admin.auth()
        .verifySessionCookie(sessionCookie, true);
      const userRole = decodedClaims.role;
      if (!userRole || userRole !== "admin") {
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
