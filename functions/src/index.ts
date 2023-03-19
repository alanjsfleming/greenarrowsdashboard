import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const createUserDoc = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const userDoc = {
    team_name: "New Team",
    track_length: "2500",
    race_length: "90",
    appearance_theme: "Light",
  };

  await admin.firestore().collection("users").doc(uid).set(userDoc);
});
