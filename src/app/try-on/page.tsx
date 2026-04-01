"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Camera, RefreshCw, Download, Zap, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const AVAILABLE_KITS = [
  { id: 'home', name: 'Home Kit (White)', image: '/images/real_madrid.png', fallbackColor: 'bg-white/80 mix-blend-overlay' },
  { id: 'away', name: 'Away Kit (Dark)', image: '/images/barcelona.png', fallbackColor: 'bg-black/80 mix-blend-multiply' }
];

export default function TryOnPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedKit, setSelectedKit] = useState(AVAILABLE_KITS[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setHasPermission(false);
      toast.error("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current || !overlayRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    
    // Set canvas to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 1. Draw camera feed
    // Mirror horizontally to match the view
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Reset transform for overlay
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // 2. Draw Jersey Overlay 
    // Calculate aspect ratio preserving overlay dimensions
    const overlayAspect = overlay.naturalWidth / overlay.naturalHeight;
    
    // We want the jersey to roughly cover the lower 70% of the screen center
    const targetWidth = canvas.width * 0.6;
    const targetHeight = targetWidth / overlayAspect;
    
    const x = (canvas.width - targetWidth) / 2;
    const y = canvas.height * 0.3; // Give headroom
    
    // Draw the image onto the canvas composite
    // Note: If the image fails cross-origin, this will throw a taint error. 
    // In production, ensure the image is served from the same domain or has CORS headers.
    try {
      ctx.drawImage(overlay, x, y, targetWidth, targetHeight);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      toast.success("Snapshot captured!");
      stopCamera();
    } catch (e) {
      toast.error("Could not capture composite image due to image security policies.");
    }
  };

  const retryCamera = () => {
    setCapturedImage(null);
    startCamera();
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    const a = document.createElement('a');
    a.href = capturedImage;
    a.download = `EraFlex-TryOn-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <main className="min-h-screen bg-brand-dark flex flex-col pt-28 pb-20">
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto overflow-hidden">
        
        {/* Left Side: Instructions & Kit Select */}
        <div className="w-full lg:w-[400px] xl:w-[500px] p-6 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 shrink-0 z-10 bg-brand-dark">
          <div>
            <div className="mb-8">
              <span className="font-indian text-brand-gold text-[10px] tracking-[0.5em] uppercase font-bold">AI FITTING ENGINE V2</span>
              <h1 className="font-display text-5xl italic uppercase tracking-tighter mt-2">
                VIRTUAL <span className="text-brand-accent">TRY-ON</span>
              </h1>
              <p className="font-indian text-gray-500 tracking-widest text-xs uppercase mt-4">
                Align yourself within the frame. The system will composite the selected kit over your live feed.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl uppercase tracking-widest">Select Concept Concept</h3>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_KITS.map((kit) => (
                  <button
                    key={kit.id}
                    onClick={() => setSelectedKit(kit)}
                    className={`p-4 border rounded-md font-indian text-xs font-bold tracking-widest uppercase transition-all ${
                      selectedKit.id === kit.id 
                        ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                        : 'border-white/20 text-gray-400 hover:border-white/50'
                    }`}
                  >
                    {kit.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 bg-black/40 p-6 rounded-md border border-white/5 space-y-4">
            <h4 className="font-indian text-sm font-bold tracking-widest uppercase flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-gold" /> Best Results
            </h4>
            <ul className="text-xs text-gray-400 font-indian tracking-wider uppercase space-y-2 list-disc pl-4">
              <li>Ensure good lighting</li>
              <li>Stand approx 3 feet back</li>
              <li>Align shoulders with the overlay</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Camera Viewfinder */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden min-h-[60vh] lg:min-h-0">
          
          {/* Permission State */}
          {hasPermission === false && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20 bg-brand-dark/95 backdrop-blur-md">
              <Camera className="w-16 h-16 text-white/20 mb-4" />
              <h2 className="font-display text-3xl uppercase mb-2">Camera Access Denied</h2>
              <p className="font-indian text-xs text-gray-400 tracking-widest uppercase max-w-sm mb-6">
                We need access to your camera to enable the virtual try-on experience. Please update your browser permissions.
              </p>
              <button 
                onClick={startCamera}
                className="bg-white text-black px-8 py-3 font-bold text-sm tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-all rounded-md"
              >
                REQUEST ACCESS
              </button>
            </div>
          )}

          {/* Initial State */}
          {hasPermission === null && !capturedImage && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <button 
                  onClick={startCamera}
                  className="bg-brand-accent text-white w-32 h-32 rounded-full flex flex-col items-center justify-center hover:scale-105 hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_50px_rgba(255,0,85,0.3)] group"
                >
                  <Camera className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-black text-[10px] tracking-widest uppercase">START LENS</span>
                </button>
             </div>
          )}

          {/* Live Camera Feed */}
          <div className={`relative w-full max-w-3xl aspect-[3/4] md:aspect-video rounded-3xl overflow-hidden shadow-2xl transition-opacity duration-1000 ${isCameraActive && !capturedImage ? 'opacity-100' : 'opacity-0 hidden'}`}>
            
            {/* The actual underlying video track */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover -scale-x-100" // Mirror effect
            />

            {/* Augmented Reality Overlay */}
            <div className="absolute inset-x-0 bottom-0 top-[20%] pointer-events-none flex justify-center opacity-80 mix-blend-hard-light">
              <img 
                ref={overlayRef}
                src={selectedKit.image} 
                className="w-[70%] h-auto object-contain object-top drop-shadow-2xl"
                crossOrigin="anonymous" // Needed for canvas export
                alt="AR Overlay" 
                onError={(e) => {
                   // If missing image, fallback to CSS shape
                   e.currentTarget.style.display = 'none';
                   const parent = e.currentTarget.parentElement;
                   if (parent && !parent.querySelector('.ar-fallback')) {
                      const fallback = document.createElement('div');
                      fallback.className = `ar-fallback w-[60%] h-full rounded-t-[100px] ${selectedKit.fallbackColor}`;
                      parent.appendChild(fallback);
                   }
                }}
              />
            </div>

            {/* UI Overlay on Video */}
            <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                  <span className="font-indian text-[10px] font-bold tracking-widest uppercase">LIVE ENGINE // V2</span>
                </div>
              </div>
              
              <div className="flex justify-center pb-4 pointer-events-auto">
                <button 
                  onClick={takeSnapshot}
                  className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-white/50 group-hover:bg-white transition-colors flex items-center justify-center">
                    <Zap className="w-6 h-6 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Hidden Canvas for Processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Result View */}
          {capturedImage && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative w-full max-w-3xl aspect-[3/4] md:aspect-video rounded-3xl overflow-hidden shadow-2xl bg-brand-surface border border-white/10"
            >
              <img src={capturedImage} alt="AR Snapshot" className="w-full h-full object-contain bg-black" />
              
              <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4">
                <button 
                  onClick={retryCamera}
                  className="bg-black/50 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> RETAKE
                </button>
                <button 
                  onClick={downloadImage}
                  className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_5px_20px_rgba(255,0,85,0.4)]"
                >
                  <Download className="w-4 h-4" /> SAVE IMAGE
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </main>
  );
}
