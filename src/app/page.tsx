"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

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

const sectionReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const stats = [
  { value: "4,000+", label: "Jerseys Sold" },
  { value: "12", label: "Sports Covered" },
  { value: "99%", label: "Customer Satisfaction" },
  { value: "24h", label: "Express Delivery" },
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

          {/* ── Stats Strip ── */}
          <motion.section
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="border-y border-white/5 bg-brand-surface/60 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center text-center py-2 ${
                    i < stats.length - 1 ? "md:border-r md:border-white/10" : ""
                  }`}
                >
                  <span className="font-display text-4xl md:text-5xl text-brand-accent stat-number">
                    {stat.value}
                  </span>
                  <span className="font-indian text-[10px] tracking-[0.4em] uppercase text-gray-500 mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Featured Products ── */}
          <RecommendedProducts products={featuredProducts} />

          {/* ── 2D Customizer Feature ── */}
          <motion.section
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
          >
            <div className="bg-brand-surface rounded-sm border-l-4 border-brand-accent p-10 md:p-24 relative group shadow-2xl overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-brand-accent/5 blur-[100px] pointer-events-none" />
              
              <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-l from-brand-dark to-transparent z-10" />
                <div
                  className="w-full h-full bg-cover bg-center grayscale opacity-70 group-hover:scale-105 group-hover:opacity-90 transition-all duration-1000"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1000&auto=format&fit=crop')" }}
                />
              </div>

              <div className="relative z-20 max-w-xl space-y-8">
                <span className="font-indian text-[10px] tracking-[0.5em] uppercase text-brand-gold flex items-center gap-3">
                  <span className="w-6 h-px bg-brand-gold" />
                  2D Design Studio
                </span>
                <h2 className="font-display text-5xl md:text-8xl tracking-tighter leading-none">
                  ENGINEER YOUR <br />
                  <span className="text-brand-accent">OWN GLORY</span>
                </h2>
                <p className="font-indian text-gray-400 tracking-[0.2em] uppercase text-sm leading-relaxed">
                  Experience the world's most advanced jersey customizer. Control every fiber, every stitch, every dream.
                </p>
                <Link
                  href="/customize"
                  className="btn-premium inline-flex px-10 py-5 text-base group mt-2"
                >
                  START 2D STUDIO
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* ── AR Try-On Feature ── */}
          <motion.section
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-video rounded-sm overflow-hidden border border-white/10 group shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1508344928928-7165b67de128?w=1000&auto=format&fit=crop"
                  className="w-full h-full object-cover grayscale opacity-75 contrast-125 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700"
                  alt="AR Try-On"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-500 shadow-xl">
                    <Zap className="w-9 h-9 text-white group-hover:text-black transition-colors duration-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-7">
                <span className="font-indian text-brand-gold text-[10px] tracking-[0.5em] uppercase font-bold flex items-center gap-3">
                  <span className="w-6 h-px bg-brand-gold" />
                  AI FITTING ENGINE V2
                </span>
                <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-none">
                  VIRTUAL <span className="text-brand-accent">TRY-ON</span>
                </h2>
                <p className="font-indian text-gray-400 tracking-[0.1em] uppercase text-sm leading-relaxed">
                  Not sure about the fit? Use our AI-powered AR lens to see how any kit looks on you in real-time. No more second-guessing.
                </p>
                <Link
                  href="/try-on"
                  className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 font-black tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-all duration-300 group"
                >
                  LAUNCH LENS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.section>

          <Testimonials />
          <Footer />
        </motion.div>
      )}
    </main>
  );
}
