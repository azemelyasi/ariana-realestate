import React from "react";
import { Language, SystemSettings } from "../types";
import { TRANSLATIONS, getTranslation } from "../i18n";

interface SiteSettingsModalProps {
  lang: Language;
  settings: SystemSettings;
  onClose: () => void;
  onSaveSettings: (settings: SystemSettings) => void;
}

export const SiteSettingsModal: React.FC<SiteSettingsModalProps> = ({
  lang,
  settings,
  onClose,
  onSaveSettings,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  const [siteName, setSiteName] = React.useState(settings.siteName);
  const [allowPublicPost, setAllowPublicPost] = React.useState(settings.allowPublicPost);
  const [requireApproval, setRequireApproval] = React.useState(settings.requireApproval);
  const [contactEmail, setContactEmail] = React.useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = React.useState(settings.contactPhone);
  const [address, setAddress] = React.useState(settings.address);
  const [appVersionMode, setAppVersionMode] = React.useState(settings.appVersionMode || "v3");
  const [themeMode, setThemeMode] = React.useState<"light" | "dark">(settings.themeMode || "dark");
  const [tetherWalletAddress, setTetherWalletAddress] = React.useState(settings.tetherWalletAddress || "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD");
  const [adminShetabCard, setAdminShetabCard] = React.useState(settings.adminShetabCard || "6037991823456789");
  const [promoCodeState, setPromoCodeState] = React.useState(settings.promoCode || "MELK20");
  const [promoDiscountState, setPromoDiscountState] = React.useState<number>(settings.promoDiscountPct !== undefined ? settings.promoDiscountPct : 20);
  const [goldPriceTomanState, setGoldPriceTomanState] = React.useState<number>(settings.goldPriceToman !== undefined ? settings.goldPriceToman : 800);
  const [goldPriceUSDTState, setGoldPriceUSDTState] = React.useState<number>(settings.goldPriceUSDT !== undefined ? settings.goldPriceUSDT : 10);
  const [fiatCurrencyNameState, setFiatCurrencyNameState] = React.useState<string>(settings.fiatCurrencyName || "AFN");

  // Dynamic Adaptive tariffs configuration
  const [freeListingsLimit, setFreeListingsLimit] = React.useState<number>(settings.freeListingsLimit !== undefined ? settings.freeListingsLimit : 1);
  const [feeType, setFeeType] = React.useState<"fixed" | "percentage">(settings.feeType || "fixed");
  const [listingFeePrice, setListingFeePrice] = React.useState<number>(settings.listingFeePrice !== undefined ? settings.listingFeePrice : 250000);
  const [listingFeeUSDT, setListingFeeUSDT] = React.useState<number>(settings.listingFeeUSDT !== undefined ? settings.listingFeeUSDT : 5);
  const [feeRatePct, setFeeRatePct] = React.useState<number>(settings.feeRatePct !== undefined ? settings.feeRatePct : 0.05);

  const [cacheSuccessMsg, setCacheSuccessMsg] = React.useState("");
  const [securityPin, setSecurityPin] = React.useState("");
  const [pinError, setPinError] = React.useState("");

  const clearFirefoxBrowserCache = () => {
    try {
      // Clear sessions and index indicators
      sessionStorage.clear();
      
      // Let's clear service worker cache of assets if applicable
      if (window.caches) {
        window.caches.keys().then((names) => {
          for (const name of names) {
            window.caches.delete(name);
          }
        });
      }

      // Check for service worker registries
      if (navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }

      setCacheSuccessMsg(lang === "fa" 
        ? "✓ کش موقت مرورگر با موفقیت پاکسازی شد! در حال بارگذاری مجدد و ایمن سامانه..." 
        : "✓ Browser temporary cache registry cleared! Performing direct hard reload...");

      // Perform direct hard reload with cache-bust parameter to bypass proxy/firefox cache
      setTimeout(() => {
        const bustUrl = new URL(window.location.href);
        bustUrl.searchParams.set("cb", Date.now().toString());
        window.location.replace(bustUrl.toString());
      }, 1500);
    } catch (err) {
      console.error("Cache busting error:", err);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");

    // Detect if Tether address is being modified from the original settings
    if (tetherWalletAddress !== (settings.tetherWalletAddress || "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD")) {
      const cleanPin = securityPin.trim();
      if (cleanPin !== "1214" && cleanPin !== "1234") {
        setPinError(lang === "fa"
          ? "❌ خطا: پین‌کد امنیتی مدیریت نادرست است! تغییر آدرس کیف پول تتر مسدود شد."
          : "❌ Error: Invalid Admin Security PIN! Tether address changes blocked.");
        return;
      }
    }

    onSaveSettings({
      siteName,
      allowPublicPost,
      requireApproval,
      contactEmail,
      contactPhone,
      address,
      appVersionMode,
      themeMode,
      tetherWalletAddress,
      adminShetabCard,
      promoCode: promoCodeState,
      promoDiscountPct: promoDiscountState,
      freeListingsLimit,
      feeType,
      listingFeePrice,
      listingFeeUSDT,
      feeRatePct,
      goldPriceToman: goldPriceTomanState,
      goldPriceUSDT: goldPriceUSDTState,
      fiatCurrencyName: fiatCurrencyNameState,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" id="settings-backdrop-container">
      <div className={`w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden ${isRtl ? "rtl text-right" : "ltr text-left"}`}>
        <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-950/40 shrink-0">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>⚙️</span> {t.navSettings || "Configure Ariana Rahnuma Settings"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition text-xs bg-slate-800 px-2 py-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-300 custom-scrollbar pr-3">
          {/* Site name */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">
              {getTranslation(lang, "settingsTitle", "Registry Title Name")}
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 bg-slate-950 border border-slate-850 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">
                  {getTranslation(lang, "settingsGuestPosting", "Allow Guest Posting")}
                </span>
                <span className="text-[10px] text-slate-500">
                  {getTranslation(lang, "settingsGuestPostingDesc", "Permit unverified agents to post properties.")}
                </span>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded accent-indigo-600 bg-slate-950 border-slate-800"
                checked={allowPublicPost}
                onChange={(e) => setAllowPublicPost(e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-900 pt-2.5">
              <div>
                <span className="font-bold text-slate-200 block">
                  {getTranslation(lang, "settingsAdminApprovals", "Enforce Admin Approvals")}
                </span>
                <span className="text-[10px] text-slate-500">
                  {getTranslation(lang, "settingsAdminApprovalsDesc", "All newly posted items require admin verification.")}
                </span>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded accent-indigo-600 bg-slate-950 border-slate-800"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
              />
            </div>

            <div className="flex flex-col border-t border-slate-900 pt-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">
                    {getTranslation(lang, "settingsVersionTwo", "Version 2 Layout Engine")}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {getTranslation(lang, "settingsVersionTwoDesc", "Activate simple layout showing all live currencies immediately.")}
                  </span>
                </div>
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-850 gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setAppVersionMode("v3")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${appVersionMode === "v3" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                  >
                    V3
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppVersionMode("v2")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${appVersionMode === "v2" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                  >
                    V2
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col border-t border-slate-900 pt-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">
                    {getTranslation(lang, "settingsAppearance", "App Appearance (Light / Dark)")}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {getTranslation(lang, "settingsAppearanceDesc", "Switch between Dark and Light mode themes.")}
                  </span>
                </div>
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-850 gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setThemeMode("light")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${themeMode === "light" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                  >
                    {getTranslation(lang, "settingsAppearanceLight", "Light")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode("dark")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${themeMode === "dark" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                  >
                    {getTranslation(lang, "settingsAppearanceDark", "Dark")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {getTranslation(lang, "settingsContactEmail", "Contact Email")}
              </label>
              <input
                type="email"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {getTranslation(lang, "settingsContactPhone", "Hotline Representative")}
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">
              {getTranslation(lang, "settingsAddress", "Registry Address")}
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

             <div>
            <label className="block text-slate-400 mb-1 font-semibold">
              {lang === "fa" ? "💳 شماره ۱۶ رقمی کارت شتاب مقصد مدیریت (جهت دریافت واریزی):" : "💳 Destination Admin Bank Shetab Card:"}
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-center font-bold tracking-widest text-xs pr-10"
              value={adminShetabCard}
              onChange={(e) => setAdminShetabCard(e.target.value.replace(/\s?/g, '').trim())}
              placeholder="e.g. 6037991823456789"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === "fa" ? "🎫 کد تخفیف جدید مدیریت:" : "🎫 Custom Promo Code:"}
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-indigo-400 uppercase text-center font-bold font-mono tracking-wider"
                value={promoCodeState}
                onChange={(e) => setPromoCodeState(e.target.value.trim().toUpperCase())}
                placeholder="e.g. MELK20"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === "fa" ? "📈 میزان تخفیف کد (%)" : "📈 Promo Discount Pct (%)"}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 text-center font-mono font-bold"
                value={promoDiscountState}
                onChange={(e) => setPromoDiscountState(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                placeholder="20"
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed -mt-2">
            {lang === "fa" 
              ? "💡 راهنمای کدهای چندگانه: می‌توانید کدهای متعددی را با ویرگول انگلیسی (,) از هم جدا کنید و حتی برای هر کدام درصد متفاوتی قرار دهید؛ مثلاً: AFG80:80, IRAN30:30, TURKEY20 (کد AFG80 با ۸۰٪، کد IRAN30 با ۳۰٪ و بقیه با مقدار پیش‌فرض اعمال می‌شوند)" 
              : "💡 Multi-code guidance: Separate multiple codes by comma (,). You can even set separate percentages using colon, e.g. AFG80:80, IRAN30:30, TURKEY20."}
          </p>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">
              {getTranslation(lang, "settingsWalletAddress", "Personal USDT-TRC20 Wallet Address")}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-center tracking-wide pr-10"
                value={tetherWalletAddress}
                onChange={(e) => setTetherWalletAddress(e.target.value.trim())}
                placeholder="T..."
              />
              <span className="absolute right-3 top-2.5 text-slate-500">🛡️</span>
            </div>
            
            {tetherWalletAddress !== (settings.tetherWalletAddress || "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD") && (
              <div className="mt-2.5 bg-rose-500/10 border border-rose-500/25 p-3 rounded-2xl space-y-2 animate-fade-in">
                <div className="text-[10px] text-rose-400 font-extrabold flex items-center gap-1.5 uppercase font-mono">
                  <span>🚨</span>
                  {lang === "fa" 
                    ? "تغییر آدرس تتر شناسایی شد! تایید هویت مدیریت الزامی است:" 
                    : "Escrow wallet modification requires Admin PIN verification:"}
                </div>
                <input
                  type="password"
                  placeholder={lang === "fa" ? "پین‌کد امنیت مدیریت (مثال: ۱۲۳۴)" : "Enter Admin Security PIN (e.g. 1234)"}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-center font-mono font-bold text-white text-xs tracking-widest focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                />
                <p className="text-[9px] text-slate-500 leading-normal">
                  {lang === "fa" 
                    ? "جهت جلوگیری از حملات فیشینگ یا دسترسی هکر، هرگونه ثبت تغییر آدرس ولت تتر مستلزم وارد کردن کد تاییدیه آریانا رهنما (۱۲۳۴) است." 
                    : "To prevent cyber phishing, changing the Tether node recipient address requires specifying the platform lock clearance (1234)."}
                </p>
              </div>
            )}

            {pinError && (
              <div className="mt-2 text-[10px] bg-red-950/60 border border-red-900 text-red-400 font-extrabold p-2.5 rounded-xl text-center shadow animate-bounce">
                {pinError}
              </div>
            )}
          </div>

          {/* Gold Subscription Pricing Config */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3.5">
            <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider block font-mono">
              💎 {lang === "fa" ? "تعرفه عضویت طلایی ویژه" : "Gold Premium Membership Pricing"}
            </span>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold text-xs">
                {lang === "fa" ? "نام/عنوان ارز محلی شما (مثال: AFN یا تومان):" : "Your Local Currency Name (e.g. AFN or Toman):"}
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-bold text-center font-mono"
                value={fiatCurrencyNameState}
                onChange={(e) => setFiatCurrencyNameState(e.target.value)}
                placeholder="AFN"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  {lang === "fa" ? `تعرفه ماهانه (${fiatCurrencyNameState}):` : `Monthly Price (${fiatCurrencyNameState}):`}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-amber-450 font-mono font-bold text-center"
                  value={goldPriceTomanState}
                  onChange={(e) => setGoldPriceTomanState(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  {lang === "fa" ? "تعرفه ماهانه (USDT):" : "Monthly Price (USDT):"}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-amber-450 font-mono font-bold text-center"
                  value={goldPriceUSDTState}
                  onChange={(e) => setGoldPriceUSDTState(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            </div>
            <p className="text-[9.5px] text-slate-500 leading-normal">
              {lang === "fa" 
                ? "💡 این مبالغ، هزینه پایه عضویت طلایی فرستنده هستند که تخفیف‌های عمومی و کد تخفیف معرف شما روی آن اعمال می‌شود."
                : "💡 These are the base monthly Gold subscription price values. Global site and promo code discounts will be applied over them."}
            </p>
          </div>

          {/* Dynamic Fees subsection */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3.5">
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider block font-mono">
              💰 {getTranslation(lang, "settingsFeesSection", "Fees & Free Limits Configuration")}
            </span>

            {/* Free Limit per user */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {getTranslation(lang, "settingsFreeLimit", "Initial Free Listings Limit:")}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={freeListingsLimit}
                  onChange={(e) => setFreeListingsLimit(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono font-bold text-center focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. 5"
                />
              </div>
              <p className="text-[9.5px] text-slate-500 mt-1">
                {lang === "fa" 
                  ? "💡 تعداد آگهی‌های رایگان اولیه جهت شروع فعالیت (می‌توانید برای مثال عدد ۵، ۱۰، یا ۱۰۰ قرار دهید)."
                  : getTranslation(lang, "settingsFreeLimitDesc", "Configure how many listings are free before payment window opens.")}
              </p>
            </div>

            {/* Calculation Model: Fixed or Percentage */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {getTranslation(lang, "settingsFeeModel", "Fee Calculation Model:")}
              </label>
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-850 gap-1">
                <button
                  type="button"
                  onClick={() => setFeeType("fixed")}
                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${feeType === "fixed" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                >
                  {getTranslation(lang, "settingsFeeModelFixed", "Fixed Flat fee")}
                </button>
                <button
                  type="button"
                  onClick={() => setFeeType("percentage")}
                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${feeType === "percentage" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                >
                  {getTranslation(lang, "settingsFeeModelPct", "Value percentage (%)")}
                </button>
              </div>
            </div>

            {/* Configured values conditional layout */}
            {feeType === "fixed" ? (
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    {getTranslation(lang, "settingsFeeUAE", "UAE Local Fee (AED):")}
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs text-center"
                    value={listingFeePrice}
                    onChange={(e) => setListingFeePrice(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    {getTranslation(lang, "settingsFeeCross", "Cross-border Fee (USDT):")}
                  </label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs text-center"
                    value={listingFeeUSDT}
                    onChange={(e) => setListingFeeUSDT(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            ) : (
              <div className="pt-1 space-y-1">
                <label className="block text-slate-400 mb-1 font-semibold">
                  {getTranslation(lang, "settingsFeePct", "Fee Percentage (%):")}
                </label>
                <input
                  type="number"
                  required
                  step="0.001"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-emerald-400 font-mono text-center text-xs font-bold"
                  value={feeRatePct}
                  onChange={(e) => setFeeRatePct(parseFloat(e.target.value) || 0)}
                />
                <p className="text-[9.5px] text-slate-500">
                  {getTranslation(lang, "settingsFeePctDesc", "Percentage rate (e.g., 0.05% of sale price or rental size).")}
                </p>
              </div>
            )}
          </div>

          {/* DEDICATED FIREFOX & BROWSER CACHE BUSTING UTILITIES */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
            <span className="text-[10px] text-rose-400 font-extrabold uppercase tracking-wider block font-mono">
              ⚡ {lang === "fa" ? "سامانه رفع ابهام کش مرورگر (فایرفاکس / کروم)" : "Browser Cache & Firefox Diagnostics Panel"}
            </span>

            <div className="text-[10.5px] text-slate-400 leading-normal space-y-1.5 border-b border-slate-900 pb-2">
              {lang === "fa" ? (
                <>
                  <p>اگر تغییرات سامانه یا ثبت‌های جدید شما به دلیل کش پیله‌ای فایرفاکس لود نمی‌شود:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500 text-[10px]">
                    <li>شما می‌توانید با زدن دکمه پاکسازی زیر، حافظه موقت سشن را تخلیه کنید.</li>
                    <li>همچنین در فایرفاکس دکمه‌های <strong>Ctrl + F5</strong> را نگه دارید.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>If app features, newly updated items, or state indicators are not showing due to browser/Firefox caching:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500 text-[10px]">
                    <li>Click the purge button below to wipe local dynamic session storage indices.</li>
                    <li>Alternatively, press <strong>Ctrl + F5</strong> on your keyboard inside Firefox.</li>
                  </ul>
                </>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={clearFirefoxBrowserCache}
                className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-900/35 rounded-xl font-bold text-[10.5px] transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                🗑️ {lang === "fa" ? "پاکسازی فوری کش موقت و بارگذاری مجدد سخت" : "Purge Temporary Cache & Hard Reload"}
              </button>
            </div>

            {cacheSuccessMsg && (
              <p className="text-[10px] text-emerald-400 font-extrabold text-center animate-pulse pt-1">
                {cacheSuccessMsg}
              </p>
            )}
          </div>

          </div>

          <div className="flex gap-3 p-5 border-t border-slate-850 bg-slate-950/50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow text-xs transition cursor-pointer"
            >
              🚀 {t.btnSave}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
