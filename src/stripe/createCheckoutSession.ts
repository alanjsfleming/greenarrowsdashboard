import { db } from "../firebase";
import getStripe from "./initialiseStripe";
import { collection, doc, setDoc } from "firebase/firestore";

export async function createCheckoutSession(uid: string) {

    // Create a new checkout session in the subcollection inside this users document
   
    const checkoutSessionRef = await db
        .collection("users")
        .doc(uid)
        .collection("checkout_sessions")
        .add({
            price: "price_1NOyjWDW8WPlqGXzCAopO7Tm",
            success_url: window.location.origin,
            cancel_url: window.location.origin,
        });

    // Wait for the CheckoutSession to get attached by the extension
    checkoutSessionRef.onSnapshot(async (snap) => {
        const { sessionId } = snap.data();
        if (sessionId) {
            // We have a session, let's redirect to Checkout
            // Init Stripe
            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
        }
    })
}