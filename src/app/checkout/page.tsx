"use client";

import { useCartStore } from "@/store/useCartStore";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { motion } from "framer-motion";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const [step, setStep] = useState(1);

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-6 bg-brand-dark flex flex-col items-center justify-center">
        <Header />
        <ShoppingBag className="w-16 h-16 text-white/10 mb-6" />
        <h1 className="font-display text-4xl italic uppercase mb-4 text-center">Your bag is empty</h1>
        <Link href="/shop" className="bg-brand-accent px-8 py-4 font-bold hover:bg-white hover:text-black transition-all">
          GO TO SHOP
        </Link>
        <Footer />
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen pt-32 pb-20 px-6 bg-brand-dark">
        <Header />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Link href="/shop" className="hover:text-brand-accent transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-display text-5xl md:text-7xl italic uppercase tracking-tighter">
              SECURE <span className="text-brand-accent">CHECKOUT</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Form Steps */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Shipping */}
              <div className="bg-brand-surface p-8 rounded-3xl border border-white/5 glass">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center font-display text-xl">1</div>
                  <h2 className="font-display text-3xl italic uppercase">Shipping Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 col-span-2">
                     <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">Street Address</label>
                     <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-accent" placeholder="123 Elite Street" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">City</label>
                     <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-accent" placeholder="Mumbai" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">State</label>
                     <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-accent" placeholder="Maharashtra" />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Method */}
              <div className="bg-brand-surface p-8 rounded-3xl border border-white/5 glass opacity-50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-display text-xl text-gray-500">2</div>
                  <h2 className="font-display text-3xl italic uppercase text-gray-500">Delivery Method</h2>
                </div>
              </div>

               {/* Step 3: Payment */}
               <div className="bg-brand-surface p-8 rounded-3xl border border-white/5 glass opacity-50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-display text-xl text-gray-500">3</div>
                  <h2 className="font-display text-3xl italic uppercase text-gray-500">Payment Selection</h2>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="col-span-1">
               <div className="bg-brand-surface p-8 rounded-3xl border border-white/5 glass sticky top-32">
                  <h3 className="font-display text-3xl italic uppercase mb-8">Order Summary</h3>
                  
                  <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar mb-8">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 bg-black rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-display text-sm uppercase italic">{item.name}</h4>
                          <p className="text-[10px] text-gray-500 font-indian uppercase">QTY: {item.quantity}</p>
                          <p className="font-display text-md text-brand-gold">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 border-t border-white/5 pt-8 mb-8">
                    <div className="flex justify-between items-center text-xs font-indian tracking-widest text-gray-400 uppercase">
                      <span>Subtotal</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-indian tracking-widest text-gray-400 uppercase">
                      <span>Shipping</span>
                      <span className="text-brand-success font-black">FREE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-display text-2xl italic uppercase">Total</span>
                      <span className="font-display text-3xl italic text-brand-accent">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button className="w-full bg-brand-accent py-5 font-black text-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,0,51,0.3)] flex items-center justify-center gap-3">
                    CONTINUE TO PAYMENT
                  </button>

                  <div className="mt-8 flex items-center justify-center gap-4 text-gray-600">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[8px] font-indian tracking-[0.3em] uppercase">PCI-DSS SECURE PAYMENT TERMINAL</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}
