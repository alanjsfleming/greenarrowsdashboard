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
  const carTemplate = {
    // The owner field is used to identify which user owns the car.
    owner: uid,
    // Car number is from the point of view of the user, so it starts at 1.
    car_num: 1,
    // Other fields are used to store the car's properties.
    car_name: "New Car",
    battery_capacity: 30,
    dweet_name: null,
    large_gear_teeth: 60,
    wheel_circumference: 3,
  };
  // Create the user document and the initial car document.
  await admin.firestore().collection("users").doc(uid).set(userDoc);
  await admin.firestore().collection("cars").doc().set(carTemplate);
});
