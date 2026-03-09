"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/shop/ProductCard";
import { Product } from "@/store/useCartStore";
import { Sparkles } from "lucide-react";

interface RecommendedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const RecommendedProducts = ({ 
  products, 
  title = "RECOMMENDED FOR YOU",
  subtitle = "Based on your elite performance profile"
}: RecommendedProductsProps) => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
            <span className="text-brand-gold font-indian text-[10px] tracking-[0.4em] uppercase font-bold">AI POWERED ENGINE</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl italic uppercase tracking-tighter">
            {title}
          </h2>
          <p className="font-indian text-gray-500 tracking-[0.3em] uppercase text-xs mt-2">
            {subtitle}
          </p>
        </div>
        <button className="text-brand-accent font-black text-xs italic uppercase tracking-[0.3em] hover:underline hover-trigger">
          VIEW ALL RECOMMENDATIONS
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.slice(0, 4).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
