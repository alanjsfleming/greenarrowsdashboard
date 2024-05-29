import { FirebaseApp } from "firebase/app";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";


export const getMembershipStatus = async (app: FirebaseApp) => {
    const auth = getAuth(app);
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
        throw new Error("User not logged in");
    }

    const subscriptionsRef = collection(db,"customers",userId,"subscriptions");
    const q = query(
        subscriptionsRef,
        where("status","in",[ "trialing", "active"])
    );
    
    return new Promise<boolean>((resolve, reject) => {
        const unsubscribe = onSnapshot(
            q,
            (snapshot)=> {
                // In this impementation we only expect one active or trialing subscription to exist.
                if (snapshot.docs.length ===0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
                unsubscribe();
            },
            reject
        )
    })
}
