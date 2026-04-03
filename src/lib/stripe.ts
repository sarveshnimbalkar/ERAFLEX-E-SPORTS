import { loadStripe } from '@stripe/stripe-js';
import { clientEnv } from '@/lib/clientEnv';

// Public key - should be in .env.local
const stripePromise = loadStripe(clientEnv.stripePublishableKey);

export default stripePromise;
