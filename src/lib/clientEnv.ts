function getRequiredClientEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required client environment variable: ${key}`);
  }
  return value;
}

export const clientEnv = {
  firebaseApiKey: getRequiredClientEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  firebaseAuthDomain: getRequiredClientEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  firebaseProjectId: getRequiredClientEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  firebaseStorageBucket: getRequiredClientEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  firebaseMessagingSenderId: getRequiredClientEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  firebaseAppId: getRequiredClientEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  stripePublishableKey: getRequiredClientEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
} as const;
