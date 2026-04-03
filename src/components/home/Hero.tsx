"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Box } from "lucide-react";

const JERSEYS = [
  { src: "/kits/fb-1.jpg", line1: "REAL",   line2: "MADRID", tag: "LA LIGA", color: "#c0a050" },
  { src: "/kits/fb-3.png",   line1: "BARÇA",  line2: "KIT",    tag: "LA LIGA", color: "#a50044" },
  { src: "/kits/cr-1.jpg",       line1: "TEAM",   line2: "INDIA",  tag: "CRICKET", color: "#0033a0" },
  { src: "/kits/bk-1.png",      line1: "LAKERS", line2: "CITY",   tag: "NBA",     color: "#552583" },
];

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = JERSEYS[activeIdx];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax bindings
  const bgTextY = useTransform(scrollYProgress, [0, 1], [0, 350]);
  const jerseyScrollY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Spring mouse tracking for 3D Peel
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 40, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 40, damping: 20 });

  // Jersey: floats opposite to mouse, tilts 3D
  const jerseyTranslateX = useTransform(springX, [-0.5, 0.5], ["-4%", "4%"]);
  const jerseyTranslateY = useTransform(springY, [-0.5, 0.5], ["-4%", "4%"]);
  const jerseyRotY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const jerseyRotX = useTransform(springY, [-0.5, 0.5], [12, -12]);

  // Text: drifts with mouse (shallower)
  const textX = useTransform(springX, [-0.5, 0.5], ["1%", "-1%"]);
  const textY = useTransform(springY, [-0.5, 0.5], ["0.8%", "-0.8%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  
  const handleMouseLeave = () => { 
    rawX.set(0); 
    rawY.set(0); 
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[120vh] bg-black overflow-hidden flex flex-col pt-24"
    >
      {/* ── Background & Ambient Lighting ── */}
      <div className="absolute inset-0 bg-brand-dark" />
      <motion.div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `radial-gradient(ellipse 70% 80% at 50% 40%, ${active.color}35 0%, #000 80%)`,
          transition: "background 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      
      {/* ── Massive Awwwards Background Typography ── */}
      <motion.div 
        style={{ y: bgTextY }}
        className="absolute inset-0 flex flex-col items-center justify-center z-[2] pointer-events-none overflow-hidden opacity-30 mix-blend-overlay"
      >
        <motion.h1 
          key={activeIdx + "bg"}
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[28vw] leading-none tracking-tighter text-white select-none text-center whitespace-nowrap"
        >
          {active.line2}
        </motion.h1>
      </motion.div>

      {/* ── Main Layout ── */}
      <motion.div 
        style={{ opacity: contentOpacity }}
        className="relative z-[10] flex-1 flex flex-col md:flex-row items-center w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 h-full min-h-[80vh]"
      >
        
        {/* LEFT — Typography & CTAs */}
        <motion.div
          style={{ x: textX, y: textY }}
          className="w-full md:w-[35%] flex flex-col justify-center z-20 order-2 md:order-1 mt-10 md:mt-0"
        >
          <motion.span
            key={activeIdx + "eyebrow"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-indian text-[10px] tracking-[0.6em] uppercase text-brand-gold mb-6 flex items-center gap-3"
          >
            <span className="w-10 h-[2px] bg-brand-gold" />
            V2.0 · {active.tag}
          </motion.span>

          <div className="overflow-hidden">
            <motion.h2
              key={activeIdx + "line1"}
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(4rem,7vw,8rem)] leading-[0.8] tracking-tighter text-white"
            >
              {active.line1}
            </motion.h2>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h2
              key={activeIdx + "line2"}
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(4rem,7vw,8rem)] leading-[0.8] tracking-tighter text-transparent bg-clip-text"
              style={{
                 backgroundImage: `linear-gradient(to right, ${active.color}, #fff)`
              }}
            >
              {active.line2}
            </motion.h2>
          </div>

          {/* CTA Group */}
          <motion.div
            key={activeIdx + "cta"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link
              href="/shop"
              className="relative overflow-hidden group bg-white text-black px-8 py-5 text-xs font-bold tracking-[0.2em] uppercase rounded-sm flex items-center gap-3"
            >
              <span className="relative z-10 flex items-center gap-3">
                SHOP COLLECTION
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-brand-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              <div className="absolute inset-0 bg-brand-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0 delay-75 mix-blend-multiply" />
            </Link>
            
            <Link
              href="/try-on"
              className="px-8 py-5 text-xs tracking-[0.2em] uppercase text-white border border-white/20 hover:bg-white/10 backdrop-blur-md transition-all duration-300 flex items-center gap-3 group rounded-sm"
            >
              TRY IN 3D
              <Box className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>

        {/* CENTER — 3D Parallax Jersey */}
        <div className="w-full md:w-[50%] h-[50vh] md:h-full flex items-center justify-center relative z-10 order-1 md:order-2 perspective-[2000px]">
          <motion.div
            style={{
              x: jerseyTranslateX,
              y: jerseyTranslateY,
              rotateY: jerseyRotY,
              rotateX: jerseyRotX,
              transformStyle: "preserve-3d",
            }}
            className="w-full max-w-[600px]"
          >
            <motion.div style={{ y: jerseyScrollY }} className="relative w-full h-full">
              {/* Backlight Shadow */}
              <div
                className="absolute inset-0 scale-90 blur-3xl opacity-60"
                style={{
                  background: `radial-gradient(circle, ${active.color} 0%, transparent 70%)`,
                  transition: "background 0.8s ease",
                  transformOrigin: "center 70%",
                }}
              />

              <motion.img
                key={activeIdx}
                src={active.src}
                alt={active.line1}
                draggable={false}
                initial={{ opacity: 0, scale: 0.8, rotateZ: -5 }}
                animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
                style={{
                  filter: `drop-shadow(0 40px 80px rgba(0,0,0,0.8))`,
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT — Vertical Data */}
        <div className="hidden md:flex w-[15%] flex-col justify-end items-end gap-10 z-20 order-3 pb-20">
          {[
            { label: "Season", value: "26/27" },
            { label: "Edition", value: "Player" },
            { label: "Tech", value: "Aero" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
              className="text-right flex flex-col items-end"
            >
              <p className="font-display text-2xl lg:text-4xl text-white leading-none mb-1">{item.value}</p>
              <p className="font-indian text-[9px] tracking-[0.5em] uppercase text-gray-500">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Fixed Bottom Navigator ── */}
      <motion.div 
        style={{ opacity: contentOpacity }}
        className="absolute bottom-0 inset-x-0 z-[20] border-t border-white/5 bg-black/40 backdrop-blur-xl"
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {JERSEYS.map((j, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="relative group focus:outline-none"
              >
                <div
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-500 ease-out ${
                    i === activeIdx
                      ? "border-white scale-110 shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                      : "border-white/10 opacity-50 hover:opacity-100 hover:border-white/30"
                  }`}
                >
                  <img src={j.src} alt={j.line1} className="w-full h-full object-cover bg-brand-dark" />
                </div>
                {i === activeIdx && (
                  <motion.div layoutId="nav-indicator" className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-indian tracking-widest text-gray-500 uppercase">
            <span>Scroll to explore</span>
            <div className="w-10 h-px bg-white/20" />
            <div className="w-4 h-6 border-2 border-white/20 rounded-full flex justify-center p-1">
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-1 bg-white/50 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
