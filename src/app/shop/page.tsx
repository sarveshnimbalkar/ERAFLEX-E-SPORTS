"use client";

import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ReviewSection } from "@/components/shop/ReviewSection";
import { Product } from "@/store/useCartStore";

// Static data for now, would be fetched from Firestore in a later phase
const initialProducts: Product[] = [
  {
    id: "fb-1",
    name: "Real Madrid Home Kit 24/25",
    team: "Real Madrid CF",
    price: 4999,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600",
    category: "Football",
    rating: 5,
  },
  {
    id: "fb-2",
    name: "Manchester City Home Kit 24/25",
    team: "Manchester City",
    price: 4499,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600",
    category: "Football",
    rating: 4,
  },
  {
    id: "cr-1",
    name: "India World Cup Jersey",
    team: "Team India",
    price: 2999,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600",
    category: "Cricket",
    rating: 5,
  },
  {
    id: "bk-1",
    name: "Lakers Icon Edition",
    team: "LA Lakers",
    price: 5999,
    image: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=600",
    category: "Basketball",
    rating: 5,
  },
  {
    id: "fb-3",
    name: "FC Barcelona Home Kit 24/25",
    team: "FC Barcelona",
    price: 4799,
    image: "https://images.unsplash.com/photo-1431324155629-1a6eda1eedfa?w=600",
    category: "Football",
    rating: 4,
  },
  {
    id: "fb-4",
    name: "Arsenal FC Home Kit 24/25",
    team: "Arsenal FC",
    price: 4299,
    image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600",
    category: "Football",
    rating: 5,
  },
  {
    id: "fb-5",
    name: "PSG Home Kit 24/25",
    team: "Paris Saint-Germain",
    price: 5299,
    image: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=600",
    category: "Football",
    rating: 4,
  },
  {
    id: "fb-6",
    name: "AC Milan Home Kit 24/25",
    team: "AC Milan",
    price: 3999,
    image: "https://images.unsplash.com/photo-1541534741688-6078c64b5913?w=600",
    category: "Football",
    rating: 5,
  },
];

export default function Shop() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-4 md:px-6 lg:px-12 bg-brand-dark">
      <Header />
      
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="space-y-3">
          <h1 className="font-display text-5xl md:text-6xl lg:text-8xl italic uppercase tracking-tighter">
            THE <span className="text-brand-accent">COLLECTIONS</span>
          </h1>
          <p className="font-indian text-gray-500 tracking-[0.3em] md:tracking-[0.4em] uppercase text-xs md:text-sm">
            Curated Performance Gear for the modern athlete.
          </p>
        </header>

        <ProductGrid initialProducts={initialProducts} />

        {/* Review Section */}
        <div className="bg-brand-surface p-6 md:p-10 rounded-3xl border border-white/5">
          <ReviewSection productId="shop-general" />
        </div>
      </div>

      <Footer />
    </main>
  );
}
