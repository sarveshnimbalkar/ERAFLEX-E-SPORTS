"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Type, Save, ShoppingCart, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomizerPage() {
  const [name, setName] = useState("VIBES");
  const [number, setNumber] = useState("99");
  const [fontStyle, setFontStyle] = useState<"clean" | "varsity" | "tech">("varsity");

  // Map font styles to CSS classes
  const fontClassMap = {
    clean: "font-sans font-black tracking-widest",
    varsity: "font-display italic tracking-wide",
    tech: "font-indian tracking-[0.5em] font-bold"
  };

  const fonts = [
    { id: "varsity", label: "Pro Varsity", icon: "VARSITY" },
    { id: "clean", label: "Modern Clean", icon: "CLEAN" },
    { id: "tech", label: "Cyber Tech", icon: "TECH" },
  ] as const;

  const handleReset = () => {
    setName("VIBES");
    setNumber("99");
    setFontStyle("varsity");
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-brand-dark flex flex-col items-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-cyan/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none" />
      
      <Header />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Editor Info */}
        <div className="lg:col-span-12 space-y-2 text-center mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block px-4 py-1 border border-brand-cyan/30 rounded-full font-indian text-brand-cyan tracking-[0.5em] text-xs uppercase mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)] bg-black/50 backdrop-blur-md"
            >
              PRO-LENS 4.0 // 2D REALISM
            </motion.div>
            <h1 className="font-display text-6xl md:text-9xl italic uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(255,0,85,0.4)]">
                DRIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-cyan">FORGE</span>
            </h1>
        </div>

        {/* Realistic 2D Viewport */}
        <div className="lg:col-span-7 bg-brand-surface/40 rounded-[3rem] border border-white/10 glass p-4 md:p-12 relative group shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center min-h-[600px]">
            
            {/* The Jersey Canvas */}
            <div className="relative w-full max-w-lg aspect-[3/4] flex items-center justify-center">
                {/* Base Image */}
                <motion.img 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  src="/images/custom_jersey_base.png" 
                  alt="Blank Custom Jersey" 
                  className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                />

                {/* Text Overlays - Carefully positioned over the back of the jersey */}
                <div className="absolute inset-x-0 top-[20%] bottom-[15%] flex flex-col items-center pt-8">
                   {/* Name Overlay */}
                   <AnimatePresence mode="popLayout">
                     <motion.h2 
                        key={name + fontStyle}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 0.9, y: 0, scale: 1 }}
                        className={cn(
                          "text-[#0c1328] uppercase drop-shadow-md mix-blend-multiply opacity-90",
                          fontClassMap[fontStyle],
                          fontStyle === 'tech' ? 'text-3xl lg:text-4xl' : 'text-5xl lg:text-6xl'
                        )}
                        style={{ 
                          // Slight arching effect using perspective
                          transform: 'perspective(500px) rotateX(5deg)',
                          WebkitFontSmoothing: 'antialiased'
                        }}
                     >
                        {name || "NAME"}
                     </motion.h2>
                   </AnimatePresence>

                   {/* Number Overlay */}
                   <AnimatePresence mode="popLayout">
                     <motion.div 
                        key={number + fontStyle}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 0.95, scale: 1 }}
                        className={cn(
                          "text-[#0c1328] mt-4 drop-shadow-lg mix-blend-multiply text-[12rem] lg:text-[15rem] leading-none",
                          fontClassMap[fontStyle]
                        )}
                        style={{ 
                          // Giving the number some realistic "printed" weight
                          transform: 'perspective(500px) rotateX(2deg)',
                           WebkitFontSmoothing: 'antialiased'
                        }}
                     >
                        {number || "00"}
                     </motion.div>
                   </AnimatePresence>
                </div>
            </div>
            
            {/* UI Overlay on Canvas */}
            <div className="absolute top-8 left-8 flex flex-col gap-2 pointer-events-none">
                <span className="font-indian text-xs tracking-widest text-brand-cyan uppercase animate-pulse">Photo-Real Render</span>
                <span className="font-display text-2xl italic text-white/50">EF-2026-X</span>
            </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-5 space-y-8 flex flex-col">
            <div className="bg-brand-surface/80 p-8 rounded-[2rem] border border-white/10 glass space-y-10 flex-grow shadow-2xl backdrop-blur-xl">
                
                {/* Typography Style */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Type className="w-5 h-5 text-brand-cyan" />
                        <h3 className="font-display text-3xl italic uppercase tracking-wider">Typography</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {fonts.map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setFontStyle(f.id)}
                            className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300",
                              fontStyle === f.id 
                                ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]" 
                                : "border-white/10 text-white/50 hover:border-white/30 hover:text-white bg-black/40"
                            )}
                          >
                             <span className={cn("text-2xl mb-2 mix-blend-screen", fontClassMap[f.id as keyof typeof fontClassMap])}>{f.icon}</span>
                             <span className="font-indian text-[10px] tracking-widest uppercase">{f.label}</span>
                          </button>
                        ))}
                    </div>
                </div>

                {/* Name & Number Input */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Type className="w-5 h-5 text-brand-accent" />
                        <h3 className="font-display text-3xl italic uppercase tracking-wider">Identity</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="font-indian text-[10px] tracking-widest text-gray-500 uppercase">Player Name (Max 12)</label>
                           <input 
                               value={name}
                               maxLength={12}
                               onChange={(e) => setName(e.target.value.toUpperCase())}
                               placeholder="GAMER TAG"
                               className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl outline-none focus:border-brand-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] font-display text-2xl transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="font-indian text-[10px] tracking-widest text-gray-500 uppercase">Squad Number (0-99)</label>
                           <input 
                               value={number}
                               maxLength={2}
                               onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))} // Only numbers
                               placeholder="99"
                               className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl outline-none focus:border-brand-accent focus:shadow-[0_0_15px_rgba(255,0,85,0.2)] font-display text-3xl transition-all"
                           />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <button 
                    onClick={handleReset}
                    className="col-span-1 flex items-center justify-center gap-2 py-5 border border-white/20 rounded-2xl hover:bg-white/10 transition-all font-bold tracking-widest uppercase shadow-lg backdrop-blur-md text-white/70 hover:text-white"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
                <button className="col-span-2 bg-gradient-to-r from-brand-accent to-brand-purple text-white py-5 font-black text-xl rounded-2xl hover:shadow-[0_0_40px_rgba(255,0,85,0.6)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group">
                    FORGE KIT
                    <ShoppingCart className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
