"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product, useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { wishlistService } from "@/lib/db";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useUserStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} added to bag!`);
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    setAddingToWishlist(true);
    try {
      if (wishlisted) {
        await wishlistService.removeFromWishlist(user.uid, product.id);
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.addToWishlist(user.uid, product.id);
        setWishlisted(true);
        toast.success("Added to wishlist!");
      }
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setAddingToWishlist(false);
    }
  };

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
        <button
          onClick={handleToggleWishlist}
          disabled={addingToWishlist}
          className={cn(
            "w-10 h-10 rounded-full glass flex items-center justify-center transition-colors duration-300",
            wishlisted ? "bg-brand-accent text-white" : "hover:bg-brand-accent"
          )}
        >
          <Heart className={cn("w-5 h-5", wishlisted && "fill-current")} />
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
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white text-black py-3 md:py-4 font-bold flex items-center justify-center gap-2 hover:bg-brand-accent hover:text-white transition-colors duration-300 text-sm md:text-base"
          >
            <ShoppingCart className="w-5 h-5" />
            ADD TO BAG
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-display text-lg md:text-xl italic group-hover:text-brand-accent transition-colors duration-300 truncate">
              {product.name}
            </h3>
            <p className="text-gray-500 text-[10px] md:text-xs font-indian tracking-widest uppercase">
              {product.team}
            </p>
          </div>
          <p className="font-display text-lg md:text-xl text-brand-gold flex-shrink-0">
            ₹{product.price.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-1 mt-3 md:mt-4">
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
            ({(product.rating || 5).toFixed(1)})
          </span>
        </div>
      </div>
    </motion.div>
  );
};
