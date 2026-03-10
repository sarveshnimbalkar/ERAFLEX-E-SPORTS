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
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-8 lg:px-12 flex items-center justify-between",
        isScrolled
          ? "h-16 bg-brand-dark/80 backdrop-blur-xl border-b border-white/5"
          : "h-20 md:h-24 bg-transparent"
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-accent flex items-center justify-center font-display text-lg md:text-2xl italic font-black transform group-hover:rotate-12 transition-transform duration-300">
          E
        </div>
        <span className="font-display text-xl md:text-3xl tracking-wider">
          ERA<span className="text-brand-accent">FLEX</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-6 xl:gap-10 font-indian uppercase text-xs xl:text-sm tracking-widest items-center">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="hover:text-brand-accent transition-colors duration-300 relative group py-1"
          >
            {link.name}
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
        <Link
          href={user ? "/dashboard" : "/auth"}
          className="hover:text-brand-accent transition-colors duration-300 flex items-center gap-2"
        >
          {user ? (
            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center font-bold text-xs uppercase">
              {user.displayName?.[0] || user.email?.[0] || "?"}
            </div>
          ) : (
            <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </Link>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative hover:text-brand-accent transition-colors duration-300 group"
        >
          <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-accent text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold shadow-md">
              {cartItemsCount}
            </span>
          )}
        </button>
        <button
          className="lg:hidden hover:text-brand-accent transition-colors duration-300"
          onClick={() => setIsMobileMenuOpen(true)}
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
            className="fixed inset-0 z-[60] bg-brand-dark/95 backdrop-blur-xl flex flex-col p-6 md:p-8"
          >
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-6 items-center text-center flex-1 justify-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-display text-3xl md:text-4xl italic hover:text-brand-accent transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-6 pt-6 border-t border-white/10 w-48"
              >
                <Link
                  href={user ? "/dashboard" : "/auth"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-display text-2xl italic text-brand-accent hover:text-white transition-colors"
                >
                  {user ? "Dashboard" : "Sign In"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};
