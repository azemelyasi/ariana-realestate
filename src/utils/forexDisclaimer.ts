import { Language } from "../types";

export function getForexDisclaimer(lang: Language): string {
  const disclaimers: Record<Language, string> = {
    fa: "⚠️ توجه مهم: این سامانه جهت محاسبات پایه کاداستر به نرخ‌های مرجع و رسمی بانک‌های مرکزی جهانی متصل است. اما از آنجا که نرخ ارز فیزیکی در بازار آزاد صرافی‌ها ممکن است تفاوت‌های جدی داشته باشد، جهت جلوگیری از هرگونه زیان مالی می‌توانید نرخ‌های واقعی را از پنل «تنظیم دستی نرخ تبدیل» در زیر ویرایش نمایید تا مقادیر دقیقاً بر اساس معامله آزاد شما شبیه‌سازی شوند.",
    
    en: "⚠️ Important Advisory: While this app retrieves official central bank reference rates for baseline comparisons, cash exchange rates in the parallel or free street market may vary. To protect against losses, you can manually customize or override individual rates in the setup panel below to align perfectly with your actual exchange deal.",
    
    tr: "⚠️ Önemli Uyarı: Bu sistem, temel karşılaştırmalar için resmi merkez bankası referans kurlarını kullanır; ancak serbest veya sokak piyasasındaki nakit döviz kurları farklılık gösterebilir. Kayıpları önlemek için, gerçek işlem oranlarınızla tam uyum sağlamak üzere aşağıdaki panelden kurları manuel olarak düzenleyebilirsiniz.",
    
    ar: "⚠️ تنبيه هام: يرتبط هذا النظام بأسعار الصرف المرجعية الرسمية للبنوك المركزية العالمية؛ ولكن نظراً لأن أسعار الصرف النقدية في السوق الحرة الموازية (الصرافة البديلة) قد تختلف بوضوح، يرجى تعديل الأسعار يدوياً في اللوحة أدناه لضمان دقة الحسابات بناءً على معاملتكم الفعلية وتجنب الخسارة.",
    
    de: "⚠️ Wichtiger Hinweis: Dieses System ist mit den offiziellen Referenzkursen der Zentralbanken verbunden. Da sich die tatsächlichen Bargeldkurse auf dem freien Parallelmarkt jedoch erheblich unterscheiden können, können Sie die Wechselkurse im folgenden Bereich manuell anpassen, um finanzielle Verluste zu vermeiden und reale Werte zu berechnen.",
    
    ja: "⚠️ 重要な注意：当クラスタは公式の中央銀行基準レートに接続されていますが、実際の民間・街頭両替（自由市場）のリアルタイム金利は変動することがあります。金銭的な不利益を避けるため、取引の実勢レートに合わせて、下記の設定パネルで自由に手動編集・修正を加えてご使用ください。",
    
    zh: "⚠️ 重要提示：本系统默认同步自全球央行官方基准汇率；但由于线下自由市场（或钱庄/黑市）的实际现金兑换汇率可能存在较大偏差，为防止您的资金蒙受损失，您随时可以在下方自定义手动修改并套用实际成交汇率来获取最符合预期的数字。",
    
    uz: "⚠️ Muhim eslatma: Ushbu tizim rasmiy markaziy banklarning ma'lumotlariga tayonadi; ammo erkin valyuta bozoridagi (parallel bozordagi) naqd kurslar farq qilishi mumkin. Moliyaviy yo'qotishlarning oldini olish uchun pastdagi sozlama paneli orqali kurslarni qo'lda o'zgartirishingiz mumkin.",
    
    ru: "⚠️ Важное примечание: Для базовых расчетов система использует официальные ориентиры центральных банков. Поскольку реальные наличные курсы на свободном параллельном рынке могут существенно отличаться, во избежание финансовых потерь вы можете вручную отредактировать курсы в панели ниже под свою фактическую сделку.",
    
    ku: "⚠️ ئاگاداری گرنگ: لە کاتێکدا ئەم سیستمە بەستراوەتەوە بە نرخە فەرمییەکانی بانکە ناوەندییە جیهانییەکان؛ بەڵام بەهۆی ئەوەی نرخی دراو لە بازاڕی ئازاد (نووسینگەکانی گۆڕینەوەی دراو) جیاوازە، بۆ ڕێگری لە هەر زیانێکی دارایی دەتوانن نرخەکان لە پانێڵی خوارەوە دەستکاری بکەن بەپێی کڕین و فرۆشتنی ڕاستەقینەتان.",
    
    ps: "⚠️ مهم خبرداری: دغه سیسټم د پرتلې لپاره د مرکزي بانکونو رسمي بهرني اسعار کاروي؛ خو څرنګه چې په خلاص او ازاد بازار کې د صرافۍ نرخونه توپیر لري، د مالي زیان مخنیوي لپاره تاسي کولی شئ په لاندې پینل کې نرخونه په لاسي ډول د خپلو اسعارو د معاملې سره سم عیار او بدل کړئ.",
    
    hi: "⚠️ महत्वपूर्ण सूचना: यह प्रणाली तुलना के लिए आधिकारिक केंद्रीय बैंकों की संदर्भ विनिमय दरों से जुड़ी है; लेकिन चूंकि व्यावहारिक मुक्त बाज़ार (कैश एक्सचेंज) दरों में भिन्नता हो सकती है, वित्तीय नुकसान से बचने के लिए आप नीचे दिए गए पैनल में वास्तविक व्यक्तिगत विनिमय दरों को मैन्युअल रूप से सेट और संशोधित कर सकते हैं।",
    
    ur: "⚠️ اہم معلوماتی نوٹ: یہ نظام موازنے کے لیے سرکاری مرکزی بینکوں کے آفیشل ریفرنس ریٹس سے منسلک ہے؛ تاہم چونکہ اوپن مارکیٹ یا متوازی مارکیٹ میں نقد شرح تبادلہ مختلف ہو سکتی ہے، کسی بھی مالی نقصان سے بچنے کے لیے آپ ذیل کے پینل میں دستی طور پر اپنی اصل ڈیل کے مطابق ریٹس لکھ کر تبدیل کر سکتے ہیں۔",
    
    sg: "⚠️ Important Advisory: reference rates is official but street money changers parallel rates can be different. Please check below custom panel to override your exact street rate to avoid loss.",
    
    fr: "⚠️ Avis important: Bien que le système affiche les taux officiels de référence des banques centrales, les taux de change physiques sur le marché libre (bureaux de change) peuvent varier. Pour éviter toute perte financière, vous pouvez saisir manuellement vos taux réels de transaction dans le panneau ci-dessous.",
    
    es: "⚠️ Aviso importante: Aunque este sistema utiliza los tipos de cambio oficiales de los bancos centrales como base, los tipos reales en el mercado libre de divisas pueden variar de forma significativa. Para evitar pérdidas, usted puede ingresar y configurar manualmente sus propios tipos reales en el panel de control inferior."
  };

  return disclaimers[lang] || disclaimers["en"];
}
