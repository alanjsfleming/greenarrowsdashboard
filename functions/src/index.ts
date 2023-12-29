import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const createUserDoc = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const carTemplate = {
    owner: uid,
    car_number: 1,
    car_name: "New Car",
    dweet_name: null,
    // Battery
    battery_capacity: 25,
    battery_offset:0,
    // Gearing
    gear_number_offset:0,
    axle_gear_teeth: 60,
    motor_gear_teeth:20,
    reverse_gearing_mode:true,

  };
  // Create the user document and the initial car document.
  const carDocRef = await admin.firestore().collection("cars").doc()
  await carDocRef.set(carTemplate);
  const carDocId = carDocRef.id;
  const userDoc = {
    team_name: "New Team",
    track_length: "2500",
    race_length: "90",
    race_start_time: null,
    lap_summary_table:false,
    summary_map:true,
    manual_lap_mode:false,

    cars:[carDocId], // Add the car document id to the user document.
  };
  await admin.firestore().collection("users").doc(uid).set(userDoc);
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
