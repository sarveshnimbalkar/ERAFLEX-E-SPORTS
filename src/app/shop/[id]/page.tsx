"use client";

import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { useCartStore } from "@/store/useCartStore";
import { Star, Truck, ShieldCheck, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReviewSection } from "@/components/shop/ReviewSection";
import type { Product } from "@/types";

// Temporarily replicating the mock store until backend integration
const products: Product[] = [
  { id: "fb-1", name: "Real Madrid Home Kit 24/25", team: "Real Madrid CF", price: 4999, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600", category: "football", sport: "football", description: "Royal white performance kit engineered for the elite. Features advanced moisture-wicking fabric and laser-cut ventilation zones.", stock: 100, rating: 5 },
  { id: "fb-2", name: "Manchester City Home Kit 24/25", team: "Manchester City", price: 4499, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600", category: "football", sport: "football", description: "City blue dominance. Ultra-lightweight construction for maximum agility on the pitch.", stock: 8, rating: 4 },
  { id: "cr-1", name: "India World Cup Jersey", team: "Team India", price: 2999, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600", category: "cricket", sport: "cricket", description: "Official India world cup edition. Breathable mesh panels and ergonomic fit.", stock: 200, rating: 5 },
  { id: "bk-1", name: "Lakers Icon Edition", team: "LA Lakers", price: 5999, image: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=600", category: "basketball", sport: "basketball", description: "Iconic purple and gold. Premium stitched lettering and classic hardwood fit.", stock: 40, rating: 5 },
  { id: "fb-3", name: "FC Barcelona Home Kit 24/25", team: "FC Barcelona", price: 4799, image: "https://images.unsplash.com/photo-1431324155629-1a6eda1eedfa?w=600", category: "football", sport: "football", description: "Blaugrana pride in a modern silhouette. Sustainable recycled polyester build.", stock: 70, rating: 4 },
  { id: "fb-4", name: "Arsenal FC Home Kit 24/25", team: "Arsenal FC", price: 4299, image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600", category: "football", sport: "football", description: "Gunners elite threads. Classic canon crest with modern performance tech.", stock: 90, rating: 5 },
  { id: "fb-5", name: "PSG Home Kit 24/25", team: "Paris Saint-Germain", price: 5299, image: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=600", category: "football", sport: "football", description: "Parisian elegance meets pitch performance. Sleek central stripe design.", stock: 60, rating: 4 },
  { id: "fb-6", name: "AC Milan Home Kit 24/25", team: "AC Milan", price: 3999, image: "https://images.unsplash.com/photo-1541534741688-6078c64b5913?w=600", category: "football", sport: "football", description: "Rossoneri tradition. Bold stripes with high-stretch fabric for unrestricted movement.", stock: 50, rating: 5 },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const product = products.find((p) => p.id === id);
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-4 flex flex-col items-center justify-center bg-brand-dark">
        <Header />
        <h1 className="font-display text-4xl uppercase mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-brand-accent hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <main className="min-h-screen bg-brand-dark pt-28 pb-20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 hidden md:flex items-center gap-2 text-xs font-indian tracking-widest uppercase text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        {/* Product Core Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          
          {/* Left: Product Image Gallery */}
          <div className="space-y-4">
            <div className="bg-[#e5e5e5] rounded-md overflow-hidden aspect-[4/5] relative group">
              {product.stock && product.stock <= 20 && (
                <div className="absolute top-6 left-6 z-10 bg-brand-accent text-white px-4 py-2 font-indian text-xs font-black tracking-widest uppercase shadow-lg">
                  Selling Fast
                </div>
              )}
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            {/* Thumbnail preview (placeholder for multiple angles) */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-[#e5e5e5] rounded-md overflow-hidden cursor-pointer border-2 hover:border-brand-accent border-transparent transition-all">
                  <img src={product.image} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" alt="thumbnail" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details & Metrics */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-indian text-brand-gold text-xs tracking-[0.3em] font-black uppercase">
                  {product.team}
                </span>
                {product.stock && product.stock <= 20 && (
                  <span className="bg-brand-accent/10 text-brand-accent px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold">
                    Only {product.stock} Left
                  </span>
                )}
              </div>
              <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tighter leading-none">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < (product.rating || 5) ? 'fill-brand-gold text-brand-gold' : 'fill-transparent text-gray-600'}`} />
                  ))}
                </div>
                <span className="text-sm font-indian text-gray-400 tracking-widest uppercase cursor-pointer hover:text-white transition-colors">
                  128 Reviews
                </span>
              </div>
              
              <p className="font-display text-4xl text-white">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            <p className="font-indian text-gray-400 text-sm md:text-base leading-relaxed tracking-wide uppercase">
              {product.description}
            </p>

            {/* Sizing UI */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="font-indian text-xs font-bold tracking-widest uppercase">Select Size</span>
                <button className="font-indian text-xs text-brand-accent tracking-widest uppercase hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 border rounded-md font-display text-xl transition-all duration-300 flex items-center justify-center
                      ${selectedSize === size 
                        ? 'bg-white text-black border-white' 
                        : 'bg-transparent text-white border-white/20 hover:border-white'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6 space-y-4">
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full py-5 font-black text-xl md:text-2xl tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 rounded-md
                  ${isAdding ? 'bg-white text-black' : 'bg-brand-accent text-white hover:bg-black border border-transparent hover:border-white'}`}
              >
                {isAdding ? "ADDED TO BAG" : "ADD TO BAG"}
                {!isAdding && <ShoppingBag className="w-5 h-5" />}
              </button>

              <Link 
                href={`/customize?productId=${product.id}`}
                className="w-full py-4 font-black text-lg tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 rounded-md bg-transparent border-2 border-white/20 text-white hover:border-brand-accent hover:bg-brand-accent/10"
              >
                CUSTOMIZE THIS KIT (+₹299)
              </Link>
            </div>

            {/* Shipping Psychologies */}
            <div className="grid grid-cols-2 gap-4 pt-8 text-xs font-indian tracking-widest text-gray-400 uppercase">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-white" />
                <span>Free Insured <br/> Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span>Secure <br/> SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Review Section */}
        <div className="border-t border-white/10 pt-20">
          <ReviewSection productId={id} />
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
