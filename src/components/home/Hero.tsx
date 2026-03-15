"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create intricate 3D environment
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 4000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 60;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Digital grid ground
    const gridHelper = new THREE.GridHelper(100, 100, 0xff0033, 0xffffff);
    gridHelper.position.y = -3;
    const gridMaterial = gridHelper.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.15;
    scene.add(gridHelper);

    // Floating geometry objects
    const group = new THREE.Group();
    scene.add(group);

    const geo1 = new THREE.IcosahedronGeometry(1.5, 0);
    const mat1 = new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, transparent: true, opacity: 0.2 });
    const mesh1 = new THREE.Mesh(geo1, mat1);
    mesh1.position.set(4, 0, -2);
    group.add(mesh1);

    const geo2 = new THREE.OctahedronGeometry(2, 0);
    const mat2 = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.15 });
    const mesh2 = new THREE.Mesh(geo2, mat2);
    mesh2.position.set(-5, 2, -4);
    group.add(mesh2);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - windowHalfX) * 0.0005;
        mouseY = (event.clientY - windowHalfY) * 0.0005;
    };

    document.addEventListener('mousemove', onDocumentMouseMove);

    let frame = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        frame++;

        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;
        
        mesh1.rotation.x += 0.002;
        mesh1.rotation.y -= 0.003;

        mesh2.rotation.x -= 0.001;
        mesh2.rotation.y += 0.002;

        // Parallax depth effect
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener('mousemove', onDocumentMouseMove);
        if (containerRef.current) containerRef.current.innerHTML = '';
        renderer.dispose();
    };
  }, []);

  return (
    <section className="relative h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Interactive 3D Background Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-auto mix-blend-screen opacity-80" />

      {/* Background Image with Premium Tint */}
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2670&auto=format&fit=crop"
          alt="Football players playing match"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale contrast-150"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark via-brand-dark/80 to-brand-purple/10" />
      </div>

      {/* Hero Content - Brutalist Left Alignment */}
      <div className="relative z-10 px-6 md:px-16 w-full max-w-7xl mx-auto flex flex-col items-start mt-12 pointer-events-none">

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
          className="font-indian text-lg md:text-xl tracking-[0.5em] mb-12 text-white/90 uppercase max-w-2xl border-l-[3px] border-brand-accent pl-6 py-2 bg-gradient-to-r from-brand-accent/20 to-transparent backdrop-blur-sm"
        >
          Hyper-engineered performance gear for the elite generation. 
          Defy physics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-6 justify-start w-full pointer-events-auto"
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
      <div className="absolute bottom-8 left-0 right-0 overflow-hidden border-y border-white/5 bg-black/40 backdrop-blur-md py-3 flex z-10 pointer-events-none">
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
      
      <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:flex flex-col gap-8 opacity-40 z-10 pointer-events-none">
        {["01", "02", "03", "04"].map((step) => (
          <div key={step} className="font-indian tracking-widest text-xs border border-white/20 p-2 text-center rounded-sm">
            {step}
          </div>
        ))}
      </div>
    </section>
  );
};
