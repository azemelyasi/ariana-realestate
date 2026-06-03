import React from "react";
import { Language } from "../types";
import { TRANSLATIONS, getTranslation } from "../i18n";
import { toLocalizedDigits } from "./LocalCalendar";

interface AboutViewProps {
  lang: Language;
}

export const AboutView: React.FC<AboutViewProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  return (
    <div className={`p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-8 ${isRtl ? "rtl text-right" : "ltr text-left"}`} id="about-info-view">
      {/* Badge & Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="px-3 py-1 bg-indigo-950 text-indigo-400 border border-indigo-900/40 rounded-full text-[10px] tracking-wider font-extrabold uppercase inline-block">
          {t.aboutBadge || "CADASTRAL REAL ESTATE"}
        </span>
        <h2 className="text-2xl font-black text-white">
          {t.aboutTitle || "About Ariana Rahnuma Platform"}
        </h2>
        <p className="text-xs text-slate-400">
          {t.aboutIntro || "Ariana Rahnuma operates a globally decentralized, high-end digital real estate registry with live forex indices."}
        </p>
      </div>

      {/* Structured Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-slate-850 py-6 text-center">
        <div>
          <span className="text-3xl font-black text-indigo-400 font-mono block">
            {toLocalizedDigits("2026", lang)}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">
            {getTranslation(lang, "aboutYearFounded", "Year of Foundation")}
          </span>
        </div>
        <div>
          <span className="text-3xl font-black text-indigo-400 font-mono block">
            {toLocalizedDigits("5,000+", lang)}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">
            {getTranslation(lang, "aboutEvaluatedListings", "Evaluated Listings")}
          </span>
        </div>
        <div>
          <span className="text-3xl font-black text-emerald-400 font-mono block">
            {toLocalizedDigits("99.8%", lang)}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">
            {getTranslation(lang, "aboutSatisfactionIndex", "Satisfaction Index")}
          </span>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
          <span className="text-2xl">⚡</span>
          <h4 className="text-sm font-bold text-slate-200">
            {t.aboutCard1Title || "Daily Forex Synchronization"}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.aboutCard1Desc || "Instantly tracks daily volatility across global currencies, resolving standard indexes automatically."}
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
          <span className="text-2xl">🔒</span>
          <h4 className="text-sm font-bold text-slate-200">
            {t.aboutCard2Title || "Dual-Authenticated Safety"}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.aboutCard2Desc || "Protects high-bracket listings with isolated image upload structures and anti-scraping controls."}
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
          <span className="text-2xl">🌐</span>
          <h4 className="text-sm font-bold text-slate-200">
            {t.aboutCard3Title || "13 Global Languages Engine"}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.aboutCard3Desc || "Instantly localizes numeric formats and details for buyers worldwide, easing complex steps."}
          </p>
        </div>
      </div>
    </div>
  );
};
