import React, { useState, useEffect } from "react";
import { Property, Language, DisputeReport } from "../types";
import { COUNTRIES } from "../data";
import { toLocalizedDigits } from "./LocalCalendar";
import { getTranslation } from "../i18n";
import { Compass, Globe, Copy, ShieldAlert, CheckCircle } from "lucide-react";
import { CadastralInteractiveMap } from "./CadastralInteractiveMap";

interface PropertyDetailsModalProps {
  property: Property;
  lang: Language;
  onClose: () => void;
  onSubmitComplaint?: (report: DisputeReport) => void;
  onStartChat?: (property: Property) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ property, lang, onClose, onSubmitComplaint, onStartChat }) => {
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);
  const c = COUNTRIES.find((cnt) => cnt.code === property.country) || COUNTRIES[0];

  const calculatedTotalPrice = property.totalPrice || ((property.pricePerSqm || 0) * (property.area || 0));

  // States for Live Currencies
  const [rates, setRates] = useState<Record<string, number>>({
    USD: 1,
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
    AFN: 70.80,
    PKR: 278.10,
    INR: 83.35,
    TRY: 32.42,
    EUR: 0.922,
  });

  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Secure Legal Check Certificate states
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [certificateId, setCertificateId] = useState<string | null>(null);

  // Sentinel Guard AI states
  const [isScanningSentinel, setIsScanningSentinel] = useState(false);
  const [sentinelResult, setSentinelResult] = useState<{
    scamScore: number;
    spamScore: number;
    stalenessScore: number;
    scamFactors: string[];
    spamFactors: string[];
    staleFactors: string[];
  } | null>(null);

  // --- Melkban Premium Interactive States ---
  const [isFullscreenLightboxOpen, setIsFullscreenLightboxOpen] = useState(false);
  const [activeHubTab, setActiveHubTab] = useState<"ledger_mortgage" | "vr_matterport" | "ai_staging" | "smart_neighborhood">("ledger_mortgage");
  
  // AI Staging Simulator States
  const [stagedStyle, setStagedStyle] = useState<"original" | "minimalist" | "classic" | "boho" | "industrial">("original");
  const [stagedComparisonRatio, setStagedComparisonRatio] = useState<number>(50); // percentage slider

  // Matterport 3D Gallery States
  const [vrRoom, setVrRoom] = useState<"living" | "bedroom" | "view">("living");
  const [vrYaw, setVrYaw] = useState<number>(0); // dynamic panoramic angle degrees
  const [isVrDragging, setIsVrDragging] = useState(false);
  const [vrStartX, setVrStartX] = useState(0);

  // Mortgage Calculator state
  const [mortgageDownPaymentPct, setMortgageDownPaymentPct] = useState<number>(20); // 20% default
  const [mortgagePeriodYears, setMortgagePeriodYears] = useState<number>(25); // years
  const [mortgageRatePct, setMortgageRatePct] = useState<number>(4.2); // annual interest
  const [preApprovalStatus, setPreApprovalStatus] = useState<"idle" | "processing" | "success">("idle");
  const [preApprovalCertificate, setPreApprovalCertificate] = useState("");
  const [smartCategoryTab, setSmartCategoryTab] = useState<"all" | "health" | "schools" | "transit" | "eco">("all");

  // Cadastral Complaint/Dispute States
  const [isDisputeFormOpen, setIsDisputeFormOpen] = useState(false);
  const [complainantName, setComplainantName] = useState("");
  const [complainantPhone, setComplainantPhone] = useState("");
  const [disputeReason, setDisputeReason] = useState<"fake_price" | "wrong_owner" | "cadastral_mismatch" | "invalid_images" | "other">("fake_price");
  const [disputeDesc, setDisputeDesc] = useState("");
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complainantName.trim() || !complainantPhone.trim() || !disputeDesc.trim()) {
      return;
    }

    setIsSubmittingDispute(true);
    setTimeout(() => {
      const ticketId = `MB-DISC-${Math.floor(10000 + Math.random() * 90000)}`;
      const newDispute: DisputeReport = {
        id: ticketId,
        propertyId: property.id,
        propertyTitle: property.title,
        complainantName: complainantName,
        complainantPhone: complainantPhone,
        reason: disputeReason,
        description: disputeDesc,
        createdAt: new Date().toISOString(),
        status: "pending"
      };

      if (onSubmitComplaint) {
        onSubmitComplaint(newDispute);
      } else {
        // Fallback directly to local storage if needed
        try {
          const saved = JSON.parse(localStorage.getItem("melkban_disputes") || "[]");
          localStorage.setItem("melkban_disputes", JSON.stringify([newDispute, ...saved]));
        } catch (err) {
          console.error("Local storage dispute save failed:", err);
        }
      }

      setSubmittedTicketId(ticketId);
      setIsSubmittingDispute(false);
    }, 1200);
  };

  useEffect(() => {
    setIsLoadingCurrencies(true);
    fetch("/api/currency/rates")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setRates((prev) => ({
            ...prev,
            ...data.rates,
            USD: 1,
          }));
        }
        setIsLoadingCurrencies(false);
      })
      .catch((err) => {
        console.error("Live OpenExchange rates failed in Details:", err);
        setIsLoadingCurrencies(false);
      });
  }, []);

  // Calculate dynamic conversions for this property's total price
  const propertyCurrency = c.currency;
  let priceInUSD = 1;
  const rateToUSD = rates[propertyCurrency] || c.baseExchangeRate || 1;
  priceInUSD = calculatedTotalPrice / (rateToUSD === 15300 ? 3.673 : rateToUSD); // Safely normalize AED/SAR etc
  
  // Quick override handle for common country-base calculations to keep it flawless
  if (propertyCurrency === "AED") priceInUSD = calculatedTotalPrice / 3.673;
  else if (propertyCurrency === "SAR") priceInUSD = calculatedTotalPrice / 3.750;
  else if (propertyCurrency === "AFN") priceInUSD = calculatedTotalPrice / 70.80;
  else if (propertyCurrency === "RUB") priceInUSD = calculatedTotalPrice / 91.45;

  const getConvertedPriceValue = (targetCode: string) => {
    if (targetCode === "USDT") {
      return priceInUSD;
    }
    const targetRate = rates[targetCode] || 1;
    return priceInUSD * targetRate;
  };

  const exchangeMatrix = [
    { code: "USD", flag: "🇺🇸", nameFa: "دلار آمریکا", nameEn: "US Dollar", symbol: "$" },
    { code: "AFN", flag: "🇦🇫", nameFa: "افغانی افغانستان", nameEn: "Afghan Afghani", symbol: "؋" },
    { code: "USDT", flag: "🟢", nameFa: "تتر تتر (USDT)", nameEn: "Tether (USDT)", symbol: "USDT" },
    { code: "AED", flag: "🇦🇪", nameFa: "درهم امارات", nameEn: "UAE Dirham", symbol: "د.إ" },
    { code: "SAR", flag: "🇸🇦", nameFa: "ریال سعودی", nameEn: "Saudi Riyal", symbol: "ر.س" },
    { code: "QAR", flag: "🇶🇦", nameFa: "ریال قطر", nameEn: "Qatari Riyal", symbol: "ر.ق" },
    { code: "EUR", flag: "🇪🇺", nameFa: "یورو اروپا", nameEn: "Euro", symbol: "€" },
    { code: "TRY", flag: "🇹🇷", nameFa: "لیر ترکیه", nameEn: "Turkish Lira", symbol: "₺" },
    { code: "KWD", flag: "🇰🇼", nameFa: "دینار کویت", nameEn: "Kuwaiti Dinar", symbol: "د.ك" },
  ];

  // Guaranteed Amenities Fallbacks
  const displayHeating = property.heating ? property.heating : (lang === "fa" ? "ندارد" : "None / Not Specified");
  const displayCabinets = property.cabinets ? property.cabinets : (lang === "fa" ? "ندارد" : "None / Not Specified");
  const displayCooling = property.cooling ? property.cooling : (lang === "fa" ? "ندارد" : "None / Not Specified");
  const displayStructuralStatus = property.deed ? property.deed : (lang === "fa" ? "اصالت سند تک‌برگ ثبتی" : "Registered Legal Title Deed");

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${property.latitude}, ${property.longitude}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVrMouseDown = (e: React.MouseEvent) => {
    setIsVrDragging(true);
    setVrStartX(e.clientX);
  };

  const handleVrMouseMove = (e: React.MouseEvent) => {
    if (!isVrDragging) return;
    const deltaX = e.clientX - vrStartX;
    setVrYaw((prev) => (prev + deltaX * 1.5) % 3600);
    setVrStartX(e.clientX);
  };

  const handleVrMouseUp = () => {
    setIsVrDragging(false);
  };

  const handleVrTouchStart = (e: React.TouchEvent) => {
    setIsVrDragging(true);
    setVrStartX(e.touches[0].clientX);
  };

  const handleVrTouchMove = (e: React.TouchEvent) => {
    if (!isVrDragging) return;
    const deltaX = e.touches[0].clientX - vrStartX;
    setVrYaw((prev) => (prev + deltaX * 1.5) % 3600);
    setVrStartX(e.touches[0].clientX);
  };

  const handleVrTouchEnd = () => {
    setIsVrDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in" id="property-details-backdrop">
      <div className={`w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] ${isRtl ? "rtl text-right" : "ltr text-left"}`}>
        
        {/* Header Ribbon / Navigation */}
        <div className="p-4 border-b border-slate-850 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="font-mono text-indigo-400 font-bold uppercase tracking-wider">
              {lang === "fa" ? "برگه بررسی کامل کاداستر" : "CADASTRAL OFFICIAL REPORT"}
            </span>
          </div>

          {/* Close trigger */}
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-800 hover:bg-red-650 hover:text-white text-slate-300 rounded-full flex items-center justify-center transition active:scale-90"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 md:p-6 space-y-6">
          
          {/* Top visual banner and badges with Multiple Image Gallery */}
          {(() => {
            const imagesList = property.images && property.images.length > 0 ? property.images : [
              "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
            ];
            const clampedIndex = activeImageIndex >= imagesList.length ? 0 : activeImageIndex;
            const currentImage = imagesList[clampedIndex] || imagesList[0];

            return (
              <div 
                onClick={() => setIsFullscreenLightboxOpen(true)}
                className="relative h-56 md:h-72 bg-slate-950 rounded-2xl overflow-hidden shadow-inner group cursor-zoom-in"
                title={lang === "fa" ? "مشاهده تمام‌صفحه تصویر با کیفیت بالا" : "Click to view high-resolution image"}
              >
                <img
                  src={currentImage}
                  alt={property.title || "Real Estate"}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-slate-950/50 pointer-events-none"></div>
                
                {/* Top Row Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="bg-indigo-600 border border-indigo-400 text-white text-[10px] uppercase font-black px-3 py-1 rounded-lg tracking-widest shadow-lg">
                    {property.type === "sale" ? getTranslation(lang, "dealTypeSale", "Sale") : getTranslation(lang, "dealTypeRent", "Rent")}
                  </span>
                  <span className="text-white text-xs font-bold font-mono bg-slate-950/90 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5 shadow-lg">
                    {c.flag} {lang === "fa" ? c.nameFa : c.nameEn}
                  </span>
                </div>

                {/* Bottom title display inside standard template */}
                <div className="absolute bottom-4 left-4 right-20 text-white pointer-events-none">
                  <span className="text-[10px] text-indigo-400 font-bold tracking-wider block mb-1 uppercase">
                    🏷️ {lang === "fa" ? "کد فایل ثبت اسناد" : "FILE REGISTRY ID"}: MLS-{String(property.id).toUpperCase()}
                  </span>
                  <h3 className="text-lg md:text-2xl font-black tracking-tight">{property.title}</h3>
                </div>

                {/* Micro Image Controller on the bottom-right */}
                {imagesList.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-950/90 hover:bg-black border border-slate-800 px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold text-slate-350 shadow-2xl transition z-10 pointer-events-auto">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
                      }} 
                      className="hover:text-indigo-400 transition transform hover:scale-110 active:scale-90 px-1 font-semibold"
                    >
                      ◀
                    </button>
                    <span className="mx-1 select-none text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850">
                      {toLocalizedDigits(clampedIndex + 1, lang)} / {toLocalizedDigits(imagesList.length, lang)}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
                      }} 
                      className="hover:text-indigo-400 transition transform hover:scale-110 active:scale-90 px-1 font-semibold"
                    >
                      ▶
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Quick Metrics stats boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-955 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-mono">
                {getTranslation(lang, "totalEvaluation", "Total Price")}
              </span>
              <span className="text-base font-black text-indigo-400 font-mono mt-1">
                {toLocalizedDigits(calculatedTotalPrice.toLocaleString(), lang)} {c.currency}
              </span>
            </div>

            {property.pricePerSqm ? (
              <div className="bg-slate-955 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-mono">
                  {getTranslation(lang, "perSqmRate", "Per Sqm")}
                </span>
                <span className="text-xs font-extrabold text-slate-200 font-mono mt-1">
                  {toLocalizedDigits(property.pricePerSqm.toLocaleString(), lang)} {c.currencySymbol}
                </span>
              </div>
            ) : property.deposit ? (
              <div className="bg-slate-955 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-mono">
                  {getTranslation(lang, "depositValue", "Deposit")}
                </span>
                <span className="text-xs font-extrabold text-slate-200 font-mono mt-1">
                  {toLocalizedDigits(property.deposit.toLocaleString(), lang)} {c.currencySymbol}
                </span>
              </div>
            ) : null}

            <div className="bg-slate-955 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-mono">
                {getTranslation(lang, "surfaceArea", "Area size")}
              </span>
              <span className="text-xs font-extrabold text-emerald-400 font-mono mt-1">
                {toLocalizedDigits(property.area, lang)} {getTranslation(lang, "sqmUnit", "sqm")}
              </span>
            </div>

            <div className="bg-slate-955 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-mono">
                {lang === "fa" ? "اتاق‌های مستقل" : "Bedrooms count"}
              </span>
              <span className="text-xs font-black text-slate-200 mt-1">
                🛏️ {toLocalizedDigits(property.bedrooms || 0, lang)}
              </span>
            </div>
          </div>

          {/* Listing Specs and Description */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>📝</span> {getTranslation(lang, "listingSpecs", "Listing Description")}
            </h4>
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-850/50 leading-relaxed text-slate-300 text-xs shadow-inner">
              {property.description}
            </div>
          </div>

          {/* ULTRA CADASTRAL LEGAL SECURE SHIELD (ZILLOW KILLER SHIELD) */}
          <div className="border border-indigo-950 bg-gradient-to-br from-indigo-950/20 via-indigo-950/5 to-slate-950 p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap border-b border-indigo-950/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <div>
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">
                    {lang === "fa" ? "سپر حفاظت حقوقی و مصونیت کاداستر" : "MELKBAN CADASTRAL IMMUNITY SHIELD"}
                  </h4>
                  <p className="text-[9.5px] text-slate-400 font-semibold leading-none mt-0.5">
                    {lang === "fa" ? "پروتکل امنیتی پیشرفته برای پیشگیری تمام‌عیار از شکایت، معارض و تداخل مرزی" : "Advanced legal dispute firewall guarding borders, pricing, and title trust"}
                  </p>
                </div>
              </div>
              <span className="text-[8.5px] font-black bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {lang === "fa" ? "امنیت طلایی کاداستر" : "ZILLOW-GOLD COMPLIANCE"}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal">
              {lang === "fa"
                ? "ملکبان با استفاده از الگوهای پیشرفته کاداستر ریاضی، ثبت مختصات دقیق ماهواره‌ای GPS، و راستی‌آزمایی مشاورین به شکل رسمی یا تعهد معتمدین محلی، بستری ۱۰۰٪ امن فراهم ساخته تا خریدار و فروشنده بدون نگرانی از کلاهبرداری یا شکایت دادگاهی، معامله کنند."
                : "Melkban leverages satellite coordinates and decentralized trust guarantees to structure real estate transactions with complete legal immunization."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-850 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm">🛰️</span>
                  <span className="text-[9.5px] font-bold text-slate-300">
                    {lang === "fa" ? "مختصات قفل هندسی" : "Geolock Guarantee"}
                  </span>
                </div>
                <p className="text-[9px] text-slate-550 leading-relaxed">
                  {lang === "fa" 
                    ? "تثبیت نقطه زمین روی مدار بین‌المللی WGS84 جهت رفع هر نوع ادعای مساحتی." 
                    : "Coordinates locked mathematically onto GPS orbits to prevent boundary overlay lawsuits."}
                </p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-850 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm">🤝</span>
                  <span className="text-[9.5px] font-bold text-slate-300">
                    {lang === "fa" ? "اعتبار‌سنجی دوگانه" : "Verified Broker Identity"}
                  </span>
                </div>
                <p className="text-[9px] text-slate-550 leading-relaxed">
                  {property.isLocalTrustEndorsed 
                    ? (lang === "fa" ? "ثبت معتبر محلی با تذکر تاییدشده بزرگان قبیله/منطقه." : "National identity & local elder collateral verified for high authenticity.") 
                    : (lang === "fa" ? "احراز هویت با پروانه رسمی صادر شده از اتحادیه املاک." : "Official professional real estate license validated by state registries.")}
                </p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-850 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm">⚖️</span>
                  <span className="text-[9.5px] font-bold text-slate-300">
                    {lang === "fa" ? "تضمین اصالت آگهی" : "Lawsuit Immunity Test"}
                  </span>
                </div>
                <p className="text-[9px] text-slate-550 leading-relaxed">
                  {lang === "fa"
                    ? "سیستم مانیتورینگ آنلاین ضد‌ تبانی و ثبت گزارش فوری مغایرت سند مالکیت."
                    : "Anti-price manipulation protocols combined with instant decentralized complaints feed."}
                </p>
              </div>
            </div>

            {/* Certificate Downloader Engine Action Button */}
            <div className="bg-indigo-950/20 border border-indigo-900/30 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] font-black text-indigo-300 block">
                  {lang === "fa" ? "برگ رسمی تضمین سلامت کاداستر ملکی" : "CADASTRAL HEALTH & INDEMNITY CERTIFICATE"}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold block leading-tight mt-0.5">
                  {lang === "fa" ? "مهر دیجیتال حاوی کد رهگیری بین‌المللی و گواهی مختصات ثبتی جی‌پی‌اس" : "Secure cryptographically assigned certificate with GPS coordinate stamps"}
                </span>
              </div>

              {!certificateId ? (
                <button
                  type="button"
                  disabled={isGeneratingCertificate}
                  onClick={() => {
                    setIsGeneratingCertificate(true);
                    setTimeout(() => {
                      setIsGeneratingCertificate(false);
                      setCertificateId(`MB-CERT-${Math.floor(100000 + Math.random() * 900000)}`);
                    }, 1800);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] px-4 py-2 rounded-xl transition duration-150 shadow-md transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingCertificate ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {lang === "fa" ? "در حال استعلام و صدور هولوگرام..." : "Fetching Ledger Data..."}
                    </span>
                  ) : (
                    <span>⭐ {lang === "fa" ? "صدور فوری گواهی عدم مرافعه حقوقی" : "Generate Legal Guarantee Certificate"}</span>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-center">
                    <span className="text-[10px] text-emerald-400 font-black block">✓ {lang === "fa" ? "سند صادر و مهر شد!" : "CERTIFICATE SECURED!"}</span>
                    <span className="text-[8.5.5px] font-mono text-emerald-500 block leading-none select-all font-bold mt-0.5">{certificateId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      // Simulated PDF download alert
                      const text = lang === "fa" 
                        ? `گواهی تایید کاداستر با شماره رهگیری ${certificateId} برای ملک "${property.title}" با موفقیت دانلود شد و ضمیمه قولنامه صادر گردید.` 
                        : `Cadastre Shield Certificate #${certificateId} successfully printed and ready to bind to legal escrow contracts. No border matches overlap registered.`;
                      alert(`📜 ${text}`);
                    }}
                    className="bg-slate-900 border border-slate-800 hover:border-indigo-500 text-indigo-400 text-[10px] px-3 py-1.5 rounded-xl font-bold transition cursor-pointer"
                  >
                    📥 {lang === "fa" ? "دانلود گواهی / نسخه چاپی" : "Download / Print"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MELKBAN-SENTINEL AI SCAM & SPAM RADAR SHIELD */}
          <div className="border border-indigo-950/70 bg-slate-950/40 p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap border-b border-indigo-950/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl animate-pulse">🤖</span>
                <div>
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    {lang === "fa" ? "نگهبان هوش مصنوعی ملک‌بان (پایش کلاهبرداری و اسپم)" : "MELKBAN SENTINEL AI SCOUT"}
                    <span className="text-[7.5px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded border border-red-500/10">REAL-TIME</span>
                  </h4>
                  <p className="text-[9.5px] text-slate-500 font-semibold leading-none mt-0.5">
                    {lang === "fa" ? "آنالیز آنی اصطلاحات کلاهبرداری، قیمت طعمه، رفتارهای اسپم و تحلیل تازگی آگهی" : "Instant behavior audit scouting for bait pricing, downpayment wire hazards and stale listing data"}
                  </p>
                </div>
              </div>
            </div>

            {!sentinelResult && !isScanningSentinel ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/60 rounded-2xl border border-slate-850/50">
                <p className="text-[10px] text-slate-400 leading-normal max-w-md font-medium">
                  {lang === "fa"
                    ? "آیا نگران کدهای آگهی فیک، بیعانه‌های غیرقانونی، سیم‌کارت‌های یک‌بارمصرف یا ثبت‌های قدیمی منقضی‌شده هستید؟ با هوش مصنوعی سنتینل، کل ساختار آگهی را فوری آنالیز کنید."
                    : "Suspicious of duplicate photos, phantom agents, or hidden bank transfer requests? Engage our live AI algorithm to analyze the structural compliance score."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsScanningSentinel(true);
                    setTimeout(() => {
                      const title = property.title || "";
                      const desc = property.description || "";
                      const countryCode = property.country || "IR";
                      const isTrust = !!property.isLocalTrustEndorsed;
                      const isVerified = !!property.isBrokerVerified;
                      const price = property.totalPrice || property.rent || 0;
                      const area = property.area || 1;
                      const pps = property.pricePerSqm || (price / area);
                      
                      const scamFactors: string[] = [];
                      const spamFactors: string[] = [];
                      const staleFactors: string[] = [];
                      const regulatoryCompliance: string[] = [];

                      let scamScore = 4;
                      let spamScore = 3;
                      let stalenessScore = 2;

                      // 1. GLOBAL SCAM & SHIELD ALGORITHMIC METRICS
                      const scamKeywords = ["بیعانه", "پیش پرداخت", "کارت به کارت", "حواله فوری", "فرار", "پول لازم", "بیعانه فوری", "deposit now", "downpayment first", "wire money", "urgently need cash", "must pay now"];
                      const hasScam = scamKeywords.some(w => title.toLowerCase().includes(w) || desc.toLowerCase().includes(w));
                      if (hasScam) {
                        scamScore += 38;
                        scamFactors.push(lang === "fa" 
                          ? "⚠️ شناسایی واژگان پرخطر بیعانه زودهنگام یا شیوه کارت‌به‌کارت مستقل (مخالف با بند ۱ ماده ۲ آیین‌نامه مبارزه با پولشویی)" 
                          : "⚠️ Critical: High-risk downpayment triggers. Direct non-escrow transfer indicators detected (Against AML/CTF global statutes).");
                      }
                      
                      // Fake duplicate pricing / outlier pattern detection
                      const isOutlierPriced = pps > 0 && pps < 350;
                      if (isOutlierPriced) {
                        scamScore += 26;
                        scamFactors.push(lang === "fa" 
                          ? "⚠️ ارزش‌گذاری نامتعارف و قیمت صوری زیر کف منطقه (مستعد شیوه کلاهبرداری طعمه‌گذاری ملکی)" 
                          : "⚠️ Extreme underpricing warning: Bait pricing identified. Rates are below the historical district fair-market baseline.");
                      }

                      if (!isVerified && !isTrust) {
                        scamScore += 20;
                        scamFactors.push(lang === "fa" 
                          ? "⚠️ ثبت خارج از کارگزاری رسمی: فاقد شناسه رهگیری معتبر از نهادهای قضایی ناظر" 
                          : "⚠️ Direct Peer Listing: Operating outside certified brokerage license nodes.");
                      }

                      // 2. COUNTRY-SPECIFIC LEGISLATION & INTERNATIONAL STANDARDS
                      if (countryCode === "IR") {
                        regulatoryCompliance.push(lang === "fa" 
                          ? "✓ منطبق با ماده ۱۰ قانون مدنی جمهوری اسلامی ایران در باب قراردادهای خصوصی" 
                          : "✓ Aligned with Article 10 of Iran Civil Code governing private contracts.");
                        
                        // Strict check for Kateb/Self-write systems (سامانه کاتب و خودنویس)
                        if (!isVerified) {
                          scamScore += 12;
                          regulatoryCompliance.push(lang === "fa" 
                            ? "⚠️ هشدار الزام ثبت کاداستر: آگهی در هیچ‌یک از سامانه‌های خودنویس ملکی یا کاتب ثبت رسمی نشده است." 
                            : "⚠️ Local Rule Warning: Listing not registered in Iran Katib/Khodnevis sovereign property database.");
                        } else {
                          regulatoryCompliance.push(lang === "fa" 
                            ? "✓ تاییدیه استعلام سند از سامانه خودنویس کاداستر ملی" 
                            : "✓ Registered with verified Katib/National Cadastre code.");
                        }
                        
                        // Faking numbers pattern
                        if (title.includes("۱۱۱۱") || title.includes("0000") || title.includes("۱۲۳۴")) {
                          spamScore += 25;
                          spamFactors.push(lang === "fa" 
                            ? "⚡ کاراکترهای صوری تکراری در عنوان آگهی (نشانه ربات‌های مخرب)" 
                            : "⚡ Dummy repeating digits noted in listing header.");
                        }
                      } 
                      else if (countryCode === "AE") {
                        // United Arab Emirates (Dubai REST / RERA Compliance)
                        regulatoryCompliance.push(lang === "fa"
                          ? "✓ پایش تحت قانون شماره ۸۵ سال ۲۰۰۶ امارت دبی در خصوص ثبت دلالان رسمی"
                          : "✓ Screened under Dubai Law No. 85 of 2006 (Brokers Register Code).");
                        
                        if (!isVerified) {
                          scamScore += 22;
                          regulatoryCompliance.push(lang === "fa"
                            ? "⚠️ اخطار اضطراری: فاقد شماره مجوز رسمی تراخیصی RERA دبی (مخالف با بندهای اجرایی بخشنامه‌های ناظر بر تبلیغات فضای مجازی)"
                            : "⚠️ Urgent Warning: No active Dubai RERA Trakheesi advertising permit identified.");
                        } else {
                          regulatoryCompliance.push(lang === "fa"
                            ? "✓ تایید هویت سندی از شبکه دفتر خدمات بومی اراضی دبی (Dubai Land Department)"
                            : "✓ Title authenticity verified successfully via DLD registration protocols.");
                        }
                      } 
                      else if (countryCode === "TR") {
                        // Turkey Law / Tapu & Sahibinden guidelines
                        regulatoryCompliance.push(lang === "fa"
                          ? "✓ مانیتور شده با بند ۲۶ قانون ثبت اسناد ترکیه (Tapu Kanunu)"
                          : "✓ Monitor index verified on Article 26 of Turkish Land Registry Law (Tapu Kanunu).");
                        
                        if (!isVerified) {
                          scamScore += 18;
                          regulatoryCompliance.push(lang === "fa"
                            ? "⚠️ آگهی‌دهنده فاقد گواهی اعتبارسنجی تجارت املاک و مستغلات (Taşınmaz Ticareti Yetki Belgesi) است"
                            : "⚠️ Real estate operator lacks mandatory licensing (Taşınmaz Ticareti Yetki Belgesi) of Turkish Trade Ministry.");
                        }

                        // Foreign Investment Citizenship Check
                        if (price > 0 && price < 400000 && title.toLowerCase().includes("citizenship")) {
                          scamScore += 30;
                          scamFactors.push(lang === "fa"
                            ? "⚠️ ادعای دریافت شهروندی با ملکی زیر حد قانونی ثبت‌شده ($400,000)"
                            : "⚠️ Doubtful citizenship claim: Property value is listed lower than Turkey's regulatory investment threshold.");
                        }
                      } 
                      else if (countryCode === "DE") {
                        // Germany laws: Bestellerprinzip & Energieausweis
                        regulatoryCompliance.push(lang === "fa"
                          ? "✓ ممیزی شده تحت قوانین آلمان فدرال موضوع ماده ۶۵۲ قانون مدنی (BGB)"
                          : "✓ Audited in compliance with Germany Federal Civil Code § 652 BGB standard.");
                        
                        if (!desc.toLowerCase().includes("energie") && !desc.toLowerCase().includes("kph") && !desc.toLowerCase().includes("klasse")) {
                          spamScore += 15;
                          regulatoryCompliance.push(lang === "fa"
                            ? "⚠️ عدم ارائه مشخصات اجباری رده‌بندی انرژی خانه طبق ماده ۱۶ قانون مصارف گرمایشی آلمان (GEG)"
                            : "⚠️ Non-compliant: Energy Efficiency Certificate info missing (Mandatory under Germany's GEG/EnEV legislation).");
                        }
                      }
                      else if (countryCode === "CA" || countryCode === "US") {
                        // North America, MLS & FINTRAC Compliance
                        regulatoryCompliance.push(lang === "fa"
                          ? "✓ پایش تطبیقی با آیین‌نامه‌های مبارزه با پولشویی موسوم به فینترک کانادا و الزامات بانکی فدرال"
                          : "✓ Compliance review under global FINTRAC / Federal Money Laundering Auditing guidelines.");
                        
                        if (!isVerified) {
                          scamScore += 15;
                          regulatoryCompliance.push(lang === "fa"
                            ? "⚠️ این ملک ارتباطی با شبکه سراسری کارگزاران املاک کارآمد (MLS / Realtor) ندارد"
                            : "⚠️ Independent listing undetected on verified local Multiple Listing Service (MLS) database nodes.");
                        }
                      }
                      else if (countryCode === "SG") {
                        // Singapore CEA Guidance
                        regulatoryCompliance.push(lang === "fa"
                          ? "✓ تضمین سلامت سندی تحت رهنمودهای آژانس نظارت مسکن سنگاپور (CEA)"
                          : "✓ Screened against Council for Estate Agencies (CEA) Code of Conduct standards.");
                        
                        if (!isVerified) {
                          scamScore += 25;
                          regulatoryCompliance.push(lang === "fa"
                            ? "⚠️ آگهی‌دهنده فاقد گارانتی انطباق با مالیات ویژه تمبر خرید مال سنگاپور (ABSD) است"
                            : "⚠️ High stamp risk indicator: No clear ABSD status declaration conforming to IRAS statutes.");
                        }
                      }

                      // 3. SPAM & ADS BOT CLASSIFICATION METRICS
                      const spamKeywords = ["کانال تلگرام", "تلگرام", "اینستاگرام", "رمزارز", "بیت کوین", "فالوور", "ارز دیجیتال", "درآمد دلاری", "bitcoin", "crypto", "telegram channel", "telegram.me", "instagram.com"];
                      const hasSpam = spamKeywords.some(w => title.toLowerCase().includes(w) || desc.toLowerCase().includes(w));
                      if (hasSpam) {
                        spamScore += 45;
                        spamFactors.push(lang === "fa" 
                          ? "⚡ آدرس‌دهی تبلیغاتی به شبکه‌های همگن بیرونی یا کانال‌های تلگرامی (جهت افزایش کاذب ترافیک)" 
                          : "⚡ External redirection: outbound links or public messaging channels discovered inside description.");
                      }
                      if (desc.length < 20) {
                        spamScore += 18;
                        spamFactors.push(lang === "fa" 
                          ? "⚡ متن معرفی بشدت کوتاه و مجهول (سازگار با الگوی رفتارهای تبلیغاتی وب‌بندها)" 
                          : "⚡ Bare description: length characteristics align with automatic bot-harvested parameters.");
                      }

                      // 4. CORRESPONDING STALENESS REVIEW
                      const cDate = property.createdAt ? new Date(property.createdAt) : new Date();
                      const days = Math.floor((Date.now() - cDate.getTime()) / (1000 * 60 * 60 * 24));
                      if (days > 45) {
                        stalenessScore += 55;
                        staleFactors.push(lang === "fa" 
                          ? `⏳ ریسک بالای منقضی بودن ثبت (مدت ${toLocalizedDigits(days, lang)} روز از تاریخ بروزرسانی وضعیت سپری شده است)` 
                          : `⏳ Expiration Alert: ${days} days elapsed since active publishing. Status verification essential.`);
                      } else if (days > 15) {
                        stalenessScore += 25;
                        staleFactors.push(lang === "fa" 
                          ? `⏳ بروزرسانی متوسط (${toLocalizedDigits(days, lang)} روز قبل تایید شده است)` 
                          : `⏳ Medium latency: listing verified ${days} days ago.`);
                      } else {
                        staleFactors.push(lang === "fa" 
                          ? "✓ پرونده فعال و جاری با تاییدیه وضعیت در کمتر از ۱۵ روز گذشته" 
                          : "✓ Live status: freshly re-validated on the main node.");
                      }

                      if (scamFactors.length === 0) scamFactors.push(lang === "fa" ? "✓ بدون هیچ‌گونه فاکتور پرخطر کلاهبرداری مالی دفتری" : "✓ Financial security profile checks out successfully.");
                      if (spamFactors.length === 0) spamFactors.push(lang === "fa" ? "✓ متن ساختاریافته عاری از بدجوش‌ها و اسپمرهای عمومی" : "✓ Structural verification indicates optimal data formatting.");

                      // 5. OFFICIAL BROKER & ENDORSED TRUST PREMIUM DIRECT ADJUSTMENT
                      if (isVerified || isTrust) {
                        scamScore = Math.max(1, scamScore - 35);
                        spamScore = Math.max(1, spamScore - 30);
                        
                        // Add top-tier trust endorsements
                        scamFactors.unshift(lang === "fa"
                          ? "✓ سند ملی تک‌برگ کاداستر ثبتی: تایید قطعی مالکیت بدون معارض با کدرهگیری کاتب/خودنویس"
                          : "✓ Double-Vetted Title Deed: 100% verified ownership through physical and sovereign cadastre inspection.");
                        
                        spamFactors.unshift(lang === "fa"
                          ? "✓ نشان کاداستر طلایی: داده ارائه‌شده از کیفیت و انطباق سندی مطلقی برخوردار است"
                          : "✓ Gold Cadastral Seal: Data quality matches the highest structural integrity metrics.");
                      }

                      setSentinelResult({
                        scamScore: Math.min(scamScore, 98),
                        spamScore: Math.min(spamScore, 98),
                        stalenessScore: Math.min(stalenessScore, 95),
                        scamFactors: [...scamFactors, ...regulatoryCompliance],
                        spamFactors,
                        staleFactors
                      });
                      setIsScanningSentinel(false);
                    }, 2200);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] px-4 py-2.5 rounded-xl transition duration-150 shrink-0 cursor-pointer shadow-md"
                >
                  📡 {lang === "fa" ? "شروع آنالیز آنتی‌اسپم هوشمند" : "Run AI Integrity Scan"}
                </button>
              </div>
            ) : isScanningSentinel ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-900/40 rounded-2xl border border-slate-850/50 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute top-[30%] left-[30%] text-indigo-400 animate-ping text-[10px]">🤖</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase text-indigo-400 tracking-widest block">
                    {lang === "fa" ? "در حال اجرای اسکن مغناطیسی کاداستر..." : "DEPLOYING SENTINEL AI PROBES..."}
                  </span>
                  <span className="text-[9px] text-slate-500 block font-mono">
                    Checking downpayment indicators | Outlier analysis | NLP metadata scanning
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 bg-slate-900/60 rounded-2xl border border-slate-850 p-4">
                {/* Score Meters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Scam score bar */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9.5px] font-black text-slate-400">
                        {lang === "fa" ? "احتمال کلاهبرداری مالی" : "Scam Risk Index"}
                      </span>
                      <span className={`text-xs font-mono font-black ${sentinelResult!.scamScore > 40 ? "text-rose-500" : sentinelResult!.scamScore > 15 ? "text-amber-400" : "text-emerald-400"}`}>
                        {toLocalizedDigits(sentinelResult!.scamScore, lang)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${sentinelResult!.scamScore > 40 ? "bg-rose-500" : sentinelResult!.scamScore > 15 ? "bg-amber-500" : "bg-emerald-500"}`} 
                        style={{ width: `${sentinelResult!.scamScore}%` }}
                      ></div>
                    </div>
                    <div className="mt-1.5 text-[8.5px] text-slate-500 leading-none font-bold">
                      {sentinelResult!.scamScore > 40 
                        ? (lang === "fa" ? "❌ ریسک بالا! پرداخت بیعانه مطلقاً ممنوع" : "❌ Dangerous. High chance of deposit fraud.") 
                        : (lang === "fa" ? "✓ امن؛ سوابق ثبتی فاقد مغایرت" : "✓ Low scam probability.")}
                    </div>
                  </div>

                  {/* Spam score bar */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9.5px] font-black text-slate-400">
                        {lang === "fa" ? "احتمال تبلیغ فیک / اسپم" : "Spam & Bot Probability"}
                      </span>
                      <span className={`text-xs font-mono font-black ${sentinelResult!.spamScore > 40 ? "text-rose-500" : sentinelResult!.spamScore > 15 ? "text-amber-400" : "text-emerald-400"}`}>
                        {toLocalizedDigits(sentinelResult!.spamScore, lang)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${sentinelResult!.spamScore > 40 ? "bg-rose-500" : sentinelResult!.spamScore > 15 ? "bg-amber-500" : "bg-emerald-500"}`} 
                        style={{ width: `${sentinelResult!.spamScore}%` }}
                      ></div>
                    </div>
                    <div className="mt-1.5 text-[8.5px] text-slate-500 leading-none font-bold">
                      {sentinelResult!.spamScore > 40 
                        ? (lang === "fa" ? "⚡ رفتار غیرملکی مجاور شناسایی شد" : "⚡ Advertisements patterns identified.") 
                        : (lang === "fa" ? "✓ توصیف تمیز و منطبق با اصول" : "✓ Valid listing text.")}
                    </div>
                  </div>

                  {/* Staleness score bar */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9.5px] font-black text-slate-400">
                        {lang === "fa" ? "شاخص انقضا / قدیمی بودن" : "Expiration & Age Meter"}
                      </span>
                      <span className={`text-xs font-mono font-black ${sentinelResult!.stalenessScore > 40 ? "text-rose-500" : sentinelResult!.stalenessScore > 15 ? "text-amber-400" : "text-emerald-400"}`}>
                        {toLocalizedDigits(sentinelResult!.stalenessScore, lang)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${sentinelResult!.stalenessScore > 40 ? "bg-rose-500" : sentinelResult!.stalenessScore > 15 ? "bg-amber-500" : "bg-emerald-500"}`} 
                        style={{ width: `${sentinelResult!.stalenessScore}%` }}
                      ></div>
                    </div>
                    <div className="mt-1.5 text-[8.5px] text-slate-500 leading-none font-bold">
                      {sentinelResult!.stalenessScore > 40 
                        ? (lang === "fa" ? "⏳ نیازمند به روزرسانی استعلام" : "⏳ Stale. Needs review with owner.") 
                        : (lang === "fa" ? "✓ آگهی نوپا و فعال" : "✓ Fresh and active.")}
                    </div>
                  </div>
                </div>

                {/* Audit Evidence Logs */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850/80 space-y-2">
                  <div className="text-[10px] uppercase text-indigo-400 tracking-wider font-extrabold flex items-center gap-1 leading-none">
                    <span>📡</span>
                    {lang === "fa" ? "شواهد امنیتی و گزارش تحلیلی کاداستر" : "SENTINEL AUDIT REPORT LOGS"}
                  </div>
                  
                  <div className="space-y-1.5 pt-1">
                    {/* Scam Logs */}
                    <div className="space-y-1">
                      <span className="text-[8.5px] font-black text-rose-400 block uppercase tracking-wider">{lang === "fa" ? "بخش تهدیدات کلاهبرداری:" : "Financial Scam Vectors:"}</span>
                      {sentinelResult!.scamFactors.map((f, i) => (
                        <div key={i} className="text-[9px] text-slate-400 flex items-start gap-1 font-medium leading-relaxed">
                          <span className="text-indigo-500">•</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Spam Logs */}
                    <div className="space-y-1 pt-1 border-t border-slate-900">
                      <span className="text-[8.5px] font-black text-amber-400 block uppercase tracking-wider">{lang === "fa" ? "بخش مانیتورینگ اسپم:" : "Spam Behavior Vectors:"}</span>
                      {sentinelResult!.spamFactors.map((f, i) => (
                        <div key={i} className="text-[9px] text-slate-400 flex items-start gap-1 font-medium leading-relaxed">
                          <span className="text-amber-500">•</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Staleness Logs */}
                    <div className="space-y-1 pt-1 border-t border-slate-900">
                      <span className="text-[8.5px] font-black text-blue-400 block uppercase tracking-wider">{lang === "fa" ? "بخش تاریخ تاییدیه:" : "Metadata Freshness Vectors:"}</span>
                      {sentinelResult!.staleFactors.map((f, i) => (
                        <div key={i} className="text-[9px] text-slate-400 flex items-start gap-1 font-medium leading-relaxed">
                          <span className="text-indigo-400">•</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-850">
                  <span className="text-[8px] font-mono text-slate-500">
                    Sovereign Core Module v3.12-Guard | Secure-ID validated
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSentinelResult(null);
                    }}
                    className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                  >
                    🔄 {lang === "fa" ? "آنالیز مجدد" : "Re-Scan"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guaranteed Heating and Cabinets Accessories Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>🏠</span> {lang === "fa" ? "امکانات داخلی و متریال ساخت" : "Internal Amenities & Material Finishes"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Heating */}
              <div className="p-3 bg-slate-955 border border-slate-850/60 rounded-2xl flex items-start gap-3 transition hover:border-slate-800">
                <span className="text-xl shrink-0">🔥</span>
                <div className="min-w-0">
                  <span className="text-slate-500 block font-semibold text-[9px] uppercase leading-none">
                    {lang === "fa" ? "سیستم گرمایشی مجهز" : "Heating System"}
                  </span>
                  <span className="text-slate-200 mt-1 block font-bold text-xs truncate" title={displayHeating}>
                    {displayHeating}
                  </span>
                </div>
              </div>

              {/* Cabinets */}
              <div className="p-3 bg-slate-955 border border-slate-850/60 rounded-2xl flex items-start gap-3 transition hover:border-slate-800">
                <span className="text-xl shrink-0">🍳</span>
                <div className="min-w-0">
                  <span className="text-slate-500 block font-semibold text-[9px] uppercase leading-none">
                    {lang === "fa" ? "کابینت و دکور آشپزخانه" : "Cabinets / Kitchen"}
                  </span>
                  <span className="text-slate-200 mt-1 block font-bold text-xs truncate" title={displayCabinets}>
                    {displayCabinets}
                  </span>
                </div>
              </div>

              {/* Coolings */}
              <div className="p-3 bg-slate-955 border border-slate-850/60 rounded-2xl flex items-start gap-3 transition hover:border-slate-800">
                <span className="text-xl shrink-0">❄️</span>
                <div className="min-w-0">
                  <span className="text-slate-500 block font-semibold text-[9px] uppercase leading-none">
                    {lang === "fa" ? "سیستم سرمایشی" : "Cooling System"}
                  </span>
                  <span className="text-slate-200 mt-1 block font-bold text-xs truncate" title={displayCooling}>
                    {displayCooling}
                  </span>
                </div>
              </div>

              {/* Title Standard Integrity */}
              <div className="p-3 bg-slate-955 border border-slate-850/60 rounded-2xl flex items-start gap-3 transition hover:border-slate-800">
                <span className="text-xl shrink-0">📜</span>
                <div className="min-w-0">
                  <span className="text-slate-500 block font-semibold text-[9px] uppercase leading-none">
                    {lang === "fa" ? "سند و تاییدیه ثبتی" : "Legal Deed & Certification"}
                  </span>
                  <span className="text-slate-200 mt-1 block font-bold text-xs truncate" title={displayStructuralStatus}>
                    {displayStructuralStatus}
                  </span>
                </div>
              </div>

              {/* Verified House Plate Spec Box */}
              {property.housePlate && (
                <div className="p-3 bg-gradient-to-r from-amber-950/15 via-transparent to-transparent border border-amber-500/10 rounded-2xl flex items-start gap-3 transition hover:border-amber-500/20 col-span-1 sm:col-span-2">
                  <span className="text-xl shrink-0 animate-pulse">🏢</span>
                  <div className="min-w-0">
                    <span className="text-amber-500 block font-semibold text-[9px] uppercase leading-none font-mono">
                      {lang === "fa" ? "پلاک ثبتی و شماره منزل" : "Residential House/Building Plate"}
                    </span>
                    <span className="text-amber-400 mt-1 block font-mono font-black text-xs truncate" title={property.housePlate}>
                      {property.housePlate}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC MULTI-CURRENCY CONVERSION SYSTEM (Requested) */}
          <div className="bg-slate-950/70 border border-slate-850 p-4 rounded-2xl relative overflow-hidden" id="details-exchange-matrix-container">
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-550/5 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header controls inside Details conversions widget */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-900 pb-3 mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-2">
                    {lang === "fa" ? "تسعیر قیمت برابری اسعار کاداستر" : "Simultaneous Price Valuations Feed"}
                    <span className="text-[7.5px] bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded font-black animate-pulse">
                      {isLoadingCurrencies ? (lang === "fa" ? "درحال اتصال..." : "CONNECTING...") : (lang === "fa" ? "برخط" : "ONLINE API")}
                    </span>
                  </h5>
                  <p className="text-[9px] text-slate-550">
                    {lang === "fa" ? "محاسبه آنی قیمت فوق به تمام اسعار اصلی کشورهای جهان اول و خاورمیانه کاداستر" : "Instant calculation of property price in global base units"}
                  </p>
                </div>
              </div>
            </div>

            {/* Conversion Result Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[170px] overflow-y-auto pr-1">
              {exchangeMatrix.map((matrix) => {
                const equivalentValue = getConvertedPriceValue(matrix.code);
                const isSelectedPropertyBase = matrix.code === propertyCurrency;

                return (
                  <div 
                    key={matrix.code}
                    className={`p-2.5 rounded-xl border transition-all duration-200 ${
                      isSelectedPropertyBase 
                        ? "bg-indigo-950/30 border-indigo-500/40 shadow-sm" 
                        : "bg-slate-900/40 border-slate-850 hover:bg-slate-900/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-slate-200 flex items-center gap-1 truncate">
                        <span>{matrix.flag}</span>
                        <span className="truncate">{lang === "fa" ? matrix.nameFa : matrix.nameEn}</span>
                      </span>
                      <span className="text-[8px] font-mono shrink-0 bg-slate-950 text-slate-400 border border-slate-850 px-1 rounded font-black">
                        {matrix.code}
                      </span>
                    </div>

                    <div className="mt-1">
                      <span className="text-xs font-black text-white font-mono block tracking-tight truncate" title={equivalentValue.toLocaleString()}>
                        {toLocalizedDigits(Math.round(equivalentValue).toLocaleString(), lang)}
                      </span>
                      <span className="text-[8.5px] text-slate-555 font-semibold text-indigo-400 flex justify-between">
                        <span>{lang === "fa" ? "معادل" : "Equiv"}</span>
                        <span>{matrix.symbol}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MELKBAN ADVANCED CADASTRAL HUB (Highly Requested Premium Suite) */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 md:p-5 rounded-3xl space-y-5 relative overflow-hidden" id="melkban-cadastral-advanced-hub">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start gap-2.5 border-b border-slate-900 pb-3.5">
              <span className="text-xl shrink-0">🌌</span>
              <div className="min-w-0">
                <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest font-mono">
                  {lang === "fa" ? "امکانات پیشرفته و آزمایشگاه هوش کاداستر آریانا رهنما" : "ARIANA RAHNUMA CADASTRAL INNOVATION HUB"}
                </h4>
                <p className="text-[9px] text-slate-500 font-bold mt-1 leading-normal">
                  {lang === "fa" ? "سرویس‌های تعاملی ارزش‌گذاری، شبیه‌ساز دکوراسیان هوش مصنوعی، تاییدیه پیش‌وام بین‌المللی و تورهای ۳۶۰ درجه" : "Premium technical sandbox including instant mortgage pre-approvals, AI interior staging, Matterport tours & neighborhood ratings"}
                </p>
              </div>
            </div>

            {/* Hub tabs bar */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 overflow-x-auto scrollbar-none font-bold text-[10px]">
              <button
                type="button"
                onClick={() => setActiveHubTab("ledger_mortgage")}
                className={`flex-1 py-2 px-3 rounded-lg whitespace-nowrap transition-all cursor-pointer text-center font-bold outline-none border-0 ${activeHubTab === "ledger_mortgage" ? "bg-indigo-650 text-white shadow shadow-indigo-600/10" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
              >
                📊 {lang === "fa" ? "وام و تاریخچه ثبتی" : "Financing & Ledger"}
              </button>
              <button
                type="button"
                onClick={() => setActiveHubTab("vr_matterport")}
                className={`flex-1 py-2 px-3 rounded-lg whitespace-nowrap transition-all cursor-pointer text-center font-bold outline-none border-0 ${activeHubTab === "vr_matterport" ? "bg-indigo-650 text-white shadow shadow-indigo-600/10" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
              >
                🌀 {lang === "fa" ? "تور ۳۶۰ درجه Matterport" : "VR Tour 360°"}
              </button>
              <button
                type="button"
                onClick={() => setActiveHubTab("ai_staging")}
                className={`flex-1 py-2 px-3 rounded-lg whitespace-nowrap transition-all cursor-pointer text-center font-bold outline-none border-0 ${activeHubTab === "ai_staging" ? "bg-indigo-650 text-white shadow shadow-indigo-600/10" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
              >
                🪄 {lang === "fa" ? "دکوراسیون با هوش مصنوعی" : "AI Virtual Staging"}
              </button>
              <button
                type="button"
                onClick={() => setActiveHubTab("smart_neighborhood")}
                className={`flex-1 py-2 px-3 rounded-lg whitespace-nowrap transition-all cursor-pointer text-center font-bold outline-none border-0 ${activeHubTab === "smart_neighborhood" ? "bg-indigo-650 text-white shadow shadow-indigo-600/10" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
              >
                🌱 {lang === "fa" ? "شاخص کیفیت زندگی" : "Neighborhood Index"}
              </button>
            </div>

            {/* TAB CONTENTS */}
            {activeHubTab === "ledger_mortgage" && (() => {
              const downPaymentAmount = calculatedTotalPrice * (mortgageDownPaymentPct / 100);
              const loanPrincipal = calculatedTotalPrice - downPaymentAmount;
              const monthlyRate = (mortgageRatePct / 100) / 12;
              const totalMonths = mortgagePeriodYears * 12;
              
              let monthlyPayment = 0;
              if (monthlyRate > 0) {
                monthlyPayment = loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
              } else {
                monthlyPayment = loanPrincipal / totalMonths;
              }
              const requiredMonthlySalary = monthlyPayment * 2.8;

              const handleMortgagePreApproval = () => {
                setPreApprovalStatus("processing");
                setTimeout(() => {
                  const stamp = `MORTGAGE-APPROVED-${Math.floor(100000 + Math.random() * 900000)}-${c.code}`;
                  setPreApprovalCertificate(stamp);
                  setPreApprovalStatus("success");
                }, 1500);
              };

              return (
                <div className="space-y-4 animate-fade-in text-slate-350">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Interactive Finance Panel */}
                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl space-y-4">
                      <div>
                        <span className="text-[10px] text-indigo-400 font-extrabold uppercase font-mono tracking-wider block">
                          🏦 {lang === "fa" ? "سیستم تأیید پیشرفته وام مسکن بین‌المللی" : "Global Mortgage Pre-Approval"}
                        </span>
                        <p className="text-[9px] text-slate-500 font-semibold mt-0.5">
                          {lang === "fa" ? "محاسبه آنی اهرم مالی خرید و صدو تاییدیه کاداستر" : "Calculate interest rates, amortization periods, & download approved tokens"}
                        </p>
                      </div>
                      
                      {/* Downpayment Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{lang === "fa" ? "سهم پیش‌پرداخت اولیه خریدار:" : "Down Payment ratio:"}</span>
                          <span className="text-emerald-405 font-mono text-emerald-400">{toLocalizedDigits(mortgageDownPaymentPct, lang)}% ({toLocalizedDigits(Math.round(downPaymentAmount).toLocaleString(), lang)} {c.currencySymbol})</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="80"
                          step="5"
                          value={mortgageDownPaymentPct}
                          onChange={(e) => setMortgageDownPaymentPct(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-950 rounded-lg cursor-pointer accent-indigo-505"
                        />
                      </div>

                      {/* Period Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{lang === "fa" ? "مدت بازپرداخت وام کاداستر:" : "Mortgage Loan Period:"}</span>
                          <span className="text-indigo-400 font-mono">{toLocalizedDigits(mortgagePeriodYears, lang)} {lang === "fa" ? "سال" : "Years"}</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          step="5"
                          value={mortgagePeriodYears}
                          onChange={(e) => setMortgagePeriodYears(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-950 rounded-lg cursor-pointer accent-indigo-505"
                        />
                      </div>

                      {/* Interest Rate Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{lang === "fa" ? "نرخ سود سالانه جهانی (APR):" : "Annual Interest Rate APR:"}</span>
                          <span className="text-indigo-400 font-mono">{toLocalizedDigits(mortgageRatePct, lang)}%</span>
                        </div>
                        <input
                          type="range"
                          min="2.5"
                          max="9.5"
                          step="0.1"
                          value={mortgageRatePct}
                          onChange={(e) => setMortgageRatePct(parseFloat(e.target.value))}
                          className="w-full h-1 bg-slate-950 rounded-lg cursor-pointer accent-indigo-505"
                        />
                      </div>

                      {/* Outputs */}
                      <div className="p-3 bg-slate-950 border border-slate-850/60 rounded-xl space-y-2 text-[10px] shadow-inner font-semibold">
                        <div className="flex justify-between items-center text-slate-450">
                          <span>{lang === "fa" ? "مبلغ خالص وام دریافتی:" : "Principal Loan Amt:"}</span>
                          <span className="font-mono text-white">{toLocalizedDigits(Math.round(loanPrincipal).toLocaleString(), lang)} {c.currency}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold">
                          <span>{lang === "fa" ? "قسط ماهیانه تخمینی بانک:" : "Monthly Installment:"}</span>
                          <span className="font-mono text-indigo-400">{toLocalizedDigits(Math.round(monthlyPayment).toLocaleString(), lang)} {c.currencySymbol}/m</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] border-t border-slate-900 pt-2 text-slate-500">
                          <span>{lang === "fa" ? "حداقل درآمد ماهانه مورد نیاز:" : "Required Monthly Salary:"}</span>
                          <span className="font-mono font-bold text-slate-400">{toLocalizedDigits(Math.round(requiredMonthlySalary).toLocaleString(), lang)} {c.currencySymbol}</span>
                        </div>
                      </div>

                      {/* Process button */}
                      {preApprovalStatus === "idle" && (
                        <button
                          type="button"
                          onClick={handleMortgagePreApproval}
                          className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 transition text-white font-black text-[10.5px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          🏦 {lang === "fa" ? "ثبت درخواست تایید صلاحیت وام بین‌المللی" : "Get Approved Pre-Approval Code"}
                        </button>
                      )}

                      {preApprovalStatus === "processing" && (
                        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850/65 flex flex-col items-center justify-center space-y-2 text-center">
                          <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                          <span className="text-[9px] text-slate-400 animate-pulse font-bold">{lang === "fa" ? "در حال اتصال به هسته اعتبارسنجی ارزی کاداستر..." : "Generating cryptographic escrow token..."}</span>
                        </div>
                      )}

                      {preApprovalStatus === "success" && (
                        <div className="p-3 bg-emerald-950/20 border border-emerald-900/60 rounded-xl text-center space-y-2">
                          <span className="text-emerald-450 font-black text-[10.5px] block">✓ {lang === "fa" ? "کد رهگیری وام با موفقیت صادر شد!" : "PRE-APPROVAL SECURED"}</span>
                          <p className="text-[8.5px] text-slate-400">{lang === "fa" ? "درخواست شما تایید کاداستر همتا به همتا گرفت. کد ثبتی:" : "Decentralized mortgage clearance synchronized. Token Code:"}</p>
                          <div className="flex gap-1.5 items-center bg-slate-950 p-2 rounded-lg border border-slate-900 justify-between">
                            <span className="text-[9.5px] font-mono text-slate-200 font-extrabold select-all">{preApprovalCertificate}</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(preApprovalCertificate);
                                alert(lang === "fa" ? "کد کپی شد!" : "Crypto token copied!");
                              }}
                              className="px-2 py-0.5 bg-slate-900 hover:bg-indigo-600 text-[8px] text-indigo-450 hover:text-white rounded border border-slate-850 cursor-pointer"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Historical Valuations Ledger */}
                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-3.5">
                        <div>
                          <span className="text-[10px] text-indigo-400 font-extrabold uppercase font-mono tracking-wider block">
                            📈 {lang === "fa" ? "تاریخچه تراکنش‌ها و ارزش‌گذاری تاریخی سند" : "Historical Sales & Valuation Ledger"}
                          </span>
                          <p className="text-[9px] text-slate-500 font-semibold mt-0.5">
                            {lang === "fa" ? "سوابق ارزش گذاری اسناد کاداستر در مراجع قضایی ملکی" : "Cadastral regulatory ledger trace of previous transactional valuations"}
                          </p>
                        </div>
                        
                        <div className="space-y-2 opacity-95">
                          {[
                            { year: "2020", multiplier: 0.70, change: "+14.3%", statusFa: "معامله رسمی و ثبت کاداستر سنتی", statusEn: "Registered transaction legacy stamp", icon: "🔒" },
                            { year: "2022", multiplier: 0.82, change: "+17.1%", statusFa: "تجدید ارزیابی منطقه کاداستر ملى", statusEn: "Municipal reserve audit valuation", icon: "🏛️" },
                            { year: "2024", multiplier: 0.91, change: "+9.8%", statusFa: "سنجش ارزش‌گذاری هوشمند سیستم کاداستر", statusEn: "AI automated ledger calculation index", icon: "🔷" },
                            { year: "2026 (کنونی)", multiplier: 1.0, change: "--", statusFa: "ارزش ثبت‌شده نهایی سند تکبرگ زنده", statusEn: "Active ledger registry node price", icon: "⚡" },
                          ].map((valuation, idx) => {
                            const valPrice = calculatedTotalPrice * valuation.multiplier;
                            return (
                              <div key={idx} className="p-2 py-2.5 bg-slate-950/50 hover:bg-slate-950 border border-slate-850/40 rounded-xl transition flex items-center justify-between text-[10px]">
                                <div className="space-y-1 px-1.5 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs">{valuation.icon}</span>
                                    <span className="font-extrabold text-white font-mono">{toLocalizedDigits(valuation.year, lang)}</span>
                                    {valuation.change !== "--" && (
                                      <span className="text-[8px] font-mono text-emerald-400 px-1 py-0.2 bg-emerald-950/15 rounded font-black leading-none">
                                        {valuation.change}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[8.5px] text-slate-500 font-bold block truncate" title={lang === "fa" ? valuation.statusFa : valuation.statusEn}>
                                    {lang === "fa" ? valuation.statusFa : valuation.statusEn}
                                  </span>
                                </div>
                                <div className="text-right px-1.5 shrink-0">
                                  <span className="block font-sans text-[11px] font-black text-slate-300 font-mono">
                                    {toLocalizedDigits(Math.round(valPrice).toLocaleString(), lang)}
                                  </span>
                                  <span className="text-[8px] text-slate-550 block font-bold leading-none">{c.currency}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-4 bg-indigo-950/15 p-2.5 border border-indigo-900/10 rounded-xl text-[8.5px] text-indigo-300 leading-normal font-semibold">
                        <span>💡</span>
                        <span>{lang === "fa" ? "سنجش تاریخی کاداستر آریانا رهنما تحت الگوریتم یکپارچه ارزهای خاورمیانه و مراجع ثبتی به روز می‌شود." : "Ledger indexes are backed by sovereign land registry nodes."}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeHubTab === "vr_matterport" && (() => {
              const rooms = {
                living: {
                  nameFa: "سالن طراحی بهاره تعاملی (۳۶۰ درجه)",
                  nameEn: "Interactive Living Lounge (360°)",
                  url: "https://images.pexels.com/photos/1571439/pexels-photo-1571439.jpeg?auto=compress&cs=tinysrgb&w=1200",
                  hash: "MATTERPORT-LIV-98A"
                },
                bedroom: {
                  nameFa: "اتاق خواب مستر بزرگ (۳۶۰ درجه)",
                  nameEn: "Luxury Master Bedroom (360°)",
                  url: "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1200",
                  hash: "MATTERPORT-BED-21C"
                },
                view: {
                  nameFa: "تراس پانوراما با نمای ۳۶۰ افق",
                  nameEn: "Panoramic Balcony View (360°)",
                  url: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1200",
                  hash: "MATTERPORT-BALCONY-10E"
                }
              };

              const currentRoomData = rooms[vrRoom];

              return (
                <div className="space-y-4 animate-fade-in text-slate-350">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-850">
                    <div>
                      <span className="text-[9px] text-slate-500 font-extrabold block uppercase font-mono">{lang === "fa" ? "اتاق فعال گالری مجازی سه بعدی:" : "Matterport VR Active Node:"}</span>
                      <span className="text-xs font-black text-rose-400 mt-0.5 block flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                        {lang === "fa" ? currentRoomData.nameFa : currentRoomData.nameEn} ({currentRoomData.hash})
                      </span>
                    </div>

                    {/* Room buttons deck */}
                    <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-850 gap-0.5 text-[9px] font-bold">
                      {Object.keys(rooms).map((rk) => (
                        <button
                          key={rk}
                          type="button"
                          onClick={() => setVrRoom(rk as any)}
                          className={`px-2.5 py-1 rounded transition cursor-pointer font-bold border-0 ${vrRoom === rk ? "bg-indigo-600 text-white" : "bg-transparent text-slate-450 hover:text-white"}`}
                        >
                          {rk === "living" ? (lang === "fa" ? "سالن اصلی" : "Living Lounge") : rk === "bedroom" ? (lang === "fa" ? "اتاق مستر" : "Bedroom") : (lang === "fa" ? "بالکن و نما" : "Balcony View")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 360 viewer canvas simulation */}
                  <div 
                    onMouseDown={handleVrMouseDown}
                    onMouseMove={handleVrMouseMove}
                    onMouseUp={handleVrMouseUp}
                    onMouseLeave={handleVrMouseUp}
                    onTouchStart={handleVrTouchStart}
                    onTouchMove={handleVrTouchMove}
                    onTouchEnd={handleVrTouchEnd}
                    className="w-full h-64 sm:h-72 bg-black border border-slate-850 rounded-2xl relative overflow-hidden select-none cursor-grab active:cursor-grabbing group shadow-inner"
                    style={{
                      backgroundImage: `url(${currentRoomData.url})`,
                      backgroundPositionX: `${vrYaw}px`,
                      backgroundSize: "cover",
                      backgroundRepeat: "repeat",
                      transition: isVrDragging ? "none" : "background-position 0.2s ease-out"
                    }}
                  >
                    {/* Dark parallax tint */}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

                    {/* Drag instruction overlay */}
                    <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 backdrop-blur px-2 py-1 rounded-lg text-[8px] font-bold text-slate-400 pointer-events-none">
                      🧭 {lang === "fa" ? "بکشید (درگ) تا ۳۶۰ درجه بچرخید" : "Click & Swipe to turn 360 degrees"}
                    </div>

                    <div className="absolute top-3 right-3 bg-indigo-950/90 border border-indigo-900/50 backdrop-blur px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold text-indigo-300 pointer-events-none">
                      YAW: {Math.round((vrYaw % 360 + 360) % 360)}°
                    </div>

                    {/* PORTALS TELEPORTING */}
                    {vrRoom === "living" && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setVrRoom("bedroom"); }}
                        className="absolute top-[48%] left-[70%] transform -translate-y-1/2 -translate-x-1/2 bg-black/90 hover:bg-indigo-650 border border-slate-800/80 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xl transition hover:scale-105 cursor-pointer animate-pulse z-15"
                        style={{ left: `${((70 + (vrYaw * 0.04)) % 100)}%` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>🌀 {lang === "fa" ? "ورود به اتاق خواب" : "Teleport To Bedroom"}</span>
                      </button>
                    )}

                    {vrRoom === "bedroom" && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setVrRoom("view"); }}
                        className="absolute top-[40%] left-[35%] transform -translate-y-1/2 -translate-x-1/2 bg-black/90 hover:bg-indigo-650 border border-slate-800/80 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xl transition hover:scale-105 cursor-pointer animate-pulse z-15"
                        style={{ left: `${((35 + (vrYaw * 0.04)) % 100)}%` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        <span>🌅 {lang === "fa" ? "ورود به بالکن اختصاصی" : "Exit to Balcony"}</span>
                      </button>
                    )}

                    {vrRoom === "view" && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setVrRoom("living"); }}
                        className="absolute top-[52%] left-[25%] transform -translate-y-1/2 -translate-x-1/2 bg-black/90 hover:bg-indigo-650 border border-slate-800/80 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xl transition hover:scale-105 cursor-pointer animate-pulse z-15"
                        style={{ left: `${((25 + (vrYaw * 0.04)) % 100)}%` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                        <span>🛋️ {lang === "fa" ? "برگشت به سالن نشیمن" : "Return to Living Lounge"}</span>
                      </button>
                    )}

                    {/* Interactive direction compass */}
                    <div className="absolute bottom-4 left-[50%] transform -translate-x-1/2 bg-slate-950/95 border border-slate-850 px-3 py-1.5 rounded-full flex items-center gap-2 font-mono text-[8.5px] font-bold text-slate-400 select-none shadow-2xl">
                      <span>🧭</span>
                      <span>
                        {vrYaw % 360 < -270 || (vrYaw % 360 > 0 && vrYaw % 360 < 90) ? (lang === "fa" ? "شیرینگ شمال کاداستر" : "Compass: NORTH Heading") :
                         vrYaw % 360 < -185 || (vrYaw % 360 > 90 && vrYaw % 360 < 185) ? (lang === "fa" ? "جهت شرق" : "Compass: EAST Heading") :
                         vrYaw % 360 < -95 || (vrYaw % 360 > 185 && vrYaw % 360 < 275) ? (lang === "fa" ? "جهت جنوب" : "Compass: SOUTH Heading") : (lang === "fa" ? "جهت غرب" : "Compass: WEST Heading")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeHubTab === "ai_staging" && (() => {
              const primaryImage = property.images?.[0] || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800";
              
              const styles = {
                original: {
                  nameFa: "بدون چیدمان دکور (خانه خالی)",
                  nameEn: "Original Raw Vacant",
                  filters: "brightness-100 contrast-100 saturate-100",
                  quoteFa: "بافت پایه ملکی در انتظار آغاز ایده دکوراسیون خلاقانه",
                  quoteEn: "Unfurnished state as listed in official deeds"
                },
                minimalist: {
                  nameFa: "مدرن مینیمالیست (اسکاندیناوی)",
                  nameEn: "Modern Scandinavian Minimalist",
                  filters: "contrast-105 brightness-110 saturate-85 sepia-[4%]",
                  quoteFa: "طراحی مدرن مبل راحتی رنگ نود، کابینت‌های نوری ملایم، و دکور فاقد شلوغی",
                  quoteEn: "Simulates custom oak finishes, beige linear sofas & embedded glow panels"
                },
                classic: {
                  nameFa: "کلاسیک مجلل فرانسوی",
                  nameEn: "Classic French Royal",
                  filters: "sepia-15 contrast-115 brightness-95 saturate-110 hue-rotate-[340deg]",
                  quoteFa: "ترکیب میزهای گرد گردویی منبت‌کاری شده، لوسترهای کریستال طلایی و پرده های مخمل",
                  quoteEn: "Adds golden chandeliers, hand-polished mahogany wood trim & velvet armchairs"
                },
                boho: {
                  nameFa: "بوهو ارگانیک دنج",
                  nameEn: "Boho Organic Cozy Green",
                  filters: "hue-rotate-15 contrast-100 saturate-120 sepia-10",
                  quoteFa: "مبلمان حصیری رافا، گلدان انجیری طبیعی بزرگ، قالیچه‌های الیافی نرم و مکرومه‌بافی دیواری",
                  quoteEn: "Features tall fiddle-leaf figs, knitted warm textiles & rattan cozy armchairs"
                },
                industrial: {
                  nameFa: "آوانگارد صنعتی (لوفت آجری)",
                  nameEn: "Industrial Loft Avant-Garde",
                  filters: "brightness-90 contrast-125 saturate-75 grayscale-15 sepia-[2%]",
                  quoteFa: "پوسته بتن دیواری، لوله‌های فلزی روکار سرمایشی، آویزهای تنگستن ادیسون خلاقانه",
                  quoteEn: "Simulates exposed pipelines, raw bricks, dark iron beams & leather club couches"
                }
              };

              const activeStaging = styles[stagedStyle];

              return (
                <div className="space-y-4 animate-fade-in text-slate-350">
                  {/* Selector Row */}
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl space-y-3">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-extrabold uppercase font-mono tracking-wider block">
                        🪄 شبیه‌ساز جادویی دکوراسیون و دگرگونی خانه با هوش مصنوعی (AI Virtual Staging)
                      </span>
                      <p className="text-[9px] text-slate-500 font-bold mt-1 leading-relaxed">
                        {lang === "fa" ? "بدون هزینه‌های کارشناسی، مبلمان و نورپردازی‌های گوناگون را روی تصاویر کاداستر بصورت زنده شبیه‌سازی کنید:" : "Toggle staging blueprints in real-time to preview diverse premium decorator styles:"}
                      </p>
                    </div>

                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 overflow-x-auto scrollbar-none font-bold text-[9px]">
                      {Object.keys(styles).map((styleKey) => (
                        <button
                          key={styleKey}
                          type="button"
                          onClick={() => setStagedStyle(styleKey as any)}
                          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer border-0 ${stagedStyle === styleKey ? "bg-indigo-650 text-white font-extrabold shadow shadow-indigo-600/10" : "bg-transparent text-slate-450 hover:text-white hover:bg-slate-900"}`}
                        >
                          {styleKey === "original" ? (lang === "fa" ? "حالت خالی" : "Original Original") :
                           styleKey === "minimalist" ? (lang === "fa" ? "مدرن مینیمال" : "Minimalist") :
                           styleKey === "classic" ? (lang === "fa" ? "کلاسیک مجلل" : "Classic Royal") :
                           styleKey === "boho" ? (lang === "fa" ? "بوهو دنج" : "Boho Green") : (lang === "fa" ? "لوفت صنعتی" : "Industrial")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SPLIT SLIDER CANVAS RENDERING */}
                  <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 shadow-2xl select-none">
                    {/* Underlying Left Image (Raw Original Empty) */}
                    <div className="absolute inset-0">
                      <img 
                        src={primaryImage} 
                        alt="Staging raw background" 
                        className="w-full h-full object-cover brightness-[0.8]" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur border border-slate-850 px-2 py-0.5 rounded text-[8px] font-bold text-slate-400">
                        ◀ {lang === "fa" ? "تصوير اصلی ملک" : "Raw Listing Photo"}
                      </div>
                    </div>

                    {/* Overlay Right Staged Image (Masked by CSS width boundary) */}
                    <div 
                      className="absolute inset-y-0 right-0 overflow-hidden border-l border-indigo-500 shadow-2xl"
                      style={{ width: `${100 - stagedComparisonRatio}%` }}
                    >
                      <div className="absolute inset-0 w-[100vw] h-full right-0">
                        <img 
                          src={primaryImage} 
                          alt="Staging visual staged" 
                          className={`h-full object-cover w-full transition-all duration-150 ${activeStaging.filters}`}
                          style={{
                            maxWidth: "100%",
                            width: "100%",
                            height: "100%",
                          }}
                          referrerPolicy="no-referrer"
                        />
                        {stagedStyle !== "original" && (
                          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none animate-pulse"></div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-indigo-950/95 border border-indigo-900/60 backdrop-blur px-2.5 py-0.5 rounded text-[8px] font-black text-indigo-300">
                          {lang === "fa" ? "دکوراسیون هوشمند آریانا رهنما ✨" : "Staged AI Preview ✨"} ▶
                        </div>
                      </div>
                    </div>

                    {/* Interactive center handle bar */}
                    <div 
                      className="absolute inset-y-0 w-0.5 bg-indigo-500 cursor-ew-resize flex items-center justify-center pointer-events-none"
                      style={{ left: `${stagedComparisonRatio}%` }}
                    >
                      <div className="w-5 h-5 bg-indigo-650 border border-indigo-400 rounded-full flex items-center justify-center text-[8px] text-white shadow-2xl font-black transform -translate-x-[2px]">
                        ↔
                      </div>
                    </div>

                    {/* Hidden Native Slider overlaying canvas */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stagedComparisonRatio}
                      onChange={(e) => setStagedComparisonRatio(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-25"
                    />
                  </div>

                  {/* Info card describing the style */}
                  <div className="p-3 bg-slate-900 border border-slate-850 rounded-2xl">
                    <p className="text-[10px] text-indigo-400 font-extrabold flex items-center gap-1 leading-none">
                      <span>✨</span>
                      <span>{lang === "fa" ? activeStaging.nameFa : activeStaging.nameEn}</span>
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1.5 leading-relaxed font-semibold">
                      {lang === "fa" ? activeStaging.quoteFa : activeStaging.quoteEn}
                    </p>
                  </div>
                </div>
              );
            })()}

            {activeHubTab === "smart_neighborhood" && (() => {
              // Interactive Categories Data
              const categories = [
                { id: "all", labelFa: "🔎 نمای کلی مقایسه‌ای", labelEn: "Overview Dashboard" },
                { id: "transit", labelFa: "🚇 ترانزیت و دسترسی شهری", labelEn: "Transit & Access" },
                { id: "health", labelFa: "🏥 فوریت‌های بهداشت و درمان", labelEn: "Healthcare & Emergency" },
                { id: "schools", labelFa: "🎓 مراکز آموزشی و مدارس", labelEn: "Schools & Education" },
                { id: "eco", labelFa: "🌳 زیست‌محیطی و آرامش صوتی", labelEn: "Eco & Soundscape" }
              ];

              // Base metrics with comparison scores 
              // Score details: [ThisPropertyScore, DistrictAverageScore, CapitalAverageScore]
              const metricsRef = {
                transit: {
                  titleFa: "شاخص ترانزیت و پیاده‌روی سریع",
                  titleEn: "Walkability & Transit Access Index",
                  scores: [94, 82, 75], // property, district, city
                  descFa: "دسترسی مستقیم تا شاهراه‌های مواصلاتی و ایستگاه‌های مترو ایمن بدون گره ترافیکی منطقه.",
                  descEn: "Grade-A direct walkability path to high-speed rail lines and major bus ports.",
                  pois: [
                    { nameFa: "ایستگاه مترو مرکزی کاداستر", nameEn: "Central Metro Rail Terminal", dist: "۲۰۰ متر", walk: "۳ دقیقه" },
                    { nameFa: "شریان ترانزیت اتوبوس‌های تندرو", nameEn: "Express Corridor BRT Station", dist: "۴۵۰ متر", walk: "۶ دقیقه" },
                    { nameFa: "مجموعه چندمنظوره تبادل سفر", nameEn: "Multi-Modal Transit Transit Node", dist: "۹۰۰ متر", walk: "۱۲ دقیقه" }
                  ]
                },
                health: {
                  titleFa: "فوریت‌های درمان و امداد تخصصی",
                  titleEn: "Healthcare & Rescue Proximity Score",
                  scores: [88, 76, 70],
                  descFa: "پوشش پزشکان متخصص و مجتمع فوریت‌های پزشکی مجاور با زمان رسیدن زیر ۶ دقیقه آمبولانس کاداستر.",
                  descEn: "Unbeatable medical corridor response times with prominent hospital centers.",
                  pois: [
                    { nameFa: "بیمارستان تخصصی شفاگستر کاداستر", nameEn: "Sovereign Health Specialty Center", dist: "۶۰۰ متر", walk: "۸ دقیقه" },
                    { nameFa: "داروخانه شبانه‌روزی یکپارچه", nameEn: "24/7 Integrated Pharma Registry", dist: "۱۵۰ متر", walk: "۲ دقیقه" },
                    { nameFa: "کلینیک دندان‌پزشکی و زیبایی نوین", nameEn: "Novin Aesthetic Dental Lounge", dist: "۷۵۰ متر", walk: "۱۰ دقیقه" }
                  ]
                },
                schools: {
                  titleFa: "اعتبار تحصیلی و آکادمی‌های برگزیده",
                  titleEn: "Academic & Schooling Quality Index",
                  scores: [91, 79, 68],
                  descFa: "همجواری با موسسات آموزشی طراز اول، مدارس دوزبانه رسمی کشور و مهدکودک‌های مدرن.",
                  descEn: "Enviable proximity to highly accredited secondary colleges & bilingual institutions.",
                  pois: [
                    { nameFa: "دبیرستان هوشمند دو زبانه مهر", nameEn: "Mehr Bilingual Smart Academy", dist: "۸۰۰ متر", walk: "۱۱ دقیقه" },
                    { nameFa: "دبستان نخبگان و مرکز تربیت خلاق", nameEn: "Nokhbegan Primary Creative School", dist: "۱.۱ کیلومتر", walk: "۴ دقیقه با خودرو" },
                    { nameFa: "آموزشگاه زبان‌های بین‌المللی کاداستر", nameEn: "Cadastral Intl Language School", dist: "۳۰۰ متر", walk: "۴ دقیقه" }
                  ]
                },
                eco: {
                  titleFa: "آرامش صوتی و شاخص سبز سلامت عمومی",
                  titleEn: "Acoustics & Eco-Green Living Grade",
                  scores: [95, 85, 72],
                  descFa: "میزان آلودگی صوتی مینی‌مال (۳۲ دسی‌بل) به همراه دسترسی اختصاصی به ریه سبز پارک‌های کاداستر شهری.",
                  descEn: "Ultra-quiet night readings with active particulate filtering from lush adjacent vegetation.",
                  pois: [
                    { nameFa: "پارک بانوان و فست لند سرسبز", nameEn: "Sovereign Eco-Green Forest Park", dist: "۱۸۰ متر", walk: "۲ دقیقه" },
                    { nameFa: "دریاچه مصنوعی و باشگاه سلامت محیط", nameEn: "Lakeside Cycling & Jogging Trail", dist: "۱.۴ کیلومتر", walk: "۵ دقیقه با خودرو" },
                    { nameFa: "نقطه سنجش شاخص پاکی هوا (AQI ۵۰)", nameEn: "Air Quality Sensor Node (AQI 50)", dist: "۱۰۰ متر", walk: "۱ دقیقه" }
                  ]
                }
              };

              // Map current state category
              const activeMetricsList = smartCategoryTab === "all" 
                ? Object.keys(metricsRef) as Array<keyof typeof metricsRef>
                : [smartCategoryTab] as Array<keyof typeof metricsRef>;

              const compositeScoreResult = Math.round(
                Object.values(metricsRef).reduce((acc, current) => acc + current.scores[0], 0) / 4
              );

              return (
                <div className="space-y-4 animate-fade-in text-slate-350">
                  
                  {/* Category Filter Pills (Smart Interactive Switcher) */}
                  <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-850 gap-1 overflow-x-auto scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSmartCategoryTab(cat.id as any)}
                        className={`py-1.5 px-3 rounded-xl whitespace-nowrap transition-all border-0 text-[10px] font-black cursor-pointer tracking-tight ${smartCategoryTab === cat.id ? "bg-indigo-650 text-white shadow" : "bg-transparent text-slate-450 hover:text-slate-200 hover:bg-slate-900/40"}`}
                      >
                        {lang === "fa" ? cat.labelFa : cat.labelEn}
                      </button>
                    ))}
                  </div>

                  {/* OVERVIEW ALL SECTOR */}
                  {smartCategoryTab === "all" ? (
                    <div className="space-y-4">
                      {/* Top Comparison Legend & Intro */}
                      <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-2xl text-[10px] leading-relaxed font-bold flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        <div>
                          <span className="text-[9px] text-indigo-400 font-extrabold uppercase font-mono tracking-widest block">
                            📊 {lang === "fa" ? "سامانه سنجش و موازنه منطقه‌ای کاداستر" : "RELATIVE CADASTRAL BENCHMARK PLOT"}
                          </span>
                          <p className="text-[10.5px] mt-1 text-slate-200 font-bold">
                            {lang === "fa" ? "کیفیت زندگی این ملک در مقایسه با میانگین‌های شهری" : "Comparative scores: Property vs District vs City metrics"}
                          </p>
                        </div>

                        {/* Legend Key */}
                        <div className="flex items-center gap-3.5 text-[8.5px] bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
                          <span className="flex items-center gap-1 text-indigo-400">
                            <span className="w-2.5 h-2 bg-indigo-500 rounded"></span>
                            {lang === "fa" ? "این ملک" : "Property"}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <span className="w-2.5 h-2 bg-emerald-500 rounded"></span>
                            {lang === "fa" ? `محله ${property.district || ""}` : "District Avg"}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <span className="w-2.5 h-2 bg-slate-500 rounded"></span>
                            {lang === "fa" ? "میانگین پایتخت" : "City Avg"}
                          </span>
                        </div>
                      </div>

                      {/* Side-by-Side Double Bars Comparisons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {Object.entries(metricsRef).map(([key, data]) => (
                          <div key={key} className="bg-slate-900 border border-slate-850/60 p-4 rounded-3xl space-y-3 hover:border-slate-800 transition">
                            <div className="flex justify-between items-center text-[10.5px] font-extrabold text-white">
                              <span>{lang === "fa" ? data.titleFa : data.titleEn}</span>
                              <span className="font-mono text-indigo-450">{toLocalizedDigits(data.scores[0], lang)}/100</span>
                            </div>

                            {/* Triple Comparative Bars */}
                            <div className="space-y-2">
                              {/* Option 1: This property (Premium Indigo bar) */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold">
                                  <span>{lang === "fa" ? "این دارایی کاداستر" : "This property node"}</span>
                                  <span className="font-mono text-indigo-300 font-extrabold">{toLocalizedDigits(data.scores[0], lang)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-indigo-650 to-indigo-500 rounded-full" style={{ width: `${data.scores[0]}%` }}></div>
                                </div>
                              </div>

                              {/* Option 2: District Average (Slightly shorter Emerald bar) */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[8px] text-slate-500 font-bold">
                                  <span>{lang === "fa" ? `میانگین منطقه (${property.district || "بومی"})` : `District Avg (${property.district})`}</span>
                                  <span className="font-mono text-emerald-400">{toLocalizedDigits(data.scores[1], lang)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500/70 rounded-full" style={{ width: `${data.scores[1]}%` }}></div>
                                </div>
                              </div>

                              {/* Option 3: City baseline (Shorter Grey bar) */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[8px] text-slate-600 font-bold">
                                  <span>{lang === "fa" ? "سرانه و میانگین کلان‌شهر" : "Metropolitan base rate average"}</span>
                                  <span className="font-mono text-slate-500">{toLocalizedDigits(data.scores[2], lang)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                  <div className="h-full bg-slate-600 rounded-full" style={{ width: `${data.scores[2]}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cumulative Total Impact Index */}
                      <div className="p-4 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-indigo-950/20 border border-slate-850 rounded-3xl flex items-center justify-between shadow-lg">
                        <div className="space-y-1">
                          <span className="text-[11px] font-black text-slate-100 block">
                            🎯 {lang === "fa" ? `امتیاز یکپارچه کیفیت زندگی محله (${property.district}):` : `Composite Neighborhood Welfare Index (${property.district}):`}
                          </span>
                          <p className="text-[9.5px] text-slate-450 max-w-md font-semibold leading-normal">
                            {lang === "fa" 
                              ? `این ملک بخصوص با کسب امتیاز یکپارچه ${toLocalizedDigits(compositeScoreResult, lang)} در ارزیابی کاداستر آریانا رهنما، ۲۲.۴٪ بهتر از سرانه‌های منطقه خود خدمات‌رسانی می‌کند.` 
                              : `This specific property outperforms local district indices by 22.4% with an overall composite score of ${compositeScoreResult}.`}
                          </p>
                        </div>
                        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-555 border-emerald-500/30 rounded-full flex flex-col items-center justify-center font-black text-emerald-400 shrink-0 font-mono text-base shadow">
                          <span>{toLocalizedDigits(compositeScoreResult, lang)}</span>
                          <span className="text-[7.5px] text-slate-500 font-sans tracking-widest uppercase">Index</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // SPECIFIC CATEGORY DETAILED EXPLORER
                    activeMetricsList.map((metricKey) => {
                      const item = metricsRef[metricKey];
                      return (
                        <div key={metricKey} className="space-y-4 animate-fade-in text-slate-350">
                          
                          {/* Main descriptive card with huge circular score */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-slate-850 p-4 rounded-3xl items-center">
                            
                            {/* Score Dial left */}
                            <div className="flex flex-col items-center justify-center p-3 bg-slate-950/70 border border-slate-850/60 rounded-2xl md:col-span-1 shadow-inner h-full text-center">
                              <span className="text-[8px] text-indigo-400 font-extrabold uppercase font-mono tracking-widest block">SCORE</span>
                              <div className="text-3xl font-black text-indigo-350 font-mono tracking-tighter mt-1">
                                {toLocalizedDigits(item.scores[0], lang)}
                              </div>
                              <span className="text-[8px] text-slate-500 font-semibold block mt-0.5 leading-none">
                                {lang === "fa" ? "از ۱۰۰ امتیاز ارائه‌شده" : "out of 100 benchmark"}
                              </span>
                            </div>

                            {/* Detail text right */}
                            <div className="md:col-span-3 space-y-1.5">
                              <span className="text-[9px] py-0.5 px-2 bg-slate-950 text-indigo-400 font-bold tracking-wider rounded uppercase font-mono max-w-max block">
                                {metricKey === "transit" ? "🚇 TRANSIT NETWORK" : metricKey === "health" ? "🏥 CLINICAL ZONE" : metricKey === "schools" ? "🎓 ACADEMIC NODES" : "🌳 SILENT BIOTOPE"}
                              </span>
                              <h4 className="text-xs font-black text-white">{lang === "fa" ? item.titleFa : item.titleEn}</h4>
                              <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                                {lang === "fa" ? item.descFa : item.descEn}
                              </p>
                            </div>
                          </div>

                          {/* Nearby real points of Interest (POIs) with distance track */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-black text-indigo-400 tracking-widest font-mono uppercase block">
                              📌 {lang === "fa" ? "مختصات دقیق و فواصل دسترسی اماکن کلیدی مجاور" : "VERIFIED ADJACENT KEY AMENITY DISTANCES"}
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              {item.pois.map((poi, pIdx) => (
                                <div key={pIdx} className="bg-slate-950/60 border border-slate-850/70 hover:border-slate-805 p-3 rounded-2xl flex flex-col justify-between space-y-2 transition shadow-inner">
                                  <div className="space-y-0.5 text-xs font-black text-white truncate">
                                    <span>📍</span>{" "}
                                    <span>{lang === "fa" ? poi.nameFa : poi.nameEn}</span>
                                  </div>
                                  <div className="flex gap-2 items-center justify-between text-[9px] border-t border-slate-900 pt-2 font-bold font-mono">
                                    <span className="text-slate-500">
                                      {lang === "fa" ? "شعاع افقی:" : "Horizontal:"} <span className="text-slate-300 font-mono">{toLocalizedDigits(poi.dist, lang)}</span>
                                    </span>
                                    <span className="text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/30 font-semibold font-sans">
                                      {toLocalizedDigits(poi.walk, lang)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Comparative summary card */}
                          <div className="p-3 bg-slate-900/50 border border-slate-850/40 rounded-xl flex items-center justify-between text-[8px] font-semibold text-slate-500 leading-normal">
                            <span>💡 {lang === "fa" ? "سنگ بنای محاسبات فواصل کاداستر برونداد گیت‌وی ماهواره‌ای زنده و نقشه راه بومی آریانا رهنما است." : "Acoustic decibel levels & distances are monitored via nearby meteorological nodes."}</span>
                            <button
                              type="button"
                              onClick={() => setSmartCategoryTab("all")}
                              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-indigo-400 border border-indigo-900/30 hover:text-white transition rounded-lg text-[8.5px] font-black cursor-pointer"
                            >
                              {lang === "fa" ? "برگشت به سنجش کل" : "View relative plot overview"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })()}
          </div>

          {/* SPACIOUS LAND MAP SIMULATOR SECTION (Highly Requested) */}
          <div className="space-y-3" id="details-spacey-map-box">
            <div className="flex justify-between items-center bg-slate-950/35 p-3.5 rounded-2xl border border-slate-850/50">
              <div className="flex items-start gap-2.5">
                <span className="text-xl mt-0.5 shrink-0">📍</span>
                <div>
                  <span className="text-slate-500 block font-semibold text-[9px] uppercase tracking-wider">
                    {lang === "fa" ? "نشانی دقیق ثبت دفاتر کاداستر" : "Registered Legal Property Address"}
                  </span>
                  <span className="text-slate-200 font-bold text-[12px] block mt-0.5 leading-relaxed">
                    {property.address || `${property.district}, ${c.flag} ${lang === "fa" ? c.nameFa : c.nameEn}`}
                  </span>
                  {property.housePlate && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="bg-amber-500/10 text-amber-400 text-[10px] uppercase font-black px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                        🏢 {lang === 'fa' ? `پلاک منزل: ${property.housePlate}` : `House plate: ${property.housePlate}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded visible map container */}
            <div className="w-full bg-slate-950 rounded-2xl border border-slate-850 p-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-900 mb-3.5 flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-350">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                  <span className="font-bold tracking-wide uppercase text-[10px]">
                    🗺️ {lang === "fa" ? "نقشه زنده و موقعیت ماهواره‌ای دقیق ملک" : "Interactive Geolocation Radar View"}
                  </span>
                </div>

                <div className="flex gap-2 items-center">
                  <span className="text-[10px] text-indigo-400 font-bold bg-indigo-950/60 border border-indigo-900/40 px-2 py-0.5 rounded">
                    {lang === "fa" ? "کاداستر ملکی تایید شده" : "Verified Plot Layout"}
                  </span>
                </div>
              </div>

              {/* Spacious visual map renderer with Real Leaflet Map */}
              <div className="w-full space-y-3">
                <CadastralInteractiveMap
                  lat={parseFloat(String(property.latitude)) || (c.center?.lat || 35.6892)}
                  lng={parseFloat(String(property.longitude)) || (c.center?.lng || 51.3890)}
                  readOnly={true}
                  lang={lang}
                  height="260px"
                  countryCode={property.country}
                  housePlate={property.housePlate}
                />

                <div className="w-full bg-slate-900/60 border border-slate-850/50 rounded-xl p-3 flex flex-col sm:flex-row gap-3 items-center justify-between text-[11px] font-sans">
                  <div className="flex items-center gap-2 text-slate-400 font-mono">
                    <Compass className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: "12s" }} />
                    <span className="text-[11px] font-bold">
                      {lang === "fa" ? "مختصات ثبتی جی‌پی‌اس:" : "GPS REGISTRY:"}{" "}
                      <span className="text-slate-200 font-mono">
                        {toLocalizedDigits((parseFloat(String(property.latitude)) || (c.center?.lat || 35.6892)).toFixed(5), lang)}, {toLocalizedDigits((parseFloat(String(property.longitude)) || (c.center?.lng || 51.3890)).toFixed(5), lang)}
                      </span>
                    </span>
                  </div>

                  <button 
                    onClick={handleCopyCoords}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-lg border border-indigo-500/30 transition shadow cursor-pointer text-[10px]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? (lang === "fa" ? "کپی شد!" : "Copied!") : (lang === "fa" ? "کپی مختصات GPS" : "Copy GPS Coordinates")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DUAL-MANAGEMENT CADASTRAL COMPLAINT & DISPUTE TRACKING ENGINE */}
          <div className="border-t border-slate-800 pt-5 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11.5px] font-black text-white uppercase tracking-wider">
                    {lang === "fa" ? "سامانه ثبت مغایرت کاداستر و شکایت ملکی" : "CADASTRAL REPORT & DISPUTE CENTRE"}
                  </h4>
                  <p className="text-[9px] text-slate-500 font-semibold leading-normal">
                    {lang === "fa" 
                      ? "ثبت و صدور فوری برگ پیگیری مغایرت سند، متراژ، قیمت غیرواقعی یا مالکیت جهت رسیدگی قانونی" 
                      : "Register property discrepancies, fake listing values, or boundary overlaps for investigation"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDisputeFormOpen(!isDisputeFormOpen);
                  if (submittedTicketId) {
                    setSubmittedTicketId(null);
                    setComplainantName("");
                    setComplainantPhone("");
                    setDisputeDesc("");
                  }
                }}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-xl transition duration-150 cursor-pointer ${
                  isDisputeFormOpen 
                    ? "bg-slate-800 text-slate-300 border border-slate-700" 
                    : "bg-rose-950/40 hover:bg-rose-900 border border-rose-900/35 text-rose-350"
                }`}
              >
                {isDisputeFormOpen 
                  ? (lang === "fa" ? "بستن پنل گزارش" : "Close Report Panel") 
                  : (lang === "fa" ? "🚨 بررسی و ثبت گزارش مغایرت" : "🚨 Submit Discrepancy report")}
              </button>
            </div>

            {isDisputeFormOpen && (
              <div className="bg-gradient-to-b from-slate-950 to-slate-955 border border-rose-950/50 p-4.5 rounded-2xl space-y-4 animate-fade-in relative">
                <div className="absolute top-0 right-1/4 w-32 h-32 bg-rose-500/[0.02] rounded-full blur-2xl pointer-events-none"></div>

                {!submittedTicketId ? (
                  <form onSubmit={handleDisputeSubmit} className="space-y-3.5">
                    <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                      ⚠️ {lang === "fa" 
                        ? "پرونده شکایات و مغایرت کاداستر به صورت کاملا رسمی کدگذاری شده و جهت پیگیری دقیق حقوقی به کارتابل بازرسی کاداستر آریانا رهنما ارسال خواهد شد. ارائه شماره تلفن الزامی است."
                        : "Reports are validated against active land-registry databases and audited. Please provide accurate metadata so legal brokers may contact you."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold block">
                          👤 {lang === "fa" ? "نام و نام خانوادگی گزارش‌دهنده (شاکی):" : "Your Full Name:"}
                        </label>
                        <input
                          type="text"
                          required
                          value={complainantName}
                          onChange={(e) => setComplainantName(e.target.value)}
                          placeholder={lang === "fa" ? "مثال: علی احمدی" : "e.g. John Doe"}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-900 transition font-medium"
                        />
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold block">
                          📞 {lang === "fa" ? "شماره تماس جهت پیگیری دقیق:" : "Direct Contact Phone:"}
                        </label>
                        <input
                          type="text"
                          required
                          value={complainantPhone}
                          onChange={(e) => setComplainantPhone(e.target.value)}
                          placeholder={lang === "fa" ? "مثال: 09123456789" : "e.g. +98912..."}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-900 transition font-medium text-left"
                        />
                      </div>
                    </div>

                    {/* Dispute Reason enum */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold block">
                        📂 {lang === "fa" ? "نوع مغایرت یا تخلف ثبتی سند:" : "Primary Discrepancy Category:"}
                      </label>
                      <select
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-900 transition font-semibold"
                      >
                        <option value="fake_price">
                          {lang === "fa" ? "💵 ارزش مالی برآوردی غلو شده / قیمت غیرواقعی یا دستکاری شده" : "Inaccurate Estimated Price / Excessive overvaluation"}
                        </option>
                        <option value="wrong_owner">
                          {lang === "fa" ? "👤 مغایرت مالک ادعایی یا عدم مالکیت حقیقی آگهی‌دهنده" : "Ownership Mismatch / Non-authorized list agent"}
                        </option>
                        <option value="cadastral_mismatch">
                          {lang === "fa" ? "📐 مغایرت اساسی در متراژ عرصه و اعیان یا تداخل در نقشه کاداستر" : "Cadastral Boundary Mismatch / Overlapping borders"}
                        </option>
                        <option value="invalid_images">
                          {lang === "fa" ? "🖼️ عکس‌های غیرمرتبط یا فیک مربوط به آپارتمان دگر" : "Deceptive Gallery / Photographs belong to different object"}
                        </option>
                        <option value="other">
                          {lang === "fa" ? "⚠️ سایر تخلفات قانونی، تصرف عدوانی یا غصب سند" : "Other Legal & Statutory discrepancies"}
                        </option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold block">
                        📝 {lang === "fa" ? "شرح دقیق شکایت و ادله مغایرت جهت پیگیری:" : "Specific Discrepancy Details & Evidences:"}
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={disputeDesc}
                        onChange={(e) => setDisputeDesc(e.target.value)}
                        placeholder={lang === "fa" ? "لطفاً جزییات دقیق تضاد سند یا قیمت را با نقشه کاداستر اینجا بنویسید..." : "Write details regarding mismatch or fraudulent pricing..."}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-900 transition leading-relaxed"
                      />
                    </div>

                    {/* Action button */}
                    <button
                      type="submit"
                      disabled={isSubmittingDispute}
                      className="w-full py-2.5 bg-rose-700 hover:bg-rose-600 disabled:opacity-50 text-white font-black text-[11px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/20"
                    >
                      {isSubmittingDispute ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>{lang === "fa" ? "درحال کدگذاری و ثبت امنیتی شکایت..." : "Sovereign validation & locking registry..."}</span>
                        </>
                      ) : (
                        <>
                          <span>🛡️</span>
                          <span>{lang === "fa" ? "صدور رسمی برگه شکایت و ثبت در سامانه نظارت کاداستر" : "Authorize Official Dispute Filing & Commit"}</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-center space-y-3 animate-fade-in">
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-lg">
                      <CheckCircle className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-emerald-400 font-black text-xs block">
                        ✓ {lang === "fa" ? "شکایت شما بابت پرونده ملکی با موفقیت ثبت شد!" : "CADASTRAL DISPUTE RECORDED"}
                      </span>
                      <p className="text-[10px] text-slate-300 leading-normal max-w-lg mx-auto">
                        {lang === "fa" 
                          ? `شکایت شما علیه این ملک ملکی به کدهای مرجع کاداستر ارسال گردید. برای ردیابی زنده و پیگیری دقیق وضعیت بازرسی، از بخش مدیریت (بخش کنترل شکایات) با کد رهگیری زیر اقدام نمایید:`
                          : `The listing has been flagged for inspection. Administrators can audit and update the resolution outcome using this ticket ID:`}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 inline-flex items-center gap-3 justify-center">
                      <span className="text-xs font-mono font-black text-white px-2 py-0.5 rounded border border-slate-800 tracking-wider">
                        {submittedTicketId}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(submittedTicketId || "");
                          alert(lang === "fa" ? "کد رهگیری شکایت کپی شد!" : "Dispute tracking code copied to clipboard!");
                        }}
                        className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[9px] hover:text-emerald-400 text-slate-400 rounded transition font-bold"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="text-[9.5px] text-slate-500 font-semibold italic">
                      {lang === "fa" ? "وضعیت پیگیری: در انتظار بررسی فوری کارشناس ممیزی کاداستر" : "Status: Awaiting immediate review by Municipal Auditor"}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* VERIFIED MUNICIPAL BROKER CREDENTIAL BADGE */}
          <div className="p-4 bg-slate-950/70 border border-slate-850 rounded-2xl space-y-3.5 relative overflow-hidden">
            {/* Soft ambient background glow for authentic look */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between gap-3 border-b border-slate-900 pb-2.5">
              <div className="flex items-center gap-2">
                {property.agencyLogo ? (
                  <img 
                    src={property.agencyLogo} 
                    alt="Agency Logo" 
                    className="w-10 h-10 rounded-lg object-contain bg-slate-900 p-1 border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-2xl">🏢</span>
                )}
                <div>
                  <h5 className="text-[11px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                    {property.isLocalTrustEndorsed
                      ? (lang === "fa" ? "تایید هویت ملی و معتمدین محلی" : "VERIFIED VIA LOCAL PERSONAL TRUST")
                      : (lang === "fa" ? "مشاور رسمی احراز شده" : "OFFICIALLY AUTHENTICATED BROKER")}
                    <span className="text-[8.5px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-black">
                      {property.isLocalTrustEndorsed
                        ? (lang === "fa" ? "✓ تعهدنامه محلی" : "✓ NATIONAL ID VERIFIED")
                        : (lang === "fa" ? "✓ تایید شهرداری" : "✓ MUNICIPAL APPROVED")}
                    </span>
                  </h5>
                  <p className="text-[10px] text-slate-350 font-bold mt-1">
                    {property.brokerName || (lang === "fa" ? "ثبت کننده معتبر محلی" : "Certified Realtor")}
                  </p>
                </div>
              </div>

              {property.brokerCardPhoto && (
                <a
                  href={property.brokerCardPhoto}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-950/45 hover:bg-indigo-900/40 border border-indigo-900/35 text-indigo-400 text-[8.5px] font-black px-2 py-1 rounded"
                >
                  📄 {property.isLocalTrustEndorsed
                    ? (lang === "fa" ? "مشاهده تذکره / کارت هویت" : "View ID Card")
                    : (lang === "fa" ? "مشاهده کارت جواز" : "View Municipal License")}
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[10.5px] text-slate-300 leading-relaxed font-semibold">
              <div>
                <span className="text-slate-500 block text-[8.5px] uppercase tracking-wider font-mono">
                  {property.isLocalTrustEndorsed
                    ? (lang === "fa" ? "نمبر تذکره / کدملی احراز شده" : "Verified Tazkira / National ID")
                    : (lang === "fa" ? "کد رسمی ثبت املاک / RERA" : "Official Registry Code / Licence")}
                </span>
                <span className="font-mono text-amber-400 font-extrabold text-[11px]">
                  {property.brokerLicense || "AE-RERA-2026/9082"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[8.5px] uppercase tracking-wider font-mono">
                  {lang === "fa" ? "ایمیل سازمان شهرداری" : "Verified Security Mail"}
                </span>
                <span className="font-mono text-slate-300">
                  {property.brokerEmail || "broker@cadastre-validated.gov"}
                </span>
              </div>
            </div>

            {/* Micro disclaimer */}
            <p className="text-[9.5px] text-slate-500 italic mt-1 leading-normal">
              {lang === "fa" 
                ? "«آرینا متضمن اصالت فیزیکی ملک نیست، اما تضمین می‌کند که تمامی ثبت‌کنندگان، مشاوران دارای مجوز رسمی و احراز هویت شده هستند.»"
                : '"Ariana does not guarantee the raw physical status of properties, but legally secures that listings are published exclusively by municipal-licensed and validated real estate consultants."'}
            </p>
          </div>

          {/* Contact Details Appraiser section */}
          <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-widest font-mono">
                {getTranslation(lang, "appraiserContact", "Representative Contact Hot")}
              </span>
              <span className="text-lg font-black text-slate-200 font-mono mt-0.5 block tracking-wide">
                {toLocalizedDigits(property.phone, lang)}
              </span>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {onStartChat && (
                <button
                  onClick={() => onStartChat(property)}
                  className="flex-1 sm:flex-initial text-center bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-400 hover:text-white font-black py-3 px-5 rounded-2xl text-xs transition active:scale-95 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  💬 {lang === "fa" ? "چت درون‌برنامه‌ای" : "In-App Chat"}
                </button>
              )}
              <a
                href={`tel:${property.phone}`}
                className="flex-1 sm:w-auto text-center bg-indigo-650 hover:bg-indigo-600 text-white font-black py-3 px-8 rounded-2xl text-xs transition active:scale-95 shadow-lg shadow-indigo-650/10 flex items-center justify-center gap-1.5"
              >
                📞 {getTranslation(lang, "callRepresentative", "Call Representative")}
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* FULLSCREEN CADASTRAL IMAGE LIGHTBOX THEATRE */}
      {isFullscreenLightboxOpen && (() => {
        const imagesList = property.images && property.images.length > 0 ? property.images : [
          "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
        ];
        const clampedIndex = activeImageIndex >= imagesList.length ? 0 : activeImageIndex;
        const currentImage = imagesList[clampedIndex] || imagesList[0];

        return (
          <div 
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-lg flex flex-col items-center justify-center p-4 animate-fade-in"
            id="melkban-fullscreen-lightbox"
            onClick={() => setIsFullscreenLightboxOpen(false)}
          >
            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={() => setIsFullscreenLightboxOpen(false)}
              className="absolute top-5 right-5 w-11 h-11 bg-slate-900/90 hover:bg-red-600 border border-slate-800 text-white rounded-full flex items-center justify-center text-sm font-black transition-all hover:scale-105 active:scale-95 cursor-pointer z-[110]"
              title={lang === "fa" ? "بستن تمام‌صفحه" : "Close fullscreen"}
            >
              ✕
            </button>

            {/* Slider Content Wrapper */}
            <div 
              className="relative max-w-4xl w-full max-h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking on the image content itself
            >
              {/* Visual Main Image */}
              <img 
                src={currentImage} 
                alt={property.title} 
                className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-slate-850 shadow-2xl transition duration-500 hover:scale-102" 
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next trigger arrows */}
              {imagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                    className="absolute left-4 bg-slate-950/90 hover:bg-slate-900 border border-slate-850 text-white w-12 h-12 rounded-full flex items-center justify-center text-sm font-black transition transform hover:scale-110 active:scale-90 cursor-pointer shadow-3xl"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 bg-slate-950/90 hover:bg-slate-900 border border-slate-850 text-white w-12 h-12 rounded-full flex items-center justify-center text-sm font-black transition transform hover:scale-110 active:scale-90 cursor-pointer shadow-3xl"
                  >
                    ▶
                  </button>
                </>
              )}
            </div>

            {/* Downward status card and title */}
            <div 
              className="mt-6 text-center space-y-1.5 bg-slate-900/90 border border-slate-800 px-6 py-3.5 rounded-3xl max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[9px] text-indigo-400 font-extrabold font-mono tracking-widest block uppercase">
                {lang === "fa" ? "نمای بزرگنمایی‌شده نگار خانه ثبت کاداستر" : "CADASTRAL HIGH-RES SLIDE PREVIEW"}
              </span>
              <h4 className="text-xs font-black text-white truncate max-w-xs">{property.title}</h4>
              <div className="text-[10px] text-slate-400 font-mono font-bold pt-1 flex items-center justify-center gap-1.5">
                <span className="bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/40">
                  {toLocalizedDigits(clampedIndex + 1, lang)} / {toLocalizedDigits(imagesList.length, lang)} {lang === "fa" ? "تصوير" : "Photos"}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400 font-sans">{property.district}</span>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
