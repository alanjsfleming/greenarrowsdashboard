import { db } from "../firebase";
import getStripe from "./initialiseStripe";
import { collection, doc, onSnapshot,addDoc } from "firebase/firestore";


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
}