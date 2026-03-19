"use client";

import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { Check, Type, Hash, Palette, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

const FONTS = [
  { name: "Athletic Block", class: "font-display" },
  { name: "Modern Sans", class: "font-indian tracking-widest uppercase" },
];

const COLORS = [
  { name: "Stark White", value: "#FFFFFF", hex: "bg-white" },
  { name: "Obsidian", value: "#111111", hex: "bg-[#111111] border border-white/20" },
  { name: "Gold", value: "#FFD700", hex: "bg-brand-gold" },
];

export default function CustomizePage() {
  const [jerseyName, setJerseyName] = useState("RONALDO");
  const [jerseyNumber, setJerseyNumber] = useState("7");
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [jerseyType, setJerseyType] = useState("home");
  
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: `custom-${Date.now()}`,
      name: `Custom Elite Jersey`,
      team: "Custom Edition",
      price: 6999,
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600",
      category: "football",
      sport: "football",
      description: `Customized with Name: ${jerseyName}, Number: ${jerseyNumber}`,
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
                  Base Image. In a fully robust system we'd use a transparent PNG of a jersey 
                  back with proper studio lighting and wrinkles mapped. Here we simulate 
                  it against a solid background for the prototype.
                */}
                <div 
                  className="absolute inset-x-0 bottom-0 top-[20%] mx-auto w-[70%] bg-white rounded-t-[100px] shadow-2xl transition-colors duration-500"
                  style={{ backgroundColor: jerseyType === 'home' ? '#f8f8f8' : '#1a1a1a' }}
                >
                  {/* Subtle lighting/wrinkle overlay simulation */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent mix-blend-overlay rounded-t-[100px]" />
                </div>

                {/* Dynamic Text Overlay Platform */}
                <div className="relative z-10 flex flex-col items-center mt-[-10%] w-full">
                  <span 
                    className={`text-3xl md:text-5xl lg:text-6xl transition-all duration-300 drop-shadow-sm ${selectedFont.class}`}
                    style={{ 
                      color: selectedColor.value,
                      // Subtle perspective transform to map it to imaginary shoulders
                      transform: 'perspective(500px) rotateX(5deg)',
                      WebkitTextStroke: selectedColor.value === '#111111' && jerseyType === 'away' ? '1px rgba(255,255,255,0.2)' : 'none'
                    }}
                  >
                    {jerseyName || "NAME"}
                  </span>
                  
                  <span 
                    className={`text-[150px] md:text-[220px] lg:text-[280px] leading-none transition-all duration-300 mt-2 ${selectedFont.class}`}
                    style={{ 
                      color: selectedColor.value,
                      transform: 'scaleY(1.1) perspective(500px) rotateX(2deg)',
                      WebkitTextStroke: selectedColor.value === '#111111' && jerseyType === 'away' ? '1px rgba(255,255,255,0.2)' : 'none'
                    }}
                  >
                    {jerseyNumber || "00"}
                  </span>
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
                  <label className="block text-[10px] font-indian tracking-widest text-gray-400 uppercase">Base Kit</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setJerseyType('home')}
                      className={`p-4 border font-display tracking-widest uppercase transition-all ${jerseyType === 'home' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-400'}`}
                    >
                      Home (White)
                    </button>
                    <button 
                      onClick={() => setJerseyType('away')}
                      className={`p-4 border font-display tracking-widest uppercase transition-all ${jerseyType === 'away' ? 'bg-[#1a1a1a] text-white border-brand-accent' : 'border-white/20 text-gray-400'}`}
                    >
                      Away (Dark)
                    </button>
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
                  <p className="font-indian text-xs text-gray-500 uppercase tracking-widest">Total Build Configuration</p>
                  <p className="font-display text-4xl text-brand-gold">₹6,999</p>
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
