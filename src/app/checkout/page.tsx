"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { orderService } from "@/lib/db";
import type { ShippingAddress, OrderItem, PaymentMethod } from "@/types";
import {
  CreditCard, Truck, ShieldCheck, ArrowLeft, ShoppingBag,
  CheckCircle, MapPin, Package, ArrowRight, Banknote, Lock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { user } = useUserStore();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Shipping form
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: user?.displayName || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");

  const SHIPPING_CHARGES = total >= 2000 ? 0 : 99;
  const grandTotal = total + SHIPPING_CHARGES;

  const updateShipping = (field: keyof ShippingAddress, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const validateShipping = () => {
    if (!shipping.fullName.trim()) return "Please enter your full name";
    if (!shipping.street.trim()) return "Please enter your street address";
    if (!shipping.city.trim()) return "Please enter your city";
    if (!shipping.state.trim()) return "Please enter your state";
    if (!shipping.pincode.trim()) return "Please enter your pincode";
    if (!shipping.phone.trim()) return "Please enter your phone number";
    return null;
  };

  const handleContinueToPayment = () => {
    const error = validateShipping();
    if (error) {
      toast.error(error);
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!user) return toast.error("Please login");
    setLoading(true);

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.id,
        name: item.name,
        team: item.team,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const newOrderId = await orderService.createOrder({
        userId: user.uid,
        userEmail: user.email || "",
        userName: user.displayName || "",
        items: orderItems,
        shippingAddress: shipping,
        subtotal: total,
        shippingCharges: SHIPPING_CHARGES,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
        stripePaymentId: paymentMethod === "stripe" ? `pi_sim_${Date.now()}` : undefined,
      });

      setOrderId(newOrderId);
      setOrderPlaced(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error("Order failed:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Empty Cart State ───
  if (items.length === 0 && !orderPlaced) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-6 bg-brand-dark flex flex-col items-center justify-center">
        <Header />
        <ShoppingBag className="w-16 h-16 text-white/10 mb-6" />
        <h1 className="font-display text-4xl italic uppercase mb-4 text-center">Your bag is empty</h1>
        <Link
          href="/shop"
          className="bg-brand-accent px-8 py-4 font-bold hover:bg-white hover:text-black transition-all"
        >
          GO TO SHOP
        </Link>
        <Footer />
      </main>
    );
  }

  // ─── Order Success State ───
  if (orderPlaced) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-6 bg-brand-dark">
        <Header />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="bg-brand-surface p-12 rounded-3xl border border-white/5 space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-brand-success/20 rounded-full flex items-center justify-center mx-auto border border-brand-success/30"
            >
              <CheckCircle className="w-12 h-12 text-brand-success" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl italic uppercase tracking-tighter">
              ORDER <span className="text-brand-success">CONFIRMED</span>
            </h1>
            <p className="font-indian text-gray-400 tracking-[0.2em] uppercase text-sm">
              Thank you for your purchase!
            </p>
            <div className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-indian tracking-widest uppercase text-xs">Order ID</span>
                <span className="font-display italic">#{orderId.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-indian tracking-widest uppercase text-xs">Payment</span>
                <span className="font-bold uppercase text-xs">{paymentMethod === "cod" ? "Cash on Delivery" : "Stripe (Paid)"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-indian tracking-widest uppercase text-xs">Total</span>
                <span className="font-display text-xl text-brand-gold">₹{grandTotal.toLocaleString()}</span>
              </div>
              {paymentMethod === "cod" && (
                <div className="mt-3 bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-3 text-xs text-brand-gold font-indian tracking-widest text-center">
                  Please keep ₹{grandTotal.toLocaleString()} ready • Payment on delivery
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/dashboard"
                className="flex-1 bg-brand-accent py-4 font-bold text-center hover:bg-white hover:text-black transition-all"
              >
                VIEW ORDERS
              </Link>
              <Link
                href="/shop"
                className="flex-1 border border-white/10 py-4 font-bold text-center hover:border-brand-accent hover:text-brand-accent transition-all"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </motion.div>
        <Footer />
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen pt-28 pb-20 px-4 md:px-6 bg-brand-dark">
        <Header />

        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/shop" className="hover:text-brand-accent transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-display text-4xl md:text-6xl italic uppercase tracking-tighter">
              SECURE <span className="text-brand-accent">CHECKOUT</span>
            </h1>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-10">
            {[
              { num: 1, label: "Shipping" },
              { num: 2, label: "Payment" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-3">
                <button
                  onClick={() => s.num < step && setStep(s.num)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-display text-lg transition-all",
                    step >= s.num
                      ? "bg-brand-accent text-white"
                      : "border border-white/20 text-gray-500"
                  )}
                >
                  {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                </button>
                <span className={cn(
                  "font-indian text-xs tracking-widest uppercase",
                  step >= s.num ? "text-white" : "text-gray-500"
                )}>
                  {s.label}
                </span>
                {i < 1 && <div className={cn("w-12 h-px", step > 1 ? "bg-brand-accent" : "bg-white/10")} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form Steps */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="wait">
                {/* ─── Step 1: Shipping ─── */}
                {step === 1 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-brand-surface p-8 rounded-3xl border border-white/5"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <MapPin className="w-6 h-6 text-brand-accent" />
                      <h2 className="font-display text-3xl italic uppercase">Shipping Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">Full Name</label>
                        <input
                          value={shipping.fullName}
                          onChange={(e) => updateShipping("fullName", e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-accent transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">Street Address</label>
                        <input
                          value={shipping.street}
                          onChange={(e) => updateShipping("street", e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-accent transition-all"
                          placeholder="123 Elite Street"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">City</label>
                        <input
                          value={shipping.city}
                          onChange={(e) => updateShipping("city", e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-accent transition-all"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">State</label>
                        <input
                          value={shipping.state}
                          onChange={(e) => updateShipping("state", e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-accent transition-all"
                          placeholder="Maharashtra"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">Pincode</label>
                        <input
                          value={shipping.pincode}
                          onChange={(e) => updateShipping("pincode", e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-accent transition-all"
                          placeholder="400001"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">Phone Number</label>
                        <input
                          value={shipping.phone}
                          onChange={(e) => updateShipping("phone", e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-accent transition-all"
                          placeholder="+91 98XXX XXXXX"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleContinueToPayment}
                      className="mt-8 w-full bg-brand-accent py-5 font-black text-xl hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-3"
                    >
                      CONTINUE TO PAYMENT
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </motion.div>
                )}

                {/* ─── Step 2: Payment ─── */}
                {step === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Shipping Summary */}
                    <div className="bg-brand-surface p-6 rounded-3xl border border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-brand-success" />
                          <span className="font-display text-lg italic uppercase">Shipping to</span>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="text-brand-accent text-xs font-bold uppercase tracking-widest hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-gray-300">{shipping.fullName}</p>
                      <p className="text-xs text-gray-500">{shipping.street}, {shipping.city}, {shipping.state} – {shipping.pincode}</p>
                      <p className="text-xs text-gray-500">Phone: {shipping.phone}</p>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="bg-brand-surface p-8 rounded-3xl border border-white/5">
                      <div className="flex items-center gap-4 mb-8">
                        <CreditCard className="w-6 h-6 text-brand-accent" />
                        <h2 className="font-display text-3xl italic uppercase">Payment Method</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {/* Stripe Option */}
                        <button
                          onClick={() => setPaymentMethod("stripe")}
                          className={cn(
                            "p-6 rounded-2xl border-2 transition-all duration-300 text-left group",
                            paymentMethod === "stripe"
                              ? "border-brand-accent bg-brand-accent/10 shadow-[0_0_20px_rgba(255,0,85,0.2)]"
                              : "border-white/10 hover:border-white/20"
                          )}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              paymentMethod === "stripe" ? "bg-brand-accent" : "bg-white/5"
                            )}>
                              <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">Credit / Debit Card</p>
                              <p className="text-[10px] text-gray-500 font-indian tracking-widest">Via Stripe Secure</p>
                            </div>
                          </div>
                          {paymentMethod === "stripe" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="space-y-4 mt-4 pt-4 border-t border-white/10"
                            >
                              <div className="space-y-2">
                                <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">Card Number</label>
                                <input
                                  placeholder="4242 4242 4242 4242"
                                  className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-brand-accent text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">Expiry</label>
                                  <input
                                    placeholder="MM/YY"
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-brand-accent text-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">CVV</label>
                                  <input
                                    placeholder="123"
                                    type="password"
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-brand-accent text-sm"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </button>

                        {/* COD Option */}
                        <button
                          onClick={() => setPaymentMethod("cod")}
                          className={cn(
                            "p-6 rounded-2xl border-2 transition-all duration-300 text-left group",
                            paymentMethod === "cod"
                              ? "border-brand-gold bg-brand-gold/10 shadow-[0_0_20px_rgba(255,170,0,0.2)]"
                              : "border-white/10 hover:border-white/20"
                          )}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              paymentMethod === "cod" ? "bg-brand-gold" : "bg-white/5"
                            )}>
                              <Banknote className={cn("w-5 h-5", paymentMethod === "cod" ? "text-black" : "")} />
                            </div>
                            <div>
                              <p className="font-bold text-sm">Cash on Delivery</p>
                              <p className="text-[10px] text-gray-500 font-indian tracking-widest">Pay when you receive</p>
                            </div>
                          </div>
                          {paymentMethod === "cod" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-4 pt-4 border-t border-white/10"
                            >
                              <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4">
                                <p className="text-xs text-brand-gold font-indian tracking-widest leading-relaxed">
                                  💵 Pay ₹{grandTotal.toLocaleString()} in cash upon delivery.
                                  Our delivery partner will collect the payment.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full bg-brand-accent py-5 font-black text-xl hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,0,51,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            PROCESSING...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            {paymentMethod === "cod" ? "PLACE ORDER (COD)" : "PAY & PLACE ORDER"}
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Order Summary */}
            <div className="col-span-1">
              <div className="bg-brand-surface p-6 md:p-8 rounded-3xl border border-white/5 sticky top-28">
                <h3 className="font-display text-2xl italic uppercase mb-6">Order Summary</h3>

                <div className="space-y-4 max-h-[250px] overflow-y-auto no-scrollbar mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-14 h-18 bg-black rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm uppercase italic truncate">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 font-indian uppercase">QTY: {item.quantity}</p>
                        <p className="font-display text-md text-brand-gold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-white/5 pt-6 mb-6">
                  <div className="flex justify-between items-center text-xs font-indian tracking-widest text-gray-400 uppercase">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-indian tracking-widest text-gray-400 uppercase">
                    <span>Shipping</span>
                    <span className={SHIPPING_CHARGES === 0 ? "text-brand-success font-black" : ""}>
                      {SHIPPING_CHARGES === 0 ? "FREE" : `₹${SHIPPING_CHARGES}`}
                    </span>
                  </div>
                  {SHIPPING_CHARGES > 0 && (
                    <p className="text-[9px] text-gray-600 font-indian tracking-widest">
                      Free shipping on orders above ₹2,000
                    </p>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <span className="font-display text-xl italic uppercase">Total</span>
                    <span className="font-display text-2xl italic text-brand-accent">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[8px] font-indian tracking-[0.3em] uppercase">PCI-DSS Secure Payment</span>
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
