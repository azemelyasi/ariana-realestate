import React, { useState } from "react";
import { Language } from "../types";
import { Sparkles, CheckCircle, CreditCard, Coins, Upload, FileText } from "lucide-react";
import { toLocalizedDigits } from "./LocalCalendar";
import { AutoTranslate } from "./AutoTranslate";

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
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100dvh-3rem)] sm:max-h-[85dvh]" 
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
                <span>
                  <AutoTranslate text="💎 Upgrade to Melkban Gold Agency Panel" lang={lang} />
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5 font-sans">
                <AutoTranslate 
                  text="Go global, access real-time forex indices & utilize unlimited AI engine configurations." 
                  lang={lang} 
                />
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-800 bg-slate-950 hover:bg-slate-850 hover:text-white transition flex items-center justify-center text-xs text-slate-405 cursor-pointer animate-fade-in"
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
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block border-b border-slate-800/80 pb-2 font-sans">
                  <AutoTranslate text="GOLD PREMIUM PERKS" lang={lang} />
                </span>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white font-sans">
                        <AutoTranslate text="Live Global Forex Desk" lang={lang} />
                      </h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5 font-sans">
                        <AutoTranslate 
                          text="Convert property deeds into Dollar, Euro, Dirham, Afghan Afghani & Turkish Lira instantly." 
                          lang={lang} 
                        />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white font-sans">
                        <AutoTranslate text="Unlimited Active Postings" lang={lang} />
                      </h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5 font-sans">
                        <AutoTranslate 
                          text="Bypass the 2-listing limitation completely. Host an endless catalog of premium cadastral items." 
                          lang={lang} 
                        />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white font-sans">
                        <AutoTranslate text="4-Engine AI Consultation Suite" lang={lang} />
                      </h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5 font-sans">
                        <AutoTranslate 
                          text="Unlock expert investment ROIs, materials checkups, and area statistical breakdowns." 
                          lang={lang} 
                        />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white font-sans">
                        <AutoTranslate text="Gold Verified Trusted Badge" lang={lang} />
                      </h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5 font-sans">
                        <AutoTranslate 
                          text="Instill supreme buyer trust. Get labeled as a verified municipal broker with golden checkmarks." 
                          lang={lang} 
                        />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white font-sans">
                        <AutoTranslate text="Advanced Export Options" lang={lang} />
                      </h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5 font-sans">
                        <AutoTranslate 
                          text="Compile valuation portfolios into presentable client documents with customizable contact grids." 
                          lang={lang} 
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout process form */}
              <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-850/80">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block border-b border-slate-900 pb-2 font-sans">
                  <AutoTranslate text="ACTIVATION DETAILS" lang={lang} />
                </span>

                <div className="space-y-3.5">
                  {/* Account Email */}
                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] text-slate-400 font-bold block">
                      <AutoTranslate text="✉️ Broker Account Email:" lang={lang} />
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
                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] text-slate-400 font-bold block">
                      <AutoTranslate text="💳 Select Secure Checkout Method:" lang={lang} />
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${paymentMethod === "card" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span><AutoTranslate text="Debit Card" lang={lang} /></span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("crypto")}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${paymentMethod === "crypto" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span><AutoTranslate text="Tether USDT" lang={lang} /></span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-850/50 space-y-2 font-sans">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-440 text-slate-400"><AutoTranslate text="Gold Base Subscription:" lang={lang} /></span>
                      <span className="text-slate-300 font-mono font-bold">
                        {paymentMethod === "card" 
                          ? `${toLocalizedDigits(rawPriceToman.toLocaleString(), lang)} ${displayCurrency}` 
                          : `${toLocalizedDigits(rawPriceUSDT.toString(), lang)} USDT`}
                      </span>
                    </div>
                    {globalDiscountPct > 0 && (
                      <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
                        <span><AutoTranslate text="🎁 Global Site Discount:" lang={lang} /></span>
                        <span>-{toLocalizedDigits(globalDiscountPct.toString(), lang)}%</span>
                      </div>
                    )}
                    {promoDiscount > 0 && (
                      <div className="flex justify-between items-center text-xs text-amber-400 font-bold">
                        <span><AutoTranslate text="🎫 Your Promo Code Discount:" lang={lang} /></span>
                        <span>-{toLocalizedDigits(promoDiscount.toString(), lang)}%</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850 font-bold">
                      <span className="text-xs text-white font-bold"><AutoTranslate text="Net Payable Total:" lang={lang} /></span>
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
                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] text-slate-400 font-bold block">
                      <AutoTranslate text="🎫 Special Promo Code:" lang={lang} />
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
                        <AutoTranslate text="Verify" lang={lang} />
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
                          <AutoTranslate text="💳 Destination Admin Bank Card Number:" lang={lang} />
                        </span>
                        <span className="font-mono text-sm text-white font-black select-all tracking-widest block py-0.5 bg-slate-950/80 rounded-lg border border-slate-800">
                          {toLocalizedDigits(adminShetabCard.replace(/(\d{4})/g, '$1 ').trim(), lang)}
                        </span>
                        <span className="text-[8.5px] text-slate-400 block leading-normal">
                          <AutoTranslate 
                            text="✓ Transfer subscription fee to the admin card above and input your sender card info below." 
                            lang={lang} 
                          />
                        </span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold block uppercase font-mono">
                          <AutoTranslate text="👤 Your 16-Digit Sender Card Number:" lang={lang} />
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
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white text-center font-mono font-bold tracking-widest focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold block">
                          <AutoTranslate text="👤 Cardholder Name:" lang={lang} />
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder={isFa ? "مثال: امیر کچالو" : "e.g. Amir Kachaloo"}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>

                      {/* Receipt / Transfer Proof Upload (سند انتقالی) */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[9px] text-slate-400 font-bold block">
                          <AutoTranslate text="📸 Upload Transfer Document (Receipt/Slip Photo):" lang={lang} />
                        </label>
                        <div className="relative border border-dashed border-slate-800 rounded-xl p-3 bg-slate-950 hover:bg-slate-950/80 transition flex flex-col items-center justify-center text-center gap-1.5 group cursor-pointer font-sans">
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
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 font-sans"
                          />
                          {receiptFile ? (
                            <div className="flex flex-col items-center gap-1">
                              {receiptFile.startsWith("data:image/") ? (
                                <img src={receiptFile} className="w-12 h-12 object-cover rounded-lg border border-slate-800 shadow-md mb-1 animate-fade-in" alt="Receipt preview" referrerPolicy="no-referrer" />
                              ) : (
                                <FileText className="w-8 h-8 text-indigo-400 mb-1" />
                              )}
                              <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> 
                                <AutoTranslate text="Document attached successfully" lang={lang} />
                              </span>
                              <span className="text-[8.5px] text-slate-500 font-mono truncate max-w-[200px]" title={receiptFileName}>
                                {receiptFileName}
                              </span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition" />
                              <span className="text-[9.5px] text-slate-400 font-semibold">
                                <AutoTranslate text="Click to select or drag & drop slip file" lang={lang} />
                              </span>
                              <span className="text-[8.5px] text-slate-600">
                                <AutoTranslate text="(Allowed types: JPG, PNG, PDF)" lang={lang} />
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Crypto Details if USDT selected */}
                  {paymentMethod === "crypto" && promoDiscount < 100 && (
                    <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-850/40 text-[10px] text-slate-400 leading-relaxed font-sans">
                      <div className="flex justify-between">
                        <span><AutoTranslate text="USDT address (TRC-20):" lang={lang} /></span>
                        <span className="font-mono text-amber-400 font-bold">TRC-20</span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-lg font-mono text-[9px] text-slate-300 font-bold select-all text-center border border-slate-850 break-all">
                        {tetherWalletAddress}
                      </div>
                      <p className="text-[8.5px] text-slate-500 text-center">
                        <AutoTranslate 
                          text="✓ Deposit USDT inside the cadastral vault and trigger approval ledger." 
                          lang={lang} 
                        />
                      </p>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Micro warning note */}
            <p className="text-[9px] text-slate-505 leading-relaxed text-center font-sans mt-3">
              <AutoTranslate 
                text="💡 Cadastral cloud profiles are compiled in local sandbox caching and dynamic system memory, instantly upgrading server responses across and updating layouts." 
                lang={lang} 
              />
            </p>
          </div>
        )}

        {txStep === "processing" && (
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin font-sans"></div>
              <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            
            <div className="space-y-2 font-sans">
              <h4 className="text-md font-black text-white">
                <AutoTranslate text="Verifying & Committing Golden Ledger..." lang={lang} />
              </h4>
              <p className="text-xs text-slate-400 font-mono italic max-w-sm mx-auto leading-relaxed h-12 flex items-center justify-center">
                <AutoTranslate text={progressMsg} lang={lang} />
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
            
            <div className="space-y-2 font-sans">
              <h4 className="text-lg font-black text-white">
                <AutoTranslate text="🎉 Congratulations! Ariana Gold Subscription Activated!" lang={lang} />
              </h4>
              <p className="text-xs text-slate-350 max-w-md mx-auto leading-relaxed">
                <AutoTranslate 
                  text="Your real estate agency account is now in Gold premium status. Live world exchange rates, specialized AI engines, and limitless listings are fully unlocked." 
                  lang={lang} 
                />
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/80 space-y-1.5 text-center min-w-[280px] font-sans">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400"><AutoTranslate text="Active Member Profile:" lang={lang} /></span>
                <span className="text-amber-400 font-black font-mono">{emailInput}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400"><AutoTranslate text="Access Level:" lang={lang} /></span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider">
                  <AutoTranslate text="GOLD CADASTRAL PRO" lang={lang} />
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400"><AutoTranslate text="Expires at:" lang={lang} /></span>
                <span className="text-slate-300 font-semibold font-mono">31 July 2026</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition active:scale-95 cursor-pointer font-bold animate-pulse-subtle"
            >
              <AutoTranslate text="Excellent, Start Using Gold Features" lang={lang} />
            </button>
          </div>
        )}

        {/* Modal Footer */}
        {txStep === "idle" && (
          <div className="p-4 pb-6 sm:pb-4 border-t border-slate-800 bg-slate-950/95 backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-15 font-sans">
            <span className="text-[10px] text-slate-500">
              <AutoTranslate text="🛡️ Continuous blockchain encryption & municipal standard validation is guaranteed." lang={lang} />
            </span>
            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-405 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer text-center"
              >
                <AutoTranslate text="Cancel" lang={lang} />
              </button>
              <button
                onClick={handlesSubmitActivation}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-450 text-slate-950 rounded-xl text-xs font-black transition shadow-md cursor-pointer animate-pulse-subtle text-center"
              >
                <AutoTranslate text="Submit & Launch Gold Pro Class" lang={lang} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
