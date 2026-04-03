function getRequiredClientEnv(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(`Missing required client environment variable: ${key}`);
  }
  return value.trim();
}

export const clientEnv = {
  firebaseApiKey: getRequiredClientEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "NEXT_PUBLIC_FIREBASE_API_KEY"),
  firebaseAuthDomain: getRequiredClientEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  firebaseProjectId: getRequiredClientEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  firebaseStorageBucket: getRequiredClientEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  firebaseMessagingSenderId: getRequiredClientEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  firebaseAppId: getRequiredClientEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "NEXT_PUBLIC_FIREBASE_APP_ID"),
  stripePublishableKey: getRequiredClientEnv(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
} as const;
