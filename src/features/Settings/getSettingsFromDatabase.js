import { doc, getDoc, getDocs } from "firebase/firestore";

async function getUserSettingsFromDatabase(uid) {
    const docRef = doc(db, "users", uid);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            throw new Error('Document does not exist');
        }
    } catch (e) {
        throw new Error('Failed to get document: ' + e.message);
    }
}

async function getCarSettingsFromDatabase(uid) {
    const carQuery = query(collection(db,"cars"),where("owner","==",uid),orderBy("car_number"));
    const carQuerySnapshot = await getDocs(carQuery);
    let carSettings = [];
    carQuerySnapshot.forEach((doc) => {
        let carData = doc.data();
        carSettings.push(doc.data());
    });
}

export default async function getSettingsFromDatabase(uid) {
    try {
        const userSettings = await getUserSettingsFromDatabase(uid);
        return userSettings.settings;
    } catch (e) {
        throw new Error('Failed to get settings: ' + e.message);
    }
}