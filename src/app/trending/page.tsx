"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ReviewSection } from "@/components/shop/ReviewSection";
import type { Product } from "@/types";
import { Flame } from "lucide-react";

const trendingProducts: Product[] = [
  { id: "fb-1", name: "Real Madrid Home Kit", team: "Real Madrid CF", price: 4999, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600", category: "football", sport: "football", description: "Royal white performance kit", stock: 100, rating: 5 },
  { id: "bk-1", name: "Lakers Icon Edition", team: "LA Lakers", price: 5999, image: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=600", category: "basketball", sport: "basketball", description: "Iconic purple and gold", stock: 40, rating: 5 },
  { id: "cr-1", name: "India World Cup Jersey", team: "Team India", price: 2999, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600", category: "cricket", sport: "cricket", description: "Official India world cup edition", stock: 200, rating: 5 },
  { id: "fb-3", name: "FC Barcelona Home Kit", team: "FC Barcelona", price: 4799, image: "https://images.unsplash.com/photo-1431324155629-1a6eda1eedfa?w=600", category: "football", sport: "football", description: "Blaugrana pride", stock: 70, rating: 4 },
  { id: "fb-4", name: "Manchester City Away", team: "Man City", price: 5499, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600", category: "football", sport: "football", description: "City blue dominance", stock: 80, rating: 5 },
  { id: "bk-2", name: "Bulls Statement Edition", team: "Chicago Bulls", price: 6199, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600", category: "basketball", sport: "basketball", description: "Bulls legendary statement", stock: 30, rating: 5 },
];

export default function TrendingPage() {
  return (
    <main className="min-h-screen bg-brand-dark pt-24 pb-12">
      <Header />
      
      {/* Hero Header */}
      <div className="relative py-16 md:py-20 px-4 md:px-6 overflow-hidden mb-8 md:mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 via-brand-surface to-brand-purple/20 opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-30" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-brand-accent/20 border border-brand-accent rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-[0_0_30px_rgba(255,0,85,0.4)]"
          >
            <Flame className="w-8 h-8 md:w-10 md:h-10 text-brand-accent" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl lg:text-8xl italic uppercase tracking-tighter mb-3 md:mb-4"
          >
            HYPE <span className="text-brand-accent">RADAR</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-indian text-gray-400 tracking-[0.2em] md:tracking-[0.3em] uppercase max-w-2xl text-xs md:text-sm leading-relaxed px-4"
          >
            Real-time feed of the most coveted drops. If it&apos;s performing, it&apos;s here.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 space-y-16">
        <ProductGrid initialProducts={trendingProducts} />

        {/* Review Section */}
        <div className="bg-brand-surface p-6 md:p-10 rounded-3xl border border-white/5">
          <ReviewSection productId="trending-general" />
        </div>
      </div>

      <div className="mt-16 md:mt-20">
        <Footer />
      </div>
    </main>
  );
}
