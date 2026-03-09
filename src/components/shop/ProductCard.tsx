"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product, useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-brand-surface rounded-3xl border border-white/5 overflow-hidden hover:border-brand-accent/50 transition-all duration-500"
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-brand-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          {product.category}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-accent transition-colors duration-300 hover-trigger">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <button 
            onClick={() => addItem(product)}
            className="w-full bg-white text-black py-4 font-bold flex items-center justify-center gap-2 hover:bg-brand-accent hover:text-white transition-colors duration-300 hover-trigger"
          >
            <ShoppingCart className="w-5 h-5" />
            ADD TO BAG
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-display text-xl italic group-hover:text-brand-accent transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-gray-500 text-xs font-indian tracking-widest uppercase">
              {product.team}
            </p>
          </div>
          <p className="font-display text-xl text-brand-gold">
            ₹{product.price.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < (product.rating || 5) ? "fill-brand-gold text-brand-gold" : "text-gray-700"
              )}
            />
          ))}
          <span className="text-[10px] text-gray-500 ml-2 font-indian">
            (4.8)
          </span>
        </div>
      </div>
    </motion.div>
  );
};
