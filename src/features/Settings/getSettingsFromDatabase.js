import { doc, getDoc } from "firebase/firestore";

export default async function getSettingsFromDatabase(uid) {
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