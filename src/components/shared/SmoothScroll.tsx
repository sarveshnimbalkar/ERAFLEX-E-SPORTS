"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from '@studio-freight/react-lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    setEnabled(!prefersReducedMotion && !coarsePointer);
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.06, duration: 1.2, smoothWheel: true }}>
      {children as any}
    </ReactLenis>
  );
}
