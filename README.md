<p align="center">
  <img src="public/images/eraflex-logo.png" alt="ERAFLEX Logo" width="200" />
</p>

<h1 align="center">⚽ ERAFLEX E-SPORTS</h1>

<p align="center">
  <strong>Premium Football Jerseys & Performance Gear for the Elite</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#firebase-schema">Firebase Schema</a> •
  <a href="#pages--routes">Routes</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## 📌 Overview

**ERAFLEX E-SPORTS** is a full-stack e-commerce web application for premium sports jerseys (Football, Basketball, Cricket). It features a sleek, dark-themed UI with dynamic animations, Stripe + COD checkout, Firebase authentication & database, admin dashboard with analytics, customer reviews, and a wishlist system.

> 📖 **New to the project?** Check out [QUICKSETUP.md](./QUICKSETUP.md) for a step-by-step guide to get the project running on your machine in under 5 minutes.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Landing Page** | Animated hero section with loading screen, product recommendations, and CTAs |
| 🛍️ **Shop** | Browse jerseys by category with filters, search, sorting, and review section |
| 🎨 **Jersey Customizer** | 2D image-based jersey customization with name, number, and font style overlay |
| 📸 **AR Virtual Try-On** | AI-powered AR lens 2.0 with body tracking simulation and selection bar |
| 🔥 **Trending** | Trending products page with reviews |
| 🛒 **Cart & Checkout** | Persistent cart (Zustand + localStorage), sidebar cart, multi-step checkout |
| 💳 **Stripe Payments** | Secure credit/debit card payment via Stripe |
| 💵 **Cash on Delivery** | COD option with pending payment tracking |
| 🔐 **Authentication** | Firebase Auth (email/password + Google) with Terms Acceptance |
| 📊 **User Dashboard** | 6-tab dashboard: Profile, Orders, Payments, Wishlist, Reviews, Settings |
| 🛡️ **Admin Dashboard** | Overview stats, order management, customer management, sales analytics with charts |
| ⭐ **Enhanced Reviews** | Verified buyer badges, image uploads, sorting, and star ratings |
| ❤️ **Wishlist** | Add/remove favorites via Firebase subcollection |
| 🤖 **AI Chat Assistant** | GPT-powered brand specialist with product knowledge and FAQs |
| 🔔 **Toast Notifications** | Success/error feedback with react-hot-toast |
| 💀 **Loading Skeletons** | Shimmer loading states for data-heavy components |
| 🎭 **Premium UI/UX** | Framer Motion animations, glassmorphism, custom cursor, Google Fonts |
| 📩 **Newsletter** | Join the elite list for early access and drops |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | `16.1.6` | React framework (App Router) |
| [React](https://react.dev/) | `19.2.3` | UI library |
| [TypeScript](https://www.typescriptlang.org/) | `^5` | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | `v4` | Utility-first CSS framework |
| [Framer Motion](https://www.framer.com/motion/) | `^12.35.1` | Animations & transitions |
| [Recharts](https://recharts.org/) | Latest | Admin dashboard charts |
| [Lucide React](https://lucide.dev/) | `^0.577.0` | Icon library |
| [react-hot-toast](https://react-hot-toast.com/) | Latest | Toast notifications |

### Backend / Services
| Technology | Purpose |
|---|---|
| [Firebase Auth](https://firebase.google.com/products/auth) | User authentication (email, Google) |
| [Cloud Firestore](https://firebase.google.com/products/firestore) | NoSQL database (users, orders, reviews) |
| [Firebase Storage](https://firebase.google.com/products/storage) | File/image storage |
| [Stripe](https://stripe.com/) | Payment processing |

### State Management
| Technology | Purpose |
|---|---|
| [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight state management |
| `zustand/middleware` (persist) | Cart persistence via localStorage |

---

## 📁 Project Structure

```
ERAFLEX-E-SPORTS/
├── public/
│   └── images/                   # Static images (jerseys, logos)
│
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout (fonts, providers, toast)
│   │   ├── page.tsx              # Homepage
│   │   ├── globals.css           # Global styles + animations
│   │   ├── admin/page.tsx        # Admin Dashboard (4 panels + charts)
│   │   ├── auth/page.tsx         # Login / Register
│   │   ├── checkout/page.tsx     # Multi-step checkout (Stripe + COD)
│   │   ├── customize/page.tsx    # Jersey customizer
│   │   ├── dashboard/page.tsx    # User Dashboard (6 tabs)
│   │   ├── shop/page.tsx         # Product catalog + reviews
│   │   ├── trending/page.tsx     # Trending products + reviews
│   │   └── try-on/page.tsx       # AR virtual try-on
│   │
│   ├── components/
│   │   ├── shared/               # Global components
│   │   │   ├── Header.tsx            # Navigation (responsive)
│   │   │   ├── Footer.tsx            # Site footer
│   │   │   ├── CartSidebar.tsx       # Slide-out cart → checkout
│   │   │   ├── ChatWidget.tsx        # Chat support
│   │   │   ├── FirebaseAuthProvider.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── RecommendedProducts.tsx
│   │   │   └── ToastProvider.tsx     # Toast notifications
│   │   ├── home/
│   │   │   └── Hero.tsx
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx       # Card with wishlist & add-to-cart
│   │   │   ├── ProductGrid.tsx       # Filterable grid
│   │   │   └── ReviewSection.tsx     # Star ratings + reviews (CRUD)
│   │   └── ui/
│   │       ├── Skeleton.tsx          # Loading skeletons
│   │       └── StarRating.tsx        # Interactive star rating
│   │
│   ├── lib/                      # Services & utilities
│   │   ├── firebase.ts           # Firebase initialization
│   │   ├── db.ts                 # Firestore services (user, order, review, wishlist, analytics)
│   │   ├── stripe.ts             # Stripe client
│   │   └── utils.ts              # cn() utility
│   │
│   ├── store/                    # Zustand stores
│   │   ├── useCartStore.ts       # Cart state
│   │   └── useUserStore.ts       # User auth state
│   │
│   ├── hooks/                    # Custom hooks
│   └── types/
│       └── index.ts              # All TypeScript interfaces
│
├── tailwind.config.ts            # Custom theme
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
└── package.json                  # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `v18.17+` (recommended: `v20 LTS`)
- **npm** `v9+`
- **Git**

### Installation

```bash
git clone https://github.com/sarveshnimbalkar/ERAFLEX-E-SPORTS.git
cd ERAFLEX-E-SPORTS
npm install
npm run dev
```

The app runs at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Environment Variables

Create `.env.local` in the project root:

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
```

---

## 📄 Pages & Routes

| Route | Page | Auth |
|---|---|---|
| `/` | Homepage | ❌ |
| `/shop` | Product catalog + reviews | ❌ |
| `/trending` | Trending products + reviews | ❌ |
| `/customize` | Jersey Customizer | ❌ |
| `/try-on` | AR Virtual Try-On | ❌ |
| `/auth` | Login / Register | ❌ |
| `/checkout` | Multi-step checkout (Stripe + COD) | ✅ |
| `/dashboard` | User Dashboard (6 tabs) | ✅ |
| `/admin` | Admin Dashboard (4 panels) | ✅ |

---

## 🗄️ Firebase Schema

### `users/{uid}`
```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "pincode": "string",
  "role": "user | admin",
  "createdAt": "Timestamp"
}
```

### `users/{uid}/wishlist/{productId}`
```json
{
  "productId": "string",
  "addedAt": "Timestamp"
}
```

### `orders/{orderId}`
```json
{
  "userId": "string",
  "userEmail": "string",
  "userName": "string",
  "items": [
    { "productId": "", "name": "", "team": "", "image": "", "price": 0, "quantity": 0 }
  ],
  "shippingAddress": {
    "fullName": "", "street": "", "city": "", "state": "", "pincode": "", "phone": ""
  },
  "subtotal": 0,
  "shippingCharges": 0,
  "total": 0,
  "paymentMethod": "stripe | cod",
  "paymentStatus": "Paid | Pending | Failed | Refunded",
  "stripePaymentId": "string (optional)",
  "orderStatus": "Processing | Confirmed | Shipped | Delivered | Cancelled",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

### `reviews/{reviewId}`
```json
{
  "userId": "string",
  "userName": "string",
  "userPhoto": "string (optional)",
  "productId": "string",
  "rating": 1-5,
  "comment": "string",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp (optional)"
}
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server (hot-reload) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint check |

---

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `brand-dark` | `#050510` | Background |
| `brand-surface` | `#0f0c29` | Cards/surfaces |
| `brand-accent` | `#ff0055` | Primary accent |
| `brand-gold` | `#ffaa00` | Prices, secondary |
| `brand-success` | `#39ff14` | Success states |
| `brand-cyan` | `#00f0ff` | Highlights |
| `brand-purple` | `#7000ff` | Tertiary accent |

### Typography
| Font | Usage |
|---|---|
| **Inter** | Body text |
| **Bebas Neue** | Display headings |
| **Rajdhani** | Subheadings, labels |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

### Commit Convention
`feat:` | `fix:` | `docs:` | `style:` | `refactor:` | `test:` | `chore:`

---

## 📋 Architecture Decisions

- **Next.js App Router** — File-system routing with RSC support
- **Zustand** — Lightweight state, zero boilerplate
- **Firebase** — Serverless backend for rapid iteration
- **Recharts** — Declarative charts for admin analytics
- **react-hot-toast** — Non-intrusive notifications

---

<p align="center">
  Built with ❤️ by the <strong>ERAFLEX</strong> Team
</p>
