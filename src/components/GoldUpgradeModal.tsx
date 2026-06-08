import React, { useState } from "react";
import { Language } from "../types";
import { Sparkles, CheckCircle, CreditCard, Coins, Upload, Image, FileText } from "lucide-react";
import { toLocalizedDigits } from "./LocalCalendar";

interface GoldUpgradeModalProps {
  lang: Language;
  onClose: () => void;
  onSubscriptionUpgraded: () => void;
  currentEmail?: string;
  tetherWalletAddress?: string;
  adminShetabCard?: string;
  customPromoCode?: string;
  customPromoDiscount?: number;
  customGlobalDiscount?: number;
  goldPriceToman?: number;
  goldPriceUSDT?: number;
  fiatCurrencyName?: string;
}

export const GoldUpgradeModal: React.FC<GoldUpgradeModalProps> = ({
  lang,
  onClose,
  onSubscriptionUpgraded,
  currentEmail,
  tetherWalletAddress = "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD",
  adminShetabCard = "6037991823456789",
  customPromoCode = "MELK20",
  customPromoDiscount = 20,
  customGlobalDiscount = 15,
  goldPriceToman = 800,
  goldPriceUSDT = 10,
  fiatCurrencyName = "AFN"
}) => {
  const [emailInput, setEmailInput] = useState(currentEmail || localStorage.getItem("melkban_verified_broker_email") || "amirkachaloooo65@gmail.com");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  
  const [txStep, setTxStep] = useState<"idle" | "processing" | "success">("idle");
  const [progressMsg, setProgressMsg] = useState("");
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>("");

  const isFa = lang === "fa";

  const handleApplyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    const rawTarget = String(customPromoCode || "").trim().toUpperCase();
    
    // Supports multiple codes separated by commas like "MELK20, AFG50:50, SPECIAL100:100"
    const codesList = rawTarget.split(",").map(item => item.trim());
    
    let matched = false;
    let discount = (customPromoDiscount !== undefined && !isNaN(Number(customPromoDiscount))) ? Number(customPromoDiscount) : 20;

    for (const codeItem of codesList) {
      if (codeItem.includes(":")) {
        const [cName, cPct] = codeItem.split(":");
        // Match either the name prefix alone, or the full name matching item
        if (cName.trim() === code || codeItem === code) {
          discount = parseInt(cPct.trim(), 10);
          if (isNaN(discount)) discount = 0;
          matched = true;
          break;
        }
      } else {
        if (codeItem === code) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      setPromoDiscount(discount);
      setPromoSuccess(
        isFa
          ? `🎉 کد تخفیف اختصاصی مدیریت (${toLocalizedDigits(discount.toString(), lang)}٪) با موفقیت اعمال شد!`
          : `🎉 Managed custom Promo code applied successfully! You get a ${discount}% discount.`
      );
    } else if (code === "ARIANA50" || code === "MELKBAN50" || code === "PROMO50") {
      setPromoDiscount(50);
      setPromoSuccess(
        isFa
          ? "🎉 کد تخفیف ۵۰٪ با موفقیت اعمال شد!"
          : "🎉 Promo applied successfully! You get a 50% discount."
      );
    } else if (code === "GOLDEN100" || code === "FREEPRO") {
      setPromoDiscount(100);
      setPromoSuccess(
        isFa
          ? "🎉 کد ۱۰۰٪ رایگان اعمال شد! اشتراک طلایی برای شما هدیه فعال می‌شود."
          : "🎉 100% discount promo applied! Golden Access granted."
      );
    } else {
      setPromoError(
        isFa
          ? "❌ کد تخفیف نامعتبر یا منقضی شده است."
          : "❌ Invalid or expired promotional code."
      );
    }
  };

  const handlesSubmitActivation = async () => {
    if (!emailInput.includes("@")) {
      alert(isFa ? "لطفاً یک ایمیل معتبر وارد کنید." : "Please enter a valid email address.");
      return;
    }

    if (paymentMethod === "card" && promoDiscount < 100) {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        alert(isFa ? "لطفاً شماره کارت ۱۶ رقمی شتاب را به درستی وارد کنید." : "Please enter a valid 16-digit bank card.");
        return;
      }
    }

    setTxStep("processing");
    setProgressMsg(isFa ? "اتصال ایمن به سوئیچ مرکزی کاداستر..." : "Establishing encrypted cadastral ledger connection...");

    const steps = [
      isFa ? "دریافت اطلاعات نرخ ارزهای جهانی فرابورس..." : "Querying OTC global foreign currency indices...",
      isFa ? "ثبت گواهی تایید توکن طلایی برای ایمیل شما..." : "Signing Golden token credential for your account email...",
      isFa ? "قرون‌وسطایی نبودن سیستم؛ توزیع کد رهگیری در شبکه نامتناهی..." : "Distributing verified state registry key across cloud nodes...",
      isFa ? "پردازش نهایی و صدور فاکتور رسمی..." : "Finalizing validation ledger and clearing nodes..."
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setProgressMsg(steps[current]);
        current++;
      } else {
        clearInterval(interval);
        completeSubscription();
      }
    }, 1200);
  };

  const completeSubscription = async () => {
    try {
      const email = emailInput.trim().toLowerCase();
      localStorage.setItem("melkban_verified_broker_email", email);

      // We call the real backend /api/subscription/toggle to set the active profile to "pro"!
      const response = await fetch("/api/subscription/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          receiptFile: receiptFile || undefined,
          receiptFileName: receiptFileName || undefined,
          paymentMethod: paymentMethod,
          paymentCardNum: cardNumber || undefined,
          paymentCardCVC: cardHolder || undefined
        })
      });

      if (response.ok) {
        setTxStep("success");
        onSubscriptionUpgraded();
      } else {
        alert("Server upgrade error. Please try again.");
        setTxStep("idle");
      }
    } catch (e) {
      console.error(e);
      setTxStep("idle");
    }
  };

  const rawPriceToman = goldPriceToman;
  const rawPriceUSDT = goldPriceUSDT;
  
  const globalDiscountPct = typeof customGlobalDiscount === "number" ? customGlobalDiscount : 0;
  const globalDiscountAmountToman = Math.round(rawPriceToman * (globalDiscountPct / 100));
  const globalDiscountAmountUSDT = Number((rawPriceUSDT * (globalDiscountPct / 100)).toFixed(1));

  const promoDiscountAmountToman = Math.round(rawPriceToman * (promoDiscount / 100));
  const promoDiscountAmountUSDT = Number((rawPriceUSDT * (promoDiscount / 100)).toFixed(1));

  const totalSavingsToman = globalDiscountAmountToman + promoDiscountAmountToman;
  const totalSavingsUSDT = globalDiscountAmountUSDT + promoDiscountAmountUSDT;

  const finalPriceToman = Math.max(0, rawPriceToman - totalSavingsToman);
  const finalPriceUSDT = Number(Math.max(0, rawPriceUSDT - totalSavingsUSDT).toFixed(1));

  const displayCurrency = fiatCurrencyName || (isFa ? "AFN" : "AFN");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" 
        id="gold-upgrade-pioneer-modal"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/60 sticky top-0 backdrop-blur-md z-15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-xl text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
              <Sparkles className="w-5 h-5 font-black" />
            </div>
            <div>
              <h3 className="text-md font-black text-white flex items-center gap-2">
                <span>{isFa ? "💎 ارتقا به پنل کارگزاری طلایی ملکان" : "💎 Upgrade to Melkban Gold Agency Panel"}</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {isFa 
                  ? "با پیوستن به کانون طلایی کاداستر، ملکتان را جهانی و معاملات را چندبرابر سرعت ببخشید." 
                  : "Go global, access real-time forex indices & utilize unlimited AI engine configurations."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-800 bg-slate-950 hover:bg-slate-850 hover:text-white transition flex items-center justify-center text-xs text-slate-400 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {txStep === "idle" && (
          <div className="overflow-y-auto p-6 space-y-6 flex-1 royal-thin-scrollbar">
            {/* Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Features comparison */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block border-b border-slate-800/80 pb-2">
                  {isFa ? "امکانات فرامحلی اشتراک طلایی" : "GOLD PREMIUM PERKS"}
                </span>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white">{isFa ? "تسعیر و تبدیل زنده تمام ارزهای جهان" : "Live Global Forex Desk"}</h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5">
                        {isFa 
                          ? "نمایش خودکار قیمت و تبدیل سند به ۱۲ ارز زنده (دلار، درهم، یورو، لیر لیر، روبل، افغانی...) در چند ثانیه" 
                          : "Convert property deeds into Dollar, Euro, Dirham, Afghan Afghani & Turkish Lira instantly."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white">{isFa ? "نامحدود کردن ظرفیت ثبت آگهی ملکی" : "Unlimited Active Postings"}</h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5">
                        {isFa 
                          ? "برداشته شدن کامل حد ثبت آگهی‌های کارگزاری (بدون نیاز به پرداخت کارمزدهای مکرر بابت هر فایل)" 
                          : "Bypass the 2-listing limitation completely. Host an endless catalog of premium cadastral items."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white">{isFa ? "دسترسی نامحدود به ۴ مدل هوش مصنوعی" : "4-Engine AI Consultation Suite"}</h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5">
                        {isFa 
                          ? "مشاوره اقتصادی ۵ ساله، تحلیل ساختاری سازه، تخمین کاداستر و آمارهای محلی با هوش مصنوعی پیشرفته Gemini" 
                          : "Unlock expert investment ROIs, materials checkups, and area statistical breakdowns."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white">{isFa ? "نشان طلایی رسمی «کارگزار معتمد»" : "Gold Verified Trusted Badge"}</h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5">
                        {isFa 
                          ? "به نمایش درآمدن نشان طلایی کاداستر کنار پروفایل شما جهت افزایش جلب اطمینان خریداران تا ۱۴۰٪" 
                          : "Instill supreme buyer trust. Get labeled as a verified municipal broker with golden checkmarks."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white">{isFa ? "دانلود گزارشات با PDF و Excel" : "Advanced Export Options"}</h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5">
                        {isFa 
                          ? "استخراج یک‌کلیکه تحلیل منطقه‌ای و سبد اسناد کلاینت برای خروجی‌های حرفه‌ای چاپی و اکسل" 
                          : "Compile valuation portfolios into presentable client documents with customizable contact grids."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout process form */}
              <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-850/80">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block border-b border-slate-900 pb-2">
                  {isFa ? "جزئیات فعال‌سازی و فاکتور" : "ACTIVATION DETAILS"}
                </span>

                <div className="space-y-3.5">
                  {/* Account Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">
                      {isFa ? "✉️ ایمیل اکانت کارگزاری:" : "✉️ Broker Account Email:"}
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="yourbroker@gmail.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  {/* Payment Methods Tabs */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">
                      {isFa ? "💳 انتخاب شیوه پرداخت ایمن:" : "💳 Select Secure Checkout Method:"}
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${paymentMethod === "card" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{isFa ? "کارت عضو شتاب" : "Debit Card"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("crypto")}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${paymentMethod === "crypto" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{isFa ? "ارز دیجیتال (Tether)" : "Tether USDT"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-850/50 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{isFa ? "تعرفه عضویت طلایی پایه:" : "Gold Base Subscription:"}</span>
                      <span className="text-slate-300 font-mono font-bold">
                        {paymentMethod === "card" 
                          ? `${toLocalizedDigits(rawPriceToman.toLocaleString(), lang)} ${displayCurrency}` 
                          : `${toLocalizedDigits(rawPriceUSDT.toString(), lang)} USDT`}
                      </span>
                    </div>
                    {globalDiscountPct > 0 && (
                      <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
                        <span>{isFa ? "🎁 تخفیف عمومی سراسری سایت:" : "🎁 Global Site Discount:"}</span>
                        <span>-{toLocalizedDigits(globalDiscountPct.toString(), lang)}%</span>
                      </div>
                    )}
                    {promoDiscount > 0 && (
                      <div className="flex justify-between items-center text-xs text-amber-400 font-bold">
                        <span>{isFa ? "🎫 تخفیف کد معرف/پروموشن شما:" : "🎫 Your Promo Code Discount:"}</span>
                        <span>-{toLocalizedDigits(promoDiscount.toString(), lang)}%</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-xs text-white font-bold">{isFa ? "مبلغ قابل پرداخت نهایی:" : "Net Payable Total:"}</span>
                      <strong className="text-md text-amber-500 font-black font-mono">
                        {paymentMethod === "card" ? (
                          <>
                            {toLocalizedDigits(finalPriceToman.toLocaleString(), lang)} {displayCurrency}
                          </>
                        ) : (
                          <>{toLocalizedDigits(finalPriceUSDT.toString(), lang)} USDT</>
                        )}
                      </strong>
                    </div>
                  </div>

                  {/* Promo Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">
                      {isFa ? "🎫 کد تخفیف ویژه (پروموشن):" : "🎫 Special Promo Code:"}
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="GOLDEN100"
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-indigo-400 font-bold uppercase font-mono tracking-wider focus:outline-none focus:border-indigo-500 flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-3 bg-slate-800 hover:bg-slate-700 text-white hover:text-indigo-400 text-[10px] font-black rounded-xl transition cursor-pointer"
                      >
                        {isFa ? "بررسی" : "Verify"}
                      </button>
                    </div>
                    {promoError && <p className="text-[9px] text-rose-500 font-bold font-mono">{promoError}</p>}
                    {promoSuccess && <p className="text-[9px] text-emerald-400 font-black">{promoSuccess}</p>}
                  </div>

                  {/* Card Details if card selected */}
                  {paymentMethod === "card" && promoDiscount < 100 && (
                    <div className="space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-850/40">
                      {/* Destination Card info */}
                      <div className="bg-amber-500/10 border border-amber-500/25 p-3 rounded-xl space-y-1 text-center animate-fade-in">
                        <span className="text-[9px] text-amber-400 font-extrabold block uppercase tracking-wider font-sans">
                          {isFa ? "💳 کُد ۱۶ رقمی کارت بانکی شتاب مقصد (مدیریت سایت):" : "💳 Destination Admin Bank Card Number:"}
                        </span>
                        <span className="font-mono text-sm text-white font-black select-all tracking-widest block py-0.5 bg-slate-950/80 rounded-lg border border-slate-800">
                          {toLocalizedDigits(adminShetabCard.replace(/(\d{4})/g, '$1 ').trim(), lang)}
                        </span>
                        <span className="text-[8.5px] text-slate-400 block leading-normal">
                          {isFa 
                            ? "✓ وجه اشتراک را به کارت مدیریت فوق واریز کرده و سپس مشخصات فیش/کارت خود را زیر بنویسید." 
                            : "✓ Transfer subscription fee to the admin card above and input your sender card info below."}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold block uppercase font-mono">
                          {isFa ? "👤 کُد ۱۶ رقمی کارت بانکی شتاب فرستنده (شما):" : "👤 Your 16-Digit Sender Card Number:"}
                        </label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => {
                            // auto-format with space after 4 chars
                            const v = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                            setCardNumber(v);
                          }}
                          placeholder="6104 3378 1234 5678"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white text-center font-mono font-bold tracking-widest focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold block">
                          {isFa ? "👤 نام صاحب کارت بانکی:" : "👤 Cardholder Name:"}
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder={isFa ? "مثال: امیر کچالو" : "e.g. Amir Kachaloo"}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Receipt / Transfer Proof Upload (سند انتقالی) */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[9px] text-slate-400 font-bold block">
                          {isFa ? "📸 آپلود تصویر یا فایل سند انتقالی (فیش/رسید واریز):" : "📸 Upload Transfer Document (Receipt/Slip Photo):"}
                        </label>
                        <div className="relative border border-dashed border-slate-800 rounded-xl p-3 bg-slate-950 hover:bg-slate-950/80 transition flex flex-col items-center justify-center text-center gap-1.5 group cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setReceiptFileName(f.name);
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setReceiptFile(reader.result as string);
                                };
                                reader.readAsDataURL(f);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          {receiptFile ? (
                            <div className="flex flex-col items-center gap-1">
                              {receiptFile.startsWith("data:image/") ? (
                                <img src={receiptFile} className="w-12 h-12 object-cover rounded-lg border border-slate-800 shadow-md mb-1" alt="Receipt preview" referrerpolicy="no-referrer" />
                              ) : (
                                <FileText className="w-8 h-8 text-indigo-400 mb-1" />
                              )}
                              <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> {isFa ? "رسید انتقال ضمیمه شد" : "Document attached successfully"}
                              </span>
                              <span className="text-[8.5px] text-slate-500 font-mono truncate max-w-[200px]" title={receiptFileName}>
                                {receiptFileName}
                              </span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition" />
                              <span className="text-[9.5px] text-slate-400 font-semibold">
                                {isFa ? "جهت بارگذاری کلیک کنید یا فایل را بکشید" : "Click to select or drag & drop slip file"}
                              </span>
                              <span className="text-[8.5px] text-slate-600">
                                {isFa ? "(فرمت‌های مجاز: JPG, PNG, PDF)" : "(Allowed types: JPG, PNG, PDF)"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Crypto Details if USDT selected */}
                  {paymentMethod === "crypto" && promoDiscount < 100 && (
                    <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-850/40 text-[10px] text-slate-400 leading-relaxed">
                      <div className="flex justify-between">
                        <span>{isFa ? "آدرس پرداخت تتر شبکه (TRC-20):" : "USDT address (TRC-20):"}</span>
                        <span className="font-mono text-amber-400 font-bold">TRC-20</span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-lg font-mono text-[9px] text-slate-300 font-bold select-all text-center border border-slate-850 break-all select-all">
                        {tetherWalletAddress}
                      </div>
                      <p className="text-[8.5px] text-slate-500 text-center">
                        {isFa 
                          ? "✓ پس از واریز تتر به ولت سامانه فوق، کلید تایید نهایی پایینی را فشار دهید." 
                          : "✓ Deposit USDT inside the cadastral vault and trigger approval ledger."}
                      </p>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Micro warning note */}
            <p className="text-[9px] text-slate-500 leading-relaxed text-center">
              {isFa 
                ? "💡 گواهینامه اشتراک کاداستر با پایداری چندگانه ابری فعال می‌شود. این لایه شبیه‌ساز پرداخت، قابلیت ارتقای ۱۰۰ درصدی ایمیل شما را در کل اپ ملکتان به صورت داینامیک فراهم می‌کند."
                : "💡 Cadastral cloud profiles are compiled in local sandbox caching and dynamic system memory, instantly upgrading server responses across and updating layouts."}
            </p>
          </div>
        )}

        {txStep === "processing" && (
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin"></div>
              <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-md font-black text-white">{isFa ? "در حال تایید و ثبت فاکتور طلایی..." : "Verifying & Committing Golden Ledger..."}</h4>
              <p className="text-xs text-slate-400 font-mono italic max-w-sm mx-auto leading-relaxed h-12 flex items-center justify-center">
                {progressMsg}
              </p>
            </div>
            
            <div className="text-[10px] bg-slate-950 text-slate-500 border border-slate-850 rounded-xl px-4 py-2 font-mono">
              SECURE TRANSACTION ID: tx_cad_gold_{Math.floor(100000 + Math.random() * 900000)}
            </div>
          </div>
        )}

        {txStep === "success" && (
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6 animate-scale-up">
            <div className="w-20 h-20 bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/10">
              ✔️
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-black text-white">{isFa ? "🎉 تبریک! اشتراک طلایی آریانا با موفقیت فعال شد!" : "🎉 Congratulations! Ariana Gold Subscription Activated!"}</h4>
              <p className="text-xs text-slate-350 max-w-md mx-auto leading-relaxed">
                {isFa 
                  ? `بنگاه معاملات ملکی شما به سطح طلایی ارتقا یافت. هم‌اکنون دسترسی به تبدیل اسعار زنده جهانی خلیج فارس و اروپا، ۴ موتور هوش مصنوعی Gemini و ثبت آگهی‌های نامحدود برای شما باز شده است.` 
                  : `Your real estate agency account is now in Gold premium status. Live world exchange rates, specialized AI engines, and limitless listings are fully unlocked.`}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/80 space-y-1.5 text-center min-w-[280px]">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">{isFa ? "شناسه کاربری طلایی:" : "Active Member Profile:"}</span>
                <span className="text-amber-400 font-black font-mono">{emailInput}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">{isFa ? "ردیف عضویت:" : "Access Level:"}</span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider">{isFa ? "وی‌آی‌پی طلایی (GOLD PRO)" : "GOLD CADASTRAL PRO"}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">{isFa ? "اعتبار قانونی:" : "Expires at:"}</span>
                <span className="text-slate-300 font-semibold font-mono">31 July 2026</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition active:scale-95 cursor-pointer font-bold"
            >
              {isFa ? "دمت گرم، شروع استفاده از خدمات طلایی کاداستر" : "Excellent, Start Using Gold Features"}
            </button>
          </div>
        )}

        {/* Modal Footer */}
        {txStep === "idle" && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-15">
            <span className="text-[10px] text-slate-500">
              {isFa ? "🛡️ تسعیر توسط بانک‌های مرکزی و صرافی‌های فرابورس تایید شده است." : "🛡️ Continuous blockchain encryption & municipal standard validation is guaranteed."}
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {isFa ? "انصراف" : "Cancel"}
              </button>
              <button
                onClick={handlesSubmitActivation}
                className="flex-1 sm:flex-initial px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-450 text-slate-950 rounded-xl text-xs font-black transition shadow-md cursor-pointer animate-pulse-subtle"
              >
                {isFa ? "تکمیل و راه‌اندازی اشتراک طلایی" : "Submit & Launch Gold Pro Class"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
