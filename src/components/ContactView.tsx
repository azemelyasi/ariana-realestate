import React, { useState } from "react";
import { Language } from "../types";
import { TRANSLATIONS } from "../i18n";

interface ContactViewProps {
  lang: Language;
}

export const ContactView: React.FC<ContactViewProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !msg) return;

    // Simulate sending dispatch to the central cadastral core
    setSent(true);
    setName("");
    setEmail("");
    setMsg("");
    setTimeout(() => {
      setSent(false);
    }, 5000);
  };

  return (
    <div className={`p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 ${isRtl ? "rtl text-right" : "ltr text-left"}`} id="contact-info-view">
      <div className="max-w-xl mx-auto text-center space-y-2">
        <h2 className="text-2xl font-black text-white">
          {t.contactTitle || "Get in Touch with Ariana Rahnuma HQ"}
        </h2>
        <p className="text-xs text-slate-400">
          {t.contactSubtitle || "Our professional regional coordinators and cadastral survey officials are ready to counsel."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact info desk */}
        <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-850">
          <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
            ⚙️ {t.contactHQ || "Central Administration"}
          </h4>

          <div className="space-y-3.5 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[9px] tracking-widest">
                Email Address (ایمیل رسمی)
              </span>
              <span className="font-mono text-indigo-300">registry@arianarahnuma.com</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[9px] tracking-widest">
                Appraisal hotline (تلفن تماس کاداستر)
              </span>
              <span className="font-mono text-slate-200">+93 799 123 456</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[9px] tracking-widest">
                Head Office coordinates (نشانی دفتر مرکزی)
              </span>
              <span>Wazir Akbar Khan, District 10, Kabul, Afghanistan</span>
            </div>
          </div>
        </div>

        {/* Secure Form dispatch */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850">
          <h4 className="text-sm font-bold text-slate-250 mb-3 flex items-center gap-1.5">
            <span>📫</span> {t.contactFormTitle || "Send a Secure Appraisal Query"}
          </h4>

          {sent ? (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs leading-relaxed animate-fade-in">
              ✨ {t.contactSuccess || "We've recorded your secure cadet inquiry. Our coordinator will contact you promptly."}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-300">
              <div>
                <input
                  type="text"
                  required
                  placeholder={t.contactPlaceholderName || "Your Full Name"}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-650"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder={t.contactPlaceholderEmail || "Your Active Email (Optional)"}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-650 font-mono"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <textarea
                  required
                  rows={3}
                  placeholder={t.contactPlaceholderMsg || "Describe details..."}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-655"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition active:scale-95 text-xs shadow"
              >
                🚀 {t.btnSubmit || "Submit Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
