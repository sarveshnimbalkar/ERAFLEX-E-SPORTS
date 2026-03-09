# ⚡ ERAFLEX E-SPORTS — Quick Setup Guide

> Get the project running on your local machine in **under 5 minutes**.

---

## ✅ Step 1: Prerequisites

Make sure these are installed on your system before proceeding:

| Tool | Minimum Version | Check Command | Download Link |
|---|---|---|---|
| **Node.js** | `v18.17+` | `node -v` | [nodejs.org](https://nodejs.org/) |
| **npm** | `v9+` | `npm -v` | Comes with Node.js |
| **Git** | Any recent version | `git --version` | [git-scm.com](https://git-scm.com/) |

> 💡 **Recommended:** Use **Node.js v20 LTS** for the best compatibility.

---

## ✅ Step 2: Clone the Repository

```bash
git clone https://github.com/sarveshnimbalkar/ERAFLEX-E-SPORTS.git
cd ERAFLEX-E-SPORTS
```

---

## ✅ Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`. It may take 1-2 minutes on the first run.

---

## ✅ Step 4: Set Up Environment Variables

Create a file named **`.env.local`** in the project root directory (same level as `package.json`):

```bash
# Windows (PowerShell)
New-Item .env.local

# macOS / Linux
touch .env.local
```

Open `.env.local` in your editor and paste the following, replacing the placeholder values:

```env
# ─── Firebase ──────────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ─── Stripe ───────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

> 🔐 **Where to get these keys?**
> - **Firebase keys** → [Firebase Console](https://console.firebase.google.com/) → Your Project → Project Settings → General → Your apps → SDK config
> - **Stripe keys** → [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → Developers → API keys

> ⚠️ **Note:** For development, Firebase config is currently hardcoded in `src/lib/firebase.ts`, so the app will work without Firebase env vars. However, Stripe env vars are **required** for checkout to function.

---

## ✅ Step 5: Start the Development Server

```bash
npm run dev
```

You should see output like:

```
  ▲ Next.js 16.1.6
  - Local:   http://localhost:3000
  - Ready in Xs
```

🎉 **Open [http://localhost:3000](http://localhost:3000) in your browser — you're done!**

---

## 🗂️ Quick Reference: Project Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot-reload at `localhost:3000` |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint to check for code issues |

---

## 📁 Quick Reference: Key Files & Folders

| Path | What it is |
|---|---|
| `src/app/` | All page routes (each folder = one route) |
| `src/app/layout.tsx` | Root layout — fonts, providers, metadata |
| `src/app/globals.css` | Global CSS + Tailwind imports |
| `src/components/shared/` | Shared components (Header, Footer, Cart, etc.) |
| `src/components/shop/` | Shop-specific components (ProductCard, ProductGrid) |
| `src/lib/firebase.ts` | Firebase initialization |
| `src/lib/db.ts` | Firestore database service functions |
| `src/lib/stripe.ts` | Stripe client initialization |
| `src/store/useCartStore.ts` | Cart state management (Zustand) |
| `src/store/useUserStore.ts` | User auth state management (Zustand) |
| `tailwind.config.ts` | Tailwind theme (colors, fonts, animations) |
| `public/images/` | Static images (jersey PNGs, logos) |

---

## 🐛 Troubleshooting

### ❌ `npm install` fails
```bash
# Delete node_modules and lock file, then retry
rm -rf node_modules package-lock.json   # macOS/Linux
Remove-Item -Recurse node_modules, package-lock.json   # Windows PowerShell
npm install
```

### ❌ Port 3000 is already in use
```bash
# Use a different port
npm run dev -- --port 3001
```

### ❌ TypeScript errors on build
```bash
# These are usually due to missing types, try:
npm install
npm run build
```

### ❌ Firebase / Auth not working
- Make sure the Firebase project has **Authentication** enabled (Email/Password or Google sign-in)
- Verify your Firebase config values match the console
- Check that `localhost` is added as an authorized domain in Firebase Auth settings

### ❌ Stripe checkout not working
- Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
- For testing, use Stripe's [test card numbers](https://stripe.com/docs/testing#cards): `4242 4242 4242 4242`

### ❌ Images not loading
- Product images should be placed in `public/images/`
- Reference them in code as `/images/filename.png` (without `public/` prefix)

---

## 🧑‍💻 Start Developing

Once the server is running, here's where to start based on what you want to work on:

| I want to... | Go to... |
|---|---|
| Edit the homepage | `src/app/page.tsx` |
| Edit navigation / header | `src/components/shared/Header.tsx` |
| Edit the footer | `src/components/shared/Footer.tsx` |
| Add a new page/route | Create `src/app/your-route/page.tsx` |
| Modify the shop catalog | `src/app/shop/page.tsx` + `src/components/shop/` |
| Change the jersey customizer | `src/app/customize/page.tsx` |
| Update cart behavior | `src/store/useCartStore.ts` |
| Update auth behavior | `src/store/useUserStore.ts` + `src/components/shared/FirebaseAuthProvider.tsx` |
| Add database operations | `src/lib/db.ts` |
| Change theme colors/fonts | `tailwind.config.ts` |
| Add global styles | `src/app/globals.css` |

---

## 🔗 Useful Links

- 📖 [Full README](./README.md) — Complete project documentation
- 🔥 [Firebase Console](https://console.firebase.google.com/)
- 💳 [Stripe Dashboard](https://dashboard.stripe.com/)
- ⚡ [Next.js Docs](https://nextjs.org/docs)
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com/docs)
- 🎬 [Framer Motion Docs](https://www.framer.com/motion/)
- 🧸 [Zustand Docs](https://zustand-demo.pmnd.rs/)

---

<p align="center">
  Happy coding! 🚀 — <strong>Team ERAFLEX</strong>
</p>
