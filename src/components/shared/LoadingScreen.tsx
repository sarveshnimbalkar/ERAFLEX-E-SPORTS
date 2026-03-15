"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingText, setLoadingText] = useState("INITIALIZING ENGINE...");
  const [localIsDone, setLocalIsDone] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create an intricate 3D structure
    const group = new THREE.Group();
    scene.add(group);

    // Central core (TorusKnot)
    const coreGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0033,
      wireframe: true,
      emissive: 0xff0033,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.8
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // Outer rings
    const ringGeometry1 = new THREE.RingGeometry(3, 3.2, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
    const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ringGeometry2 = new THREE.RingGeometry(4, 4.1, 64);
    const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial);
    ring2.rotation.y = Math.PI / 2;
    group.add(ring2);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xff0033, 3);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 6;

    // Fast spin state
    let ending = false;

    // Animation phases
    let frame = 0;
    const animate = () => {
      frame++;
      const id = requestAnimationFrame(animate);
      
      core.rotation.x += 0.005;
      core.rotation.y += 0.01;
      
      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.003;
      
      particlesMesh.rotation.y = -0.0005 * frame;
      
      // Fast spin when ending
      if (ending) {
          group.scale.multiplyScalar(0.95);
          group.rotation.y += 0.1;
          camera.position.z += 0.1;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    const texts = ["CALIBRATING 3D ASSETS...", "OPTIMIZING GRAPHICS...", "SIMULATING PHYSICS...", "ERAFLEX SYSTEM READY."];
    let i = 0;
    const interval = setInterval(() => {
      if (i < texts.length) {
        setLoadingText(texts[i]);
        i++;
      }
      if (i === texts.length) {
        clearInterval(interval);
        setLocalIsDone(true);
        ending = true;
        setTimeout(() => {
          onComplete();
        }, 1000); // Delay for out-animation
      }
    }, 800); // Faster transitions

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
      // Removed clear since it can error on unmount
    };
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center transform-gpu"
    >
      <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center pointer-events-none mt-[20vh]">
        <motion.div 
          animate={{ opacity: [0.7, 1, 0.7], textShadow: ["0 0 10px #ff0033", "0 0 30px #ff0033", "0 0 10px #ff0033"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-display text-7xl md:text-9xl italic mb-6 tracking-tighter"
        >
          ERA<span className="text-brand-accent">FLEX</span>
        </motion.div>
        
        <div className="flex flex-col items-center gap-4 w-64">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.2, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-full bg-brand-accent shadow-[0_0_10px_#ff0033]"
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.span 
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="font-indian text-xs tracking-[0.4em] uppercase text-brand-accent/80 whitespace-nowrap"
            >
              {loadingText}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
