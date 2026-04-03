// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  // @ts-ignore - Ignoring type mismatches in older ai-sdk/react versions
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // Reference for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[320px] bg-brand-surface border border-white/10 rounded-2xl shadow-2xl glass-strong overflow-hidden flex flex-col h-[450px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-accent to-red-600 p-4 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white/90" />
                <h3 className="font-display tracking-widest text-lg italic uppercase text-white">Elite Stylist AI</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4 bg-black/40 no-scrollbar">
              {messages.length === 0 && (
                 <div className="bg-white/10 p-3 rounded-xl rounded-tl-none self-start max-w-[85%] border border-white/5">
                   <p className="text-sm font-indian tracking-wide text-gray-200">
                     Welcome to ERAFLEX! I am your AI gear specialist. How can I assist you with sizes, fit, or finding the perfect kit?
                   </p>
                 </div>
              )}
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={cn(
                    "p-3 rounded-xl border border-white/5 max-w-[85%] text-sm font-indian tracking-wide text-gray-200 leading-relaxed shadow-sm",
                    m.role === "user" 
                      ? "self-end bg-brand-accent/20 border-brand-accent/30 rounded-tr-none text-white" 
                      : "self-start bg-white/10 rounded-tl-none"
                  )}
                >
                  {m.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input field */}
            <div className="p-3 border-t border-white/10 bg-black/60 shrink-0">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about team kits, sizes..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none focus:border-brand-accent focus:bg-white/10 transition-colors font-indian tracking-wide placeholder:text-gray-500"
                />
                <button type="submit" disabled={!input.trim()} className="absolute right-2 p-1.5 text-gray-400 hover:text-white disabled:opacity-50 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(225,29,72,0.4)] transition-all duration-300 group",
          isOpen ? "bg-white text-black" : "bg-brand-accent text-white"
        )}
      >
        <div className="absolute inset-0 rounded-full animate-ping-ring bg-brand-accent/40 pointer-events-none" />
        
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </motion.button>
    </div>
  );
};
