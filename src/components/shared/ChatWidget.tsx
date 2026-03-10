"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat, type UIMessage } from "@ai-sdk/react";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    messages: [
      {
        id: "1",
        role: "assistant",
        parts: [{ type: "text", text: "👋 Welcome to ERAFLEX AI! I'm your elite gear specialist. Searching for a specific team, player, or league?" }],
      } as UIMessage,
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ role: "user", parts: [{ type: "text", text: input }], id: Date.now().toString() } as UIMessage);
    setInput("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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
              {messages.map((msg: any) => (
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
                    {msg.content || (msg.parts && msg.parts.find((p: any) => p.type === 'text')?.text) || ''}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
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
            <form onSubmit={handleSend} className="p-6 bg-black/40 border-t border-white/5">
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="Ask ERAFLEX AI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-brand-dark border border-white/10 p-4 pr-12 rounded-xl outline-none focus:border-brand-accent transition-all duration-300 font-indian text-xs tracking-widest uppercase placeholder:normal-case"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-brand-accent transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-accent rounded-full shadow-2xl shadow-brand-accent/20 border border-white/10 flex items-center justify-center group hover-trigger relative z-[101]"
      >
        <MessageSquare className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
      </motion.button>
    </div>
  );
};
