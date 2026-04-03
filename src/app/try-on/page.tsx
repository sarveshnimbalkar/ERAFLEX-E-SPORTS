"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { PoseTryOnExperience } from "@/components/try-on/PoseTryOnExperience";

const AVAILABLE_KITS = [
  { id: 'fb-1', name: 'Real Madrid Home Kit', image: '/kits/fb-1.jpg', fallbackColor: 'bg-white/80 mix-blend-overlay' },
  { id: 'fb-6', name: 'PSG Home Kit', image: '/kits/fb-6.png', fallbackColor: 'bg-black/80 mix-blend-multiply' }
];

export default function TryOnPage() {
  const [selectedKit, setSelectedKit] = useState(AVAILABLE_KITS[0]);

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
              <h3 className="font-display text-xl uppercase tracking-widest">Select Kit</h3>
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
              <li>Keep shoulders and torso visible</li>
            </ul>
          </div>
        </div>

        <PoseTryOnExperience selectedKit={selectedKit} />
      </div>

      <Footer />
    </main>
  );
}
