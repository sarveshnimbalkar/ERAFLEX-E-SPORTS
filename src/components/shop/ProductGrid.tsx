"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/store/useCartStore";

interface ProductGridProps {
  initialProducts: Product[];
}

export const ProductGrid = ({ initialProducts }: ProductGridProps) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setBy] = useState<string>("default");

  const categories = ["all", "Football", "Cricket", "Basketball"];

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.team.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "all" || p.category === activeCategory;
        const matchesPrice = p.price <= maxPrice;
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [initialProducts, search, activeCategory, maxPrice, sortBy]);

  return (
    <div className="space-y-12">
      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-brand-surface p-6 rounded-3xl border border-white/5 glass">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
          <input
            type="text"
            placeholder="Search teams, players, kits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-brand-accent transition-all duration-300 font-indian tracking-widest text-sm"
          />
        </div>

        <div className="flex overflow-x-auto gap-3 no-scrollbar w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 hover-trigger ${
                activeCategory === cat
                  ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(255,0,51,0.3)]"
                  : "bg-black/40 border border-white/10 text-gray-500 hover:border-brand-accent/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={sortBy}
            onChange={(e) => setBy(e.target.value)}
            className="flex-1 md:w-40 bg-black/40 border border-white/10 p-3 rounded-xl outline-none text-xs font-indian tracking-widest uppercase focus:border-brand-accent"
          >
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-32 text-center">
          <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-brand-accent/40" />
          </div>
          <h3 className="font-display text-3xl italic mb-2 tracking-widest uppercase">
            No kits found
          </h3>
          <p className="text-gray-500 font-indian tracking-widest">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};
