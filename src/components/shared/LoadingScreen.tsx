"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingText, setLoadingText] = useState("INITIALIZING ENGINE...");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Ball geometry
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0033,
      wireframe: true,
      emissive: 0xff0033,
      emissiveIntensity: 0.5,
    });
    const ball = new THREE.Mesh(geometry, material);
    scene.add(ball);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xff0033, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 3;

    // Animation phases
    let frame = 0;
    const animate = () => {
      frame++;
      requestAnimationFrame(animate);
      ball.rotation.x += 0.01;
      ball.rotation.y += 0.01;
      
      // Pulsing effect
      const scale = 1 + Math.sin(frame * 0.05) * 0.1;
      ball.scale.set(scale, scale, scale);
      
      renderer.render(scene, camera);
    };
    animate();

    // Text transitions
    const texts = ["CALIBRATING ASSETS...", "OPTIMIZING GRAPHICS...", "ERAFLEX READY."];
    let i = 0;
    const interval = setInterval(() => {
      if (i < texts.length) {
        setLoadingText(texts[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 1000);
        }, 500);
      }
    }, 1200);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center pointer-events-none"
    >
      <div ref={containerRef} className="absolute inset-0" />
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-display text-6xl md:text-8xl italic mb-4"
        >
          ERA<span className="text-brand-accent">FLEX</span>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isDone ? "100%" : "80%" }}
              transition={{ duration: 4, ease: "easeOut" }}
              className="h-full bg-brand-accent"
            />
          </div>
          <span className="font-indian text-xs tracking-[0.5em] uppercase text-brand-accent">
            {loadingText}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
