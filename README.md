# ERAFLEX E-SPORTS

> Premium sports jersey e-commerce platform — Next.js, Firebase, Stripe, AI, AR.

**Live URL:** https://eraflex-esports.vercel.app

---

## What's New (April 2026)

### 🔥 Product Catalogue — 75 Authentic Kits
- Added `src/lib/data/products.ts` — single source of truth exporting `PRODUCTS: Product[]` with 75 real jerseys spanning football, basketball, and cricket.
- `public/kits/` — 75 locally-hosted PNG/JPG kit images (zero broken hotlinks, no external dependencies).
- `fetch_authentic_kits.js` — scraper script used to source the assets.

### 🛍️ Shop & Checkout Upgrades
- **Shop page** (`src/app/shop/page.tsx`) — replaced hardcoded static array with live import from `PRODUCTS`.
- **Homepage** (`src/app/page.tsx`) — `getRandomProducts()` pulls 9 unique items (3 per sport) randomly from the full catalogue on every load.
- **Hero** (`src/components/home/Hero.tsx`) — fixed all broken local asset URLs; now uses stable high-resolution images.
- **Checkout** (`src/app/checkout/page.tsx`) — UPI Confirm and COD Confirm CTAs wrapped in a `fixed bottom-0` sticky bar for immersive mobile checkout UX.
- **Cart Sidebar** (`src/components/shared/CartSidebar.tsx`) — switched to `h-[100dvh]` so the drawer and checkout button anchor correctly on all mobile devices.
- **Order documents** — `stripePaymentId: undefined` guard added to prevent Firestore `addDoc` errors.

### 🤖 AI Chat (Live Streaming)
- **FloatingChat** (`src/components/shared/FloatingChat.tsx`) — replaced static HTML bubbles with `useChat` from `@ai-sdk/react`. Full streaming AI responses, auto-scroll on new messages, functional input bindings.

### 🪄 AR & Customizer Upgrades
- **Try-On** (`src/app/try-on/page.tsx`) — kit overlay is now fully draggable via Framer Motion `drag` + `dragConstraints`. Fixed broken kit image references in `AVAILABLE_KITS`.
- **Customizer** (`src/app/customize/page.tsx`) — name and number inputs wrapped in `<AnimatePresence mode="popLayout">` for smooth studio-like live preview animations.

### 🎨 Global CSS Fix
- **globals.css** — removed the pink-to-purple gradient from the scrollbar thumb that caused a permanent red bleed on the right side of the site.

### ☁️ Hosting & Deployment
- **Vercel** — primary host for the Next.js app (API routes, dynamic pages, SSR all supported).
- **Firebase** — backend services only: Firestore, Auth, Storage.
- **firebase.json** — hosting block removed; now only declares `firestore.rules` and `storage.rules`.
- **Stripe** — `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` confirmed in Vercel environment.

### 📧 Email System
- Nodemailer (SMTP via Gmail) for welcome emails on sign-up.
- Graceful fallback when SMTP credentials are missing.

### 🔒 Security
- Added `Stability AI` key for image generation (`STABILITY_API_KEY`).
- All API routes protected with in-memory rate limiting.
- Firestore security rules (`firestore.rules`) and Storage rules (`storage.rules`) deployed via Firebase CLI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 / React 19 / TypeScript 5 |
| Styling | Tailwind CSS 4, Framer Motion |
| Auth & DB | Firebase (Auth, Firestore, Storage) |
| Payments | Stripe (payment intents) |
| AI | Vercel AI SDK + OpenAI |
| Email | Nodemailer (SMTP) |
| Hosting | Vercel |
| Image Gen | Stability AI |

---

## Repository Structure

```text
src/
  app/
    api/
      chat/                    ← AI streaming endpoint
      create-payment-intent/   ← Stripe server-side
      send-welcome-email/      ← Nodemailer
    admin/
    auth/
    checkout/
    customize/                 ← Live jersey customizer
    dashboard/
    shop/
      [id]/                    ← Dynamic product detail
    trending/
    try-on/                    ← AR camera try-on
  components/
    home/
    shared/
    shop/
  lib/
    data/
      products.ts              ← 75 authentic products
    server/
      env.ts
      rateLimit.ts
    firebase.ts
    clientEnv.ts
  store/
  types/
public/
  kits/                        ← 75 local jersey images
.github/workflows/
  ci.yml
firebase.json                  ← Firestore + Storage rules only
firestore.rules
storage.rules
```

---

## Prerequisites
- Node.js 20+
- npm 10+

## Environment Setup

Copy `.env.local` and fill in all values (never commit this file):

```env
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# OpenAI
OPENAI_API_KEY=

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM="ERAFLEX E-SPORTS <noreply@example.com>"

# Stability AI (image generation)
STABILITY_API_KEY=
```

---

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`

---

## Quality Gates

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # Next.js production build
npm run check       # lint + typecheck + build in sequence
```

---

## Deployment

The app is deployed on **Vercel** (not Firebase Hosting — Firebase Hosting does not support Next.js API routes and dynamic routes without additional configuration).

**Why Vercel over Firebase Hosting:**

| Feature | Firebase Hosting | Vercel |
|---|---|---|
| Next.js API Routes | ❌ | ✅ |
| Dynamic routes (`/shop/[id]`) | ❌ (needs static export) | ✅ |
| Server-side rendering | ❌ | ✅ |
| Firebase backend (Auth, Firestore) | ✅ | ✅ (via SDK) |

**Deployment checklist:**
1. Set all environment variables in Vercel dashboard.
2. Run `npm run check` before every deploy.
3. Verify Stripe + Firebase credentials in target environment.
4. Smoke test: `/auth`, `/shop`, `/checkout`, `/try-on`, AI chat.

---

## Firebase Configuration

Firebase powers the backend only:
- **Firestore** — orders, users, reviews, products
- **Auth** — email/password sign-in
- **Storage** — product images, user avatars

Deploy security rules:
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

---

## API Hardening

- Input validation on payment and email endpoints
- Currency and amount bounds on payment intents
- In-memory rate limiting on `/api/chat`, `/api/create-payment-intent`, `/api/send-welcome-email`
- Graceful fallback when OpenAI or SMTP config is missing

> For multi-instance production: replace in-memory rate limiter with Redis or Upstash.

---

## Security Headers

Configured in `next.config.ts` for all routes:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(self), microphone=(), geolocation=()
```

---

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on every PR and push to `main`:
1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`

---

## Contribution Workflow

1. Branch from `main`.
2. Keep changes scoped and typed (`strict: true`).
3. Run `npm run check` locally before opening a PR.
4. Include screenshots for any UI-affecting changes.

---

## License

Use according to project owner policy.
