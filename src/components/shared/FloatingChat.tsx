"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[320px] bg-brand-surface border border-white/10 rounded-2xl shadow-2xl glass-strong overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-accent to-red-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white/90" />
                <h3 className="font-display tracking-widest text-lg italic uppercase text-white">Elite Stylist AI</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body Placeholder */}
            <div className="p-6 flex-1 min-h-[300px] flex flex-col justify-end gap-4 bg-black/40">
              <div className="bg-white/10 p-3 rounded-xl rounded-tl-none self-start max-w-[85%] border border-white/5">
                <p className="text-sm font-indian tracking-wider text-gray-200">
                  Welcome to ERAFLEX E-SPORTS! How can I help you find the perfect jersey today?
                </p>
              </div>
            </div>

            {/* Input field */}
            <div className="p-3 border-t border-white/10 bg-black/60">
              <input 
                type="text" 
                placeholder="Ask about team kits, sizes..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-accent transition-colors font-indian tracking-wide"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(225,29,72,0.4)] transition-all duration-300 group",
          isOpen ? "bg-white text-black" : "bg-brand-accent text-white"
        )}
      >
        <div className="absolute inset-0 rounded-full animate-ping-ring bg-brand-accent/40 pointer-events-none" />
        
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </motion.button>
    </div>
  );
};
