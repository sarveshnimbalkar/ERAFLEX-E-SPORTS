"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/home/Hero";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { RecommendedProducts } from "@/components/shared/RecommendedProducts";
import { Product } from "@/store/useCartStore";

const featuredProducts: Product[] = [
  { id: "fb-1", name: "Real Madrid Home Kit", team: "Real Madrid CF", price: 4999, image: "/images/real_madrid.png", category: "Football", rating: 5 },
  { id: "fb-3", name: "FC Barcelona Home Kit", team: "FC Barcelona", price: 4799, image: "/images/barcelona.png", category: "Football", rating: 4 },
  { id: "bk-1", name: "Lakers Icon Edition", team: "LA Lakers", price: 5999, image: "/images/lakers.png", category: "Basketball", rating: 5 },
  { id: "cr-1", name: "India World Cup Jersey", team: "Team India", price: 2999, image: "/images/india.png", category: "Cricket", rating: 5 },
];

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="relative min-h-screen bg-brand-dark">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Header />
          <Hero />
          
          <RecommendedProducts products={featuredProducts} />

          {/* Feature Highlight: 3D Customizer */}
          <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
            <div className="bg-brand-surface rounded-[3rem] border border-white/5 glass p-12 md:p-24 relative group">
                <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
                   <div className="absolute inset-0 bg-gradient-to-l from-brand-accent/20 to-transparent z-10" />
                   <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1541534741688-6078c64b5913?w=1000')] bg-cover bg-center grayscale opacity-30 group-hover:scale-110 transition-transform duration-1000" />
                </div>
                
                <div className="relative z-20 max-w-xl space-y-8">
                   <h2 className="font-display text-6xl md:text-8xl italic uppercase tracking-tighter leading-none">
                      ENGINEER YOUR <br />
                      <span className="text-brand-accent italic">OWN GLORY</span>
                   </h2>
                   <p className="font-indian text-gray-400 tracking-[0.3em] uppercase text-sm leading-relaxed">
                      Experience the world's most advanced 3D jersey customizer. Control every fiber, every stitch, every dream.
                   </p>
                   <Link 
                      href="/customize"
                      className="inline-flex bg-white text-black px-12 py-5 font-black text-xl hover:bg-brand-accent hover:text-white transition-all duration-500 shadow-2xl skew-x-[-10deg] hover:skew-x-0"
                   >
                      START 3D BUILDER
                   </Link>
                </div>
            </div>
          </section>

          {/* Feature Highlight: AR Try-On */}
          <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-video rounded-3xl overflow-hidden glass border border-white/10 group">
                    <img src="https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=1000" className="w-full h-full object-cover grayscale opacity-50 contrast-125" alt="AR" />
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-20 h-20 bg-brand-accent/20 rounded-full flex items-center justify-center border border-brand-accent animate-pulse">
                             <Zap className="w-8 h-8 text-brand-accent" />
                         </div>
                    </div>
                </div>
                <div className="space-y-8">
                    <span className="font-indian text-brand-gold text-[10px] tracking-[0.5em] uppercase font-black">AI FITTING ENGINE V2</span>
                    <h2 className="font-display text-6xl md:text-7xl italic uppercase tracking-tighter">
                       VIRTUAL <span className="text-brand-accent">TRY-ON</span>
                    </h2>
                    <p className="font-indian text-gray-500 tracking-[0.2em] uppercase text-sm leading-relaxed">
                       Not sure about the fit? Use our AI-powered AR lens to see how any kit looks on you in real-time. No more second-guessing.
                    </p>
                    <Link 
                       href="/try-on"
                       className="inline-flex text-brand-accent font-black text-lg italic uppercase tracking-[0.3em] border-b-2 border-brand-accent hover:text-white hover:border-white transition-colors pb-1"
                    >
                       LAUNCH LENS
                    </Link>
                </div>
             </div>
          </section>

          <Footer />
        </motion.div>
      )}
    </main>
  );
}
