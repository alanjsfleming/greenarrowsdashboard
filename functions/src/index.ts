import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Function called when a new user is created to setup required documents for them.
export const createUserDoc = functions.auth.user().onCreate(async (user) => {
  // Get user unique id from the user object to identify ownership of documents.
  const uid = user.uid;

  // Create a user document for the account with some default values they can change.
  const userDoc = {
    team_name: "New Team",
    track_length: "2500",
    race_length: "90",
    appearance_theme: "Light",
  };

  // Create an initial car document for the account with some default values they can change.
  const carTemplate = {
    // The owner field is used to identify which user owns the car.
    owner: uid,
    // Car number is from the point of view of the user, so it starts at 1.
    car_num:1,
    // Other fields are used to store the car's properties.
    car_name: "New Car",
    battery_capacity:30,
    dweet_name: null,
    large_gear_teeth: 60,
    small_gear_teeth: 20,
    wheel_circumference: 3,
  }
  // Create the user document and the initial car document.
  await admin.firestore().collection("users").doc(uid).set(userDoc);
  await admin.firestore().collection("cars").doc().set(carTemplate);
});
