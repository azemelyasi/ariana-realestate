import React, { useState, useRef, useEffect } from "react";
import { Language } from "../types";
import { TRANSLATIONS, getTranslation } from "../i18n";
import { 
  Sparkles, 
  Send, 
  Bot
} from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  time?: string;
}

interface AIConsultantProps {
  lang: Language;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: getTranslation(lang, "aiGreeting", "سلام! من دستیار هوشمند و کارشناس ارشد کاداستر آریانا رهنما هستم. چگونه می‌توانم در ارزیابی قیمت املاک، نرخ روز تسعیر ارز کاداستر یا راهنمای سندگذاری بین‌المللی به شما کمک کنم؟"),
      time: new Date().toLocaleTimeString(isRtl ? "fa-IR" : "en-US", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Shared server infrastructure handles queries securely. No client-side credentials are exposed.
  const presets = [
    getTranslation(lang, "aiPreset1", "قیمت متوسط املاک مسکو چقدر است؟"),
    getTranslation(lang, "aiPreset2", "ارزش‌گذاری هوشمند کاداستر چگونه انجام می‌شود؟"),
    getTranslation(lang, "aiPreset3", "امنیت کاداستر آریانا رهنما چگونه تامین می‌شود؟")
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim() || loading) return;

    const currentTime = new Date().toLocaleTimeString(isRtl ? "fa-IR" : "en-US", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { sender: "user", text: msgText, time: currentTime }]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: msgText, lang, userApiKey: "" }),
      });

      const responseTime = new Date().toLocaleTimeString(isRtl ? "fa-IR" : "en-US", { hour: "2-digit", minute: "2-digit" });
      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply, time: responseTime }]);
      } else {
        throw new Error("API issue");
      }
    } catch {
      // Elegant, rich offline assistant response when system is offline
      setTimeout(() => {
        const responseTime = new Date().toLocaleTimeString(isRtl ? "fa-IR" : "en-US", { hour: "2-digit", minute: "2-digit" });
        let fallbackReply = "";
        const lower = msgText.toLowerCase();

        if (lower.includes("moscow") || lower.includes("مسکو") || lower.includes("روسیه")) {
          fallbackReply = getTranslation(lang, "aiReplyMoscow", "بر اساس جدیدترین پایش‌های کاداستر آریانا رهنما، آپارتمان‌های لوکس در مسکو سیتی بین ۱۰,۰۰۰ تا ۱۵,۰۰۰ دلار به ازای هر متر مربع ارزش‌گذاری می‌شوند.");
        } else if (lower.includes("security") || lower.includes("امنیت") || lower.includes("تامین")) {
          fallbackReply = getTranslation(lang, "aiReplySecurity", "آریانا رهنما از سیستم انزوای کامل فایل‌ها، کوکی‌های امن سشن، احراز هویت دومرحله‌ای و کدهای ویژه ضدربات به عنوان سپرهای قدرتمند استفاده می‌کند.");
        } else if (lower.includes("ارزش‌گذاری") || lower.includes("کاداستر") || lower.includes("چگونه")) {
          fallbackReply = getTranslation(lang, "aiReplyCadastre", "ارزش‌گذاری کاداستر بر مبنای هوش مصنوعی و نرخ تسعیر لحظه‌ای بازار آزاد ارزها صورت می‌گیرد تا سود دهی بالایی برای خریداران ایجاد کند.");
        } else {
          fallbackReply = getTranslation(lang, "aiReplyGeneral", "خدمات آریانا رهنما شامل کشورهای ایران، ترکیه، روسیه، امارات، آلمان، افغانستان و پاکستان می‌باشد. می‌توانید از بخش محاسبات هوشمند جهت ارزیابی دقیق قیمت ملک بهره‌مند شوید.");
        }

        setMessages((prev) => [...prev, { sender: "ai", text: fallbackReply, time: responseTime }]);
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`relative p-5 bg-gradient-to-br from-slate-900 via-indigo-950/25 to-slate-950 border border-indigo-500/30 rounded-3xl flex flex-col h-[490px] justify-between transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:border-indigo-500/50 ${isRtl ? "rtl text-right" : "ltr text-left"}`}
      id="ai-consultant-sidebar"
    >
      {/* Absolute Decorative Glow element inside */}
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Decorative Golden Label / Visual Magnet */}
      <div className="absolute -top-3 left-4 right-4 flex justify-between items-center pointer-events-none px-2">
        <span className="bg-gradient-to-r from-amber-500 via-indigo-500 to-amber-500 text-[8px] font-black uppercase text-slate-950 px-3 py-1 rounded-full shadow-lg shadow-black/80 font-mono tracking-widest animate-pulse border border-amber-400/20">
          ✨ {lang === "fa" ? "پردازشگر زنده جمینی فعال است" : "GEMINI ACTIVE INFRASTRUCTURE"}
        </span>
      </div>

      {/* Header Container */}
      <div className="border-b border-indigo-500/20 pb-3 mt-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Animated Smart Avatar Ring */}
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur opacity-40 animate-pulse"></div>
              <div className="relative p-2.5 bg-slate-950/80 border border-indigo-500/40 text-indigo-400 rounded-2xl flex items-center justify-center">
                <Bot className="w-5 h-5 animate-bounce-slow" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-ping"></span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                  {t.aiConsultantTitle}
                </h3>
                <span className="text-[7px] bg-indigo-500/20 text-indigo-300 font-bold px-1 rounded">
                  v3.7
                </span>
              </div>
              <p className="text-[10px] text-indigo-300/80 font-medium mt-0.5">
                {lang === "fa" ? "مشاور اختصاصی املاک و ارز یاب کاداستر" : t.aiConsultantSub}
              </p>
            </div>
          </div>

          {/* Secure Status Indicator instead of settings */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-[9px] font-mono font-bold text-emerald-400 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>
                {lang === "fa" ? "سرویس فعال" : "ACTIVE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
          <div 
            className="flex-1 overflow-y-auto my-3 space-y-3 px-1 py-1 text-xs border-b border-indigo-500/10 scrollbar-thin scrollbar-thumb-indigo-500/10 scrollbar-track-transparent" 
            id="chat-messages-container"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div className={`max-w-[88%] flex flex-col gap-1 ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 leading-relaxed text-[11px] shadow-md ${
                      m.sender === "user"
                        ? "bg-gradient-to-l from-indigo-600 to-indigo-700 text-white rounded-tr-none font-semibold shadow-indigo-600/10"
                        : "bg-slate-950/90 text-slate-300 rounded-tl-none border border-slate-850 shadow-black/40"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.time && (
                    <span className="text-[8px] text-slate-500 px-1 font-mono">{m.time}</span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-950/95 border border-indigo-500/10 rounded-2xl rounded-tl-none px-4 py-2 flex items-center gap-1.5 shadow-md shadow-black/20">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Inputs & Interaction Hub */}
          <div className="space-y-3 pt-1 animate-fade-in">
            {/* Animated Quick-Access Suggestions Label */}
            <div className="flex items-center gap-1.5 text-[10px] text-indigo-300/90 font-bold px-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>{lang === "fa" ? "پیشنهاد گفتگو کاداستر:" : "Instant Quick Queries:"}</span>
            </div>

            {/* Dynamic Horizontal query capsules */}
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none" id="faq-preset-suggestions">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  className="text-[9.5px] font-semibold bg-slate-950/90 hover:bg-slate-900 hover:text-white text-indigo-300 border border-slate-850 hover:border-indigo-500/40 whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                >
                  🚀 {p}
                </button>
              ))}
            </div>

            {/* Input submission box with rich gradients */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="flex gap-2 bg-slate-950 border border-indigo-500/15 focus-within:border-indigo-500/50 p-1.5 rounded-2xl transition-all duration-300"
            >
              <input
                type="text"
                className="flex-1 bg-transparent px-3 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:ring-0 font-medium"
                placeholder={t.aiConsultantPlaceholder}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-[11px] font-extrabold shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <span>{isRtl ? "ارسال" : "Send"}</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
    </div>
  );
};
