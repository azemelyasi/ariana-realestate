import React, { useState } from "react";
import { Property, Language } from "../types";
import { COUNTRIES } from "../data";
import { toLocalizedDigits } from "./LocalCalendar";
import { getTranslation } from "../i18n";
import { Copy, ShieldCheck, Printer, Check, Phone, User, Landmark } from "lucide-react";

interface ClientExportModalProps {
  lang: Language;
  onClose: () => void;
  selectedProperties: Property[];
  onRemoveFromBasket: (id: string) => void;
}

// Default values localized for each of the 13 supported languages
const DEFAULT_CLIENT_NAMES: Record<Language, string> = {
  en: "Mr. John Smith",
  fa: "جناب آقای احمدی",
  tr: "Sayın Ahmet Yılmaz",
  ar: "السيد أحمد المحترم",
  de: "Herr Thomas Müller",
  ja: "山田 太郎 様",
  zh: "张华 先生",
  uz: "Hurmatli Shavkat Karimov",
  ru: "Уважаемый Александр Петров",
  ku: "جەنابی کاک ئۆمێد",
  ps: "ښاغلی خان محمد",
  hi: "श्री विकास शर्मा",
  ur: "جناب علی احمد صاحب",
};

const DEFAULT_BROKER_NAMES: Record<Language, string> = {
  en: "Ariana Rahnuma Official Partner",
  fa: "کارگزار رسمی آریانا رهنما",
  tr: "Ariana Rahnuma Resmi Brokeri",
  ar: "الشريك الرسمي لآريانا رهنما",
  de: "Autorisierter Ariana Rahnuma-Broker",
  ja: "Ariana Rahnuma 公認パートナー",
  zh: "Ariana Rahnuma 智地官方置业顾问",
  uz: "Ariana Rahnuma Rasmiy Brokeri",
  ru: "Лицензированный брокер Ariana Rahnuma",
  ku: "برۆکەری فەرمی ئاریانا ڕەهنما",
  ps: "د آریانا رهنما رسمي همکار",
  hi: "एरियाنا रहनुमा आधिकारिक पार्टनर",
  ur: "آریانا رهنما آفیشل پارٹنر",
};

const DEFAULT_GREETINGS: Record<Language, string> = {
  en: "Pursuant to our discussion regarding premier real estate investments, please find the matching curated listings prepared for your consideration.",
  fa: "پیرو گفتگوی تلفنی در خصوص خرید واحدهای مسکونی و سنددار، لیست گزینه‌های منتخب منطبق با شرایط درخواستی شما برای بررسی تقدیم حضور می‌گردد.",
  tr: "Görüşmemize istinaden talep ettiğiniz kriterlere uygun olarak hazırladığımız özel portföy listesini incelemenize sunarız.",
  ar: "بناءً على طلبكم لتقييم الوحدات السكنية المتميزة، نرفق لكم هنا الملف التعريفي بالعقارات المختارة بعناية.",
  de: "Bezugnehmend auf unser freundliches Gespräch über erstklassige Immobilieninvestitionen überreichen wir Ihnen hier die passende Auswahl.",
  ja: "ご検討いただいているプレミアム不動産に関して、条件に合致する厳選物件をまとめたカタログをお届けします。",
  zh: "依据我们此前关于高端房产及地籍资产投资的探讨，现呈报精选符合条件的房源，供您专属品鉴。",
  uz: "Suhbatimizga asosan, siz qiziqqan yuqori toifali yangi xonadonlar reyestrini ko'rib chiqishingiz uchun taqdim etamiz.",
  ru: "Согласно нашему разговору об инвестициях в недвижимость премиум-класса, направляю вам подборку подобранных объектов.",
  ku: "پاش گفتوگۆی گەرممان سەبارەت بە کڕینی خانووبەرەی کاداستر، لیستی بژاردەکانتان پێشکەش دەکەین.",
  ps: "د املاکو پېرودلو په هکله زموږ د تلیفوني خبرو اترو وروسته، د ټاکل شوو کورونو لیست وړاندې کوو.",
  hi: "प्रमुख रियल एस्टेट निवेश के संबंध में हमारी चर्चा के अनुसार, कृपया आपके विचारार्थ तैयार की गई चुниंदा सूची प्राप्त करें।",
  ur: "پریمیم رئیل اسٹیٹ میں سرمایہ کاری کے حوالے سے ہماری گفتگو کی روشنی میں، آپ کی پسندیدہ جائیدادوں کی تفصیلات پیش خدمت ہیں۔",
};

// Comprehensive multilingual dictionary for the export flyer and control inputs
const LOCALIZED_DICT: Record<string, Record<Language, string>> = {
  title: {
    en: "SMART CLIENT BROCHURE STUDIO",
    fa: "سامانه استخراج کاتالوگ و بروشور مشتری کاداستر",
    tr: "AKILLI MÜŞTERİ BROŞÜRÜ STÜDYOSU",
    ar: "استوديو بروشور العميل الذكي",
    de: "SMARTE KUNDENBROSCHÜREN-STUDIO",
    ja: "スマート・クライアント・パンフレット・スタジオ",
    zh: "智能客户宣传册画布",
    uz: "AQLLI MIJOZLAR BROSHYURASI STUDIYASI",
    ru: "СТУДИЯ УМНЫХ БРОШЮР КЛИЕНТОВ",
    ku: "ستۆدیۆی نامیلکەی كڕیاری زیرەک",
    ps: "د پیرودونکي هوښیار بروشور سټوډیو",
    hi: "स्मार्ट क्लाइंट ब्रोशर स्टूडियो",
    ur: "سمارٹ کلائنٹ بروشر اسٹوڈیو",
  },
  customizeFlyer: {
    en: "Customize Output Flyer",
    fa: "سفارشی‌سازی بروشور مشتری",
    tr: "Broşür Çıktısını Özelleştir",
    ar: "تخصيص بروشور العميل",
    de: "Broschüren-Ausgabe anpassen",
    ja: "パンフレット出力をカスタマイズ",
    zh: "自定义宣传册输出",
    uz: "Broshyura Chiqishini Sozlash",
    ru: "Настройка вывода брошюры",
    ku: "تایبەتمەندکردنی نامیلکەی دەرچوو",
    ps: "د بروشور محصول دودیز کول",
    hi: "ب्रोशर आउटपुट अनुकूलित करें",
    ur: "بروشر آؤٹ پٹ کو حسب ضرورت بنائیں",
  },
  customizeDesc: {
    en: "Personalize the generated portfolio details, contact card information, and field visibility levels.",
    fa: "اطلاعات خریدار و نحوه نمایش داده‌ها را برای چاپ نهایی تنظیم کنید.",
    tr: "Oluşturulan portföy ayrıntılarını, iletişim kartı bilgilerini ve alan görünürlük düzeylerini kişiselleştirin.",
    ar: "أضف طابعك الشخصي على تفاصيل المحفظة المنشأة، ومعلومات بطاقة الاتصال، ومستويات رؤية الحقول.",
    de: "Personalisieren Sie die generierten Portfolio-Details, Kontaktkarten-Informationen und Sichtbarkeitsstufen.",
    ja: "生成されたポートフォリオの詳細、連絡先カード情報、およびフィールドの表示レベルをパーソナライズします。",
    zh: "个性化定制生成的文件夹细节、联系信息及字段显示级别。",
    uz: "Yaratilgan portfel tafsilotlarini, aloqa kartasi ma'lumotlarini va maydonlarning ko'rinish darajasini shaxsiylashtiring.",
    ru: "Персонализируйте детали портфолио, контактную информацию и уровни видимости полей.",
    ku: "زانیارییەکانی کڕیار و پێشاندانی داتاکان ڕێکبخە بۆ چاپکردنی کۆتایی.",
    ps: "د تولید شوي پورټ فولیو توضیحات ، د اړیکې کارت معلومات ، او د ساحې د لید کچې تنظیم کړئ.",
    hi: "उत्पन्न पोर्टफोलियो विवरण, संपर्क कार्ड जानकारी और क्षेत्र दृश्यता स्तरों को वैयक्तिकृत करें।",
    ur: "تیار کردہ پورٹ فولیو کی تفصیلات، رابطہ کارڈ کی معلومات، اور فیلڈ کی نمائش کی سطحوں کو ذاتی بنائیں۔",
  },
  clientNameLabel: {
    en: "Target Client Name:",
    fa: "نام مشتری محترم (مخاطب):",
    tr: "Hedef Müşteri Adı:",
    ar: "اسم العميل المستهدف:",
    de: "Name des Zielkunden:",
    ja: "対象顧客名:",
    zh: "目标客户姓名:",
    uz: "Mijozning To'liq Ismi:",
    ru: "Имя клиента:",
    ku: "ناوی کڕیاری بەڕێز (مخاتەب):",
    ps: "د پیرودونکي نوم:",
    hi: "लक्ष्य ग्राहक का नाम:",
    ur: "سائل کا نام (مخاطب):",
  },
  brokerNameLabel: {
    en: "Consultant / Agency Brand:",
    fa: "نام مشاور یا آژانس املاک:",
    tr: "Danışman / Acente Markası:",
    ar: "اسم المستشار / الوكالة:",
    de: "Berater / Agentur-Marke:",
    ja: "担当者 / 不動産会社ブランド:",
    zh: "顾问 / 代理机构品牌:",
    uz: "Maslahatchi / Agentlik Brandi:",
    ru: "Консультант / Бренд агентства:",
    ku: "ناوی ڕاوێژکار یان ئاژانسی خانووبەرە:",
    ps: "د مشاور یا د املاکو د دفتر نوم:",
    hi: "सलाहकार / एजेंसी ब्रांड:",
    ur: "مشیر یا رئیل اسٹیٹ ایجنسی کا نام:",
  },
  brokerPhoneLabel: {
    en: "Contact Telephone:",
    fa: "شماره تلفن تماس مشاور:",
    tr: "İrtibat Telefonu:",
    ar: "هاتف الاتصال:",
    de: "Kontakttelefon:",
    ja: "連絡先電話番号:",
    zh: "联系电话:",
    uz: "Bog'lanish telefoni:",
    ru: "Контактный телефон:",
    ku: "ژمارەی تەلەفونی ڕاوێژکار:",
    ps: "د تماس شمیره:",
    hi: "संपर्क टेलीफोन:",
    ur: "رابطہ نمبر:",
  },
  coverMessageLabel: {
    en: "Custom Cover Message:",
    fa: "متن مقدمه یا پیام سفارشی:",
    tr: "Özel Kapak Mesajı:",
    ar: "رسالة غلاف مخصصة:",
    de: "Eigene Einleitungsnachricht:",
    ja: "カスタム・カバーメッセージ:",
    zh: "自定义封面寄语:",
    uz: "Sarlavha Osti Xabari:",
    ru: "Сопроводительное письмо:",
    ku: "دەقی پێشەکی یان پەیامی تایبەت:",
    ps: "د پوښتنې دودیز پیغام:",
    hi: "कस्टम कवर संदेश:",
    ur: "تعارفی پیغام یا حسب ضرورت پیغام:",
  },
  documentThemeLabel: {
    en: "Print Document Theme:",
    fa: "سبک طراحی سربرگ بروشور:",
    tr: "Yazdırma Belgesi Teması:",
    ar: "نمط غلاف المستند المطبعي:",
    de: "Drucklayout-Stil:",
    ja: "印刷ドキュメント・テーマ:",
    zh: "打印主题风格:",
    uz: "Hujjat Dizayni Uslubi:",
    ru: "Стиль оформления:",
    ku: "شێوازی دیزاینی سەرپەڕی نامیلکە:",
    ps: "د چاپ سند بڼه:",
    hi: "प्रिंट दस्तावेज थीम:",
    ur: "لی آؤٹ ڈیزائن کا اسٹائل:",
  },
  themeLuxury: {
    en: "Luxury Gold",
    fa: "سلطنتی",
    tr: "Lüks Altın",
    ar: "ذهبي فاخر",
    de: "Luxuriöses Gold",
    ja: "ラグジュアリー",
    zh: "豪华臻金",
    uz: "Hashamatli",
    ru: "Премиум",
    ku: "سەڵتەنەتی",
    ps: "لوکس شاهي",
    hi: "लक्ज़री गोल्ड",
    ur: "شاہانہ گولڈن",
  },
  themeMinimal: {
    en: "Clean Minimal",
    fa: "مینیمال",
    tr: "Yalın Minimal",
    ar: "بسيط مادي",
    de: "Klassisch Minimal",
    ja: "ミニマル",
    zh: "极简素雅",
    uz: "Oddiy",
    ru: "Минимал",
    ku: "مینیمال",
    ps: "ساده",
    hi: "स्वच्छ न्यूनतम",
    ur: "سادہ اور نفیس",
  },
  themeArchitect: {
    en: "Tech Grid",
    fa: "کاداستر",
    tr: "Teknik Kadastro",
    ar: "شبكي كاداستر",
    de: "Technisches Raster",
    ja: "グリッド",
    zh: "数智地籍",
    uz: "Texnik",
    ru: "Техно-сетка",
    ku: "کاداستر",
    ps: "انجینري",
    hi: "टेक ग्रिड",
    ur: "انجینیئرنگ گرڈ",
  },
  controlVisibility: {
    en: "Control Visibility Fields:",
    fa: "گزینه‌های فیلتر اطلاعات نمایشی:",
    tr: "Görünürlük Alanlarını Yönet:",
    ar: "خيارات رؤية الحقول المعروضة:",
    de: "Sichtbare Felder steuern:",
    ja: "表示フィールドの制御:",
    zh: "显示字段控制:",
    uz: "Ko'rinish maydonlarini boshqarish:",
    ru: "Управление видимостью полей:",
    ku: "هەڵبژاردەکانی فلتەرکردنی زانیاری پیشاندراو:",
    ps: "د ساحې د لید کچه کنټرول کړئ:",
    hi: "दृश्यता फ़ील्ड नियंत्रित करें:",
    ur: "نمایاں فیلڈز کی ترتیبات:",
  },
  includeImages: {
    en: "Include property images",
    fa: "نمایش تصویر اصلی ملک",
    tr: "Mülk resimlerini ekle",
    ar: "إدراج صور العقار",
    de: "Objektbilder anzeigen",
    ja: "物件の画像を含める",
    zh: "展示房源主要图片",
    uz: "Mulk rasmlarini kiritish",
    ru: "Включить изображения недвижимости",
    ku: "پیشاندانی وێنەی ڕەسەنی خانووبەرە",
    ps: "د ملکیت عکسونه شامل کړئ",
    hi: "संपत्ति की छवियां शामिल करें",
    ur: "مکان کی اصل تصویر شامل کریں",
  },
  includeCurrencies: {
    en: "Show multi-currency equivalents",
    fa: "نمایش تسعیر اسعار همزمان (دلار)",
    tr: "Çoklu para birimi karşılıklarını göster",
    ar: "عرض مقابل العملات المتعددة (دولار)",
    de: "Mehrwährungs-Äquivalente anzeigen",
    ja: "ドル換算価格を表示する",
    zh: "汇率自动换算展示 (美元)",
    uz: "Xorijiy valyuta ekvivalentini ko'rsatish (USD)",
    ru: "Показывать долларовый эквивалент",
    ku: "پیشاندانی نرخ بە دراوەکانی تر (دۆلار)",
    ps: "د ډیری اسعارو معادل ارزښتونه ښکاره کړئ",
    hi: "बहु-मुद्रा समकक्ष दिखाएं",
    ur: "کرنسی تبادلے کی شرح دکھائیں",
  },
  includeDesc: {
    en: "Show description texts",
    fa: "شرح جزئیات توضیحات فایل",
    tr: "Açıklama metinlerini göster",
    ar: "عرض نصوص الوصف",
    de: "Beschreibungstexte anzeigen",
    ja: "説明文を表示する",
    zh: "显示详细房源描述",
    uz: "E'lon tavsiflarini ko'rsatish",
    ru: "Показывать текст описания",
    ku: "شیکردنەوەی وردەکارییەکانی خانووبەرە",
    ps: "د توضیحاتو متنونه ښکاره کړئ",
    hi: "विवरण ग्रंथ दिखाएं",
    ur: "تفصیلی معلومات کا متن دکھائیں",
  },
  includeAmenities: {
    en: "Show amenities list",
    fa: "نمایش امکانات و متریال ساخت",
    tr: "Özellikler listesini göster",
    ar: "عرض قائمة المرافق",
    de: "Ausstattungsmerkmale anzeigen",
    ja: "設備一覧を表示する",
    zh: "展示配套便利设施",
    uz: "Mulk sharoitlarini ko'rsatish",
    ru: "Показывать список удобств",
    ku: "پیشاندانی تایبەتمەندییەکان و کەرەستەکان",
    ps: "د اسانتیاوو لیست ښکاره کړئ",
    hi: "सुविधाओं की सूची दिखाएं",
    ur: "سہولیات کی فہرست دکھائیں",
  },
  applySeal: {
    en: "Apply Ariana Rahnuma integrity seal",
    fa: "مهر اصالت و تایید کاداستر آریانا رهنما",
    tr: "Ariana Rahnuma kural doğruluğu mührünü ekle",
    ar: "تطبيق ختم مصداقية آريانا رهنما",
    de: "Echtheitssiegel von Ariana Rahnuma anwenden",
    ja: "Ariana Rahnumaの地籍保証印を適用する",
    zh: "盖上 Ariana Rahnuma 确权章",
    uz: "Ariana Rahnuma muhrini qo'llash",
    ru: "Накладывать печать подлинности Ariana Rahnuma",
    ku: "مۆری ڕەسەنایەتی و پشتڕاستکردنەوەی ئاریانا ڕەهنما",
    ps: "د آریانا رهنما کاداستر رسمي مهر لګول",
    hi: "एरियाना रहनुमा सील लागू करें",
    ur: "آریانا رهنما کا تصدیقی مہر لگائیں",
  },
  activeSelected: {
    en: "Active Selected Properties:",
    fa: "فایل‌های منتخب در سبد خروجی:",
    tr: "Seçili Aktif Portföy İlanları:",
    ar: "قائمة العقارات النشطة المحددة:",
    de: "Inhaber ausgewählter Objekte:",
    ja: "選択されたアクティブ物件:",
    zh: "宣传册已选房源:",
    uz: "Sevimli Tanlangan Mulklar:",
    ru: "Выбранные объекты:",
    ku: "خانووبەرە دیاریکراوەکان لە سەبەتەدا:",
    ps: "په سبد کې غوره شوي هدفونه:",
    hi: "सक्रिय चयनित संपत्तियां:",
    ur: "منتخب کردہ جائیدادوں کی فہرست:",
  },
  downloadBtn: {
    en: "Download Standalone Flyer (Print Guaranteed)",
    fa: "دانلود کاتالوگ آفلاین مستقل (ضمانت پرینت)",
    tr: "Bağımsız Broşürü İndir (Yazdırma Garantili)",
    ar: "تحميل بروشور مستقل (مضمون الطباعة)",
    de: "Eigenständiges Handout herunterladen (Druck)",
    ja: "パンフレットをダウンロード（印刷保証）",
    zh: "下载独立离线宣传册 (无损打印)",
    uz: "Mustaqil Broshyurani Yuklab Olish",
    ru: "Скачать автономный буклет",
    ku: "داونلۆدکردنی نامیلکەی سەربەخۆ",
    ps: "د خپلواک کار بروشور دانلود",
    hi: "स्टैंडअलोन फ़्लायर डाउनलोड करें",
    ur: "مستقل آف لائن بروشر ڈاؤن لوڈ کریں",
  },
  printBtn: {
    en: "Trigger direct window.print",
    fa: "اجرای چاپ مستقیم مرورگر ( window.print )",
    tr: "Doğrudan tarayıcı baskısını tetikle",
    ar: "تشغيل طباعة المتصفح المباشرة",
    de: "Direkten Browser-Druck starten",
    ja: "ブラウザ直接印刷を起動",
    zh: "直接调用浏览器打印",
    uz: "To'g'ridan-to'g'ri chop etish",
    ru: "Запустить прямую печать",
    ku: "جێبەجێکردنی چاپی ڕاستەوخۆ",
    ps: "د مستقیم چاپ تڼۍ",
    hi: "प्रत्यक्ष ब्राउज़र प्रिंट ट्रिगर करें",
    ur: "براؤزر سے فوری پرنٹ",
  },
  noticeLabel: {
    en: "Due to preview security constraints, please use the purple icon 'Download Standalone Flyer' to reliably print the customized catalogue from your computer.",
    fa: "به دلیل محدودیت کانتینر امنیتی در پیش‌نمایش زنده، پیشنهاد می‌شود همواره از دکمه بنفش رنگ «دانلود کاتالوگ آفلاین مستقل» برای پرینت دقیق و آسان کاتالوگ مشتری روی پی‌سی و لپ‌تاپ خود استفاده نمایید.",
    tr: "Önizlemedeki güvenlik kısıtlamaları nedeniyle, kataloğu bilgisayarınızdan yazdırmak için her zaman mor simgeli 'Bağımsız Broşürü İndir' butonunu kullanmanız önerilir.",
    ar: "نظراً للقيود الأمنية في المعاينة الفورية، يُنصح دائماً باستخدام الزر البنفسجي 'تحميل بروشور مستقل' لطباعة الكتالوج بدقة وسهولة من حاسوبك.",
    de: "Aufgrund von Sicherheitsbeschränkungen wird empfohlen, stets den lila Button 'Eigenständiges Handout herunterladen' zu verwenden, um den Katalog zuverlässig von Ihrem PC auszudrucken.",
    ja: "プレビューのセキュリティ制限により、カスタマイズされたカタログをお使いのPCから確実に印刷するには、常に「独立したパンフレットをダウンロード」ボタンを使用することをお勧めします。",
    zh: "由于在线预览容器安全沙箱限制，建议您点击紫色按钮“下载独立离线宣传册”，保存至您的电脑后直接双击打开进行高精度打印。",
    uz: "Jonli ko'rsatuvdagi xavfsizlik cheklovlari tufayli, katalogni kompyuteringizdan ishonchli chop etish uchun har doim binafsharang 'Mustaqil Broshyurani Yuklab Olish' tugmasidan foydalanish tavsiya etiladi.",
    ru: "Из-за ограничений безопасности в режиме предварительного просмотра рекомендуется использовать фиолетовую кнопку «Скачать автономный буклет» для качественной печати.",
    ku: "بەھۆی سنووردارکردنی ئاسایشی پێشبینی لایڤ، پێشنیار دەکرێت بۆ چاپی ڕوون هەمیشە دوگمەی بنەوشەیی 'داونلۆدکردنی نامیلکەی ئۆفلایینی سەربەخۆ' بەکاربێنن.",
    ps: "د امنیتي چاپیریال د محدودیتونو له امله د ښه او ډاډمن چاپ لپاره مهرباني وکړئ تل د خپلواک ډاونلوډ تڼۍ وکاروئ.",
    hi: "लाइव पूर्वावलोकन में सुरक्षा बाधाओं के कारण, अपने कंप्यूटर से कैटलॉग को प्रिंट करने के लिए हमेशा बैंगनी 'स्टैंडअलोन फ़्लायर डाउनलोड करें' का उपयोग करें।",
    ur: "سیکورٹی کی شرائط کی وجہ سے، جائیداد کی تفصیلات کو لائحہ عمل کے مطابق درست پرنٹ کرنے کے لیے ہمیشہ جامنی رنگ والا 'مستقل آف لائن بروشر ڈاؤن لوڈ کریں' کا آپشن استعمال کریں۔",
  },
  copySpecsBtn: {
    en: "Copy specs report text to clipboard",
    fa: "کپی مشخصات متنی برای شبکه‌های اجتماعی",
    tr: "Özellik raporu metnini panoya kopyala",
    ar: "نسخ تقرير المواصفات إلى الحافظة",
    de: "Berichttext in Zwischenablage kopieren",
    ja: "物件概要テキストをクリップボードにコピー",
    zh: "复制文本参数至剪贴板",
    uz: "Mulk tafsilotlarini nusxalash",
    ru: "Копировать описание в буфер",
    ku: "کۆپیکردنی تایبەتمەندی دەقی",
    ps: "د مشخصاتو د متن کاپي کول",
    hi: "विवरण रिपोर्ट टेक्स्ट क्लिपबोर्ड पर कॉपी करें",
    ur: "رپورٹ کا متن کلپ بورڈ پر کاپی کریں",
  },
  copSpecsBtnDone: {
    en: "Text Copied!",
    fa: "متن معرفی کاتالوگ کپی شد!",
    tr: "Metin kopyalandı!",
    ar: "تم نسخ النص!",
    de: "Text kopiert!",
    ja: "テキストをコピーしました！",
    zh: "文本已复制！",
    uz: "Nusxalandi!",
    ru: "Текст скопирован!",
    ku: "دەقی ناساندنی نامیلکە کۆپی کرا!",
    ps: "متن کاپي شو!",
    hi: "विवरण कॉपी किया गया!",
    ur: "متن کاپی ہو چکا ہے!",
  },
  brochureTitlePaper: {
    en: "Ariana Rahnuma Cadastre",
    fa: "کاداستر آریانا رهنما",
    tr: "Ariana Rahnuma Kadastrosu",
    ar: "كاداستر آريانا رهنما",
    de: "Ariana Rahnuma-Kataster",
    ja: "Ariana Rahnuma地籍",
    zh: "Ariana Rahnuma 确权地籍",
    uz: "Ariana Rahnuma Kadastri",
    ru: "Кадастр Ariana Rahnuma",
    ku: "ئاریانا ڕەهنما کاداستر",
    ps: "آریانا رهنما کاداستر",
    hi: "एरियाنا रहनुमा कडास्टर",
    ur: "آریانا رهنما کاداستر",
  },
  brochureSubPaper: {
    en: "Sovereign Land Valuation & Real Estate Hub",
    fa: "پلتفرم مدیریت دارایی‌های ملکی صادر‌شده کاداستر",
    tr: "Resmi Tapu ve Gayrimenkul Portföyü Platformu",
    ar: "إدارة المحافظ العقارية المتميزة والآمنة",
    de: "Sichere Vermittlung erstklassiger Immobilienportfolios",
    ja: "安全なプレミアム不動産ポートフォリオ仲介",
    zh: "顶级豪宅及主权地籍文件夹系统",
    uz: "Xavfsiz Premium Ko'chmas Mulk Brokerligi",
    ru: "Кадастровая оценка и брокерское сопровождение",
    ku: "پلاتفۆرمی بەڕێوەبردنی دارایی خانووبەرەی کاداستر",
    ps: "د ملکیتونو او املاکو د مدیریت خوندي مرکز",
    hi: "संपत्ति मूल्य निर्धारण कडास्टर केंद्र",
    ur: "پریمیم ریئل اسٹیٹ پورٹ فولیو مینجمنٹ پلیٹ فارم",
  },
  dateLabel: {
    en: "Issue Date:",
    fa: "تاریخ گزارش:",
    tr: "Yayın Tarihi:",
    ar: "تاريخ الإصدار:",
    de: "Ausstellungsdatum:",
    ja: "発行日:",
    zh: "报告发布日期:",
    uz: "Yaratilgan Sana:",
    ru: "Дата выдачи:",
    ku: "ڕێکەوتی ڕاپۆرت:",
    ps: "د خپریدو نیټه:",
    hi: "जारी करने की तिथि:",
    ur: "جاری کرنے کی تاریخ:",
  },
  refLabel: {
    en: "Report Ref:",
    fa: "کد آرشیو خروجی:",
    tr: "Rapor Referansı:",
    ar: "مرجع التقرير:",
    de: "Berichts-Referenz:",
    ja: "レポート参照番号:",
    zh: "报告索引编码:",
    uz: "Rapor Kodu:",
    ru: "Код отчета:",
    ku: "کۆدی ئەرشیفی دەرچوو:",
    ps: "د راپور نمبر:",
    hi: "रिपोर्ट रेफरी:",
    ur: "رپورٹ حوالہ نمبر:",
  },
  emptyBasket: {
    en: "No properties selected. Please click the basket icon (📥) on main page cards first.",
    fa: "هیچ ملکی در سبد خروجی کاتالوگ شما نیست. لطفاً روی دکمه سبد (📥) فایل‌های مربوطه در کارت‌های صفحه اصلی کلیک کنید.",
    tr: "Sepetinizde mülk bulunmamaktadır. Lütfen ana sayfadaki ilan kartlarında yer alan sepet simgesine (📥) tıklayın.",
    ar: "سلة المخرجات فارغة. يُرجى النقر على أيقونة السلة (📥) في بطاقات العقارات بالصفحة الرئيسية.",
    de: "Der Warenkorb ist leer. Bitte klicken Sie auf das Warenkorb-Symbol (📥) bei den Objekten auf der Hauptseite.",
    ja: "選択された物件はありません。メインページのカードにあるバスケットアイコン（📥）をクリックしてください。",
    zh: "宣传册选定房源为空。请先至主页，点击对应房源卡片上的小挎篮图标 (📥) 加入导出清单。",
    uz: "Savat bo'sh. Iltimos asosiy sahifadagi e'lonlar kartasidagi savat belgisini (📥) bosing.",
    ru: "В вашей корзине нет объектов. Пожалуйста, добавьте объекты с помощью иконки корзины (📥) на карточках объявлений.",
    ku: "هیچ خانووبەرەیەک لە سەبەتەی دەرچوودا نییە. تکایە لە کارتەکان دوگمەی سەبەتە (📥) دابگرە.",
    ps: "په سبد کې هیڅ مځکه نشته مهرباني وکړئ لومړی د خرید سبد (📥) وکاروئ.",
    hi: "कोई चयनित संपत्तियां नहीं हैं। कृपया संबंधित संपत्तियों पर टोकरी आइकन (📥) पर क्लिक करें।",
    ur: "لسٹنگ میں سے کوئی جائیداد منتخب نہیں کی گئی۔ برائے مہربانی ٹوکری (📥) والے نشان پر کلک کر کے شامل کریں۔",
  },
  preparedLabel: {
    en: "Prepared for client:",
    fa: "مشتری محترم:",
    tr: "Sayın müşterimiz:",
    ar: "مُعد خصيصاً للعميل:",
    de: "Erstellt für Kunden:",
    ja: "宛名（顧客名）:",
    zh: "专属尊贵客户:",
    uz: "Mijoz:",
    ru: "Подготовлено для:",
    ku: "کڕیاری بەڕێز:",
    ps: "د پیرودونکي نوم:",
    hi: "ग्राहक के लिए तैयार:",
    ur: "محترم کسٹمر برائے:",
  },
  consultantLabel: {
    en: "Consultant:",
    fa: "ارائه‌کننده:",
    tr: "Danışman:",
    ar: "المستشار:",
    de: "Berater:",
    ja: "提供担当者:",
    zh: "专业置业顾问:",
    uz: "Maslahatchi:",
    ru: "Консультант:",
    ku: "پێشکەشکەر:",
    ps: "وړاندې کونکی:",
    hi: "सलाहकार:",
    ur: "پیش کار/رابط کار:",
  },
  estimatedValue: {
    en: "Estimated Value",
    fa: "ارزش معامله برآوردی",
    tr: "Öngörülen İşlem Değeri",
    ar: "القيمة التقديرية للمعاملة",
    de: "Kalkulierter Immobilienwert",
    ja: "見積査定取引価格",
    zh: "评定房源市场价值",
    uz: "Mulkning Baholangan Qiymati",
    ru: "Оценочная стоимость сделки",
    ku: "بەهای خەمڵێنراوی مامەڵە",
    ps: "د ملکیت اټکل شوی ارزښت",
    hi: "अनुमानित लेनदेन मूल्य",
    ur: "مکان کی اندازہً طے شدہ قیمت",
  },
  heating: {
    en: "Heating/Cooling:",
    fa: "سرمایش/گرمایش:",
    tr: "Isıtma/Soğutma:",
    ar: "التدفئة والبرودة:",
    de: "Heizung/Kühlung:",
    ja: "冷暖房空調:",
    zh: "冷暖设施:",
    uz: "Isitish/Sovitish:",
    ru: "Отопление/Охлаждение:",
    ku: "سارد/گەرمکەرەوە:",
    ps: "ګرمول/یخول:",
    hi: "तापन/शीतलन:",
    ur: "سردی/گرمی کا سسٹم:",
  },
  cabinets: {
    en: "Cabinets:",
    fa: "کابینت:",
    tr: "Dolaplar:",
    ar: "الخزائن:",
    de: "Küchenschränke:",
    ja: "キャビネット収納:",
    zh: "整体橱柜:",
    uz: "Oshxona javoni:",
    ru: "Гарнитур/Шкафы:",
    ku: "کابینە:",
    ps: "کابینونه:",
    hi: "अलमारियाँ:",
    ur: "باورچی خانے کی الماری:",
  },
  deed: {
    en: "Deed Status:",
    fa: "وضعیت سند:",
    tr: "Tapu Durumu:",
    ar: "حالة السند العقاري:",
    de: "Urkunde-Status:",
    ja: "権利書状況:",
    zh: "确权状况:",
    uz: "Mulk Hujjati:",
    ru: "Статус документа:",
    ku: "بارودۆخی بەڵگەنامە:",
    ps: "د سند وضعیت:",
    hi: "डीड स्थिति:",
    ur: "رجسٹری کا اسٹیٹس:",
  },
  guarantee: {
    en: "Approved Ariana Rahnuma Cadastral Guarantee Active",
    fa: "تایید اصالت کاداستر با ضمانت آریانا رهنما",
    tr: "Onaylı Ariana Rahnuma Kadastro Garantisi Aktif",
    ar: "ضمان كاداستر آريانا رهنما المعتمد نشط",
    de: "Zertifizierte Ariana Rahnuma-Katastergarantie aktiv",
    ja: "承認されたAriana Rahnuma地籍保証が有効",
    zh: "Ariana Rahnuma 注册土地确权质保生效",
    uz: "Tasdiqlangan Ariana Rahnuma Kafolati Faol",
    ru: "Кадастровая гарантия Ariana Rahnuma активна",
    ku: "پشتڕاستکردنەوەی کاداستر بە پشتگیری ئاریانا ڕەهنما",
    ps: "د آریانا رهنما لخوا تایید شوی کاداستر باوري دی",
    hi: "स्वीकृत एरियाना रहनुमा कडास्ट्रल गारंटी सक्रिय",
    ur: "آریانا رهنما کا رجسٹرڈ کاداستر گارنٹی فعال ہے",
  },
  footerNotice: {
    en: "* Prices are dynamically calculated and confirmed via cadastral records.",
    fa: "* قیمت‌های پیوست بر اساس تسعیر لحظه‌ای بازار بین‌المللی ارزیابی گردیده و معتبر می‌باشد.",
    tr: "* Listelenen özellikler ve anlık döviz hesaplamaları, resmi kadastro kayıtları aracılığıyla işlenir.",
    ar: "* المواصفات المذكورة وتقييمات العملات الفورية تتم معالجتها عبر السجلات الرسمية المعتمدة.",
    de: "* Die aufgeführten Spezifikationen und Währungskalkulationen werden über die offiziellen Katasterdaten ermittelt.",
    ja: "* 記載された仕様およびリアルタイム換算価格は、公式な地籍コンセンサс記録に基づいて処理されます。",
    zh: "* 本报告所含房源规格参数及汇率瞬时折算数据均经官方地籍档案链及共识账本实时校准、合法有效。",
    uz: "* Ro'yxatdagi parametrlar va valyuta hisob-kitoblari rasmiy kadastr reyestriga mos keladi.",
    ru: "* Указанные параметры и валютные расчеты обработаны с использованием данных государственного кадастра.",
    ku: "* نرخەکان بەپێی دراوی جیهانی لەم ساتەدا خەمڵێنراون و فەرمین.",
    ps: "* د راپور د قیمتونو ارزونه د نړیوالو اسعارو له مخې باوري ده.",
    hi: "* सूचीबद्ध विनिर्देश और त्वरित मुद्रा मूल्यांकन संप्रभु कडास्ट्रल रिकॉर्ड के माध्यम से संसाधित किए जाते हैं।",
    ur: "* درج کردہ تفصیلات اور کرنسی ایکسچینج ریٹس کی جانچ پڑتال سرکاری فیلڈ کاداستر سے کی گئی ہے۔",
  },
  officialStampText: {
    en: "GUARANTEED",
    fa: "کاداستر",
    tr: "GARANTİLİ",
    ar: "مضمون کاداستر",
    de: "GARANTIERT",
    ja: "保証済み",
    zh: "地籍确权",
    uz: "KAFOLATLI",
    ru: "ГАРАНТИЯ",
    ku: "کاداستر",
    ps: "تضمن کاداستر",
    hi: "गारंटीकृत",
    ur: "تصدیق شدہ",
  },
  stampTitle: {
    en: "Ariana Rahnuma",
    fa: "آریانا رهنما",
    tr: "Ariana Rahnuma",
    ar: "آريانا رهنما",
    de: "Ariana Rahnuma",
    ja: "Ariana",
    zh: "Ariana",
    uz: "Ariana",
    ru: "Ariana",
    ku: "ئاریانا ڕەهنما",
    ps: "آریانا رهنما",
    hi: "एरियाنا रहनुमा",
    ur: "آریانا رهنما",
  }
};

export const ClientExportModal: React.FC<ClientExportModalProps> = ({
  lang,
  onClose,
  selectedProperties,
  onRemoveFromBasket,
}) => {
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  // Helper function for quick dictionary translations
  const t = (key: string) => {
    return LOCALIZED_DICT[key]?.[lang] || LOCALIZED_DICT[key]?.["en"] || key;
  };

  // Customizer state dynamically initialized according to the chosen language
  const [clientName, setClientName] = useState(() => {
    return DEFAULT_CLIENT_NAMES[lang] || DEFAULT_CLIENT_NAMES["en"];
  });
  const [brokerName, setBrokerName] = useState(() => {
    return DEFAULT_BROKER_NAMES[lang] || DEFAULT_BROKER_NAMES["en"];
  });
  const [brokerPhone, setBrokerPhone] = useState("09121234567");
  const [customGreeting, setCustomGreeting] = useState(() => {
    return DEFAULT_GREETINGS[lang] || DEFAULT_GREETINGS["en"];
  });

  // Toggles
  const [showImages, setShowImages] = useState(true);
  const [showCurrencies, setShowCurrencies] = useState(true);
  const [showOfficialStamp, setShowOfficialStamp] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showAmenities, setShowAmenities] = useState(true);
  const [docTheme, setDocTheme] = useState<"luxury" | "minimal" | "architect">("luxury");

  // Share link state
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn("Print trigger error: ", e);
    }
  };

  const handleDownloadHTML = () => {
    // Generate self-contained beautiful HTML with full styling, translations, and fonts
    const rtlStyle = isRtl ? "direction: rtl; text-align: right;" : "direction: ltr; text-align: left;";
    const itemsHTML = selectedProperties.map((p, idx) => {
      const c = COUNTRIES.find((cnt) => cnt.code === p.country) || COUNTRIES[0];
      const fullPrice = p.totalPrice || ((p.pricePerSqm || 0) * (p.area || 0));
      return `
        <div class="card">
          <div class="card-header">
            <span>${idx + 1}. ${p.title}</span>
            <span class="mls-code">MLS-${p.id}</span>
          </div>
          <div class="card-body">
            ${showImages ? `<img class="card-img" src="${p.images[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"}" />` : ""}
            <div class="card-details">
              <div class="tags-row">
                <span>📍 ${p.district}</span>
                <span>•</span>
                <span>📐 ${toLocalizedDigits(p.area, lang)} ${getTranslation(lang, "sqmUnit", "sqm")}</span>
                <span>•</span>
                <span>🛌 ${toLocalizedDigits(p.bedrooms || 0, lang)} ${getTranslation(lang, "typeBedsPlural", "Bedrooms")}</span>
              </div>
              <p class="desc">${p.description || ""}</p>
              ${showAmenities && (p.heating || p.cabinets || p.deed) ? `
                <div class="amenities">
                  ${p.heating ? `<div>🔥 ${t("heating")} ${p.heating}</div>` : ""}
                  ${p.cabinets ? `<div>🍳 ${t("cabinets")} ${p.cabinets}</div>` : ""}
                  ${p.deed ? `<div>📜 ${t("deed")} ${p.deed}</div>` : ""}
                </div>
              ` : ""}
              <div class="price-row">
                <div class="price">
                  ${t("estimatedValue")}: ${toLocalizedDigits(fullPrice.toLocaleString(), lang)} ${c.currency}
                </div>
                ${showCurrencies ? `<div class="usd-price">💵 (USD: $${toLocalizedDigits(Math.round(fullPrice / (c.baseExchangeRate || 68500)).toLocaleString(), lang)})</div>` : ""}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    const borderTopColor = docTheme === 'luxury' ? '#f59e0b' : docTheme === 'minimal' ? '#1e293b' : '#10b981';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="utf-8">
        <title>Ariana Rahnuma Client Brochure - ${clientName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;950&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 30px;
            ${rtlStyle}
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            border: 1px solid #cbd5e1;
            border-top: 12px solid ${borderTopColor};
            border-radius: 24px;
            padding: 40px;
            background-color: #ffffff;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
          }
          header {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo-text h1 { margin: 0; font-size: 26px; font-weight: 950; color: #1e1b4b; }
          .logo-text p { margin: 6px 0 0 0; font-size: 10px; color: #64748b; font-weight: bold; letter-spacing: 0.05em; }
          .meta-info { text-align: ${isRtl ? 'left' : 'right'}; font-family: monospace; font-size: 11px; color: #475569; }
          .customer-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 30px;
          }
          .customer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 12px;
            margin-bottom: 12px;
          }
          .customer-header p { margin: 0; font-size: 14px; font-weight: bold; }
          .greeting-text { font-size: 12px; color: #475569; line-height: 1.6; font-style: italic; margin: 0; }
          .card {
            border: 1px solid #cbd5e1;
            border-radius: 16px;
            margin-bottom: 25px;
            overflow: hidden;
            page-break-inside: avoid;
            background: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          }
          .card-header {
            background-color: #f8fafc;
            padding: 14px 20px;
            font-weight: 900;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #cbd5e1;
            font-size: 13px;
          }
          .mls-code { font-family: monospace; font-size: 11px; color: #4f46e5; background: #e0e7ff; padding: 2px 8px; border-radius: 4px; }
          .card-body {
            padding: 20px;
            display: flex;
            gap: 20px;
          }
          @media (max-width: 600px) {
            .card-body { flex-direction: column; }
            .card-img { width: 100% !important; height: auto !important; }
          }
          .card-img {
            width: 180px;
            height: 125px;
            object-fit: cover;
            border-radius: 12px;
            border: 1px solid #cbd5e1;
            flex-shrink: 0;
          }
          .card-details { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
          .tags-row {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 11px;
            font-weight: bold;
            color: #64748b;
            margin-bottom: 10px;
          }
          .desc { font-size: 12px; color: #334155; margin: 0 0 15px 0; line-height: 1.6; }
          .amenities {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 10px;
            background: #f8fafc;
            padding: 12px;
            border-radius: 12px;
            font-size: 11px;
            margin-bottom: 15px;
            border: 1px solid #f1f5f9;
          }
          .price-row {
            border-top: 1px solid #cbd5e1;
            padding-top: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .price { font-weight: 900; font-size: 15px; color: #1e1b4b; }
          .usd-price { font-size: 11px; font-family: monospace; color: #10b981; font-weight: bold; }
          footer {
            border-top: 2px solid #0f172a;
            padding-top: 20px;
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            align-items: center;
          }
          .stamp {
            border: 2px dashed #4f46e5;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            font-size: 9px;
            font-weight: 900;
            transform: rotate(-12deg);
            color: #4f46e5;
            line-height: normal;
          }
          .btn-print {
            background:#4f46e5; 
            color:white; 
            padding:16px 30px; 
            text-align:center; 
            font-weight:bold; 
            border-radius:14px; 
            margin-bottom:20px; 
            cursor:pointer;
            border: none;
            width: 100%;
            font-size: 14px;
            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
            transition: all 0.2s;
          }
          .btn-print:hover {
            background: #4338ca;
            transform: translateY(-2px);
          }
          @media print {
            body { padding: 0; background: #ffffff; }
            .container { box-shadow: none; border: none; max-width: 100%; padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <button class="btn-print no-print" onclick="window.print()">
            🖨️ ${t("printBtn")}
          </button>
          <header>
            <div class="logo-text">
              <h1>${t("brochureTitlePaper")}</h1>
              <p>${t("brochureSubPaper")}</p>
            </div>
            <div class="meta-info">
              <div>${t("dateLabel")} ${toLocalizedDigits("1405/03/11", lang)}</div>
              <div>${t("refLabel")} MB-OFFLINE-${Math.floor(10000 + Math.random() * 90000)}</div>
            </div>
          </header>
          
          <div class="customer-box">
            <div class="customer-header">
              <p>👤 ${t("preparedLabel")} ${clientName}</p>
              <p>📞 ${t("consultantLabel")} ${brokerName} (${brokerPhone})</p>
            </div>
            <div class="greeting-text">
              ${customGreeting}
            </div>
          </div>

          <div style="margin-top:30px;">
            ${itemsHTML}
          </div>

          <footer>
            <div>
              ${showOfficialStamp ? `<div style="color:#059669; font-weight:bold; font-size: 12px; display: flex; align-items: center; gap: 6px;">🛡️ ${t("guarantee")}</div>` : ""}
              <p style="color:#64748b; font-size:9px; margin-top:6px;">${t("footerNotice")}</p>
            </div>
            ${showOfficialStamp ? `
              <div class="stamp">
                <div>${t("stampTitle")}</div>
                <div style="color:#059669; font-size: 8px; margin: 2px 0;">${t("officialStampText")}</div>
                <div>${t("brochureTitlePaper")}</div>
              </div>
            ` : ""}
          </footer>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Ariana-Rahnuma-Brochure-${clientName.replace(/\s+/g, "-")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyShareLink = () => {
    const text = selectedProperties
      .map((p) => {
        const c = COUNTRIES.find((cnt) => cnt.code === p.country) || COUNTRIES[0];
        const formattedPrice = p.totalPrice
          ? `${p.totalPrice.toLocaleString()} ${c.currency}`
          : `${p.pricePerSqm ? (p.pricePerSqm * p.area).toLocaleString() : ""} ${c.currency}`;
        return `📍 [${p.district}] - ${p.title} (${formattedPrice})`;
      })
      .join("\n");
      
    const intro = `${clientName ? `${t("preparedLabel")} ${clientName}` : ""}\n${customGreeting}\n\n`;
    const footer = `\n📞 ${brokerName} (${brokerPhone})`;
    
    navigator.clipboard.writeText(intro + text + footer);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-fade-in print:bg-white print:p-0" id="client-export-backdrop">
      {/* Dynamic Style injection specifically tailored for pristine browser A4/Flyer Print outputs */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide parent application and background dashboard containers completely to avoid clutter */
          body > * {
            visibility: hidden !important;
          }
          #client-export-backdrop, #client-export-backdrop * {
            visibility: visible !important;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 10pt !important;
          }
          #client-export-backdrop {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            display: block !important;
            backdrop-filter: none !important;
          }
          #print-container-layout {
            all: unset !important;
            display: block !important;
            background: white !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            flex-basis: 100% !important;
          }
          /* Custom printable styles */
          .print-page-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          /* Direct Paper sheet sizing override for print */
          #client-print-sheet {
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 5mm !important;
            background: white !important;
            color: black !important;
          }
        }
      `}} />

      <div className="w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] print:max-h-none print:w-full print:border-none print:shadow-none print:rounded-none" id="print-container-layout">
        
        {/* Dynamic header ribbon */}
        <div className="p-4 border-b border-slate-850 flex items-center justify-between bg-slate-950/50 no-print">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="font-mono text-indigo-400 font-black text-xs uppercase tracking-wider">
              {t("title")}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-805 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400 border border-slate-800 rounded-full flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Body columns splitting customizers vs. live preview */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 print:block">
          
          {/* Column 1: Controls (Span 4) */}
          <div className="lg:col-span-4 p-5 md:p-6 border-r border-slate-850 bg-slate-950/40 space-y-6 no-print overflow-y-auto max-h-[81vh]">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-1.5">
                🎨 {t("customizeFlyer")}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                {t("customizeDesc")}
              </p>
            </div>

            {/* Inputs Group */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-400 font-bold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  {t("clientNameLabel")}
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-medium focus:outline-none"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. جناب آقای محمدی"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 font-bold flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                  {t("brokerNameLabel")}
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-medium focus:outline-none"
                  value={brokerName}
                  onChange={(e) => setBrokerName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  {t("brokerPhoneLabel")}
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-medium focus:outline-none font-mono text-center"
                  value={brokerPhone}
                  onChange={(e) => setBrokerPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 font-bold">
                  {t("coverMessageLabel")}
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 focus:outline-none leading-relaxed text-[11px]"
                  value={customGreeting}
                  onChange={(e) => setCustomGreeting(e.target.value)}
                />
              </div>
            </div>

            {/* Layout theme dropdown */}
            <div className="space-y-2 text-xs">
              <span className="block text-slate-400 font-bold">👑 {t("documentThemeLabel")}</span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850">
                <button
                  type="button"
                  onClick={() => setDocTheme("luxury")}
                  className={`py-1.5 text-[9px] font-bold rounded-lg transition-all ${docTheme === "luxury" ? "bg-amber-500/25 text-amber-400 border border-amber-500/20" : "text-slate-400 hover:text-white"}`}
                >
                  {t("themeLuxury")}
                </button>
                <button
                  type="button"
                  onClick={() => setDocTheme("minimal")}
                  className={`py-1.5 text-[9px] font-bold rounded-lg transition-all ${docTheme === "minimal" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  {t("themeMinimal")}
                </button>
                <button
                  type="button"
                  onClick={() => setDocTheme("architect")}
                  className={`py-1.5 text-[9px] font-bold rounded-lg transition-all ${docTheme === "architect" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:text-white"}`}
                >
                  {t("themeArchitect")}
                </button>
              </div>
            </div>

            {/* Customizer Toggles */}
            <div className="space-y-3 pt-2 text-xs border-t border-slate-850">
              <span className="block text-slate-450 font-bold">{t("controlVisibility")}</span>
              
              <label className="flex items-center gap-3 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showImages}
                  onChange={() => setShowImages(!showImages)}
                  className="w-4 h-4 bg-slate-950 rounded border-slate-800 accent-indigo-500 cursor-pointer"
                />
                <span>🖼️ {t("includeImages")}</span>
              </label>

              <label className="flex items-center gap-3 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showCurrencies}
                  onChange={() => setShowCurrencies(!showCurrencies)}
                  className="w-4 h-4 bg-slate-950 rounded border-slate-800 accent-indigo-500 cursor-pointer"
                />
                <span>💵 {t("includeCurrencies")}</span>
              </label>

              <label className="flex items-center gap-3 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showDescription}
                  onChange={() => setShowDescription(!showDescription)}
                  className="w-4 h-4 bg-slate-950 rounded border-slate-800 accent-indigo-500 cursor-pointer"
                />
                <span>📝 {t("includeDesc")}</span>
              </label>

              <label className="flex items-center gap-3 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showAmenities}
                  onChange={() => setShowAmenities(!showAmenities)}
                  className="w-4 h-4 bg-slate-950 rounded border-slate-800 accent-indigo-500 cursor-pointer"
                />
                <span>🏠 {t("includeAmenities")}</span>
              </label>

              <label className="flex items-center gap-3 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showOfficialStamp}
                  onChange={() => setShowOfficialStamp(!showOfficialStamp)}
                  className="w-4 h-4 bg-slate-950 rounded border-slate-800 accent-indigo-500 cursor-pointer"
                />
                <span>🛡️ {t("applySeal")}</span>
              </label>
            </div>

            {/* List of items selected in this basket */}
            <div className="space-y-2 text-xs pt-4 border-t border-slate-850">
              <span className="block text-slate-450 font-bold">🏢 {t("activeSelected")}</span>
              
              {selectedProperties.length === 0 ? (
                <p className="text-[10px] text-slate-550 italic">{t("emptyBasket")}</p>
              ) : (
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {selectedProperties.map((p) => (
                    <div key={p.id} className="p-2 bg-slate-950 border border-slate-855 rounded-xl flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium text-slate-300 truncate" title={p.title}>
                        📍 [{p.district}] {p.title}
                      </span>
                      <button
                        onClick={() => onRemoveFromBasket(p.id)}
                        className="text-slate-500 hover:text-red-400 font-bold px-1 transition outline-none border-0 bg-transparent text-[11px] cursor-pointer"
                        title={lang === "fa" ? "حذف" : "Remove"}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions Deck */}
            <div className="space-y-2.5 pt-4 border-t border-slate-850">
              <button
                onClick={handleDownloadHTML}
                disabled={selectedProperties.length === 0}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-black transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider scale-105 border border-indigo-400"
              >
                📥 {t("downloadBtn")}
              </button>

              <button
                onClick={handlePrint}
                disabled={selectedProperties.length === 0}
                className="w-full py-2.5 bg-emerald-700/30 hover:bg-emerald-700/50 border border-emerald-500/30 text-emerald-300 disabled:opacity-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                {t("printBtn")}
              </button>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-300/90 leading-relaxed font-semibold">
                ⚠️ {t("noticeLabel")}
              </div>

              <button
                onClick={handleCopyShareLink}
                disabled={selectedProperties.length === 0}
                className="w-full py-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? t("copSpecsBtnDone") : t("copySpecsBtn")}
              </button>
            </div>
          </div>

          {/* Column 2: Live Document print preview (Span 8) */}
          <div className="lg:col-span-8 p-2 xs:p-4 sm:p-6 bg-slate-950/20 overflow-x-auto overflow-y-auto max-h-[81vh] print:max-h-none print:p-0 print:bg-white flex items-start justify-start lg:items-center lg:justify-center w-full">
            
            {selectedProperties.length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic max-w-sm space-y-3">
                <span className="text-4xl block">📥</span>
                <p className="text-sm">
                  {t("emptyBasket")}
                </p>
              </div>
            ) : (
              /* THE IMMACULATE PHYSICAL PAPER SHEET */
              <div 
                id="client-print-sheet"
                className={`w-full max-w-2xl bg-white text-slate-950 p-3 xs:p-5 sm:p-8 shadow-2xl relative border flex flex-col justify-between ${
                  isRtl ? "rtl text-right font-sans" : "ltr text-left font-sans"
                } ${
                  docTheme === "luxury" ? "border-amber-500/25 border-t-[8px] border-t-amber-500" :
                  docTheme === "minimal" ? "border-slate-350 border-t-[8px] border-t-slate-800" :
                  "border-emerald-500/25 border-t-[8px] border-t-emerald-600"
                }`}
              >
                
                {/* 1. PAPER HEADER LANDSCAPE CO-BRANDING */}
                <div className="border-b-2 border-slate-900 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Ariana Rahnuma Custom Printable Logo */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L4 5V11C4 16.52 7.42 20.74 12 22C16.58 20.74 20 16.52 20 11V5L12 2Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 13.5V17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 11V17" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
                        <path d="M15 13.5V17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                        <path d="M8 11.5L12 8L16 11.5" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="5.5" r="1.5" fill="#10B981" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                        {t("brochureTitlePaper")}
                      </h2>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block mt-0.5">
                        {t("brochureSubPaper")}
                      </span>
                    </div>
                  </div>

                  {/* Date and ID Block */}
                  <div className="text-right text-[10px] text-slate-600 font-mono font-bold self-end sm:self-center">
                    <div>
                      {t("dateLabel")} {toLocalizedDigits("1405/03/11", lang)}
                    </div>
                    <div>
                      {t("refLabel")} <span className="uppercase text-indigo-700">MB-FLY-{Math.floor(10000 + Math.random() * 90000)}</span>
                    </div>
                  </div>
                </div>

                {/* 2. CUSTOMER ADDRESSING BLOCK & GREETING */}
                <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-2xl mb-6 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                      👤 {t("preparedLabel")} {clientName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-extrabold flex items-center gap-1 font-mono">
                      📞 {t("consultantLabel")} {brokerName} ({brokerPhone})
                    </span>
                  </div>
                  
                  {customGreeting && (
                    <p className="text-[11px] text-slate-600 leading-relaxed italic border-t border-slate-200/50 pt-2 font-medium">
                      {customGreeting}
                    </p>
                  )}
                </div>

                {/* 3. CORE PROPERTIES CATALOG GRID */}
                <div className="space-y-6 flex-1 mb-8">
                  {selectedProperties.map((p, idx) => {
                    const c = COUNTRIES.find((cnt) => cnt.code === p.country) || COUNTRIES[0];
                    const fullPrice = p.totalPrice || ((p.pricePerSqm || 0) * (p.area || 0));
                    
                    return (
                      <div 
                        key={p.id} 
                        className="print-page-break border border-slate-250 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow transition duration-200"
                      >
                        {/* Title Ribbon of property card */}
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex justify-between items-center">
                          <span className="text-xs font-black text-slate-900">
                            {idx + 1}. {p.title}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            MLS-{p.id}
                          </span>
                        </div>

                        {/* Splitting body visual side from specifications */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
                          
                          {/* Image box (if toggled) */}
                          {showImages && (
                            <div className="md:col-span-4 aspect-video sm:aspect-auto sm:h-28 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                              <img
                                src={p.images[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"}
                                alt={p.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {/* Data details (Span remaining grid size) */}
                          <div className={`${showImages ? "md:col-span-8" : "md:col-span-12"} space-y-2.5 text-xs text-slate-700`}>
                            {/* Area &beds tag block */}
                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-500 border-b border-slate-100 pb-1.5 font-mono">
                              <span className="flex items-center gap-1">📍 {p.district}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">📐 {toLocalizedDigits(p.area, lang)} {getTranslation(lang, "sqmUnit", "sqm")}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">🛌 {toLocalizedDigits(p.bedrooms || 0, lang)} {getTranslation(lang, "typeBedsPlural", "Bedrooms")}</span>
                            </div>

                            {showDescription && (
                              <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 italic">
                                {p.description}
                              </p>
                            )}

                            {/* Additional amenities metrics if toggled */}
                            {showAmenities && (p.heating || p.cabinets || p.deed) && (
                              <div className="grid grid-cols-2 gap-2 text-[9px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-150">
                                {p.heating && (
                                  <div>🔥 {t("heating")} <span className="font-bold text-slate-900">{p.heating}</span></div>
                                )}
                                {p.cabinets && (
                                  <div>🍳 {t("cabinets")} <span className="font-bold text-slate-900">{p.cabinets}</span></div>
                                )}
                                {p.deed && (
                                  <div>📜 {t("deed")} <span className="font-bold text-indigo-700">{p.deed}</span></div>
                                )}
                              </div>
                            )}

                            {/* Dynamic conversions matrix block */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-slate-100 pt-2 text-[10.5px]">
                              <div className="font-black text-slate-905">
                                {t("estimatedValue")}:{" "}
                                <span className="text-xs text-indigo-700 font-mono font-black">
                                  {toLocalizedDigits(fullPrice.toLocaleString(), lang)} {c.currency}
                                </span>
                              </div>
                              
                              {showCurrencies && (
                                <div className="text-[8.5px] font-mono text-slate-500 flex items-center gap-1.5">
                                  <span>💵 (USD: ${toLocalizedDigits(Math.round(fullPrice / (c.baseExchangeRate || 68500)).toLocaleString(), lang)})</span>
                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 4. PAPER SIGNATURE AND STAMP GUARANTORS FOOTER */}
                <div className="border-t border-slate-300 pt-5 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[9px] font-semibold">
                  <div className="space-y-1 max-w-sm w-full sm:w-auto">
                    {showOfficialStamp && (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-150 px-2 py-1 rounded-lg">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t("guarantee")}</span>
                      </div>
                    )}
                    <p className="text-[8px] text-slate-400 mt-1 leading-normal">
                      {t("footerNotice")}
                    </p>
                  </div>

                  {/* Stamp Graphic representation */}
                  {showOfficialStamp && (
                    <div className="relative w-20 h-20 border-2 border-dashed border-indigo-600 rounded-full flex flex-col items-center justify-center text-center -rotate-12 scale-90 text-[8px] text-indigo-700 font-bold leading-none shrink-0 cursor-pointer hover:rotate-0 transition duration-300">
                      <div className="absolute inset-0.5 border border-indigo-200 rounded-full"></div>
                      <span>{t("stampTitle")}</span>
                      <span className="text-[7px] text-emerald-600 my-0.5">{t("officialStampText")}</span>
                      <span>{t("brochureTitlePaper")}</span>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
