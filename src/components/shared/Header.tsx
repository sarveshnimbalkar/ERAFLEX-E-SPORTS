"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User as UserIcon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { CartSidebar } from "./CartSidebar";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const cartItemsCount = useCartStore((state) => state.items.length);
  const { user } = useUserStore();
  const pathname = usePathname();

  // Smart Scroll Tracking (Awwwards Style)
  const { scrollY } = useScroll();
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Hide header when scrolling DOWN, but show it if we scroll UP
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/shop" },
    { name: "Trending", href: "/trending" },
    { name: "Customizer", href: "/customize" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 w-full z-50 px-4 md:px-10 lg:px-16 flex items-center justify-between transition-colors duration-500",
          isScrolled
            ? "h-20 bg-brand-dark/50 backdrop-blur-3xl border-b border-white/5 shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
            : "h-24 md:h-28 bg-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-4 group flex-shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-black flex items-center justify-center font-display text-xl md:text-3xl font-black transform group-hover:rotate-[15deg] group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-white transition-all duration-500 ease-[0.16,1,0.3,1] shadow-xl">
            E
          </div>
          <span className="font-display text-2xl md:text-4xl tracking-wider relative overflow-hidden mix-blend-difference pb-1">
            ERA<span className="text-brand-accent">FLEX</span>
            {/* Shine */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-[0.16,1,0.3,1]" />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-8 xl:gap-14 font-indian uppercase text-xs tracking-[0.2em] items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative group py-2 transition-colors duration-300",
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                )}
              >
                {link.name}
                {/* Active animated dot */}
                {isActive && (
                  <motion.span 
                    layoutId="header-active-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-accent" 
                  />
                )}
                {/* Hover underline */}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-px bg-white transition-all duration-300 ease-[0.16,1,0.3,1]",
                  isActive ? "w-0" : "w-0 group-hover:w-full"
                )} />
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5 md:gap-8 flex-shrink-0">
          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md text-[9px] font-bold tracking-[0.2em] text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer group uppercase">
            <span className="text-sm group-hover:animate-spin-slow">🌐</span> 
            <span>EN / INR</span>
          </button>
          
          <Link
            href={user ? "/dashboard" : "/auth"}
            className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
          >
            {user ? (
              <div className="w-10 h-10 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-xs uppercase shadow-[0_0_20px_rgba(225,29,72,0.4)] group-hover:scale-110 transition-transform duration-300">
                {user.displayName?.[0] || user.email?.[0] || "?"}
              </div>
            ) : (
              <UserIcon className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
            )}
          </Link>

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-gray-400 hover:text-white transition-colors duration-300 group"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
            
            {cartItemsCount > 0 && (
              <>
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-brand-accent/40 animate-ping-ring" />
                <motion.span
                  key={cartItemsCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 400 }}
                  className="absolute -top-1.5 -right-2 bg-brand-accent text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold shadow-[0_0_10px_rgba(225,29,72,0.5)] z-10"
                >
                  {cartItemsCount}
                </motion.span>
              </>
            )}
          </button>

          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-brand-dark backdrop-blur-3xl flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16 px-4">
              <span className="font-display text-3xl tracking-wider text-white">
                ERA<span className="text-brand-accent">FLEX</span>
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-10 items-center flex-1 justify-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "font-display text-5xl hover:text-brand-accent transition-colors duration-500 relative group overflow-hidden block",
                      pathname === link.href ? "text-brand-accent" : "text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar attached to Global Nav */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
