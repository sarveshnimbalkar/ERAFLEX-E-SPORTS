// @ts-nocheck
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

const QUICK_REPLIES = [
  { label: "⚽ Football Jerseys", text: "Show me football jerseys" },
  { label: "🏏 Cricket Kits", text: "Show me cricket kits" },
  { label: "🏀 Basketball", text: "Show me basketball jerseys" },
  { label: "🪞 AR Try-On", text: "How does AR Try-On work?" },
  { label: "✏️ Customize", text: "How do I customize a jersey?" },
  { label: "🚚 Shipping", text: "What are the shipping charges?" },
];

function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[85%]">
      <div className="w-7 h-7 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center flex-shrink-0 mt-1">
        <Bot className="w-3.5 h-3.5 text-brand-accent" />
      </div>
      <div className="bg-white/8 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 bg-brand-accent rounded-full block"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, isLatest }: { message: any; isLatest: boolean }) {
  const isUser = message.role === "user";
  const text =
    message.content ||
    (message.parts && message.parts[0]?.text) ||
    "";
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex gap-2.5 w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border",
          isUser
            ? "bg-brand-accent/30 border-brand-accent/40"
            : "bg-white/8 border-white/15"
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-brand-accent" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn("flex flex-col gap-1 max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-brand-accent text-white rounded-tr-none font-sans"
              : "bg-white/8 border border-white/10 text-gray-200 rounded-tl-none font-indian tracking-wide"
          )}
        >
          {text}
        </div>
        <span className="text-[10px] text-gray-600 px-1">{time}</span>
      </div>
    </motion.div>
  );
}

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, append } =
    useChat({
      api: "/api/chat",
    });

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Track unread when closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === "assistant") {
        setHasUnread(true);
      }
    }
  }, [messages, isOpen]);

  // Clear unread + hide quick replies when opened
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleQuickReply = useCallback(
    (text: string) => {
      setShowQuickReplies(false);
      append({ role: "user", content: text });
    },
    [append]
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      setShowQuickReplies(false);
      handleSubmit(e);
    },
    [input, handleSubmit]
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.93 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="w-[340px] sm:w-[380px] bg-[#0e0e0f] border border-white/10 rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col"
            style={{ height: "520px" }}
          >
            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-brand-accent via-red-600 to-rose-700 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display tracking-widest text-base uppercase text-white leading-none">
                    ERAFLEX AI
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/70 font-indian tracking-widest uppercase">
                      Elite Gear Specialist
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors p-1"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
              {/* Welcome message (always shown) */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-white/8 border border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-brand-accent" />
                </div>
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <div className="bg-white/8 border border-white/10 px-3.5 py-2.5 rounded-2xl rounded-tl-none text-sm text-gray-200 font-indian tracking-wide leading-relaxed">
                    👋 Welcome to <strong className="text-white">ERAFLEX</strong>! I&apos;m your AI gear specialist — ask me about jerseys, sizes, customization, or orders.
                  </div>
                </div>
              </motion.div>

              {/* Quick replies */}
              <AnimatePresence>
                {showQuickReplies && messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 pl-9"
                  >
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr.text}
                        onClick={() => handleQuickReply(qr.text)}
                        className="px-3 py-1.5 text-[11px] bg-white/5 border border-white/15 rounded-full text-gray-300 hover:bg-brand-accent/20 hover:border-brand-accent/40 hover:text-white transition-all duration-200 font-indian tracking-wide flex items-center gap-1.5 group"
                      >
                        {qr.label}
                        <ChevronRight className="w-2.5 h-2.5 text-gray-500 group-hover:text-brand-accent transition-colors" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat messages */}
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isLatest={i === messages.length - 1}
                />
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <div className="p-3 border-t border-white/8 bg-black/50 shrink-0">
              <form onSubmit={onSubmit} className="relative flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about kits, sizes, orders…"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl pl-4 pr-4 py-3 text-sm text-white outline-none focus:border-brand-accent/60 focus:bg-white/8 transition-all duration-200 font-indian tracking-wide placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0",
                    input.trim() && !isLoading
                      ? "bg-brand-accent text-white hover:bg-red-600 shadow-lg shadow-brand-accent/30"
                      : "bg-white/5 text-gray-600 cursor-not-allowed"
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle Button ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(225,29,72,0.5)] transition-all duration-300 group",
          isOpen ? "bg-white text-black" : "bg-brand-accent text-white"
        )}
      >
        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-brand-accent/40 animate-ping" />
        )}

        {/* Unread badge */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0e0e0f] flex items-center justify-center"
            >
              <span className="text-[8px] font-bold text-white">1</span>
            </motion.span>
          )}
        </AnimatePresence>

        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
        )}
      </motion.button>
    </div>
  );
};
