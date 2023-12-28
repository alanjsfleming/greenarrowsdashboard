import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getDocs, addDoc, collection, query, where } from "firebase/firestore";

export async function postSettingsToDatabase(uid, data) {
    try {
        const docRef = doc(db, "users", uid);
        // Wait for the document to be set
        const newCars = [...data.cars];
        delete data.cars;

        // Save user settings
        await setDoc(docRef, data, { merge: true });
        // Save cars
        for (let car of newCars) {
            await postSingleCarToDatabase(uid,car);
        }
        return true; // Indicate success
    } catch (e) {
        // Log the error and rethrow or handle it as needed
        console.error('Error posting settings to database:', e);
        throw new Error('Failed to post settings: ' + e.message);
    }
}

async function postSingleCarToDatabase(uid,car) {
    try {
        const carQuery = query(collection(db,"cars"),where("owner","==",uid),where("car_number","==",car.car_number));
        const carQuerySnapshot = await getDocs(carQuery);
        if (carQuerySnapshot.size > 0) {
            // Update existing car
            let carDoc = carQuerySnapshot.docs[0];
            await setDoc(carDoc,car,{merge:true});
        } else {
            // Create new car
            await addDoc(collection(db,"cars"),car);
        }
    } catch (e) {
        console.error('Error posting car to database:', e);
        throw new Error('Failed to post car: ' + e.message);
    }
}