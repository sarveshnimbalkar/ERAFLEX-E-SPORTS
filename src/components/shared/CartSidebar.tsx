"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const CartSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-brand-dark/95 backdrop-blur-xl border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-8 md:px-10 py-10 flex-shrink-0">
              <div>
                <h2 className="font-display text-4xl uppercase tracking-tighter leading-none flex items-center gap-3">
                  <span className="text-white">YOUR</span>
                  <span className="text-white border-b-2 border-brand-accent pb-1">BAG</span>
                </h2>
                <p className="font-indian text-[10px] text-gray-500 tracking-[0.4em] uppercase mt-4">
                  {items.length} {items.length === 1 ? "item" : "items"} inside
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-8 md:px-10 space-y-8 no-scrollbar pb-10">
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02]">
                    <ShoppingBag className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="font-indian text-gray-500 tracking-[0.4em] uppercase text-xs">
                    Your bag is completely empty.
                  </p>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-3 text-white font-bold text-xs tracking-[0.2em] uppercase hover:text-brand-accent transition-colors group"
                  >
                    RETURN TO STORE <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item, index) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40, height: 0, scale: 0.9 }}
                      transition={{ 
                        type: "spring", stiffness: 200, damping: 25, 
                        opacity: { delay: index * 0.1 } 
                      }}
                      className="group flex gap-6 pb-8 border-b border-white/5"
                    >
                      {/* Image */}
                      <Link href={`/shop/${item.id}`} onClick={onClose} className="w-28 md:w-32 aspect-[3/4] bg-gradient-to-br from-[#1a1a1a] to-black rounded-sm overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-[0.16,1,0.3,1]"
                        />
                        <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-transparent transition-colors duration-500" />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <p className="text-[9px] text-gray-500 font-indian tracking-[0.3em] uppercase mb-2">
                            {item.team}
                          </p>
                          <Link href={`/shop/${item.id}`} onClick={onClose} className="hover:text-brand-accent transition-colors block">
                            <h3 className="font-display text-2xl uppercase leading-[1.1] tracking-tight pr-4">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-[10px] text-gray-600 font-indian tracking-[0.2em] uppercase mt-2">
                            Size: <span className="text-white">OSFA</span>
                          </p>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <p className="font-display text-2xl text-white tracking-tighter">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>

                          {/* Minimal Quantity Stepper & Remove */}
                          <div className="flex flex-col items-end gap-3">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[9px] text-gray-600 font-indian tracking-[0.2em] uppercase hover:text-brand-accent transition-colors"
                            >
                              REMOVE
                            </button>
                            
                            <div className="flex items-center gap-4 border border-white/20 rounded-full px-4 py-1.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className={cn("text-gray-400 hover:text-white transition-colors", item.quantity <= 1 && "opacity-30")}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-display text-lg w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Premium Footer */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
                  className="px-8 md:px-10 py-8 bg-black/50 backdrop-blur-xl border-t border-white/10 flex-shrink-0"
                >
                  <div className="flex justify-between items-end mb-8">
                    <p className="text-[10px] text-gray-500 font-indian tracking-[0.3em] uppercase">
                      Subtotal
                    </p>
                    <motion.div
                      key={total}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-display text-4xl uppercase tracking-tighter"
                    >
                      ₹{total.toLocaleString()}
                    </motion.div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="relative overflow-hidden group bg-white text-black w-full py-5 text-sm font-bold tracking-[0.3em] uppercase rounded-sm flex items-center justify-center gap-3"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      PROCEED TO CHECKOUT
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-brand-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                    <div className="absolute inset-0 bg-brand-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-[0.16,1,0.3,1] z-0 delay-[50ms] mix-blend-multiply" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
