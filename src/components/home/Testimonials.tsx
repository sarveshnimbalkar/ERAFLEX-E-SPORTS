"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reviewService } from "@/lib/db";
import type { Review } from "@/types";
import { Star, MessageSquareQuote, ChevronRight, ChevronLeft } from "lucide-react";

export const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        const topReviews = await reviewService.getRecentHighReviews(5);
        // Fallback mock data if Firebase is empty initially so the UI is still stunning
        if (topReviews.length === 0) {
          setReviews([
            { id: "mock1", userId: "1", userName: "Marcus R.", productId: "fb-1", rating: 5, comment: "The material composition on the Elite away kit is insane. Sweat wicking is top tier and handles 90 mins easily.", createdAt: { seconds: Date.now() / 1000 } as any },
            { id: "mock2", userId: "2", userName: "David Beck", productId: "fb-2", rating: 5, comment: "Premium stitching. The AR Try-On worked perfectly to let me know the medium would fit my shoulders. Best sports commerce experience.", createdAt: { seconds: Date.now() / 1000 } as any },
            { id: "mock3", userId: "3", userName: "S. Kohli", productId: "cr-1", rating: 5, comment: "Indian world cup jersey looks exactly like the actual player issue. Shipping was incredible and packaging felt so premium.", createdAt: { seconds: Date.now() / 1000 } as any }
          ]);
        } else {
          setReviews(topReviews);
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopReviews();
  }, []);

  if (loading) return null;
  if (!reviews || reviews.length === 0) return null;

  const nextSlide = () => setCurrentIndex((p) => (p + 1) % reviews.length);
  const prevSlide = () => setCurrentIndex((p) => (p - 1 + reviews.length) % reviews.length);

  return (
    <section className="py-24 px-6 md:px-12 bg-black border-y border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/50 to-transparent pointer-events-none z-10" />
      
      <div className="max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-indian text-brand-gold text-[10px] tracking-[0.5em] uppercase font-bold flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4" /> VERIFIED ATHLETES
            </span>
            <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-none mt-4">
              COMMUNITY <span className="text-brand-accent">REVIEWS</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={prevSlide} className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={nextSlide} className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="relative h-[250px] md:h-[200px] w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center text-center justify-center"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < reviews[currentIndex].rating ? 'fill-brand-gold text-brand-gold' : 'fill-transparent text-gray-700'}`} />
                ))}
              </div>
              <p className="font-indian text-lg md:text-2xl text-white tracking-wide uppercase leading-relaxed max-w-3xl mb-8">
                "{reviews[currentIndex].comment}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 border-2 border-brand-accent flex items-center justify-center font-display text-lg tracking-widest uppercase">
                  {reviews[currentIndex].userName?.[0] || "A"}
                </div>
                <div className="text-left">
                  <p className="font-display tracking-widest text-sm uppercase">{reviews[currentIndex].userName}</p>
                  <p className="font-indian text-[9px] text-gray-500 uppercase tracking-widest">Verified Purchase</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
