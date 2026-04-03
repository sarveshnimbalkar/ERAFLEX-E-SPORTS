type EnvMap = Record<string, string | undefined>;

function readRequired(env: EnvMap, key: string): string {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function readOptional(env: EnvMap, key: string, fallback = ""): string {
  return env[key]?.trim() || fallback;
}

function readNumber(env: EnvMap, key: string, fallback: number): number {
  const raw = env[key]?.trim();
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
}

export const serverEnv = {
  stripeSecretKey: readRequired(process.env, "STRIPE_SECRET_KEY"),
  openAiApiKey: readOptional(process.env, "OPENAI_API_KEY"),
  emailHost: readOptional(process.env, "EMAIL_HOST", "smtp.gmail.com"),
  emailPort: readNumber(process.env, "EMAIL_PORT", 587),
  emailUser: readOptional(process.env, "EMAIL_USER"),
  emailPass: readOptional(process.env, "EMAIL_PASS"),
  emailFrom: readOptional(process.env, "EMAIL_FROM"),
  websiteUrl: readOptional(process.env, "NEXT_PUBLIC_WEBSITE_URL", "http://localhost:3000"),
} as const;

export const hasEmailCredentials =
  serverEnv.emailUser.length > 0 && serverEnv.emailPass.length > 0;
