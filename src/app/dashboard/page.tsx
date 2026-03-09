"use client";

import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useUserStore } from "@/store/useUserStore";
import { User, Package, Heart, History, Settings, LogOut, ChevronRight } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useUserStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const tabs = [
    { id: "profile", name: "MY PROFILE", icon: <User className="w-5 h-5" /> },
    { id: "orders", name: "MY ORDERS", icon: <Package className="w-5 h-5" /> },
    { id: "wishlist", name: "WISHLIST", icon: <Heart className="w-5 h-5" /> },
    { id: "history", name: "PAYMENTS", icon: <History className="w-5 h-5" /> },
    { id: "settings", name: "SETTINGS", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <ProtectedRoute>
      <main className="min-h-screen pt-32 pb-20 px-6 bg-brand-dark">
        <Header />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="col-span-1 space-y-8">
            <div className="bg-brand-surface p-8 rounded-3xl border border-white/5 glass relative overflow-hidden">
               {/* User Info */}
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-brand-accent p-1 mb-4">
                    <div className="w-full h-full rounded-full bg-brand-surface flex items-center justify-center font-display text-4xl italic font-black uppercase overflow-hidden">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.displayName?.[0] || user?.email?.[0] || "?"
                      )}
                    </div>
                  </div>
                  <h2 className="font-display text-2xl italic uppercase group-hover:text-brand-accent">
                    {user?.displayName || "Elite Athlete"}
                  </h2>
                  <p className="font-indian text-xs text-gray-500 tracking-widest uppercase mt-1">
                    {user?.email}
                  </p>
                  <div className="mt-4 px-3 py-1 bg-brand-accent/20 border border-brand-accent/50 rounded-full">
                    <span className="text-brand-accent font-indian text-[8px] tracking-[0.2em] font-black italic uppercase">Super Fan Badge</span>
                  </div>
               </div>
            </div>

            <nav className="bg-brand-surface rounded-3xl border border-white/5 glass p-4">
               {tabs.map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group hover-trigger",
                      activeTab === tab.id ? "bg-brand-accent text-white shadow-lg" : "text-gray-500 hover:bg-white/5 hover:text-white"
                    )}
                 >
                    <div className="flex items-center gap-4 uppercase font-bold text-xs tracking-[0.2em]">
                      {tab.icon}
                      {tab.name}
                    </div>
                    <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", activeTab === tab.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0")} />
                 </button>
               ))}
               <div className="h-px bg-white/5 my-4 mx-4" />
               <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-brand-accent hover:bg-brand-accent/10 transition-all duration-300 uppercase font-bold text-xs tracking-[0.2em]"
               >
                  <LogOut className="w-5 h-5" />
                  LOG OUT
               </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-3 space-y-8">
             <div className="bg-brand-surface p-10 rounded-3xl border border-white/5 glass min-h-[600px]">
                <h1 className="font-display text-5xl md:text-6xl italic uppercase tracking-tighter mb-10">
                  {tabs.find(t => t.id === activeTab)?.name}
                </h1>
                
                <div className="space-y-6">
                  {activeTab === "profile" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-black/30 p-8 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-indian tracking-widest text-gray-500 uppercase mb-4">PROFILE SUMMARY</p>
                        <div className="space-y-6">
                          <div>
                            <p className="text-xs text-gray-600 font-indian uppercase tracking-widest">Full Name</p>
                            <p className="font-display text-xl uppercase italic">{user?.displayName || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-indian uppercase tracking-widest">Email Address</p>
                            <p className="font-display text-xl uppercase italic">{user?.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-indian uppercase tracking-widest">Member Since</p>
                            <p className="font-display text-xl uppercase italic">MARCH 2026</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-brand-accent/5 p-8 rounded-2xl border border-brand-accent/20 border-dashed flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center mb-4">
                          <History className="text-brand-accent" />
                        </div>
                        <h4 className="font-display text-2xl italic mb-2 uppercase">Order History</h4>
                        <p className="text-xs text-gray-500 font-indian uppercase tracking-widest max-w-[200px] leading-relaxed">
                          You haven't placed any orders yet. Start your collection now.
                        </p>
                        <button 
                          onClick={() => router.push("/shop")}
                          className="mt-6 text-brand-accent text-xs font-black italic uppercase tracking-[0.3em] hover:underline"
                        >
                          SHOP NEW KITS
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab !== "profile" && (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center text-gray-600">
                      <p className="font-display text-2xl italic uppercase tracking-[0.5em] opacity-30">
                        {tabs.find(t => t.id === activeTab)?.name} Coming Soon
                      </p>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}
