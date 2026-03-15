"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-brand-surface border-l border-white/10 z-[101] flex flex-col p-6 md:p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-7 h-7 text-brand-accent" />
                <h2 className="font-display text-3xl italic uppercase tracking-tighter">
                  YOUR <span className="text-brand-accent">BAG</span>
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="w-16 h-16 text-white/10" />
                  <p className="font-indian text-gray-500 tracking-[0.3em] uppercase text-xs">
                    Your bag is currently empty.
                  </p>
                  <button 
                    onClick={onClose}
                    className="text-brand-accent font-bold hover:underline"
                  >
                    START SHOPPING
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    className="flex gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors"
                  >
                    <div className="w-20 h-28 bg-brand-dark rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-center gap-2">
                          <h3 className="font-display text-base italic uppercase truncate">{item.name}</h3>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-600 hover:text-brand-accent transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-500 font-indian tracking-widest uppercase">{item.team}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-3 bg-brand-dark px-3 py-1.5 rounded-lg border border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="hover:text-brand-accent transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-display text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="hover:text-brand-accent transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-display text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-5">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-500 font-indian tracking-widest uppercase mb-1">Subtotal (tax incl.)</p>
                    <p className="font-display text-3xl md:text-4xl italic uppercase">
                      ₹<span className="text-brand-accent">{total.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-brand-accent py-4 font-black text-lg hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,0,51,0.3)] flex items-center justify-center gap-3"
                >
                  PROCEED TO CHECKOUT
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
