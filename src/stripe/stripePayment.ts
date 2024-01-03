import { FirebaseApp } from "firebase/app";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection,addDoc, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

export const getCheckoutUrl = async (
    app: FirebaseApp, 
    priceId: string,
    ):Promise<string> => {
        const auth = getAuth(app);
        const userId = auth.currentUser?.uid;
        if (!userId) {
            throw new Error("User must be logged in");
        }
        const checkoutSessionRef = collection(
            db,"customers",userId,"checkout_sessions"
        );
        
        const docRef = await addDoc(checkoutSessionRef, {
            price: priceId,
            success_url: window.location.origin,
            cancel_url: window.location.origin,
        })

        return new Promise<string>((resolve, reject) => {
            const unsubscribe = onSnapshot(docRef, (snap)=>{
                const { error, url} = snap.data() as {
                    error?: { message: string };
                    url?: string;
                };
                if (error) {
                    unsubscribe();
                    reject(new Error(`An error occurred: ${error.message}`));
                }
                if (url) {
                    console.log(`Stripe Checkout URL: ${url}`);
                    unsubscribe();
                    resolve(url);
                }
                console.log("Checkout session still pending...")
            })
        })
    }


export const getPortalUrl = async(app: FirebaseApp):Promise<string> => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    let dataWithUrl:any;

    try {
        const functions = getFunctions(app, "europe-west2");
        const functionsRef = httpsCallable(
            functions,
            "ext-firestore-stripe-payments-createPortalLink"
        );
        const { data } = await functionsRef({
            returnUrl: window.location.origin,
            customerId: user?.uid,
        });

        // Add a type to the data
        dataWithUrl = data as {url: string};
    } catch (error) {
        throw new Error(`An error occurred while retrieving the portal link: ${error.message}`);
    }
    return new Promise<string>((resolve, reject) => {
        if (dataWithUrl) {
            resolve(dataWithUrl.url);
        } else {
            reject(new Error("No portal link was found"));
        }
    })
}

/*
export async function createCheckoutSession(uid: string) {

    // Create a new checkout session in the subcollection inside this users document
    const userRef = doc(db, "users", uid);
    const checkoutSessionRef = collection(userRef, "checkout_sessions");

    const newCheckoutSessionRef = await addDoc(checkoutSessionRef, {
            price: "price_1NOyjWDW8WPlqGXzCAopO7Tm",
            success_url: window.location.origin,
            cancel_url: window.location.origin,
        });
        
    // Wait for the CheckoutSession to get attached by the extension
    const unsubscribe = onSnapshot(newCheckoutSessionRef, async (snap) => {
        const data = snap.data();
        if (data && data.sessionId) {
            // We have a session, let's redirect to Checkout
            // Init Stripe
            const stripe = await getStripe();
            if (stripe) {
                stripe?.redirectToCheckout({ sessionId: data.sessionId });
                unsubscribe();
            }
        }
    })
}*/