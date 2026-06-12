import React, { useState } from "react";
import { Property, Language } from "../types";
import { TRANSLATIONS } from "../i18n";
import { COUNTRIES } from "../data";
import { toLocalizedDigits } from "./LocalCalendar";
import { Heart, Scale, Trash2, X, Sparkles, Phone } from "lucide-react";

interface FavoritesManagerProps {
  favoriteIds: string[];
  properties: Property[];
  lang: Language;
  onViewDetails: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
  openDetailsModalDirectly?: (property: Property) => void;
}

export const FavoritesManager: React.FC<FavoritesManagerProps> = ({
  favoriteIds,
  properties,
  lang,
  onViewDetails,
  onToggleFavorite,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [comparingIds, setComparingIds] = useState<string[]>([]);
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(false);

  // Filter properties based on bookmarked list
  const favoritedProperties = properties.filter((p) => favoriteIds.includes(p.id));

  // Handle adding property to active comparison
  const toggleComparingId = (id: string) => {
    setComparingIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id]; // keep max 3 for clean layout
      }
      return [...prev, id];
    });
  };

  const comparedProperties = properties.filter((p) => comparingIds.includes(p.id));

  const getFormatPrice = (p: Property) => {
    const c = COUNTRIES.find((cnt) => cnt.code === p.country) || COUNTRIES[0];
    if (p.type === "sale") {
      const priceVal = p.totalPrice || ((p.pricePerSqm || 0) * p.area);
      return `${toLocalizedDigits(priceVal.toLocaleString(), lang)} ${c.currency}`;
    } else if (p.type === "rent") {
      return `${t.labelRent || "Rent"}: ${toLocalizedDigits((p.rent || 0).toLocaleString(), lang)} ${c.currency}`;
    } else {
      return `${t.labelDeposit || "Deposit"}: ${toLocalizedDigits((p.deposit || 0).toLocaleString(), lang)} ${c.currency} ${
        p.rent ? `+ ${toLocalizedDigits(p.rent.toLocaleString(), lang)}/m` : ""
      }`;
    }
  };

  return (
    <div id="favorites-manager-root">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold p-3.5 rounded-full shadow-lg shadow-rose-600/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-xs border border-rose-500/20"
      >
        <Heart className="w-5 h-5 fill-current animate-pulse text-white" />
        {favoritedProperties.length > 0 && (
          <span className="bg-white text-rose-600 font-mono font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-inner">
            {toLocalizedDigits(favoritedProperties.length, lang)}
          </span>
        )}
        <span className="hidden md:inline-block">
          {lang === "fa" ? "املاک برگزیده و مقایسه" : "Bookmarks & Compare"}
        </span>
      </button>

      {/* Slide-out Sidebar Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end" onClick={() => setIsOpen(false)}>
          <div
            className="w-full max-w-md bg-slate-950 border-l border-slate-850 h-full flex flex-col shadow-2xl relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-850 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-current" />
                <h4 className="font-black text-sm uppercase tracking-wider font-mono">
                  {lang === "fa" ? "املاک نشان‌شده" : "Saved Properties Ledger"}
                </h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-900 rounded-xl transition text-slate-400 hover:text-white"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {favoritedProperties.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                  <Heart className="w-8 h-8 text-slate-800 mb-2" />
                  <p className="italic">
                    {lang === "fa"
                      ? "هنوز ملکی را نشان نکرده‌اید."
                      : "No active properties in your ledger yet."}
                  </p>
                  <p className="text-[10px] text-slate-650 mt-1">
                    {lang === "fa"
                      ? "روی نماد قلب آگهی‌ها بزنید تا ذخیره شوند."
                      : "Tap the heart on any property card to bookmark it."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold tracking-wider font-mono">
                    <span>
                      {lang === "fa" ? "لیست ذخیره شده" : "CURRENT LEDGER"}
                    </span>
                    <span>
                      {toLocalizedDigits(favoritedProperties.length, lang)} {lang === "fa" ? "آگهی" : "Units"}
                    </span>
                  </div>

                  {favoritedProperties.map((p) => {
                    const c = COUNTRIES.find((cnt) => cnt.code === p.country) || COUNTRIES[0];
                    const isSelectedForComp = comparingIds.includes(p.id);

                    return (
                      <div
                        key={p.id}
                        className="p-3 bg-slate-900/60 border border-slate-850 rounded-2xl flex gap-3 items-center justify-between group hover:border-slate-800 hover:bg-slate-900 transition-all duration-300"
                      >
                        <div
                          className="flex gap-3 items-center flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            onViewDetails(p);
                            setIsOpen(false);
                          }}
                        >
                          <img
                            src={p.images[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600"}
                            alt={p.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-850 bg-slate-950 shrink-0"
                          />
                          <div className="min-w-0 space-y-0.5">
                            <span className="text-[9px] text-indigo-400 font-bold block truncate">
                              {c.flag} {lang === "fa" ? c.nameFa : c.nameEn} • {p.district}
                            </span>
                            <h5 className="text-[11px] font-bold text-slate-100 line-clamp-1 group-hover:text-indigo-300 transition">
                              {p.title}
                            </h5>
                            <span className="text-[10px] font-bold font-mono text-white block">
                              {getFormatPrice(p)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Add to comparison matrix */}
                          <button
                            onClick={() => toggleComparingId(p.id)}
                            title={isSelectedForComp ? "Remove from comparison" : "Add to comparison"}
                            className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isSelectedForComp
                                ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-400"
                                : "bg-slate-950 hover:bg-slate-850 border-slate-850 text-slate-400 hover:text-indigo-400"
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete favorite */}
                          <button
                            onClick={() => onToggleFavorite(p.id)}
                            className="p-2 bg-slate-950 hover:bg-rose-950/40 border border-slate-850 hover:border-rose-900/40 text-slate-400 hover:text-rose-400 rounded-xl transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Compare Matrix Trigger */}
            <div className="p-5 border-t border-slate-850 bg-slate-950/70 backdrop-blur-md space-y-3 shrink-0">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-450">{lang === "fa" ? "در صف مقایسه:" : "To Compare:"}</span>
                <span className="font-black font-mono text-white text-xs">
                  {toLocalizedDigits(comparingIds.length, lang)} / {toLocalizedDigits(3, lang)}
                </span>
              </div>

              {comparingIds.length >= 2 ? (
                <button
                  onClick={() => setShowComparisonMatrix(true)}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <Scale className="w-4 h-4 text-white" />
                  <span>
                    {lang === "fa" ? "مقایسه آنلاین املاک نشان‌شده" : "Compare Selected Properties"}
                  </span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 bg-slate-900 text-slate-500 border border-slate-850 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                >
                  <Scale className="w-4 h-4 text-slate-600" />
                  <span>
                    {lang === "fa" ? "حداقل ۲ آگهی را انتخاب کنید" : "Add minimum 2 to compare"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Comparison Overlay Matrix */}
      {showComparisonMatrix && comparedProperties.length >= 2 && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowComparisonMatrix(false)}
              className="absolute top-5 right-5 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Title */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-indigo-400 font-mono tracking-widest block">
                Zillow Side-by-side Comparative Analytics
              </span>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-400" />
                {lang === "fa" ? `مرکز مقایسه تخصصی املاک ${t.brand}` : `${t.brand} Advanced Side-by-Side Comparison Ledger`}
              </h3>
            </div>

            {/* Comparison Grid Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs text-left" style={{ direction: isRtl ? "rtl" : "ltr" }}>
                <thead>
                  <tr className="border-b border-slate-850">
                    <th className="py-4 px-4 text-slate-450 font-bold uppercase tracking-wider text-[10px] w-1/4">
                      {lang === "fa" ? "شاخصهای کارشناسی" : "Key Parameters"}
                    </th>
                    {comparedProperties.map((p) => (
                      <th key={p.id} className="py-4 px-4 font-bold text-slate-100 text-center w-1/4">
                        <div className="flex flex-col items-center space-y-2">
                          <img
                            src={p.images[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600"}
                            alt={p.title}
                            className="w-20 h-14 rounded-lg object-cover border border-slate-800"
                          />
                          <span className="line-clamp-1 max-w-[150px] text-[11px] block">{p.title}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60 font-mono text-[11px]">
                  {/* Row 1: Country Flag & Name */}
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-medium">{lang === "fa" ? "کشور و موقعیت" : "Region Location"}</td>
                    {comparedProperties.map((p) => {
                      const c = COUNTRIES.find((cnt) => cnt.code === p.country) || COUNTRIES[0];
                      return (
                        <td key={p.id} className="py-3 px-4 text-slate-200 text-center">
                          {c.flag} {lang === "fa" ? c.nameFa : c.nameEn}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 2: Sub-district */}
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-medium">{lang === "fa" ? "منطقه شهری" : "Sub-District"}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-200 text-center font-bold">
                        📍 {p.district}
                      </td>
                    ))}
                  </tr>

                  {/* Row 3: Total price in native currency */}
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-medium font-semibold text-indigo-400">
                      {lang === "fa" ? "بهای نهایی (محلی)" : "Baseline Price (Native)"}
                    </td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-indigo-300 font-bold text-center">
                        {getFormatPrice(p)}
                      </td>
                    ))}
                  </tr>

                  {/* Row 4: Area */}
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-medium">{lang === "fa" ? "متراژ زیربنا" : "Sqm Area"}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-200 text-center">
                        📐 {toLocalizedDigits(p.area, lang)} {lang === "fa" ? "متر مربع" : "sqm"}
                      </td>
                    ))}
                  </tr>

                  {/* Row 5: Bedrooms */}
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-medium">{lang === "fa" ? "تعداد خواب" : "Bedrooms count"}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-200 text-center">
                        🛌 {toLocalizedDigits(p.bedrooms, lang)}
                      </td>
                    ))}
                  </tr>

                  {/* Row 6: Heating */}
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-medium">{lang === "fa" ? "سیستم گرمایش" : "Heating System"}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-350 text-center">
                        {p.heating ? p.heating : (lang === "fa" ? "ندارد" : "None")}
                      </td>
                    ))}
                  </tr>

                  {/* Row 7: Cooling */}
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-medium">{lang === "fa" ? "سیستم سرمایش" : "Cooling System"}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-350 text-center">
                        {p.cooling ? p.cooling : (lang === "fa" ? "ندارد" : "None")}
                      </td>
                    ))}
                  </tr>

                  {/* Row 8: Cabinets */}
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-medium">{lang === "fa" ? "کابینت" : "Cabinets quality"}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-350 text-center">
                        {p.cabinets ? p.cabinets : (lang === "fa" ? "ندارد" : "None")}
                      </td>
                    ))}
                  </tr>

                  {/* Row 9: Title Deed */}
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-medium">{lang === "fa" ? "وضعیت سند قانونی" : "Legal Title Deed"}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center">
                        <span className="text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-900/35 px-2 py-0.5 rounded-md font-bold">
                          {p.deed ? p.deed : (lang === "fa" ? "سند کاداستری معتبر" : "Sovereign Stamp")}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row 10: Phone number */}
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-medium">{lang === "fa" ? "ارتباط با کارشناس" : "Listing Agent Cell Phone"}</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center">
                        <a
                          href={`tel:${p.phone}`}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center justify-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{toLocalizedDigits(p.phone, lang)}</span>
                        </a>
                      </td>
                    ))}
                  </tr>

                  {/* Row 11: Button direct click */}
                  <tr>
                    <td className="py-4 px-4 text-slate-400 font-medium"></td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-4 px-4 text-center">
                        <button
                          onClick={() => {
                            onViewDetails(p);
                            setShowComparisonMatrix(false);
                            setIsOpen(false);
                          }}
                          className="w-full py-1.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          {lang === "fa" ? "باز کردن پرونده املاک" : "Open Asset Dossier"}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Hint message */}
            <div className="bg-slate-950/60 p-4 rounded-xl flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                {lang === "fa" ? "املاک مقایسه‌شده شامل محاسبات مابه التفاوت قیمت بر حسب متراژ کاداستر هستند." : "All compared listings possess corresponding verified national land registry certificates."}
              </span>
              <button
                onClick={() => setComparingIds([])}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-bold"
              >
                {lang === "fa" ? "پاک کردن همه" : "Clear All Targets"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
