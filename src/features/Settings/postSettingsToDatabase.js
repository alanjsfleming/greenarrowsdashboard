import { doc, setDoc } from "firebase/firestore";

export async function postSettingsToDatabase(uid, data) {
    const docRef = doc(db, "users", uid);

    try {
        // Wait for the document to be set
        await setDoc(docRef, data, { merge: true });
        return true; // Indicate success
    } catch (e) {
        // Log the error and rethrow or handle it as needed
        console.error('Error posting settings to database:', e);
        throw new Error('Failed to post settings: ' + e.message);
    }
}