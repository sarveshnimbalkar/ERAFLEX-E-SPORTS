"use client";

import { memo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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

export const ProductCard = memo(({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useUserStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── High-Fidelity 3D Tilt ──
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Spring physics for buttery smoothness
  const springX = useSpring(mouseX, { stiffness: 400, damping: 30, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 30, mass: 0.8 });
  
  const rotateX = useTransform(springY, [0, 1], [15, -15]);
  const rotateY = useTransform(springX, [0, 1], [-15, 15]);
  
  // Interactive glare effect
  const glareOpacity = useTransform(springY, [0, 1], [0.1, 0.4]);
  const glareY = useTransform(springY, [0, 1], ["-20%", "120%"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      className="group relative bg-brand-surface border border-white/5 overflow-hidden rounded-md z-10 hover:z-20 transition-shadow duration-500 shadow-2xl hover:shadow-[0_20px_60px_rgba(225,29,72,0.15)] flex flex-col"
    >
      {/* Interactive Glare overlay */}
      <motion.div 
        className="absolute inset-x-0 w-[150%] h-[30%] bg-white blur-[50px] rotate-45 pointer-events-none z-30 mix-blend-overlay"
        style={{
          opacity: glareOpacity,
          top: glareY,
          left: "-25%",
        }}
      />

      {/* Badge */}
      <div className="absolute top-4 left-4 z-40 transform-gpu" style={{ transform: "translateZ(30px)" }}>
        <span className="bg-brand-accent/90 backdrop-blur-md text-white text-[10px] font-bold px-4 py-1.5 rounded-sm uppercase tracking-widest shadow-lg">
          {product.category}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 translate-x-14 group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] transform-gpu" style={{ transform: "translateZ(30px)" }}>
        <button
          onClick={handleToggleWishlist}
          disabled={addingToWishlist}
          className={cn(
            "w-10 h-10 rounded-sm glass flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20",
            wishlisted
              ? "bg-brand-accent text-white scale-110"
              : "hover:bg-brand-accent hover:border-brand-accent hover:scale-110"
          )}
        >
          <Heart className={cn("w-4 h-4 transition-all duration-300", wishlisted && "fill-current scale-110")} />
        </button>
        <Link
          href={`/shop/${product.id}`}
          className="w-10 h-10 rounded-sm glass flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 backdrop-blur-md border border-white/20"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      {/* ── Premium Image Container — Nike/Adidas catalog style ── */}
      <Link
        href={`/shop/${product.id}`}
        className="pk-image-wrap block flex-shrink-0"
        tabIndex={-1}
      >
        {/* Inner padded frame — jersey always centered with breathing room */}
        <div className="pk-image-inner">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Radial edge vignette — depth effect */}
        <div className="pk-image-vignette" />

        {/* Bottom gradient — reveals on hover for the Add to Cart CTA */}
        <div className="pk-image-gradient" />

        {/* Slide-up Add to Cart */}
        <div className="absolute bottom-0 left-0 w-full p-5 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] z-50">
          <button
            onClick={handleAddToCart}
            className="w-full bg-brand-accent text-white py-3.5 font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 text-xs relative overflow-hidden transition-all duration-300 hover:bg-white hover:text-black rounded-sm shadow-[0_10px_30px_rgba(225,29,72,0.4)]"
          >
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
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2"
                >
                  ✓ ADDED TO BAG
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ ease: [0.16, 1, 0.3, 1] }}
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
      <div className="p-5 md:p-6 bg-brand-surface transform-gpu" style={{ transform: "translateZ(10px)" }}>
        <div className="flex justify-between items-start gap-4 mb-2">
          <Link href={`/shop/${product.id}`} className="min-w-0 flex-1 hover:opacity-80 transition-opacity">
            <h3 className="font-display text-xl md:text-2xl group-hover:text-brand-accent transition-colors duration-300 truncate tracking-tight">
              {product.name}
            </h3>
            <p className="text-gray-500 text-[10px] md:text-xs font-indian tracking-[0.2em] uppercase mt-1">
              {product.team}
            </p>
          </Link>
          <div className="flex flex-col items-end flex-shrink-0">
            <p className="font-display text-xl md:text-2xl text-white leading-none">
              ₹{product.price.toLocaleString()}
            </p>
            <p className="text-gray-600 text-[10px] md:text-xs font-indian tracking-[0.1em] line-through mt-1">
              ₹{Math.floor(product.price * 1.3).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Urgency Indicator */}
        {product.stock && product.stock <= 80 && (
          <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-sm px-3 py-1.5 mt-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping" />
            <p className="text-brand-accent font-indian text-[9px] uppercase font-bold tracking-[0.15em]">
              High Demand — Only {product.stock} Left
            </p>
          </div>
        )}

        {/* Star Rating */}
        <div className="flex items-center gap-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < (product.rating || 5) ? "fill-white text-white" : "text-gray-800"
              )}
            />
          ))}
          <span className="text-[10px] text-gray-400 ml-2 font-indian tracking-[0.1em]">
            ({(product.rating || 5).toFixed(1)})
          </span>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";
