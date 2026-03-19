"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, ScrollText, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export const TermsModal = ({ isOpen, onAccept, onClose }: TermsModalProps) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      // Small delay to allow layout to settle
      const timer = setTimeout(() => {
        if (scrollRef.current) checkScroll(scrollRef.current);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const checkScroll = (element: HTMLDivElement) => {
    const { scrollTop, scrollHeight, clientHeight } = element;
    // If scrollHeight is same as clientHeight, there's no scroll needed
    if (scrollHeight <= clientHeight + 10 || scrollHeight - scrollTop <= clientHeight + 50) {
      setHasScrolledToBottom(true);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    checkScroll(e.currentTarget);
  };

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
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[201] p-6 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-brand-surface border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col pointer-events-auto relative shadow-[0_0_100px_rgba(255,0,85,0.15)]"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent via-brand-purple to-brand-cyan" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-accent/10 rounded-full blur-[80px]" />

              {/* Header */}
              <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center border border-brand-accent/20">
                    <Shield className="w-6 h-6 text-brand-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl italic uppercase tracking-tighter">
                      TERMS & <span className="text-brand-accent">CONDITIONS</span>
                    </h2>
                    <p className="font-indian text-[10px] text-gray-500 tracking-widest uppercase mt-0.5">
                      Last Updated: March 2026
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content body */}
              <div className="flex-1 px-8 py-4 overflow-hidden flex flex-col">
                <div 
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-6 overflow-y-auto space-y-6 custom-scrollbar font-indian text-sm text-gray-400 tracking-wide leading-relaxed"
                >
                  <section>
                    <h3 className="text-white font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                       <ScrollText className="w-4 h-4 text-brand-accent" /> 1. USER AGREEMENT
                    </h3>
                    <p>
                      By accessing ERAFLEX E-SPORTS, you agree to bound by these terms. Our platform provides premium AI-powered sports gear customization and virtual fittings. You acknowledge that our customized products are tailored specifically to your requests.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Shield className="w-4 h-4 text-brand-accent" /> 2. PRIVACY & DATA
                    </h3>
                    <p>
                      We utilize Firebase for secure authentication and Firestore for data management. Virtual Try-On data is processed locally on your device using "Edge AI" and is not stored on our servers unless explicitly stated for saved fits.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold uppercase tracking-widest mb-3">3. CUSTOMIZATION POLICY</h3>
                    <p>
                      Once a "Forced Kit" is submitted through our 3D customizer, the production process begins instantly. Cancellations for customized orders are only permitted within 2 hours of placement.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold uppercase tracking-widest mb-3">4. PAYMENTS & REFUNDS</h3>
                    <p>
                      Payments are processed securely via Stripe. Indian customers can utilize UPI, Cards, and Wallets. Cash on Delivery is available for selected regions and order values below ₹10,000.
                    </p>
                  </section>
                  
                  {!hasScrolledToBottom && (
                    <div className="sticky bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-[#0a0a0c] to-transparent flex justify-center">
                      <p className="text-[10px] text-brand-accent font-black animate-bounce">SCROLL TO BOTTOM TO ACCEPT</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer / Accept */}
              <div className="p-8 pt-4 space-y-6">
                <button 
                  type="button"
                  onClick={() => {
                    if (hasScrolledToBottom) {
                      setAgreed(!agreed);
                    } else {
                      toast.error("Please scroll to the bottom to read all terms!");
                    }
                  }}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group text-left",
                    agreed ? "bg-brand-accent/5 border-brand-accent/30" : "bg-white/5 border-white/10 hover:border-white/20",
                    !hasScrolledToBottom && "opacity-50 cursor-help"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5",
                    agreed ? "bg-brand-accent border-brand-accent" : "border-white/20 group-hover:border-white/40"
                  )}>
                    {agreed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-indian tracking-wide text-white uppercase font-bold">I Agree to the Terms & Conditions</p>
                    <p className="text-[10px] text-gray-500 font-indian tracking-widest mt-1">
                      {hasScrolledToBottom ? "I have read and understood the privacy policy and product customization terms." : "Please scroll to the bottom to unlock this checkbox."}
                    </p>
                  </div>
                </button>

                <button
                  disabled={!agreed}
                  onClick={onAccept}
                  className="w-full bg-brand-accent py-5 font-black text-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_10px_40px_rgba(255,0,85,0.3)] disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-3 uppercase italic"
                >
                  Confirm & Continue
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
