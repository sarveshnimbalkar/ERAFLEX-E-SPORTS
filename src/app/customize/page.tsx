"use client";

import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { Check, Type, Hash, Palette, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { PRODUCTS } from "@/lib/data/products";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

const FONTS = [
  { name: "Athletic Block", class: "font-display" },
  { name: "Modern Sans", class: "font-indian tracking-widest uppercase" },
];

const COLORS = [
  { name: "Stark White", value: "#FFFFFF", hex: "bg-white" },
  { name: "Obsidian", value: "#111111", hex: "bg-[#111111] border border-white/20" },
  { name: "Gold", value: "#FFD700", hex: "bg-brand-gold" },
];

function CustomizerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('productId');
  const initialProduct = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const [jerseyName, setJerseyName] = useState("RONALDO");
  const [jerseyNumber, setJerseyNumber] = useState("7");
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [currentProduct, setCurrentProduct] = useState(initialProduct);

  // Update current product if URL changes
  useEffect(() => {
    if (productId) {
      const p = PRODUCTS.find(p => p.id === productId);
      if (p) setCurrentProduct(p);
    }
  }, [productId]);
  
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: `custom-${currentProduct.id}-${Date.now()}`,
      name: `Custom ${currentProduct.name}`,
      team: currentProduct.team,
      price: currentProduct.price + 299, // Customization fee
      image: currentProduct.image,
      category: currentProduct.category,
      sport: currentProduct.sport,
      description: `Customized with Name: ${jerseyName}, Number: ${jerseyNumber}, Color: ${selectedColor.name}`,
      stock: 99,
      rating: 5,
    });
    toast.success("Custom Jersey added to Bag!");
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-brand-dark pt-28 pb-20">
        <Header />

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <header className="mb-12">
            <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tighter">
              ELITE <span className="text-brand-accent">STUDIO</span>
            </h1>
            <p className="font-indian text-gray-500 tracking-[0.3em] uppercase text-xs">
              Design your legacy. Precision 2D Customizer.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Premium 2D Preview Area */}
            <div className="lg:col-span-7 sticky top-28">
              <div className="relative aspect-[4/5] md:aspect-square bg-[#e5e5e5] rounded-md overflow-hidden flex flex-col items-center justify-center p-10 group shadow-2xl">
                
                {/* 
                  REAL PRODUCT BASE
                  Using the actual product image with a color tint overlay that preserves shadows
                */}
                <div className="absolute inset-x-0 bottom-0 top-[10%] mx-auto w-[85%] transition-all duration-500 flex items-center justify-center">
                  <img 
                    src={currentProduct.image} 
                    alt={currentProduct.name}
                    className="w-full h-full object-contain relative z-10"
                  />
                  {/* Subtle color tint overlay based on selected color - uses mix-blend-color on top of image */}
                  <div 
                    className="absolute inset-0 z-20 pointer-events-none mix-blend-color opacity-30 transition-colors duration-500"
                    style={{ backgroundColor: selectedColor.value }}
                  />
                  <div 
                    className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply opacity-20 transition-colors duration-500"
                    style={{ backgroundColor: selectedColor.value }}
                  />
                </div>

                {/* Dynamic Text Overlay Platform */}
                <div className="relative z-30 flex flex-col items-center mt-[-15%] w-full">
                  <AnimatePresence mode="popLayout">
                    <motion.span 
                      key={jerseyName + selectedFont.name}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`text-3xl md:text-5xl lg:text-6xl drop-shadow-sm ${selectedFont.class}`}
                      style={{ 
                        color: selectedColor.value,
                        transform: 'perspective(500px) rotateX(5deg)',
                        WebkitTextStroke: selectedColor.value === '#111111' ? '1px rgba(255,255,255,0.4)' : '1px rgba(0,0,0,0.2)'
                      }}
                    >
                      {jerseyName || "NAME"}
                    </motion.span>
                  </AnimatePresence>
                  
                  <AnimatePresence mode="popLayout">
                    <motion.span 
                      key={jerseyNumber + selectedFont.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`text-[150px] md:text-[220px] lg:text-[280px] leading-none mt-2 ${selectedFont.class}`}
                      style={{ 
                        color: selectedColor.value,
                        transform: 'scaleY(1.1) perspective(500px) rotateX(2deg)',
                        WebkitTextStroke: selectedColor.value === '#111111' ? '1px rgba(255,255,255,0.4)' : '1px rgba(0,0,0,0.2)'
                      }}
                    >
                      {jerseyNumber || "00"}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right: Configuration Panel */}
            <div className="lg:col-span-5 bg-brand-surface p-8 rounded-md border border-white/5 space-y-10">
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Type className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-display text-2xl uppercase tracking-widest">Player Details</h3>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-indian tracking-widest text-gray-400 uppercase">Input Name</label>
                  <input 
                    id="jerseyNameInput"
                    name="jerseyNameInput"
                    type="text" 
                    maxLength={12}
                    value={jerseyName}
                    onChange={(e) => setJerseyName(e.target.value.toUpperCase())}
                    className="w-full bg-black/40 border border-white/20 p-4 font-display text-2xl uppercase tracking-widest rounded-sm focus:border-brand-accent transition-colors outline-none"
                    placeholder="ENTER NAME"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-indian tracking-widest text-gray-400 uppercase">Input Number</label>
                  <input 
                    id="jerseyNumberInput"
                    name="jerseyNumberInput"
                    type="text" 
                    maxLength={2}
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-black/40 border border-white/20 p-4 font-display text-2xl uppercase tracking-widest rounded-sm focus:border-brand-accent transition-colors outline-none"
                    placeholder="00"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Palette className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-display text-2xl uppercase tracking-widest">Style Configuration</h3>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-indian tracking-widest text-gray-400 uppercase">Change Jersey Base</label>
                  <div className="relative">
                    <select
                      id="jerseyBaseSelect"
                      name="jerseyBaseSelect"
                      value={currentProduct.id}
                      onChange={(e) => {
                        const newProduct = PRODUCTS.find(p => p.id === e.target.value);
                        if (newProduct) {
                          setCurrentProduct(newProduct);
                          router.push(`/customize?productId=${newProduct.id}`, { scroll: false });
                        }
                      }}
                      className="w-full bg-black/40 border border-white/20 p-4 font-display text-lg uppercase tracking-widest rounded-sm focus:border-brand-accent transition-colors outline-none appearance-none cursor-pointer text-white"
                    >
                      {PRODUCTS.map(p => (
                        <option key={p.id} value={p.id} className="bg-brand-dark">{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-indian tracking-widest text-gray-400 uppercase">Print Color</label>
                  <div className="flex gap-4">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${color.hex} ${selectedColor.name === color.name ? 'scale-110 ring-2 ring-brand-accent ring-offset-2 ring-offset-brand-surface' : 'opacity-70 flex-hover:opacity-100'}`}
                        title={color.name}
                      >
                        {selectedColor.name === color.name && <Check className={`w-5 h-5 ${color.value === '#FFFFFF' || color.value === '#FFD700' ? 'text-black' : 'text-white'}`} />}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-8 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <p className="font-indian text-xs text-gray-500 uppercase tracking-widest">Base Price + Custom Fee</p>
                  <p className="font-display text-4xl text-brand-gold">₹{(currentProduct.price + 299).toLocaleString()}</p>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-brand-accent py-5 font-black text-2xl tracking-widest hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-4 group rounded-md uppercase"
                >
                  <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  ADD CUSTOM TO BAG
                </button>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}

export default function CustomizePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-accent">Loading...</div>}>
      <CustomizerContent />
    </Suspense>
  );
}
