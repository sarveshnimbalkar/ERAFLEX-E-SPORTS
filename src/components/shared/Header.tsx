"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User as UserIcon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { CartSidebar } from "./CartSidebar";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.items.length);
  const { user } = useUserStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/shop" },
    { name: "Trending", href: "/trending" },
    { name: "Customizer", href: "/customize" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-8 lg:px-12 flex items-center justify-between",
        isScrolled
          ? "h-16 bg-black/75 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
          : "h-20 md:h-24 bg-transparent"
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-accent flex items-center justify-center font-display text-lg md:text-2xl font-black transform group-hover:rotate-12 transition-transform duration-300 animate-glow-pulse">
          E
        </div>
        <span className="font-display text-xl md:text-3xl tracking-wider relative overflow-hidden">
          ERA<span className="text-brand-accent">FLEX</span>
          {/* Shine sweep on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-6 xl:gap-10 font-indian uppercase text-xs xl:text-sm tracking-widest items-center">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "relative group py-1 transition-colors duration-300",
                isActive ? "text-brand-accent" : "hover:text-brand-accent"
              )}
            >
              {link.name}
              {/* Animated underline — fills from left */}
              <span
                className={cn(
                  "absolute -bottom-0.5 left-0 h-[2px] bg-brand-accent transition-all duration-300",
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
              {/* Active dot indicator */}
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-accent" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
        <Link
          href={user ? "/dashboard" : "/auth"}
          className="hover:text-brand-accent transition-colors duration-300 flex items-center gap-2 group"
        >
          {user ? (
            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center font-bold text-xs uppercase ring-2 ring-brand-accent/30 group-hover:ring-brand-accent/60 transition-all duration-300">
              {user.displayName?.[0] || user.email?.[0] || "?"}
            </div>
          ) : (
            <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </Link>

        {/* Cart button with animated badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative hover:text-brand-accent transition-colors duration-300 group"
          aria-label="Open cart"
        >
          <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
          {cartItemsCount > 0 && (
            <>
              {/* Ping ring */}
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-brand-accent/40 animate-ping-ring" />
              {/* Solid badge */}
              <motion.span
                key={cartItemsCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 300 }}
                className="absolute -top-2 -right-2 bg-brand-accent text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold shadow-md z-10"
              >
                {cartItemsCount}
              </motion.span>
            </>
          )}
        </button>

        <button
          className="lg:hidden hover:text-brand-accent transition-colors duration-300"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-brand-dark/97 backdrop-blur-2xl flex flex-col p-6 md:p-8"
          >
            {/* Mobile menu top */}
            <div className="flex justify-between items-center mb-12">
              <span className="font-display text-2xl tracking-wider">
                ERA<span className="text-brand-accent">FLEX</span>
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-8 items-start flex-1 justify-center pl-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "font-display text-4xl md:text-5xl hover:text-brand-accent transition-colors duration-300 relative group block",
                      pathname === link.href && "text-brand-accent"
                    )}
                  >
                    {link.name}
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
                className="mt-4 pt-6 border-t border-white/10 w-full"
              >
                <Link
                  href={user ? "/dashboard" : "/auth"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-display text-2xl text-brand-accent hover:text-white transition-colors"
                >
                  {user ? "Dashboard" : "Sign In"}
                </Link>
              </motion.div>
            </div>

            {/* Mobile accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-accent via-brand-purple to-brand-gold" />
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};
