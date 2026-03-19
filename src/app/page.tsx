"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";

import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/home/Hero";
import { RecommendedProducts } from "@/components/shared/RecommendedProducts";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Testimonials } from "@/components/home/Testimonials";
import type { Product } from "@/types";

const featuredProducts: Product[] = [
  { id: "fb-1", name: "Real Madrid Home Kit", team: "Real Madrid CF", price: 4999, image: "/images/real_madrid.png", category: "football", sport: "football", description: "Royal white performance kit", stock: 100, rating: 5 },
  { id: "fb-2", name: "Arsenal Away Kit", team: "Arsenal FC", price: 4499, image: "/images/arsenal.png", category: "football", sport: "football", description: "Elite away performance", stock: 80, rating: 5 },
  { id: "bk-1", name: "Lakers City Edition", team: "LA Lakers", price: 3999, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800", category: "basketball", sport: "basketball", description: "Showtime basketball", stock: 50, rating: 4 },
  { id: "cr-1", name: "India World Cup Kit", team: "Team India", price: 3499, image: "https://images.unsplash.com/photo-1431324155629-1a6eda1eed2d?w=800", category: "cricket", sport: "cricket", description: "Men in blue official gear", stock: 200, rating: 5 },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="relative min-h-screen bg-brand-dark">
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
        <Header />
        <Hero />
          
          <RecommendedProducts products={featuredProducts} />

          {/* Feature Highlight: 3D Customizer */}
          <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
            <div className="bg-brand-surface rounded-sm border-l-4 border-brand-accent p-12 md:p-24 relative group shadow-2xl">
                <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
                   <div className="absolute inset-0 bg-gradient-to-l from-brand-dark to-transparent z-10" />
                   <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                </div>
                
                <div className="relative z-20 max-w-xl space-y-8">
                   <h2 className="font-display text-6xl md:text-8xl tracking-tighter leading-none">
                      ENGINEER YOUR <br />
                      <span className="text-brand-accent">OWN GLORY</span>
                   </h2>
                   <p className="font-indian text-gray-400 tracking-[0.2em] uppercase text-sm leading-relaxed">
                      Experience the world's most advanced 3D jersey customizer. Control every fiber, every stitch, every dream.
                   </p>
                   <Link 
                      href="/customize"
                      className="inline-flex border-2 border-brand-accent bg-brand-accent text-white px-12 py-5 font-black text-lg tracking-widest hover:bg-black hover:text-white transition-all duration-500 shadow-xl"
                   >
                      START 2D STUDIO
                   </Link>
                </div>
            </div>
          </section>

          {/* Feature Highlight: AR Try-On */}
          <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-video rounded-sm overflow-hidden border border-white/10 group shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1508344928928-7165b67de128?w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-80 contrast-125 group-hover:scale-105 transition-transform duration-700" alt="AR" />
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-24 h-24 bg-brand-accent rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-500">
                             <Zap className="w-10 h-10 text-white group-hover:text-black transition-colors duration-500" />
                         </div>
                    </div>
                </div>
                <div className="space-y-8">
                    <span className="font-indian text-brand-gold text-[10px] tracking-[0.5em] uppercase font-bold">AI FITTING ENGINE V2</span>
                    <h2 className="font-display text-6xl md:text-7xl uppercase tracking-tighter">
                       VIRTUAL <span className="text-brand-accent">TRY-ON</span>
                    </h2>
                    <p className="font-indian text-gray-400 tracking-[0.1em] uppercase text-sm leading-relaxed">
                       Not sure about the fit? Use our AI-powered AR lens to see how any kit looks on you in real-time. No more second-guessing.
                    </p>
                    <Link 
                       href="/try-on"
                       className="inline-flex bg-white text-black px-8 py-4 font-black tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-colors"
                    >
                       LAUNCH LENS
                    </Link>
                </div>
              </div>
           </section>

          <Testimonials />

          <Footer />
        </motion.div>
      )}
    </main>
  );
}
