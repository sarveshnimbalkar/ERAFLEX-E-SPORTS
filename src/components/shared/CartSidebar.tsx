"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
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
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full md:w-[460px] bg-[#0f0f0f] border-l border-white/10 z-[101] flex flex-col"
          >
            {/* Top accent line */}
            <div className="h-0.5 bg-gradient-to-r from-brand-accent via-brand-purple to-brand-gold flex-shrink-0" />

            {/* Header */}
            <div className="flex justify-between items-center px-6 md:px-8 py-6 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-brand-accent/10 rounded-2xl flex items-center justify-center border border-brand-accent/20">
                  <ShoppingBag className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h2 className="font-display text-3xl uppercase tracking-tighter leading-none">
                    YOUR <span className="text-brand-accent">BAG</span>
                  </h2>
                  <p className="font-indian text-[10px] text-gray-500 tracking-[0.3em] uppercase mt-1">
                    {items.length} {items.length === 1 ? "item" : "items"} in cart
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 group"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-400" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4 space-y-3 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ShoppingBag className="w-16 h-16 text-white/10" />
                  </motion.div>
                  <p className="font-indian text-gray-500 tracking-[0.3em] uppercase text-xs">
                    Your bag is currently empty.
                  </p>
                  <button
                    onClick={onClose}
                    className="text-brand-accent font-bold text-sm hover:underline uppercase tracking-wider"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                      transition={{ type: "spring", damping: 22, stiffness: 200 }}
                      className="flex gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors"
                    >
                      {/* Image */}
                      <div className="w-20 h-28 md:w-24 md:h-32 bg-brand-dark rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 className="font-display text-base md:text-lg uppercase truncate leading-tight">
                              {item.name}
                            </h3>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => removeItem(item.id)}
                              className="text-gray-600 hover:text-brand-accent transition-colors flex-shrink-0 p-1 rounded-full hover:bg-brand-accent/10"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                          <p className="text-[10px] text-brand-gold font-indian tracking-widest uppercase font-bold">{item.team}</p>
                          <p className="text-[10px] text-gray-600 font-indian tracking-widest uppercase mt-0.5">Size: Default</p>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          {/* Quantity stepper */}
                          <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                            <motion.button
                              whileTap={{ scale: 0.75 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-500 hover:text-brand-accent transition-colors disabled:opacity-20 w-5 h-5 flex items-center justify-center"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="font-display text-lg min-w-[20px] text-center"
                            >
                              {item.quantity}
                            </motion.span>
                            <motion.button
                              whileTap={{ scale: 0.75 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-500 hover:text-brand-accent transition-colors w-5 h-5 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                          {/* Line price */}
                          <motion.p
                            key={item.price * item.quantity}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-display text-xl text-white"
                          >
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer / Checkout */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="px-6 md:px-8 pt-4 pb-6 border-t border-white/10 flex-shrink-0 space-y-4"
                >
                  {/* Order summary row */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-500 font-indian tracking-widest uppercase mb-1">
                        Subtotal (tax incl.)
                      </p>
                      <motion.p
                        key={total}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-3xl md:text-4xl uppercase"
                      >
                        ₹<span className="text-brand-accent">{total.toLocaleString()}</span>
                      </motion.p>
                    </div>
                    <p className="font-indian text-[10px] text-brand-success tracking-widest uppercase">
                      Free delivery
                    </p>
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="btn-premium w-full py-5 text-xl tracking-widest rounded-sm group"
                  >
                    CHECKOUT NOW
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>

                  {/* Continue shopping */}
                  <button
                    onClick={onClose}
                    className="w-full text-center font-indian text-[11px] text-gray-600 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    ← Continue Shopping
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
