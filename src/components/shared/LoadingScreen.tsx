"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS_ERA = ["E", "R", "A"];
const LETTERS_FLEX = ["F", "L", "E", "X"];

const LOADING_STEPS = [
  "CALIBRATING 3D ASSETS...",
  "OPTIMIZING GRAPHICS...",
  "SIMULATING PHYSICS...",
  "ERAFLEX SYSTEM READY.",
];

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [barDone, setBarDone] = useState(false);

  // Progress through loading text steps
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LOADING_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => setStep(i), i * 700 + 400)
      );
    });

    // Mark bar animation complete
    timers.push(setTimeout(() => setBarDone(true), 3200));

    // Fire exit
    timers.push(setTimeout(() => onComplete(), 3800));

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] bg-[#080808] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Animated scan lines ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.06 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px)",
          transformOrigin: "left",
        }}
      />

      {/* ── Left sweep line ── */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-accent to-transparent opacity-30"
        style={{ transformOrigin: "top" }}
      />
      {/* ── Right sweep line ── */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="absolute right-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-accent to-transparent opacity-30"
        style={{ transformOrigin: "top" }}
      />

      {/* ── Horizontal top bar ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="absolute top-[12%] left-[10%] right-[10%] h-px bg-white/10"
        style={{ transformOrigin: "left" }}
      />
      {/* ── Horizontal bottom bar ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        className="absolute bottom-[12%] left-[10%] right-[10%] h-px bg-white/10"
        style={{ transformOrigin: "right" }}
      />

      {/* ── Corner accent dots ── */}
      {[
        "top-[12%] left-[10%]",
        "top-[12%] right-[10%]",
        "bottom-[12%] left-[10%]",
        "bottom-[12%] right-[10%]",
      ].map((pos, i) => (
        <motion.div
          key={pos}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
          className={`absolute ${pos} w-1.5 h-1.5 bg-brand-accent rounded-full`}
        />
      ))}

      {/* ── Central ambient glow ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(225,29,72,0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── ERA letters (from left) ── */}
      <div className="relative z-10 flex items-baseline gap-0 select-none">
        <div className="flex items-baseline">
          {LETTERS_ERA.map((letter, i) => (
            <motion.span
              key={`era-${i}`}
              initial={{ opacity: 0, x: -60, skewX: -15 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              transition={{
                delay: 0.2 + i * 0.1,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-display text-[clamp(4rem,14vw,10rem)] leading-none tracking-tighter text-white"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* ── FLEX letters (from right) ── */}
        <div className="flex items-baseline">
          {LETTERS_FLEX.map((letter, i) => (
            <motion.span
              key={`flex-${i}`}
              initial={{ opacity: 0, x: 60, skewX: 15 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              transition={{
                delay: 0.35 + i * 0.08,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-display text-[clamp(4rem,14vw,10rem)] leading-none tracking-tighter text-brand-accent"
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>

      {/* ── Tagline ── */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
        className="relative z-10 font-indian text-[10px] tracking-[0.6em] uppercase text-gray-500 mt-3"
      >
        Elite Performance · Premium Gear
      </motion.p>

      {/* ── Animated accent line under logo ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-6 w-16 h-0.5 bg-brand-accent"
        style={{ transformOrigin: "center" }}
      />

      {/* ── Progress + text ── */}
      <div className="relative z-10 mt-8 flex flex-col items-center gap-3 w-56">
        <div className="w-full h-px bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.2, ease: "easeInOut" }}
            className="absolute top-0 left-0 h-full bg-brand-accent"
            style={{
              boxShadow: "0 0 12px rgba(225,29,72,0.8)",
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.span
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="font-indian text-[10px] tracking-[0.4em] uppercase text-brand-accent/70"
          >
            {LOADING_STEPS[step]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Pulsing corner indicators ── */}
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[14%] right-[12%] w-2 h-2 rounded-full bg-brand-accent"
      />
      <motion.div
        animate={{ opacity: [1, 0.3, 1], scale: [1.3, 1, 1.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[14%] left-[12%] w-2 h-2 rounded-full bg-white/30"
      />
    </motion.div>
  );
};
