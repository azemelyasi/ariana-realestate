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

  // Dynamic Adaptive tariffs configuration
  const [freeListingsLimit, setFreeListingsLimit] = React.useState<number>(settings.freeListingsLimit !== undefined ? settings.freeListingsLimit : 1);
  const [feeType, setFeeType] = React.useState<"fixed" | "percentage">(settings.feeType || "fixed");
  const [listingFeePrice, setListingFeePrice] = React.useState<number>(settings.listingFeePrice !== undefined ? settings.listingFeePrice : 250000);
  const [listingFeeUSDT, setListingFeeUSDT] = React.useState<number>(settings.listingFeeUSDT !== undefined ? settings.listingFeeUSDT : 5);
  const [feeRatePct, setFeeRatePct] = React.useState<number>(settings.feeRatePct !== undefined ? settings.feeRatePct : 0.05);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      freeListingsLimit,
      feeType,
      listingFeePrice,
      listingFeeUSDT,
      feeRatePct,
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
              {getTranslation(lang, "settingsWalletAddress", "Personal USDT-TRC20 Wallet Address")}
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-center tracking-wide"
              value={tetherWalletAddress}
              onChange={(e) => setTetherWalletAddress(e.target.value.trim())}
              placeholder="T..."
            />
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
              <select
                value={freeListingsLimit}
                onChange={(e) => setFreeListingsLimit(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-semibold cursor-pointer"
              >
                <option value={0}>{getTranslation(lang, "settingsFreeLimitZero", "0 (Charge from the start)")}</option>
                <option value={1}>{getTranslation(lang, "settingsFreeLimitOne", "1 First listing free")}</option>
                <option value={2}>{getTranslation(lang, "settingsFreeLimitTwo", "2 First two listings free")}</option>
                <option value={3}>{getTranslation(lang, "settingsFreeLimitThree", "3 First three listings free")}</option>
              </select>
              <p className="text-[9.5px] text-slate-500 mt-1">
                {getTranslation(lang, "settingsFreeLimitDesc", "Configure how many listings are free before payment window opens.")}
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
