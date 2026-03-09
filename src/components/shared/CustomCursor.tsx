"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const mouseX = useSpring(0, { stiffness: 1000, damping: 50 });
  const mouseY = useSpring(0, { stiffness: 1000, damping: 50 });
  const ringX = useSpring(0, { stiffness: 200, damping: 30 });
  const ringY = useSpring(0, { stiffness: 200, damping: 30 });
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    const moveCursor = (e: MouseEvent) => {
      // Direct update for better response
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isSelectable = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.closest(".hover-trigger") ||
        window.getComputedStyle(target).cursor === "pointer";
      
      setIsHovering(!!isSelectable);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY, ringX, ringY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Lag-free Dot */}
      <motion.div
        className="fixed top-0 left-0 bg-brand-accent rounded-full z-20"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 4 : 8,
          height: isHovering ? 4 : 8,
          scale: isActive ? 0.8 : 1,
        }}
      />
      {/* Smooth Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 border border-brand-accent/40 rounded-full z-10"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 60 : 32,
          height: isHovering ? 60 : 32,
          scale: isActive ? 0.9 : 1,
          backgroundColor: isHovering ? "rgba(255, 0, 51, 0.05)" : "transparent",
        }}
      />
    </div>
  );
};
