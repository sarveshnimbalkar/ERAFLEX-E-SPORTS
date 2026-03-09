"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "👋 Welcome to ERAFLEX AI! I'm your elite gear specialist. Searching for a specific team, player, or league?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const botMessage: Message = await response.json();
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Sorry, I encountered an error. Please try again!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-brand-surface border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden glass"
          >
            {/* Header */}
            <div className="bg-brand-accent p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl italic text-white uppercase tracking-tighter">ERAFLEX AI</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-success rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/70 font-indian tracking-widest uppercase">Online Assistant</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                    msg.role === "user" ? "bg-white/10" : "bg-brand-accent/20"
                  )}>
                    {msg.role === "user" ? <User className="w-4 h-4 text-gray-400" /> : <Bot className="w-4 h-4 text-brand-accent" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user" ? "bg-brand-accent text-white rounded-tr-none" : "bg-white/5 border border-white/5 rounded-tl-none font-indian"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-accent" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-black/40 border-t border-white/5">
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="Ask ERAFLEX AI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-brand-dark border border-white/10 p-4 pr-12 rounded-xl outline-none focus:border-brand-accent transition-all duration-300 font-indian text-xs tracking-widest uppercase"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-brand-accent transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-accent rounded-full shadow-[0_0_30px_rgba(255,0,51,0.5)] flex items-center justify-center group hover-trigger relative z-[101]"
      >
        <MessageSquare className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
      </motion.button>
    </div>
  );
};
