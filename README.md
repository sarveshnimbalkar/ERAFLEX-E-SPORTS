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
  <a href="#environment-variables">Env Variables</a> •
  <a href="#pages--routes">Routes</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## 📌 Overview

**ERAFLEX E-SPORTS** is a full-stack e-commerce web application for premium sports jerseys (Football, Basketball, Cricket). It features a sleek, dark-themed UI with dynamic animations, a jersey customizer, AR virtual try-on, Stripe-powered checkout, and Firebase-backed authentication & database.

> 📖 **New to the project?** Check out [QUICKSETUP.md](./QUICKSETUP.md) for a step-by-step guide to get the project running on your machine in under 5 minutes.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Landing Page** | Animated hero section with loading screen, product recommendations, and CTAs |
| 🛍️ **Shop** | Browse jerseys by category (Football, Basketball, Cricket) with product cards |
| 🎨 **Jersey Customizer** | 2D image-based jersey customization with name, number, and font style overlay |
| 📸 **AR Virtual Try-On** | AI-powered AR lens to preview jerseys on yourself in real-time |
| 🔥 **Trending** | View trending and popular products |
| 🛒 **Cart & Checkout** | Persistent cart (Zustand + localStorage), sidebar cart, and Stripe checkout integration |
| 🔐 **Authentication** | Firebase Auth with protected routes and user profiles |
| 📊 **User Dashboard** | Order history and profile management |
| 🛡️ **Admin Panel** | Admin-specific management panel |
| 💬 **Chat Widget** | Integrated chat support widget available across all pages |
| 🎭 **Premium UI/UX** | Framer Motion animations, glassmorphism, custom cursor, Google Fonts (Inter, Bebas Neue, Rajdhani) |

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
| [Lucide React](https://lucide.dev/) | `^0.577.0` | Icon library |
| [Three.js](https://threejs.org/) | `^0.183.2` | 3D rendering (customizer) |

### Backend / Services
| Technology | Purpose |
|---|---|
| [Firebase Auth](https://firebase.google.com/products/auth) | User authentication (email, social login) |
| [Cloud Firestore](https://firebase.google.com/products/firestore) | NoSQL database (users, products, orders) |
| [Firebase Storage](https://firebase.google.com/products/storage) | File/image storage |
| [Stripe](https://stripe.com/) | Payment processing |

### State Management
| Technology | Purpose |
|---|---|
| [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight state management  |
| `zustand/middleware` (persist) | Cart persistence via localStorage |

---

## 📁 Project Structure

```
ERAFLEX-E-SPORTS/
├── public/
│   └── images/               # Static images (jerseys, logos, etc.)
│
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout (fonts, providers, metadata)
│   │   ├── page.tsx          # Homepage (hero, recommendations, CTAs)
│   │   ├── globals.css       # Global styles & Tailwind imports
│   │   ├── admin/            # Admin panel page
│   │   ├── auth/             # Authentication (login/signup) page
│   │   ├── checkout/         # Stripe checkout page
│   │   ├── customize/        # Jersey customizer page
│   │   ├── dashboard/        # User dashboard page
│   │   ├── shop/             # Product shop/catalog page
│   │   ├── trending/         # Trending products page
│   │   └── try-on/           # AR virtual try-on page
│   │
│   ├── components/
│   │   ├── shared/           # Shared/global components
│   │   │   ├── Header.tsx        # Navigation header
│   │   │   ├── Footer.tsx        # Site footer
│   │   │   ├── CartSidebar.tsx   # Slide-out cart drawer
│   │   │   ├── ChatWidget.tsx    # Floating chat support widget
│   │   │   ├── CustomCursor.tsx  # Custom animated cursor
│   │   │   ├── FirebaseAuthProvider.tsx  # Auth context provider
│   │   │   ├── LoadingScreen.tsx # Animated loading screen
│   │   │   ├── ProtectedRoute.tsx # Auth-guarded route wrapper
│   │   │   └── RecommendedProducts.tsx  # Product recommendation carousel
│   │   ├── home/
│   │   │   └── Hero.tsx          # Homepage hero section
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx   # Individual product card
│   │   │   └── ProductGrid.tsx   # Product listing grid
│   │   ├── dashboard/        # Dashboard-specific components
│   │   └── ui/               # Reusable UI primitives
│   │
│   ├── lib/                  # Library/utility functions
│   │   ├── firebase.ts       # Firebase app initialization
│   │   ├── db.ts             # Firestore database service (CRUD)
│   │   ├── stripe.ts         # Stripe client initialization
│   │   └── utils.ts          # General utility functions
│   │
│   ├── store/                # Zustand state stores
│   │   ├── useCartStore.ts   # Cart state (items, add, remove, total)
│   │   └── useUserStore.ts   # User auth state (profile, login status)
│   │
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript type definitions
│
├── legacy/                   # Legacy/archived code
├── tailwind.config.ts        # Tailwind CSS configuration (custom theme)
├── tsconfig.json             # TypeScript configuration
├── next.config.ts            # Next.js configuration
├── postcss.config.mjs        # PostCSS config (Tailwind plugin)
├── eslint.config.mjs         # ESLint configuration
├── package.json              # Dependencies & scripts
└── .gitignore                # Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** — `v18.17+` (recommended: `v20 LTS` or later)
- **npm** — `v9+` (comes with Node.js)
- **Git** — for cloning the repository

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sarveshnimbalkar/ERAFLEX-E-SPORTS.git

# 2. Navigate into the project directory
cd ERAFLEX-E-SPORTS

# 3. Install dependencies
npm install

# 4. Create your environment file (see section below)
# Copy .env.example to .env.local and fill in your keys

# 5. Start the development server
npm run dev
```

The app will be running at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ─── Firebase Configuration ───────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ─── Stripe Configuration ────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

> ⚠️ **Important:** Never commit your `.env.local` file to version control. It is already listed in `.gitignore`.

> 💡 **Note:** The Firebase config is currently hardcoded in `src/lib/firebase.ts` for development. For production, migrate these values to environment variables.

---

## 📄 Pages & Routes

| Route | Page | Auth Required? |
|---|---|---|
| `/` | Homepage (Hero, Recommendations, Customizer & Try-On CTAs) | ❌ No |
| `/shop` | Product catalog with category filtering | ❌ No |
| `/trending` | Trending & popular products | ❌ No |
| `/customize` | Jersey Customizer (name, number, font) | ❌ No |
| `/try-on` | AR Virtual Try-On | ❌ No |
| `/auth` | Login / Sign Up | ❌ No |
| `/checkout` | Stripe-powered checkout | ✅ Yes |
| `/dashboard` | User profile & order history | ✅ Yes |
| `/admin` | Admin management panel | ✅ Yes (Admin) |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (with hot-reload) |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check for code issues |

---

## 🎨 Design System

The project uses a custom dark-themed design system defined in `tailwind.config.ts`:

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `brand-dark` | `#050510` | Primary background (Deep Space Purple-Black) |
| `brand-surface` | `#0f0c29` | Card/surface backgrounds (Cyber Void) |
| `brand-accent` | `#ff0055` | Primary accent (Hot Pink/Red) |
| `brand-gold` | `#ffaa00` | Secondary accent (Gold) |
| `brand-success` | `#39ff14` | Success states (Toxic Acid Green) |
| `brand-cyan` | `#00f0ff` | Highlight accent (Outrun Cyan) |
| `brand-purple` | `#7000ff` | Tertiary accent (Electric Purple) |

### Typography
| Font | Variable | Usage |
|---|---|---|
| **Inter** | `--font-inter` | Body text, general UI |
| **Bebas Neue** | `--font-bebas-neue` | Display headings, hero text |
| **Rajdhani** | `--font-rajdhani` | Subheadings, Indian-inspired text |

---

## 🗄️ Database Schema (Firestore)

The app uses three main Firestore collections:

### `users`
```
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  phoneNumber: string
}
```

### `products`
```
{
  id: string,
  name: string,
  team: string,
  price: number,
  image: string,
  category: "Football" | "Cricket" | "Basketball",
  brand?: string,
  rating?: number
}
```

### `orders`
```
{
  id: string,
  userId: string,
  items: CartItem[],
  total: number,
  createdAt: Timestamp
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with clear messages:
   ```bash
   git commit -m "feat: add new payment method support"
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open** a Pull Request against `main`

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code formatting (no logic change) |
| `refactor:` | Code restructuring |
| `test:` | Adding/updating tests |
| `chore:` | Build process, tooling changes |

---

## 📋 Key Architecture Decisions

- **Next.js App Router** — File-system routing with React Server Components support
- **Zustand over Redux** — Lightweight, minimal boilerplate state management ideal for this project's scale
- **Firebase** — Serverless backend (no separate API server needed) for rapid iteration
- **Tailwind CSS v4** — Utility-first styling with custom design tokens via `tailwind.config.ts`
- **Framer Motion** — Declarative animations tightly integrated with React component lifecycle

---

## 📞 Support

If you encounter any issues or have questions, reach out to the team:

- Open an issue on [GitHub Issues](https://github.com/sarveshnimbalkar/ERAFLEX-E-SPORTS/issues)
- Contact the maintainer: **@sarveshnimbalkar**

---

<p align="center">
  Built with ❤️ by the <strong>ERAFLEX</strong> Team
</p>
