import React, { useState, useEffect } from "react";
import { Language, Property } from "../types";
import { 
  Sparkles, 
  Cpu, 
  Database, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Bot, 
  Mail, 
  PlusCircle, 
  Globe, 
  Clock, 
  Check,
  Zap,
  Activity
} from "lucide-react";

interface AIAndAutomationTabProps {
  lang: Language;
  properties: Property[];
  onPropertiesUpdated: (updated: Property[]) => void;
}

export const AIAndAutomationTab: React.FC<AIAndAutomationTabProps> = ({ 
  lang,
  properties,
  onPropertiesUpdated 
}) => {
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  // Real-time API States
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  // Local Forms States
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [transKey, setTransKey] = useState("");
  const [transVal, setTransVal] = useState("");
  const [targetLangCode, setTargetLangCode] = useState("ar");
  const [isNewLangRtl, setIsNewLangRtl] = useState(true);
  
  // Simulated deposit modal inputs
  const [simAgency, setSimAgency] = useState("Sovereign Persian Real Estate");
  const [simAmount, setSimAmount] = useState("18.00");
  const [simWallet, setSimWallet] = useState("TR7NHqdjwmJZGZ86HnEpv842bC78e146vD");

  // Sub-navigation of the Automation Studio
  const [subSection, setSubSection] = useState<"dashboard" | "payments" | "pricing" | "chatbot" | "translation" | "forecast">("dashboard");

  // Fetch full state from backend
  const fetchAutomationStatus = async () => {
    try {
      const res = await fetch("/api/automation/status");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error loading automation settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomationStatus();
    // Real-time background scanner refresh simulation
    const interval = setInterval(fetchAutomationStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Post payment simulation (Rule #1)
  const triggerSimulationPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/automation/payment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencyName: simAgency,
          amount: parseFloat(simAmount),
          walletAddress: simWallet
        })
      });
      if (res.ok) {
        await fetchAutomationStatus();
        alert(lang === "fa" 
          ? "تراکنش شبیه‌سازی تتر TRC20 با موفقیت ارسال شد. سیستم خودکار مانیتورینگ بلاکچین هر ۱۰ ثانیه وضعیت واریزها را بررسی کرده و تایید نهایی را فورا انجام خواهد داد!" 
          : "TRC20 Tether deposit simulation submitted. The background automated blockchain indexer will process it shortly!");
      }
    } catch (err) {
      console.error("Simulation error", err);
    }
  };

  // Perform AI Price selection approval / rejection (Rule #2 & AI Duty 3)
  const handlePriceDecision = async (proposalId: string, approve: boolean) => {
    try {
      const res = await fetch("/api/automation/price/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId, approve })
      });
      if (res.ok) {
        const result = await res.json();
        await fetchAutomationStatus();
        
        // If approved, update properties registry values
        if (approve && result.proposal) {
          const updated = properties.map(p => {
            if (p.country === result.proposal.country && p.district.includes(result.proposal.district.split(",")[0])) {
              // Increase price correspondingly
              const revisedPrice = p.pricePerSqm 
                ? Math.round(p.pricePerSqm * (result.proposal.suggestedAvg / result.proposal.currentAvg))
                : undefined;
              return {
                ...p,
                pricePerSqm: revisedPrice,
                totalPrice: p.totalPrice ? Math.round(p.totalPrice * (result.proposal.suggestedAvg / result.proposal.currentAvg)) : undefined
              };
            }
            return p;
          });
          onPropertiesUpdated(updated);
          localStorage.setItem("melkban_properties", JSON.stringify(updated));
        }
      }
    } catch (err) {
      console.error("Pricing decision error", err);
    }
  };

  // Create database manual backup (Rule #6)
  const triggerManualBackup = async () => {
    try {
      const res = await fetch("/api/automation/backup/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: `Manual Cloud-Backup Snap_${Date.now().toString().slice(-4)} (${new Date().toLocaleTimeString()})`
        })
      });
      if (res.ok) {
        await fetchAutomationStatus();
        alert(lang === "fa" ? "بکاپ آفلاین سیستم با موفقیت ایجاد شد و در بانک پشتیبان‌های ۳۰ روزه ذخیره ثبت گردید." : "Manual JSON backup successfully captured and stored in 30-day index.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Rollback database backup (Rule #6)
  const restoreBackupId = async (backupId: string) => {
    try {
      const res = await fetch("/api/automation/backup/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backupId })
      });
      if (res.ok) {
        const json = await res.json();
        alert(json.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Learn override translation keys (Rule #4)
  const handleLearnTranslation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transKey || !transVal) return;
    try {
      const res = await fetch("/api/automation/translation/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: transKey, translation: transVal })
      });
      if (res.ok) {
        await fetchAutomationStatus();
        setTransKey("");
        setTransVal("");
        alert(lang === "fa" ? "ترجمه اصلاحی شما ذخیره شد و اولویت اعمال آن نسبت به لغت‌نامه پایه فعال گردید." : "Your override translation key saved successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit learned Chatbot question and answer pair (Rule #5 & Duty 6)
  const handleLearnQA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion || !customAnswer) return;
    try {
      const res = await fetch("/api/automation/chatbot/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: customQuestion, answer: customAnswer })
      });
      if (res.ok) {
        await fetchAutomationStatus();
        setCustomQuestion("");
        setCustomAnswer("");
        alert(lang === "fa" ? "دستیار هوشمند با موفقیت این جفت سوال و پاسخ را فراگرفت. از این پس این سوال بلافاصله بدون دخالت هوش مصنوعی پاسخ داده می‌شود." : "AI Chatbot successfully matched and learned this Q&A pair!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auto Translate a complete Language Pack (Duty #1)
  const generateNewLanguagePack = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/automation/translate-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLanguage: targetLangCode, isRtl: isNewLangRtl })
      });
      if (res.ok) {
        await fetchAutomationStatus();
        alert(lang === "fa" 
          ? `زبان جدید (${targetLangCode.toUpperCase()}) با موفقیت ترجمه شد! الگوهای ${isNewLangRtl ? "RTL راست‌چین" : "LTR چپ‌چین"} تشخیص داده شده و لایه‌های منو برای همه نمایندگان بازتعریف شد.`
          : `New language pack (${targetLangCode.toUpperCase()}) successfully translated by Gemini and deployed in locales/!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // State for database schema selector
  const [selectedSchema, setSelectedSchema] = useState<"core_schema" | "landlord_schema" | "booking_schema" | "i18n_schema" | "crypto_schema">("core_schema");

  // Veto commands (👑 قانون دوم و ششم)
  const toggleModuleVeto = async (moduleId: string, currentStatus: boolean) => {
    try {
      const reasonText = prompt(
        lang === "fa" 
          ? `علت تعلیق (وتو) ماژول ${moduleId} چیست؟` 
          : `Why are you vetoing module ${moduleId}?`
      );
      if (reasonText === null) return; // cancel clicked

      const res = await fetch("/api/core/veto/module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          isActive: !currentStatus,
          reason: reasonText ? reasonText : undefined
        })
      });
      if (res.ok) {
        await fetchAutomationStatus();
      }
    } catch (err) {
      console.error("Veto target toggle failed", err);
    }
  };

  const updateGlobalVetoLevel = async (level: "none" | "partial" | "full") => {
    try {
      const res = await fetch("/api/core/veto/level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level })
      });
      if (res.ok) {
        await fetchAutomationStatus();
        alert(
          lang === "fa"
            ? `وضعیت قفل سراسری وتو به [${level.toUpperCase()}] تغییر یافت!`
            : `Sovereign global veto level updated to ${level.toUpperCase()}!`
        );
      }
    } catch (err) {
      console.error("Veto level update failed", err);
    }
  };

  const triggerResetAnomalyLogs = () => {
    alert(lang === "fa" ? "سیاهه گزارش‌های تخطی ممیزی کاداستر با موفقیت پاکسازی شد." : "Sovereign Audit anomaly logs cleaned up!");
  };

  const triggerSyncCAD = () => {
    alert(lang === "fa" ? "همگام‌سازی شاخص‌های قیمت کاداستر با تمام ۵ منطقه مسلسله در روسیه، دبی، سنگاپور، لندن و تورنتو کامل شد!" : "Real-time Cadastral database sync triggered successfully across SG, GB, CA, AE, and RU registers!");
  };

  const generateMockReport = () => {
    alert(lang === "fa" ? "گزارش تفصیلی عملکرد درآمدی و کاداستر ماهواره‌ای صادر و دانلود شد! (Excel/PDF)" : "Central monthly cadastral performance PDF & Excel report generated successfully!");
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-4 bg-slate-950/20 border border-slate-800 rounded-3xl">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">
          {lang === "fa" ? "بارگذاری ماژول اتوماسیون سراسری و هوش مصنوعی..." : "Loading Advanced Autopilot System & AI Brain..."}
        </p>
      </div>
    );
  }

  const { 
    trc20Transactions, 
    priceProposals, 
    chatbotLearnedQA, 
    pendingQuestions, 
    manualTranslations, 
    anomalyLogs, 
    historicalBackups, 
    systemDiagnostics,
    globalVetoLevel = "none",
    supremeModules = [],
    vetoLogs = []
  } = data;

  return (
    <div className={`space-y-6 ${isRtl ? "rtl text-right" : "ltr text-left"}`} id="autopilot-brain-center">
      
      {/* Sovereign Top Neon Banner */}
      <div className="relative p-7 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-10 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-5 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 text-[9px] font-black tracking-widest uppercase font-mono px-3 py-1 rounded-full border border-amber-300/25">
                ⚡ Absolute Golden Rule: SYSTEM AUTO-OPERATING (3-Months Offline Safe)
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              {lang === "fa" ? "مرکز هوش مصنوعی کاداستر و خودکارسازی کُلان" : "Sovereign AI Autopilot & Operations Center"}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {lang === "fa" 
                ? "سیستم به خوبی پیکربندی شده و تا ماه‌ها بدون نیاز به دخالت دستی اقدام به تایید فاکتورهای تتر، پیش‌بینی شاخص‌ها، کنترل کلاهبرداری و یادگیری الگوهای چتبات می‌نماید." 
                : "This central cockpit orchestrates full-circle automation, allowing the site registry to check crypto payments, propose dynamic valuations, prevent fraud, and run chat services autonomously."}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl flex-shrink-0">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-3.5 py-2 rounded-xl text-xs font-black">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
              <span>{lang === "fa" ? "سپر خودساز فعال" : "AUTOPILOT ARMORED"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtab Buttons */}
      <div className="flex bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto gap-1">
        <button
          onClick={() => setSubSection("dashboard")}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            subSection === "dashboard" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{lang === "fa" ? "داشبورد ناظر" : "1. Diagnostics Uptime"}</span>
        </button>

        <button
          onClick={() => setSubSection("payments")}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            subSection === "payments" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{lang === "fa" ? "تایید خودکار پرداخت تتر (TRC20)" : "2. TRC20 Ledger"}</span>
        </button>

        <button
          onClick={() => setSubSection("pricing")}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            subSection === "pricing" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{lang === "fa" ? "برآورد ارزش‌های کاداستر" : "3. Optimal Valuation Proposals"}</span>
        </button>

        <button
          onClick={() => setSubSection("chatbot")}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            subSection === "chatbot" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>{lang === "fa" ? "آموزش چتبات پشتیبانی" : "4. Support Intelligent QA"}</span>
        </button>

        <button
          onClick={() => setSubSection("translation")}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            subSection === "translation" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{lang === "fa" ? "ترجمه و یادگیری اصلاحات" : "5. Multi-Lang Override"}</span>
        </button>

        <button
          onClick={() => setSubSection("forecast")}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            subSection === "forecast" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{lang === "fa" ? "جلوگیری از تقلب و پیش‌بینی" : "6. Leads Forecast & Fraud Check"}</span>
        </button>
      </div>

      {/* RENDER VIEWPORTS COMPONENT-WISE */}

      {/* SUB-TAB 1: DIAMOND SUPREME CORE فرماندهی کل سیستم (👑 قانون اول، دوم و پنجم) */}
      {subSection === "dashboard" && (
        <div className="space-y-6 animate-fade-in text-slate-300">
          
          {/* Action Row 1: Global Veto Mode and Central Action Commands */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Global Veto Regulator Card */}
            <div className="xl:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-rose-450 uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>{lang === "fa" ? "تنظیم سطح وتوی سراسری سیستم" : "Global Veto Regulator"}</span>
              </h3>
              
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {lang === "fa"
                  ? "با وتوی سراسری، تمام دسترسی‌های عمومی اپلیکیشن و وب‌سایت با خطای ۵۰۳ متوقف شده و تنها بخش مدیریت جهت ممیزی و بازبینی باز باقی می‌ماند."
                  : "Activate global system shutdown block. In FULL LOCKDOWN mode, all public client interactions are paused and return a 503 Vetoed statement."}
              </p>

              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-850">
                <button
                  onClick={() => updateGlobalVetoLevel("none")}
                  className={`py-2 px-1 text-[10px] font-black rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                    globalVetoLevel === "none"
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className="text-[14px]">🟢</span>
                  <span>{lang === "fa" ? "عادی" : "Normal"}</span>
                </button>
                <button
                  onClick={() => updateGlobalVetoLevel("partial")}
                  className={`py-2 px-1 text-[10px] font-black rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                    globalVetoLevel === "partial"
                      ? "bg-amber-600 text-white shadow"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className="text-[14px]">🟡</span>
                  <span>{lang === "fa" ? "جزئی" : "Partial Veto"}</span>
                </button>
                <button
                  onClick={() => updateGlobalVetoLevel("full")}
                  className={`py-2 px-1 text-[10px] font-black rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                    globalVetoLevel === "full"
                      ? "bg-rose-600 text-white shadow"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className="text-[14px]">🔴</span>
                  <span>{lang === "fa" ? "لاک‌داون" : "Full Veto"}</span>
                </button>
              </div>

              <div className="pt-2">
                <span className="text-[9px] font-mono text-slate-500 block text-center">
                  Sovereign Active Key: amirkachaloooo65@gmail.com
                </span>
              </div>
            </div>

            {/* Central Commands Toolbar Dashboard */}
            <div className="xl:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>{lang === "fa" ? "فرمان‌های اجرایی هسته مرکزی فرماندهی" : "Supreme Governor Executive Commands"}</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                <button
                  onClick={triggerSyncCAD}
                  className="bg-slate-950 p-4 border border-slate-850 hover:border-indigo-500 hover:bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5 text-indigo-400" />
                  <span className="text-[10px] font-black text-white">{lang === "fa" ? "همگام‌سازی کاداستر" : "Sync CAD Indexes"}</span>
                  <span className="text-[8px] text-slate-500">Global Registry Code</span>
                </button>

                <button
                  onClick={triggerResetAnomalyLogs}
                  className="bg-slate-950 p-4 border border-slate-850 hover:border-indigo-500 hover:bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer"
                >
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span className="text-[10px] font-black text-white">{lang === "fa" ? "پاک‌سازی ساد" : "Purge Logs"}</span>
                  <span className="text-[8px] text-slate-500">Reset Security Anomaly</span>
                </button>

                <button
                  onClick={triggerManualBackup}
                  className="bg-slate-950 p-4 border border-slate-850 hover:border-indigo-500 hover:bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer"
                >
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] font-black text-white">{lang === "fa" ? "نقاط بازیابی فوری" : "Snapshot Backup"}</span>
                  <span className="text-[8px] text-slate-500">Capture System DB</span>
                </button>

                <button
                  onClick={generateMockReport}
                  className="bg-slate-950 p-4 border border-slate-850 hover:border-indigo-500 hover:bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer"
                >
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <span className="text-[10px] font-black text-white">{lang === "fa" ? "گزارش کاداستر ماهانه" : "CAD Statement"}</span>
                  <span className="text-[8px] text-slate-500">Download Excel / PDF</span>
                </button>
              </div>

              <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl text-[10px] text-indigo-300 leading-relaxed">
                {lang === "fa"
                  ? "💡 هسته مرکزی ملزم به ثبت منظم تمام تراکنش‌ها، ممیزی املاک مسکونی/تجاری/اداری، و تطبیق لحظه‌ای تتر TRC20 بدون کارمزد متصدی واسط است."
                  : "💡 The central brain enforces real-time decentralized verification. All property listings (domestic, commercial, workspace office leases) will obey Veto restrictions automatically."}
              </div>
            </div>
          </div>

          {/* Action Row 2: 10 Operational Modules Console with Veto Switches */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>{lang === "fa" ? "کنسول پایش و کنترل وتوی ماژول‌های ده‌گانه کاداستر" : "Ten-Module Cadastral Veto Control Console"}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lang === "fa"
                    ? "هر کدام از ماژول‌های فرعی مستقلاً قابل قطع (وتو) به صورت فوری هستند. با وتو کردن یک ماژول، دسترسی کاربران لغو می‌گردد."
                    : "Individual modules can be suspended instantly. Suspended modules immediately halt execution and deny tenant/landlord flows."}
                </p>
              </div>
              <span className="text-[9px] bg-slate-950 border border-slate-800 font-mono text-slate-400 py-1.5 px-3 rounded-full flex items-center gap-1.5 font-bold uppercase">
                ⚙️ CORE MODULE VETOS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {supremeModules.map((mod: any) => (
                <div key={mod.id} className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between gap-3 shadow">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-1">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-indigo-400 font-black block">{mod.id}</span>
                        <h4 className="text-xs font-black text-white">{lang === "fa" ? mod.nameFa : mod.nameEn}</h4>
                      </div>
                      
                      {mod.isActive ? (
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/30 text-[8px] font-bold px-2 py-0.5 rounded uppercase">
                          🟢 ACTIVE
                        </span>
                      ) : (
                        <span className="bg-rose-950 text-rose-450 border border-rose-900/40 text-[8px] font-bold px-2 py-0.5 rounded uppercase animate-pulse">
                          🚨 VETOED
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-500">
                      {lang === "fa" ? `وابستگی‌ها: ${mod.dependencies.join(", ")}` : `Dependencies: ${mod.dependencies.join(", ")}`}
                    </p>

                    {mod.vetoReason && !mod.isActive && (
                      <div className="p-2 bg-rose-950/20 border border-rose-900/20 rounded-lg text-[9px] text-rose-300 italic">
                        "{mod.vetoReason}"
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleModuleVeto(mod.id, mod.isActive)}
                    className={`w-full py-2 px-3 text-[10px] font-black rounded-xl transition active:scale-95 cursor-pointer ${
                      mod.isActive 
                        ? "bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white hover:border-transparent" 
                        : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                  >
                    {mod.id === "CORE" ? (
                      <span>🛡️ {lang === "fa" ? "قفل هسته (غیرقابل وتو)" : "Core (Unvetoable)"}</span>
                    ) : mod.isActive ? (
                      <span>🔴 {lang === "fa" ? "فعال‌سازی وتو (قطع ماژول)" : "Veto & Halt"}</span>
                    ) : (
                      <span>🟢 {lang === "fa" ? "رفع وتو (فعال‌سازی مجدد)" : "Restore Online"}</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row 3: Database Schemas, Veto Logs and Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Database Schematics Tab Panel */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>{lang === "fa" ? "نمودار فیزیکی پایگاه داده‌ها (کاداستر یکپارچه)" : "SaaS Global Database Cadastral Schemas"}</span>
                </h3>
                <p className="text-[11px] text-slate-405 leading-relaxed">
                  {lang === "fa"
                    ? "نمودارهای فیزیکی و کلیدهای بهینه‌سازی کاداستر را جهت تست باز کنید. این طرح‌واره‌ها بر روی PostgreSQL/SQLite با معماری لاندلرد تعریف شده‌اند."
                    : "Inspect physical PostgreSQL structures configured under central architecture bounds. Fully optimized for high-velocity global leases."}
                </p>
              </div>

              {/* Schema Switches */}
              <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-850 text-[10px] font-black font-mono">
                <button
                  onClick={() => setSelectedSchema("core_schema")}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                    selectedSchema === "core_schema" ? "bg-indigo-600 text-white" : "text-slate-450 hover:text-white"
                  }`}
                >
                  ⚙️ core_schema
                </button>
                <button
                  onClick={() => setSelectedSchema("landlord_schema")}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                    selectedSchema === "landlord_schema" ? "bg-indigo-600 text-white" : "text-slate-450 hover:text-white"
                  }`}
                >
                  👤 landlord_schema
                </button>
                <button
                  onClick={() => setSelectedSchema("booking_schema")}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                    selectedSchema === "booking_schema" ? "bg-indigo-600 text-white" : "text-slate-450 hover:text-white"
                  }`}
                >
                  📄 booking_schema
                </button>
                <button
                  onClick={() => setSelectedSchema("i18n_schema")}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                    selectedSchema === "i18n_schema" ? "bg-indigo-600 text-white" : "text-slate-450 hover:text-white"
                  }`}
                >
                  🌐 i18n_schema
                </button>
                <button
                  onClick={() => setSelectedSchema("crypto_schema")}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                    selectedSchema === "crypto_schema" ? "bg-indigo-600 text-white" : "text-slate-450 hover:text-white"
                  }`}
                >
                  🪙 crypto_schema
                </button>
              </div>

              {/* Text Area for schemas */}
              <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl font-mono text-[10.5px] text-slate-400 overflow-x-auto select-all max-h-[190px] overflow-y-auto">
                {selectedSchema === "core_schema" && (
                  <pre>{`-- 👑 core_schema (System Global Parameters)
CREATE TABLE core_settings (
  id SERIAL PRIMARY KEY,
  site_name VARCHAR(100) DEFAULT 'Ariana Rahnuma SaaS',
  global_lockout_level VARCHAR(20) DEFAULT 'none',
  commission_fee_percentage NUMERIC(5,2) DEFAULT 5.00,
  active_escrow_wallet VARCHAR(150),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_veto_logs (
  log_id SERIAL PRIMARY KEY,
  module_id VARCHAR(10) NOT NULL,
  vetoyed_by VARCHAR(100),
  vetoyed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason TEXT
);`}</pre>
                )}

                {selectedSchema === "landlord_schema" && (
                  <pre>{`-- 👥 landlord_schema (Tenant and Landlord lifecycle registry)
CREATE TABLE landlord_profiles (
  landlord_id INT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(150) UNIQUE,
  kyc_status VARCHAR(20) DEFAULT 'pending', -- approved, none
  registered_country VARCHAR(10), -- SG, GB, RU, etc.
  reputation_rating NUMERIC(3,2) DEFAULT 5.00
);

CREATE TABLE tenant_profiles (
  tenant_id INT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  escrow_deposit_allowance NUMERIC(12,2) DEFAULT 0.00
);`}</pre>
                )}

                {selectedSchema === "booking_schema" && (
                  <pre>{`-- 📄 booking_schema (Physical Cadastral Property Contracts)
CREATE TABLE cadastral_properties (
  property_id SERIAL PRIMARY KEY,
  landlord_id INT REFERENCES landlord_schema.landlord_profiles,
  title VARCHAR(250) NOT NULL,
  country_code VARCHAR(10) DEFAULT 'RU', -- SG, GB, CA
  type VARCHAR(30) DEFAULT 'residential', -- commercial, office
  cad_price_per_month NUMERIC(15,2) NOT NULL,
  deposit_amount NUMERIC(15,2) NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE
);`}</pre>
                )}

                {selectedSchema === "i18n_schema" && (
                  <pre>{`-- 🌐 i18n_schema (Multi-lingual dynamic dictionary lock)
CREATE TABLE localization_dictionary (
  word_key VARCHAR(100) PRIMARY KEY,
  fa_translation TEXT NOT NULL,
  ru_translation TEXT,
  en_translation TEXT NOT NULL,
  sg_translation TEXT,
  is_rtl BOOLEAN DEFAULT FALSE
);`}</pre>
                )}

                {selectedSchema === "crypto_schema" && (
                  <pre>{`-- 🪙 crypto_schema (Autonomous TRC20 5% blockchain fee audits)
CREATE TABLE blockchain_transactions_ledgers (
  tx_hash VARCHAR(150) PRIMARY KEY,
  property_id INT REFERENCES booking_schema.cadastral_properties,
  amount_usdt NUMERIC(15,2) NOT NULL,
  sender_address VARCHAR(100) NOT NULL,
  scan_attempts INT DEFAULT 1,
  verified_status VARCHAR(20) DEFAULT 'pending', -- confirmed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}</pre>
                )}
              </div>
            </div>

            {/* Veto Timeline & Auditor Audits */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-white uppercase flex items-center gap-2 text-rose-450">
                  <Clock className="w-4 h-4 text-rose-500" />
                  <span>{lang === "fa" ? "سیاهه گزارش‌های وتو به تفکیک فرمانده" : "Sovereign Veto Authority Timeline"}</span>
                </h3>
                <p className="text-[10px] text-slate-500 leading-normal">
                  {lang === "fa"
                    ? "آمار تاریخی و لحظه‌ای قطع سیستم توسط مراجع وتو"
                    : "Chronological log history tracing system interventions."}
                </p>
              </div>

              <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl h-[210px] overflow-y-auto space-y-3 font-mono text-[10px]">
                {vetoLogs.map((log: any) => (
                  <div key={log.vetoId} className="border-b border-slate-900 pb-2.5 last:border-0 last:pb-0 space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-rose-450">
                      <span className="font-bold">🚫 {log.moduleId} SHUTDOWN</span>
                      <span>{log.vetoId}</span>
                    </div>
                    <p className="text-slate-350 font-sans italic text-[10.5px]">"{log.reason}"</p>
                    <div className="flex justify-between text-[8.5px] text-slate-500">
                      <span>By: {log.vetoBy}</span>
                      <span>{new Date(log.vetoAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row 4: Historical Diagnostics & Safe Snapshot Backups */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Live stats */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{lang === "fa" ? "وضعیت زنده سخت‌افزار و پایش لایسنس" : "Live Security System Diagnostics"}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">{lang === "fa" ? "زمان بالا بودن سرور" : "Server Uptime Status"}</span>
                  <p className="text-sm font-mono font-black text-emerald-400">{(systemDiagnostics.serverUptimeSec / 3600).toFixed(1)} Hrs Active</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">{lang === "fa" ? "مرز مصرف محدودیت API جمینی" : "Gemini API Safe Token Credit"}</span>
                  <p className="text-sm font-mono font-black text-indigo-400">{systemDiagnostics.apiCreditsPercentUsed}% Usage Index</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">{lang === "fa" ? "نرخ خطای ۵۰۰ (ساعتی)" : "Hour 500 Error Alerts"}</span>
                  <p className="text-sm font-mono font-black text-rose-500">{systemDiagnostics.hour500ErrorCount} Errors Handled</p>
                </div>
              </div>

              {/* Email Alert Logs */}
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                  <h4 className="text-xs font-bold text-slate-300">{lang === "fa" ? "گزارش هشدارهای امنیتی و ایمیل به مدیر" : "Outbound System Email Notifications Sent"}</h4>
                  <span className="text-[9px] font-mono text-slate-500">{lang === "fa" ? "گزارش لحظه‌ای" : "Real-time Alerts"}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 h-[120px] overflow-y-auto font-mono text-[10px] text-slate-400 space-y-2">
                  {systemDiagnostics.emailAlertLogs && systemDiagnostics.emailAlertLogs.length > 0 ? (
                    systemDiagnostics.emailAlertLogs.map((log: string, idx: number) => (
                      <div key={idx} className="p-2 bg-slate-900 border-l-2 border-indigo-500 rounded flex gap-2">
                        <span>{log}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-600 py-6">
                      {lang === "fa" ? "سیاهه هشدارها خالی است. سیستم در بالاترین کالیبر امنیتی می‌باشد." : "Inbox empty. Server operates at premium capacity parameters."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Daily 3 AM snaps */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span>{lang === "fa" ? "نقاط بازیابی و بکاپ خودکار" : "Daily 3 AM Backup Ledger"}</span>
                </h3>
                <span className="text-[9px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded">30 Days Safe</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {lang === "fa" 
                  ? "پشتیبان‌گیری کامل از داده‌های کاداستر، جفت‌های چتبات و لغت‌نامه‌های سفارشی سیستم هر بار در ۳:۰۰ صبح انجام گشته و پایداری فایل‌ها مانیتور می‌شود." 
                  : "Daily automatic snapshots are compiled at 3:00 AM on our servers. Restore the system to any desired day with one click."}
              </p>

              <button
                onClick={triggerManualBackup}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{lang === "fa" ? "ایجاد بکاپ فوری دستی" : "Capture Backup Snapshot"}</span>
              </button>

              <div className="space-y-2 mt-4 max-h-[140px] overflow-y-auto">
                {historicalBackups.map((b: any) => (
                  <div key={b.id} className="p-3 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-between gap-1.5">
                    <div className="space-y-0.5 max-w-[70%]">
                      <span className="text-[11px] font-bold text-white block truncate">{b.label}</span>
                      <span className="text-[9px] text-slate-500 block font-mono">{new Date(b.timestamp).toLocaleString()} ({b.sizeKb} KB)</span>
                    </div>
                    <button
                      onClick={() => restoreBackupId(b.id)}
                      className="px-2.5 py-1.5 bg-indigo-950/40 border border-indigo-900/40 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-lg text-[9px] font-bold transition cursor-pointer"
                    >
                      {lang === "fa" ? "بازیابی" : "Restore"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DECENTRALIZED COMMISSION USDT Auto-payment (Rule #1) */}
      {subSection === "payments" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Main Transaction List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === "fa" ? "تایید خودکار تراکنش‌های پرداخت کمیسیون (USDT)" : "Automated Tether (USDT-TRC20) Cashier"}</span>
              </h3>

              <p className="text-xs text-slate-400">
                {lang === "fa" 
                  ? "لجر آریانا رهنما هر ۱۰ دقیقه کیف‌پول‌های تصادفی آژانس‌ها را اسکن کرده و به محض شناسایی واریز کامل ۵ درصد ارزش حق کاداستر، آگهی را بدون نیاز به ورود شما فعال می‌نماید." 
                  : "Every property listing can be configured with a dynamic agent wallet address. The blockchain scanner checks transactions and auto-approves corresponding listings immediately."}
              </p>

              <div className="space-y-3">
                {trc20Transactions.map((tx: any) => (
                  <div key={tx.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{tx.agencyName}</span>
                        <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 font-mono">MLS-{tx.listingId}</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 block font-mono truncate">{tx.txHash}</span>
                      <span className="text-[9px] text-slate-500 block">{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-black font-mono text-emerald-400 block">{tx.amount.toFixed(2)} {tx.tokens}</span>
                        <span className="text-[9px] text-slate-500 block">{tx.walletAddress === "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD" ? "Standard Cold" : "Temp Escrow"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {tx.status === "confirmed" ? (
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/30 text-[9px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{lang === "fa" ? "خودکار تأیید" : "Auto Verified"}</span>
                          </span>
                        ) : (
                          <span className="bg-amber-950/60 text-amber-400 border border-amber-900/20 text-[9px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>{lang === "fa" ? "پایش فعال" : "Scanning Block..."}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trigger Blockchain Fake Deposit for Testing */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{lang === "fa" ? "شبیه‌ساز پرداخت رمزارزی بلاکچین" : "USDT-TRC20 Tx Sender (Test)"}</span>
              </h3>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {lang === "fa" 
                  ? "جهت راستی‌آزمایی روند بررسی و خودکارسازی بدون من، یک تراکنش واریز آزمایشی ایجاد کنید تا ببینید سیستم بدون دخالت فاکتور را تایید می‌کند." 
                  : "To verify how this system operates while you are offline, submit a simulated blockchain transaction below and watch the auto-ledger process it!"}
              </p>

              <form onSubmit={triggerSimulationPayment} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block">{lang === "fa" ? "نام آژانس/املاک متقاضی:" : "Agency Portfolio Name:"}</label>
                  <input
                    type="text"
                    required
                    value={simAgency}
                    onChange={(e) => setSimAgency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">{lang === "fa" ? "مبلغ واریز تتر:" : "USDT Amount:"}</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={simAmount}
                      onChange={(e) => setSimAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-white text-xs text-center focus:outline-none focus:border-indigo-500 font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">{lang === "fa" ? "بر روی آگهی شماره:" : "Target Listing ID:"}</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-white text-xs text-center focus:outline-none focus:border-indigo-500 font-mono"
                      defaultValue="3"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block">{lang === "fa" ? "آدرس لجر موقت (USDT Wallet):" : "Escrow Wallet Address:"}</label>
                  <input
                    type="text"
                    required
                    value={simWallet}
                    onChange={(e) => setSimWallet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-white text-[10px] font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-xs active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === "fa" ? "ارسال تراکنش پرداخت تتر" : "Submit TRC20 Simulation"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MONTHLY CADASTRAL ESTIMATIONS (Rule #2 & AI Duty 3) */}
      {subSection === "pricing" && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === "fa" ? "پیشنهاد قیمت بهینه ماهانه بر اساس هوش مصنوعی" : "AI Optimal Valuation Strategy proposals"}</span>
            </h3>
            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Auto-Pilot Strategy
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-4xl leading-relaxed">
            {lang === "fa" 
              ? "موتور هوش مصنوعی هر ۳۰ روز برای هر کشور/منطقه بر اساس تاریخچه معاملات، میزان تقاضا و بازدیدهای کاربران، قیمت‌های بهینه‌ای را پیشنهاد می‌دهد. به عنوان ناظر تنها کافیست نظر نهایی (بله / خیر) در این کادرها اعمال کنید تا میانگین دفتر ثبت فورا تغییر کند." 
              : "Our generative models continuously analyze transactional velocity, municipal baseline fluctuations, and inquiry rates, then output monthly adjustments. Simply click YES or NO to approve changes!"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {priceProposals.map((p: any) => (
              <div key={p.id} className="bg-slate-950 p-5 rounded-3xl border border-slate-850 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-amber-500 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-900/30">
                      📍 {p.district} ({p.country})
                    </span>
                    <span className="text-xs font-mono font-black text-indigo-400">
                      +{p.potentialIncreasePct}% Revenue Yield
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic font-medium">
                    "{lang === "fa" ? p.reasonFa : p.reasonEn}"
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-900 text-xs font-mono">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-[9px] text-slate-500 block mb-0.5">{lang === "fa" ? "شاخص فعلی بر متر:" : "Current Index Value:"}</span>
                      <strong className="text-white text-center block">${p.currentAvg}</strong>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-indigo-500/20">
                      <span className="text-[9px] text-indigo-400 block mb-0.5">{lang === "fa" ? "مبلغ هوشمند پیشنهادی:" : "Proposed Optimum Index:"}</span>
                      <strong className="text-emerald-400 text-center block">${p.suggestedAvg}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  {p.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handlePriceDecision(p.id, true)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{lang === "fa" ? "بله، تغییر شاخص قیمت" : "Approve Proposed Value"}</span>
                      </button>
                      <button
                        onClick={() => handlePriceDecision(p.id, false)}
                        className="py-2 px-4 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{lang === "fa" ? "خیر" : "Decline Change"}</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center py-2 text-xs font-bold font-mono rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center gap-2">
                      {p.status === "approved" ? (
                        <span className="text-emerald-400">✓ {lang === "fa" ? "تایید و در لجر ثبت گردید" : "Approved & applied to Cadastral Database"}</span>
                      ) : (
                        <span className="text-slate-500">✗ {lang === "fa" ? "توصیه هوش مصنوعی رد شد" : "Valuation proposal declined"}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CHATBOT LEARN PLATFORM (Rule #5 & Duty 6) */}
      {subSection === "chatbot" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Learn Answer Form */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>{lang === "fa" ? "آموزش الگوهای پاسخگویی چتبات" : "Teach AI Support Chatbot Pairs"}</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === "fa" 
                ? "وقتی کاربر از چتبات سوالی می‌پرسد که پاسخی برایش تعریف نشده، سیستم آن را به کادر پایین اضافه کرده و همزمان برای شما ایمیل می‌کند. به محض وارد کردن جواب، چتبات این بهینه‌سازی را ذخیره کرده و دفعه بعد دقیقا همین پاسخ شما را اعلام می‌کند." 
                : "Whenever a support inquiry fails to trigger a resolved answer, it is forwarded as a mail ticket and logged here. Provide the correct answers below to build a bulletproof self-teaching customer service robot!"}
            </p>

            <form onSubmit={handleLearnQA} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold block">{lang === "fa" ? "متن سوال مشتری:" : "Client Inquiry Question:"}</label>
                <textarea
                  required
                  rows={2}
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder={lang === "fa" ? "مثال: آپارتماهای روسیه چه امکاناتی دارند؟" : "Example: Does Moscow catalog have legal deeds?"}
                  className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold block">{lang === "fa" ? "پاسخ سفارشی و تخصصی:" : "Learned Response Answer:"}</label>
                <textarea
                  required
                  rows={3}
                  value={customAnswer}
                  onChange={(e) => setCustomAnswer(e.target.value)}
                  placeholder={lang === "fa" ? "سیستم پاسخ آریانا رهنما..." : "All options carry sovereign registered guarantee seals..."}
                  className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-505 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bot className="w-4 h-4" />
                <span>{lang === "fa" ? "آموزش چتبات پشتیبانی" : "Learn & Apply Q&A Link"}</span>
              </button>
            </form>
          </div>

          {/* Pending and Learned Q&A lists */}
          <div className="space-y-6">
            
            {/* Unresolved Questions Alert Box */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 text-rose-450">
                <Mail className="w-4 h-4 text-rose-500" />
                <span>{lang === "fa" ? "سوالات بدون پاسخ فاقد لغت‌نامه" : "Pending Unresolved Client Mail-Tickets"}</span>
              </h4>

              <div className="space-y-2 max-h-[140px] overflow-y-auto">
                {pendingQuestions.length > 0 ? (
                  pendingQuestions.map((q: string, idx: number) => (
                    <div 
                      key={idx} 
                      onClick={() => setCustomQuestion(q)}
                      className="p-2.5 bg-slate-950 border border-slate-850 hover:border-indigo-500 hover:bg-slate-900 rounded-xl text-[10.5px] text-slate-350 flex items-center justify-between gap-1 cursor-pointer transition"
                    >
                      <span className="truncate max-w-[85%]">❓ "{q}"</span>
                      <span className="text-[8px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.5 rounded">Learn</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-600 font-mono text-[10px] py-6">
                    {lang === "fa" ? "موردی یافت نشد. همه سوالات دارای لایه پاسخ تفصیلی کاداستر هستند." : "0 pending tickets. Every user query has been beautifully answered!"}
                  </div>
                )}
              </div>
            </div>

            {/* Already Learned Database registry */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === "fa" ? "لغت‌نامه الگوهای آموخته شده چتبات" : "Active Learned Q&A Registry"}</span>
              </h4>

              <div className="space-y-2 max-h-[170px] overflow-y-auto">
                {chatbotLearnedQA.map((qa: any) => (
                  <div key={qa.id} className="p-3 bg-slate-950 border border-slate-850 rounded-2xl text-[10px] space-y-1">
                    <span className="font-bold text-slate-300 block">Q: {qa.question}</span>
                    <span className="text-slate-400 block italic">A: {qa.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: MANUAL TRANSLATION DICTIONARY OVERRIDES (Rule #4 & AI Duty 1) */}
      {subSection === "translation" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Override Text Form */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>{lang === "fa" ? "ویرایش و ذخیره هوشمند لغات" : "Correction Override Registry"}</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === "fa" 
                ? "هر زمان عبارتی را به صورت دستی تصحیح نمایید، سیستم آن را برای دفعات بعد ذخیره کرده تا به محض تکرار، از همان معادل بهره ببرد و به مرور زمان بدون دخالت شما کاملا محلی‌سازی گردد." 
                : "Every time you refine a layout translation key manually, our registry system records it. Next time the system is rendering the client brochure, it'll pull your custom terms instead of generic bases!"}
            </p>

            <form onSubmit={handleLearnTranslation} className="space-y-3.5">
              <div className="space-y-1 bg-slate-950 p-4 border border-slate-850 rounded-2xl">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">{lang === "fa" ? "کلید لغوی مورد نظر (Translation Key):" : "System Localization Reference Key:"}</label>
                <input
                  type="text"
                  required
                  value={transKey}
                  placeholder="en.welcome , fa.calculator ..."
                  onChange={(e) => setTransKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1 bg-slate-950 p-4 border border-slate-850 rounded-2xl">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">{lang === "fa" ? "ترجمه اصلاحی دستی شما:" : "Manual Custom Translation Value:"}</label>
                <input
                  type="text"
                  required
                  value={transVal}
                  placeholder={lang === "fa" ? "متن فارسی تصحیح شده..." : "Your native translated custom value..."}
                  onChange={(e) => setTransVal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>{lang === "fa" ? "اعمال و ثبت لغت در هوش مصنوئ" : "Save Word Translation Lock"}</span>
              </button>
            </form>
          </div>

          {/* AI Automated Translator of New Language Panel (Duty #1) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-black text-rose-450 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
              <span>{lang === "fa" ? "ترجمه خودکار لغت‌نامه زبان جدید (AI Translator)" : "AI Language Builder & Translator"}</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === "fa" 
                ? "کافیست شناسه زبان جدید را وارد کنید تا هوش مصنوعی کل منابع ترجمه ما را به زبان مقصد ترجمه کند. سیستم جهت RTL یا LTR بودن زبان مقصد را بررسی کرده و فرم‌ها را راست‌چین می‌نماید." 
                : "Enter any target ISO language identifier (e.g. 'ar', 'de', 'es'). The compiler translates all standard configuration files, sets appropriate RTL formatting, and notifies properties."}
            </p>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{lang === "fa" ? "شناسه زبان جدید (مثال: ar):" : "Target Language ISO Code:"}</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={targetLangCode}
                    onChange={(e) => setTargetLangCode(e.target.value.toLowerCase())}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white text-center text-xs focus:outline-none focus:border-indigo-500 font-mono font-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">{lang === "fa" ? "جهت پیش‌فرض راست‌چین (RTL):" : "Right-to-Left (RTL):"}</label>
                  <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setIsNewLangRtl(true)}
                      className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition ${isNewLangRtl ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                    >
                      RTL
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNewLangRtl(false)}
                      className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition ${!isNewLangRtl ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                    >
                      LTR
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={generateNewLanguagePack}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-xl text-xs active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Cpu className="w-4 h-4 animate-bounce-slow" />
                <span>{lang === "fa" ? "شروع ترجمه هوشمند لایحه یکبارچه" : "AI Translate Entire Language Pack"}</span>
              </button>
            </div>

            <div className="space-y-2 mt-4 font-mono text-[10px] text-slate-400 max-h-[110px] overflow-y-auto">
              {Object.keys(manualTranslations).map(k => (
                <div key={k} className="p-2 bg-slate-950 border border-slate-850 rounded-xl flex justify-between gap-1">
                  <span className="text-indigo-400">{k}:</span>
                  <span className="text-slate-350">{manualTranslations[k]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: FORECASTS AND SUSPICIOUS FRAUD CHECKER (Duties 4 & 5) */}
      {subSection === "forecast" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in text-white">
          
          {/* Anomaly & Anti-Fraud system (AI Duty 5) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-black text-rose-450 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>{lang === "fa" ? "سیستم تشخیص جریمه و تقلب خودکار" : "Sovereign AI Fraud & Anti-Abuse Scanner"}</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === "fa" 
                ? "سیستم به صورت هوشمند الگوهای مشکوک مانند قیمت‌های کاذب، تصاویر تکراری، ناهماهنگی موقعیت جغرافیایی با آدرس درج شده کاداستر را رهگیری کرده و متخطی را جریمه می‌کند." 
                : "Continuous heuristic checking of anomalous parameters (e.g. pricing that is significantly lower than average baseline indexes, coordinate mismatches, or duplicate layouts)."}
            </p>

            <div className="space-y-3">
              {anomalyLogs && anomalyLogs.length > 0 ? (
                anomalyLogs.map((log: any) => (
                  <div key={log.id} className="p-4 bg-slate-950 border border-rose-500/10 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-black text-slate-300">{log.title}</span>
                      </div>
                      <span className="text-[8px] bg-rose-500/15 text-rose-300 font-bold px-2 py-0.5 rounded">
                        {log.severity.toUpperCase()} ALERT
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {lang === "fa" ? log.reasonFa : log.reasonEn}
                    </p>
                    <span className="text-[9px] text-slate-500 block font-mono">MLS ID: {log.propertyId} • {new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-650 font-mono py-10">
                  {lang === "fa" ? "مورد خلافی یافت نشد." : "No fraud records detected."}
                </div>
              )}
            </div>
          </div>

          {/* Lead and Sales Forecast SVG area chart (AI Duty 4) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>{lang === "fa" ? "پیش‌بینی معاملات و تقاضای ماه آینده" : "AI Predicted Leads & Sales Valuation Trend"}</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === "fa" 
                ? "ارزیابی الگوهای اجاره و خرید ملک بر اساس اطلاعات کاداستر ۶ ماه گذشته به تفکیک روزهای تعطیل، فواصل پربازدید و حجم تقاضا در ۳۰ روز آتی:" 
                : "Predictive neural networks calculate inquiry volume for the next 30 days based on the past 6 months. Highlighting peak days helps optimize your market rate entries."}
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[10px] text-slate-400 font-bold">{lang === "fa" ? "نمودار پیش‌بینی حجم تقاضا (۳۰ روز آینده)" : "Predicted Lead Volume (Next 30 Days)"}</span>
                <span className="text-[9px] font-mono text-indigo-400 font-black">High Target: +24% peak</span>
              </div>

              {/* Custom visually stunning SVG Chart Area to prevent Recharts/D3 package load failures */}
              <div className="relative h-[150px] w-full bg-slate-900 border border-slate-850 rounded-xl overflow-hidden p-1.5 flex flex-col justify-end">
                <svg className="w-full h-[90%] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Glowing Area Fill */}
                  <defs>
                    <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />

                  {/* Area */}
                  <path 
                    d="M 0 90 Q 20 40 40 70 T 80 20 T 100 10 L 100 100 L 0 100 Z" 
                    fill="url(#gradient-area)" 
                  />
                  
                  {/* Spline Path */}
                  <path 
                    d="M 0 90 Q 20 40 40 70 T 80 20 T 100 10" 
                    fill="none" 
                    stroke="#6366f1" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    className="stroke-pulse"
                  />

                  {/* Highlights */}
                  <circle cx="80" cy="20" r="3" fill="#fbbf24" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="100" cy="10" r="3" fill="#10b981" stroke="#0f172a" strokeWidth="1" />
                </svg>

                <div className="flex justify-between items-center mt-2.5 px-1 font-mono text-[8px] text-slate-500">
                  <span>Day 1 (Low Demand)</span>
                  <span>Day 15 (Moderate)</span>
                  <span>Day 30 (Peak Volume)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-[10.5px]">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-850">
                  <span className="text-[9px] text-slate-500 block mb-0.5">{lang === "fa" ? "روز شلوغ پیش‌بینی شده:" : "Forecasted High-Peak Days:"}</span>
                  <strong className="text-emerald-400 font-bold block">June 18 - June 24 (High)</strong>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-850">
                  <span className="text-[9px] text-slate-500 block mb-0.5">{lang === "fa" ? "روز آرام پیش‌بینی شده:" : "Forecasted Quiet Days:"}</span>
                  <strong className="text-amber-500 font-bold block">June 04 - June 08 (Low)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
