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
    race_start_time: null,
  };
  const carTemplate = {
    // The owner field is used to identify which user owns the car.
    owner: uid,
    // Car number is from the point of view of the user, so it starts at 1.
    car_number: 1,
    // Other fields are used to store the car's properties.
    car_name: "New Car",
    battery_capacity: 25,
    dweet_name: null,
    large_gear_teeth: 60,
    wheel_circumference: 3,
  };
  // Create the user document and the initial car document.
  await admin.firestore().collection("users").doc(uid).set(userDoc);
  await admin.firestore().collection("cars").doc().set(carTemplate);
});

export const deleteUserData = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  // Do as a batch to save usage of operations.
  const batch = admin.firestore().batch();

  // Delete the user document and all the cars associated with the user.
  // Delete the document in 'users' collection.
  const userDocRef = admin.firestore().collection("users").doc(uid);
  batch.delete(userDocRef);

  // Delete all the documents in 'cars' collection where the
  // owner field is equal to the uid.
  const carsSnapshot = await admin.firestore()
    .collection("cars")
    .where("owner", "==", uid)
    .get();

  carsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Commit the batch.
  await batch.commit();
});
