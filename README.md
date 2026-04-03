# ERAFLEX E-SPORTS

Production-ready Next.js commerce platform for sports apparel with Firebase auth/data, Stripe payments, AI chat, and AR try-on.

## Highlights
- Next.js App Router with TypeScript strict mode
- Firebase Auth, Firestore, and Storage integration
- Stripe payment intents with API-side validation
- AI chat endpoint with request throttling
- AR try-on experience with pose tracking
- CI pipeline for lint, typecheck, and build
- Environment validation for client and server runtime

## Tech Stack
- Runtime: Next.js 16, React 19, TypeScript 5
- Styling: Tailwind CSS 4, Framer Motion
- Data/Auth: Firebase
- Payments: Stripe
- Email: Nodemailer (SMTP)
- AI: AI SDK + OpenAI provider

## Repository Structure
```text
src/
  app/
    api/
      chat/
      create-payment-intent/
      send-welcome-email/
    admin/
    auth/
    checkout/
    customize/
    dashboard/
    shop/
    trending/
    try-on/
  components/
  lib/
    server/
      env.ts
      rateLimit.ts
    clientEnv.ts
  store/
  types/
.github/workflows/
  ci.yml
```

## Prerequisites
- Node.js 20+
- npm 10+

## Environment Setup
1. Copy `.env.example` to `.env.local`.
2. Fill all required values.
3. Never commit `.env.local`.

Required variables:
```env
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

OPENAI_API_KEY=

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM="ERAFLEX E-SPORTS <noreply@example.com>"
```

## Local Development
```bash
npm install
npm run dev
```

App URL: `http://localhost:3000`

## Quality Gates
```bash
npm run lint
npm run typecheck
npm run build
npm run check
```

`npm run check` runs lint, typecheck, and build in sequence.

## API Hardening Included
- Input validation for payment and email APIs
- Currency and amount bounds on payment intents
- Basic in-memory rate limiting on chat, payment, and email routes
- Graceful fallback when OpenAI or SMTP configuration is missing

## Security Defaults
Configured in `next.config.ts`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restrictions for browser capabilities
- `poweredByHeader` disabled

## CI
GitHub Actions workflow at `.github/workflows/ci.yml` runs:
1. Install dependencies (`npm ci`)
2. Lint
3. Typecheck
4. Build

on every PR and push to `main`.

## Deployment Checklist
1. Set all production environment variables.
2. Run `npm run check` before deployment.
3. Verify Stripe and Firebase credentials in target environment.
4. Verify SMTP credentials (or accept degraded welcome-email behavior).
5. Run a smoke test across `/auth`, `/checkout`, `/try-on`, and API routes.

## Operational Notes
- Rate limiting is in-memory and process-local.
- For multi-instance production, replace with shared storage-backed limiter (Redis or equivalent).
- Keep API logs free of sensitive values.

## Contribution Workflow
1. Create a branch from `main`.
2. Keep changes scoped and typed.
3. Run `npm run check` locally.
4. Open a PR with screenshots for UI-affecting changes.

## License
Use according to project owner policy.
