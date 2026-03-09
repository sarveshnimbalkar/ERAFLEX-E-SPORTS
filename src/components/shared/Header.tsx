"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
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
        "w-full transition-all duration-500 px-6 md:px-12 flex items-center justify-between",
        isScrolled ? "h-16 glass" : "h-24 bg-transparent"
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-brand-accent flex items-center justify-center font-display text-2xl italic font-black transform group-hover:rotate-12 transition-transform duration-300">
          E
        </div>
        <span className="font-display text-3xl tracking-wider">
          ERA<span className="text-brand-accent">FLEX</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-10 font-indian uppercase text-sm tracking-widest">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="hover:text-brand-accent transition-colors duration-300 hover-trigger relative group"
          >
            {link.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <Link href={user ? "/dashboard" : "/auth"} className="hover:text-brand-accent transition-colors duration-300 text-xl hover-trigger flex items-center gap-2">
          {user ? (
            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center font-bold text-xs uppercase">
              {user.displayName?.[0] || user.email?.[0] || "?"}
            </div>
          ) : (
            <UserIcon className="w-6 h-6" />
          )}
        </Link>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative hover:text-brand-accent transition-colors duration-300 text-xl hover-trigger group"
        >
          <ShoppingBag className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-accent text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold animate-pulse">
              {cartItemsCount}
            </span>
          )}
        </button>
        <button
          className="lg:hidden hover:text-brand-accent transition-colors duration-300 hover-trigger"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
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
            className="fixed inset-0 z-[60] glass flex flex-col p-8"
          >
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-brand-accent transition-colors duration-300"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex flex-col gap-8 items-center text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-display text-4xl italic hover:text-brand-accent transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};
