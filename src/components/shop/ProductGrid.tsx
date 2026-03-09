"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/store/useCartStore";

interface ProductGridProps {
  initialProducts: Product[];
}

export const ProductGrid = ({ initialProducts }: ProductGridProps) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [maxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>("default");

  const categories = ["all", "Football", "Cricket", "Basketball"];

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.team.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          activeCategory === "all" || p.category === activeCategory;
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
    <div className="space-y-8 md:space-y-12">
      {/* Search & Filters Bar */}
      <div className="flex flex-col gap-4 bg-brand-surface p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5">
        {/* Search */}
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
          <input
            type="text"
            placeholder="Search teams, players, kits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 p-3 md:p-4 pl-11 md:pl-12 rounded-xl md:rounded-2xl outline-none focus:border-brand-accent transition-all duration-300 font-indian tracking-widest text-xs md:text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category + Sort Row */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          {/* Categories */}
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(255,0,51,0.3)]"
                    : "bg-black/40 border border-white/10 text-gray-500 hover:border-brand-accent/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-44 bg-black/40 border border-white/10 p-2.5 md:p-3 rounded-lg md:rounded-xl outline-none text-[10px] md:text-xs font-indian tracking-widest uppercase focus:border-brand-accent"
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-20 md:py-32 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <X className="w-8 h-8 md:w-10 md:h-10 text-brand-accent/40" />
          </div>
          <h3 className="font-display text-2xl md:text-3xl italic mb-2 tracking-widest uppercase">
            No kits found
          </h3>
          <p className="text-gray-500 font-indian tracking-widest text-xs md:text-sm">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
};
