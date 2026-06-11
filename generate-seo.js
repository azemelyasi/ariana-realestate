import fs from 'fs';
import path from 'path';

// Define the 20 requested languages, their locale, direction, and name
const LANGUAGES = [
  { code: 'en', locale: 'en-US', dir: 'ltr', name: 'English' },
  { code: 'ar', locale: 'ar-AE', dir: 'rtl', name: 'العربية' },
  { code: 'fa', locale: 'fa-IR', dir: 'rtl', name: 'فارسی' },
  { code: 'de', locale: 'de-DE', dir: 'ltr', name: 'Deutsch' },
  { code: 'fr', locale: 'fr-FR', dir: 'ltr', name: 'Français' },
  { code: 'ru', locale: 'ru-RU', dir: 'ltr', name: 'Русский' },
  { code: 'es', locale: 'es-ES', dir: 'ltr', name: 'Español' },
  { code: 'it', locale: 'it-IT', dir: 'ltr', name: 'Italiano' },
  { code: 'tr', locale: 'tr-TR', dir: 'ltr', name: 'Türkçe' },
  { code: 'ur', locale: 'ur-PK', dir: 'rtl', name: 'اردو' },
  { code: 'hi', locale: 'hi-IN', dir: 'ltr', name: 'हिन्दी' },
  { code: 'prs', locale: 'prs-AF', dir: 'rtl', name: 'دری' },
  { code: 'ps', locale: 'ps-AF', dir: 'rtl', name: 'پښتو' },
  { code: 'uz', locale: 'uz-UZ', dir: 'ltr', name: 'Oʻzbekcha' },
  { code: 'zh', locale: 'zh-CN', dir: 'ltr', name: '简体中文' },
  { code: 'ja', locale: 'ja-JP', dir: 'ltr', name: '日本語' },
  { code: 'ko', locale: 'ko-KR', dir: 'ltr', name: '한국어' },
  { code: 'pt', locale: 'pt-PT', dir: 'ltr', name: 'Português' },
  { code: 'nl', locale: 'nl-NL', dir: 'ltr', name: 'Nederlands' },
  { code: 'sv', locale: 'sv-SE', dir: 'ltr', name: 'Svenska' }
];

// Helper functions for localized digits & local formatters
function toLocalizedDigits(numberString, locale) {
  const parts = numberString.split('.');
  const intPart = parts[0].replace(/\d/g, d => {
    return (1234567890).toLocaleString(locale, { useGrouping: false })[d];
  });
  return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
}

// Defining our 10 SEO topics with structured localized titles, descriptions & content markers
const TOPICS = [
  {
    slug: 'why-live-currency-real-estate',
    keywords: 'live currency conversion, real estate investment, eliminate exchange rate risk, global property investment, AI property valuation',
    titles: {
      en: 'Why Global Investors Need Live Currency Conversion in Real Estate',
      fa: 'چرا سرمایه‌گذاران جهانی به «تبدیل ارز زنده» در معاملات ملکی نیاز دارند؟',
      ar: 'لماذا يحتاج المستثمرون العالميون إلى تحويل العملات المباشر في العقارات؟',
      prs: 'چرا سرمایه‌گذاران جهانی به تبدیل پویای اسعار در معاملات جایداد نیاز دارند؟',
      ps: 'ولې نړیوال پانګه وال په املاکو معاملو کې د بهرنیو اسعارو سملاسي بدلون ته اړتیا لري؟',
      de: 'Warum globale Investoren Echtzeit-Währungsumrechnung bei Immobilien benötigen',
      fr: 'Pourquoi les investisseurs mondiaux ont besoin de la conversion de devises en direct dans l’immobilier',
      ru: 'Почему глобальным инвесторам нужна живая конвертация валют в сделках с недвижимостью',
      es: 'Por qué los inversores globales necesitan la conversión de divisas en vivo en el sector inmobiliario',
      it: 'Perché gli investitori globali hanno bisogno della conversione valutaria in tempo reale nei contratti immobiliari',
      tr: 'Küresel Yatırımcılar Neden Gayrimenkul İşlemlerinde Canlı Döviz Çevirisine İhtiyaç Duyar?',
      ur: 'عالمی سرمایہ کاروں کو رئیل اسٹیٹ کے لین دین میں لائیو کرنسی کی تبدیلی کی ضرورت کیوں ہے؟',
      hi: 'वैश्विक निवेशकों को अचल संपत्ति लेनदेन में लाइव मुद्रा परिवर्तन की आवश्यकता क्यों है?',
      uz: 'Nima uchun global investorlarga koʻchmas mulk bitimlarida jonli valyuta konvertatsiyasi zarur?',
      zh: '为什么全球投资者在房地产交易中需要实时汇率转换？',
      ja: 'グローバル投資家が不動産取引でリアルタイムの通貨換算を必要とする理由',
      ko: '글로벌 투자자가 부동산 거래에서 실시간 환율 변환을 필요로 하는 이유',
      pt: 'Por que os investidores globais precisam de conversão de moeda ao vivo no setor imobiliário',
      nl: 'Waarom wereldwijde investeerders live valutaomrekening nodig hebben in vastgoed',
      sv: 'Varför globala investerare behöver live valutaomvandling i fastighetsaffärer'
    },
    metaDescriptions: {
      en: 'Discover why live currency conversion eliminates exchange rate risks and guarantees transparency for global property buyers.',
      fa: 'دریابید که چرا تبدیل ارز آنلاین ریسک‌های نوسان نرخ ارز را حذف کرده و شفافیت معاملات ملکی بین‌المللی را تضمین می‌کند.',
      ar: 'اكتشف كيف يزيل تحويل العملات المباشر مخاطر أسعار الصرف ويضمن الشفافية للمشترين الدوليين.',
      prs: 'اهمیت تبدیل ارز آنلاین برای کاهش خطرات نوسان ارز در معاملات املاک بین‌المللی با شفافیت کامل.',
      ps: 'ومومئ چې ولې د اسعارو نرخ آنلاین تبدیلیدل د املاکو ترمنځ د اسعارو خطرونه له مینځه وړي او روڼتیا ډاډمنوي.',
      de: 'Erfahren Sie, wie die Echtzeit-Währungsumrechnung Wechselkursrisiken eliminiert und Transparenz für globale Käufer schafft.',
      fr: 'Découvrez pourquoi la conversion de devises en temps réel élimine les risques de change pour les acheteurs internationaux.',
      ru: 'Узнайте, как живая конвертация валют устраняет валютные риски и гарантирует прозрачность для покупателей.',
      es: 'Descubra cómo la conversión de divisas en vivo elimina riesgos cambiarios y garantiza transparencia.',
      it: 'Scopri come la conversione in tempo reale elimina i rischi di cambio e garantisce trasparenza nei contratti.',
      tr: 'Canlı döviz çevirisinin kur risklerini nasıl ortadan kaldırdığını ve şeffaflık sağladığını keşfedin.',
      ur: 'کرنسی کی لائیو تبدیلی کس طرح شرح مبادلہ کے خطرے کو ختم کرتی ہے اور عالمی خریداروں کے لیے شفافیت لاتی ہے۔',
      hi: 'जानें कि कैसे लाइव मुद्रा रूपांतरण विनिमय दर के जोखिमों को समाप्त करता है और पारदर्शिता लाता है।',
      uz: 'Jonli valyuta konvertatsiyasi kurs xavflarini qanday bartaraf etishi va shaffoflikni kafolatlashi haqida bilib oling.',
      zh: '探索实时汇率转换如何消除汇率风险并为全球购房者提供交易透明度。',
      ja: 'リアルタイムの通貨換算が為替リスクを排除し、グローバルな不動産取引に透明性をもたらす理由をご覧ください。',
      ko: '실시간 통화 변환이 환율 리스크를 제거하고 글로벌 구매자들에게 어떻게 거래 투명성을 제공하는지 알아보세요.',
      pt: 'Descubra como a conversão de moedas online elimina riscos cambiais e garante transparência na compra de imóveis.',
      nl: 'Ontdek hoe live valutaomrekening wisselkoersrisico’s elimineert en transparantie garandeert voor kopers.',
      sv: 'Lär dig hur live valutaomvandling eliminerar växelkursrisker och garanterar öppenhet för globala köpare.'
    },
    bulletPoints: {
      en: [
        'Problem: Severe exchange rate volatility and zero transparency during international property escrow billing sessions.',
        'Solution: Direct on-the-fly currency conversion powered by authorized Morningstar APIs matched with central banking ledgers.',
        'Premium Advantage: Seamlessly track property indices in US Dollar, Euro, British Pound, UAE Dirham, or local sovereign native currency.'
      ],
      fa: [
        'مشکل: نوسان وحشتناک اسعار و عدم وجود شفافیت صرافی در زمان تسویه وجوه املاک بین‌المللی.',
        'راهکار: تبدیل آنلاین آنی مجهز به بازخورد فید صرافی‌های معتبر جهانی (مانند مورنینگ‌استار) و بانک‌های مرکزی دولت‌ها.',
        'مزیت طلایی: امکان پایش بی‌مرز قیمت بر حسب دلار، یورو، پوند، درهم و یا ارز محلی ترجیحی کاربر.'
      ],
      ar: [
        'المشكلة: تقلبات أسعار الصرف الحادة وعدم وجود شفافية في تسوية المعاملات العقارية الدولية.',
        'الحل: تحويل فوري ومباشر للعملات مدعوم ببيانات من Morningstar والبنوك المركزية.',
        'الميزة الذهبية: تتبع أسعار العقارات بالدولار أو اليورو أو الجنيه الإسترليني أو الدرهم الإماراتي أو العملة المحلية للمستخدم.'
      ],
      prs: [
        'مشکل: نوسان اسعار بین‌المللی و سردرگمی سرمایه‌گذاران در معاملات خارجی جایدادها.',
        'راه‌حل: سیستم آنلاین تبدیل اسعار با اتصال مستقیم به بانک‌های مرکزی و دیتابیس داده‌های بلادرنگ صرافی‌ها.',
        'مزیت کاداستر: بررسی قیمت دقیق هر متر مربع به دلار، یورو، درهم و افغانی همرمان.'
      ],
      ps: [
        'ستونزه: د نړیوالو ملکیتونو په معاملو کې د بهرنیو اسعارو سخت بدلون او د روڼتیا نشتوالی.',
        'راحل: د مرکزي بانکونو او مالي معتبرو سرچینو په ملاتړ د بهرنیو اسعارو سمدستي بدلون.',
        'غوره ګټه: د ډالرو، یورو، درهم او افغانیو په وړاندې د ملکیتونو د دقیق قیمت لیدل.'
      ]
    }
  },
  {
    slug: 'market-analysis-2026',
    keywords: 'USD/EUR/AED exchange rate, 2026 market forecast, currency fluctuation impact, real estate ROI, central bank rates',
    titles: {
      en: 'USD/EUR/AED Exchange Rates: Trends & Forecast for Real Estate Investment in 2026',
      fa: 'تحلیل نرخ ارز دلار/یورو/درهم: روندها و پیش‌بینی برای سرمایه‌گذاری ملکی در ۲۰۲۶',
      ar: 'تحليل أسعار صرف الدولار/اليورو/الدرهم: الاتجاهات والتوقعات للاستثمار العقاري في عام 2026',
      prs: 'بررسی نوسان دالر، یورو و درهم: چشم‌انداز بازارهای ملکی جهان در سال ۲۰۲۶ میلادی',
      ps: 'د ډالرو/یورو/درهمو د اسعارو تحلیل: په ۲۰۲۶ کال کې د املاکو د پانګونې مخکښ تګلارې',
      de: 'USD/EUR/AED Wechselkurse: Trends & Prognose für Immobilieninvestitionen 2026',
      fr: 'Taux de change USD/EUR/AED : Tendances e prévisions d’investissement immobilier en 2026',
      ru: 'Курсы валют USD/EUR/AED: Тренды и прогнозы для инвестиций в недвижимость на 2026 год',
      es: 'Tipos de cambio USD/EUR/AED: Tendencias y previsión para la inversión inmobiliaria en 2026',
      it: 'Tassi di cambio USD/EUR/AED: Trend e previsioni per gli investimenti immobiliari nel 2026',
      tr: 'USD/EUR/AED Döviz Kurları: 2026 Gayrimenkul Yatırımı Trendleri ve Öngörüleri',
      ur: 'امریکی ڈالر/یورو/درہم کے شرح تبادلہ: 2026 میں رئیل اسٹیٹ انویسٹمنٹ کے رجحانات اور پیشین گوئی',
      hi: 'USD/EUR/AED विनिमय दर: 2026 में अचल संपत्ति निवेश के लिए रुझान और पूर्वानुमान',
      uz: 'USD/EUR/AED valyuta kurslari: 2026-yilda koʻchmas mulk investitsiyalari boʻyicha prognozlar',
      zh: '美元/欧元/迪拉姆汇率：2026年房地产投资趋势与市场预测',
      ja: '米ドル/ユーロ/ディルハム為替レート：2026年不動産投資のトレンドと市場予測',
      ko: 'USD/EUR/AED 환율: 2026년 부동산 투자 트렌드 및 향후 전망',
      pt: 'Taxas de Câmbio USD/EUR/AED: Tendências e previsões para o investimento imobiliário em 2026',
      nl: 'USD/EUR/AED wisselkoersen: trends en prognose voor vastgoedinvesteringen in 2026',
      sv: 'USD/EUR/AED växelkurser: trender och prognos för fastighetsinvesteringar 2026'
    },
    metaDescriptions: {
      en: 'Analyze the performance of USD, EUR, and AED over the past 6 months to make smart property investments in 2026.',
      fa: 'تحلیل جامعی از عملکرد اسعار دلار، یورو و درهم در ۶ ماه گذشته و پیش‌بینی بازدهی سرمایه‌گذاری ملکی در دبی، استانبول و برلین.',
      ar: 'تحليل أداء الدولار واليورو والدرهم على مدار الـ 6 أشهر الماضية لاتخاذ قرارات استثمارية ذكية في 25.',
      prs: 'تحلیل دقیق اسعار با ثبات نظیر درهم و دالر و اثرگذاری مستقیم آن بر مفاد سرمایه‌گذاری ملکی در شهرهای بزرگ.',
      ps: 'د تیرو ۶ میاشتو مالي راپورونو پر بنسټ په دبي او استانبول کې د ګټې تر ټولو غوره تحلیل.',
      de: 'Analysieren Sie die Performance von USD, EUR und AED der letzten 6 Monate für kluge Investitionsentscheidungen 2026.',
      fr: 'Analysez les performances du dollar, de l’euro et de l’AED au cours des 6 derniers mois pour des choix immobiliers intelligents en 2026.'
    },
    bulletPoints: {
      en: [
        'Detailed analysis of exchange rate fluctuations over the past 6 quarters across premier national nodes.',
        'Medium-term forecast grounded in statements from the Federal Reserve, ECB, and major Middle Eastern central banks.',
        'The direct correlation between currency volatility and real estate ROI in Dubai Marina, Berlin Mitte, and Antalya.'
      ],
      fa: [
        'تحلیل موشکافانه نوسانات نرخ ارز در ۶ ماه گذشته و تاثیر مستقیم آن بر تضعیف یا تقویت ارزش اسمی دفاتر اموال.',
        'پیش‌بینی جامع نیم‌سال دوم بر مبنای اقدامات فدرال رزرو، بانک مرکزی اروپا و کمیته‌های اعتباری کشورهای خاورمیانه.',
        'تاثیر مستقیم تنش نرخ بر بازدهی خالص سرمایه مدفون در املاک دبی، استانبول، کابل و برلین.'
      ]
    }
  },
  {
    slug: 'dubai-buyers-guide-foreigners',
    keywords: 'buy property in Dubai, foreign investor guide, Dubai real estate 2026, property buying steps, Dubai investment guide',
    titles: {
      en: 'Step-by-Step Guide for Foreigners Buying Property in Dubai (2026)',
      fa: 'راهنمای گام به گام خرید ملک در دبی برای سرمایه‌گذاران خارجی (۲۰۲۶)',
      ar: 'دليل خطوة بخطوة للأجانب لشراء العقارات في دبي (2026)',
      prs: 'راهنمای کامل گام به گام خرید خانه در دبی برای سرمایه‌گذاران و مهاجرین افغان و خارجی (۲۰۲۶)',
      ps: 'په دبي کې د بهرنیو مراجعینو لپاره د کور پېرلو ګام په ګام قانوني لارښود (۲۰۲۶)',
      de: 'Schritt-für-Schritt-Anleitung für Ausländer beim Immobilienkauf in Dubai (2026)',
      fr: 'Guide étape par étape pour les étrangers achetant une propriété à Dubaï (2026)',
      ru: 'Пошаговое руководство для иностранцев по покупке недвижимости в Дубае (2026 год)',
      es: 'Guía paso a paso para extranjeros que compran propiedades en Dubái (2026)',
      it: 'Guida passo-passo per gli stranieri che desiderano acquistare immobili a Dubai (2026)',
      tr: 'Yabancılar İçin Dubai’de Ev Alma Rehberi: Adım Adım Gayrimenkul Yatırımı (2026)',
      ur: 'دبئی میں غیر ملکیوں کے لیے جائیداد خریدنے کا مرحلہ وار گائیڈ (2026)',
      hi: 'दुबई में विदेशियों के लिए संपत्ति खरीदने की चरण-दर-चरण मार्गदर्शिका (2026)',
      uz: 'Chet elliklar uchun Dubayda koʻchmas mulk sotib olish boʻyicha bosqichma-bosqich qoʻllanma (2026)',
      zh: '外国人在迪拜购买房地产的步骤指南（2026年最新版）',
      ja: '外国人がドバイで不動産を購するためのステップ・バイ・ステップガイド（2026年）',
      ko: '외국인을 위한 두바이 부동산 구매 단계별 완벽 가이드 (2026)',
      pt: 'Guia Passo a Passo para Estrangeiros na Compra de Imóveis no Dubai (2026)',
      nl: 'Stapsgewijze handleiding voor buitenlanders die vastgoed kopen in Dubai (2026)',
      sv: 'Steg-för-steg-guide för utlänningar som köper fastighet i Dubai (2026)'
    },
    metaDescriptions: {
      en: 'The complete 2026 blueprint to buying freehold properties in Dubai as a foreign buyer, tax implications, and dynamic valuation models.',
      fa: 'نقشه راه کامل خرید املاک با سند آزاد (کلیدی) در دبی برای جلب سرمایه خارجی، شناخت مالیات‌ها و ابزار ممیزی ارزش‌گذاری الگوها.',
      ar: 'المخطط الكامل لعام 2026 لشراء العقارات في دبي للمشترين الأجانب، مع التكاليف ورسوم المعاملات.',
      prs: 'شامل مراحل پیدا کردن ملک، هزینه‌های محلی صرافی و شهرداری دی‌ال‌دی دبی برای سرمایه‌گذاران افغان.',
      ps: 'د بهرنیو سوداګرو لپاره د ټکسونو، فیسونو او رسمي سندونو د ترلاسه کولو شرایط او مراحل.'
    },
    bulletPoints: {
      en: [
        'Complete property selection criteria and verification workflows under Dubai Land Department (DLD) protocols.',
        'Associated municipal fees, notary, and agent commission structures clearly calculated.',
        'Utilizing neural AI property valuation tools and live billing rates to assure peak purchasing efficiency.'
      ],
      fa: [
        'فرآیند از صفر تا صد انتخاب ملک فریلنس تحت نظارت مستقیم قوانین اداره اسناد و املاک دبی (DLD).',
        'بررسی دقیق مالیات‌های شهرداری، هزینه‌های انتقال سند کاداستر و دستمزد دلالان مجاز رسمی دبی.',
        'استفاده بهینه از ابزار ارزش‌گذاری هوش مصنوعی آریانا رهنما جهت حذف هزینه‌های اضافه واسطه‌گری.'
      ]
    }
  },
  {
    slug: 'how-ai-transforms-valuation',
    keywords: 'AI property valuation, machine learning real estate, accurate home value, automated valuation model, AI real estate tool',
    titles: {
      en: 'How Artificial Intelligence is Revolutionizing Real Estate Valuation',
      fa: 'چگونه هوش مصنوعی ارزشگذاری املاک را متحول میکند؟'
    },
    metaDescriptions: {
      en: 'Discover how automated machine learning models evaluate thousands of parameters to generate perfect real estate values.',
      fa: 'کشف کنید که چگونه مدل‌های یادگیری ماشین با پایش داده‌های جغرافیایی، قیمت املاک را صددرصد منصفانه و بدون دخالت دلالان تخمین می‌زنند.'
    },
    bulletPoints: {
      en: [
        'Evaluating dynamic property locations, neighborhood safety coefficients, and recent registry transactions simultaneously.',
        'Comparing legacy manual appraisals against neural automated valuation algorithms.',
        'Instant trial of Ariana Rahnuma’s zero-cost AI tool with continuous multi-currency output.'
      ],
      fa: [
        'تحلیل همزمان ویژگی‌های فیزیکی، ضریب امنیت محلی و معاملات ثبت‌شده پیشین بر بستر موتورهای مغناطیسی آمار.',
        'مقایسه خطاهای فاحش کارشناسی سنتی با درصد خطای زیر ۲٪ هسته هوش مصنوعی در پلتفرم کاداستر.',
        'دسترسی رایگان و بدون واسطه به ممیزی هوشمند ارزش خانه شما به ریال، تومان، تتر و ارزهای جهانی.'
      ]
    }
  },
  {
    slug: 'dubai-property-usdt-investment',
    keywords: 'invest in Dubai with USDT, Tether real estate, crypto property investment, borderless transaction, Dubai crypto investment',
    titles: {
      en: 'Investing in Dubai Real Estate with USDT (Tether): A Guide to Borderless Deals',
      fa: 'سرمایه‌گذاری در املاک دبی با تتر (USDT): راهنمای معاملات بدون مرز'
    },
    metaDescriptions: {
      en: 'Explore the absolute legal benefits and dynamic transfer mechanics of buying premium Dubai flats using USDT stablecoins.',
      fa: 'آشنایی کامل با شیوه‌های قانونی، بهداشتی و ایمن بکارگیری رمزارز تتر در معاملات لوکس بر دبی و فرآیند تسویه معاوضه آن با درهم امارات.'
    },
    bulletPoints: {
      en: [
        'The distinct advantages of utilizing USDT over conventional slow swift wires for foreign buyers.',
        'Step-by-step compliant conversion of cryptocurrency into physical sovereign UAE Dirhams.',
        'Maintaining watertight transaction transparency and compliance in decentralized escrow.'
      ],
      fa: [
        'مزایای برتر سرعت انتقال و کارمزد نزدیک به صفر تتر به نسبت روش سنتی حواله بانکی بین‌المللی سویفت.',
        'چگونه صرافی‌های مجاز و معتبر دبی تتر شما را به درهم رسمی امارات با فاکتورهای رسمی تبدیل می‌کنند.',
        'حفظ استانداردهای مبارزه با پولشویی موسوم به قواعد جهانی کی‌وای‌سی جهت معامله بی‌نقص.'
      ]
    }
  },
  {
    slug: 'free-ai-valuation-estimator',
    keywords: 'property value estimator, free home valuation, AI property calculator, estimate house price, real estate valuation tool',
    titles: {
      en: 'Free AI Property Valuation Web Tool - Estimating Fair Market Price',
      fa: 'ابزار ارزشگذاری ملک با هوش مصنوعی – ارزش ملک خود را تخمین بزنید'
    },
    metaDescriptions: {
      en: 'Determine your property’s estimated value instantaneously using our neural AI valuation models. No subscription required.',
      fa: 'ارزش واقعی دارایی ملکی خود را بر مبنای متراژ، مکان و تعداد اتاق به صورت آنی محاسبه و استخراج نمایید.'
    },
    bulletPoints: {
      en: [
        'Input metrics: property location, total sqm, bedroom configuration, and construction materials.',
        'Clear real-time outputs: estimated valuation printed instantly in USD, EUR, and AED.',
        'Watertight local sandbox calculation, 100% free with no login required.'
      ],
      fa: [
        'ورودی ساده: مشخص نمودن موقعیت جغرافیایی، متراژ دقیق زمین، تعداد اتاق و میزان کیفیت مواد اولیه ساخت.',
        'خروجی‌های داینامیک: برآورد آنی قیمت کل بر حسب دلار آمریکا، یورو، ریال و درهم با نرخ روز صرافی‌ها.',
        'سیستم کاملا محلی و ایمن، بدون نیاز به ثبت ایمیل یا پرداخت هزینه.'
      ]
    }
  },
  {
    slug: 'dubai-vs-istanbul-vs-berlin',
    keywords: 'Dubai vs Istanbul vs Berlin real estate, best city to invest 2026, property yield comparison, international real estate market',
    titles: {
      en: 'Dubai vs Istanbul vs Berlin: Best Global City to Buy Property in 2026',
      fa: 'دبی در مقابل استانبول در مقابل برلین: کدام بازار برای سرمایه‌گذاری ۲۰۲۶ مناسب‌تر است؟'
    },
    metaDescriptions: {
      en: 'Compare the net rental yield, laws on foreign buyers, and currency volatility impact between Dubai, Istanbul, and Berlin Mitte.',
      fa: 'مقایسه جامع نرخ سود حاصل از کرایه سالانه، موانع حقوقی اقامتی برای اتباع خارجی و نوسانات اسعار میان دبی، استانبول و برلین.'
    },
    bulletPoints: {
      en: [
        'Comparing average rental yields: Dubai leading with 7-9% versus Berlin’s 3% and Istanbul’s high nominal figures.',
        'Legal constraints on foreign ownership and transfer of capital guidelines analyzed.',
        'Evaluating currency inflation index volatility and its consequence on net capital gains.'
      ],
      fa: [
        'املاک دبی با اخذ بازدهی متوسط سالانه ۷٪ تا ۹٪ در مقابل برزخ مالیاتی آلمان و برلین.',
        'تسهیلات فرآیند اخذ شهروندی و پاسپورت با خرید ملک در دبی و ترکیه و شرایط ویزاهای نقدی اروپا.',
        'اثر تضعیف ارزش پول ملی لیر در مقابل درهم در تراز دارایی‌های ارزی سرمایه‌گذاران.'
      ]
    }
  },
  {
    slug: 'residence-and-citizenship-investment',
    keywords: 'residence by investment, citizenship through real estate, Dubai golden visa, Turkey citizenship, European investment visa',
    titles: {
      en: 'Golden Visa & Citizenship by Buying Property across UAE, Turkey, & Europe',
      fa: 'مهاجرت به امارات، ترکیه و اروپا از طریق خرید ملک'
    },
    metaDescriptions: {
      en: 'The updated 2026 sovereign regulations for obtaining Dubai Golden Visa, Turkish Citizenship, or European golden visa residency.',
      fa: 'آخرین مصوبات و آیین‌نامه‌ها جهت دریافت کارت اقامت بلندمدت طلایی امارات، شهروندی سریع با ثبت سند در ترکیه و ویزاهای طلایی پرتغال.'
    },
    bulletPoints: {
      en: [
        'Obtaining the 10-Year Dubai Golden Visa threshold without the necessity of local sponsors.',
        'Fast-track Turkish passport rules for foreign property buyers ($400,000 baseline).',
        'Comparing Spanish, Greek and Portuguese real estate investment programs for Schengen residency.'
      ],
      fa: [
        'شرایط قانونی گرفتن اقامت طلایی ۱۰ ساله دبی بدون نیاز به معرف بومی امارات.',
        'حداقل سرمایه خرید ۴۰۰,۰۰۰ دلاری در ترکیه جهت تسلیم درخواست پرونده تابعیت و گذرنامه ترکیه.',
        'بررسی آخرین وضعیت ویزای سرمایه‌گذاری ملکی پرتغال، اسپانیا و یونان برای ورود آزادانه به شینگن.'
      ]
    }
  },
  {
    slug: 'short-term-vs-long-term-rentals',
    keywords: 'short term vs long term rental, Airbnb investment, rental yield calculation, property ROI, vacation rental income',
    titles: {
      en: 'Short-Term Airbnb vs Long-Term Renting: Maximizing Your Property ROI',
      fa: 'اجاره کوتاه مدت در مقابل اجاره بلندمدت: کدام یک برای سرمایه شما بهتر است؟'
    },
    metaDescriptions: {
      en: 'An algorithmic comparison of Airbnb/short-term yields versus the stability of standard annual residential contracts.',
      fa: 'مقایسه سیستماتیک بازده ماهانه اجاره‌های پاشنه متحرک تعطیلاتی هتلینگ ملکی در برابر تعهد کانون‌های سنتی مستاجرین.'
    },
    bulletPoints: {
      en: [
        'Yield comparison: vacation rentals offering higher cash-flow under the threat of high vacancy rate factors.',
        'Dubai and Istanbul holiday homes regulations, license cost and tax overheads.',
        'Calculating exact ROI using advanced algorithmic multi-currency valuation tools.'
      ],
      fa: [
        'تفاوت بازده: دریافتی پویای روزانه با ریسک متغییر نبود گردشگر در فصول سرد و گرم سال.',
        'قوانین اخذ لایسنس گردشگری دبی برای آپارتمان‌ها در مناطق داغ توریستی.',
        'نحوه برآورد ریالی مخارج نظافتی و مدیریتی پلتفرم آپارتمانی برای بدست آوردن حاشیه سود تمیز.'
      ]
    }
  },
  {
    slug: 'why-ariana-rahnuma-real-estate',
    keywords: 'Ariana Rahnuma features, live currency converter, AI real estate platform, global property marketplace, real estate fintech',
    titles: {
      en: 'Why Ariana Rahnuma? Transforming Global Real Estate with FinTech & AI',
      fa: 'آریانا رهنما: اولین پلتفرم املاک خاورمیانه با تبدیل ارز زنده و هوش مصنوعی'
    },
    metaDescriptions: {
      en: 'Ariana Rahnuma introduces live Morningstar forex conversions, AI property scanners, satellite tracking, and crypto-escrow for global investors.',
      fa: 'معرفی ویژگی‌های بی‌تکرار پلتفرم کاداستر آریانا رهنما نظیر تطبیق آنی ارزهای خلیج‌فارس، اسکنر ضدکلاهبرداری سنتینل و ابزار چندزبانه.'
    },
    bulletPoints: {
      en: [
        'Real-time Morningstar API integrations feeding localized token valuations seamlessly.',
        'Watertight P2P security backed by automated Sentinel automated NLP compliance scanners.',
        'Serving real estate brokers across 8 distinct global nations supporting over 20 languages.'
      ],
      fa: [
        'یکپارچه‌سازی ابزار محاسباتی با دیتای صرافی‌های مورنینگ‌استار برای ثبت دقیق قیمت به ۳۰ ارز.',
        'پایش امنیتی محتوای متنی با اسکنر کاداستر نگهبان هوش مصنوعی جهت مبارزه با بیعانه‌های مشکوک.',
        'پوشش سراسری و باز بودن دسترسی به ده کشور بزرگ منطقه با پشتیبانی کامل از ۲۰ زبان زنده جهان.'
      ]
    }
  }
];

// Fallback translating for LTR languages from English, and RTL from Persian/Farsi
function getFallbackTextForLanguage(topic, targetLang) {
  const isRtl = ['fa', 'ar', 'ur', 'prs', 'ps'].includes(targetLang);
  const baseLang = isRtl ? 'fa' : 'en';
  
  // Use explicitly translated titles/descriptions if present, otherwise fallback to baseLang
  const title = topic.titles[targetLang] || topic.titles[baseLang];
  const desc = topic.metaDescriptions[targetLang] || topic.metaDescriptions[baseLang];
  
  // Bullets lists fallback
  const bullets = topic.bulletPoints[targetLang] || topic.bulletPoints[baseLang];
  
  return { title, desc, bullets };
}

// Ensure output folder exists
const blogUrlFolder = path.join(process.cwd(), 'public', 'blog');
if (!fs.existsSync(blogUrlFolder)) {
  fs.mkdirSync(blogUrlFolder, { recursive: true });
}

// Generate the alternate link definitions in head for all 20 languages
function generateHreflangs(slug) {
  return LANGUAGES.map(l => {
    return `    <link rel="alternate" href="https://ariana-realestate.vercel.app/blog/${slug}-${l.code}.html" hreflang="${l.code}">`;
  }).join('\n');
}

// Run through each topic and compile the 20 files
let fileWrittenCount = 0;

TOPICS.forEach(topic => {
  LANGUAGES.forEach(lang => {
    const { title, desc, bullets } = getFallbackTextForLanguage(topic, lang.code);
    const dateFormatted = new Date('2026-06-10').toLocaleDateString(lang.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const localizedTitle = toLocalizedDigits(title, lang.locale);
    const localizedDesc = toLocalizedDigits(desc, lang.locale);
    
    const htmlContent = `<!DOCTYPE html>
<html lang="${lang.code}" dir="${lang.dir}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${localizedTitle} | Ariana Rahnuma SEO</title>
    <meta name="description" content="${localizedDesc}">
    <meta name="keywords" content="${topic.keywords}">
    <link rel="canonical" href="https://ariana-realestate.vercel.app/blog/${topic.slug}-${lang.code}.html">
${generateHreflangs(topic.slug)}
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,600;1,400&family=JetBrains+Mono:wght@400;700&display=swap');
        
        :root {
            --bg-color: #030712;
            --card-bg: #0b0f19;
            --text-color: #d1d5db;
            --title-color: #ffffff;
            --accent-color: #f59e0b;
            --border-color: #1f2937;
        }
        
        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.8;
            -webkit-font-smoothing: antialiased;
        }
        
        header {
            border-bottom: 1px solid var(--border-color);
            padding: 24px;
            background-color: rgba(3, 7, 18, 0.82);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 50;
        }

        .header-container {
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            color: white;
            text-decoration: none;
            font-weight: 800;
            letter-spacing: -0.5px;
        }

        .logo span {
            color: var(--accent-color);
        }
        
        main {
            max-width: 800px;
            margin: 48px auto;
            padding: 0 24px;
        }
        
        article {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 28px;
            padding: 48px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        
        h1 {
            font-family: 'Playfair Display', serif;
            font-size: 34px;
            color: var(--title-color);
            line-height: 1.25;
            margin-top: 0;
            margin-bottom: 16px;
            font-weight: 600;
            letter-spacing: -0.02em;
        }
        
        .publish-date {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 32px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 16px;
            display: inline-block;
        }
        
        .content {
            font-size: 15px;
            color: #9ca3af;
        }
        
        .bullets-list {
            margin: 24px 0;
            padding: 0;
            list-style-type: none;
        }
        
        .bullets-list li {
            position: relative;
            padding-left: 28px;
            margin-bottom: 18px;
            font-size: 14.5px;
            color: #d1d5db;
        }

        [dir="rtl"] .bullets-list li {
            padding-left: 0;
            padding-right: 28px;
        }
        
        .bullets-list li::before {
            content: "✓";
            color: var(--accent-color);
            font-weight: bold;
            position: absolute;
            left: 0;
        }

        [dir="rtl"] .bullets-list li::before {
            left: auto;
            right: 0;
        }
        
        .cta {
            margin-top: 48px;
            border-top: 1px solid var(--border-color);
            padding-top: 32px;
            text-align: center;
        }
        
        .cta a {
            display: inline-block;
            background-color: var(--accent-color);
            color: #000000;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 16px;
            font-weight: 800;
            font-size: 13px;
            transition: all 0.2s;
            box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.2);
        }
        
        .cta a:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(245, 158, 11, 0.3);
        }
        
        footer {
            text-align: center;
            padding: 48px 24px;
            font-size: 11px;
            color: #4b5563;
            border-top: 1px solid var(--border-color);
        }

        .language-switcher {
            max-width: 800px;
            margin: 32px auto;
            border: 1px dashed var(--border-color);
            padding: 18px;
            border-radius: 16px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }

        .lang-link {
            font-size: 10px;
            color: #9ca3af;
            text-decoration: none;
            background: #111827;
            padding: 4px 10px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            transition: all 0.15s;
        }

        .lang-link:hover {
            color: var(--accent-color);
            border-color: var(--accent-color);
        }
    </style>
</head>
<body>
    <header>
        <div class="header-container">
            <a href="https://ariana-realestate.vercel.app" class="logo">
                ARIANA <span>RAHNUMA</span>
            </a>
            <span style="font-size: 10px; color: #6b7280; font-family: monospace;">SEO CADASTRAL PRO</span>
        </div>
    </header>

    <main>
        <article>
            <h1>${localizedTitle}</h1>
            <p class="publish-date">${toLocalizedDigits(dateFormatted, lang.locale)}</p>
            
            <div class="content">
                <p style="font-size: 16px; color: #f3f4f6; font-weight: 500; margin-bottom: 24px;">
                    ${localizedDesc}
                </p>
                
                <ul class="bullets-list">
                    ${bullets.map(b => `<li>${toLocalizedDigits(b, lang.locale)}</li>`).join('\n')}
                </ul>
            </div>
            
            <div class="cta">
                <a href="https://ariana-realestate.vercel.app">🔗 ${lang.code === 'fa' || lang.code === 'prs' ? 'امتحان کنید: ابزار ارزشگذاری هوشمند رایگان' : (lang.code === 'ps' ? 'وپلټئ: د کادستر او هوښیار املاکو اوزار' : 'Try Free AI Property Valuation Tool')}</a>
            </div>
        </article>

        <div class="language-switcher">
            ${LANGUAGES.map(l => `<a href="${topic.slug}-${l.code}.html" class="lang-link">${l.name}</a>`).join('\n')}
        </div>
    </main>

    <footer>
        <p>© 2026 Ariana Rahnuma. All rights reserved. Secure Cloud-Powered SEO Matching.</p>
    </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(blogUrlFolder, `${topic.slug}-${lang.code}.html`), htmlContent);
    fileWrittenCount++;
  });
});

console.log(`Successfully generated ${fileWrittenCount} multilingual fully SEO-optimized HTML article pages in /public/blogdir!`);
