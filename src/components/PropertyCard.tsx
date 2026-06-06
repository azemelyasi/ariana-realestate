import React from "react";
import { Property, Language } from "../types";
import { TRANSLATIONS, getTranslation } from "../i18n";
import { COUNTRIES } from "../data";
import { toLocalizedDigits } from "./LocalCalendar";
import { Heart } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  lang: Language;
  onViewDetails: (property: Property) => void;
  onDelete?: (id: string) => void;
  onEdit?: (property: Property) => void;
  showAdminControls?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  isInClientBasket?: boolean;
  onToggleClientBasket?: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  lang,
  onViewDetails,
  onDelete,
  onEdit,
  showAdminControls = false,
  isFavorite = false,
  onToggleFavorite,
  isInClientBasket = false,
  onToggleClientBasket,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const c = COUNTRIES.find((cnt) => cnt.code === property.country) || COUNTRIES[0];

  const formatPrice = () => {
    if (property.type === "sale") {
      const priceVal = property.totalPrice || ((property.pricePerSqm || 0) * property.area);
      return `${toLocalizedDigits(priceVal.toLocaleString(), lang)} ${c.currency}`;
    } else if (property.type === "rent") {
      return `${t.labelRent || "Rent"}: ${toLocalizedDigits((property.rent || 0).toLocaleString(), lang)} ${c.currency}`;
    } else {
      // mortgage or rent_mortgage
      return `${t.labelDeposit || "Deposit"}: ${toLocalizedDigits((property.deposit || 0).toLocaleString(), lang)} ${c.currency} ${
        property.rent ? `+ ${toLocalizedDigits(property.rent.toLocaleString(), lang)}/m` : ""
      }`;
    }
  };

  const getSqmPriceText = () => {
    if (property.pricePerSqm) {
      return `${toLocalizedDigits(property.pricePerSqm.toLocaleString(), lang)} ${c.currency}/${getTranslation(lang, "perSqmText", "sqm")}`;
    }
    return "";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:-translate-y-1 transition duration-300 flex flex-col justify-between shadow-lg" id={`property-card-${property.id}`}>
      {/* Top Image & Badge */}
      <div className="relative aspect-video bg-slate-950 overflow-hidden">
        <img
          src={property.images[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600"}
          alt={property.title}
          className="object-cover w-full h-full hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-indigo-400 border border-slate-800 flex items-center gap-1">
          <span>{c.flag}</span>
          <span>{lang === "fa" ? c.nameFa : c.nameEn}</span>
        </div>

        {/* Premium Heart Bookmark Toggle */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur border text-sm transition-all shadow-md cursor-pointer active:scale-90 ${
              isFavorite
                ? "bg-rose-500/25 border-rose-500/50 text-rose-400 hover:bg-rose-500/35"
                : "bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
            title="Bookmark unit"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Client Export Basket Toggle */}
        {onToggleClientBasket && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleClientBasket(property.id);
            }}
            className={`absolute top-3 right-11 p-1.5 rounded-full backdrop-blur border text-xs transition-all shadow-md cursor-pointer active:scale-90 flex items-center justify-center ${
              isInClientBasket
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 font-black scale-105"
                : "bg-slate-950/75 border-slate-800/80 text-slate-400 hover:text-emerald-400 hover:bg-slate-900"
            }`}
            title={lang === "fa" ? "افزودن به سبد خروجی مشتری" : "Add to Client Export Basket"}
          >
            📥
          </button>
        )}

        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-black font-mono text-indigo-300 border border-indigo-900/30 flex items-center gap-1 shadow-md">
            <span>📸</span>
            <span>{toLocalizedDigits(property.images.length, lang)} {lang === "fa" ? "تصویر" : "Photos"}</span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-indigo-600 px-3 py-1 rounded-lg text-[10px] uppercase font-black text-white tracking-widest shadow-md">
          {property.type === "sale" ? getTranslation(lang, "dealTypeSale", "Sale") : getTranslation(lang, "dealTypeRent", "Rent")}
        </div>
      </div>

      {/* Content details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1 flex-wrap">
            <span className="text-[10px] text-indigo-400 font-bold tracking-wider block truncate" title={`${property.district}${property.address && property.address !== property.district ? ` - ${property.address}` : ""}`}>
              📍 {property.district} {property.address && property.address !== property.district ? `(${property.address})` : ""}
            </span>
            <span className="text-[8px] bg-indigo-950/40 border border-indigo-900/30 px-1.5 py-0.5 rounded text-indigo-300 font-mono" title="Mathematical Coordinates Secured to avoid lawsuits">
              📡 GPS: SECURED
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-100 line-clamp-1 mb-2 hover:text-indigo-400 transition cursor-pointer" onClick={() => onViewDetails(property)}>
            {property.title}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {property.description}
          </p>

          {/* Zillow Killer Trust badging */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {property.isLocalTrustEndorsed ? (
              <span className="text-[8.5px] items-center bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-400 font-bold flex gap-1">
                🤝 {lang === "fa" ? "تعهدنامه ملی و محلی" : "Local Trust Certified"}
              </span>
            ) : (
              <span className="text-[8.5px] items-center bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-emerald-400 font-bold flex gap-1">
                ⚖️ {lang === "fa" ? "مجوز رسمی احراز شد" : "Official Registry Verified"}
              </span>
            )}
            
            <span className="text-[8.5px] items-center bg-blue-500/15 border border-blue-500/20 px-2 py-0.5 rounded-lg text-blue-300 font-semibold font-mono flex gap-1">
              ⚖️ {lang === "fa" ? "سند بدون غش حقوقی" : "Lawsuit Immunity"}
            </span>
          </div>
        </div>

        <div>
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-[10px] text-slate-400 border-t border-b border-slate-850/60 py-2.5 font-mono">
            <div className="flex items-center gap-1.5">
              <span>📐</span>
              <span>
                {toLocalizedDigits(property.area || 0, lang)} {getTranslation(lang, "perSqmText", "sqm")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🛌</span>
              <span>
                {toLocalizedDigits(property.bedrooms !== undefined ? property.bedrooms : 0, lang)} {getTranslation(lang, "typeBedsPlural", "Beds")}
              </span>
            </div>
            {property.pricePerSqm && (
              <div className="col-span-2 text-indigo-400/80 text-[10px] flex items-center gap-1">
                <span>💎</span>
                <span>{getSqmPriceText()}</span>
              </div>
            )}
          </div>

          {/* Pricing Row */}
          <div className="flex items-center justify-between pb-1 gap-2">
            <div className="text-sm font-black text-white">{formatPrice()}</div>
            <div className="flex gap-1.5">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(property);
                  }}
                  className="text-xs bg-indigo-950/40 hover:bg-indigo-900 border border-indigo-900/30 text-indigo-400 hover:text-white px-2.5 py-1.5 rounded-xl transition font-medium cursor-pointer"
                  title={lang === "fa" ? "ویرایش آگهی" : "Edit Listing"}
                >
                  ✏️
                </button>
              )}
              <button
                onClick={() => onViewDetails(property)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-white px-3 py-1.5 rounded-xl transition font-medium cursor-pointer"
              >
                {getTranslation(lang, "viewDetailsText", "View Details")}
              </button>
            </div>
          </div>

          {/* Admin Tools banner */}
          {showAdminControls && onDelete && (
            <div className="flex justify-end gap-2 border-t border-slate-850 pt-3 mt-3">
              {onEdit && (
                <button
                  onClick={() => onEdit(property)}
                  className="text-[10px] bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
                >
                  ✏️ {lang === "fa" ? "ویرایش" : "Edit"}
                </button>
              )}
              <button
                onClick={() => onDelete(property.id)}
                className="text-[10px] bg-rose-950/60 hover:bg-rose-900 border border-rose-900/50 text-rose-300 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
              >
                ✕ {t.btnDelete}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
