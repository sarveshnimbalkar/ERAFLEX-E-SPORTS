"use client";

import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ReviewSection } from "@/components/shop/ReviewSection";
import type { Product } from "@/types";

import { PRODUCTS } from "@/lib/data/products";

export default function Shop() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-4 md:px-6 lg:px-12 bg-brand-dark">
      <Header />
      
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="space-y-3">
          <h1 className="font-display text-5xl md:text-6xl lg:text-8xl uppercase tracking-tighter">
            THE <span className="text-brand-accent">COLLECTIONS</span>
          </h1>
          <p className="font-indian text-gray-500 tracking-[0.3em] md:tracking-[0.4em] uppercase text-xs md:text-sm">
            Curated Performance Gear for the modern athlete.
          </p>
        </header>

        <ProductGrid initialProducts={PRODUCTS} />

        {/* Review Section */}
        <div className="bg-brand-surface p-6 md:p-10 rounded-md border border-white/5 shadow-xl">
          <ReviewSection productId="shop-general" />
        </div>
      </div>

      <Footer />
    </main>
  );
}
