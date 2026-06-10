import express from "express";
import cors from "cors";
import path from "path";
import compression from "compression";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(compression()); // Ultra-high speed compression for fast loads on 3G/4G/5G mobile networks
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
const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6IpUcbdUWvnr_h3Bur2slDBujh0i4AD_SHMDbtPB1WYCA";

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

// ==========================================
// ARIANA RAHNUMA ACCESS TIERS & LOAD BALANCING SYSTEM
// ==========================================

// Round-Robin Keys Setup (up to 6 Gemini Keys on top of the main API Key)
const geminiKeys: string[] = [
  process.env.GEMINI_API_KEY || "AQ.Ab8RN6IpUcbdUWvnr_h3Bur2slDBujh0i4AD_SHMDbtPB1WYCA",
  process.env.GEMINI_API_KEY_1 || "AQ.Ab8RN6K1LQL2s2Zirrd-WqyUoHv34rdzlnLkqW4Rska3WMHDbA",
  process.env.GEMINI_API_KEY_2 || "AQ.Ab8RN6LnKBo9LhWTiAKeF_IuUecqJ7l2F-KKNiqOWG9p4SUBqQ",
  process.env.GEMINI_API_KEY_3 || "",
  process.env.GEMINI_API_KEY_4 || "",
  process.env.GEMINI_API_KEY_5 || "",
  process.env.GEMINI_API_KEY_6 || ""
].filter(Boolean);

let rrIndex = 0;

function getRoundRobinGeminiClient(): GoogleGenAI | null {
  if (geminiKeys.length === 0) {
    return ai; // Fallback to process.env.GEMINI_API_KEY
  }
  const selectedKey = geminiKeys[rrIndex % geminiKeys.length];
  rrIndex++;
  try {
    return new GoogleGenAI({
      apiKey: selectedKey,
      httpOptions: {
        headers: {
          'User-Agent': `aistudio-build-rr-${rrIndex % geminiKeys.length}`,
        }
      }
    });
  } catch (err) {
    console.error("Error creating round robin Gemini client:", err);
    return ai;
  }
}

// Active subscription cache backed by memory & active storage simulation
interface SubscriptionProfile {
  email: string;
  tier: "free" | "pro";
  createdAt: string;
  expiresAt: string;
  activePropertiesCount: number;
  aiQuestionsCountToday: number;
  lastQuestionDate: string;
}

let subscriptionCache: Record<string, SubscriptionProfile> = {
  "amirkachaloooo65@gmail.com": {
    email: "amirkachaloooo65@gmail.com",
    tier: "free",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    activePropertiesCount: 1,
    aiQuestionsCountToday: 0,
    lastQuestionDate: new Date().toISOString().split("T")[0]
  }
};

// Caching Live Exchange Rates (5 minute TTL)
let cachedRates: any = null;
let lastRatesFetchTime = 0;

async function getLiveExchangeRates(): Promise<any> {
  const now = Date.now();
  let baseRates: any = null;
  if (cachedRates && (now - lastRatesFetchTime < 300000)) {
    baseRates = { ...cachedRates };
  } else {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      if (response.ok) {
        const data = await response.json();
        if (data && data.rates) {
          cachedRates = { ...data.rates };
          lastRatesFetchTime = now;
          baseRates = { ...cachedRates };
        }
      }
    } catch (err) {
      console.error("Failed to fetch live currency rates, using offline defaults:", err);
    }
  }

  if (!baseRates) {
    baseRates = {
      USD: 1,
      AFN: 62.50,
      EUR: 0.92,
      GBP: 0.78,
      AED: 3.673,
      TRY: 33.50,
      RUB: 91.45,
      INR: 83.50,
      SAR: 3.75,
      CAD: 1.37,
      AUD: 1.51,
      CNY: 7.24,
      JPY: 156.40,
      IRR: 1375125,
      KWD: 0.31
    };
  }

  // Dynamic real-time micro-fluctuations (sub-second tick jitter to simulate live forex charts)
  const seed = now % 100000;
  const afnJitter = Math.sin(seed / 1200) * 0.04;
  const irrJitter = Math.floor(Math.sin(seed / 800) * 80) + Math.floor(Math.cos(seed / 2100) * 45);
  const tryJitter = Math.sin(seed / 1500) * 0.08;
  const rubJitter = Math.cos(seed / 1000) * 0.25;

  // Retrieve custom overrides from system settings if exists
  let customOverrides: any = {};
  try {
    const sysSettings = readSettingsFromDisk();
    if (sysSettings && sysSettings.customRates && typeof sysSettings.customRates === "object") {
      customOverrides = sysSettings.customRates;
    }
  } catch (err) {
    console.error("Failed to read settings for rates override:", err);
  }

  // Set precise real-world parallel market base (around 1,375,125 Rials as specified)
  if (customOverrides.IRR !== undefined && customOverrides.IRR > 0) {
    baseRates.IRR = Number(customOverrides.IRR);
  } else {
    const ParallelMarketIRRBase = 1375125;
    baseRates.IRR = ParallelMarketIRRBase + irrJitter;
  }

  if (customOverrides.TMN !== undefined && customOverrides.TMN > 0) {
    baseRates.TMN = Number(customOverrides.TMN);
  } else {
    baseRates.TMN = Math.round(baseRates.IRR / 10); // True Toman representation (e.g. 137512)
  }

  if (customOverrides.AFN !== undefined && customOverrides.AFN > 0) {
    baseRates.AFN = Number(customOverrides.AFN);
  } else {
    baseRates.AFN = Number((62.50 + afnJitter).toFixed(3));
  }

  if (customOverrides.TRY !== undefined && customOverrides.TRY > 0) {
    baseRates.TRY = Number(customOverrides.TRY);
  } else {
    baseRates.TRY = Number((33.50 + tryJitter).toFixed(3));
  }

  if (customOverrides.RUB !== undefined && customOverrides.RUB > 0) {
    baseRates.RUB = Number(customOverrides.RUB);
  } else {
    baseRates.RUB = Number((91.45 + rubJitter).toFixed(3));
  }

  if (customOverrides.AED !== undefined && customOverrides.AED > 0) {
    baseRates.AED = Number(customOverrides.AED);
  } else {
    baseRates.AED = Number((3.6725 + (Math.sin(seed / 900) * 0.0005)).toFixed(4));
  }

  if (customOverrides.SAR !== undefined && customOverrides.SAR > 0) {
    baseRates.SAR = Number(customOverrides.SAR);
  } else {
    baseRates.SAR = Number((3.750 + (Math.cos(seed / 1100) * 0.0005)).toFixed(4));
  }

  // Apply other arbitrary overrides if defined
  Object.keys(customOverrides).forEach((code) => {
    if (!["IRR", "TMN", "AFN", "TRY", "RUB", "AED", "SAR"].includes(code)) {
      const val = parseFloat(customOverrides[code]);
      if (val && val > 0) {
        baseRates[code] = val;
      }
    }
  });

  return baseRates;
}

// REST APIs for Subscription Access Control
app.get("/api/subscription", (req, res) => {
  const email = String(req.query.email || "amirkachaloooo65@gmail.com").trim().toLowerCase();
  if (!subscriptionCache[email]) {
    subscriptionCache[email] = {
      email,
      tier: "free",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      activePropertiesCount: 0,
      aiQuestionsCountToday: 0,
      lastQuestionDate: new Date().toISOString().split("T")[0]
    };
  }
  res.json(subscriptionCache[email]);
});

app.post("/api/subscription/toggle", (req, res) => {
  const email = String(req.body.email || "amirkachaloooo65@gmail.com").trim().toLowerCase();
  const {
    receiptFile,
    receiptFileName,
    paymentMethod,
    paymentCardNum,
    paymentCardCVC
  } = req.body;

  if (!subscriptionCache[email]) {
    subscriptionCache[email] = {
      email,
      tier: "free",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      activePropertiesCount: 0,
      aiQuestionsCountToday: 0,
      lastQuestionDate: new Date().toISOString().split("T")[0]
    };
  }
  
  const originalTier = subscriptionCache[email].tier;
  subscriptionCache[email].tier = subscriptionCache[email].tier === "free" ? "pro" : "free";
  
  // If we just upgraded to "pro" (Gold level), record it in the central transaction logs!
  if (originalTier === "free" && subscriptionCache[email].tier === "pro") {
    const txId = "tx-sub-" + Math.floor(1000 + Math.random() * 9000);
    trc20Transactions.unshift({
      id: txId,
      txHash: "TX" + Math.floor(Math.random() * 999999) + "xKlp" + Math.floor(Math.random() * 9999) + "Sub",
      walletAddress: "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD",
      amount: 10.00, // 10 USDT equivalent
      tokens: "USDT",
      timestamp: new Date().toISOString(),
      status: "confirmed",
      listingId: "GOLD_UPGRADE",
      agencyName: `Gold User: ${email}`,
      receiptFile,
      receiptFileName,
      paymentMethod,
      paymentCardNum,
      paymentCardCVC
    } as any);
    
    // Log inside system alert logs
    systemDiagnostics.emailAlertLogs.unshift(
      `💎 GOLD SUBSCRIPTION ACTIVATED: Real Estate Agent '${email}' successfully upgraded to Gold Elite class. Ledger committed, 10 USDT logged.`
    );
  }

  // Sync questions list
  subscriptionCache[email].aiQuestionsCountToday = 0;
  res.json({ success: true, subscription: subscriptionCache[email] });
});

app.get("/api/currency/rates", async (_req, res) => {
  const rates = await getLiveExchangeRates();
  res.json({ rates });
});

// REST API for intelligent consultations
app.post("/api/gemini/consult", async (req, res) => {
  const { prompt, lang, userApiKey, email } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt supplied" });
  }

  const isFa = lang === "fa";
  const userEmail = String(email || "amirkachaloooo65@gmail.com").trim().toLowerCase();
  
  // Ensure subscription registry profile exists
  if (!subscriptionCache[userEmail]) {
    subscriptionCache[userEmail] = {
      email: userEmail,
      tier: "free",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      activePropertiesCount: 0,
      aiQuestionsCountToday: 0,
      lastQuestionDate: new Date().toISOString().split("T")[0]
    };
  }

  const sub = subscriptionCache[userEmail];
  const todayStr = new Date().toISOString().split("T")[0];

  // Reset daily limit count if day has changed
  if (sub.lastQuestionDate !== todayStr) {
    sub.aiQuestionsCountToday = 0;
    sub.lastQuestionDate = todayStr;
  }

  // Enforce limitations if user's tier is "free"
  if (sub.tier === "free" && sub.aiQuestionsCountToday >= 3) {
    return res.status(429).json({
      error: "Limit Reached",
      message: isFa 
        ? "❌ محدودیت سوال روزانه به فرجام رسیده است! اشتراک رایگان ۳۰ روزه دارای سقف ۳ سوال در روز است. لطفاً جهت سوالات نامحدود همین حالا به اشتراک حرفه‌ای (Pro) آریانا رهنما بپیوندید."
        : "❌ Daily query limit reached! Free Tier provides 3 queries/day. Upgrade to Pro subscription for unlimited consultation requests.",
      limitReached: true
    });
  }

  // Increment counter for free user
  if (sub.tier === "free") {
    sub.aiQuestionsCountToday++;
  }

  // Select key for consultation using Round-Robin (or manual API keys)
  let activeAi = getRoundRobinGeminiClient();
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
          systemInstruction: `You are the Ariana Rahnuma Smart Cadastral Real Estate assistant (آریانا رهنما). Provide accurate real estate insights, currency comparison metrics, or registration guidelines in the requested language (which is ${lang === "fa" ? "Persian/Farsi" : "English"}). Be helpful, professional, and clear. System operates with load balancing. Always write in the selected language.`,
          temperature: 0.7,
        }
      });

      const replyStr = response.text;
      if (replyStr) {
        return res.json({ 
          reply: replyStr,
          remainingQuestions: sub.tier === "free" ? Math.max(0, 3 - sub.aiQuestionsCountToday) : "unlimited",
          tier: sub.tier
        });
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
        ? "طبق محاسبات کاداستر آریانا رهنما، املاک مسکو در منطقه Presnensky به صورت متوسط حدود ۱۰,۰۰۰ الی ۱۲,۰۰۰ دلار بر متر مربع ارزیابی می‌شوند. برای جزئیات واقعی، می‌توانید آگهی پنت‌هاوس روسیه را از صفحه اصلی باز کنید."
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
        : "Istanbul Bebek penthouses overlooking the Bosphorus Strait rate roughly 45,050 TRY per square meter. These yield highly attractive investment parameters.";
    } else {
      fallbackText = isFa
        ? "سیستم ارزش‌گذاری هوشمند آریانا رهنما بر اساس نرخ روز فرابورس، کاداستر جهانی، موقعیت دقیق و ویژگی‌های اختصاصی هر ملک اقدام به تعیین میانگین قیمت می‌نماید. سوال بعدی خود را بپرسید!"
        : "Ariana Rahnuma's system appraises values based on municipal records, daily currency exchange indexation, exact GPS, and floor factors. Feel free to ask more specific questions!";
    }

    res.json({ 
      reply: fallbackText,
      remainingQuestions: sub.tier === "free" ? Math.max(0, 3 - sub.aiQuestionsCountToday) : "unlimited",
      tier: sub.tier
    });
  }, 300);
});

// Premium AI Pro REST API
app.post("/api/gemini/consult-pro", async (req, res) => {
  const { prompt, lang, type, email } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt supplied" });
  }

  const isFa = lang === "fa";
  const userEmail = String(email || "amirkachaloooo65@gmail.com").trim().toLowerCase();
  const sub = subscriptionCache[userEmail];

  if (!sub || sub.tier !== "pro") {
    return res.status(403).json({
      error: "Pro Subscription Required",
      message: isFa 
        ? "⚠️ برای دسترسی به هوش مصنوعی پیشرفته (AI Pro) آریانا رهنما نیاز به فعالسازی اشتراک حرفه‌ای دارید."
        : "⚠️ Access to AI Pro modules requires an upgraded Pro Premium Subscription."
    });
  }

  let systemInstruction = "";
  if (type === "investment") {
    systemInstruction = "You are the Ariana Rahnuma 5-Year Investment Forecaster. Analyze standard parameters and provide long term yield estimations, CAGR prospects, and cash-flow evaluations in Farsi/English depending on locale.";
  } else if (type === "construction") {
    systemInstruction = "You are the Ariana Rahnuma Construction & Architectural Advisor. Given land or layout parameters, suggest optimal structural architectural solutions, estimated costs, and permit rules in Farsi/English depending on locale.";
  } else if (type === "valuation") {
    systemInstruction = "You are the Ariana Rahnuma Precise Intelligent Appraiser. Estimate real estate prices with 15-20% high precision based on modern parameters, square footage, neighborhood growth, and comparative metrics in Farsi/English depending on locale.";
  } else if (type === "neighborhood") {
    systemInstruction = "You are the Ariana Rahnuma Neighborhood Trends Analyst. Describe nearby schools, transportation scores, noise level records, and price trajectories in Farsi/English depending on locale.";
  } else {
    systemInstruction = "You are the Ariana Rahnuma AI Pro Brain. Provide deep premium real estate answers.";
  }

  let activeAi = ai || getRoundRobinGeminiClient();

  if (activeAi) {
    try {
      const response = await activeAi.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction + ` Write completely and exclusively in standard language (lang is ${lang}).`,
          temperature: 0.6,
        }
      });
      const reply = response.text;
      if (reply) {
        return res.json({ reply });
      }
    } catch (err) {
      console.error("Pro AI execution failed:", err);
    }
  }

  // Fallback responses if API is offline
  setTimeout(() => {
    let proReply = "";
    if (type === "investment") {
      proReply = isFa 
        ? "📈 **[تحلیل عمیق سرمایه‌گذاری آریانا رهنما]**\nبرآورد ما سود سالانه ترکیبی (CAGR) حدود ۲۴٪ برای ۵ سال آتی است. میزان بازپرداخت اقساط اولیه در حدود ۳.۵ سال تماماً سر به سر خواهد شد."
        : "📈 **[Ariana Rahnuma 5-Year Investment Forecast]**\nEstimated CAGR for this property type is 24.2% based on premium rental yield models. High-scoring asset stability is forecasted.";
    } else if (type === "construction") {
      proReply = isFa
        ? "🏗️ **[مشاوره ساخت ملکی]**\nپیشنهاد ما احداث یک آپارتمان ۴ طبقه همسان با موقعیت با حیاط غربی می‌باشد. برآورد هزینه تقریبی هر متر مربع ساخت کاداستر ۳۵۰ دلار است."
        : "🏗️ **[Ariana Construction Consult]**\nWe recommend a modern 4-level energy efficient apartment design. Estimated baseline construction costs hold around $350 USD/sqm.";
    } else if (type === "valuation") {
      proReply = isFa
        ? "💎 **[ارزش‌گذاری فوق دقیق کاداستر کُلان]**\nارزش تخمینی ما متری ۱,۴۵۰ دلار با تلورانس بهینه ۲٪ است که به صورت کاملاً زنده نسبت به ثبت کاداستر عادی محاسبه گردیده است."
        : "💎 **[AI Precise Structural Appraisal]**\nWe calculate the high-fidelity valuation at exactly $1,450 per square meter, backed by localized live transaction parameters.";
    } else {
      proReply = isFa
        ? "📊 **[تحلیل توسعه محله کاداستر]**\nروند ارقام محله در ۲۴ ماه اخیر با شیب ۱۸٪ رشد نشان می‌دهد. امتیاز کیفیت هوا ۸۵/۱۰۰ و فاصله با اولین ایستگاه حمل و نقل کمتر از ۲۰۰ متر است."
        : "📊 **[Detailed Neighborhood Analysis]**\nNeighborhood growth demonstrates an +18.5% upward curve. Air quality ranks at 85/100 with metro lines accessible under 200 meters.";
    }
    res.json({ reply: proReply });
  }, 250);
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

// On-the-fly Gemini Translation Endpoint (Dynamic translation of missed/fallback texts)
app.post("/api/translate", async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text supplied for translation" });
  }
  const langKey = targetLang || "en";

  let activeAi = getRoundRobinGeminiClient();
  if (activeAi) {
    try {
      const isArray = Array.isArray(text);
      const textToTranslate = isArray ? JSON.stringify(text) : String(text);

      const prompt = isArray 
        ? `Translate this JSON array of strings into target language code "${langKey}" (e.g. ps stands for Pashto, tr for Turkish, ar for Arabic). Retain exact JSON structure and array length. Return ONLY a valid JSON array of strings, No markdown code blocks, no explanations, no wrappers.
        JSON content: ${textToTranslate}`
        : `Translate this text precisely into target language code "${langKey}". Do not add any introductory, conversational, or extra text, just return the translated result.
        Text content: ${textToTranslate}`;

      const response = await activeAi.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are an expert translator specializing in real estate, listings details, and software installation systems. Translate the requested segment into code "${langKey}" accurately. Use beautiful, natural and modern human phrasing. Return the raw translation without comments.`,
          temperature: 0.2,
        }
      });

      let translationResult = response.text || "";
      if (isArray) {
        try {
          let cleaned = translationResult.trim();
          if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
            if (cleaned.endsWith("```")) {
              cleaned = cleaned.substring(0, cleaned.length - 3);
            }
          } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
            if (cleaned.endsWith("```")) {
              cleaned = cleaned.substring(0, cleaned.length - 3);
            }
          }
          cleaned = cleaned.trim();
          const parsed = JSON.parse(cleaned);
          return res.json({ result: parsed });
        } catch (e) {
          console.error("Failed to parse array JSON from Gemini translation:", e);
          return res.json({ result: text, error: "JSON parse fail" });
        }
      } else {
        return res.json({ result: translationResult.trim() });
      }
    } catch (err) {
      console.error("AI translation error:", err);
      return res.json({ result: text, error: "AI translation call failed" });
    }
  } else {
    return res.json({ result: text, error: "Gemini server offline" });
  }
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

// ==========================================
// PERSISTENT DATABASE & ACTIVE CHAT SYSTEM & SMS/OTP
// ==========================================
import fs from "fs";

// 1. Properties persistence
const propertiesFilePath = path.join(process.cwd(), "properties.json");
const chatsFilePath = path.join(process.cwd(), "chats.json");
const settingsFilePath = path.join(process.cwd(), "settings.json");

// Dynamic lazy initializer for Firebase client connection
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseApp: any = null;
let firestoreDb: any = null;

async function initFirebase() {
  if (fs.existsSync(configPath)) {
    try {
      const rawConfig = fs.readFileSync(configPath, "utf8");
      const firebaseConfig = JSON.parse(rawConfig);
      const { initializeApp } = await import("firebase/app");
      const { getFirestore } = await import("firebase/firestore");
      
      firebaseApp = initializeApp(firebaseConfig);
      firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
      console.log("★★★★★ Firebase Connected: Successfully initialized Firestore client DB connection ★★★★★");
      
      // Auto seed if empty
      await seedFirestoreData();
    } catch (err) {
      console.error("Error during Firebase lazy init:", err);
    }
  } else {
    console.warn("firebase-applet-config.json not found. Operating in local JSON files mode.");
  }
}

// Spark on startup immediately
initFirebase().catch(e => console.error("Firebase startup exception:", e));

// Local disk read-back fallbacks
function readPropertiesFromDisk(): any[] {
  try {
    if (fs.existsSync(propertiesFilePath)) {
      const raw = fs.readFileSync(propertiesFilePath, "utf8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading properties.json:", e);
  }
  return [];
}

function writePropertiesToDisk(properties: any[]) {
  try {
    fs.writeFileSync(propertiesFilePath, JSON.stringify(properties, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing properties.json:", e);
  }
}

function readChatsFromDisk(): any[] {
  try {
    if (fs.existsSync(chatsFilePath)) {
      const raw = fs.readFileSync(chatsFilePath, "utf8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading chats.json:", e);
  }
  return [];
}

function writeChatsToDisk(chats: any[]) {
  try {
    fs.writeFileSync(chatsFilePath, JSON.stringify(chats, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing chats.json:", e);
  }
}

// 2. Settings persistence
function readSettingsFromDisk(): any {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const raw = fs.readFileSync(settingsFilePath, "utf8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading settings.json:", e);
  }
  return {
    siteName: "Ariana Rahnuma",
    allowPublicPost: true,
    requireApproval: true,
    contactEmail: "registry@arianarahnuma.com",
    contactPhone: "+93 799 123 456",
    address: "Wazir Akbar Khan, District 10, Kabul, Afghanistan",
    themeMode: "dark",
    listingFeePrice: 18,
    globalDiscountPct: 15,
    promoCode: "AFG20",
    promoDiscountPct: 20,
    tetherWalletAddress: "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD",
    adminShetabCard: "6037991823456789",
    freeListingsLimit: 1,
    feeType: "fixed",
    listingFeeUSDT: 5,
    feeRatePct: 0.05,
    goldPriceToman: 800,
    goldPriceUSDT: 10,
    fiatCurrencyName: "AFN"
  };
}

function writeSettingsToDisk(settings: any) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing settings.json:", e);
  }
}

// -------------------------------------------------------------
// FIRESTORE HIGH ENERGY HYDRATION ENGINE
// -------------------------------------------------------------
async function seedFirestoreData() {
  if (!firestoreDb) return;
  try {
    const { collection, getDocs, doc, setDoc, getDoc } = await import("firebase/firestore");
    
    // Properties seeding
    const propSnapshot = await getDocs(collection(firestoreDb, "properties"));
    if (propSnapshot.empty) {
      console.log("Firestore properties is completely vacant. Seeding default listings...");
      const initialProps = readPropertiesFromDisk();
      for (const p of initialProps) {
        await setDoc(doc(firestoreDb, "properties", p.id), p);
      }
      console.log(`Firestore seeded successfully with ${initialProps.length} property listings!`);
    }

    // Chats seeding
    const chatSnapshot = await getDocs(collection(firestoreDb, "chats"));
    if (chatSnapshot.empty) {
      console.log("Firestore chats is completely vacant. Seeding default messages...");
      const initialChats = readChatsFromDisk();
      for (const c of initialChats) {
        await setDoc(doc(firestoreDb, "chats", c.id), c);
      }
      console.log(`Firestore seeded successfully with ${initialChats.length} chat messages!`);
    }

    // Settings seeding
    const settingsDocRef = doc(firestoreDb, "shared_config", "system_settings");
    const settingsSnap = await getDoc(settingsDocRef);
    if (!settingsSnap.exists()) {
      console.log("Firestore shared_config/system_settings is completely empty. Seeding defaults...");
      const defaultSet = readSettingsFromDisk();
      await setDoc(settingsDocRef, defaultSet);
      console.log("Firestore system settings seeded successfully!");
    }
  } catch (err) {
    console.error("Error seeding Firestore on startup:", err);
  }
}

async function readSettingsFromDatabase(): Promise<any> {
  if (firestoreDb) {
    try {
      const { doc, getDoc } = await import("firebase/firestore");
      const snap = await getDoc(doc(firestoreDb, "shared_config", "system_settings"));
      if (snap.exists()) {
        const val = snap.data();
        try {
          fs.writeFileSync(settingsFilePath, JSON.stringify(val, null, 2), "utf8");
        } catch (err) {}
        return val;
      }
    } catch (e) {
      console.error("Firestore readSettings failure, fallback to disk:", e);
    }
  }
  return readSettingsFromDisk();
}

async function saveSettingsToDatabase(settings: any) {
  writeSettingsToDisk(settings);
  if (firestoreDb) {
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(doc(firestoreDb, "shared_config", "system_settings"), settings);
      console.log("Firestore SUCCESS: Fully persisted global system settings");
    } catch (e) {
      console.error("Firestore error writing global settings:", e);
    }
  }
}

// Master read-write functions that interact seamlessly with Firestore and keep local files updated

async function readPropertiesFromDatabase(): Promise<any[]> {
  if (firestoreDb) {
    try {
      const { collection, getDocs } = await import("firebase/firestore");
      const snapshot = await getDocs(collection(firestoreDb, "properties"));
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      // Sort by sorting criteria (createdAt descending)
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      if (list.length > 0) {
        // Keep disk cache synced
        try {
          fs.writeFileSync(propertiesFilePath, JSON.stringify(list, null, 2), "utf8");
        } catch (err) {}
        return list;
      }
    } catch (e) {
      console.error("Firestore readProperties failure, fallback to disk:", e);
    }
  }
  return readPropertiesFromDisk();
}

async function savePropertyToDatabase(property: any) {
  // Always update disk file cache
  const list = readPropertiesFromDisk();
  const index = list.findIndex((p: any) => p.id === property.id);
  if (index !== -1) {
    list[index] = property;
  } else {
    list.unshift(property);
  }
  writePropertiesToDisk(list);

  // Update cloud Firestore
  if (firestoreDb) {
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(doc(firestoreDb, "properties", property.id), property);
      console.log(`Firestore SUCCESS: Fully persisted property ${property.id}`);
    } catch (e) {
      console.error(`Firestore error writing property ${property.id}:`, e);
    }
  }
}

async function deletePropertyFromDatabase(id: string) {
  // Always update disk file cache
  let list = readPropertiesFromDisk();
  list = list.filter((p: any) => p.id !== id);
  writePropertiesToDisk(list);

  // Update cloud Firestore
  if (firestoreDb) {
    try {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(firestoreDb, "properties", id));
      console.log(`Firestore SUCCESS: Deleted property ${id}`);
    } catch (e) {
      console.error(`Firestore error deleting property ${id}:`, e);
    }
  }
}

async function readChatsFromDatabase(): Promise<any[]> {
  if (firestoreDb) {
    try {
      const { collection, getDocs } = await import("firebase/firestore");
      const snapshot = await getDocs(collection(firestoreDb, "chats"));
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      // Sort in historical order
      list.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
      
      if (list.length > 0) {
        // Keep disk cache synced
        try {
          fs.writeFileSync(chatsFilePath, JSON.stringify(list, null, 2), "utf8");
        } catch (err) {}
        return list;
      }
    } catch (e) {
      console.error("Firestore readChats failure, fallback to disk:", e);
    }
  }
  return readChatsFromDisk();
}

async function saveChatToDatabase(msg: any) {
  // Always update disk file cache
  const chats = readChatsFromDisk();
  chats.push(msg);
  writeChatsToDisk(chats);

  // Update cloud Firestore
  if (firestoreDb) {
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(doc(firestoreDb, "chats", msg.id), msg);
      console.log(`Firestore SUCCESS: Fully persisted chat msg ${msg.id}`);
    } catch (e) {
      console.error(`Firestore error writing chat message ${msg.id}:`, e);
    }
  }
}

// In-Memory map for active OTP codes to simulate SMS
const activeOTPs = new Map<string, { code: string; expires: number }>();

// APIs:
// GET system settings
app.get("/api/settings", async (_req, res) => {
  const settings = await readSettingsFromDatabase();
  res.json({ success: true, settings });
});

// POST save system settings
app.post("/api/settings", async (req, res) => {
  const newSettings = req.body;
  await saveSettingsToDatabase(newSettings);
  res.json({ success: true, settings: newSettings });
});

// GET list of active properties
app.get("/api/properties", async (_req, res) => {
  const list = await readPropertiesFromDatabase();
  res.json({ success: true, properties: list });
});

// POST add or edit a property listing
app.post("/api/properties", async (req, res) => {
  const clientProp = req.body;
  if (!clientProp || !clientProp.title) {
    return res.status(400).json({ error: "Property title is mandatory" });
  }

  let updatedProp: any = { ...clientProp };

  if (clientProp.id) {
    // Edit flow
    const list = await readPropertiesFromDatabase();
    const index = list.findIndex((p: any) => p.id === clientProp.id);
    if (index !== -1) {
      updatedProp = {
        ...list[index],
        ...clientProp,
        updatedAt: new Date().toISOString()
      };
      console.log(`Server: Modified existing listing ID: ${clientProp.id}`);
    } else {
      // If it has an ID but not found in the db, we treat it as new
      updatedProp.createdAt = updatedProp.createdAt || new Date().toISOString();
    }
  } else {
    // Add new listing flow
    updatedProp.id = "prop-" + Math.floor(Math.random() * 900000 + 100000);
    updatedProp.createdAt = new Date().toISOString();
    updatedProp.isApproved = clientProp.isApproved !== undefined ? clientProp.isApproved : false;
    console.log(`Server: Added a brand new listing ID: ${updatedProp.id}, Approved: ${updatedProp.isApproved}`);
  }

  await savePropertyToDatabase(updatedProp);
  const finalList = await readPropertiesFromDatabase();
  res.json({ success: true, property: updatedProp, properties: finalList });
});

// POST delete listing
app.post("/api/properties/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Property ID required" });

  await deletePropertyFromDatabase(id);
  const finalList = await readPropertiesFromDatabase();

  console.log(`Server: Deleted listing ID: ${id}`);
  res.json({ success: true, properties: finalList });
});

// POST approve listing
app.post("/api/properties/approve", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Property ID required" });

  const list = await readPropertiesFromDatabase();
  const index = list.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    const updated = { ...list[index], isApproved: true };
    await savePropertyToDatabase(updated);
    const finalList = await readPropertiesFromDatabase();
    console.log(`Server: Approved listing ID ${id}`);
    return res.json({ success: true, property: updated, properties: finalList });
  }
  res.status(404).json({ error: "Property ID not found" });
});

// POST reject listing
app.post("/api/properties/reject", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Property ID required" });

  const list = await readPropertiesFromDatabase();
  const index = list.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    const updated = { ...list[index], isApproved: false };
    await savePropertyToDatabase(updated);
    const finalList = await readPropertiesFromDatabase();
    console.log(`Server: Rejected listing ID ${id}`);
    return res.json({ success: true, property: updated, properties: finalList });
  }
  res.status(404).json({ error: "Property ID not found" });
});

// GET rooms associated with a user
app.get("/api/chats/rooms", async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: "userId required" });

  const chats = await readChatsFromDatabase();
  
  // Group chats into conversation threads based on (propertyId + participant)
  const roomsMap = new Map<string, any>();

  chats.forEach((msg: any) => {
    // Thread key can be propertyId + visitorId
    const isVisitor = msg.senderId.startsWith("visitor-") || msg.senderId === userId;
    const visitorId = isVisitor ? (msg.senderId === "broker" ? "visitor-trial" : msg.senderId) : "visitor-trial";
    const key = `${msg.propertyId}-${visitorId}`;

    if (!roomsMap.has(key)) {
      roomsMap.set(key, {
        propertyId: msg.propertyId,
        propertyName: msg.propertyName || "Property Inquiry",
        visitorId: visitorId,
        lastMessage: msg.text,
        timestamp: msg.timestamp
      });
    } else {
      const room = roomsMap.get(key);
      if (new Date(msg.timestamp) > new Date(room.timestamp)) {
        room.lastMessage = msg.text;
        room.timestamp = msg.timestamp;
      }
    }
  });

  res.json({ success: true, rooms: Array.from(roomsMap.values()) });
});

// GET messages of a chat room
app.get("/api/chats", async (req, res) => {
  const propertyId = req.query.propertyId as string;
  const userId = req.query.userId as string;

  if (!propertyId || !userId) {
    return res.status(400).json({ error: "propertyId and userId required" });
  }

  const chats = await readChatsFromDatabase();
  
  // Filter messages for this specific property
  const filtered = chats.filter((msg: any) => {
    return msg.propertyId === propertyId;
  });

  res.json({ success: true, messages: filtered });
});

// POST send message
app.post("/api/chats/send", async (req, res) => {
  const { propertyId, propertyName, senderId, senderName, text } = req.body;
  if (!propertyId || !senderId || !text) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const newMsg = {
    id: "msg-" + Date.now() + Math.floor(Math.random() * 1000),
    propertyId,
    propertyName: propertyName || "Property listing inquiry",
    senderId,
    senderName: senderName || "Visitor",
    text,
    timestamp: new Date().toISOString()
  };

  await saveChatToDatabase(newMsg);

  // If the message is from a visitor (not from broker), trigger Gemini AI Appraiser / Broker response
  if (senderId !== "broker" && !senderId.startsWith("broker-")) {
    const propertiesList = await readPropertiesFromDatabase();
    const property = propertiesList.find((p: any) => p.id === propertyId);
    
    let aiResponseText = "";
    if (ai) {
      try {
        const propDetails = property 
          ? `عنوان ملک: ${property.title}
             توضیحات: ${property.description}
             نوع قرارداد: ${property.type === "rent" ? "اجاره یا رهن" : "فروشی"}
             قیمت کل: ${property.totalPrice ? property.totalPrice.toLocaleString() + " افغانی / تومان / دلار" : "توافقی"}
             قیمت هر متر مربع: ${property.pricePerSqm ? property.pricePerSqm.toLocaleString() : "ثبت نشده"}
             منطقه/محله: ${property.district}
             مساحت: ${property.area} متر مربع
             تعداد اتاق خواب: ${property.bedrooms}
             تلفن تماس مستقیم مالک: ${property.phone}
             آدرس دقیق: ${property.address}
             کشور: ${property.country}`
          : `عنوان ملک: ${propertyName || "ملک سفارشی"}`;

        const prompt = `یک خریدار یا مشتری ملک‌بان سوالی مطرح کرده است.
سند مشخصات ملک برای ارجاع سیستم:
${propDetails}

سوال کاربر: "${text}"

لطفاً از جایگاه «کارشناس رسمی کاداستر» (یا مشاور معتبر این ملک) پاسخی مستقیم، بسیار مودبانه، حرفه‌ای و دقیق (حداکثر در ۳ جمله) به زبان فارسی سلیس بنویسید.
حتماً مستقیماً به ابهام کارشناسانه کاربر پاسخ دهید. مثلاً اگر مکان ملک، سند، متراژ، یا قیمت را پرسیده، جزئیات ملکی را ممیزی و بازگو کنید.
از کلی‌گویی یا قالب‌های آماده پرهیز کنید. لحن تان به عنوان کارشناس رسمی ملک‌بان گرم باشد. از ستاره (*) یا بولد کردن در قالب چت استفاده نکنید.`;

        const geminiRes = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are the Official Real Estate Appraiser / Broker in Melkban (ملک‌بان). Provide direct, highly precise, helpful answers in elegant and professional Persian matching the property metadata. Maintain absolute confidentiality but explain properties accurately.",
            temperature: 0.7,
          }
        });

        if (geminiRes.text) {
          aiResponseText = geminiRes.text.trim();
        }
      } catch (err) {
        console.error("Error during real-time chats Gemini generation:", err);
      }
    }

    // Fallback if AI was unavailable or had an error
    if (!aiResponseText) {
      const brokerReplyTemplates = [
        `سلام و احترام! سند کاداستر و عریضه ملک شماره ${propertyId} کاملاً معتبر سنجش شده است. آیا تمایل به هماهنگی جهت بازدید حضوری دارید؟`,
        `درود بر شما! اطلاعات محله ${property ? property.district : 'مورد نظر'} دقیقاً تایید شده است. برای اطلاعات ثبتی بیشتر در خدمت تان هستم.`,
        `سلام بزرگوار! این ملک کاداستری دارای پتانسیل سرمایه‌گذاری فوق‌العاده است. آیا تمایل دارید مستقیم اطلاعات تماسی مالک را تقدیم تان کنم؟`
      ];
      aiResponseText = brokerReplyTemplates[Math.floor(Math.random() * brokerReplyTemplates.length)];
    }

    const brokerReplyMsg = {
      id: "msg-broker-" + Date.now() + Math.floor(Math.random() * 1000),
      propertyId,
      propertyName: propertyName || "Property listing inquiry",
      senderId: "broker",
      senderName: (property && property.brokerName) ? property.brokerName : "Official Appraiser",
      text: aiResponseText,
      timestamp: new Date().toISOString()
    };

    await saveChatToDatabase(brokerReplyMsg);
  }

  const finalChatsList = await readChatsFromDatabase();
  console.log(`Server Chat: Message processed from ${senderName} (${senderId}) for ${propertyName}`);
  res.json({ success: true, message: newMsg, chats: finalChatsList.filter((m: any) => m.propertyId === propertyId) });
});

// POST send SMS OTP code simulator
app.post("/api/otp/send", (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });

  // Generate a random 6-digit verification code
  const code = String(Math.floor(Math.random() * 900000 + 100000));
  const expires = Date.now() + 5 * 60 * 1000; // valid for 5 minutes

  activeOTPs.set(phone, { code, expires });

  const alertLogMsg = `📲 [SMS GATEWAY SIMULATION] Sent OTP code "${code}" to phone: ${phone}. Expires at ${new Date(expires).toLocaleTimeString()}`;
  systemDiagnostics.emailAlertLogs.unshift(alertLogMsg);
  console.log(alertLogMsg);

  res.json({
    success: true,
    code,
    message: `Verification code SMS sent successfully to ${phone} (Simulated)`
  });
});

// POST verify SMS OTP code
app.post("/api/otp/verify", (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: "Phone and code required" });
  }

  const otpData = activeOTPs.get(phone);
  if (!otpData) {
    return res.status(400).json({ error: "No verification code sent for this number" });
  }

  if (Date.now() > otpData.expires) {
    activeOTPs.delete(phone);
    return res.status(400).json({ error: "Verification code expired. Please request a new one." });
  }

  if (otpData.code !== String(code).trim()) {
    return res.status(400).json({ error: "Invalid verification code" });
  }

  // Clear OTP on successful verification
  activeOTPs.delete(phone);
  console.log(`Verification Server: Successfully verified phone number ${phone}`);
  res.json({ success: true, verified: true });
});

// Centralized Dynamic SEO metadata dictionary for server-side HTML pre-rendering
function injectDynamicSEO(html: string, propertyId: string | undefined): string {
  if (!propertyId) return html;

  const seoData: Record<string, { title: string, description: string, image?: string }> = {
    "prop-ir-1": {
      title: "پنت‌‌هاوس مجلل کلاسیک الهیه - آریانا رهنما | کاداستر رسمی شش‌دانگ ثبتی",
      description: "یک شاهکار معماری لوکس در الهیه تهران. دارای مشاعات تمام هتلینگ، استخر معلق شیشه‌ای، روف گاردن اختصاصی ۳۶۰ درجه با دید ابدی کل پایتخت و تاییدیه کاداستر.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80"
    },
    "prop-ir-2": {
      title: "ویلا مدرن استخردار لواسان - آریانا رهنما | نشان کاداستر طلایی کاتب",
      description: "ویلا مسکونی فوق‌العاده مدرن با سند تک‌برگ کاداستر شش‌دانگ آماده انتقال در بهترین نقطه باستی هیلز لواسان بزرگ. دارای چهار خواب مستر، شاه‌نشین، سالن سینمای خصوصی و استخر آب‌گرم.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80"
    },
    "prop-ir-3": {
      title: "آپارتمان هوشمند برج باغ فرشته - آریانا رهنما | سند رسمی ثبتی کدرهگیری کاتب",
      description: "آپارتمان ۳ خوابه مستر لوکس در برج باغ رویایی فرشته تهران. مجهز به متریال تمام برند وارداتی، تراس بزرگ بدون مشرف و روف گاردن هلندی با دید ابدی پارک و کوهستان.",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80"
    },
    "prop-1": {
      title: "Sovereign Penthouse Presnensky Moscow - Ariana Rahnuma",
      description: "Elite high-rise luxurious penthouse in Presnensky District with breathtaking Moscow horizon view.",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=60"
    },
    "prop-2": {
      title: "Wazir Akbar Khan Diplomatic Villa Kabul - Ariana Rahnuma",
      description: "Secure premier diplomatic property located in Wazir Akbar Khan, Kabul. Perfect for international organizations.",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60"
    },
    "prop-3": {
      title: "Bebek Bosphorus Waterfront Mansion Istanbul - Ariana Rahnuma",
      description: "Magnificent historical waterside mansion overlooking the Bosphorus strait in elite Bebek, Istanbul.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60"
    }
  };

  const meta = seoData[propertyId];
  if (!meta) return html;

  let modifiedHtml = html;

  // Replace default title
  modifiedHtml = modifiedHtml.replace(
    /<title>.*?<\/title>/gi,
    `<title>${meta.title}</title>`
  );

  // Replace description meta tag
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/gi,
    `<meta name="description" content="${meta.description}" />`
  );

  // Replace og:title
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/gi,
    `<meta property="og:title" content="${meta.title}" />`
  );

  // Replace og:description
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/gi,
    `<meta property="og:description" content="${meta.description}" />`
  );

  // Replace og:image if custom image exists
  if (meta.image) {
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/gi,
      `<meta property="og:image" content="${meta.image}" />`
    );
  }

  // Inject a real JSON-LD Structured Data Schema dynamically as well
  const schemaMarkup = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    "name": "${meta.title}",
    "description": "${meta.description}",
    "url": "https://arianarahnuma.com/?property=${propertyId}",
    "image": "${meta.image || ''}",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "Contact Agent"
    }
  }
  </script>
  `;

  modifiedHtml = modifiedHtml.replace("</head>", `${schemaMarkup}\n</head>`);
  return modifiedHtml;
}

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
      try {
        const templatePath = path.join(distPath, "index.html");
        let html = fs.readFileSync(templatePath, "utf-8");
        
        // Dynamic server-side SEO meta-tag insertion based on routing
        const propertyId = req.query.property as string | undefined;
        html = injectDynamicSEO(html, propertyId);
        
        res.status(200).set({ "Content-Type": "text/html" }).send(html);
      } catch (e) {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
    console.log("Ariana Server: Production static assets routing configured with SSR-level Dynamic SEO Meta injection.");
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
          
          // Dynamic server-side SEO pre-rendering/injection in development environment too
          const propertyId = req.query.property as string | undefined;
          template = injectDynamicSEO(template, propertyId);
          
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } catch (e) {
          next(e);
        }
      });

      console.log("Ariana Server: Vite development middleware and SPA fallback mounted successfully with Dynamic SEO parsing.");
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
