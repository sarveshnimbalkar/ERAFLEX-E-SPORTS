import { loadStripe } from '@stripe/stripe-js';

// Public key - should be in .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default stripePromise;
