import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getDocs, addDoc, collection, query, where } from "firebase/firestore";



export async function postSettingsToDatabase(uid, data) {
    try {
        const newData = { ...data };
        const docRef = doc(db, "users", uid);
        // Wait for the document to be set
        const newCars = [...newData.cars];
        delete newData.cars;

        // Save user settings
        await setDoc(docRef, newData, { merge: true });
        // Save cars
        for (let car of newCars) {
            const newCar = JSON.parse(JSON.stringify(car));
            console.log(car, newCar)
            await postSingleCarToDatabase(uid,newCar);
        }
        return true; // Indicate success
    } catch (e) {
        // Log the error and rethrow or handle it as needed
        throw new Error('Failed to post settings: ' + e.message);
    }
}

async function postSingleCarToDatabase(uid,car) {
    try {
        console.log(car)
        const carQuery = query(collection(db,"cars"),where("owner","==",uid),where("car_number","==",car.car_number));
        const carQuerySnapshot = await getDocs(carQuery);
        if (carQuerySnapshot.size > 0) {
            // Update existing car
            let carDoc = doc(db,"cars",carQuerySnapshot.docs[0].id);
            await setDoc(carDoc,car,{merge:true});
        } else {
            // Create new car
            console.log("no car found, creating new car")
            await addDoc(collection(db,"cars"),car);
        }
    } catch (e) {
        throw new Error('Failed to post car: ' + e.message);
    }
}