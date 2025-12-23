"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useChatMutation } from "@/redux/features/ai/aiApi";
import { useAppSelector } from "@/redux/store";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AIChat() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hi! I'm your EventHub Assistant. Looking for something specific or need a recommendation?",
    },
  ]);

  const [sendChat, { isLoading }] = useChatMutation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const eventId = params?.id as string;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");

    const newMessages = [
      ...messages,
      { role: "user" as const, content: userMsg },
    ];
    setMessages(newMessages);

    try {
      const history = newMessages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const response = await sendChat({
        messages: history,
        currentEventId: eventId,
      }).unwrap();

      setMessages((prev) => [...prev, { role: "ai", content: response.text }]);
    } catch (error: any) {
      console.error("AI Chat Full Error:", error);

      const errorMsg =
        error?.data?.error ||
        error?.data?.message ||
        "I'm having trouble connecting right now.";

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Sorry! ${errorMsg}`,
        },
      ]);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-2xl hover:scale-110 transition-transform duration-300 shadow-indigo-500/40 cursor-pointer"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[400px] h-[min(580px,calc(100vh-120px))] bg-white rounded-3xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Sparkles size={20} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">
                    EventHub AI
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-indigo-100 font-medium uppercase tracking-wider">
                      Online
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-2.5 max-w-[85%] ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                        msg.role === "user"
                          ? "bg-indigo-600"
                          : "bg-white border border-indigo-100 text-purple-600"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User size={14} className="text-white" />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white text-slate-700 rounded-tl-none border border-indigo-50"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2.5 max-w-[85%] items-center">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-purple-600 shadow-sm">
                      <Bot size={16} />
                    </div>
                    <div className="p-3 bg-white border border-indigo-50 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <Loader2
                        size={14}
                        className="animate-spin text-indigo-600"
                      />
                      <span className="text-[11px] text-slate-400 font-medium">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-indigo-50">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask about events or features..."
                    className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-3 text-[9px] text-center text-slate-400 font-medium uppercase tracking-widest">
                EventHub Intelligence Console
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
