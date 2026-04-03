# ⚡ ERAFLEX E-SPORTS — Quick Setup Guide

> Get the project running locally in under 5 minutes.

---

## 📋 Prerequisites

| Tool | Minimum Version | Check |
|---|---|---|
| Node.js | `v18.17+` | `node -v` |
| npm | `v9+` | `npm -v` |
| Git | Latest | `git --version` |

---

## 🚀 Steps

### 1. Clone the Repository

```bash
git clone https://github.com/sarveshnimbalkar/ERAFLEX-E-SPORTS.git
cd ERAFLEX-E-SPORTS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the **project root**:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Email (Welcome emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password_or_app_password
EMAIL_FROM="ERAFLEX E-SPORTS <your_smtp_username>"
```

> 🔒 **Ask the project lead** for the actual Firebase, Stripe, and email SMTP credentials.  
> ⚠️ **Never commit** `.env.local` to git (it's already in `.gitignore`).

### 4. Start the Dev Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Verify Everything Works

| Page | URL | What to Check |
|---|---|---|
| Homepage | `/` | Loading animation → hero section renders |
| Shop | `/shop` | Products grid loads, filters work, reviews section visible |
| Auth | `/auth` | Login/Register forms visible, Google sign-in button |
| Dashboard | `/dashboard` | Requires login → redirects to auth if not logged in |
| Admin | `/admin` | Overview stats, charts, order management panels |
| Checkout | `/checkout` | Redirects to shop if cart is empty |
| Trending | `/trending` | Trending products + review section |

---

## 🧩 Key Files Reference

| What | File |
|---|---|
| Firebase config | `src/lib/firebase.ts` |
| Database services | `src/lib/db.ts` |
| Stripe config | `src/lib/stripe.ts` |
| Types/interfaces | `src/types/index.ts` |
| Cart state | `src/store/useCartStore.ts` |
| User state | `src/store/useUserStore.ts` |
| Root layout | `src/app/layout.tsx` |
| Theme config | `tailwind.config.ts` |
| Global CSS | `src/app/globals.css` |

---

## 🔧 Common Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Create production build |
| `npm run start` | Run production build |
| `npm run lint` | Check for linting issues |

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| `Module not found` errors | Run `npm install` again |
| Firebase connection errors | Verify `.env.local` values match your Firebase project |
| Blank page / hydration errors | Clear `.next/` folder → `rmdir /s .next` then `npm run dev` |
| Stripe not working | Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set |
| Port 3000 busy | Kill process using port or use `npm run dev -- -p 3001` |
| `tsc` errors in `.next/types/` | These are auto-generated, safe to ignore |

---

## 📊 Firebase Collections

| Collection | Description |
|---|---|
| `users` | User profiles & authentication data |
| `users/{uid}/wishlist` | User's wishlist items (subcollection) |
| `orders` | All orders with items, shipping, payment info |
| `reviews` | Product reviews with star ratings |
| `products` | Product catalog (optional — currently uses static data) |

---

## 🏗️ Architecture Overview

```
User → Next.js (App Router) → Components → Zustand Stores → Firebase Services
                                              ↓
                                         Firestore DB
                                              ↓
                                    Admin Dashboard Analytics
```

---

<p align="center">
  Questions? Reach out to the team lead or check <a href="./README.md">README.md</a>
</p>
