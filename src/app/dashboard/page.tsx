"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useUserStore } from "@/store/useUserStore";
import { orderService, reviewService, wishlistService, userService } from "@/lib/db";
import type { Order, Review, UserProfile } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { Skeleton, ProfileSkeleton } from "@/components/ui/Skeleton";
import {
  User, Package, Heart, History, Settings, LogOut, ChevronRight,
  Star, MapPin, Phone, Mail, Edit3, Save, X, ShoppingBag,
  CreditCard, Truck, CheckCircle, Clock, XCircle, Trash2,
  Eye, MessageSquare,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

// ─── Static product data for wishlist resolution ──────
const ALL_PRODUCTS = [
  { id: "fb-1", name: "Real Madrid Home Kit", team: "Real Madrid CF", price: 4999, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600", category: "Football" as const, rating: 5 },
  { id: "fb-2", name: "Manchester City Home Kit", team: "Manchester City", price: 4499, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600", category: "Football" as const, rating: 4 },
  { id: "cr-1", name: "India World Cup Jersey", team: "Team India", price: 2999, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600", category: "Cricket" as const, rating: 5 },
  { id: "bk-1", name: "Lakers Icon Edition", team: "LA Lakers", price: 5999, image: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=600", category: "Basketball" as const, rating: 5 },
  { id: "fb-3", name: "FC Barcelona Home Kit", team: "FC Barcelona", price: 4799, image: "https://images.unsplash.com/photo-1431324155629-1a6eda1eedfa?w=600", category: "Football" as const, rating: 4 },
  { id: "fb-4", name: "Arsenal FC Home Kit", team: "Arsenal FC", price: 4299, image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600", category: "Football" as const, rating: 5 },
  { id: "fb-5", name: "PSG Home Kit", team: "Paris Saint-Germain", price: 5299, image: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=600", category: "Football" as const, rating: 4 },
  { id: "fb-6", name: "AC Milan Home Kit", team: "AC Milan", price: 3999, image: "https://images.unsplash.com/photo-1541534741688-6078c64b5913?w=600", category: "Football" as const, rating: 5 },
];

export default function Dashboard() {
  const { user } = useUserStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  // Data states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Edit profile states
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");

  useEffect(() => {
    if (user?.uid) loadAllData();
  }, [user?.uid]);

  const loadAllData = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const [profileData, ordersData, reviewsData, wishlistData] = await Promise.all([
        userService.getProfile(user.uid),
        orderService.getUserOrders(user.uid),
        reviewService.getUserReviews(user.uid),
        wishlistService.getWishlist(user.uid),
      ]);
      setProfile(profileData);
      setOrders(ordersData);
      setReviews(reviewsData);
      setWishlistIds(wishlistData);

      if (profileData) {
        setEditName(profileData.name || "");
        setEditPhone(profileData.phone || "");
        setEditAddress(profileData.address || "");
        setEditCity(profileData.city || "");
        setEditState(profileData.state || "");
        setEditPincode(profileData.pincode || "");
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    try {
      await userService.updateProfile(user.uid, {
        name: editName,
        phone: editPhone,
        address: editAddress,
        city: editCity,
        state: editState,
        pincode: editPincode,
      });
      if (auth.currentUser && editName) {
        await updateProfile(auth.currentUser, { displayName: editName });
      }
      toast.success("Profile updated!");
      setEditing(false);
      loadAllData();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleRemoveWishlist = async (productId: string) => {
    if (!user?.uid) return;
    try {
      await wishlistService.removeFromWishlist(user.uid, productId);
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return "N/A";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-brand-success/10 text-brand-success";
      case "Processing": return "bg-brand-cyan/10 text-brand-cyan";
      case "Confirmed": return "bg-brand-purple/10 text-brand-purple";
      case "Shipped": return "bg-brand-gold/10 text-brand-gold";
      case "Cancelled": return "bg-brand-accent/10 text-brand-accent";
      default: return "bg-white/10 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="w-3.5 h-3.5" />;
      case "Processing": return <Clock className="w-3.5 h-3.5" />;
      case "Shipped": return <Truck className="w-3.5 h-3.5" />;
      case "Cancelled": return <XCircle className="w-3.5 h-3.5" />;
      default: return <Package className="w-3.5 h-3.5" />;
    }
  };

  const tabs = [
    { id: "profile", name: "MY PROFILE", icon: <User className="w-5 h-5" /> },
    { id: "orders", name: "MY ORDERS", icon: <Package className="w-5 h-5" />, count: orders.length },
    { id: "payments", name: "PAYMENTS", icon: <CreditCard className="w-5 h-5" /> },
    { id: "wishlist", name: "WISHLIST", icon: <Heart className="w-5 h-5" />, count: wishlistIds.length },
    { id: "reviews", name: "MY REVIEWS", icon: <Star className="w-5 h-5" />, count: reviews.length },
    { id: "settings", name: "SETTINGS", icon: <Settings className="w-5 h-5" /> },
  ];

  // Wishlist resolved products
  const wishlistProducts = ALL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  // Payment history from orders
  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid" || o.paymentStatus === "Pending");

  return (
    <ProtectedRoute>
      <main className="min-h-screen pt-28 pb-20 px-4 md:px-6 bg-brand-dark">
        <Header />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* ─── Sidebar ─── */}
          <aside className="space-y-6">
            <div className="bg-brand-surface p-6 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-brand-accent p-0.5 mb-3">
                  <div className="w-full h-full rounded-full bg-brand-surface flex items-center justify-center font-display text-3xl italic font-black uppercase overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.displayName?.[0] || user?.email?.[0] || "?"
                    )}
                  </div>
                </div>
                <h2 className="font-display text-xl italic uppercase">
                  {user?.displayName || "Elite Athlete"}
                </h2>
                <p className="font-indian text-[10px] text-gray-500 tracking-widest uppercase mt-0.5">
                  {user?.email}
                </p>
                <div className="mt-3 px-3 py-1 bg-brand-accent/20 border border-brand-accent/50 rounded-full">
                  <span className="text-brand-accent font-indian text-[8px] tracking-[0.2em] font-black italic uppercase">
                    {profile?.role === "admin" ? "Admin" : "Elite Member"}
                  </span>
                </div>
              </div>
            </div>

            <nav className="bg-brand-surface rounded-3xl border border-white/5 p-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group mb-1",
                    activeTab === tab.id
                      ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20"
                      : "text-gray-500 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3 uppercase font-bold text-[11px] tracking-[0.15em]">
                    {tab.icon}
                    {tab.name}
                  </div>
                  <div className="flex items-center gap-2">
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        activeTab === tab.id ? "bg-white/20" : "bg-white/5"
                      )}>
                        {tab.count}
                      </span>
                    )}
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      activeTab === tab.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                    )} />
                  </div>
                </button>
              ))}
              <div className="h-px bg-white/5 my-3 mx-3" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-brand-accent hover:bg-brand-accent/10 transition-all duration-300 uppercase font-bold text-[11px] tracking-[0.15em]"
              >
                <LogOut className="w-5 h-5" />
                LOG OUT
              </button>
            </nav>
          </aside>

          {/* ─── Main Content ─── */}
          <div className="space-y-6">
            <div className="bg-brand-surface p-8 md:p-10 rounded-3xl border border-white/5 min-h-[600px]">
              <h1 className="font-display text-4xl md:text-5xl italic uppercase tracking-tighter mb-8">
                {tabs.find((t) => t.id === activeTab)?.name}
              </h1>

              <AnimatePresence mode="wait">
                {/* ═══════ PROFILE TAB ═══════ */}
                {activeTab === "profile" && (
                  <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {loading ? (
                      <ProfileSkeleton />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Info */}
                        <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                          <div className="flex items-center justify-between mb-6">
                            <p className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">Profile Summary</p>
                            <button
                              onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                              className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-brand-accent hover:text-white transition-colors"
                            >
                              {editing ? <><Save className="w-3.5 h-3.5" /> SAVE</> : <><Edit3 className="w-3.5 h-3.5" /> EDIT</>}
                            </button>
                          </div>
                          <div className="space-y-5">
                            <div>
                              <p className="text-[10px] text-gray-600 font-indian uppercase tracking-widest mb-1">Full Name</p>
                              {editing ? (
                                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl outline-none focus:border-brand-accent text-sm" />
                              ) : (
                                <p className="font-display text-lg uppercase italic">{profile?.name || user?.displayName || "N/A"}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-600 font-indian uppercase tracking-widest mb-1">Email</p>
                              <p className="font-display text-lg uppercase italic">{user?.email}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-600 font-indian uppercase tracking-widest mb-1">Phone</p>
                              {editing ? (
                                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                                  className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl outline-none focus:border-brand-accent text-sm" />
                              ) : (
                                <p className="font-display text-lg uppercase italic">{profile?.phone || "Not set"}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-600 font-indian uppercase tracking-widest mb-1">Member Since</p>
                              <p className="font-display text-lg uppercase italic">{formatDate(profile?.createdAt)}</p>
                            </div>
                          </div>
                          {editing && (
                            <button onClick={() => setEditing(false)} className="mt-4 text-xs text-gray-500 hover:text-white transition-colors">
                              Cancel
                            </button>
                          )}
                        </div>

                        {/* Address Card */}
                        <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-indian tracking-widest text-gray-500 uppercase mb-6">Shipping Address</p>
                          {editing ? (
                            <div className="space-y-4">
                              <input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="Street address"
                                className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl outline-none focus:border-brand-accent text-sm" />
                              <div className="grid grid-cols-2 gap-3">
                                <input value={editCity} onChange={(e) => setEditCity(e.target.value)} placeholder="City"
                                  className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl outline-none focus:border-brand-accent text-sm" />
                                <input value={editState} onChange={(e) => setEditState(e.target.value)} placeholder="State"
                                  className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl outline-none focus:border-brand-accent text-sm" />
                              </div>
                              <input value={editPincode} onChange={(e) => setEditPincode(e.target.value)} placeholder="Pincode"
                                className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl outline-none focus:border-brand-accent text-sm" />
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {profile?.address ? (
                                <>
                                  <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-sm">{profile.address}</p>
                                      <p className="text-sm text-gray-400">{profile.city}, {profile.state} – {profile.pincode}</p>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                  <MapPin className="w-8 h-8 text-white/10 mb-3" />
                                  <p className="text-xs text-gray-600 font-indian tracking-widest">No address saved yet</p>
                                  <button onClick={() => setEditing(true)} className="mt-3 text-brand-accent text-xs font-bold tracking-widest uppercase hover:underline">
                                    ADD ADDRESS
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quick Stats */}
                        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: "Total Orders", value: orders.length, icon: Package, color: "text-brand-cyan" },
                            { label: "Wishlist Items", value: wishlistIds.length, icon: Heart, color: "text-brand-accent" },
                            { label: "Reviews Given", value: reviews.length, icon: Star, color: "text-brand-gold" },
                            { label: "Total Spent", value: `₹${orders.filter(o => o.paymentStatus === "Paid").reduce((s, o) => s + o.total, 0).toLocaleString()}`, icon: CreditCard, color: "text-brand-success" },
                          ].map((stat, i) => (
                            <div key={i} className="bg-black/30 p-5 rounded-2xl border border-white/5 text-center">
                              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                              <p className="font-display text-2xl italic">{stat.value}</p>
                              <p className="text-[9px] text-gray-500 font-indian tracking-widest uppercase mt-1">{stat.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ═══════ ORDERS TAB ═══════ */}
                {activeTab === "orders" && (
                  <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {loading ? (
                      <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Package className="w-16 h-16 text-white/10 mb-4" />
                        <h4 className="font-display text-2xl italic uppercase mb-2">No orders yet</h4>
                        <p className="text-xs text-gray-500 font-indian tracking-widest mb-6">Start your collection today</p>
                        <Link href="/shop" className="bg-brand-accent px-8 py-3 font-bold text-sm hover:bg-white hover:text-black transition-all">
                          SHOP NOW
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order, i) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-black/30 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                              <div>
                                <p className="font-display text-lg italic uppercase">Order #{order.id.slice(-8).toUpperCase()}</p>
                                <p className="text-[10px] text-gray-500 font-indian tracking-widest">{formatDate(order.createdAt)}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 ${getStatusColor(order.orderStatus)}`}>
                                  {getStatusIcon(order.orderStatus)}
                                  {order.orderStatus}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                  order.paymentStatus === "Paid" ? "bg-brand-success/10 text-brand-success" : "bg-brand-gold/10 text-brand-gold"
                                }`}>
                                  {order.paymentMethod === "cod" ? "COD" : "STRIPE"} • {order.paymentStatus}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-4">
                              {order.items?.map((item, j) => (
                                <div key={j} className="flex items-center gap-3 bg-brand-dark/50 px-3 py-2 rounded-xl">
                                  <div className="w-10 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold">{item.name}</p>
                                    <p className="text-[10px] text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                              <p className="text-[10px] text-gray-500 font-indian tracking-widest uppercase">
                                {order.items?.reduce((s, i) => s + i.quantity, 0)} items
                              </p>
                              <p className="font-display text-xl italic text-brand-gold">₹{order.total?.toLocaleString()}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ═══════ PAYMENTS TAB ═══════ */}
                {activeTab === "payments" && (
                  <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {loading ? (
                      <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : paidOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <CreditCard className="w-16 h-16 text-white/10 mb-4" />
                        <h4 className="font-display text-2xl italic uppercase mb-2">No payment history</h4>
                        <p className="text-xs text-gray-500 font-indian tracking-widest">Your transactions will appear here</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/5 bg-black/20 font-indian uppercase tracking-widest text-[10px] text-gray-500">
                              <th className="p-4 font-normal">Date</th>
                              <th className="p-4 font-normal">Order ID</th>
                              <th className="p-4 font-normal">Method</th>
                              <th className="p-4 font-normal">Amount</th>
                              <th className="p-4 font-normal">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paidOrders.map((order) => (
                              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                                <td className="p-4 font-indian text-gray-400">{formatDate(order.createdAt)}</td>
                                <td className="p-4 font-indian tracking-wider text-gray-300">#{order.id.slice(-8).toUpperCase()}</td>
                                <td className="p-4">
                                  <span className="inline-flex items-center gap-1.5">
                                    {order.paymentMethod === "cod" ? <Truck className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                                    <span className="uppercase text-xs font-bold">{order.paymentMethod === "cod" ? "COD" : "Stripe"}</span>
                                  </span>
                                </td>
                                <td className="p-4 font-display text-lg text-brand-gold">₹{order.total?.toLocaleString()}</td>
                                <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    order.paymentStatus === "Paid" ? "bg-brand-success/10 text-brand-success" : "bg-brand-gold/10 text-brand-gold"
                                  }`}>
                                    {order.paymentStatus}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ═══════ WISHLIST TAB ═══════ */}
                {activeTab === "wishlist" && (
                  <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {wishlistProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Heart className="w-16 h-16 text-white/10 mb-4" />
                        <h4 className="font-display text-2xl italic uppercase mb-2">Wishlist is empty</h4>
                        <p className="text-xs text-gray-500 font-indian tracking-widest mb-6">Save your favorite jerseys here</p>
                        <Link href="/shop" className="bg-brand-accent px-8 py-3 font-bold text-sm hover:bg-white hover:text-black transition-all">
                          BROWSE COLLECTIONS
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlistProducts.map((product, i) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-black/30 rounded-2xl border border-white/5 overflow-hidden group hover:border-brand-accent/30 transition-all"
                          >
                            <div className="aspect-[4/3] overflow-hidden bg-black/40">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-4">
                              <h4 className="font-display text-lg italic">{product.name}</h4>
                              <p className="text-[10px] text-gray-500 font-indian tracking-widest uppercase">{product.team}</p>
                              <div className="flex items-center justify-between mt-3">
                                <p className="font-display text-lg text-brand-gold">₹{product.price.toLocaleString()}</p>
                                <button
                                  onClick={() => handleRemoveWishlist(product.id)}
                                  className="p-2 rounded-lg hover:bg-brand-accent/20 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-brand-accent" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ═══════ REVIEWS TAB ═══════ */}
                {activeTab === "reviews" && (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {reviews.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <MessageSquare className="w-16 h-16 text-white/10 mb-4" />
                        <h4 className="font-display text-2xl italic uppercase mb-2">No reviews yet</h4>
                        <p className="text-xs text-gray-500 font-indian tracking-widest mb-6">Share your thoughts on products you&apos;ve purchased</p>
                        <Link href="/shop" className="bg-brand-accent px-8 py-3 font-bold text-sm hover:bg-white hover:text-black transition-all">
                          SHOP NOW
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review, i) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-black/30 p-5 rounded-2xl border border-white/5"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="text-xs font-bold uppercase">Product: {review.productId}</p>
                                <p className="text-[10px] text-gray-500 font-indian tracking-widest">{formatDate(review.createdAt)}</p>
                              </div>
                              <StarRating rating={review.rating} readonly size="sm" />
                            </div>
                            <p className="text-sm text-gray-300 font-indian tracking-wide">{review.comment}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ═══════ SETTINGS TAB ═══════ */}
                {activeTab === "settings" && (
                  <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="space-y-6 max-w-lg">
                      <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                        <h4 className="font-display text-xl italic uppercase mb-4">Account</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div className="flex items-center gap-3">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">Email Notifications</span>
                            </div>
                            <button className="w-12 h-6 rounded-full bg-brand-accent/20 border border-brand-accent/50 relative">
                              <div className="w-5 h-5 rounded-full bg-brand-accent absolute right-0.5 top-0.5 transition-all" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">SMS Alerts</span>
                            </div>
                            <button className="w-12 h-6 rounded-full bg-white/10 border border-white/20 relative">
                              <div className="w-5 h-5 rounded-full bg-gray-500 absolute left-0.5 top-0.5 transition-all" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 p-6 rounded-2xl border border-brand-accent/20">
                        <h4 className="font-display text-xl italic uppercase mb-4 text-brand-accent">Danger Zone</h4>
                        <p className="text-xs text-gray-500 font-indian tracking-widest mb-4">
                          Once you delete your account, there is no going back.
                        </p>
                        <button className="px-6 py-3 border border-brand-accent text-brand-accent text-xs font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all">
                          DELETE ACCOUNT
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}
