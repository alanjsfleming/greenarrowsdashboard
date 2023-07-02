import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Stripe | null;

const initialiseStripe = async () => {
    if (!stripePromise) {
        stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
};

export default initialiseStripe;