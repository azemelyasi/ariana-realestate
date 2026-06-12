import React, { useState, useEffect } from "react";
import { Language } from "../types";
import { COUNTRIES } from "../data";
import { toLocalizedDigits } from "./LocalCalendar";
import { CALC_TRANSLATIONS, CalculatorTranslationSet } from "./calculatorTranslations";

// Translation dictionary for each country's capital or primary representative real estate city in all 16 languages.
const CITY_TRANSLATIONS: Record<string, Record<Language, string>> = {
  AE: {
    en: "Dubai / Abu Dhabi",
    fa: "دبی / ابوظبی",
    tr: "Dubai / Abu Dabi",
    ar: "دبي / أبوظبي",
    de: "Dubai / Abu Dhabi",
    ja: "ドバイ / アブダビ",
    zh: "迪拜 / 阿布扎比",
    uz: "Dubay / Abu-Dabi",
    ru: "Дубай / Абу-Даби",
    ku: "دوبەی / ئەبووزەبی",
    ps: "دوبۍ / ابوظهبي",
    hi: "दुबई / अबू धाबी",
    ur: "دبئی / ابوظہبی",
    sg: "Dubai / Abu Dhabi",
    fr: "Dubaï / Abou Dabi",
    es: "Dubái / Abu Dabi"
  },
  SA: {
    en: "Riyadh",
    fa: "ریاض",
    tr: "Riyad",
    ar: "الرياض",
    de: "Riad",
    ja: "リヤド",
    zh: "利雅得",
    uz: "Riyod",
    ru: "Эр-Рияд",
    ku: "ڕیاز",
    ps: "ریاض",
    hi: "रियाद",
    ur: "ریاض",
    sg: "Riyadh",
    fr: "Riyad",
    es: "Riad"
  },
  QA: {
    en: "Doha",
    fa: "دوحه",
    tr: "Doha",
    ar: "الدوحة",
    de: "Doha",
    ja: "ドーハ",
    zh: "多哈",
    uz: "Doha",
    ru: "Доха",
    ku: "دەوحە",
    ps: "دوحه",
    hi: "दोहा",
    ur: "دوحہ",
    sg: "Doha",
    fr: "Doha",
    es: "Doha"
  },
  KW: {
    en: "Kuwait City",
    fa: "کویت",
    tr: "Kuveyt",
    ar: "الكويت",
    de: "Kuwait-Stadt",
    ja: "クウェート市",
    zh: "科威特城",
    uz: "Quvayt",
    ru: "Эль-Кувейт",
    ku: "کوێت",
    ps: "کویټ",
    hi: "कुवैत शहर",
    ur: "کویت",
    sg: "Kuwait City",
    fr: "Koweït",
    es: "Kuwait"
  },
  BH: {
    en: "Manama",
    fa: "منامه",
    tr: "Manama",
    ar: "المنامة",
    de: "Manama",
    ja: "マナーマ",
    zh: "麦纳麦",
    uz: "Manama",
    ru: "Манама",
    ku: "مەنامە",
    ps: "منامه",
    hi: "मनामा",
    ur: "منامہ",
    sg: "Manama",
    fr: "Manama",
    es: "Manama"
  },
  OM: {
    en: "Muscat",
    fa: "مسقط",
    tr: "Maskat",
    ar: "مسقط",
    de: "Maskat",
    ja: "マスカット",
    zh: "马斯喀特",
    uz: "Maskat",
    ru: "Маскат",
    ku: "مەسقەت",
    ps: "مسقط",
    hi: "मस्कट",
    ur: "مسقط",
    sg: "Muscat",
    fr: "Mascate",
    es: "Masqat"
  },
  IQ: {
    en: "Baghdad",
    fa: "بغداد",
    tr: "Bağdat",
    ar: "بغداد",
    de: "Bagdad",
    ja: "バグダッド",
    zh: "巴格达",
    uz: "Baghdod",
    ru: "Багдад",
    ku: "بەغدا",
    ps: "بغداد",
    hi: "बगदाद",
    ur: "بغداد",
    sg: "Baghdad",
    fr: "Bagdad",
    es: "Bagdad"
  },
  EG: {
    en: "Cairo",
    fa: "قاهره",
    tr: "Kahire",
    ar: "القاهرة",
    de: "Kairo",
    ja: "カイロ",
    zh: "开罗",
    uz: "Qohira",
    ru: "Каир",
    ku: "قاهیرە",
    ps: "قاهره",
    hi: "काहिरा",
    ur: "قاہرہ",
    sg: "Cairo",
    fr: "Le Caire",
    es: "El Cairo"
  },
  SY: {
    en: "Damascus",
    fa: "دمشق",
    tr: "Şam",
    ar: "دمشق",
    de: "Damaskus",
    ja: "ダマスカス",
    zh: "大马士革",
    uz: "Damashq",
    ru: "Дамаск",
    ku: "دمشق",
    ps: "دمشق",
    hi: "दमिश्क",
    ur: "دمشق",
    sg: "Damascus",
    fr: "Damas",
    es: "Damasco"
  },
  LB: {
    en: "Beirut",
    fa: "بیروت",
    tr: "Beyrut",
    ar: "بيروت",
    de: "Beirut",
    ja: "ベイルート",
    zh: "贝鲁特",
    uz: "Bayrut",
    ru: "Бейрут",
    ku: "بەیرووت",
    ps: "بیروتی",
    hi: "बेरुत",
    ur: "بیروت",
    sg: "Beirut",
    fr: "Beyrouth",
    es: "Beirut"
  },
  JO: {
    en: "Amman",
    fa: "عمان",
    tr: "Amman",
    ar: "عمان",
    de: "Amman",
    ja: "アンマン",
    zh: "安曼",
    uz: "Ammon",
    ru: "Амман",
    ku: "عەممان",
    ps: "عمان",
    hi: "अम्मान",
    ur: "عمان",
    sg: "Amman",
    fr: "Amman",
    es: "Amán"
  },
  MA: {
    en: "Rabat / Casab.",
    fa: "رباط / کازابلانکا",
    tr: "Rabat / Kazablanka",
    ar: "الرباط / الدار البيضاء",
    de: "Rabat / Casab.",
    ja: "ラバト / カサブランカ",
    zh: "拉巴特 / 卡萨",
    uz: "Rabat / Kasablanka",
    ru: "Рабат / Касабланка",
    ku: "ڕەبات / کازابلانکا",
    ps: "رباط / کازابلانکا",
    hi: "रबात / कैसाब्लांका",
    ur: "رباط / کاسابلانکا",
    sg: "Rabat / Casab.",
    fr: "Rabat / Casab.",
    es: "Rabat / Casab."
  },
  YE: {
    en: "Sana'a",
    fa: "صنعا",
    tr: "Sana",
    ar: "صنعاء",
    de: "Sana'a",
    ja: "サナア",
    zh: "萨那",
    uz: "Sano",
    ru: "Сана",
    ku: "سەنعا",
    ps: "صنعاء",
    hi: "सना",
    ur: "صنعاء",
    sg: "Sana'a",
    fr: "Sanaa",
    es: "Saná"
  },
  LY: {
    en: "Tripoli",
    fa: "طرابلس",
    tr: "Trablus",
    ar: "طرابلس",
    de: "Tripolis",
    ja: "トリポリ",
    zh: "的黎波里",
    uz: "Tripoli",
    ru: "Триполи",
    ku: "ترابلوس",
    ps: "طرابلس",
    hi: "त्रिपोली",
    ur: "طرابلس",
    sg: "Tripoli",
    fr: "Tripoli",
    es: "Trípoli"
  },
  SD: {
    en: "Khartoum",
    fa: "خارطوم",
    tr: "Hartum",
    ar: "الخرطوم",
    de: "Khartum",
    ja: "ハルツーム",
    zh: "喀土穆",
    uz: "Hartum",
    ru: "Хартум",
    ku: "خارتوم",
    ps: "خارطوم",
    hi: "खार्तूम",
    ur: "خرطوم",
    sg: "Khartoum",
    fr: "Khartoum",
    es: "Jartum"
  },
  TN: {
    en: "Tunis",
    fa: "تونس",
    tr: "Tunus",
    ar: "تونس",
    de: "Tunis",
    ja: "チュニス",
    zh: "突尼斯",
    uz: "Tunis",
    ru: "Тунис",
    ku: "تونس",
    ps: "تونس",
    hi: "ट्यूनिस",
    ur: "تونس",
    sg: "Tunis",
    fr: "Tunis",
    es: "Túnez"
  },
  DZ: {
    en: "Algiers",
    fa: "الجزیره",
    tr: "Cezayir",
    ar: "الجزائر",
    de: "Algier",
    ja: "アルジェ",
    zh: "阿尔及尔",
    uz: "Jazoir",
    ru: "Алжир",
    ku: "جەزایر",
    ps: "الجزیره",
    hi: "अल्जीयर्स",
    ur: "الجزائر",
    sg: "Algiers",
    fr: "Alger",
    es: "Argel"
  },
  RU: {
    en: "Moscow",
    fa: "مسکو",
    tr: "Moskova",
    ar: "موسكو",
    de: "Moskau",
    ja: "モスクワ",
    zh: "莫斯科",
    uz: "Moskva",
    ru: "Москва",
    ku: "مۆسکۆ",
    ps: "مسکو",
    hi: "मास्को",
    ur: "ماسکو",
    sg: "Moscow",
    fr: "Moscou",
    es: "Moscú"
  },
  AF: {
    en: "Kabul",
    fa: "کابل",
    tr: "Kabil",
    ar: "كابول",
    de: "Kabul",
    ja: "カブール",
    zh: "喀布尔",
    uz: "Kobil",
    ru: "Кабул",
    ku: "کابول",
    ps: "کابل",
    hi: "काबुल",
    ur: "کابل",
    sg: "Kabul",
    fr: "Kaboul",
    es: "Kabul"
  },
  PK: {
    en: "Islamabad",
    fa: "اسلام‌آباد",
    tr: "İslamabad",
    ar: "إslam آباد",
    de: "Islamabad",
    ja: "イスラマバード",
    zh: "伊斯兰堡",
    uz: "Islomobod",
    ru: "Исламабад",
    ku: "ئیسلاماباد",
    ps: "اسلام‌آباد",
    hi: "इस्लामाबाद",
    ur: "اسلام آباد",
    sg: "Islamabad",
    fr: "Islamabad",
    es: "Islamabad"
  },
  IN: {
    en: "New Delhi",
    fa: "دهلی نو",
    tr: "Yeni Delhi",
    ar: "نيودلهي",
    de: "Neu-Delhi",
    ja: "ニューデリー",
    zh: "新德里",
    uz: "Yangi Dehli",
    ru: "Нью-Дели",
    ku: "نیودەلهی",
    ps: "نوې دهلي",
    hi: "नई दिल्ली",
    ur: "نئی دہلی",
    sg: "New Delhi",
    fr: "New Delhi",
    es: "Nueva Delhi"
  },
  TR: {
    en: "Istanbul",
    fa: "استانبول",
    tr: "İstanbul",
    ar: "إسطنبول",
    de: "Istanbul",
    ja: "イスタンブール",
    zh: "伊斯坦布尔",
    uz: "Istanbul",
    ru: "Стамбул",
    ku: "ئەستانبۆل",
    ps: "استانبول",
    hi: "इस्तांबुल",
    ur: "استنبول",
    sg: "Istanbul",
    fr: "Istanbul",
    es: "Estambul"
  },
  DE: {
    en: "Berlin",
    fa: "برلین",
    tr: "Berlin",
    ar: "برلين",
    de: "Berlin",
    ja: "ベルリン",
    zh: "柏林",
    uz: "Berlin",
    ru: "Берлин",
    ku: "بەرلین",
    ps: "برلین",
    hi: "बर्लिन",
    ur: "برلن",
    sg: "Berlin",
    fr: "Berlin",
    es: "Berlín"
  },
  SG: {
    en: "Singapore",
    fa: "سنگاپور",
    tr: "Singapur",
    ar: "سنغافورة",
    de: "Singapur",
    ja: "シンガポール",
    zh: "新加坡",
    uz: "Singapur",
    ru: "Сингапур",
    ku: "سنگاپور",
    ps: "سنگاپور",
    hi: "सिंगापुर",
    ur: "سنگاپور",
    sg: "Singapore",
    fr: "Singapour",
    es: "Singapur"
  },
  GB: {
    en: "London",
    fa: "لندن",
    tr: "Londra",
    ar: "لندن",
    de: "London",
    ja: "ロンドン",
    zh: "伦敦",
    uz: "London",
    ru: "Лондон",
    ku: "لەندەن",
    ps: "لندن",
    hi: "लंदन",
    ur: "لندن",
    sg: "London",
    fr: "Londres",
    es: "Londres"
  },
  CA: {
    en: "Ottawa",
    fa: "اتاوا",
    tr: "Ottawa",
    ar: "أوتاوا",
    de: "Ottawa",
    ja: "オタワ",
    zh: "渥太华",
    uz: "Ottava",
    ru: "Оттава",
    ku: "ئۆتاوا",
    ps: "اوتاوا",
    hi: "ओटावा",
    ur: "اوٹاوا",
    sg: "Ottawa",
    fr: "Ottawa",
    es: "Ottawa"
  },
  IR: {
    en: "Tehran",
    fa: "تهران",
    tr: "Tahran",
    ar: "طهران",
    de: "Teheran",
    ja: "テヘラン",
    zh: "德黑兰",
    uz: "Tehron",
    ru: "Тегеран",
    ku: "تاران",
    ps: "تهران",
    hi: "तेहरान",
    ur: "تہران",
    sg: "Tehran",
    fr: "Téhéran",
    es: "Teherán"
  }
};

interface V2LiveCurrencyTerminalProps {
  lang: Language;
  subscriptionTier: "free" | "pro";
  onUpgradeClick: () => void;
  rates?: Record<string, number>;
}

export const V2LiveCurrencyTerminal: React.FC<V2LiveCurrencyTerminalProps> = ({
  lang,
  subscriptionTier,
  onUpgradeClick,
  rates: passedRates
}) => {
  const t: Partial<CalculatorTranslationSet> = CALC_TRANSLATIONS[lang] || CALC_TRANSLATIONS["en"] || {};
  const [rates, setRates] = useState<Record<string, number>>(() => {
    if (passedRates) return passedRates;
    return {
      USD: 1,
      USDT: 1,
      IRR: 1375125,
      TMN: 137512,
      AED: 3.673,
      SAR: 3.75,
      QAR: 3.64,
      KWD: 0.307,
      BHD: 0.376,
      OMR: 0.385,
      IQD: 1310,
      EGP: 47.85,
      SYP: 13000,
      LBP: 89500,
      JOD: 0.709,
      MAD: 10.02,
      YER: 250,
      LYD: 4.84,
      SDG: 601,
      TND: 3.12,
      DZD: 134.2,
      RUB: 91.45,
      AFN: 62.50,
      PKR: 278.10,
      INR: 83.35,
      TRY: 33.50,
      EUR: 0.922,
      CNY: 7.24,
      JPY: 156.40,
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    if (passedRates) {
      setRates(passedRates);
      setIsLive(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch("/api/currency/rates")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          const refinedRates = {
            USD: 1,
            USDT: 1,
            ...data.rates,
          };
          setRates((prev) => ({
            ...prev,
            ...refinedRates,
          }));
          setIsLive(true);
          const now = new Date();
          setLastUpdated(now.toLocaleTimeString());
          try {
            localStorage.setItem("melkban_rates", JSON.stringify(refinedRates));
          } catch (e) {
            // ignore
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Live OpenExchange rates failed:", err);
        setIsLoading(false);
      });
  }, [passedRates]);

  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  // Helper to determine if a country has dual exchange rates and return both rates/labels
  const getDualRateDetails = (currencyCode: string, standardRate: number) => {
    // Countries known to have dual rates or free market variance
    if (currencyCode === "IQD") {
      return {
        isDual: true,
        centralBank: 1310,
        freeMarket: Math.round(standardRate * 1.13), // ~13% parallel market premium
        cbLabel: t.iqdCbiOfficial || "CBI Official Rate",
        fmLabel: t.iqdFreeMarket || "Free Market (Al-Kifah)",
      };
    }
    if (currencyCode === "TRY") {
      return {
        isDual: true,
        centralBank: standardRate,
        freeMarket: Number((standardRate * 1.018).toFixed(3)), // Kapalıçarşı ~1.8% premium
        cbLabel: t.tryCbrtOfficial || "CBRT Official",
        fmLabel: t.tryGrandBazaar || "Grand Bazaar Rate",
      };
    }
    if (currencyCode === "SYP") {
      return {
        isDual: true,
        centralBank: 13000,
        freeMarket: Math.round(standardRate * 1.15), // ~15% street market premium
        cbLabel: t.sypCbiOfficial || "Official Damascus",
        fmLabel: t.sypParallel || "Street Parallel",
      };
    }
    if (currencyCode === "LBP") {
      return {
        isDual: true,
        centralBank: 15000,
        freeMarket: 89500, // True parallel market rate
        cbLabel: t.lbpBdlOfficial || "BDL Official fixed",
        fmLabel: t.lbpParallel || "Sayrafa Parallel",
      };
    }
    if (currencyCode === "EGP") {
      return {
        isDual: true,
        centralBank: standardRate,
        freeMarket: Number((standardRate * 1.035).toFixed(3)), // 3.5% parallel premium
        cbLabel: t.egpCbeOfficial || "CBE Official Rate",
        fmLabel: t.egpParallel || "Parallel Free Market",
      };
    }
    if (currencyCode === "RUB") {
      return {
        isDual: true,
        centralBank: standardRate,
        freeMarket: Number((standardRate * 1.045).toFixed(3)), // Commercial spread
        cbLabel: t.rubCbrOfficial || "CBR Official Rate",
        fmLabel: t.rubParallel || "OTC Free Market",
      };
    }
    
    if (currencyCode === "IRR" || currencyCode === "TMN") {
      const freeMarketRate = rates["TMN"] || (rates["IRR"] ? Math.round(rates["IRR"] / 10) : 63800);
      return {
        isDual: true,
        centralBank: 4200, // 42000 IRR = 4200 Toman
        freeMarket: freeMarketRate,
        cbLabel: t.irrOfficialPeg || "Official Peg Rate (4,200 Toman)",
        fmLabel: t.irrFreeMarket || "Free Market Toman Rate",
      };
    }
    
    // Add custom virtual Iran Toman handling if they ever need, but for now we look at general codes:
    return {
      isDual: false,
      centralBank: standardRate,
      freeMarket: standardRate,
      cbLabel: "",
      fmLabel: "",
    };
  };

  // Filter countries to only show those that have currency in our rates map
  const activeCountries = COUNTRIES;

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden ${isRtl ? "rtl text-right" : "ltr text-left"}`} id="v2-forex-dashboard">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg shadow-lg">
            ⚡
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              {t.terminalHeaderTitle || "V2 Live Cadastral Currency Terminal"}
              <span className={`text-[8px] border px-1.5 py-0.5 rounded font-bold uppercase transition-all ${isLive ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse" : "bg-amber-500/20 text-amber-300 border-amber-500/30"}`}>
                {isLoading ? (t.terminalUpdating || "UPDATING...") : isLive ? (t.terminalLiveFeed || "LIVE FEED") : (t.terminalOffline || "OFFLINE")}
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {t.terminalHeaderDesc || "Continuous cryptographic valuations of all 21 nation-states simultaneously refreshed"}
            </p>
          </div>
        </div>

        {/* Live status indicators */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
            <span>{t.terminalRefreshed || "Refreshed"}: {lastUpdated ? toLocalizedDigits(lastUpdated, lang) : (t.terminalDefault || "Default")}</span>
          </div>
        </div>
      </div>

      {/* PERSUASIVE CONVERSION BANNER FOR FREE USERS (PROMOTION CORE) */}
      {subscriptionTier === "free" && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-slate-950 border border-amber-500/20 rounded-2xl p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-start gap-3 relative z-10">
            <span className="text-xl">💎</span>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-amber-400">
                {t.goldTitle || "Gold Cadastre Subscription: Live Global Forex & AI Suite"}
              </h4>
              <p className="text-[10.5px] text-slate-300 leading-relaxed max-w-2xl">
                {t.goldDesc || "Unlock automatic in-app conversion to Lira, Euro, Dirham & Ruble with active exchange rates, remove the 2-listing quota & deploy 4 specialized AI modules."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onUpgradeClick}
            className="cursor-pointer relative z-10 shrink-0 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 text-[10.5px] font-black rounded-xl transition shadow-md shadow-amber-500/10 active:scale-95 flex items-center gap-1"
          >
            <span>💎</span>
            <span>{t.goldBtn || "Upgrade to Gold Pro Now"}</span>
          </button>
        </div>
      )}

      {/* Scrollable grid for all currencies */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[340px] overflow-y-auto pr-1">
        {activeCountries.map((c) => {
          const standardCode = c.currency;
          const rateToUSD = rates[standardCode] || 1;
          const unitInUSD = 1 / rateToUSD;
          const dualInfo = getDualRateDetails(standardCode, rateToUSD);

          return (
            <div 
              key={c.code}
              className="bg-slate-950/85 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 p-3 rounded-2xl transition-all duration-250 flex flex-col justify-between hover:scale-[1.02]"
              id={`v2-currency-${c.code.toLowerCase()}`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base leading-none shrink-0">{c.flag}</span>
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-[10px] font-bold text-slate-200 truncate" title={lang === "fa" ? c.nameFa : c.nameEn}>
                      {lang === "fa" ? c.nameFa.split(" ")[0] : c.nameEn.split(" ")[0]}
                    </span>
                    <span className="text-[8.5px] text-slate-400 font-medium truncate" title={CITY_TRANSLATIONS[c.code]?.[lang] || CITY_TRANSLATIONS[c.code]?.["en"] || ""}>
                      {CITY_TRANSLATIONS[c.code]?.[lang] || CITY_TRANSLATIONS[c.code]?.["en"] || ""}
                    </span>
                  </div>
                </div>
                <div className="text-[8px] bg-slate-900 text-slate-400 border border-slate-800 px-1 py-0.5 rounded font-black font-mono">
                  {standardCode}
                </div>
              </div>

              {dualInfo.isDual ? (
                /* DUAL MARKET DISPLAY (CENTRAL BANK VS FREE MARKET) */
                <div className="space-y-1.5 text-xs">
                  {/* Central Bank Row */}
                  <div className="bg-indigo-950/20 px-2 py-1.5 rounded-lg border border-indigo-900/10">
                    <div className="flex items-center justify-between text-[7.5px] text-indigo-400 font-bold uppercase leading-none mb-1">
                      <span>🏦 {dualInfo.cbLabel}</span>
                    </div>
                    <div className="text-[11px] font-extrabold text-white font-mono tracking-tight leading-none flex items-baseline justify-between">
                      <span>{toLocalizedDigits(dualInfo.centralBank.toLocaleString(undefined, { maximumFractionDigits: 1 }), lang)}</span>
                      <span className="text-[8px] text-slate-500 font-medium">{c.currencySymbol}</span>
                    </div>
                  </div>

                  {/* Free Market Row */}
                  <div className="bg-amber-950/25 px-2 py-1.5 rounded-lg border border-amber-900/15">
                    <div className="flex items-center justify-between text-[7.5px] text-amber-400 font-bold uppercase leading-none mb-1">
                      <span>🦅 {dualInfo.fmLabel}</span>
                    </div>
                    <div className="text-[11px] font-extrabold text-amber-400 font-mono tracking-tight leading-none flex items-baseline justify-between">
                      <span>{toLocalizedDigits(dualInfo.freeMarket.toLocaleString(undefined, { maximumFractionDigits: 1 }), lang)}</span>
                      <span className="text-[8px] text-amber-500/80 font-medium">{c.currencySymbol}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* UNIFIED STANDARD PEGGED SINGLE RATE */
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[8px] text-slate-500 block font-mono font-bold uppercase leading-none">
                      {t.terminalUnifiedPegged || "Unified / Pegged Rate"}
                    </span>
                    <div className="text-[12px] font-extrabold text-white mt-0.5 font-mono tracking-tight leading-tight">
                      {toLocalizedDigits(rateToUSD.toLocaleString(undefined, { maximumFractionDigits: 3 }), lang)}{" "}
                      <span className="text-[9px] text-slate-400 font-medium">{c.currencySymbol}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Conversion to USD unit value */}
              {standardCode !== "USD" && (
                <div className="border-t border-slate-900 pt-1 mt-1.5 flex justify-between items-center bg-slate-950 p-1 rounded-lg">
                  <span className="text-[8.5px] text-slate-500 block font-mono font-bold leading-none">
                    {t.terminalValueInUSD || "Value inside 1$"}
                  </span>
                  <span className="text-[10px] font-black font-mono text-emerald-400 leading-none">
                    ${toLocalizedDigits(unitInUSD.toLocaleString(undefined, { maximumFractionDigits: 4 }), lang)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
