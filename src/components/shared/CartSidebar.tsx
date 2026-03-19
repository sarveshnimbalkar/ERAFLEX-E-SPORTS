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
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center border border-brand-accent/20">
                  <ShoppingBag className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <h2 className="font-display text-4xl uppercase tracking-tighter leading-none">
                    YOUR <span className="text-brand-accent">BAG</span>
                  </h2>
                  <p className="font-indian text-[10px] text-gray-500 tracking-[0.3em] uppercase mt-1">
                    {items.length} {items.length === 1 ? 'item' : 'items'} in cart
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-500 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
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
                      <div className="w-24 h-32 bg-brand-dark rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-display text-lg uppercase truncate leading-tight">{item.name}</h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-600 hover:text-brand-accent transition-colors flex-shrink-0 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[10px] text-brand-gold font-indian tracking-widest uppercase font-black">{item.team}</p>
                          <p className="text-[10px] text-gray-500 font-indian tracking-widest uppercase">Size: Default</p>
                        </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-500 hover:text-brand-accent transition-colors disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-display text-lg min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-brand-accent transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-display text-2xl text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
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
                    <p className="font-display text-3xl md:text-4xl uppercase">
                      ₹<span className="text-brand-accent">{total.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-brand-accent py-6 font-black text-2xl tracking-widest hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-4 group rounded-md uppercase"
                >
                  CHECKOUT NOW
                  <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
