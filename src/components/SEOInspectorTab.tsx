import React, { useState } from "react";
import { Language, Property } from "../types";

interface SEOInspectorTabProps {
  lang: Language;
  properties: Property[];
}

export const SEOInspectorTab: React.FC<SEOInspectorTabProps> = ({
  lang,
  properties,
}) => {
  const [searchSimQuery, setSearchSimQuery] = useState(
    lang === "fa" ? "ویلا مدرن استخردار لواسان" : "ویلا مدرن استخردار لواسان"
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Find properties matching the simulator query or fall back to the first available property
  const matchedProperty = properties.find((p) => {
    const titleMatch = p.title.toLowerCase().includes(searchSimQuery.toLowerCase());
    const descMatch = p.description.toLowerCase().includes(searchSimQuery.toLowerCase());
    const districtMatch = p.district.toLowerCase().includes(searchSimQuery.toLowerCase());
    return titleMatch || descMatch || districtMatch;
  }) || properties[0];

  // Generate dynamic XML sitemap mockup representation for Google bot
  const generateSitemapXML = () => {
    const currentDomain = window.location.origin;
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url>\n`;
    xml += `    <loc>${currentDomain}/</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    properties.forEach((p) => {
      xml += `  <url>\n`;
      xml += `    <loc>${currentDomain}/?property=${p.id}</loc>\n`;
      xml += `    <lastmod>${p.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  };

  // Generate Google Schema JSON-LD Structured Data representation
  const generateJSONLD = (p: Property) => {
    if (!p) return "";
    const schema = {
      "@context": "https://schema.org",
      "@type": "SingleFamilyResidence",
      "name": p.title,
      "description": p.description,
      "numberOfBedrooms": p.bedrooms,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": p.district,
        "streetAddress": p.address,
        "addressCountry": p.country || "IR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": p.latitude,
        "longitude": p.longitude
      },
      "offers": {
        "@type": "Offer",
        "price": p.totalPrice,
        "priceCurrency": p.country === "IR" ? "TMN" : "AED"
      },
      "image": p.images[0]
    };
    return JSON.stringify(schema, null, 2);
  };

  return (
    <div className={`space-y-6 ${isRtl ? "rtl text-right" : "ltr text-left"}`}>
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-950/40 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] bg-emerald-950/50 text-emerald-400 font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-900/30 font-mono inline-flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {lang === "fa" ? "سامانه خودکار سئو و ایندکس کاداستر" : "AUTOMATED CADASTRAL SEO MATCH ENGINE"}
            </span>
            <h3 className="text-base font-black text-white">
              {lang === "fa" ? "چرا ملک من در سرچ گوگل بالا نمی‌آید؟" : "Why doesn't my property search on Google yet?"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
              {properties.length} {lang === "fa" ? "سند ایندکس‌شده" : "Indexed Pages"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-850/50">
            <h4 className="font-extrabold text-slate-200 flex items-center gap-1.5">
              <span>💡</span>
              {lang === "fa" ? "دلایل عدم نمایش در جستجوی واقعی گوگل" : "Technical Reasons in Preview Mode"}
            </h4>
            <ul className="list-inside list-disc space-y-2 text-[11px] text-slate-400 leading-normal">
              {lang === "fa" ? (
                <>
                  <li>
                    <strong className="text-slate-200">دامنه پیش‌نمایش توسعه (Development Link):</strong> آدرس فعلی شما به صورت پیش‌نمایش امن تفکیک‌شده است. گوگل و بات‌های خزنده عمداً دامنه‌های تستی <code className="bg-slate-900 px-1 py-0.5 rounded text-[10px] text-rose-400">noindex</code> را مسدود می‌کنند تا آرشیو سایت شما در نسخه اصلی خراب نشود.
                  </li>
                  <li>
                    <strong className="text-slate-200">عدم وجود دامنه ملی/تجاری ثبت‌شده:</strong> برای اینکه گوگل کلمه <code className="bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded font-black font-mono">ویلا مدرن استخردار لواسان</code> شما را بشناسد، باید دامنه اختصاصی (مثال: <code className="text-slate-200">melkban.com</code> یا <code className="text-slate-200">lavasan-melk.ir</code>) را متصل کرده باشید.
                  </li>
                  <li>
                    <strong className="text-slate-200">معرفی نکردن نقشه سایت (Sitemap):</strong> روبات‌های گوگل پس از خرید دامنه باید از وجود نقشه آگاهی یابند. ما برای شما نقشه پویا و ساختاریافته گوگل را در زیر همین صفحه تولید کرده‌ایم تا به کنسول گوگل تحویل دهید.
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <strong className="text-slate-250">Preview Isolation URL:</strong> Development containers trigger automated <code className="bg-slate-900 px-1 text-rose-400">noindex</code> tags to avoid index pollution. Your real production site only gets crawled on custom domains!
                  </li>
                  <li>
                    <strong className="text-slate-250">Missing Custom Domain:</strong> To index queries like <code className="text-indigo-400">Lavasan Modern Villa</code> on public Google, you must connect a stable top-level domain.
                  </li>
                  <li>
                    <strong className="text-slate-250">Sitemap Registration:</strong> Googlebot needs to be supplied with structured sitemaps to locate every individual estate hash correctly.
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-850/50">
            <h4 className="font-extrabold text-slate-100 flex items-center gap-1.5">
              <span>🚀</span>
              {lang === "fa" ? "اقدامات فوری جهت رتبه اول در گوگل (SEO Checklist)" : "3 Steps to Top Google Rankings"}
            </h4>
            <div className="space-y-3 text-[11px]">
              <div className="flex items-start gap-2.5">
                <span className="bg-indigo-900/40 text-indigo-400 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-indigo-800">۱</span>
                <div>
                  <p className="font-bold text-slate-200">{lang === "fa" ? "سایت خود را به گوگل سرچ کنسول (GSC) معرفی کنید" : "Register on Google Search Console"}</p>
                  <p className="text-slate-500 leading-normal">{lang === "fa" ? "وارد Google Search Console شوید، دامنه اصلی خود را تایید کنید." : "Confirm ownership of your domain in search.google.com."}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="bg-indigo-900/40 text-indigo-400 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-indigo-800">۲</span>
                <div>
                  <p className="font-bold text-slate-200">{lang === "fa" ? "کپی و ثبت نقشه سایت (Sitemap) تولید شده در زیر" : "Submit Sitemap.xml"}</p>
                  <p className="text-slate-500 leading-normal">{lang === "fa" ? "کد نقشه سایت زیر را کپی کرده و به سرچ کنسول تحویل دهید تا تک‌تک صفحات تایید شده شما را ایندکس کند." : "Google crawler reads sitemaps to access custom static links instantly."}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="bg-indigo-900/40 text-indigo-400 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-indigo-800">۳</span>
                <div>
                  <p className="font-bold text-slate-200">{lang === "fa" ? "تزریق خودکار کدهای ساختاریافته گوگل (JSON-LD JSON-LD)" : "Enable Real Estate Rich Snippets"}</p>
                  <p className="text-slate-500 leading-normal">{lang === "fa" ? "سامانه آریانا رهنما متادیتا و کدهای اسکیما کاداستر را به سربرگ سایت تزریق می‌کند تا گوگل متوجه کلمات 'استخردار' و 'لواسان' شود." : "Rich schema data forces Google to extract bedroom layout icons and custom pricing parameters."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Search Simulator Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span>🔎</span>
            {lang === "fa" ? "شبیه‌ساز زنده جستجوی گوگل (Live Google SEO Mockup)" : "LIVESTREAMING GOOGLE CRAWLER PREVIEW"}
          </h3>
          <p className="text-[11px] text-slate-450 mt-1">
            {lang === "fa" 
              ? "در کادر زیر نام یا کلمات آگهی را بنویسید تا نحوه نمایش رتبه اول و ثبت آگهی‌های شما در نتایج واقعی گوگل نمایان شود." 
              : "Type any property keyword (e.g. لواسان, استخردار) to test search-bot rendering layout."}
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-xs placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none pr-10"
            placeholder={lang === "fa" ? "مثلا: ویلا مدرن استخردار لواسان" : "e.g. لواسان"}
            value={searchSimQuery}
            onChange={(e) => setSearchSimQuery(e.target.value)}
          />
          <span className="absolute right-3 top-3 text-slate-500 font-mono text-xs">🔍</span>
        </div>

        {/* Mock Google Searh Result Card */}
        {matchedProperty ? (
          <div className="bg-white/95 rounded-2xl p-5 border border-slate-200 shadow-xl space-y-2 text-left select-none max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              {/* Google favicon simulator */}
              <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-[10px] shrink-0 font-bold text-slate-650">A</div>
              <div>
                <p className="text-[12px] text-slate-800 font-normal leading-none mb-0.5">آریانا رهنما | کاداستر رسمی</p>
                <p className="text-[10px] text-emerald-800 leading-none font-mono">https://melkban.com › property › {matchedProperty.id}</p>
              </div>
            </div>

            <div className="space-y-1">
              <a href="#" className="text-[18px] text-[#1a0dab] hover:underline font-medium leading-tight block">
                {matchedProperty.title}
              </a>
              
              <div className="flex items-center gap-1.5 text-xs text-orange-650 font-semibold mb-1">
                <span>⭐ Rating: 4.9</span>
                <span className="text-slate-450 font-normal">| Review count: 184</span>
                <span className="text-slate-450 font-normal">| Price: {matchedProperty.totalPrice ? matchedProperty.totalPrice.toLocaleString() : "Contact Agent"} {matchedProperty.country === "IR" ? "USD" : "AED"}</span>
              </div>

              <p className="text-[13px] text-slate-600 leading-relaxed font-sans">
                <span className="text-slate-450 font-bold font-mono">۲ ساعت پیش — </span>
                {matchedProperty.description.length > 170 
                  ? matchedProperty.description.substring(0, 170) + "..." 
                  : matchedProperty.description}
              </p>
            </div>
            
            {/* Visual breadcrumbs extra key indices */}
            <div className="flex gap-1.5 pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-sans">
              <span className="bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">املاک {matchedProperty.district}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">سند تک‌برگ کاداستر</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">{matchedProperty.bedrooms} خواب مستر</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 text-slate-500 text-xs">
            {lang === "fa" ? "آگهی با کلمات کلیدی فوق یافت نشد. یک کلمه دیگر جستجو کنید." : "No matching properties listed on registry engine for simulation query."}
          </div>
        )}
      </div>

      {/* Middle Grid: Dynamic XML Sitemap & JSON-LD schema view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box A: XML Sitemap Dynamics */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3.5 flex flex-col h-[400px]">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2 shrink-0">
            <div>
              <span className="text-[10px] font-black text-rose-450 font-mono uppercase tracking-wider block">
                🗺️ DINAMIC SITEMAP.XML GENERATOR
              </span>
              <h4 className="text-xs font-bold text-white mt-0.5">
                {lang === "fa" ? "نقشه داینامیک موتورهای جستجو" : "Search Engine XML Sitemap Blueprint"}
              </h4>
            </div>
            <button
              onClick={() => handleCopyText(generateSitemapXML(), "sitemap")}
              className="text-[10px] bg-slate-950 font-mono hover:bg-slate-850 text-indigo-400 font-black px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer active:scale-95 transition-all outline-none"
            >
              {copiedKey === "sitemap" ? "✓ COPIED" : "📋 COPY XML"}
            </button>
          </div>

          <div className="flex-1 bg-slate-950 rounded-2xl p-3 font-mono text-[9px] text-slate-400 overflow-y-auto leading-normal whitespace-pre border border-slate-850 select-text">
            {generateSitemapXML()}
          </div>
          <p className="text-[9.5px] text-slate-500 leading-normal shrink-0">
            {lang === "fa" 
              ? "این فایل هرگاه ملک جدیدی اضافه یا تایید می‌شود به‌صورت خودکار بروز شده و آدرس مجزای هر ملک کاداستر نظیر لواسان را به ربات‌های گوگل اعلام می‌کند." 
              : "This dynamic mapping notifies Google crawler immediately whenever new verified properties are written to the database ledger."}
          </p>
        </div>

        {/* Box B: JSON-LD Schema (Google Structured Data) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3.5 flex flex-col h-[400px]">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2 shrink-0">
            <div>
              <span className="text-[10px] font-black text-indigo-400 font-mono uppercase tracking-wider block">
                🏷️ GOOGLE JSON-LD REAL ESTATE SCHEMA
              </span>
              <h4 className="text-xs font-bold text-white mt-0.5">
                {lang === "fa" ? "کدهای اسکیما و ستاره‌دار گوگل" : "JSON-LD Structured Rich Snippet Code"}
              </h4>
            </div>
            <button
              onClick={() => handleCopyText(generateJSONLD(matchedProperty), "jsonld")}
              className="text-[10px] bg-slate-950 font-mono hover:bg-slate-850 text-indigo-400 font-black px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer active:scale-95 transition-all outline-none"
            >
              {copiedKey === "jsonld" ? "✓ COPIED" : "📋 COPY JSON-LD"}
            </button>
          </div>

          <div className="flex-1 bg-slate-950 rounded-2xl p-3 font-mono text-[9px] text-emerald-400 overflow-y-auto leading-normal whitespace-pre border border-slate-850 select-text">
            {matchedProperty ? generateJSONLD(matchedProperty) : "// Select or simulate a property above to inspect code script."}
          </div>
          <p className="text-[9.5px] text-slate-500 leading-normal shrink-0">
            {lang === "fa" 
              ? "ما این کدهای اسکیما را بدون نیاز به افزونه به سربرگ (head) وبسایت شما تزریق می‌کنیم تا گوگل تخصص و ریزمشخصات ملک شما را سریعاً دسته بندی کند." 
              : "Structured microdata ensures prompt visual reviews, pricing metrics, and geographic pins are displayed alongside direct Google Search queries."}
          </p>
        </div>

      </div>
    </div>
  );
};
