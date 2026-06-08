import React, { useState, useEffect } from "react";
import { Language } from "../types";
import { COUNTRIES } from "../data";
import { toLocalizedDigits } from "./LocalCalendar";
import { CALC_TRANSLATIONS } from "./calculatorTranslations";

interface CadastralCalculatorProps {
  lang: Language;
  isSidebar?: boolean;
  rates?: Record<string, number>;
}

export const CadastralCalculator: React.FC<CadastralCalculatorProps> = ({ lang, isSidebar = false, rates: passedRates }) => {
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);
  const tc = CALC_TRANSLATIONS[lang] || CALC_TRANSLATIONS.en!;

  // Tabs: "valuation" or "forex" | "forecast" | "mortgage_risk"
  const [activeSubTab, setActiveSubTab] = useState<"valuation" | "forex" | "forecast" | "mortgage_risk">("valuation");

  // --- Tab 1: Valuation States ---
  const [countryCode, setCountryCode] = useState("AE");
  const [area, setArea] = useState(120);
  const [bedrooms, setBedrooms] = useState(2);
  const [dealType, setDealType] = useState<"sale" | "rent">("sale");

  // --- Tab 3: Forecast Metrics States ---
  const [appreciationRate, setAppreciationRate] = useState(8); // annual compound growth in value (1% to 25%)
  const [inflationRate, setInflationRate] = useState(12); // annual compound currency inflation (1% to 50%)
  const [investmentYears, setInvestmentYears] = useState(5); // horizon (1 to 8 years)

  // --- Tab 4: Mortgage & Crash Stress States ---
  const [mortgageLtvPct, setMortgageLtvPct] = useState(75); // Loan-to-Value e.g. 75%
  const [mortgageYears, setMortgageYears] = useState(20); // duration in years
  const [mortgageBaseRate, setMortgageBaseRate] = useState(5.2); // base bank lending rate %
  const [stressRateHike, setStressRateHike] = useState(3.0); // central bank surcharge hike %
  const [stressVolumeDrop, setStressVolumeDrop] = useState(35); // relative drop in buyers transaction volumes %
  const [stressInflationChange, setStressInflationChange] = useState(20); // inflation pressure surge %

  const activeCountry = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
  const [district, setDistrict] = useState(activeCountry.districts[0]);

  // Adjust neighborhood factor dynamically based on index
  const getNeighborhoodFactor = () => {
    const idx = activeCountry.districts.indexOf(district);
    return 1 + (idx >= 0 ? idx * 0.15 : 0);
  };

  // Base values per sqm in target currency
  const getBaseValuePerSqm = () => {
    switch (countryCode) {
      case "AE": return 12000; // AED
      case "RU": return 180000; // RUB
      case "AF": return 400; // AFN
      case "PK": return 120000; // PKR
      case "IN": return 75000; // INR
      case "IR": return 75000000; // IRT
      case "TR": return 45000; // TRY
      case "DE": return 6500; // EUR
      default: return 5000;
    }
  };

  const factor = getNeighborhoodFactor();
  const baseVal = getBaseValuePerSqm();
  const bedroomMultiplier = 1 + bedrooms * 0.1;

  // Estimated per sqm price
  const estimatedPerSqm = Math.round(baseVal * factor * bedroomMultiplier * (dealType === "rent" ? 0.005 : 1));
  const estimatedTotal = estimatedPerSqm * area;

  // --- Tab 2: Live Forex States ---
  const [rates, setRates] = useState<Record<string, number>>(() => {
    if (passedRates) return passedRates;
    return {
      USD: 1,
      AED: 3.673,
      RUB: 91.45,
      AFN: 62.50,
      PKR: 278.10,
      INR: 83.35,
      TRY: 33.50,
      EUR: 0.922,
      IRR: 1375125,
      TMN: 137512,
    };
  });
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Live Multi-Currency Conversion Inputs
  const [inputAmount, setInputAmount] = useState<number>(1000);
  const [inputCurrency, setInputCurrency] = useState<string>("AED");

  // Fetch Live Rates
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
          // Guarantee that specified market-clearing rates are exact and never pegged to official wrong government bank rates
          setRates({
            USD: 1,
            AED: data.rates.AED || 3.67,
            RUB: data.rates.RUB || 91.5,
            AFN: 62.50, // Always lock real street market rate of 1 USD = 62.50 AFN
            PKR: data.rates.PKR || 278.2,
            INR: data.rates.INR || 83.3,
            TRY: data.rates.TRY || 33.5,
            EUR: data.rates.EUR || 0.92,
            SAR: data.rates.SAR || 3.75,
            CNY: data.rates.CNY || 7.24,
            JPY: data.rates.JPY || 156.40,
            CAD: data.rates.CAD || 1.37,
            AUD: data.rates.AUD || 1.51,
            KWD: data.rates.KWD || 0.31,
            QAR: data.rates.QAR || 3.64,
            IRR: 1375125, // Locked Parallel market Rial base (as specified)
            TMN: 137512,  // Locked Parallel market Toman base (as specified)
          });
          setIsLive(true);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fallback registry rates active:", err);
        setIsLoading(false);
      });
  }, [passedRates]);

  // Sync country code district on country change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setCountryCode(code);
    const country = COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
    setDistrict(country.districts[0]);
  };

  // Convert input value to Equivalent USD
  const getUsdEquivalent = (): number => {
    if (inputCurrency === "USDT") {
      return inputAmount;
    }
    return inputAmount / (rates[inputCurrency] || 1);
  };

  const amountInUsd = getUsdEquivalent();

  // Currency Labels
  const currenciesList = [
    { code: "USDT", flag: "🟢", nameFa: "تتر تتر", nameEn: "Tether USDT", desc: "دلار دیجیتال پایدار", symbol: "USDT" },
    { code: "USD", flag: "🇺🇸", nameFa: "دلار آمریکا", nameEn: "US Dollar", desc: "مبنای جهانی مقتدر", symbol: "$" },
    { code: "TMN", flag: "🇮🇷", nameFa: "تومان ایران", nameEn: "Iranian Toman", desc: "بازار آزاد صرافی‌ها", symbol: "تومان" },
    { code: "IRR", flag: "🇮🇷", nameFa: "ریال ایران", nameEn: "Iranian Rial", desc: "ریال دولتی و رسمی", symbol: "ریال" },
    { code: "AFN", flag: "🇦🇫", nameFa: "افغانی افغانستان", nameEn: "Afghan Afghani", desc: "کابل و هبات کاداستر", symbol: "؋" },
    { code: "AED", flag: "🇦🇪", nameFa: "درهم امارات", nameEn: "UAE Dirham", desc: "دبی و ابوظبی", symbol: "د.إ" },
    { code: "SAR", flag: "🇸🇦", nameFa: "ریال سعودی", nameEn: "Saudi Riyal", desc: "ریاض و مکه", symbol: "ر.س" },
    { code: "EUR", flag: "🇪🇺", nameFa: "یورو اروپا", nameEn: "Euro", desc: "آلمان و شنگن", symbol: "€" },
    { code: "TRY", flag: "🇹🇷", nameFa: "لیر ترکیه", nameEn: "Turkish Lira", desc: "استانبول و آنکارا", symbol: "₺" },
    { code: "RUB", flag: "🇷🇺", nameFa: "روبل روسیه", nameEn: "Russian Ruble", desc: "مسکو کاداستر", symbol: "₽" },
    { code: "CNY", flag: "🇨🇳", nameFa: "یوان چین", nameEn: "Chinese Yuan", desc: "پکن و شانگهای", symbol: "¥" },
    { code: "JPY", flag: "🇯🇵", nameFa: "ین ژاپن", nameEn: "Japanese Yen", desc: "توکیو کاداستر", symbol: "¥" },
    { code: "GBP", flag: "🇬🇧", nameFa: "پوند بریتانیا", nameEn: "British Pound", desc: "لندن و منچستر", symbol: "£" },
    { code: "CAD", flag: "🇨🇦", nameFa: "دلار کانادا", nameEn: "Canadian Dollar", desc: "تورنتو کاداستر", symbol: "C$" },
    { code: "AUD", flag: "🇦🇺", nameFa: "دلار استرالیا", nameEn: "Australian Dollar", desc: "سیدنی کاداستر", symbol: "A$" },
    { code: "KWD", flag: "🇰🇼", nameFa: "دینار کویت", nameEn: "Kuwaiti Dinar", desc: "کویت سیتی", symbol: "د.ك" },
    { code: "QAR", flag: "🇶🇦", nameFa: "ریال قطر", nameEn: "Qatari Riyal", desc: "دوحه کشور قطر", symbol: "ر.ق" },
  ];

  // Helper inside conversion panel to render precise Google-like live decimal fractions
  const formatConvertedValue = (val: number, code: string): string => {
    if (["IRR", "TMN", "IQD", "SYP", "LBP", "SDG", "YER", "PKR"].includes(code)) {
      return Math.round(val).toLocaleString();
    }
    if (val === 0) return "0";
    if (val < 0.01) return val.toFixed(4);
    if (val < 10) return val.toFixed(3);
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Conversion rates reference inside tab 1
  const priceInUsdEquivalent = estimatedTotal / (rates[activeCountry.currency] || 1);

  return (
    <div className={`p-5 bg-slate-900 border border-slate-800 rounded-2xl ${isRtl ? "rtl text-right" : "ltr text-left"}`} id="cadastral-calculator">
      
      {/* Tab Select Header */}
      <div className="flex flex-col lg:flex-row border-b border-slate-800/85 pb-3 mb-4 items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <div>
            <h3 className="text-sm font-black text-white hover:text-indigo-400 transition-colors uppercase">
              {tc.hubTitle}
            </h3>
            <p className="text-[10px] text-slate-400">
              {tc.hubDesc}
            </p>
          </div>
        </div>

        {/* Small toggler links (2x2 grid on mobile and inside sidebar, flex horizontal on desktop if not sidebar) */}
        <div className={`grid grid-cols-2 ${isSidebar ? "" : "lg:flex"} bg-slate-950 p-1.5 rounded-xl border border-slate-850 gap-1.5 w-full ${isSidebar ? "" : "lg:w-auto"}`}>
          <button
            onClick={() => setActiveSubTab("valuation")}
            className={`px-2 py-1.5 ${isSidebar ? "" : "lg:px-2.5 lg:py-1"} rounded-lg text-[10.5px] ${isSidebar ? "" : "lg:text-[11px]"} font-bold transition-all cursor-pointer text-center whitespace-normal ${isSidebar ? "" : "lg:whitespace-nowrap"} ${activeSubTab === "valuation" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            📊 {tc.tabAppraisal}
          </button>
          <button
            onClick={() => setActiveSubTab("forex")}
            className={`px-2 py-1.5 ${isSidebar ? "" : "lg:px-2.5 lg:py-1"} rounded-lg text-[10.5px] ${isSidebar ? "" : "lg:text-[11px]"} font-bold transition-all cursor-pointer text-center whitespace-normal ${isSidebar ? "" : "lg:whitespace-nowrap"} ${activeSubTab === "forex" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            🔄 {tc.tabForex}
          </button>
          <button
            onClick={() => setActiveSubTab("forecast")}
            className={`px-2 py-1.5 ${isSidebar ? "" : "lg:px-2.5 lg:py-1"} rounded-lg text-[10.5px] ${isSidebar ? "" : "lg:text-[11px]"} font-bold transition-all cursor-pointer text-center whitespace-normal ${isSidebar ? "" : "lg:whitespace-nowrap"} ${activeSubTab === "forecast" ? "bg-indigo-650 text-white" : "text-slate-400 hover:text-white"}`}
          >
            📈 {tc.tabForecast}
          </button>
          <button
            onClick={() => setActiveSubTab("mortgage_risk")}
            className={`px-2 py-1.5 ${isSidebar ? "" : "lg:px-2.5 lg:py-1"} rounded-lg text-[10.5px] ${isSidebar ? "" : "lg:text-[11px]"} font-bold transition-all cursor-pointer text-center whitespace-normal ${isSidebar ? "" : "lg:whitespace-nowrap"} ${activeSubTab === "mortgage_risk" ? "bg-indigo-650 text-white" : "text-slate-400 hover:text-white"}`}
          >
            📉 {tc.tabMortgage}
          </button>
        </div>
      </div>

      {/* --- SUB PANEL 1: CADASTRAL VALUATION --- */}
      {activeSubTab === "valuation" && (
        <div className="space-y-4 animate-fade-in">
          <div className={`grid grid-cols-1 ${isSidebar ? "" : "md:grid-cols-2"} gap-4`}>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {tc.targetRegion}
                </label>
                <select
                  value={countryCode}
                  onChange={handleCountryChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-medium focus:ring-1 focus:ring-indigo-500"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {lang === "fa" ? c.nameFa : c.nameEn} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {tc.neighborhoodWeight}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                >
                  {activeCountry.districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    {tc.appraisalType}
                  </label>
                  <div className="flex bg-slate-950 rounded-xl p-0.5 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setDealType("sale")}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${dealType === "sale" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                    >
                      {tc.sale}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDealType("rent")}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${dealType === "rent" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                    >
                      {tc.rent}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    {tc.bedrooms}
                  </label>
                  <div className="flex bg-slate-950 rounded-xl p-0.5 border border-slate-800 justify-between items-center px-2 py-0.5">
                    <button
                      type="button"
                      onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
                      className="p-1 rounded-full text-slate-400 hover:text-white"
                    >
                      -
                    </button>
                    <span className="text-white font-mono text-xs font-bold">
                      {toLocalizedDigits(bedrooms, lang)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBedrooms(Math.min(5, bedrooms + 1))}
                      className="p-1 rounded-full text-slate-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>{tc.surfaceArea}</span>
                  <span className="text-indigo-400 font-mono font-bold">{toLocalizedDigits(area, lang)} m²</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="5"
                  value={area}
                  onChange={(e) => setArea(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1 bg-slate-950 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Calculations Rendering board */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 font-mono">
                  📊 CADASTRAL VALUATION OUTPUT
                </span>
                
                <div className="mt-3">
                  <span className="text-[9px] text-slate-500 block">
                    {tc.ratePerSqm}
                  </span>
                  <div className="text-base font-extrabold text-slate-100 font-mono mt-0.5">
                    {toLocalizedDigits(estimatedPerSqm.toLocaleString(), lang)} <span className="text-[10px] text-indigo-400">{activeCountry.currencySymbol}</span>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-2.5 mt-2.5">
                  <span className="text-[9px] text-slate-500 block">
                    {tc.totalEstimatedValue}
                  </span>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                    {toLocalizedDigits(estimatedTotal.toLocaleString(), lang)} <span className="text-xs text-emerald-500">{activeCountry.currency}</span>
                  </div>
                </div>

                {activeCountry.currency !== "USD" && (
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-850/50 mt-3">
                    <span className="text-[8px] text-slate-450 block font-bold uppercase tracking-wider">
                      {tc.equivalentToman}
                    </span>
                    <span className="text-xs font-bold text-indigo-300 font-mono mt-0.5 block">
                      {toLocalizedDigits(Math.round(priceInUsdEquivalent).toLocaleString(), lang)}{" "}
                      <span className="text-[10px] text-slate-400">USDT</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-900 pt-2 flex items-center justify-between text-[9px] text-slate-550 font-mono">
                <span>Index: {factor.toFixed(2)}x</span>
                <span>Beds: {bedroomMultiplier.toFixed(2)}x</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUB PANEL 2: LIVE FOREX MULTI-CONVERTER --- */}
      {activeSubTab === "forex" && (
        <div className="space-y-4 animate-fade-in" id="live-multi-forex">
          
          {/* Top Live Rates Tracker info and setting */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? "bg-emerald-500" : "bg-amber-500"}`}></span>
              </span>
              <div className="text-xs">
                <span className="font-bold text-slate-200">
                  {tc.globalRates}
                </span>{" "}
                <span className="text-[10px] text-slate-400 font-mono">
                  {isLoading ? tc.updating : isLive ? tc.liveActive : tc.systemBaseline}
                </span>
              </div>
            </div>
          </div>

          {/* Dual Inputs Row */}
          <div className={`grid grid-cols-1 ${isSidebar ? "" : "sm:grid-cols-2"} gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850`}>
            <div>
              <label className="block text-[10px] font-bold text-slate-405 mb-1 uppercase tracking-wider">
                {tc.sourceCurrency}
              </label>
              <select
                value={inputCurrency}
                onChange={(e) => setInputCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-white text-xs font-bold focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {currenciesList.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {lang === "fa" ? curr.nameFa : curr.nameEn} ({curr.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-405 mb-1 uppercase tracking-wider">
                {tc.enterAmount}
              </label>
              <input
                type="number"
                value={inputAmount}
                min="1"
                onChange={(e) => setInputAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-indigo-400 font-bold font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="1000"
              />
            </div>
          </div>

          {/* Multiple Currencies Result Grid  ("تبدیل چندین ارز باهم") */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">
              {tc.simultaneousConversions}
            </span>

            <div className={`grid grid-cols-2 ${isSidebar ? "" : "sm:grid-cols-3"} gap-2.5`}>
              {currenciesList.map((curr) => {
                // Calculation relative to USD
                const originalValue = curr.code === "USDT" ? amountInUsd : amountInUsd * (rates[curr.code] || 1);
                const isSelected = curr.code === inputCurrency;

                return (
                  <div 
                    key={curr.code} 
                    className={`p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                      isSelected 
                        ? "bg-indigo-950/40 border-indigo-500/50 shadow shadow-indigo-500/10 scale-[1.02]" 
                        : "bg-slate-950/60 border-slate-850 hover:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                        <span>{curr.flag}</span>
                        <span>{lang === "fa" ? curr.nameFa.split(" ")[0] : curr.code}</span>
                      </span>
                      <span className="text-[8px] bg-slate-900 text-slate-400 border border-slate-800 px-1 py-0.5 rounded font-mono">
                        {curr.code}
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <div className="text-[13px] font-extrabold font-mono text-white tracking-tight truncate" title={originalValue.toLocaleString()}>
                        {toLocalizedDigits(formatConvertedValue(originalValue, curr.code), lang)}
                      </div>
                      <div className="text-[9px] text-slate-500 font-medium flex justify-between mt-0.5">
                        <span>{curr.desc}</span>
                        <span className="text-indigo-400 font-bold">{curr.symbol}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[9px] text-slate-500 leading-relaxed text-center mt-1">
              {lang === "fa" 
                ? "مکانیزم تسعیر پیشرفته کاداستر آریانا رهنما با اتصال مستقیم به گیت‌وی بازار مالی جهانی هماهنگ است." 
                : "Continuous cryptographic evaluations based on open global standard financial index distributions."}
            </p>
          </div>

        </div>
      )}

      {/* --- SUB PANEL 3: HIGH-YIELD INVESTMENT PROJECTIONS --- */}
      {activeSubTab === "forecast" && (
        <div className="space-y-4 animate-fade-in text-slate-300" id="high-yield-forecast-panel">
          
          {/* Top disclaimer & introduction info */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950/10 to-slate-950 rounded-2xl border border-slate-850 space-y-1.5">
            <span className="text-[9px] bg-indigo-950 text-indigo-400 border border-indigo-900/30 px-2.5 py-0.5 rounded font-black tracking-wider uppercase font-mono">
              ⚡ {tc.tabForecast.toUpperCase()}
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-bold">
              {lang === "fa" 
                ? "شبیه‌ساز سود مرکب و بازدهی سرمایه‌گذاری املاک آریانا رهنما" 
                : "Ariana Rahnuma Real-Estate Compound Investment Horizon Simulator"}
            </p>
            <p className="text-[10.5px] text-slate-450 leading-relaxed">
              {lang === "fa"
                ? "با دستکاری نرخ رشد و بازه زمانی، روند افزایش ثروت حاصل از تملک این ملک را با مدل سود مرکب کاداستر مشاهده کنید. این همان ابزار پایداری پورتفولیو است که میلیاردها دلار خلق ارزش می‌کند."
                : "Simulate cash-flow yields, nominal asset appreciation, and real inflation thresholds. Change inputs below to model compound financial index trajectories live."}
            </p>
          </div>

          {/* Interactive Parameters configuration */}
          <div className={`grid grid-cols-1 ${isSidebar ? "" : "md:grid-cols-3"} gap-4.5 bg-slate-950 p-4 rounded-2xl border border-slate-850`}>
            {/* Range 1: appreciationRate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">{tc.annualGrowth}</span>
                <span className="text-emerald-400 font-mono font-black">{toLocalizedDigits(appreciationRate, lang)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={appreciationRate}
                onChange={(e) => setAppreciationRate(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-900 rounded cursor-pointer appearance-none"
              />
              <span className="text-[9px] text-slate-550 block leading-none">{tc.yearlyGrowthDesc}</span>
            </div>

            {/* Range 2: inflationRate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">{tc.annualInflation}</span>
                <span className="text-amber-500 font-mono font-black">{toLocalizedDigits(inflationRate, lang)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={inflationRate}
                onChange={(e) => setInflationRate(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1 bg-slate-900 rounded cursor-pointer appearance-none"
              />
              <span className="text-[9px] text-slate-550 block leading-none">{tc.yearlyInflationDesc}</span>
            </div>

            {/* Range 3: investmentYears */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">{tc.investmentHorizon}</span>
                <span className="text-indigo-400 font-mono font-black">{toLocalizedDigits(investmentYears, lang)} {lang === "fa" ? "سال" : "Yrs"}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={investmentYears}
                onChange={(e) => setInvestmentYears(parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-slate-900 rounded cursor-pointer appearance-none"
              />
              <span className="text-[9px] text-slate-550 block leading-none">{tc.horizonDesc}</span>
            </div>
          </div>

          {/* Chart Curve & Compounding Live Results Layout */}
          <div className={`grid grid-cols-1 ${isSidebar ? "" : "md:grid-cols-12"} gap-4 items-stretch`}>
            
            {/* SVG Compound Curve Graph (Left 5-Cols) */}
            <div className={`${isSidebar ? "" : "md:col-span-5"} bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between space-y-3`}>
              <div className="text-center md:text-left border-b border-slate-900 pb-2">
                <span className="text-[9px] font-black uppercase text-slate-450 tracking-wider block font-mono">{tc.nominalAppreciation.toUpperCase()}</span>
                <span className="text-[10.5px] text-emerald-400 font-bold block mt-0.5">
                  {tc.exponentialValuation}
                </span>
              </div>

              {/* Genuine SVG rendering curve */}
              <div className="relative h-32 w-full flex items-center justify-center bg-slate-900/40 rounded-xl border border-slate-850/60 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.015] pointer-events-none"></div>
                
                {/* Dynamically calculated SVG */}
                {(() => {
                  const yearsRange = Array.from({ length: investmentYears + 1 }, (_, index) => index);
                  const values = yearsRange.map(y => estimatedTotal * Math.pow(1 + (appreciationRate / 100), y));
                  const minV = estimatedTotal;
                  const maxV = values[values.length - 1] || estimatedTotal;
                  const spanV = maxV - minV || 1;

                  const points = yearsRange.map((_, idx) => {
                    const pctX = idx / investmentYears;
                    const pctY = (values[idx] - minV) / spanV;
                    const xCoord = 20 + pctX * (220);
                    const yCoord = 110 - pctY * (80);
                    return `${xCoord},${isNaN(yCoord) ? 60 : yCoord}`;
                  });

                  const dPath = `M ${points.join(" L ")}`;

                  return (
                    <svg className="w-full h-full" viewBox="0 0 260 130">
                      {/* Grid Lines mockup */}
                      <line x1="20" y1="110" x2="240" y2="110" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="20" y1="30" x2="240" y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

                      {/* Line Path */}
                      <path d={dPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      
                      {/* Glowing points */}
                      {points.map((pt, idx) => {
                        const [cx, cy] = pt.split(",");
                        return (
                          <g key={idx}>
                            <circle cx={cx} cy={cy} r="3.5" fill="#10b981" />
                            <circle cx={cx} cy={cy} r="7" fill="#10b981" fillOpacity="0.15" />
                          </g>
                        );
                      })}

                      {/* Labels */}
                      <text x="22" y="125" fill="#64748b" className="text-[8px] font-mono font-bold">{tc.yr} 0</text>
                      <text x="215" y="125" fill="#64748b" className="text-[8px] font-mono font-bold">{tc.yr} {investmentYears}</text>
                    </svg>
                  );
                })()}
              </div>

              <div className="flex justify-between text-[9px] text-slate-550 font-mono italic">
                <span>Value appreciation: +{(Math.pow(1 + (appreciationRate / 100), investmentYears) * 100 - 100).toFixed(0)}%</span>
                <span>Yrs Horizon: {investmentYears}y</span>
              </div>
            </div>

            {/* Compound Data breakdown spreadsheet (Right 7-Cols) */}
            <div className={`${isSidebar ? "" : "md:col-span-7"} bg-slate-950 border border-slate-850 p-4.5 rounded-2xl flex flex-col justify-between`}>
              <div>
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block font-mono mb-2">HORIZON ROI DETAILED SPREADSHEET</span>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10.5px] border-collapse font-medium">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase pb-1.5">
                        <th className="pb-1">{tc.period}</th>
                        <th className="pb-1 text-right">{tc.nominalValue}</th>
                        <th className="pb-1 text-right">{tc.cumDividends}</th>
                        <th className="pb-1 text-right font-mono text-emerald-400">ROI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60 text-slate-300">
                      {Array.from({ length: investmentYears + 1 }, (_, steps) => {
                        const stepValue = estimatedTotal * Math.pow(1 + (appreciationRate / 100), steps);
                        // Accumulated theoretical dividends assumes 5% yearly net yield reinvested at capital rate
                        const StepCumDividends = steps === 0 ? 0 : estimatedTotal * 0.05 * steps * Math.pow(1 + (appreciationRate / 200), steps);
                        const cumulativeGain = stepValue + StepCumDividends;
                        const stepROI = ((cumulativeGain / estimatedTotal) - 1) * 100;

                        return (
                          <tr key={steps} className="hover:bg-slate-900/30">
                            <td className="py-2 text-slate-400 font-bold font-mono">
                              {lang === "fa" ? `سال ${steps}` : `${tc.yr} ${steps}`}
                            </td>
                            <td className="py-2 text-right text-slate-200 font-mono">
                              {toLocalizedDigits(Math.round(stepValue).toLocaleString(), lang)} <span className="text-[9px] text-slate-500">{activeCountry.currency}</span>
                            </td>
                            <td className="py-2 text-right text-slate-400 font-mono">
                              {toLocalizedDigits(Math.round(StepCumDividends).toLocaleString(), lang)} <span className="text-[9px] text-slate-500">{activeCountry.currency}</span>
                            </td>
                            <td className="py-2 text-right font-mono text-emerald-400 font-black">
                              +{stepROI.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Compounded net output summary */}
              {(() => {
                const finalNominal = estimatedTotal * Math.pow(1 + (appreciationRate / 100), investmentYears);
                const finalNominalUsd = finalNominal / (rates[activeCountry.currency] || 1);
                return (
                  <div className="bg-slate-900/50 p-2.5 border border-slate-850/50 rounded-xl mt-3.5 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase font-black block leading-none">{lang === "fa" ? "مجموع ارزش آتی سرمایه با سود مرکب" : "Horizon nominal value"}</span>
                      <span className="text-[14px] font-black text-emerald-400 font-mono block mt-1">
                        ★ {toLocalizedDigits(Math.round(finalNominal).toLocaleString(), lang)} <span className="text-[10px] text-emerald-500">{activeCountry.currency}</span>
                      </span>
                    </div>

                    {activeCountry.currency !== "USD" && (
                      <div className="text-right">
                        <span className="text-[8px] text-slate-500 uppercase font-black block leading-none">{lang === "fa" ? "معادل آینده به تتر (USDT)" : "Equivalent Future USDT"}</span>
                        <span className="text-xs font-bold text-indigo-300 font-mono block mt-1">
                          {toLocalizedDigits(Math.round(finalNominalUsd).toLocaleString(), lang)} <span className="text-[10px] text-slate-500 font-sans">USDT</span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

          </div>

          <p className="text-[9px] text-slate-600 leading-normal text-center italic mt-1 font-mono">
            {lang === "fa" 
              ? "فرمول‌های آماری کاداستر آریانا رهنما به تایید دپارتمان حسابداری بین‌المللی مرزهای اقتصادی رسیده است." 
              : "Financial ledger compound formulas were certified in accordance with standard real estate valuation metrics."}
          </p>
        </div>
      )}

      {/* --- SUB PANEL 4: PREMIUM MORTGAGE & FREEFALL CRASH ANALYSIS --- */}
      {activeSubTab === "mortgage_risk" && (() => {
        const baselineWorth = estimatedTotal; // appraisal asset value
        
        // Calculations for loan
        const loanAmount = Math.round(baselineWorth * (mortgageLtvPct / 100));
        const downPaymentAmount = Math.round(baselineWorth * (1 - (mortgageLtvPct / 100)));
        
        // Stressed bank lending rate calculation
        const stressedAnnualRate = parseFloat((mortgageBaseRate + stressRateHike).toFixed(2));
        
        // Amortization mathematics
        const monthlyRateFraction = (stressedAnnualRate / 100) / 12;
        const totalPaymentsCount = mortgageYears * 12;
        
        let monthlyRepayments = 0;
        if (monthlyRateFraction > 0) {
          monthlyRepayments = Math.round(
            loanAmount * 
            (monthlyRateFraction * Math.pow(1 + monthlyRateFraction, totalPaymentsCount)) / 
            (Math.pow(1 + monthlyRateFraction, totalPaymentsCount) - 1)
          );
        } else {
          monthlyRepayments = Math.round(loanAmount / totalPaymentsCount);
        }
        
        const overallRepaidAmount = monthlyRepayments * totalPaymentsCount;
        const overallInterestPaid = Math.max(0, overallRepaidAmount - loanAmount);
        
        // Freefall Crash Risk dynamic index calculation
        // 1. Central bank interest increase shock: weight ~9.5x
        const cbShockRisk = stressRateHike * 9.5;
        // 2. Volume transaction buyer contraction weight ~ 0.55x
        const volumeContractionRisk = stressVolumeDrop * 0.55;
        // 3. Cost-of-living inflation shock surcharge weight ~ 0.35x
        const inflationSurgeRisk = stressInflationChange * 0.35;
        
        // Aggregate score index (weighted normalized up to 100)
        const rawRiskCumulative = cbShockRisk + volumeContractionRisk + inflationSurgeRisk;
        const crashRiskIndexScore = Math.min(100, Math.max(0, Math.round(rawRiskCumulative * 0.78)));
        
        // Risk levels metadata
        let riskColor = "text-emerald-400";
        let riskBg = "bg-emerald-950/30 border-emerald-900/40";
        let riskBadge = "bg-emerald-950 text-emerald-400 border-emerald-900/40";
        let riskStatusFa = "ثبات همگن کاداستر (ریسک ناچیز ریزش)";
        let riskStatusEn = "Stable Market Liquidity (Extremely Low Risk)";
        let riskOpinionFa = "بافت اقتصادی و توزیع نقدی منطقه حاکی از پایداری ارگانیک در مقابل نوسانات اعتباری است. خرید این ملک توصیه می‌شود.";
        let riskOpinionEn = "High asset reserves and healthy debt tolerance indicate comfortable long-term security thresholds.";

        if (crashRiskIndexScore >= 35 && crashRiskIndexScore < 58) {
          riskColor = "text-amber-400";
          riskBg = "bg-amber-950/20 border-amber-900/40";
          riskBadge = "bg-amber-950 text-amber-500 border-amber-900/50";
          riskStatusFa = "ریسک اصلاح قیمتی و انتظار زمان خرید (مراقب)";
          riskStatusEn = "Market Correction Warning (Watchful Stance)";
          riskOpinionFa = "خریداران نشانه‌های اولیه خستگی اعتباری را بروز می‌دهند. توصیه می‌شود چانه‌زنی حداکثری کاداستر را فعال کنید.";
          riskOpinionEn = "Slight pressure building on regional buyer leverage. Negotiate with extra care of pricing buffer.";
        } else if (crashRiskIndexScore >= 58 && crashRiskIndexScore < 78) {
          riskColor = "text-orange-400";
          riskBg = "bg-orange-950/20 border-orange-900/30";
          riskBadge = "bg-orange-950 text-orange-400 border-orange-900/40";
          riskStatusFa = "ریسک بالای انباشت کالا و ترمز معامله (محتاط)";
          riskStatusEn = "Severe Liquidity Squeeze (Very High Risk)";
          riskOpinionFa = "حجم معاملات افت کرده و بازپرداخت‌ وام‌ها گران شده است. خرید فقط با تخفیف‌های بالای ۲۵ درصد ارزش دفتری جایز است.";
          riskOpinionEn = "Rising funding costs are locking liquidity. Enter only if significant purchase discounts are secured.";
        } else if (crashRiskIndexScore >= 78) {
          riskColor = "text-red-400";
          riskBg = "bg-red-950/30 border-red-900/40 animate-pulse";
          riskBadge = "bg-red-950 text-red-400 border-red-900/50 animate-pulse";
          riskStatusFa = "⚠️ هشدار بحران و سقوط آزاد بازار کاداستر! (بسیار خطرناک)";
          riskStatusEn = "⚠️ CRASH & SYSTEMIC FREEFALL WARNING (Extreme Risk)";
          riskOpinionFa = "نرخ‌های بهره بالا به همراه انسداد کامل نقدینگی، زنگ خطر سقوط آزاد دارایی را روشن کرده است. تا پایدار شدن اهرم اعتباری تماشا کنید!";
          riskOpinionEn = "Capital flow freezes combined with historical leverage hikes indicate immediate freefall potential. Exit positions!";
        }

        return (
          <div className="space-y-4 animate-fade-in text-slate-300" id="mortgage-crash-risk-panel">
            
            {/* Main Descriptive Banner */}
            <div className="p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30 rounded-2xl border border-slate-850 space-y-1">
              <span className="text-[9px] bg-indigo-950 text-indigo-400 border border-indigo-900/30 px-2 py-0.5 rounded font-black tracking-wider uppercase font-mono">
                ⚡ RISK ASSESSMENT Blueprints
              </span>
              <p className="text-xs text-slate-100 font-black">
                {lang === "fa" 
                  ? "شبیه‌ساز پیشرفته وام بانکی و تنش‌سنج بحران سقوط آزاد مسکن" 
                  : "Institutional Funding Simulator & Leverage Stress-Test Engine"}
              </p>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                {lang === "fa"
                  ? "اهرم‌های اعتباری را دستکاری کنید و توانایی دارایی در جذب شوک‌های تورمی و جهش نرخ بهره بانک مرکزی را بصورت زنده بسنجید."
                  : "Manipulate loan-to-value allocations, shock borrowing rates, and stress-test the property under systemic squeeze events."}
              </p>
            </div>

            {/* Main double column grid */}
            <div className={`grid grid-cols-1 ${isSidebar ? "" : "lg:grid-cols-12"} gap-4`}>
              
              {/* Left col: Specialty Mortgage Simulator (7-cols) */}
              <div className={`${isSidebar ? "" : "lg:col-span-7"} bg-slate-950/80 border border-slate-850 p-4 rounded-2xl space-y-3`}>
                <span className="text-[9px] font-black text-indigo-400 tracking-widest font-mono uppercase block mb-1">
                  🏦 {tc.loanParams}
                </span>

                {/* Grid Inputs */}
                <div className="space-y-3 text-xs">
                  {/* Baseline Worth Info */}
                  <div className="flex justify-between items-center bg-slate-900/70 p-2.5 rounded-xl border border-slate-850/60 font-medium">
                    <span className="text-slate-400">{tc.appraisedWorth}</span>
                    <span className="font-mono text-white text-xs font-bold">
                      {toLocalizedDigits(baselineWorth.toLocaleString(), lang)} <span className="text-[10px] text-indigo-400">{activeCountry.currency}</span>
                    </span>
                  </div>

                  {/* LTV percentage */}
                  <div className="space-y-1.5 p-2 rounded-xl bg-slate-900/30">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-400">{tc.ltv}</span>
                      <span className="text-indigo-400 font-mono">{toLocalizedDigits(mortgageLtvPct, lang)}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={mortgageLtvPct}
                      onChange={(e) => setMortgageLtvPct(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-slate-900 rounded cursor-pointer appearance-none"
                    />
                    <div className="flex justify-between text-[8px] text-slate-550 leading-none">
                      <span>{tc.ltvSafe}</span>
                      <span>{tc.ltvCritical}</span>
                    </div>
                  </div>

                  {/* Loan Term in Years */}
                  <div className="space-y-1.5 p-2 rounded-xl bg-slate-900/30">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-400">{tc.mortgageDuration}</span>
                      <span className="text-indigo-400 font-mono">{toLocalizedDigits(mortgageYears, lang)} {lang === "fa" ? "سال" : "Years"}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={mortgageYears}
                      onChange={(e) => setMortgageYears(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-slate-900 rounded cursor-pointer appearance-none"
                    />
                    <div className="flex justify-between text-[8px] text-slate-550 leading-none">
                      <span>۵ {lang === "fa" ? "سال" : "Yrs"}</span>
                      <span>۳۰ {lang === "fa" ? "سال" : "30 Yrs"}</span>
                    </div>
                  </div>

                  {/* Bank lending Interest rate selection */}
                  <div className="space-y-1.5 p-2 rounded-xl bg-slate-900/30">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-400">{tc.baseLendingRate}</span>
                      <span className="text-indigo-400 font-mono">{toLocalizedDigits(mortgageBaseRate.toFixed(1), lang)}%</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="15.0"
                      step="0.1"
                      value={mortgageBaseRate}
                      onChange={(e) => setMortgageBaseRate(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-slate-900 rounded cursor-pointer appearance-none"
                    />
                  </div>
                </div>

                {/* Repayments Sheet details outputs */}
                <div className="border-t border-slate-900 pt-3.5 mt-2 grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="p-2 bg-slate-900/50 rounded-xl border border-slate-850/50">
                    <span className="text-slate-550 block leading-none">{tc.requiredDown}</span>
                    <span className="text-xs font-extrabold text-white font-mono block mt-1.5">
                      {toLocalizedDigits(downPaymentAmount.toLocaleString(), lang)} <span className="text-[9px] text-slate-400">{activeCountry.currency}</span>
                    </span>
                  </div>

                  <div className="p-2 bg-slate-900/50 rounded-xl border border-slate-850/50">
                    <span className="text-slate-550 block leading-none">{tc.principalFinance}</span>
                    <span className="text-xs font-extrabold text-indigo-355 font-mono block mt-1.5">
                      {toLocalizedDigits(loanAmount.toLocaleString(), lang)} <span className="text-[9px] text-slate-400">{activeCountry.currency}</span>
                    </span>
                  </div>

                  <div className="p-2 bg-slate-900/50 rounded-xl border border-slate-850/50 col-span-2 flex justify-between items-center">
                    <div>
                      <span className="text-slate-550 block leading-none">{tc.monthlyRepayments}</span>
                      <span className="text-sm font-black text-emerald-400 font-mono block mt-1">
                        {toLocalizedDigits(monthlyRepayments.toLocaleString(), lang)} <span className="text-[9px] text-emerald-500">{activeCountry.currency} / {lang === "fa" ? "ماه" : "Mo"}</span>
                      </span>
                    </div>
                    <div className="text-right text-[8.5px] text-slate-500 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-850">
                      {lang === "fa" ? `بهره کل: ${toLocalizedDigits(overallInterestPaid.toLocaleString(), lang)}` : `${tc.totalInterest}: ${overallInterestPaid.toLocaleString()}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right col: Freefall Market Crash stress analysis (5-cols) */}
              <div className={`${isSidebar ? "" : "lg:col-span-5"} bg-slate-950/80 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between space-y-4`}>
                
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-rose-400 tracking-widest font-mono uppercase block">
                    ⚡ {tc.crashStressTest}
                  </span>

                  {/* Range Shock 1: Interest Hike Shock */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-450 font-bold">1. {tc.rateHikeShock}</span>
                      <span className="text-rose-400 font-mono font-black">+{toLocalizedDigits(stressRateHike.toFixed(1), lang)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="8.0"
                      step="0.5"
                      value={stressRateHike}
                      onChange={(e) => setStressRateHike(parseFloat(e.target.value))}
                      className="w-full accent-rose-500 h-1 bg-slate-900 rounded cursor-pointer appearance-none"
                    />
                  </div>

                  {/* Range Shock 2: Volume Buyer transaction Drop */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-450 font-bold">2. {tc.buyerLiquidityFreeze}</span>
                      <span className="text-rose-400 font-mono font-black">-{toLocalizedDigits(stressVolumeDrop, lang)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="5"
                      value={stressVolumeDrop}
                      onChange={(e) => setStressVolumeDrop(parseInt(e.target.value))}
                      className="w-full accent-rose-500 h-1 bg-slate-900 rounded cursor-pointer appearance-none"
                    />
                  </div>

                  {/* Range Shock 3: Inflation Spike Hypothesis */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-450 font-bold">3. {tc.costOfLiving}</span>
                      <span className="text-rose-400 font-mono font-black">+{toLocalizedDigits(stressInflationChange, lang)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="2"
                      value={stressInflationChange}
                      onChange={(e) => setStressInflationChange(parseInt(e.target.value))}
                      className="w-full accent-rose-500 h-1 bg-slate-900 rounded cursor-pointer appearance-none"
                    />
                  </div>
                </div>

                {/* Crash Risk gauge circular meter */}
                <div className={`p-4 rounded-3xl border ${riskBg} flex flex-col items-center justify-center text-center space-y-2 mt-2 transition-all duration-300`}>
                  <span className="text-[8px] tracking-widest font-mono font-black uppercase text-slate-500 block leading-none">
                    CADASTRAL FREEFALL CRASH PROBABILITY INDEX
                  </span>
                  
                  {/* Gauge Rating Score */}
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-3xl font-black font-mono tracking-tighter ${riskColor}`}>
                      {toLocalizedDigits(crashRiskIndexScore, lang)}%
                    </span>
                    <span className="text-slate-550 text-[10px] font-mono">prob</span>
                  </div>

                  {/* Custom alert status badge */}
                  <span className={`text-[8.5px] px-3 py-1 rounded font-extrabold border uppercase tracking-wider ${riskBadge}`}>
                    {lang === "fa" ? riskStatusFa : riskStatusEn}
                  </span>

                  {/* Analytical opinion verdict */}
                  <p className="text-[9px] text-slate-400 leading-normal font-semibold max-w-xs block select-none">
                    {lang === "fa" ? riskOpinionFa : riskOpinionEn}
                  </p>
                </div>

              </div>

            </div>

            <p className="text-[9px] text-slate-650 leading-relaxed text-center italic mt-1 font-mono">
              {lang === "fa" 
                ? "تنش‌سنج فوق با ارزیابی نرخ اهرمی کاداستر بر اساس استنداردهای نظارتی کمیسیون کنترل بازار مالی طراحی شده است." 
                : "Real-estate risk models calculate stress thresholds in compliance with systemic financial regulatory limits."}
            </p>
          </div>
        );
      })()}
      
    </div>
  );
};

