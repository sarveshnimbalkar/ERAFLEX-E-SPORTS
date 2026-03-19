"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, Mail, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Welcome to the Elite list!");
      setEmail("");
      setSubscribing(false);
    }, 1500);
  };

  return (
    <footer className="bg-brand-dark border-t border-white/5 py-16 md:py-24 px-4 md:px-6 lg:px-12 mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-accent flex items-center justify-center font-display text-2xl italic font-black shadow-[0_0_20px_rgba(255,0,85,0.3)]">
                E
              </div>
              <span className="font-display text-4xl tracking-wider">
                ERA<span className="text-brand-accent">FLEX</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-8 font-indian tracking-wide text-sm leading-relaxed">
              Elite performance gear for the professional athlete. Engineered for
              speed, designed for style, and built for glory by ERAFLEX GLOBAL.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Facebook, label: "Facebook" },
                { icon: Youtube, label: "Youtube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-500 group"
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-y border-white/5">
          <div className="col-span-1">
            <h4 className="font-display text-xl italic mb-8">JOIN THE ELITE</h4>
            <p className="text-[10px] text-gray-500 font-indian tracking-[0.2em] uppercase mb-6">
              Subscribe for early access and limited drops
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL@ERAFLEX.COM"
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-brand-accent transition-all font-indian tracking-widest text-xs pr-16"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="absolute right-2 top-2 bottom-2 bg-brand-accent px-4 rounded-xl hover:bg-white hover:text-black transition-all group disabled:opacity-50"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <div>
             <h4 className="font-display text-xl italic mb-8">EXPLORE</h4>
             <ul className="grid grid-cols-1 gap-4 text-gray-400 font-indian tracking-widest text-sm">
               <li><Link href="/shop" className="hover:text-brand-accent transition-colors flex items-center gap-2">COLLECTIONS</Link></li>
               <li><Link href="/trending" className="hover:text-brand-accent transition-colors flex items-center gap-2">TRENDING NOW</Link></li>
               <li><Link href="/customize" className="hover:text-brand-accent transition-colors flex items-center gap-2">CUSTOM BUILDER</Link></li>
               <li><Link href="/dashboard" className="hover:text-brand-accent transition-colors flex items-center gap-2">MY ACCOUNT</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="font-display text-xl italic mb-8">SUPPORT</h4>
             <div className="space-y-6">
                <ul className="grid grid-cols-1 gap-4 text-gray-400 font-indian tracking-widest text-sm">
                  <li><a href="#" className="hover:text-brand-accent transition-colors">SHIPPING & RETURNS</a></li>
                  <li><a href="#" className="hover:text-brand-accent transition-colors">SIZE GUIDE</a></li>
                  <li><a href="#" className="hover:text-brand-accent transition-colors">CONTACT US</a></li>
                </ul>
                <div className="flex items-center gap-3 text-brand-gold bg-brand-gold/5 border border-brand-gold/20 p-4 rounded-2xl">
                   <ShieldCheck className="w-5 h-5" />
                   <span className="text-[10px] tracking-widest uppercase font-black">AUTHORIZED RETAILER</span>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-500 text-[10px] tracking-[0.3em] font-indian uppercase">
            © 2026 ERAFLEX GLOBAL ATHLETICS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex gap-4">
               <a href="#" className="text-gray-500 hover:text-white text-[10px] tracking-[0.2em] font-indian uppercase transition-all">PRIVACY</a>
               <a href="#" className="text-gray-500 hover:text-white text-[10px] tracking-[0.2em] font-indian uppercase transition-all">TERMS</a>
            </div>
            <div className="flex items-center gap-2 text-gray-500 px-4 py-2 bg-white/5 rounded-full border border-white/10">
               <Globe className="w-3 h-3" />
               <span className="text-[8px] tracking-widest uppercase font-bold">IN / EN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
