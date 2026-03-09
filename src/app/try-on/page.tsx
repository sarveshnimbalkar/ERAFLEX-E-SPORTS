"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Camera, X, RefreshCw, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ARTryOnPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [error, setError] = useState("");

  const startCamera = async () => {
    setIsActive(true);
    setIsCalibrating(true);
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Simulation of AI Body Tracking (TensorFlow.js / MediaPipe)
      setTimeout(() => {
        setIsCalibrating(false);
      }, 3000);
      
    } catch (err) {
      setError("Camera access denied. Please enable permissions for the AR experience.");
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-brand-dark flex flex-col items-center">
      <Header />
      
      <div className="max-w-7xl mx-auto w-full space-y-12">
        <header className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 border border-brand-accent/30 rounded-full mb-4">
              <Zap className="w-4 h-4 text-brand-accent" />
              <span className="text-brand-accent font-indian text-[10px] tracking-[0.3em] uppercase font-bold">EXPERIMENTAL AI LABS</span>
           </div>
           <h1 className="font-display text-5xl md:text-8xl italic uppercase tracking-tighter">
              VIRTUAL <span className="text-brand-accent">TRY-ON</span>
           </h1>
           <p className="font-indian text-gray-500 tracking-[0.4em] uppercase text-xs">
              AI-Driven Augmented Reality Performance Fitting
           </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Viewport */}
            <div className="lg:col-span-8 bg-brand-surface rounded-3xl border border-white/5 glass aspect-video relative overflow-hidden group">
                {!isActive ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-black/60">
                         <div className="w-24 h-24 bg-brand-accent/10 rounded-full flex items-center justify-center mb-8 border border-brand-accent/20">
                            <Camera className="w-10 h-10 text-brand-accent" />
                         </div>
                         <h3 className="font-display text-3xl italic uppercase mb-4">Initialize AI Fitting</h3>
                         <p className="font-indian text-gray-500 tracking-widest text-xs max-w-sm mb-8">
                            Your camera will be used locally to calibrate the 3D performance gear to your physique. No data is stored.
                         </p>
                         <button 
                            onClick={startCamera}
                            className="bg-brand-accent px-10 py-5 font-black text-xl hover:bg-white hover:text-black transition-all shadow-2xl flex items-center gap-3"
                         >
                            START AR SESSION
                         </button>
                    </div>
                ) : (
                    <>
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover grayscale opacity-50 contrast-150"
                        />
                        <canvas 
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                        />

                        {isCalibrating && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="w-32 h-32 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin mb-8" />
                                <div className="space-y-4">
                                    <h3 className="font-display text-4xl italic uppercase tracking-tighter">AI PHYSIQUE CALIBRATION</h3>
                                    <p className="font-indian text-gray-500 tracking-[0.3em] uppercase text-[10px] max-w-xs mx-auto">
                                        Initializing PRO-LENS 2.0. Detecting skeletal landmarks and muscle definition for precision fitting.
                                    </p>
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                                        <span className="text-[10px] font-indian tracking-widest text-brand-gold uppercase font-black">SIMULATION MODE ACTIVE</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* AR Controls Overlay */}
                        {!isCalibrating && (
                            <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                                <div className="bg-black/60 p-4 rounded-xl glass border border-white/10 flex items-center gap-3">
                                    <div className="w-3 h-3 bg-brand-success rounded-full animate-pulse" />
                                    <span className="font-indian text-[10px] tracking-widest uppercase">AI Tracking Active: PRO-LENS 2.0</span>
                                </div>
                                <button 
                                    onClick={stopCamera}
                                    className="w-12 h-12 rounded-full glass bg-black/40 flex items-center justify-center hover:bg-brand-accent transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/90 text-center">
                        <p className="text-brand-accent font-indian text-sm tracking-widest uppercase">{error}</p>
                    </div>
                )}
            </div>

            {/* Selection Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                 <div className="bg-brand-surface p-8 rounded-3xl border border-white/5 glass space-y-8">
                    <h3 className="font-display text-3xl italic uppercase">FITTING ROOM</h3>
                    
                    <div className="space-y-4">
                        <p className="text-[10px] font-indian tracking-widest text-gray-500 uppercase">Select Gear to Try</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((id) => (
                                <button key={id} className="aspect-[3/4] bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-accent transition-all group p-4">
                                    <div className="flex flex-col items-center justify-center h-full gap-2">
                                        <div className="w-full h-full bg-brand-dark rounded-lg animate-pulse" />
                                        <span className="text-[8px] font-indian tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">Kit Mock #{id}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex items-center gap-4 text-gray-500">
                        <ShieldCheck className="w-5 h-5 text-brand-success" />
                        <span className="text-[9px] font-indian tracking-widest uppercase leading-relaxed">Local Edge Processing Enabled</span>
                    </div>
                 </div>

                 <button className="w-full border-2 border-brand-accent text-brand-accent py-6 font-black text-2xl hover:bg-brand-accent hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(255,0,51,0.1)] flex items-center justify-center gap-3 uppercase italic">
                    <RefreshCw className="w-6 h-6" /> RECALIBRATE
                 </button>
            </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
