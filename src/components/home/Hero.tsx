"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const JERSEYS = [
  { src: "/images/real_madrid.png", line1: "REAL",   line2: "MADRID", tag: "LA LIGA", color: "#c0a050" },
  { src: "/images/barcelona.png",   line1: "BARÇA",  line2: "KIT",    tag: "LA LIGA", color: "#a50044" },
  { src: "/images/india.png",       line1: "TEAM",   line2: "INDIA",  tag: "CRICKET", color: "#0033a0" },
  { src: "/images/lakers.png",      line1: "LAKERS", line2: "CITY",   tag: "NBA",     color: "#552583" },
];

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = JERSEYS[activeIdx];

  // Spring mouse tracking
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 50, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 50, damping: 18 });

  // Jersey: floats opposite to mouse
  const jerseyTranslateX = useTransform(springX, [-0.5, 0.5], ["-3%", "3%"]);
  const jerseyTranslateY = useTransform(springY, [-0.5, 0.5], ["-2.5%", "2.5%"]);
  const jerseyRotY = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const jerseyRotX = useTransform(springY, [-0.5, 0.5], [4, -4]);

  // Text: drifts with mouse (shallower)
  const textX = useTransform(springX, [-0.5, 0.5], ["1%", "-1%"]);
  const textY = useTransform(springY, [-0.5, 0.5], ["0.8%", "-0.8%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleMouseLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col"
    >
      {/* ── Pure black radial background ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_55%,#111_0%,#000_100%)]" />

      {/* ── Ambient glow (per jersey color) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 55% 50%, ${active.color}18 0%, transparent 70%)`,
          transition: "background 0.9s ease",
        }}
      />

      {/* ── Scan lines ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.5) 2px,rgba(255,255,255,0.5) 3px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* ── Vignette ── */}
      <div className="absolute inset-0 z-[3] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%,transparent 55%,rgba(0,0,0,0.75) 100%)" }}
      />

      {/* ── Main 3-column layout ── */}
      <div className="relative z-[10] flex-1 flex items-center w-full max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pt-24 pb-20">
        
        {/* LEFT — typography */}
        <motion.div
          style={{ x: textX, y: textY }}
          className="w-[30%] min-w-0 flex-shrink-0 flex flex-col justify-center z-10"
        >
          {/* Eyebrow */}
          <motion.span
            key={activeIdx + "eyebrow"}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="font-indian text-[9px] tracking-[0.6em] uppercase text-brand-gold mb-5 flex items-center gap-2"
          >
            <span className="w-6 h-px bg-brand-gold opacity-60" />
            EF — 2026 · {active.tag}
          </motion.span>

          {/* Heading line 1 */}
          <div className="overflow-hidden">
            <motion.h1
              key={activeIdx + "line1"}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className="font-display text-[clamp(3rem,6vw,7.5rem)] leading-[0.85] tracking-tighter text-white"
            >
              {active.line1}
            </motion.h1>
          </div>

          {/* Heading line 2 */}
          <div className="overflow-hidden mb-8">
            <motion.h1
              key={activeIdx + "line2"}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className="font-display text-[clamp(3rem,6vw,7.5rem)] leading-[0.85] tracking-tighter text-brand-accent"
            >
              {active.line2}
            </motion.h1>
          </div>

          {/* CTA */}
          <motion.div
            key={activeIdx + "cta"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
          >
            <Link
              href="/shop"
              className="btn-premium inline-flex items-center gap-3 px-7 py-4 text-xs tracking-widest group"
            >
              SHOP THIS KIT
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* CENTER — jersey */}
        <div className="flex-1 flex items-center justify-center relative z-10 min-w-0">
          {/* Ghost number behind jersey */}
          <div
            className="absolute font-display text-[35vw] leading-none text-white/[0.025] select-none pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {String(activeIdx + 1).padStart(2, "0")}
          </div>

          <motion.div
            style={{
              x: jerseyTranslateX,
              y: jerseyTranslateY,
              rotateY: jerseyRotY,
              rotateX: jerseyRotX,
              transformStyle: "preserve-3d",
              perspective: 1200,
            }}
            className="relative z-10"
          >
            {/* Per-jersey halo glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${active.color}20 0%, transparent 65%)`,
                filter: "blur(30px)",
                transition: "background 0.8s ease",
              }}
            />

            {/* Jersey image with cross-fade animation */}
            <motion.img
              key={activeIdx}
              src={active.src}
              alt={active.line1 + " " + active.line2}
              draggable={false}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className="relative z-10 select-none w-[280px] sm:w-[320px] md:w-[380px] lg:w-[440px] xl:w-[500px] object-contain"
              style={{
                filter: `drop-shadow(0 0 50px ${active.color}28) drop-shadow(0 30px 60px rgba(0,0,0,0.85))`,
              }}
            />

            {/* Jersey tag label */}
            <motion.p
              key={activeIdx + "tag"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center font-indian text-[9px] tracking-[0.5em] uppercase text-white/25 mt-4"
            >
              {active.tag}
            </motion.p>
          </motion.div>
        </div>

        {/* RIGHT — stats */}
        <div className="w-[16%] min-w-[110px] flex-shrink-0 hidden md:flex flex-col justify-center items-end gap-8 z-10">
          {[
            { label: "Collection", value: "2026" },
            { label: "Edition",    value: "Elite" },
            { label: "Crafted",    value: "India" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className="text-right"
            >
              <p className="font-display text-xl lg:text-2xl xl:text-3xl text-white/75">{item.value}</p>
              <p className="font-indian text-[8px] tracking-[0.45em] uppercase text-white/25 mt-0.5">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom: thumbnail switcher + marquee ── */}
      <div className="relative z-[15] w-full">
        {/* Thumbnail strip */}
        <div className="flex items-center justify-center gap-4 pb-4 px-4">
          {JERSEYS.map((j, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="group transition-all duration-300 focus:outline-none"
            >
              <div
                className={`w-12 h-14 md:w-14 md:h-16 rounded overflow-hidden border-2 transition-all duration-400 ${
                  i === activeIdx
                    ? "border-brand-accent scale-110 shadow-[0_0_16px_rgba(225,29,72,0.5)]"
                    : "border-white/10 opacity-40 hover:opacity-65 hover:border-white/25"
                }`}
              >
                <img src={j.src} alt={j.line1} className="w-full h-full object-cover" />
              </div>
            </button>
          ))}
        </div>

        {/* Marquee */}
        <div className="border-t border-white/5 bg-black/60 backdrop-blur-sm py-3 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 24, repeat: Infinity }}
            className="flex whitespace-nowrap gap-12 font-display italic text-base text-white/20 tracking-widest"
          >
            {Array(12).fill(0).map((_, i) => (
              <span key={i} className="flex items-center gap-12">
                <span>EF-2026</span>
                <span className="text-brand-accent text-xs">✦</span>
                <span>ELITE JERSEYS</span>
                <span className="text-brand-gold text-xs">✦</span>
                <span className="text-brand-accent">PREMIUM GEAR</span>
                <span className="text-white/15 text-xs">✦</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
