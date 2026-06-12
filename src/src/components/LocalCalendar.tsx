import React, { useState } from "react";
import { CalendarEvent, Language } from "../types";
import { TRANSLATIONS } from "../i18n";

// Helper function to translate digits
export function toLocalizedDigits(num: string | number, lang: Language): string {
  const str = String(num);
  const rtlLangs: Language[] = ["fa", "ar", "ku", "ps", "ur"];
  if (!rtlLangs.includes(lang)) return str;

  const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (d) => faDigits[parseInt(d)]);
}

interface LocalCalendarProps {
  lang: Language;
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
}

export const LocalCalendar: React.FC<LocalCalendarProps> = ({ lang, events, onAddEvent }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Event modal form state
  const [showForm, setShowForm] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("14:30");
  const [eventPhone, setEventPhone] = useState("");
  const [eventName, setEventName] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Get first day of month (0 = Sunday, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysArray: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(new Date(year, month, d));
  }

  const localeMap: Partial<Record<Language, string>> = {
    en: "en-US",
    fa: "fa-IR",
    tr: "tr-TR",
    ar: "ar-EG",
    de: "de-DE",
    ja: "ja-JP",
    zh: "zh-CN",
    uz: "uz-UZ",
    ru: "ru-RU",
    ku: "ku-IQ",
    ps: "ps-AF",
    hi: "hi-IN",
    ur: "ur-PK"
  };

  const formatMonthName = (date: Date) => {
    const localeTag = localeMap[lang] || "en-US";
    return date.toLocaleString(localeTag, {
      month: "long",
      year: "numeric",
    });
  };

  const getLocalizedWeekdays = () => {
    const list = [];
    const localeTag = localeMap[lang] || "en-US";
    for (let i = 0; i < 7; i++) {
      // May 10, 2026 is a Sunday
      const d = new Date(2026, 4, 10 + i);
      list.push(d.toLocaleString(localeTag, { weekday: "short" }));
    }
    return list;
  };

  const selectedDayEvents = events.filter((e) => e.date === selectedDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventName.trim()) return;

    const newEv: CalendarEvent = {
      id: "ev-" + Date.now(),
      title: eventTitle,
      date: selectedDate,
      type: "viewing",
      phone: eventPhone,
      clientName: eventName,
    };

    onAddEvent(newEv);
    setEventTitle("");
    setEventPhone("");
    setEventName("");
    setShowForm(false);
  };

  return (
    <div className={`p-6 bg-slate-900 border border-slate-800 rounded-2xl ${isRtl ? "rtl text-right" : "ltr text-left"}`} id="smart-calendar-module">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar Grid Box */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>🗓️</span> {t.calendarSyncTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{t.calendarSyncDesc}</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-850">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-850 rounded-md transition-all text-sm font-bold"
              >
                {isRtl ? "→" : "←"}
              </button>
              <span className="px-3 text-xs font-semibold text-indigo-400 font-mono">
                {formatMonthName(currentDate)}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-850 rounded-md transition-all text-sm font-bold"
              >
                {isRtl ? "←" : "→"}
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {getLocalizedWeekdays().map((day, ix) => (
              <div key={ix} className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider py-1 font-mono">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5" id="calendar-days-grid">
            {daysArray.map((dateObj, idx) => {
              if (!dateObj) {
                return <div key={`empty-${idx}`} className="aspect-square bg-slate-950/25 rounded-xl border border-transparent"></div>;
              }

              const dateString = dateObj.toISOString().split("T")[0];
              const isSelected = dateString === selectedDate;
              const hasEvents = events.some((e) => e.date === dateString);
              const isToday = new Date().toISOString().split("T")[0] === dateString;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(dateString)}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-between p-1.5 transition-all relative ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                      : isToday
                      ? "bg-slate-850 border-emerald-500/50 text-emerald-400 hover:bg-slate-800"
                      : "bg-slate-950/60 border-slate-850 text-slate-300 hover:bg-slate-850"
                  }`}
                >
                  <span className="text-xs font-mono font-bold self-start pl-1">
                    {toLocalizedDigits(dateObj.getDate(), lang)}
                  </span>

                  {hasEvents && (
                    <span className={`w-2 h-2 rounded-full absolute bottom-1.5 right-1.5 ${isSelected ? "bg-white animate-pulse" : "bg-indigo-500"}`}></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Box */}
        <div className="w-full md:w-80 bg-slate-950/80 p-5 rounded-2xl border border-slate-850/60 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>📌</span> {t.calendarSelectedDay}
            </h4>
            <div className="font-mono text-indigo-400 text-sm font-bold bg-indigo-950/20 px-3 py-1.5 rounded-lg border border-indigo-900/30 inline-block mb-4">
              {toLocalizedDigits(selectedDate, lang)}
            </div>

            {/* Event list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {selectedDayEvents.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-6 text-center">
                  {t.calendarNoEvents}
                </div>
              ) : (
                selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-emerald-400">{ev.title}</span>
                      <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded font-mono">
                        {ev.phone ? toLocalizedDigits(ev.phone, lang) : "N/A"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>👤 {ev.clientName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="w-full mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold tracking-wider transition-all shadow-md active:scale-95"
          >
            ➕ {t.calendarAddEvent}
          </button>
        </div>
      </div>

      {/* Form Dialog nested inline */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white mb-4">
              ✨ {t.calendarAddEvent} ({toLocalizedDigits(selectedDate, lang)})
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-slate-300">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.calendarEventTitle}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visit Luxury Villa"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t.calendarEventPhone}</label>
                  <input
                    type="text"
                    required
                    placeholder="+91..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono"
                    value={eventPhone}
                    onChange={(e) => setEventPhone(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.calendarEventName}</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  {t.btnCancel || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                >
                  {t.btnSubmit || "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
