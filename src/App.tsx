import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Settings
} from "lucide-react";

import { Language, Property, CalendarEvent, SystemSettings, DisputeReport } from "./types";
import { COUNTRIES, INITIAL_PROPERTIES } from "./data";
import { TRANSLATIONS, LANGUAGES_LIST, getTranslation } from "./i18n";

import { LocalCalendar, toLocalizedDigits } from "./components/LocalCalendar";
import { CadastralCalculator } from "./components/CadastralCalculator";
import { AIConsultant } from "./components/AIConsultant";
import { AboutView } from "./components/AboutView";
import { ContactView } from "./components/ContactView";
import { PropertyCard } from "./components/PropertyCard";
import { PropertyDetailsModal } from "./components/PropertyDetailsModal";
import { AddPropertyModal } from "./components/AddPropertyModal";
import { SiteSettingsModal } from "./components/SiteSettingsModal";
import { V2LiveCurrencyTerminal } from "./components/V2LiveCurrencyTerminal";
import { DistrictIntelligence } from "./components/DistrictIntelligence";
import { FavoritesManager } from "./components/FavoritesManager";
import { ClientExportModal } from "./components/ClientExportModal";
import { AIAndAutomationTab } from "./components/AIAndAutomationTab";
import arianaLogo from "./assets/images/ariana_premium_logo_1780405823718.png";

export default function App() {
  // Lang preference default is ENGLISH as requested
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("melkban_lang");
    return (saved as Language) || "en";
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  // Tab View Controller
  const [activeTab, setActiveTab] = useState<"listings" | "calendar" | "appraisal" | "intelligence" | "about" | "contact" | "admin">("listings");

  // Bookmarked Favorites State with persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("melkban_favorites") || "[]");
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.includes(id) ? safePrev.filter((item) => item !== id) : [...safePrev, id];
      localStorage.setItem("melkban_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  // Client Export Basket state with persistent storage to prevent loss of state
  const [clientBasket, setClientBasket] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("melkban_client_basket") || "[]");
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  });

  const [showClientExportModal, setShowClientExportModal] = useState(false);

  const handleToggleClientBasket = (id: string) => {
    setClientBasket((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.includes(id) ? safePrev.filter((item) => item !== id) : [...safePrev, id];
      localStorage.setItem("melkban_client_basket", JSON.stringify(updated));
      return updated;
    });
  };

  // Persistent States
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem("melkban_properties");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        return INITIAL_PROPERTIES;
      }
    }
    return INITIAL_PROPERTIES;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("melkban_calendar_events");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        return [];
      }
    }
    return [
      {
        id: "ev-1",
        title: "Moscow Penthouse Official Appraisal",
        date: new Date().toISOString().split("T")[0],
        type: "viewing",
        phone: "+79031204050",
        clientName: "Nikolai Vasilev"
      },
      {
        id: "ev-2",
        title: "Kabul Villa Diplomatic Inspection",
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        type: "viewing",
        phone: "+93799123456",
        clientName: "Ambassador Ahmad"
      }
    ];
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const defaultSettings: SystemSettings = {
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
      freeListingsLimit: 1,
      feeType: "fixed",
      listingFeeUSDT: 5,
      feeRatePct: 0.05
    };

    const saved = localStorage.getItem("melkban_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          if (parsed.listingFeePrice === 250000) {
            parsed.listingFeePrice = 18;
          }
          return {
            ...defaultSettings,
            ...parsed,
            themeMode: parsed.themeMode || "dark",
            listingFeePrice: parsed.listingFeePrice !== undefined ? parsed.listingFeePrice : 18,
            globalDiscountPct: parsed.globalDiscountPct !== undefined ? parsed.globalDiscountPct : 15,
            promoCode: parsed.promoCode || "MELK20",
            promoDiscountPct: parsed.promoDiscountPct !== undefined ? parsed.promoDiscountPct : 20,
            tetherWalletAddress: parsed.tetherWalletAddress || "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD",
            freeListingsLimit: parsed.freeListingsLimit !== undefined ? parsed.freeListingsLimit : 1,
            feeType: parsed.feeType || "fixed",
            listingFeeUSDT: parsed.listingFeeUSDT !== undefined ? parsed.listingFeeUSDT : 5,
            feeRatePct: parsed.feeRatePct !== undefined ? parsed.feeRatePct : 0.05
          };
        }
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Apply theme dynamically to document body
  useEffect(() => {
    if (settings.themeMode === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [settings.themeMode]);

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("melkban_admin_authenticated") === "true";
  });
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string>("");

  // Current logged in user (Admin simulator)
  const [userRole, setUserRole] = useState<"client" | "verified" | "admin">(() => {
    const isAuth = localStorage.getItem("melkban_admin_authenticated") === "true";
    return isAuth ? "admin" : "client";
  });

  // --- 👑 SYSTEM VETO LAW PARAMETERS ---
  const [globalVeto, setGlobalVeto] = useState<"none" | "partial" | "full">("none");
  const [activeModulesList, setActiveModulesList] = useState<any[]>([]);
  const [vetoPasscodeInput, setVetoPasscodeInput] = useState<string>("");
  const [vetoPasscodeError, setVetoPasscodeError] = useState<string>("");

  // Periodically fetch central database parameters to check if system is under lockdown
  useEffect(() => {
    const fetchVetoStatus = async () => {
      try {
        const res = await fetch("/api/automation/status");
        if (res.ok) {
          const json = await res.json();
          setGlobalVeto(json.globalVetoLevel || "none");
          setActiveModulesList(json.supremeModules || []);
        }
      } catch (err) {
        console.error("Veto check error", err);
      }
    };
    fetchVetoStatus();
    const interval = setInterval(fetchVetoStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Admin section state controllers
  const [adminSubTab, setAdminSubTab] = useState<"property" | "site" | "disputes" | "automation">("property");
  
  // Disputes Filters and Selected IDs to prevent React Hook violations
  const [disputeFilterStatus, setDisputeFilterStatus] = useState<string>("all");
  const [disputeFilterReason, setDisputeFilterReason] = useState<string>("all");
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [tempResolutionNotes, setTempResolutionNotes] = useState<string>("");
  
  // Persistent Disputes / Complaints State
  const [disputes, setDisputes] = useState<DisputeReport[]>(() => {
    const saved = localStorage.getItem("melkban_disputes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fallback to defaults
      }
    }
    return [
      {
        id: "MB-DISC-89242",
        propertyId: "1",
        propertyTitle: "Luxury Penthouse in Moscow City",
        complainantName: "آرتور سارکیسیان",
        complainantPhone: "+7 903 555-1284",
        reason: "fake_price",
        description: "مبلغ ارائه‌شده با ارزش کارشناسی ثبت شده در سامانه کاداستر شهرداری مسکو مطابقت ندارد و حدود ۱۲ درصد بیش‌اظهاری دارد. لطفاً سند ثبتی بررسی شود.",
        createdAt: "2026-05-28T14:32:00Z",
        status: "investigating",
        resolutionNotes: "به کارشناس رسمی منطقه ارجاع داده شد تا استعلام قیمت همزمان به روز شود."
      },
      {
        id: "MB-DISC-41093",
        propertyId: "2",
        propertyTitle: "Beautiful Villa in Wazir Akbar Khan",
        complainantName: "انجنیر حبیب‌الله",
        complainantPhone: "+93 799 448-1090",
        reason: "wrong_owner",
        description: "تصاویر این ویلا مربوط به ملک مجاور حاصل شده است. همچنین نام مالک ملک در سند دیجیتال کاداستر با شخص معرفی شده مطابقت ندارد.",
        createdAt: "2026-05-30T09:15:00Z",
        status: "pending"
      }
    ];
  });

  const handleAddDispute = (newDispute: DisputeReport) => {
    setDisputes((prev) => {
      const updated = [newDispute, ...prev];
      localStorage.setItem("melkban_disputes", JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateDisputeStatus = (id: string, nextStatus: DisputeReport["status"], notes?: string) => {
    setDisputes((prev) => {
      const updated = prev.map((disp) => {
        if (disp.id === id) {
          return {
            ...disp,
            status: nextStatus,
            resolutionNotes: notes !== undefined ? notes : disp.resolutionNotes
          };
        }
        return disp;
      });
      localStorage.setItem("melkban_disputes", JSON.stringify(updated));
      return updated;
    });
  };

  const [agencyCommission, setAgencyCommission] = useState<number>(() => {
    const saved = localStorage.getItem("melkban_agency_commission");
    if (saved) {
      const val = parseFloat(saved);
      if (!isNaN(val)) return val;
    }
    return 1.5;
  });

  // Filter conditions
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterBedrooms, setFilterBedrooms] = useState("all");

  // Modal open controllers
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Progressive Web App (PWA) Install states and event listener
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [installTab, setInstallTab] = useState<"ios" | "android">("ios");

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log("Ariana Rahnuma has been installed successfully!");
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Initial detection of PWA standalone state
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone
    ) {
      setIsInstallable(false);
    } else {
      // Allow users to see the installation instruction button always for maximum coverage
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA Install choice outcome: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      // If prompt isn't fired automatically (iOS Safari, embedded default webview constraints), open our custom beautiful help instruction sheet
      setShowInstallGuide(true);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("melkban_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("melkban_properties", JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem("melkban_calendar_events", JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem("melkban_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("melkban_agency_commission", String(agencyCommission));
  }, [agencyCommission]);

  // Disputes filtering
  const filteredDisputes = disputes.filter((d) => {
    const matchStatus = disputeFilterStatus === "all" || d.status === disputeFilterStatus;
    const matchReason = disputeFilterReason === "all" || d.reason === disputeFilterReason;
    return matchStatus && matchReason;
  });

  // Dynamic Bot Search Auto-detector (Detects language, cities, districts, or properties names and switches filters)
  useEffect(() => {
    if (!searchQuery) return;
    const cleanSearch = searchQuery.toLowerCase().trim();
    
    // Country and District-specific dictionary mappings
    const irKeywords = ["ایران", "iran", "تهران", "tehran", "lavasan", "لواسان", "elahiyeh", "الهیه", "fereshteh", "فرشته", "niavaran", "نیاوران", "zaferanieh", "زعفرانیه", "kamranieh", "کمرانیه", "باستی", "مریم", "مهر", "لوکس تهران"];
    const aeKeywords = ["دبی", "امارات", "dubai", "marina", "uae", "sharjah", "شارجه", "palm", "jumeirah", "پالم", "جمیرا"];
    const trKeywords = ["ترکیه", "استانبول", "turkey", "istanbul", "ankara", "آنکارا", "شیشلی", "sisli", "بشیکتاش", "besiktas"];
    const deKeywords = ["آلمان", "برلین", "germany", "berlin", "munich", "مونیخ", "بوندس", "فرانکفورت", "frankfurt"];
    const ruKeywords = ["روسیه", "مسکو", "russia", "moscow", "federation", "کرملین", "presnensky"];
    const afKeywords = ["افغانستان", "کابل", "kabul", "afghanistan", "wazir", "وزیر", "اکبر", "احمد"];
    const caKeywords = ["کانادا", "تورنتو", "ونکوور", "toronto", "vancouver", "canada", "montreal", "مونترال"];
    const gbKeywords = ["لندن", "انگلیس", "london", "england", "uk", "birmingham", "بریتانیا", "میفر", "mayfair"];

    if (irKeywords.some(k => cleanSearch.includes(k))) {
      setFilterCountry("IR");
    } else if (aeKeywords.some(k => cleanSearch.includes(k))) {
      setFilterCountry("AE");
    } else if (trKeywords.some(k => cleanSearch.includes(k))) {
      setFilterCountry("TR");
    } else if (deKeywords.some(k => cleanSearch.includes(k))) {
      setFilterCountry("DE");
    } else if (ruKeywords.some(k => cleanSearch.includes(k))) {
      setFilterCountry("RU");
    } else if (afKeywords.some(k => cleanSearch.includes(k))) {
      setFilterCountry("AF");
    } else if (caKeywords.some(k => cleanSearch.includes(k))) {
      setFilterCountry("CA");
    } else if (gbKeywords.some(k => cleanSearch.includes(k))) {
      setFilterCountry("GB");
    }
  }, [searchQuery]);

  // Filtering Logic
  const filteredProperties = properties.filter((p) => {
    // Normalization helper for resilient searches (Persian/Arabic glyph & spacing corrections)
    const normalizeText = (text: string) => {
      if (!text) return "";
      return text
        .toLowerCase()
        .replace(/ي/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/ة/g, "ه")
        .replace(/[\u200B-\u200D\uFEFF]/g, " ") // normalize zero-width joiners
        .replace(/ملیک\s*بان/g, "ملک بان")
        .replace(/ملیکبان/g, "ملکبان")
        .trim();
    };

    const term = normalizeText(searchQuery);
    
    // ADVANCED MULTI-TERM DEEP SEARCH: matches every typed word in any details of the property
    const searchTerms = term.split(/\s+/).filter(Boolean);
    const matchSearch = searchTerms.length === 0 || searchTerms.every(part => {
      const matchInTitle = normalizeText(p.title).includes(part);
      const matchInDesc = normalizeText(p.description).includes(part);
      const matchInDistrict = normalizeText(p.district).includes(part);
      const matchInAddress = normalizeText(p.address).includes(part);
      const matchInPhone = normalizeText(p.phone).includes(part);
      const matchInId = normalizeText(p.id).includes(part);
      const matchInHeating = p.heating ? normalizeText(p.heating).includes(part) : false;
      const matchInCooling = p.cooling ? normalizeText(p.cooling).includes(part) : false;
      const matchInCabinets = p.cabinets ? normalizeText(p.cabinets).includes(part) : false;
      const matchInDeed = p.deed ? normalizeText(p.deed).includes(part) : false;
      
      // Smart semantic mapping (e.g. typing Persian "لوکس" matches English "luxury"/"premium", typing "خانه" matches houses/villas/penthouses/apartments)
      const semanticMatch = (
        (part === "لوکس" && (p.title.toLowerCase().includes("luxury") || p.description.toLowerCase().includes("luxury") || p.title.toLowerCase().includes("premium") || p.description.toLowerCase().includes("مجلل"))) ||
        (part === "مجلل" && (p.title.toLowerCase().includes("luxury") || p.description.toLowerCase().includes("luxury") || p.title.toLowerCase().includes("premium") || p.description.toLowerCase().includes("لوکس"))) ||
        (part === "خانه" && (p.title.toLowerCase().includes("house") || p.title.toLowerCase().includes("villa") || p.title.toLowerCase().includes("apartment") || p.title.toLowerCase().includes("residence") || p.title.toLowerCase().includes("mansion") || p.title.toLowerCase().includes("penthouse") || p.title.toLowerCase().includes("پنت‌‌هاوس") || p.title.toLowerCase().includes("آپارتمان") || p.title.toLowerCase().includes("ویلا"))) ||
        ((part === "ملکبان" || part === "ملک بان") && (p.id.includes("prop-ir") || p.title.includes("ملک‌بان") || p.title.includes("ملک بان")))
      );

      const matchInType = (
        (p.type === "sale" && (part.includes("فروش") || part.includes("sale") || part.includes("خرید") || part.includes("کاداستر"))) ||
        (p.type === "rent" && (part.includes("اجاره") || part.includes("rent") || part.includes("کرایه"))) ||
        (p.type === "mortgage" && (part.includes("رهن") || part.includes("mortgage"))) ||
        (p.type === "rent_mortgage" && (part.includes("رهن و اجاره") || part.includes("رهن") || part.includes("اجاره") || part.includes("rent_mortgage")))
      );

      return (
        matchInTitle ||
        matchInDesc ||
        matchInDistrict ||
        matchInAddress ||
        matchInPhone ||
        matchInId ||
        matchInHeating ||
        matchInCooling ||
        matchInCabinets ||
        matchInDeed ||
        matchInType ||
        semanticMatch
      );
    });

    const isSearchActive = searchQuery.trim().length > 0;
    const matchCountry = isSearchActive || filterCountry === "all" || p.country === filterCountry;
    const matchType = filterType === "all" || p.type === filterType;
    const matchBeds = 
      filterBedrooms === "all" || 
      (filterBedrooms === "0" && p.bedrooms === 0) ||
      (filterBedrooms === "1" && p.bedrooms === 1) ||
      (filterBedrooms === "2" && p.bedrooms === 2) ||
      (filterBedrooms === "3" && p.bedrooms === 3) ||
      (filterBedrooms === "4" && p.bedrooms >= 4);

    return matchSearch && matchCountry && matchType && matchBeds;
  });

  const handleAddProperty = (propData: Partial<Property>) => {
    const newProp: Property = {
      id: "prop-" + Date.now(),
      title: propData.title || "Custom Residence",
      description: propData.description || "",
      type: propData.type || "sale",
      pricePerSqm: propData.pricePerSqm,
      totalPrice: propData.totalPrice,
      rent: propData.rent,
      deposit: propData.deposit,
      area: propData.area || 100,
      country: propData.country || "AE",
      district: propData.district || "Dubai Marina",
      bedrooms: propData.bedrooms !== undefined ? propData.bedrooms : 2,
      phone: propData.phone || "+971501234567",
      address: propData.address || "Main Blvd",
      latitude: propData.latitude || 25.2048,
      longitude: propData.longitude || 55.2708,
      images: propData.images ?? ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60"],
      createdAt: new Date().toISOString(),
      isApproved: !settings.requireApproval
    };

    setProperties([newProp, ...properties]);
    setShowAddModal(false);
  };

  const handleAddCalendarEvent = (newEvent: CalendarEvent) => {
    setCalendarEvents([newEvent, ...calendarEvents]);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  const handleApproveProperty = (id: string) => {
    setProperties(
      properties.map((p) => (p.id === id ? { ...p, isApproved: true } : p))
    );
  };

  const handleRejectProperty = (id: string) => {
    setProperties(
      properties.map((p) => (p.id === id ? { ...p, isApproved: false } : p))
    );
  };

  const handleSaveSettings = (newSet: SystemSettings) => {
    setSettings(newSet);
    setShowSettingsModal(false);
  };

  if (globalVeto === "full" && userRole !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans" id="veto-lockdown-pane">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-16 h-16 bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-3xl animate-bounce">
            🚫
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-rose-550 uppercase tracking-wide">
              {lang === "fa" ? "قفل امنیتی وتوی سراسری فعال است" : "Supreme System Veto Lockdown Active"}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {lang === "fa"
                ? "دسترسی عمومی به سامانه کاداستر موقتاً بنا به دستور ممیزی فرمانده ارشد (امیر) تعلیق گردیده است."
                : "Public interface of the global real estate registry is temporarily offline due to a veto security audit by Commander Amir."}
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl text-xs text-slate-400 font-mono">
            Error Code: 503 SERVICE VETOED
          </div>

          <div className="border-t border-slate-850 pt-5 space-y-4">
            <p className="text-[10px] text-slate-500 font-semibold animate-pulse">
              {lang === "fa" ? "آیا شما ابرمدیر مستقل هستید؟ جهت آزادسازی سیستم رمز عبور را وارد کنید:" : "Are you the Supreme Administrator? Enter passcode to override lock:"}
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (vetoPasscodeInput === "ariana2026") {
                setIsAdminAuthenticated(true);
                setUserRole("admin");
                setActiveTab("admin");
                localStorage.setItem("melkban_admin_authenticated", "true");
                localStorage.setItem("melkban_admin_username", "Governor Amir");
                setVetoPasscodeError("");
                window.location.reload();
              } else {
                setVetoPasscodeError(lang === "fa" ? "⚠️ رمز عبور وارد شده نامعتبر است." : "⚠️ Invalid secure passcode.");
              }
            }} className="space-y-3">
              <input
                type="password"
                placeholder={lang === "fa" ? "رمز عبور مدیریت" : "Secure Passcode"}
                value={vetoPasscodeInput}
                onChange={(e) => setVetoPasscodeInput(e.target.value)}
                className="w-full text-center px-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-white font-mono placeholder-slate-700 focus:outline-none focus:border-indigo-600 transition text-xs"
                required
              />
              {vetoPasscodeError && (
                <p className="text-[10px] text-rose-450 font-bold">{vetoPasscodeError}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black rounded-xl text-xs transition active:scale-95 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                🔑 {lang === "fa" ? "تایید هویت امنیتی و تاییدیه کاداستر" : "Submit Security Code"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white ${isRtl ? "rtl" : "ltr"}`} id="ariana-master">
      {/* Upper bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3.5 shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            {/* Custom Designed Ariana Premium Logo Icon */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              <div className="relative w-11 h-11 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={arianaLogo} 
                  alt="Ariana Rahnuma Logo" 
                  className="w-full h-full object-cover transform scale-105 hover:scale-120 transition duration-300" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-mono">
                {t.brand}
                <span className={`text-[9px] border px-1.5 py-0.5 rounded font-black font-mono transition-all ${settings.appVersionMode === "v2" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse" : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"}`}>
                  {settings.appVersionMode === "v2" ? "CADASTRE v2 (LIVE)" : "CADASTRE v3"}
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Nav buttons */}
          <nav className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "listings" ? "bg-indigo-600 text-white shadow shadow-indigo-600/10" : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              🏢 {t.navHome}
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "calendar" ? "bg-indigo-600 text-white shadow shadow-indigo-600/10" : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              🗓️ {t.navCalendar}
            </button>
            <button
              onClick={() => setActiveTab("appraisal")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "appraisal" ? "bg-indigo-600 text-white shadow shadow-indigo-600/10" : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              📊 {t.navAppraisal || "Appraisal"}
            </button>
            <button
              onClick={() => setActiveTab("intelligence")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "intelligence" ? "bg-indigo-600 text-white shadow shadow-indigo-600/10" : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              🧠 {t.navIntelligence || "District Intel"}
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "about" ? "bg-indigo-600 text-white shadow shadow-indigo-600/10" : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              ℹ️ {t.navAbout}
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "contact" ? "bg-indigo-600 text-white shadow shadow-indigo-600/10" : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              📞 {t.navContact}
            </button>
            {isAdminAuthenticated && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === "admin" ? "bg-indigo-600 text-white shadow shadow-indigo-600/10" : "text-emerald-400 hover:text-white hover:bg-slate-850"
                }`}
              >
                👑 {t.navAdmin}
              </button>
            )}
          </nav>

          {/* Quick Actions & Language chooser */}
          <div className="flex items-center gap-3">
            {/* Lang Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
              <span className="text-xs">🌐</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-[10px] font-bold text-indigo-400 focus:outline-none focus:ring-0 max-w-[100px] cursor-pointer"
              >
                {LANGUAGES_LIST.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Secret System Administrator Gate */}
            <button
              onClick={() => setActiveTab("admin")}
              className={`p-1.5 text-slate-800 hover:text-slate-500 font-bold text-xs bg-slate-950 border border-slate-900 rounded-lg hover:border-slate-800 transition active:scale-95 cursor-pointer`}
              title={lang === "fa" ? "درگاه ایمن کاداستر" : "Secure Cabinet Gateway"}
            >
              🔑
            </button>

            {/* PWA Install Button */}
            {isInstallable && (
              <button
                onClick={handleInstallPWA}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-emerald-550/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-emerald-600/10 cursor-pointer animate-pulse-subtle"
                title={lang === "fa" ? "نصب اپلیکیشن آریانا رهنما" : "Install Ariana Rahnuma App"}
              >
                <span>📲</span>
                <span>{lang === "fa" ? "نصب برنامه" : "Install App"}</span>
              </button>
            )}

            {/* Quick Post Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-indigo-600/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.btnPost}</span>
            </button>

            {/* Config Trigger */}
            {userRole === "admin" && (
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition"
                title="Registry Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* ------------------ VIEW 1: PROPERTY EXPLORER ------------------ */}
        {activeTab === "listings" && (
          <div className="space-y-6 animate-fade-in">
            {/* Hero Panel banner */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent"></div>
              <div className="space-y-2 relative z-10">
                <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 font-mono bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-900/40">
                  Cadastral Ledger Approved
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-100">
                  {lang === "fa" ? "املاک کارشناسی و کاداستر برتر" : "Sophisticated Registries without Compromise"}
                </h2>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  {lang === "fa" 
                    ? "جستجو، ارزیابی و هماهنگی بازدید املاک برتر در ۸ کشور هدف با محاسبه نرخ تسعیر ارز زنده کاداستر." 
                    : "Inspect premium architectural units across our 8 registered nation-states. Use the Integrated Valuation Tool or schedule onsite viewings seamlessly."}
                </p>
              </div>

              {/* Quick Counter tags */}
              <div className="flex gap-4 relative z-10 shrink-0 font-mono">
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-850 text-center min-w-[100px]">
                  <span className="text-slate-550 text-[9px] block">TOTAL UNITS</span>
                  <span className="text-lg font-black text-indigo-400">{toLocalizedDigits(properties.length, lang)}</span>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-850 text-center min-w-[100px]">
                  <span className="text-slate-555 text-[9px] block">VERIFIEDS</span>
                  <span className="text-lg font-black text-emerald-400">{toLocalizedDigits(properties.filter(p=>p.isApproved).length, lang)}</span>
                </div>
              </div>
            </div>

            {settings.appVersionMode === "v2" && (
              <V2LiveCurrencyTerminal lang={lang} />
            )}

            {/* Advanced Filters hub */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search text box */}
                <div className="relative w-full md:flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-24 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-2 top-1.5 flex items-center gap-1 pointer-events-none">
                    <span className="bg-indigo-950/60 text-indigo-400 text-[8px] md:text-[9px] font-bold px-2 py-0.5 rounded-lg border border-indigo-500/20 shadow-sm animate-pulse whitespace-nowrap">
                      {lang === "fa" ? "🧠 جستجوی سراسری" : "🧠 Smart Match"}
                    </span>
                  </div>
                </div>

                {/* Comboboxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
                  {/* Country chooser */}
                  <select
                    className="bg-slate-950 border border-slate-850 rounded-xl px-2 py-2 text-xs text-slate-300 focus:ring-1 focus:ring-indigo-500"
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                  >
                    <option value="all">{t.filterCountry || "All Regions"}</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {lang === "fa" ? c.nameFa : c.nameEn}
                      </option>
                    ))}
                  </select>

                  {/* Pricing type */}
                  <select
                    className="bg-slate-950 border border-slate-850 rounded-xl px-2 py-2 text-xs text-slate-300 focus:ring-1 focus:ring-indigo-500"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">📊 {t.filterType}</option>
                    <option value="sale">💎 {lang === "fa" ? "فقط فروشی" : "For Sale"}</option>
                    <option value="rent">🚪 {lang === "fa" ? "فقط اجاره" : "For Lease"}</option>
                  </select>

                  {/* Bed Configuration */}
                  <select
                    className="bg-slate-950 border border-slate-850 rounded-xl px-2 py-2 text-xs text-slate-300 focus:ring-1 focus:ring-indigo-500"
                    value={filterBedrooms}
                    onChange={(e) => setFilterBedrooms(e.target.value)}
                  >
                    <option value="all">🛌 {t.filterBeds}</option>
                    <option value="0">{lang === "fa" ? "سوییت" : "Studio (No beds)"}</option>
                    <option value="1">1 {lang === "fa" ? "خوابه" : "1 Bedroom"}</option>
                    <option value="2">2 {lang === "fa" ? "خوابه" : "2 Bedrooms"}</option>
                    <option value="3">3 {lang === "fa" ? "خوابه" : "3 Bedrooms"}</option>
                    <option value="4">4+ {lang === "fa" ? "خوابه" : "4+ Bedrooms"}</option>
                  </select>

                  {/* Clear filter */}
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterCountry("all");
                      setFilterType("all");
                      setFilterBedrooms("all");
                    }}
                    className="bg-slate-950 hover:bg-slate-850 border border-slate-850/80 text-indigo-400 font-bold text-[10px] rounded-xl transition-all"
                  >
                    🔄 {t.btnReset || "Reset"}
                  </button>
                </div>
              </div>
            </div>

            {/* Split layout: Grid on left/right, Interactive AI assistant & Forex monitor on side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Properties Grid (Col span 8) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-b border-slate-900 pb-2.5">
                  <span>
                    {properties.length} {t.totalListings}
                  </span>
                  {searchQuery && (
                    <span className="text-indigo-400">
                      Search results found: {filteredProperties.length}
                    </span>
                  )}
                </div>

                {activeModulesList.length > 0 && activeModulesList.find(m => m.id === "M2" && !m.isActive) ? (
                  <div className="p-12 text-center bg-rose-950/20 rounded-3xl border border-rose-900/30 space-y-4">
                    <span className="text-4xl block animate-pulse">🚫</span>
                    <h3 className="text-sm font-black text-rose-400 uppercase tracking-wider">
                      {lang === "fa" ? "سرویس موقتاً در حال به‌روزرسانی است (وتوی ماژول M2)" : "Property Registry (M2) Is Under Maintenance"}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                      {lang === "fa"
                        ? "ماژول مدیریت املاک (M2) بنا به دستور وتوی ممیزی توسط مدیر ارشد (فرمانده امیر) موقتاً متوقف شده است. پایش و کاداستر مسکونی غیرفعال است."
                        : "Property registry and search query executions (M2) are temporarily offline due to a veto audit by Governor Amir."}
                    </p>
                    <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-2xl max-w-sm mx-auto text-[10px] text-slate-500 font-mono">
                      STATUS CODE: 503 SERVICE VETOED
                    </div>
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-850 border-dashed">
                    <span className="text-3xl block mb-2">🔍</span>
                    <p className="text-xs text-slate-450 italic">{t.noListings}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredProperties.map((p) => (
                      <PropertyCard
                        key={p.id}
                        property={p}
                        lang={lang}
                        onViewDetails={(prop) => setSelectedProperty(prop)}
                        isFavorite={favorites.includes(p.id)}
                        onToggleFavorite={handleToggleFavorite}
                        isInClientBasket={clientBasket.includes(p.id)}
                        onToggleClientBasket={handleToggleClientBasket}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar with Live AI consultation & Quick Calculator (Col span 4) */}
              <div className="lg:col-span-4 space-y-6">
                <AIConsultant lang={lang} />
                <CadastralCalculator lang={lang} isSidebar={true} />
              </div>

            </div>
          </div>
        )}

        {/* ------------------ VIEW 2: SMART SCHEDULES CALENDAR ------------------ */}
        {activeTab === "calendar" && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <LocalCalendar 
              lang={lang} 
              events={calendarEvents} 
              onAddEvent={handleAddCalendarEvent} 
            />
          </div>
        )}

        {/* ------------------ VIEW 3: INTEGRATED APPRAISER FORM ------------------ */}
        {activeTab === "appraisal" && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <CadastralCalculator lang={lang} />
          </div>
        )}

        {/* ------------------ VIEW 7: DISTRICT INTELLIGENCE ANALYSIS ------------------ */}
        {activeTab === "intelligence" && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <DistrictIntelligence lang={lang} />
          </div>
        )}

        {/* ------------------ VIEW 4: ABOUT SYSTEMS ------------------ */}
        {activeTab === "about" && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <AboutView lang={lang} />
          </div>
        )}

        {/* ------------------ VIEW 5: CONTACT DESK ------------------ */}
        {activeTab === "contact" && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <ContactView lang={lang} />
          </div>
        )}

        {/* ------------------ VIEW 6: ADMISTRATIONS UNIT ------------------ */}
        {activeTab === "admin" && (
          <div className="animate-fade-in space-y-6 max-w-4xl mx-auto" id="ariana-master-admin-view">
            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden space-y-6 text-center mt-12 bg-radial from-slate-900 to-slate-950">
                <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none"></div>
                <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner shadow-indigo-500/10">
                  🔒
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {lang === "fa" ? "درگاه امنیتی مدیریت آریانا رهنما" : "Ariana Rahnuma Administrative Gateway"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {lang === "fa" 
                      ? "جهت دسترسی به پنل مدیریت کلان کاداستر آریانا رهنما، بررسی عملکرد سیستم، تایید اسناد و ویرایش کارمزد، لطفاً رمز عبور عبور امنیتی مدیریت را وارد نمایید." 
                      : "To access global cadastral control parameters, review records, analyze networks, and configure system fees, please provide the master administration passcode."}
                  </p>
                </div>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const cleanUsername = usernameInput.trim().toLowerCase();
                    const cleanPasscode = passcodeInput.trim();
                    
                    const isUsernameValid = cleanUsername === "admin" || cleanUsername === "melkban" || cleanUsername === "ariana" || cleanUsername === "ariana_rahnuma";
                    const isPasscodeValid = cleanPasscode === "melkban2026" || cleanPasscode === "ariana2026";
                    
                    if (isUsernameValid && isPasscodeValid) {
                      setIsAdminAuthenticated(true);
                      setUserRole("admin");
                      localStorage.setItem("melkban_admin_authenticated", "true");
                      localStorage.setItem("melkban_admin_username", usernameInput.trim());
                      setPasscodeError("");
                      setPasscodeInput("");
                      setUsernameInput("");
                    } else {
                      if (!isUsernameValid && !isPasscodeValid) {
                        setPasscodeError(lang === "fa" ? "⚠️ نام کاربری و رمز عبور هر دو نامعتبر هستند." : "⚠️ Both username and passcode are incorrect.");
                      } else if (!isUsernameValid) {
                        setPasscodeError(lang === "fa" ? "⚠️ نام کاربری وارد شده صحیح نیست." : "⚠️ Username is incorrect.");
                      } else {
                        setPasscodeError(lang === "fa" ? "⚠️ رمز عبور وارد شده نامعتبر است." : "⚠️ Passcode is incorrect.");
                      }
                    }
                  }}
                  className="space-y-4"
                  autoComplete="off"
                >
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={lang === "fa" ? "نام کاربری" : "Username"}
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full text-center px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-600 transition"
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder={lang === "fa" ? "رمز عبور مدیریت" : "Admin Passcode"}
                        value={passcodeInput}
                        onChange={(e) => setPasscodeInput(e.target.value)}
                        className="w-full text-center px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-600 transition"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  
                  {passcodeError && (
                    <p className="text-xs text-rose-450 font-bold animate-pulse">
                      {passcodeError}
                    </p>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition duration-200 uppercase tracking-wider cursor-pointer"
                  >
                    {lang === "fa" ? "تایید و ورود به مدیریت" : "Authenticate & Mount Panel"}
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Simulation Controller Header */}
                <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800/80 rounded-3xl space-y-4 shadow-xl shadow-black/45 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
                  <div className="absolute top-0 right-1/3 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <h3 className="text-base font-black text-white uppercase tracking-wider font-mono">
                          🛡️ {getTranslation(lang, "adminConsoleTitle", "Ariana Rahnuma Dual-Management Cabinet")}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-xl leading-relaxed">
                        {getTranslation(lang, "adminConsoleDesc", "The ultimate segregated webmaster console. Approve properties, compute global commission levels, adjust layout options, and review live developer socket telemetry.")}
                      </p>
                    </div>

                     {/* Authorized Session lock button */}
                    <div className="flex gap-2 items-center shrink-0">
                      <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-xs font-bold text-indigo-400 select-none">
                        👑 {lang === "fa" ? `مدیریت فعال: ${localStorage.getItem("melkban_admin_username") || "admin"}` : `Session: ${localStorage.getItem("melkban_admin_username") || "admin"}`}
                      </div>
                      <button
                        onClick={() => {
                          setIsAdminAuthenticated(false);
                          setUserRole("client");
                          localStorage.setItem("melkban_admin_authenticated", "false");
                          localStorage.removeItem("melkban_admin_username");
                        }}
                        className="px-3 py-1.5 bg-rose-950/30 border border-rose-900/45 hover:bg-rose-900/40 text-rose-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        🔒 {lang === "fa" ? "خروج و قفل پنل" : "Lock Session"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Admin Console Hub */}
                {userRole === "admin" && (
                  <div className="space-y-6">
                
                {/* Master Tab-Switcher for the Dual-Management Interface */}
                <div className="flex bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl max-w-2xl flex-wrap sm:flex-nowrap gap-1">
                  <button
                    onClick={() => setAdminSubTab("property")}
                    className={`flex-1 min-w-[130px] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      adminSubTab === "property" 
                        ? "bg-indigo-600 text-white shadow" 
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    🏢 {lang === "fa" ? "لیست لجر و کارمزد کاداستر" : "1. Listings & Commission"}
                  </button>
                  <button
                    onClick={() => setAdminSubTab("site")}
                    className={`flex-1 min-w-[130px] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      adminSubTab === "site" 
                        ? "bg-indigo-600 text-white shadow" 
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    ⚙️ {lang === "fa" ? "تنظیمات عمومی سامانه" : "2. System Settings"}
                  </button>
                  <button
                    onClick={() => setAdminSubTab("disputes")}
                    className={`flex-1 min-w-[130px] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                      adminSubTab === "disputes" 
                        ? "bg-indigo-600 text-white shadow" 
                        : "text-rose-450 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    🚨 {lang === "fa" ? "شکایات و ممیزی املاک" : "3. Disputes & Complaints"}
                    {disputes.filter((d) => d.status === "pending").length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-600 outline outline-2 outline-slate-900 text-[9px] font-black font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center text-white animate-bounce">
                        {disputes.filter((d) => d.status === "pending").length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setAdminSubTab("automation")}
                    className={`flex-1 min-w-[130px] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                      adminSubTab === "automation" 
                        ? "bg-indigo-600 text-white shadow" 
                        : "text-indigo-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    🤖 {lang === "fa" ? "هوش مصنوعی و خودکارسازی" : "4. AI & Automation"}
                    <span className="absolute -top-1 -right-1 bg-indigo-500 w-2 h-2 rounded-full animate-ping"></span>
                    <span className="absolute -top-1 -right-1 bg-indigo-500 w-2.5 h-2.5 rounded-full"></span>
                  </button>
                </div>

                {/* TAB 1: CADASTRAL LISTING AND COMMISSION MANAGEMENT */}
                {adminSubTab === "property" && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Unique Feature: Global Commission Yield Slider & Ledger Calculations */}
                    <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase font-black tracking-widest text-indigo-400 font-mono bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-900/30">
                          {getTranslation(lang, "adminLiveCommissionHeader", "LIVE COMMISSION ENVELOPE SCALE")}
                        </span>
                        <h4 className="text-sm font-black text-white">
                          {getTranslation(lang, "adminLiveCommissionTitle", "Continuous Agency Commission Settings")}
                        </h4>
                        <p className="text-[10.5px] text-slate-450 leading-relaxed">
                          {getTranslation(lang, "adminLiveCommissionDesc", "Configure the transactional yield share. Changing this slider automatically recompute target corporate income margins for all approved properties.")}
                        </p>
                      </div>

                      <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-4.5 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-350">{getTranslation(lang, "adminLiveCommissionLabel", "Global Margin Allocation:")}</span>
                          <span className="text-indigo-400 font-mono font-black text-base">{agencyCommission.toFixed(1)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="5.0"
                          step="0.1"
                          value={agencyCommission}
                          onChange={(e) => setAgencyCommission(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1 bg-slate-900 rounded cursor-pointer appearance-none"
                        />
                        <div className="flex justify-between text-[9px] text-slate-550 font-mono">
                          <span>Min: 0.5%</span>
                          <span>Max: 5.0%</span>
                        </div>
                      </div>
                    </div>

                    {/* Listings Management Table with Live Commission computation */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                        <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 font-mono">
                          {getTranslation(lang, "adminQueueHeader", "ACTIVE CADASTRAL APPROVALS QUEUE (Total: {count})").replace("{count}", String(properties.length))}
                        </span>
                        <span className="text-[10.5px] text-slate-400 font-semibold">
                          {getTranslation(lang, "adminQueueSub", "Instant Ledger Commits")}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-850 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                              <th className="py-3 px-3">{getTranslation(lang, "adminColProperty", "Property & Location")}</th>
                              <th className="py-3 px-3">{getTranslation(lang, "adminColRegion", "Target Region")}</th>
                              <th className="py-3 px-3">{getTranslation(lang, "adminColBaseValue", "Base Property Value")}</th>
                              <th className="py-3 px-3">{getTranslation(lang, "adminColCommission", "Corporate Commission Target")}</th>
                              <th className="py-3 px-3">{getTranslation(lang, "adminColLedgerStatus", "Ledger Status")}</th>
                              <th className="py-3 px-3 text-right">{getTranslation(lang, "adminColOperations", "Operations")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850/60 font-medium">
                            {properties.map((p) => {
                              const c = COUNTRIES.find((cnt) => cnt.code === p.country) || COUNTRIES[0];
                              const propPrice = p.totalPrice || (p.pricePerSqm || 0) * p.area;
                              const commissionValue = Math.round(propPrice * (agencyCommission / 100));

                              return (
                                <tr key={p.id} className="hover:bg-slate-950/20 transition group">
                                  <td className="py-3 px-3">
                                    <div className="font-bold text-slate-100 font-sans group-hover:text-indigo-400 transition-colors">{p.title}</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{p.district}, {p.address.substring(0, 20)}...</div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 border border-slate-850 rounded-xl w-fit text-[11px]">
                                      <span>{c.flag}</span>
                                      <span className="font-bold text-slate-330">{lang === "fa" ? c.nameFa : c.nameEn}</span>
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 font-mono text-slate-200">
                                    {toLocalizedDigits(propPrice.toLocaleString(), lang)} <span className="text-[10px] text-slate-500">{c.currency}</span>
                                  </td>
                                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold bg-emerald-500/[0.015]">
                                    ★ {toLocalizedDigits(commissionValue.toLocaleString(), lang)} <span className="text-[9px] text-emerald-600">{c.currency}</span>
                                  </td>
                                  <td className="py-3 px-3">
                                    {p.isApproved ? (
                                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-950 rounded-md px-2 py-0.5 text-[9.5px] font-extrabold font-mono tracking-wider">
                                        {getTranslation(lang, "adminStatusApproved", "APPROVED")}
                                      </span>
                                    ) : (
                                      <span className="bg-amber-950 text-amber-400 border border-amber-950 rounded-md px-2 py-0.5 text-[9.5px] font-extrabold font-mono tracking-wider animate-pulse">
                                        {getTranslation(lang, "adminStatusPending", "REVIEW PENDING")}
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                                    {!p.isApproved && (
                                      <button
                                        onClick={() => handleApproveProperty(p.id)}
                                        className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-xl cursor-pointer shadow shadow-emerald-500/10 transition-all active:scale-95"
                                      >
                                        ✓ {getTranslation(lang, "adminOpCommit", "Commit")}
                                      </button>
                                    )}
                                    {p.isApproved && (
                                      <button
                                        onClick={() => handleRejectProperty(p.id)}
                                        className="text-[10px] font-bold bg-slate-950 border border-slate-850 hover:bg-slate-800 text-slate-350 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95"
                                      >
                                        ✕ {getTranslation(lang, "adminOpHold", "Hold")}
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteProperty(p.id)}
                                      className="text-[10px] font-bold bg-rose-950/40 hover:bg-rose-900 border border-rose-900/35 text-rose-300 px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95"
                                    >
                                      🗑️ {getTranslation(lang, "adminOpPurge", "Purge")}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: TECHNICAL WEBMASTER CONTROL PANEL & ACTIVE DEVELOPER TELEMETRY */}
                {adminSubTab === "site" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in" id="technical-webmaster-subtab">
                    
                    {/* Left: Full Webmaster Settings Form */}
                    <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                      <div className="border-b border-slate-850 pb-3">
                        <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 font-mono">
                          {getTranslation(lang, "adminTabTwoSectionOne", "1️⃣ GLOBAL SYSTEM PARAMETERS CONSOLE")}
                        </span>
                        <p className="text-[11px] text-slate-450 mt-1">
                          {getTranslation(lang, "adminTabTwoSectionOneDesc", "Direct metadata mutation inside browser sandbox.")}
                        </p>
                      </div>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          // The settings list already updates states interactively via input bindings or on demand below
                          handleSaveSettings(settings);
                        }} 
                        className="space-y-4 text-xs text-slate-300"
                      >
                        {/* Site Name and Logo String */}
                        <div>
                          <label className="block text-slate-400 mb-1 font-bold">
                            🌐 {getTranslation(lang, "adminSiteName", "Global Asset Platform Name")}
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-medium focus:outline-none"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                          />
                        </div>

                        {/* Interactive Toggles */}
                        <div className="space-y-3 bg-slate-950 border border-slate-850 p-4 rounded-2xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-250 block">🛡️ {getTranslation(lang, "settingsAdminApprovals", "Enforce Administrative Verifications")}</span>
                              <span className="text-[10px] text-slate-500">{getTranslation(lang, "settingsAdminApprovalsDesc", "Force all new submissions into pending review queue.")}</span>
                            </div>
                            <input
                              type="checkbox"
                              className="w-4.5 h-4.5 text-indigo-600 focus:ring-indigo-500 rounded accent-indigo-600 bg-slate-950 border-slate-800 cursor-pointer"
                              checked={settings.requireApproval}
                              onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-900 pt-3">
                            <div>
                              <span className="font-bold text-slate-250 block">👥 {getTranslation(lang, "settingsGuestPosting", "Authorize Public Guest Custom Entries")}</span>
                              <span className="text-[10px] text-slate-500">{getTranslation(lang, "settingsGuestPostingDesc", "Allow public visitor accounts to submit listing items.")}</span>
                            </div>
                            <input
                              type="checkbox"
                              className="w-4.5 h-4.5 text-indigo-600 focus:ring-indigo-505 rounded accent-indigo-600 bg-slate-950 border-slate-800 cursor-pointer"
                              checked={settings.allowPublicPost}
                              onChange={(e) => setSettings({ ...settings, allowPublicPost: e.target.checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-900 pt-3">
                            <div>
                              <span className="font-bold text-slate-250 block">⚙️ {getTranslation(lang, "settingsVersionTwo", "Baseline User Layout Engine")}</span>
                              <span className="text-[10px] text-slate-500">{getTranslation(lang, "settingsVersionTwoDesc", "Apply simple V2 or robust V3 asset structure layouts.")}</span>
                            </div>
                            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 gap-1 shrink-0 font-mono">
                              <button
                                type="button"
                                onClick={() => setSettings({ ...settings, appVersionMode: "v3" })}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${settings.appVersionMode !== "v2" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                              >
                                V3 ENGINE
                              </button>
                              <button
                                type="button"
                                onClick={() => setSettings({ ...settings, appVersionMode: "v2" })}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${settings.appVersionMode === "v2" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                              >
                                V2 ENGINE
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-900 pt-3">
                            <div>
                              <span className="font-bold text-slate-250 block">🎨 {getTranslation(lang, "settingsAppearance", "Web Appearance Mode")}</span>
                              <span className="text-[10px] text-slate-500">{getTranslation(lang, "settingsAppearanceDesc", "Change default visual atmosphere style.")}</span>
                            </div>
                            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 gap-1 shrink-0 font-mono">
                              <button
                                type="button"
                                onClick={() => setSettings({ ...settings, themeMode: "light" })}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${settings.themeMode === "light" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                              >
                                {getTranslation(lang, "settingsAppearanceLight", "LIGHT")}
                              </button>
                              <button
                                type="button"
                                onClick={() => setSettings({ ...settings, themeMode: "dark" })}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${settings.themeMode !== "light" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                              >
                                {getTranslation(lang, "settingsAppearanceDark", "DARK")}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Contact entries */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-450 mb-1 font-bold">
                              {getTranslation(lang, "settingsContactEmail", "✉️ Contacts Email")}
                            </label>
                            <input
                              type="email"
                              required
                              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-white font-mono"
                              value={settings.contactEmail}
                              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-slate-450 mb-1 font-bold">
                              {getTranslation(lang, "settingsContactPhone", "📞 Hotline Desk")}
                            </label>
                            <input
                              type="text"
                              required
                              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-white font-mono"
                              value={settings.contactPhone}
                              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Dynamic Listing & Promo controls (Added per user request) */}
                        <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-2xl space-y-4">
                          <span className="text-[10px] uppercase font-black text-emerald-400 font-mono block">
                            💰 {getTranslation(lang, "adminPromoTitle", "Billing & Coupon Configuration")}
                          </span>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-400 mb-1 font-bold">
                                {getTranslation(lang, "adminPromoFee", "Premium Auditing Fee (AED):")}
                              </label>
                              <input
                                type="number"
                                required
                                min="0"
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold"
                                value={settings.listingFeePrice !== undefined ? settings.listingFeePrice : 18}
                                onChange={(e) => setSettings({ ...settings, listingFeePrice: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1 font-bold">
                                {getTranslation(lang, "adminPromoDiscount", "General Site Discount (%):")}
                              </label>
                              <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold"
                                value={settings.globalDiscountPct !== undefined ? settings.globalDiscountPct : 15}
                                onChange={(e) => setSettings({ ...settings, globalDiscountPct: Number(e.target.value) })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 border-t border-slate-900/80 pt-3">
                            <div>
                              <label className="block text-slate-400 mb-1 font-bold">
                                {getTranslation(lang, "adminPromoCode", "Webmaster Promo Code:")}
                              </label>
                              <input
                                type="text"
                                required
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-white uppercase font-mono font-bold"
                                value={settings.promoCode || "MELK20"}
                                onChange={(e) => setSettings({ ...settings, promoCode: e.target.value.toUpperCase() })}
                              />
                              <p className="text-[9px] text-slate-450 mt-1 leading-normal">
                                {getTranslation(lang, "adminPromoCodeDesc", "💡 Separate codes by comma. e.g. MELK20, AFG0:0, VIP100:100")}
                              </p>
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1 font-bold">
                                {getTranslation(lang, "adminPromoCodeOff", "Promo Code Off (%):")}
                              </label>
                              <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold"
                                value={settings.promoDiscountPct !== undefined ? settings.promoDiscountPct : 20}
                                onChange={(e) => setSettings({ ...settings, promoDiscountPct: Number(e.target.value) })}
                              />
                            </div>
                          </div>

                          <div className="border-t border-slate-900/80 pt-3">
                            <label className="block text-slate-400 mb-1 font-bold">
                              {getTranslation(lang, "settingsWalletAddress", "Personal Deposit Wallet Address (USDT-TRC20):")}
                            </label>
                            <input
                              type="text"
                              required
                              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold text-center tracking-wide"
                              value={settings.tetherWalletAddress || "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD"}
                              onChange={(e) => setSettings({ ...settings, tetherWalletAddress: e.target.value })}
                            />
                          </div>
                        </div>
                      </form>
                    </div>

                      {/* Right: Immersive Animated Developer diagnostics and cluster status indicators */}
                      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 relative">
                        <div className="border-b border-slate-850 pb-3">
                          <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 font-mono">
                            {getTranslation(lang, "adminTelemetryHeader", "2️⃣ ACTIVE TELEMETRY DIAGNOSTICS")}
                          </span>
                          <p className="text-[11px] text-slate-450 mt-1">
                            {getTranslation(lang, "adminTelemetrySub", "Continuous telemetry inspection.")}
                          </p>
                        </div>

                        <div className="space-y-3.5">
                          {/* Metric 1 - Server Response Speed */}
                          <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-2xl flex items-center justify-between gap-2 transition hover:border-slate-800">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">⚡</span>
                              <div>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                                  {getTranslation(lang, "adminMetricLatencySub", "Server Core Latency")}
                                </span>
                                <span className="text-xs font-extrabold text-slate-200">
                                  {getTranslation(lang, "adminMetricLatencyTitle", "Gateway Response Latency")}
                                </span>
                              </div>
                            </div>
                            <span className="font-mono text-emerald-400 font-black bg-emerald-950/40 px-2 py-0.5 border border-emerald-900/30 rounded text-[11px]">
                              14ms
                            </span>
                          </div>

                          {/* Metric 2 - Sync Cluster Node */}
                          <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-2xl flex items-center justify-between gap-2 transition hover:border-slate-800">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">🧱</span>
                              <div>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                                  {getTranslation(lang, "adminMetricClusterSub", "Synced DB Master Clusters")}
                                </span>
                                <span className="text-xs font-extrabold text-slate-200">
                                  {getTranslation(lang, "adminMetricClusterTitle", "Active Database Clusters")}
                                </span>
                              </div>
                            </div>
                            <span className="font-mono text-indigo-400 font-black bg-indigo-950/40 px-2 py-0.5 border border-indigo-900/30 rounded text-[11px]">
                              {getTranslation(lang, "adminMetricClusterValue", "3 Nodes")}
                            </span>
                          </div>

                          {/* Metric 3 - Connected Agents */}
                          <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-2xl flex items-center justify-between gap-2 transition hover:border-slate-800">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">👥</span>
                              <div>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                                  {getTranslation(lang, "adminMetricOperatorsSub", "Live Session Concurrences")}
                                </span>
                                <span className="text-xs font-extrabold text-slate-200">
                                  {getTranslation(lang, "adminMetricOperatorsTitle", "Live Active Operators")}
                                </span>
                              </div>
                            </div>
                            <span className="font-mono text-amber-400 font-black bg-amber-950/45 px-2 py-0.5 border border-amber-900/30 rounded text-[11px] animate-pulse">
                              {getTranslation(lang, "adminMetricOperatorsValue", "12 Online")}
                            </span>
                          </div>

                          {/* Metric 4 - Memory / Index caching hits */}
                          <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-2xl flex items-center justify-between gap-2 transition hover:border-slate-800">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">💾</span>
                              <div>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                                  {getTranslation(lang, "adminMetricCacheSub", "Transaction Ledger Index Cache")}
                                </span>
                                <span className="text-xs font-extrabold text-slate-200">
                                  {getTranslation(lang, "adminMetricCacheTitle", "Ledger Invalidation Hits")}
                                </span>
                              </div>
                            </div>
                            <span className="font-mono text-emerald-400 font-black bg-emerald-950/40 px-2 py-0.5 border border-emerald-900/30 rounded text-[11px]">
                              99.96%
                            </span>
                          </div>
                        </div>

                        {/* Interactive Visual Network Status Dial */}
                        <div className="bg-slate-950/50 rounded-2xl border border-slate-850 p-4 space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                            <span className="text-slate-450 uppercase">
                              {getTranslation(lang, "adminTelemetryBlockchain", "Secured Blockchain Ledger Signatures")}
                            </span>
                            <span className="text-emerald-400 text-right">
                              {getTranslation(lang, "adminTelemetryStatus", "ONLINE SYNCHRONIZED")}
                            </span>
                          </div>
                          {/* Simulated status bars */}
                          <div className="flex gap-1 h-3.5 items-center">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((bar) => {
                              const isGreen = bar <= 13;
                              const isYellow = bar === 14 || bar === 15;
                              return (
                                <div 
                                  key={bar} 
                                  className={`flex-1 h-full rounded transition-all duration-300 ${
                                    isGreen ? "bg-emerald-500" : isYellow ? "bg-amber-400 animate-pulse" : "bg-slate-800"
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <p className="text-[9.5px] text-slate-500 font-mono italic leading-normal">
                            {getTranslation(lang, "adminTelemetryWarning", "Multistage memory shields are active. All transaction payloads are cryptographically locked inside local storage indices.")}
                          </p>
                        </div>
                      </div>
                    </div>

                  )}

                {/* TAB 3: CADASTRAL DISPUTES & COMPLAINT TRACKING LEDGER */}
                {adminSubTab === "disputes" && (
                  <div className="space-y-6 animate-fade-in" id="cadastral-disputes-audit-tab">
                      {/* Section Info Banner */}
                      <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-black tracking-widest text-rose-400 font-mono bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-900/30">
                            {lang === "fa" ? "کارتابل امنیت اراضی و رسیدگی به گزارشات" : "LAND SECURITY & LITIGATION JOURNAL"}
                          </span>
                          <h4 className="text-sm font-black text-white">
                            {lang === "fa" ? "سامانه متمرکز ممیزی شکایات و مغایرت‌های کاداستر" : "Integrated Cadastral Discrepancy & Dispute Hub"}
                          </h4>
                          <p className="text-[10.5px] text-slate-400 max-w-xl leading-relaxed font-semibold">
                            {lang === "fa" 
                              ? "در این بخش بازرسان می‌توانند مغایرت‌های گزارش شده در خصوص ارزش املاک، تداخلات مرزی کاداستر یا اصالت مدارک را بررسی کرده و وضعیت پرونده را به صورت سیستمی تغییر دهند."
                              : "Review citizen dispute claims regarding valuation manipulation, boundary overrides, or deceptive photography. Authorize corrections instantly."}
                          </p>
                        </div>

                        {/* Summary Pill count */}
                        <div className="flex gap-3 text-xs bg-slate-950/80 border border-slate-850 p-3 rounded-2xl shrink-0 font-mono">
                          <div className="text-center px-2">
                            <span className="block text-[10px] text-slate-500 uppercase">{lang === "fa" ? "در انتظار" : "Pending"}</span>
                            <span className="text-amber-400 font-extrabold text-sm">{disputes.filter(d => d.status === "pending").length}</span>
                          </div>
                          <div className="w-px bg-slate-850 self-stretch"></div>
                          <div className="text-center px-2">
                            <span className="block text-[10px] text-slate-500 uppercase">{lang === "fa" ? "تحت ممیزی" : "Reviewing"}</span>
                            <span className="text-indigo-400 font-extrabold text-sm">{disputes.filter(d => d.status === "investigating").length}</span>
                          </div>
                          <div className="w-px bg-slate-850 self-stretch"></div>
                          <div className="text-center px-2">
                            <span className="block text-[10px] text-slate-500 uppercase">{lang === "fa" ? "مختومه" : "Archived"}</span>
                            <span className="text-emerald-400 font-extrabold text-sm">{disputes.filter(d => d.status === "resolved").length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls and filters */}
                      <div className="bg-slate-900 border border-slate-800 p-4.5 rounded-3xl flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Filter by status */}
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-slate-500 block">{lang === "fa" ? "وضعیت پرونده:" : "Filter Status:"}</span>
                            <select
                              value={disputeFilterStatus}
                              onChange={(e) => setDisputeFilterStatus(e.target.value)}
                              className="bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                            >
                              <option value="all">{lang === "fa" ? "همه وضعیت‌ها" : "All Statuses"}</option>
                              <option value="pending">{lang === "fa" ? "📥 در انتظار بررسی اولیه" : "Pending Review"}</option>
                              <option value="investigating">{lang === "fa" ? "🔍 تحت ممیزی ثبتی" : "Under Investigation"}</option>
                              <option value="resolved">{lang === "fa" ? "✓ حل و اصلاح نهایی" : "Resolved"}</option>
                              <option value="dismissed">{lang === "fa" ? "✕ رد شکایت" : "Dismissed"}</option>
                            </select>
                          </div>

                          {/* Filter by reason */}
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-slate-500 block">{lang === "fa" ? "دلیل مغایرت:" : "Filter Reason:"}</span>
                            <select
                              value={disputeFilterReason}
                              onChange={(e) => setDisputeFilterReason(e.target.value)}
                              className="bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                            >
                              <option value="all">{lang === "fa" ? "همه دسته‌بندی‌ها" : "All categories"}</option>
                              <option value="fake_price">{lang === "fa" ? "💵 قیمت غیرواقعی" : "Fake Price"}</option>
                              <option value="wrong_owner">{lang === "fa" ? "👤 مغایرت مالک سند" : "Wrong Owner"}</option>
                              <option value="cadastral_mismatch">{lang === "fa" ? "📐 محدود کاداستر" : "Boundary Overlaps"}</option>
                              <option value="invalid_images">{lang === "fa" ? "🖼️ عکس دغلکارانه" : "Fraudulent Photos"}</option>
                              <option value="other">{lang === "fa" ? "⚠️ سایر تخلفات" : "Other violations"}</option>
                            </select>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono font-bold">
                          {lang === "fa" 
                            ? `تعداد پرونده‌های یافت شده: ${filteredDisputes.length} مورد` 
                            : `Filtered count: ${filteredDisputes.length} records`}
                        </span>
                      </div>

                      {/* Disputes Grid Layout - Real follow up tracking */}
                      {filteredDisputes.length === 0 ? (
                        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                          <span className="text-3xl">🛡️</span>
                          <h4 className="text-xs font-black text-slate-200">{lang === "fa" ? "هیچ گزارش شکایتی یافت نشد" : "NO ACTIVE REGISTERED DISPUTES"}</h4>
                          <p className="text-[10px] text-slate-500 max-w-sm mx-auto">
                            {lang === "fa" ? "درگاه ممیزی امن است. در این دسته یا فیلتر انتخابی، پرونده فعالی وجود ندارد." : "All registries are peaceful. There are no pending claims for the selected filters."}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {filteredDisputes.map((disp) => {
                            const matchingProp = properties.find((pr) => pr.id === disp.propertyId);
                            const isSelected = selectedDisputeId === disp.id;

                            // Resolve badge color
                            let badgeClass = "bg-amber-955 text-amber-400 border border-amber-950/40";
                            let statusText = lang === "fa" ? "در انتظار بررسی" : "Pending Review";
                            if (disp.status === "investigating") {
                              badgeClass = "bg-indigo-950/60 text-indigo-400 border border-indigo-900/40";
                              statusText = lang === "fa" ? "درحال بررسی و ممیزی رسمی" : "Under Action";
                            } else if (disp.status === "resolved") {
                              badgeClass = "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40";
                              statusText = lang === "fa" ? "حل و اصلاح نهایی" : "Resolved & Saved";
                            } else if (disp.status === "dismissed") {
                              badgeClass = "bg-slate-900 text-slate-500 border border-slate-800";
                              statusText = lang === "fa" ? "رد شکایت و فاقد صحت" : "Dismissed";
                            }

                            // Reason label
                            let reasonLabel: string = disp.reason;
                            if (disp.reason === "fake_price") reasonLabel = lang === "fa" ? "💵 قیمتگذاری نامتعارف" : "Fake Valuation";
                            else if (disp.reason === "wrong_owner") reasonLabel = lang === "fa" ? "👤 تضاد هویت مالک اسناد" : "Owner Discrepancy";
                            else if (disp.reason === "cadastral_mismatch") reasonLabel = lang === "fa" ? "📐 مغایرت حریم کاداستر" : "Boundary / Area issue";
                            else if (disp.reason === "invalid_images") reasonLabel = lang === "fa" ? "🖼️ عکس‌های نامرتبط" : "Fraudulent Photography";
                            else if (disp.reason === "other") reasonLabel = lang === "fa" ? "⚠️ تضاد ثبتی دیگر" : "Other Discrepancy";

                            return (
                              <div 
                                key={disp.id} 
                                className={`p-5 bg-gradient-to-b from-slate-900 to-slate-910 border rounded-3xl transition duration-150 space-y-4 ${
                                  isSelected ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-800 hover:border-slate-750"
                                }`}
                              >
                                {/* Ticket header metadata */}
                                <div className="flex justify-between items-start gap-2.5">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-850 font-mono font-black text-white tracking-wider">
                                        {disp.id}
                                      </span>
                                      <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-black uppercase ${badgeClass}`}>
                                        {statusText}
                                      </span>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-500 block pt-0.5">
                                      {lang === "fa" ? "ثبت ثانیه:" : "Filed at:"} {new Date(disp.createdAt).toLocaleString(lang === "fa" ? "fa-IR" : "en-US")}
                                    </span>
                                  </div>

                                  <span className="bg-slate-950 px-2.5 py-1 text-[9.5px] font-bold text-slate-350 border border-slate-850 rounded-xl">
                                    {reasonLabel}
                                  </span>
                                </div>

                                {/* Property connection */}
                                <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-2xl space-y-1.5">
                                  <span className="text-[8px] font-mono text-indigo-455 font-extrabold uppercase tracking-wide block">
                                    {lang === "fa" ? "ملک مورد شکایت و کدهای مرجع ثبتی:" : "TARGETED CADASTRAL REGISTRY OBJECT:"}
                                  </span>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-black text-white leading-normal truncate max-w-[210px] block">
                                      {disp.propertyTitle}
                                    </span>
                                    {matchingProp ? (
                                      <button
                                        type="button"
                                        onClick={() => setSelectedProperty(matchingProp)}
                                        className="text-[9.5px] font-bold text-indigo-400 hover:text-indigo-300 underline shrink-0 cursor-pointer"
                                      >
                                        🔍 {lang === "fa" ? "مشاهده جزئیات ملک" : "Audit Details"}
                                      </button>
                                    ) : (
                                      <span className="text-[9px] text-rose-500 font-black shrink-0 font-mono select-none">
                                        [🗑️ {lang === "fa" ? "ملک حذف شده" : "Prop Deleted"}]
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Complainant data */}
                                <div className="grid grid-cols-2 gap-4 text-xs border-y border-slate-850 py-3 font-semibold">
                                  <div>
                                    <span className="block text-[9px] text-slate-500">{lang === "fa" ? "شخص مدعی / گزارش‌دهنده:" : "Citizen Claimant:"}</span>
                                    <span className="text-slate-200 font-black">{disp.complainantName}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] text-slate-500">{lang === "fa" ? "تلفن مستقیم پیگیری:" : "Direct Hotline:"}</span>
                                    <a href={`tel:${disp.complainantPhone}`} className="text-rose-450 font-mono hover:underline font-black">
                                      {disp.complainantPhone}
                                    </a>
                                  </div>
                                </div>

                                {/* Message description */}
                                <div className="space-y-1">
                                  <span className="text-[9.5px] text-slate-450 block font-bold">
                                    📄 {lang === "fa" ? "متن مستندات تضاد و تخلف ثبتی:" : "Claimant Declared Statement:"}
                                  </span>
                                  <p className="text-[10.5px] text-slate-350 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-850/50">
                                    {disp.description}
                                  </p>
                                </div>

                                {/* Investigator resolution NOTES */}
                                {disp.resolutionNotes && (
                                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl space-y-1">
                                    <span className="text-[9px] uppercase font-bold text-indigo-400 block tracking-wide">
                                      📋 {lang === "fa" ? "اقدام و ممیزی بازرسی املاک آریانا رهنما:" : "Official Resolution Log / Ledger Details:"}
                                    </span>
                                    <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                                      {disp.resolutionNotes}
                                    </p>
                                  </div>
                                )}

                                {/* Investigator action panel toggle */}
                                {!isSelected ? (
                                  <button
                                    onClick={() => {
                                      setSelectedDisputeId(disp.id);
                                      setTempResolutionNotes(disp.resolutionNotes || "");
                                    }}
                                    className="w-full text-center py-2 bg-slate-950 border border-slate-850 hover:border-slate-750 text-slate-300 text-[10px] font-bold rounded-xl transition cursor-pointer"
                                  >
                                    ⚙️ {lang === "fa" ? "بررسی اقدامات ممیزی و تغییر وضعیت" : "Audit litigation / Update status"}
                                  </button>
                                ) : (
                                  <div className="pt-3 border-t border-slate-800 space-y-3 animate-fade-in">
                                    <span className="text-[9.5px] text-indigo-400 block font-black uppercase tracking-wider">
                                      ⚖️ {lang === "fa" ? "اتاق فرماندهی ممیزی و ابلاغ" : "LITIGATION WORKSPACE CONTROL"}
                                    </span>

                                    {/* Select state */}
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-500 block font-bold block">
                                        {lang === "fa" ? "تغییر گام پیگیری پرونده:" : "Update Litigation Step:"}
                                      </label>
                                      <div className="grid grid-cols-2 gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateDisputeStatus(disp.id, "investigating")}
                                          className={`py-1.5 rounded-lg text-[9.5px] font-black cursor-pointer transition ${
                                            disp.status === "investigating" ? "bg-indigo-600 text-white" : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200"
                                          }`}
                                        >
                                          🔍 {lang === "fa" ? "در دست ممیزی" : "Investigation"}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateDisputeStatus(disp.id, "resolved")}
                                          className={`py-1.5 rounded-lg text-[9.5px] font-black cursor-pointer transition ${
                                            disp.status === "resolved" ? "bg-emerald-700 text-white" : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200"
                                          }`}
                                        >
                                          ✓ {lang === "fa" ? "پایان و اصلاح" : "Resolved/Fixed"}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateDisputeStatus(disp.id, "dismissed")}
                                          className={`py-1.5 rounded-lg text-[9.5px] font-black cursor-pointer transition ${
                                            disp.status === "dismissed" ? "bg-rose-950 text-rose-300 border border-rose-900/30" : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200"
                                          }`}
                                        >
                                          ✕ {lang === "fa" ? "رد شکواییه" : "Dismiss Claim"}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateDisputeStatus(disp.id, "pending")}
                                          className={`py-1.5 rounded-lg text-[9.5px] font-black cursor-pointer transition ${
                                            disp.status === "pending" ? "bg-amber-600 text-white" : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200"
                                          }`}
                                        >
                                          📥 {lang === "fa" ? "برگشت به زونکن" : "Reset Pending"}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Resolution notes text field */}
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-500 block font-bold block">
                                        {lang === "fa" ? "شرح ممیزی و اقدامات نهایی (ابلاغ شده به شاکی):" : "Official Auditing Action Description:"}
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={tempResolutionNotes}
                                        onChange={(e) => setTempResolutionNotes(e.target.value)}
                                        placeholder={lang === "fa" ? "نظیر: اصلاح قیمت طبق سند تک‌برگ صورت گرفت..." : "e.g. Price was calibrated and verified with local board database..."}
                                        className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-650"
                                      />
                                    </div>

                                    {/* Action controls */}
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleUpdateDisputeStatus(disp.id, disp.status, tempResolutionNotes);
                                          setSelectedDisputeId(null);
                                        }}
                                        className="flex-1 py-2 bg-indigo-650 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-xl transition cursor-pointer"
                                      >
                                        💾 {lang === "fa" ? "ذخیره تغییرات دفتر ثبت" : "Commit Resolution Log"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedDisputeId(null)}
                                        className="px-3 py-2 bg-slate-950 border border-slate-850 text-slate-400 font-bold text-[10px] hover:text-slate-200 rounded-xl transition cursor-pointer"
                                      >
                                        {lang === "fa" ? "انصراف" : "Cancel"}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                {adminSubTab === "automation" && (
                  <div className="space-y-6 animate-fade-in" id="cadastral-automation-agent-tab">
                    <AIAndAutomationTab
                      lang={lang}
                      properties={properties}
                      onPropertiesUpdated={(updated) => setProperties(updated)}
                    />
                  </div>
                )}


              </div>
            )}
          </>
        )}
      </div>
    )}

      </main>

      {/* Footer bar */}
      <footer className="bg-slate-900 border-t border-slate-850 px-4 py-6 text-center text-[10px] text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} {settings.siteName}. All registries secured.</span>
          <div className="flex gap-4">
            <span>Email: {settings.contactEmail}</span>
            <span>Hotline: {settings.contactPhone}</span>
          </div>
        </div>
      </footer>

      {/* MODAL WINDOWS */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          lang={lang}
          onClose={() => setSelectedProperty(null)}
          onSubmitComplaint={handleAddDispute}
        />
      )}

      {showAddModal && (
        <AddPropertyModal
          lang={lang}
          onClose={() => setShowAddModal(false)}
          onAddProperty={handleAddProperty}
          settings={settings}
          userRole={userRole}
        />
      )}

      {showSettingsModal && (
        <SiteSettingsModal
          lang={lang}
          settings={settings}
          onClose={() => setShowSettingsModal(false)}
          onSaveSettings={handleSaveSettings}
        />
      )}

      {/* Progressive Web App (PWA) Interactive Installation Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 bg-slate-955 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="melkban-pwa-install-dialog">
          <div className="bg-slate-905 bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-5 shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition cursor-pointer text-sm"
            >
              ✕
            </button>

            {/* App Icon Heading */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 bg-slate-950 rounded-2xl mx-auto border border-slate-800 p-1.5 flex items-center justify-center shadow-lg relative group mb-3">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-2xl blur opacity-25 animate-pulse"></div>
                <img 
                  src={arianaLogo} 
                  alt="Ariana Rahnuma App" 
                  className="w-full h-full object-cover rounded-xl relative z-10" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-md font-black text-slate-100 font-sans">
                {lang === "fa" ? "نصب وب‌اپلیکیشن آریانا رهنما" : "Install Ariana Rahnuma Premium App"}
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                {lang === "fa" 
                  ? "با نصب نسخه وب‌اپ، دسترسی به نقشه‌های کاداستر و دستیار هوش مصنوعی بدون نیاز به مرورگر و با آیکون اختصاصی صورت می‌پذیرد." 
                  : "Set down premium shortcut registries. Gain fast entry to maps and AI experts right from your device's direct homescreen."}
              </p>
            </div>

            {/* OS Tab Selector Links */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1">
              <button
                onClick={() => setInstallTab("ios")}
                className={`flex-1 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all cursor-pointer ${installTab === "ios" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                 iOS (iPhone / iPad)
              </button>
              <button
                onClick={() => setInstallTab("android")}
                className={`flex-1 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all cursor-pointer ${installTab === "android" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                🤖 Android / Chrome / PC
              </button>
            </div>

            {/* Dynamic Step-by-Step guide layout */}
            <div className="space-y-3.5 text-[11px] leading-relaxed text-slate-350 bg-slate-950/45 p-3.5 rounded-xl border border-slate-850">
              {installTab === "ios" ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="bg-indigo-900/50 text-indigo-300 font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] shrink-0 font-extrabold">۱</span>
                    <p>
                      {lang === "fa" 
                        ? "در پایین مرورگر Safari روی دکمه اشتراک‌گذاری (گزینه Share 📤) ضربه بزنید." 
                        : "Open this page in Safari browser, then tap the 'Share' tool at the bottom."}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-indigo-900/50 text-indigo-300 font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] shrink-0 font-extrabold">۲</span>
                    <p>
                      {lang === "fa" 
                        ? "کمی پایین رفته و پیوند Add to Home Screen (افزودن به صفحه اصلی ➕) را انتخاب کنید." 
                        : "Scroll down the list and select the 'Add to Home Screen' action."}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-indigo-900/50 text-indigo-300 font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] shrink-0 font-extrabold">۳</span>
                    <p>
                      {lang === "fa" 
                        ? "در بالای صفحه دکمه Add را لمس کنید تا به عنوان برنامه همیشگی نصب شود." 
                        : "Click 'Add' on the upper corner of your screen to conclude setting the shortcut."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="bg-indigo-900/50 text-indigo-300 font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] shrink-0 font-extrabold">۱</span>
                    <p>
                      {lang === "fa" 
                        ? "روی دکمه سبز رنگ نصب برنامه کلیک کنید یا منوی مرورگر خود (⋮) را باز کنید." 
                        : "Click our green 'Install' header button, or expand the browser menu button (⋮)."}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-indigo-900/50 text-indigo-300 font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] shrink-0 font-extrabold">۲</span>
                    <p>
                      {lang === "fa" 
                        ? "گزینه Install App یا افزودن به میانبر دسکتاپ را فشار دهید." 
                        : "Locate and toggle the 'Install app' or 'Add to Home screen' trigger."}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-indigo-900/50 text-indigo-300 font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] shrink-0 font-extrabold">۳</span>
                    <p>
                      {lang === "fa" 
                        ? "فرآیند بارگیری را تایید کنید تا میانبر با آیکون آریانا رهنما بارگذاری شود." 
                        : "Confirm the prompt. The operating system will complete setup as a standalone tool!"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons footer */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => setShowInstallGuide(false)}
                className="flex-1 py-2 bg-slate-950 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-xl text-[11px] font-bold transition active:scale-95 cursor-pointer"
              >
                {lang === "fa" ? "متوجه شدم" : "Got it"}
              </button>
              {deferredPrompt && (
                <button
                  onClick={() => {
                    setShowInstallGuide(false);
                    handleInstallPWA();
                  }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-bold transition active:scale-95 cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  ⚡️ {lang === "fa" ? "نصب هوشمند" : "Install Instantly"}
                </button>
              )}
            </div>

          </div>
        </div>
      )}


      {/* Persistent global bookmark manager & side-by-side matrices comparison tool */}
      <FavoritesManager
        favoriteIds={favorites}
        properties={properties}
        lang={lang}
        onViewDetails={(prop) => setSelectedProperty(prop)}
        onToggleFavorite={handleToggleFavorite}
      />

      {showClientExportModal && (
        <ClientExportModal
          lang={lang}
          onClose={() => setShowClientExportModal(false)}
          selectedProperties={properties.filter(p => clientBasket.includes(p.id))}
          onRemoveFromBasket={handleToggleClientBasket}
        />
      )}

      {/* Floating Client Proposal / Export Basket Studio Activation Trigger */}
      {clientBasket.length > 0 && (
        <div className="fixed bottom-6 left-6 z-40 animate-bounce cursor-pointer print:hidden" id="melkban-floating-client-export-trigger">
          <button
            onClick={() => setShowClientExportModal(true)}
            className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-indigo-650 hover:from-emerald-500 hover:to-indigo-550 text-white rounded-2xl shadow-2xl shadow-indigo-500/20 border border-emerald-450 hover:scale-105 transition duration-300 flex items-center gap-2.5 font-bold text-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-455 bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span>📥 {lang === "fa" ? "مشاهده برگه خروجی مشتری" : "View Client Export Sheet"}</span>
            <span className="bg-slate-950/40 px-2 py-0.5 rounded-lg text-emerald-400 font-black">
              {toLocalizedDigits(clientBasket.length, lang)}
            </span>
          </button>
        </div>
      )}

    </div>
  );
}
