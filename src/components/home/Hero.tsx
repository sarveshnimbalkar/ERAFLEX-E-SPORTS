"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Background Image with Premium Tint */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Premium Elite Sports Gear"
          fill
          priority
          className="object-cover opacity-80"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark via-brand-surface/70 to-brand-purple/20" />
      </div>

      {/* Hero Content - Brutalist Left Alignment */}
      <div className="relative z-10 px-6 md:px-16 w-full max-w-7xl mx-auto flex flex-col items-start mt-12">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-[15vw] md:text-[8rem] leading-[0.85] italic mb-6 drop-shadow-[0_0_40px_rgba(112,0,255,0.3)] tracking-tighter"
        >
          BREAK THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-success to-brand-accent">
            SIMULATION
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-indian text-lg md:text-xl tracking-[0.5em] mb-12 text-white/70 uppercase max-w-2xl border-l-[3px] border-brand-accent pl-6 py-2 bg-gradient-to-r from-brand-accent/10 to-transparent"
        >
          Hyper-engineered performance gear for the elite generation. 
          Defy physics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-6 justify-start w-full"
        >
          <button className="bg-gradient-to-r from-brand-accent to-brand-purple px-12 py-5 font-black text-xl hover:from-white hover:to-white hover:text-black transition-all duration-500 shadow-xl group hover-trigger flex items-center justify-center gap-3">
            ENTER THE DROP
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
          <button className="border border-brand-cyan/30 px-10 py-5 font-black text-xl hover:border-brand-cyan hover:bg-brand-cyan/10 hover:text-brand-cyan transition-all duration-300 hover-trigger backdrop-blur-md">
            VIEW CAMPAIGN
          </button>
        </motion.div>
      </div>

      {/* Decorative Elements - Grid & Ticker */}
      <div className="absolute bottom-8 left-0 right-0 overflow-hidden border-y border-white/5 bg-black/40 backdrop-blur-md py-3 flex">
        <motion.div 
           animate={{ x: ["0%", "-50%"] }}
           transition={{ ease: "linear", duration: 20, repeat: Infinity }}
           className="flex whitespace-nowrap gap-12 font-display italic text-2xl text-white/40 tracking-widest"
        >
           {Array(10).fill(0).map((_, i) => (
             <span key={i}>EF-2026 // PREMIUM ATHLETICS // <span className="text-brand-accent">PERFORMANCE GEAR</span> //</span>
           ))}
        </motion.div>
      </div>
      
      <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:flex flex-col gap-8 opacity-40">
        {["01", "02", "03", "04"].map((step) => (
          <div key={step} className="font-indian tracking-widest text-xs border border-white/20 p-2 text-center rounded-sm">
            {step}
          </div>
        ))}
      </div>
    </section>
  );
};
