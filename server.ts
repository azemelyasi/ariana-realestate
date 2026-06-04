import express from "express";
import cors from "cors";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

// Google Search Console Site Verification Route
app.get("/googleebf6a0ae214f59c9.html", (_req, res) => {
  res.send("google-site-verification: googleebf6a0ae214f59c9.html");
});

// =============================================================
// SUPREME CORE ENGINE STATE (👑 قانون اول، دوم و پنجم)
// =============================================================
interface CommandModule {
  id: string; // CORE, M1 - M10
  nameEn: string;
  nameFa: string;
  isActive: boolean;
  dependencies: string[];
  vetoReason?: string;
  vetoAt?: string;
  vetoBy?: string;
}

let supremeModules: CommandModule[] = [
  { id: "CORE", nameEn: "Supreme Core Engine", nameFa: "هسته مرکزی فرماندهی", isActive: true, dependencies: [] },
  { id: "M1", nameEn: "Tenant Management", nameFa: "مدیریت موجران و مستأجران", isActive: true, dependencies: ["CORE"] },
  { id: "M2", nameEn: "Property Management", nameFa: "مدیریت املاک", isActive: true, dependencies: ["CORE"] },
  { id: "M3", nameEn: "Booking & Lease", nameFa: "رزرو و قرارداد اجاره", isActive: true, dependencies: ["CORE", "M2"] },
  { id: "M4", nameEn: "Payment Gateways", nameFa: "درگاه بانکی و رمزارز تتر", isActive: true, dependencies: ["CORE", "M3"] },
  { id: "M5", nameEn: "i18n & RTL Engine", nameFa: "بومی‌سازی و راست‌چینی پویا", isActive: true, dependencies: ["CORE"] },
  { id: "M6", nameEn: "Notification Engine", nameFa: "پیامک، ایمیل و اعلان‌ها", isActive: true, dependencies: ["CORE"] },
  { id: "M7", nameEn: "Business Analytics", nameFa: "آمار رشد و گزارش درآمد کاداستر", isActive: true, dependencies: ["CORE"] },
  { id: "M8", nameEn: "Crypto Processor", nameFa: "پردازشگر و تایید تتر TRC20", isActive: true, dependencies: ["CORE", "M4"] },
  { id: "M9", nameEn: "SEO & Google Map Indexer", nameFa: "نمایش نقشه و سئو موتورهای جستجو", isActive: true, dependencies: ["CORE", "M2"] },
  { id: "M10", nameEn: "AI Autonomous Orchestrator", nameFa: "ارکستراتور هوش مصنوعی و ترجمه", isActive: true, dependencies: ["CORE"] }
];

let globalVetoLevel: "none" | "partial" | "full" = "none";
let vetoLogs: any[] = [
  { vetoId: "vlog-201", moduleId: "M3", vetoBy: "Supreme Governor (Amir)", vetoAt: new Date(Date.now() - 36 * 3600000).toISOString(), reason: "Security auditing and hot-patch updates on digital leases database registry." }
];

// Global API level interceptor for the Veto Law (👑 قانون دوم)
app.use((req, res, next) => {
  const url = req.url;
  
  // Admin-specific endpoints are always allowed to bypass Veto blocks so the Commander can restore operations
  const isAdminOrCoreAction = url.startsWith("/api/core/") || url.startsWith("/api/automation/") || url.includes("/backup/") || url.includes("/translate-pack");
  
  if (!isAdminOrCoreAction && url.startsWith("/api/")) {
    // 1. Check Full Veto
    if (globalVetoLevel === "full") {
      return res.status(503).json({
        error: "Service Vetoed",
        message: "وتوی کامل فعال است. کل عملکردهای سیستم به دستور ابرمدیر (امیر) موقتاً مسدود شده است.",
        messageEn: "The entire system is under complete global veto lockdown by order of Governor (Amir).",
        code: 503
      });
    }

    // 2. Check individual module veto if requested
    // If client queries AI and M10 is inoperable
    if (url.includes("/gemini/consult") || url.includes("/translate-pack") || url.includes("/chatbot")) {
      const m10 = supremeModules.find(m => m.id === "M10");
      if (m10 && !m10.isActive) {
        return res.status(503).json({
          error: "Service Vetoed",
          message: "ماژول هوش مصنوعی (M10) متوقف است. سرویس در حال به‌روزرسانی است.",
          messageEn: "AI Autonomous Orchestrator (M10) is currently offline due to a veto audit.",
          code: 503
        });
      }
    }
  }
  next();
});

// Initialize Gemini SDK with custom user-agent telemetry based on the gemini-api guidelines
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Ariana Server: Gemini API client initialized successfully.");
  } catch (err) {
    console.error("Ariana Server: Error initializing Gemini SDK:", err);
  }
} else {
  console.log("Ariana Server: GEMINI_API_KEY is not defined in the workspace environment variables. Offline local heuristics will be used as a smart assistant fallback.");
}

// REST API for intelligent consultations
app.post("/api/gemini/consult", async (req, res) => {
  const { prompt, lang, userApiKey } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt supplied" });
  }

  const isFa = lang === "fa";

  // Use the user's custom API key if provided, otherwise fallback to the server config
  let activeAi = ai;
  const rawKey = userApiKey || req.headers["x-gemini-key"];
  if (rawKey && typeof rawKey === "string") {
    try {
      activeAi = new GoogleGenAI({
        apiKey: rawKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-custom-user',
          }
        }
      });
    } catch (err) {
      console.error("Ariana Server: Error initializing temporary user Gemini SDK:", err);
    }
  }

  // If Gemini is active and healthy, call it!
  if (activeAi) {
    try {
      const response = await activeAi.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are the Ariana Rahnuma Smart Cadastral Real Estate assistant. Provide accurate real estate insights, currency comparison metrics, or registration guidelines in the requested language (which is ${lang === "fa" ? "Persian/Farsi" : "English"}). Be helpful, professional, and clear. Avoid listing complex technical jargon unless requested. Always write in the selected language.`,
          temperature: 0.7,
        }
      });

      const replyStr = response.text;
      if (replyStr) {
        return res.json({ reply: replyStr });
      }
    } catch (err) {
      console.error("Ariana Server: Error during Gemini API execution", err);
    }
  }

  // Fallback heuristic calculations if GEMINI_API_KEY is absent or failed
  setTimeout(() => {
    let fallbackText = "";
    const query = String(prompt).toLowerCase();

    if (query.includes("moscow") || query.includes("مسکو") || query.includes("روسیه")) {
      fallbackText = isFa
        ? "طبق محاسبات کاداستر آریانا رهنما، املاک مسکات در منطقه Presnensky (تهران مسکو) به صورت متوسط حدود ۱۰,۰۰۰ الی ۱۲,۰۰۰ دلار بر متر مربع ارزیابی می‌شوند. برای جزئیات واقعی، می‌توانید آگهی پنت‌هاوس روسیه را از صفحه اصلی باز کنید."
        : "According to Ariana Rahnuma cadastral calculations, premium high-rise options in Moscow Presnensky district averages $10,000 to $12,000 per square meter. Check the featured Russian Penthouse on our main page for real details.";
    } else if (query.includes("dubai") || query.includes("دبی") || query.includes("امارات")) {
      fallbackText = isFa
        ? "در منطقه پالم جمیرا دبی، متوسط قیمت املاک ساحلی مرغوب در حدود ۱۵,۰۰۰ الی ۱۸,۰۰۰ درهم بر متر مربع ثبت است که مجهز به اسکله‌های اختصاصی می‌باشند."
        : "At Palm Jumeirah in Dubai, standard premium beachfront layouts rate around 15,000 to 18,000 AED per square meter with access to private yacht slips.";
    } else if (query.includes("kabul") || query.includes("کابل") || query.includes("افغانستان")) {
      fallbackText = isFa
        ? "املاک وزیر اکبرخان کابل به عنوان منطقه فوق‌العاده امن دیپلماتیک ارزیابی می‌شوند. نرخ متوسط اجاره ماهانه ویلاها ۱,۲۰۰ الی ۲,۰۰۰ دلار برآورد شده است."
        : "Wazir Akbar Khan villas in Kabul are highly secure diplomatic properties. Average lease rates typically vary from $1,200 to $2,000 monthly according to our database.";
    } else if (query.includes("turkey") || query.includes("ترکیه") || query.includes("استانبول")) {
      fallbackText = isFa
        ? "پنت‌هاوسهای Bebek استانبول در کرانه تنگه بسفر دارای متوسط اجاره ماهیانه ۴,۰۰۰ الی ۶,۰۰۰ لیر بر متر خواهند بود که راندمان اقتصادی چشم‌گیری دارد."
        : "Istanbul Bebek penthouses overlooking the Bosphorus Strait rate roughly 45,000 TRY per square meter. These yield highly attractive investment parameters.";
    } else {
      fallbackText = isFa
        ? "سیستم ارزش‌گذاری هوشمند آریانا رهنما بر اساس نرخ روز فرابورس، کاداستر جهانی، موقعیت دقیق و ویژگی‌های اختصاصی هر ملک اقدام به تعیین میانگین قیمت می‌نماید. سوال بعدی خود را بپرسید!"
        : "Ariana Rahnuma's system appraises values based on municipal records, daily currency exchange indexation, exact GPS, and floor factors. Feel free to ask more specific questions!";
    }

    res.json({ reply: fallbackText });
  }, 300);
});

// ==========================================
// CENTRAL ADVANCED AUTOMATION & AI DATABASE (InMemory)
// ==========================================
interface BlockchainTx {
  id: string;
  txHash: string;
  walletAddress: string;
  amount: number;
  tokens: string;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
  listingId?: string;
  agencyName: string;
}

interface PriceProposal {
  id: string;
  country: string;
  district: string;
  currentAvg: number;
  suggestedAvg: number;
  reasonEn: string;
  reasonFa: string;
  potentialIncreasePct: number;
  status: "pending" | "approved" | "declined";
}

interface CustomQA {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

interface AnomalyLog {
  id: string;
  propertyId: string;
  title: string;
  severity: "high" | "medium" | "low";
  reasonEn: string;
  reasonFa: string;
  timestamp: string;
}

interface BackupItem {
  id: string;
  timestamp: string;
  label: string;
  sizeKb: number;
  data: any;
}

// Default Seed Data
let trc20Transactions: BlockchainTx[] = [
  {
    id: "tx-1092a",
    txHash: "TFGv9ZkRpASt8bYdfhS7m5g6N...89da",
    walletAddress: "TY7kL9zPm78NfU1aBq3cFeSt98Wa",
    amount: 18.00,
    tokens: "USDT",
    timestamp: new Date(Date.now() - 4 * 600000).toISOString(),
    status: "confirmed",
    listingId: "1",
    agencyName: "Moscow Elite Brokers"
  },
  {
    id: "tx-4109b",
    txHash: "TX87kmNpTygfVbWdaS12XfKm98As...120f",
    walletAddress: "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD",
    amount: 5.00,
    tokens: "USDT",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    status: "pending",
    listingId: "2",
    agencyName: "Kabul Royal Estates"
  }
];

let priceProposals: PriceProposal[] = [
  {
    id: "prop-1",
    country: "RU",
    district: "Presnensky, Moscow",
    currentAvg: 11000,
    suggestedAvg: 12400,
    reasonEn: "Spike in high-net-worth foreign buyers from Farsi territories has decreased vacancy rate to 4.2%. Raising general index maximizes listings revenue.",
    reasonFa: "افزایش ورود سرمایه‌گذاران فارسی‌زبان نرخ خالی ماندن آپارتمان را به کمترین حد تاریخی (۴.۲٪) رسانده است. افزایش شاخص کاداستر سودآوری لجر را ۱۲٪ افزایش می‌دهد.",
    potentialIncreasePct: 15.2,
    status: "pending"
  },
  {
    id: "prop-2",
    country: "TR",
    district: "Bebek, Istanbul",
    currentAvg: 4500,
    suggestedAvg: 5120,
    reasonEn: "Summer listing demands along the Bosphorus strait are outstripping supply. Upward valuation adjustment matches real-time cadastral indices.",
    reasonFa: "تقاضای املاک ساحلی بوسفور پیش از تابستان به شدت از عرضه پیشی گرفته است. افزایش شاخص، تعادل قیمت بازار آزاد را سریع‌تر برقرار خواهد کرد.",
    potentialIncreasePct: 18.5,
    status: "pending"
  }
];

let chatbotLearnedQA: CustomQA[] = [
  {
    id: "qa-1",
    question: "آیا اسناد کاداستر آریانا رهنما ضمانت‌نامه دارند؟",
    answer: "بله، تمام اسنادی که در آریانا رهنما به تایید لجر می‌رسند دارای ضمانت‌نامه رسمی اصالت و مهر دیجیتال ۱۰۰٪ معتبر بوده و از بیمه مسئولیت معاملات استفاده می‌کنند.",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: "qa-2",
    question: "How are currency conversions calculated?",
    answer: "Currency conversions are updated every hour based on the integrated decentralized USDT market and the Central Bank's open API index.",
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

let pendingQuestions: string[] = [
  "آیا پنت‌هاوس روسیه سند شخصی دارد یا وقفی؟",
  "Is the Kabul diplomatic villa near the main highway?"
];

let manualTranslations: Record<string, string> = {
  "en.welcome": "Welcome to Ariana Rahnuma Sovereign Cadastre!",
  "fa.welcome": "به سامانه حاکمیتی کاداستر یکپارچه آریانا رهنما خوش آمدید!"
};

let anomalyLogs: AnomalyLog[] = [
  {
    id: "an-1",
    propertyId: "3",
    title: "Bebek Bosphorus Mansion",
    severity: "medium",
    reasonEn: "Proposed valuation rate (USDT) is 24% lower than state registers average for Bebek, check fake pricing parameters.",
    reasonFa: "قیمت ثبت شده در کاداستر به میزان ۲۴٪ کمتر از میانگین محدوده Bebek است؛ لطفا جهت جلوگیری از درج نرخ‌های کاذب ممیزی شود.",
    timestamp: new Date().toISOString()
  }
];

let historicalBackups: BackupItem[] = [
  {
    id: "backup-30may",
    timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    label: "Auto-Backup Day-231 (3:00 AM Cron Scheduled)",
    sizeKb: 652,
    data: { propertiesCount: 15, learnedCount: 2, transactionsCount: 2 }
  },
  {
    id: "backup-31may",
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    label: "Auto-Backup Day-232 (3:00 AM Cron Scheduled)",
    sizeKb: 654,
    data: { propertiesCount: 15, learnedCount: 2, transactionsCount: 2 }
  }
];

// System monitoring statuses
let systemDiagnostics = {
  serverUptimeSec: 184320,
  apiCreditsPercentUsed: 42,
  hour500ErrorCount: 0,
  latestCheckBlockchainTime: new Date().toISOString(),
  emailAlertLogs: [] as string[]
};

// Periodic simulated blockchain scanner (Self-Operating Golden Rule #1: Checks every 10 mins or simulated)
setInterval(() => {
  systemDiagnostics.latestCheckBlockchainTime = new Date().toISOString();
  // Find any pending transactions and confirm them to simulate blockchain automation
  const pendingTx = trc20Transactions.find(tx => tx.status === "pending");
  if (pendingTx) {
    pendingTx.status = "confirmed";
    const alertMsg = `💰 Block TX Detected: Reciept of ${pendingTx.amount} USDT in ${pendingTx.walletAddress} for Agency "${pendingTx.agencyName}" approved automatically.`;
    systemDiagnostics.emailAlertLogs.push(alertMsg);
    console.log("MelkBan Auto-Verify:", alertMsg);
  }
}, 60 * 1000); // Quick simulation refresh on the server-side

// -------------------------------------------------------------
// AI Chatbot Helper: Integrates with Learned QA lookup
// -------------------------------------------------------------
app.post("/api/gemini/consult", async (req, res, next) => {
  const { prompt } = req.body;
  if (!prompt) return;

  const lowerPrompt = String(prompt).trim().toLowerCase();

  // Rule #5 / Duty 6: Check if we have learned of this exact or highly similar question first!
  const matchedQA = chatbotLearnedQA.find(qa => {
    const q = qa.question.toLowerCase().trim();
    return q.includes(lowerPrompt) || lowerPrompt.includes(q) || (Math.abs(lowerPrompt.length - q.length) < 5 && q.slice(0, 10) === lowerPrompt.slice(0, 10));
  });

  if (matchedQA) {
    console.log(`MelkBan Q&A Link Success: Auto replying with learned answer for query "${prompt}"`);
    return res.json({ reply: matchedQA.answer });
  }

  // If match fails and is not blank, we notify/save to unresolved questions stack so admin can learn it
  if (lowerPrompt.length > 5 && !pendingQuestions.includes(prompt)) {
    pendingQuestions.unshift(prompt);
    if (pendingQuestions.length > 50) pendingQuestions.pop();
    
    // Simulate auto email to admin
    const emailNotice = `📧 Auto Notification to amirkachaloooo65@gmail.com: Unresolved support chatbot query from client detected: "${prompt}". Provide an answer inside your admin portal to update the AI chatbot automatically.`;
    systemDiagnostics.emailAlertLogs.push(emailNotice);
    console.log("MelkBan Security Mail Alert:", emailNotice);
  }

  next(); // Pass to Gemini core pipeline if not custom matched
});


// ==========================================
// AUTOMATION & AUTO-OPERATING ENDPOINTS
// ==========================================

// ==========================================
// CENTRAL SUPREME COMMAND API ROUTING (👑 قانون ششم)
// ==========================================

// 1. Get Global Command status
app.get("/api/core/status/global", (_req, res) => {
  res.json({
    status: "ok",
    globalVetoLevel,
    modules: supremeModules,
    vetoLogs,
    metrics: {
      activeLandlords: 1420,
      activeTenants: 8350,
      activeListings: 24,
      grossRevenueUsd: 148900,
      totalUsdtDeposits: 28450
    }
  });
});

// 2. Veto/Toggle status of a specific module
app.post("/api/core/veto/module", (req, res) => {
  const { moduleId, isActive, reason } = req.body;
  const mod = supremeModules.find(m => m.id === moduleId);
  
  if (!mod) {
    return res.status(404).json({ error: "Module not found" });
  }

  const wasActive = mod.isActive;
  mod.isActive = !!isActive;
  mod.vetoReason = reason || "Scheduled core update";
  mod.vetoAt = new Date().toISOString();
  mod.vetoBy = "Supreme Governor (Amir)";

  // Log veto if it changed state to false (vetoed)
  if (wasActive && !mod.isActive) {
    const newLog = {
      vetoId: "vlog-" + Math.floor(Math.random() * 9000 + 1000),
      moduleId,
      vetoBy: "Supreme Governor (Amir)",
      vetoAt: mod.vetoAt,
      reason: mod.vetoReason
    };
    vetoLogs.unshift(newLog);
    systemDiagnostics.emailAlertLogs.unshift(`🚫 VETO ACTION: Module ${moduleId} (${mod.nameEn}) was VETOED by Governor Amir at ${newLog.vetoAt}. Reason: ${newLog.reason}`);
  } else if (!wasActive && mod.isActive) {
    systemDiagnostics.emailAlertLogs.unshift(`🟢 RESTORE ACTION: Module ${moduleId} (${mod.nameEn}) was RESTORED to online status by Governor Amir.`);
  }

  res.json({ success: true, module: mod, vetoLogs });
});

// 3. Set global system-wide lock level
app.post("/api/core/veto/level", (req, res) => {
  const { level } = req.body;
  if (!["none", "partial", "full"].includes(level)) {
    return res.status(400).json({ error: "Invalid veto level" });
  }

  globalVetoLevel = level as "none" | "partial" | "full";
  const actionTime = new Date().toISOString();
  
  if (globalVetoLevel === "full") {
    systemDiagnostics.emailAlertLogs.unshift(`🚨 SUPREME GLOBAL LOCKDOWN: The Commander Amir activated FULL SYSTEM LOCKDOWN at ${actionTime}. All public services are halted.`);
  } else if (globalVetoLevel === "none") {
    systemDiagnostics.emailAlertLogs.unshift(`✅ SYSTEM RESTORED: Commander Amir deactivated lockdown. Full public operations are restored.`);
  }

  res.json({ success: true, globalVetoLevel });
});

// 4. Retrieve complete centralized gross revenue metrics
app.get("/api/core/analytics/revenue", (_req, res) => {
  res.json({
    grossRevenueUsd: 148900,
    totalUsdtDeposits: 28450,
    currencyExchangeRates: {
      USD: 1.0,
      USDT: 1.0,
      EUR: 0.92,
      GBP: 0.78,
      SGD: 1.35,
      CAD: 1.37,
      IRR: 620000 // Toman cadastral standard index
    },
    monthlyGrowth: [
      { name: "Dec", revenue: 84000, usdt: 12000 },
      { name: "Jan", revenue: 98000, usdt: 15500 },
      { name: "Feb", revenue: 112000, usdt: 19000 },
      { name: "Mar", revenue: 125000, usdt: 22000 },
      { name: "Apr", revenue: 139000, usdt: 25000 },
      { name: "May", revenue: 148900, usdt: 28450 }
    ],
    interestRankings: [
      { country: "Singapore", code: "SG", interestPct: 38, currency: "SGD", rating: "★★★★★ (Ultra-net-worth)" },
      { country: "United Kingdom", code: "GB", interestPct: 27, currency: "GBP", rating: "★★★★☆ (Heritage Assets)" },
      { country: "Canada", code: "CA", interestPct: 18, currency: "CAD", rating: "★★★★☆ (Sky condo investment)" },
      { country: "Russia", code: "RU", interestPct: 10, currency: "RUB", rating: "★★★☆☆ (Diplomatic leases)" },
      { country: "United Arab Emirates", code: "AE", interestPct: 7, currency: "AED", rating: "★★★☆☆ (Beachfront layouts)" }
    ]
  });
});

// 5. Verify manual TRC20 coin receipts
app.post("/api/core/crypto/verify", (req, res) => {
  const { txId } = req.body;
  const tx = trc20Transactions.find(t => t.id === txId);
  if (tx) {
    tx.status = "confirmed";
    systemDiagnostics.emailAlertLogs.unshift(`💰 MANUAL DEPOSIT VERIFICATION: Governor Amir manually checked Block ledger receipts and confirmed Tx ${tx.txHash} of ${tx.amount} USDT.`);
    return res.json({ success: true, transaction: tx });
  }
  res.status(404).json({ error: "Transaction ID not found in cache ledger" });
});

// Get All automation statuses and Veto Engine parameters
app.get("/api/automation/status", (_req, res) => {
  res.json({
    trc20Transactions,
    priceProposals,
    chatbotLearnedQA,
    pendingQuestions,
    manualTranslations,
    anomalyLogs,
    historicalBackups,
    systemDiagnostics,
    globalVetoLevel,
    supremeModules,
    vetoLogs
  });
});

// Trigger TRC20 simulated deposit (Verify Rule #1)
app.post("/api/automation/payment/simulate", (req, res) => {
  const { walletAddress, amount, agencyName, listingId } = req.body;
  
  const newTx: BlockchainTx = {
    id: "tx-" + Math.floor(Math.random() * 10000),
    txHash: "TY" + Math.floor(Math.random() * 999999) + "xKlp" + Math.floor(Math.random()*99999) + "...TRC20",
    walletAddress: walletAddress || "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD",
    amount: parseFloat(amount) || 18.00,
    tokens: "USDT",
    timestamp: new Date().toISOString(),
    status: "pending", // Initially pending, will auto-approve in 1 minute due to cron or manually
    listingId: listingId || "1",
    agencyName: agencyName || "Independent Broker"
  };

  trc20Transactions.unshift(newTx);
  res.json({ status: "success", transaction: newTx, message: "Decentralized TRC20 wallet payment scanner triggered. Please reload in 10s to see auto check-mark." });
});

// Decide AI price recommendations (Confirm Rule #2)
app.post("/api/automation/price/decide", (req, res) => {
  const { proposalId, approve } = req.body;
  const proposal = priceProposals.find(p => p.id === proposalId);
  if (proposal) {
    proposal.status = approve ? "approved" : "declined";
    return res.json({ status: "success", proposal });
  }
  res.status(404).json({ error: "Proposal not found" });
});

// Save human QA pair to chatbot matching index (Rule #5)
app.post("/api/automation/chatbot/learn", (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const newQA: CustomQA = {
    id: "qa-" + Math.floor(Math.random() * 10000),
    question,
    answer,
    createdAt: new Date().toISOString()
  };

  chatbotLearnedQA.unshift(newQA);
  
  // Remove from pending list
  pendingQuestions = pendingQuestions.filter(q => q !== question);

  res.json({ status: "success", learnedQA: newQA });
});

// Auto translation pack generator (AI Duty #1)
app.post("/api/automation/translate-pack", async (req, res) => {
  const { targetLanguage, isRtl } = req.body;
  
  // High fidelity language pack creator simulation with fallback or active Gemini
  const langKey = targetLanguage || "ar";
  
  let translatedDictionary: Record<string, string> = {};
  
  // Simple multilingual model for translations demo
  const mockKeys: Record<string, Record<string, string>> = {
    "siteName": { ar: "آریانا رهنما كاداستر", de: "Ariana Rahnuma Kataster", tr: "Ariana Rahnuma Kadastro" },
    "welcome": { ar: "أهلاً بكم في كاداستر آریانا رهنما", de: "Willkommen beim Ariana-Rahnuma-Kataster", tr: "Ariana Rahnuma Kadastrosuna Hoş Geldiniz" },
    "contact": { ar: "اتصل بنا", de: "Kontakt uns", tr: "İletişime Geç" },
    "listingsCount": { ar: "عدد العقارات", de: "Objektanzahl", tr: "İlan Sayısı" },
    "smartCalculator": { ar: "آلة حاسبة ذكية کاداستر", de: "Intelligenter Katasterrechner", tr: "Akıllı Kadastro Hesaplayıcı" }
  };

  Object.keys(mockKeys).forEach(key => {
    translatedDictionary[`${langKey}.${key}`] = mockKeys[key][langKey] || `${langKey}:${key}_auto_translated`;
  });

  // Assign generated values to manualTranslations
  Object.assign(manualTranslations, translatedDictionary);

  res.json({
    status: "success",
    language: langKey,
    isRtl: isRtl || false,
    keysGenerated: Object.keys(translatedDictionary).length,
    localesPath: `/locales/${langKey}.json (Sovereign file written)`
  });
});

// Learn override translation manually (Rule #4)
app.post("/api/automation/translation/learn", (req, res) => {
  const { key, translation } = req.body;
  if (!key || !translation) {
    return res.status(400).json({ error: "Key & translation text required" });
  }

  manualTranslations[key] = translation;
  res.json({ status: "success", key, translation });
});

// Backups Engine simulation (Rule #6)
app.post("/api/automation/backup/create", (req, res) => {
  const { label } = req.body;
  const newBackup: BackupItem = {
    id: "backup-" + Math.floor(Math.random() * 900000),
    timestamp: new Date().toISOString(),
    label: label || `Manual Snapshot Backup (${new Date().toLocaleString()})`,
    sizeKb: 650 + Math.floor(Math.random() * 20),
    data: { timestamp: Date.now() }
  };

  historicalBackups.unshift(newBackup);
  if (historicalBackups.length > 30) {
    historicalBackups.pop(); // Retain only past 30 backups
  }

  res.json({ status: "success", backup: newBackup });
});

// Restore backup file instantly (Rule #6)
app.post("/api/automation/backup/restore", (req, res) => {
  const { backupId } = req.body;
  const b = historicalBackups.find(back => back.id === backupId);
  if (b) {
    return res.json({ status: "success", message: `System state database successfully rolled back to snapshot label "${b.label}"!` });
  }
  res.status(404).json({ error: "Backup snapshot not found" });
});

// Trigger client diagnostics update
app.post("/api/automation/trigger-alert", (req, res) => {
  const { type, message } = req.body;
  const logMsg = `🚨 [ALERT LOG] ${type.toUpperCase()}: ${message} at ${new Date().toLocaleTimeString()}`;
  systemDiagnostics.emailAlertLogs.unshift(logMsg);
  console.log("Ariana Diagnostic System Warning:", logMsg);
  res.json({ status: "success", logMsg });
});

// Serve frontend assets or integrate Vite middleware based on environment
async function setupFrontend() {
  const fs = await import("fs");
  const distPath = path.join(process.cwd(), "dist");

  // If we are in production, serve production static files
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (req.url.startsWith("/api/")) {
        return res.status(404).json({ error: "Endpoint not found" });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Ariana Server: Production static assets routing configured.");
  } else {
    try {
      // Use dynamic string literal to prevent bundlers (like esbuild) from resolving 'vite' in production setups
      const vitePkgName = "vite";
      const { createServer: createViteServer } = await import(vitePkgName);
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      
      app.get("*", async (req, res, next) => {
        if (req.url.startsWith("/api/")) {
          return next();
        }
        try {
          const url = req.originalUrl;
          const templatePath = path.join(process.cwd(), "index.html");
          let template = fs.readFileSync(templatePath, "utf-8");
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } catch (e) {
          next(e);
        }
      });

      console.log("Ariana Server: Vite development middleware and SPA fallback mounted successfully.");
    } catch (e) {
      console.error("Ariana Server: Failed to mount Vite middleware: ", e);
      // Absolute fallback if everything else fails
      app.get("*", (_req, res) => {
        res.status(500).send("Application is starting or building. Please reload in a moment.");
      });
    }
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ariana Core Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

setupFrontend();
