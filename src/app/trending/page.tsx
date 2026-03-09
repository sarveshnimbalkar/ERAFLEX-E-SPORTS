"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Product } from "@/store/useCartStore";
import { Flame } from "lucide-react";

// Mock highly rated products
const trendingProducts: Product[] = [
  { id: "fb-1", name: "Real Madrid Home Kit", team: "Real Madrid CF", price: 4999, image: "/images/real_madrid.png", category: "Football", rating: 5 },
  { id: "bk-1", name: "Lakers Icon Edition", team: "LA Lakers", price: 5999, image: "/images/lakers.png", category: "Basketball", rating: 5 },
  { id: "cr-1", name: "India World Cup Jersey", team: "Team India", price: 2999, image: "/images/india.png", category: "Cricket", rating: 5 },
  { id: "fb-3", name: "FC Barcelona Home Kit", team: "FC Barcelona", price: 4799, image: "/images/barcelona.png", category: "Football", rating: 4.8 },
  { id: "fb-4", name: "Manchester City Away", team: "Man City", price: 5499, image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800", category: "Football", rating: 4.9 },
  { id: "bk-2", name: "Bulls Statement Edition", team: "Chicago Bulls", price: 6199, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800", category: "Basketball", rating: 4.7 }
];

export default function TrendingPage() {
  return (
    <main className="min-h-screen bg-brand-dark pt-24 pb-12">
      <Header />
      
      {/* Hero Header */}
      <div className="relative py-20 px-6 overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 via-brand-surface to-brand-purple/20 opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-30" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 bg-brand-accent/20 border border-brand-accent rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,0,85,0.4)]"
          >
            <Flame className="w-10 h-10 text-brand-accent" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-6xl md:text-8xl italic uppercase tracking-tighter mb-4"
          >
            HYPE <span className="text-brand-accent">RADAR</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-indian text-gray-400 tracking-[0.3em] uppercase max-w-2xl text-sm md:text-base leading-relaxed"
          >
            Real-time feed of the most coveted drops. If it's performing, it's here.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ProductGrid initialProducts={trendingProducts} />
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </main>
  );
}
