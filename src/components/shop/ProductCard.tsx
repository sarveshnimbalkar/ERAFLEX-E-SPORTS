"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { wishlistService } from "@/lib/db";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useUserStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── 3D Tilt on hover ──
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  // ── Ripple on add-to-cart ──
  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const id = Date.now();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      createRipple(e);
    }
    addItem(product);
    setAddedToCart(true);
    toast.success(`${product.name} added to bag!`);
    setTimeout(() => setAddedToCart(false), 1800);
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
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? "transform 0.5s ease" : "transform 0.1s ease",
      }}
      className="group relative bg-brand-surface border border-white/5 overflow-hidden rounded-sm"
      // Glow shadow on hover is handled via CSS below via group-hover
    >
      {/* Hover glow ring */}
      <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none z-20"
        style={{ boxShadow: "inset 0 0 0 1px rgba(225,29,72,0.25), 0 0 40px rgba(225,29,72,0.15)" }}
      />

      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-brand-accent/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          {product.category}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-14 group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <button
          onClick={handleToggleWishlist}
          disabled={addingToWishlist}
          className={cn(
            "w-10 h-10 rounded-full glass flex items-center justify-center transition-all duration-300",
            wishlisted
              ? "bg-brand-accent text-white scale-110"
              : "hover:bg-brand-accent hover:scale-110"
          )}
        >
          <Heart className={cn("w-4 h-4 transition-all duration-300", wishlisted && "fill-current scale-110")} />
        </button>
        <Link
          href={`/shop/${product.id}`}
          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      {/* Image Container */}
      <Link href={`/shop/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a] block">
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          style={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Slide-up Add to Cart */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <button
            onClick={handleAddToCart}
            className="ripple-btn w-full bg-brand-accent text-white py-3 md:py-4 font-bold tracking-wider uppercase flex items-center justify-center gap-3 text-sm md:text-base relative overflow-hidden transition-all duration-300 hover:bg-white hover:text-black"
          >
            {/* Ripples */}
            {ripples.map(({ id, x, y }) => (
              <span
                key={id}
                className="ripple-circle"
                style={{ left: x, top: y }}
              />
            ))}
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  ✓ ADDED TO BAG
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  ADD TO BAG
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 md:p-5">
        <div className="flex justify-between items-start gap-2 mb-1">
          <Link href={`/shop/${product.id}`} className="min-w-0 flex-1 hover:opacity-80 transition-opacity">
            <h3 className="font-display text-lg md:text-xl group-hover:text-brand-accent transition-colors duration-300 truncate">
              {product.name}
            </h3>
            <p className="text-gray-500 text-[10px] md:text-xs font-indian tracking-widest uppercase mt-0.5">
              {product.team}
            </p>
          </Link>
          <p className="font-display text-lg md:text-xl text-brand-gold flex-shrink-0">
            ₹{product.price.toLocaleString()}
          </p>
        </div>

        {/* Urgency Indicator */}
        {product.stock && product.stock <= 80 && (
          <p className="text-brand-accent font-indian text-[10px] uppercase font-bold tracking-widest mt-1 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            Selling Fast — Only {product.stock} Left
          </p>
        )}

        {/* Star Rating */}
        <div className="flex items-center gap-1 mt-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < (product.rating || 5) ? "fill-brand-gold text-brand-gold" : "text-gray-700"
              )}
            />
          ))}
          <span className="text-[10px] text-gray-500 ml-1.5 font-indian">
            ({(product.rating || 5).toFixed(1)})
          </span>
        </div>
      </div>
    </motion.div>
  );
};
