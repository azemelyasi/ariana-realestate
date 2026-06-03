import React, { useState } from "react";
import { Property, Language, SystemSettings } from "../types";
import { TRANSLATIONS, getTranslation } from "../i18n";
import { COUNTRIES } from "../data";
import { toLocalizedDigits } from "./LocalCalendar";

interface AddPropertyModalProps {
  lang: Language;
  onClose: () => void;
  onAddProperty: (property: Partial<Property>) => void;
  settings: SystemSettings;
  userRole?: "client" | "verified" | "admin";
}

const payTranslations: Record<Language, {
  limitAlert: string;
  limitDesc: string;
  invoiceTarget: string;
  feeTitle: string;
  feeValue: string;
  shaparakTab: string;
  cryptoTab: string;
  coinsTab: string;
  cardLabel: string;
  cvvLabel: string;
  cryptoTitle: string;
  cryptoDesc: string;
  coinDesc: string;
  payBtn: string;
  processingSecures: string;
  processingDigital: string;
  processingLedger: string;
  successTitle: string;
  successDesc: string;
  finishBtn: string;
  baseRegistrationFee: string;
  generalDiscount: string;
  promoDiscount: string;
  payableTotal: string;
  promocodeLabel: string;
  promocodePlaceholder: string;
  promocodeVerify: string;
  expirationDate: string;
  activeNetwork: string;
  secureCoinPay: string;
  backToEdit: string;
  adminFreePublish: string;
  adminBypassProcessing: string;
  processingTransaction: string;
  neighborhoodTypeable: string;
  neighborhoodPlaceholder: string;
  heatingOptional: string;
  heatingPlaceholder: string;
  kitchenOptional: string;
  kitchenPlaceholder: string;
  coolingOptional: string;
  coolingPlaceholder: string;
  deedOptional: string;
  deedPlaceholder: string;
  addressPlaceholder: string;
  propertyPhotos: string;
  browseGallery: string;
  coverPhoto: string;
  photo2: string;
  photo3: string;
  deviceGallery: string;
  orPasteUrl: string;
  currencyAED: string;
  cadastralBillingNode: string;
  promocodeSuccess: string;
  promocodeInvalid: string;
}> = {
  en: {
    limitAlert: "⚠️ Free listing allowance reached",
    limitDesc: "You have published your 2 free allowed publications. Additional cadastral registries require global certification invoice payment to assure node storage allocation.",
    invoiceTarget: "Cadastral Title:",
    feeTitle: "Registry Processing Fee:",
    feeValue: "250,000 Tomans (Equivalent to 5 USDT)",
    shaparakTab: "💳 Debit Card",
    cryptoTab: "🪙 Cryptocurrencies",
    coinsTab: "⚡ Premium Coins",
    cardLabel: "16-digit Card Number (Shetab):",
    cvvLabel: "CVV2 Security Code:",
    cryptoTitle: "Direct Deposit Transfer (USDT-TRC20):",
    cryptoDesc: "Please transfer exactly {USDT} USDT to the secure wallet address below to instantly initiate automatic network confirmation:",
    coinDesc: "Consume 1 Cadastral Coin directly (You currently have 4 Coins available in credit)",
    payBtn: "Simulate Transaction & Rent Cold-Storage",
    processingSecures: "Handshaking with international payment gateway tunnel...",
    processingDigital: "Confirming cryptographic node signatures on blockchain...",
    processingLedger: "Committing verified index key to Ariana Rahnuma ledger registry...",
    successTitle: "🎉 Payment Verified Successfully!",
    successDesc: "Your transaction has been written and verified. The property listing is now queued for immediate release.",
    finishBtn: "Complete & Publish",
    baseRegistrationFee: "Base Registration Fee:",
    generalDiscount: "Platform General Discount",
    promoDiscount: "Special Custom Promo",
    payableTotal: "Payable Total (Net):",
    promocodeLabel: "Insert Webmaster Promo Coupon",
    promocodePlaceholder: "e.g. AFG20",
    promocodeVerify: "Verify Code",
    expirationDate: "Expiration Date:",
    activeNetwork: "Active verification pathway: TRON (TRC20)",
    secureCoinPay: "Deduct Cadastral Tokens",
    backToEdit: "Back to Edit",
    adminFreePublish: "⭐ Admin Free Publish",
    adminBypassProcessing: "Manager Special Bypass... Auto-approving listing at zero cost",
    processingTransaction: "processing transaction payload...",
    neighborhoodTypeable: "Neighborhood / City (Typeable)",
    neighborhoodPlaceholder: "e.g. Ghazni, Herat, Berlin...",
    heatingOptional: "Heating System (Optional)",
    heatingPlaceholder: "e.g. Central Heating, Radiator",
    kitchenOptional: "Cabinets / Kitchen Style (Optional)",
    kitchenPlaceholder: "e.g. Modern MDF, High-gloss, Wood",
    coolingOptional: "Cooling System (Optional)",
    coolingPlaceholder: "e.g. 18000 Split, Evaporative Cooler",
    deedOptional: "Title Deed Status (Optional)",
    deedPlaceholder: "e.g. Single-sheet Registered Deed",
    addressPlaceholder: "e.g. Kabul, Dasht-e-Barchi between Street 2 and 3",
    propertyPhotos: "Property Photos (Max 3)",
    browseGallery: "Browse gallery",
    coverPhoto: "Cover Photo",
    photo2: "Photo 2 (Optional)",
    photo3: "Photo 3 (Optional)",
    deviceGallery: "Device Gallery",
    orPasteUrl: "Or paste web URL...",
    currencyAED: "AED",
    cadastralBillingNode: "Cadastral Billing Node",
    promocodeSuccess: "Promo code applied successfully!",
    promocodeInvalid: "Invalid or undefined promo code"
  },
  fa: {
    limitAlert: "⚠️ سقف مجاز رایگان تکمیل شده است",
    limitDesc: "شما قبلاً ۲ آگهی رایگان خود را ثبت کرده‌اید. فرآیند ثبت اسناد کاداستر اضافی مستلزم پرداخت هزینه صدور شناسنامه دیجیتال آریانا رهنما است.",
    invoiceTarget: "ملک کاداستر ثبت‌نامی:",
    feeTitle: "هزینه صدور شناسنامه دیجیتال:",
    feeValue: "۲۵۰,۰۰۰ تومان (معادل ۵ تتر رمزپایه)",
    shaparakTab: "💳 درگاه بانکی شتاب/کارت",
    cryptoTab: "🪙 رمزارزهای جهانی",
    coinsTab: "⚡ کوین کاداستر",
    cardLabel: "شماره ۱۶ رقمی کارت بانکی (شتاب):",
    cvvLabel: "رمز CVV2 آریانا رهنما:",
    cryptoTitle: "انتقال مستقیم درگاه رمزپایه (USDT-TRC20):",
    cryptoDesc: "لطفاً مبلغ دقیق {USDT} تتر (USDT) به ولت زیر واریز کنید تا با تایید تراکنش در بستر بلاک‌چین، ثبت نهایی شود:",
    coinDesc: "بروزرسانی مستقیم با کسر ۱ کوین کاداستر (هم‌اکنون دارای ۴ کوین هستید)",
    payBtn: "شبیه‌سازی تراکنش و صدور فوری سند کاداستر",
    processingSecures: "در حال برقراری ارتباط با درگاه شتاب شاپرک...",
    processingDigital: "در حال پردازش کلیدهای کاداستر کانون سردفتران...",
    processingLedger: "ثبت کد رهگیری در سیستم اسناد جهانی آریانا رهنما...",
    successTitle: "🎉 تراکنش صدور با موفقیت تایید شد!",
    successDesc: "پرداخت تایید گردید. سند کاداستر بصورت زنده ثبت شد و در درگاه مدیریت ملک فعال گردید.",
    finishBtn: "تایید نهایی و قرارگیری در صف انتشار",
    baseRegistrationFee: "مجموع تعرفه پایه ثبت:",
    generalDiscount: "تخفیف عمومی پلتفرم",
    promoDiscount: "تخفیف ویژه کادر فنی",
    payableTotal: "مبلغ نهایی با تخفیف:",
    promocodeLabel: "ثبت کد تخفیف اختصاصی مدیریت",
    promocodePlaceholder: "مثلا: MELK20",
    promocodeVerify: "بررسی و اعمال",
    expirationDate: "تاریخ انقضا:",
    activeNetwork: "شبکه فعال جهت تایید فوری: TRON (TRC20)",
    secureCoinPay: "پرداخت امن کاداستر کوین",
    backToEdit: "بازگشت و اصلاح",
    adminFreePublish: "⭐ ثبت رایگان مدیریت",
    adminBypassProcessing: "بای‌پاس ویژه مدیریت اصلی... تایید تراکنش با مبلغ صفر",
    processingTransaction: "پردازش سند پرداخت در شبکه...",
    neighborhoodTypeable: "محله یا شهر (قابل تایپ)",
    neighborhoodPlaceholder: "مثلا: غزنی، هرات، برلین ...",
    heatingOptional: "سیستم گرمایش ملک (اختیاری)",
    heatingPlaceholder: "مثلا: پکیج و رادیاتور، گرمایش مرکزی",
    kitchenOptional: "نوع کابینت و آشپزخانه (اختیاری)",
    kitchenPlaceholder: "مثلا: هایگلاس، ممبران، مدرن MDF",
    coolingOptional: "سیستم سرمایش ملک (اختیاری)",
    coolingPlaceholder: "مثلا: اسپلیت ۱۸ هزار، کولر آبی",
    deedOptional: "وضعیت سند ملک (اختیاری)",
    deedPlaceholder: "مثلا: سند تک‌برگ ثبتی",
    addressPlaceholder: "مثلا: کابل، دشت برچی مابین سرک ۲ و ۳",
    propertyPhotos: "تصاویر ملک (حداکثر ۳ تصویر)",
    browseGallery: "انتخاب مستقیم",
    coverPhoto: "تصویر اصلی",
    photo2: "تصویر دوم (اختیاری)",
    photo3: "تصویر سوم (اختیاری)",
    deviceGallery: "باز کردن گالری",
    orPasteUrl: "یا آدرس اینترنتی تصویر...",
    currencyAED: "درهم",
    cadastralBillingNode: "پرداخت تاییدیه کاداستر",
    promocodeSuccess: "کد تخفیف اعمال شد!",
    promocodeInvalid: "کد تخفیف نامعتبر یا تعریف‌نشده است"
  },
  tr: {
    limitAlert: "⚠️ Ücretsiz ilan sınırına ulaşıldı",
    limitDesc: "İzin verilen 2 ücretsiz ilanınızı yayınladınız. Ek kadastro kayıtları, depolama tahsisini garanti altına almak için doğrulanmış ödeme gerektirir.",
    invoiceTarget: "Kadastro Başlığı:",
    feeTitle: "Kayıt İşlem Ücreti:",
    feeValue: "250.000 Tümen (5 USDT Eşdeğeri)",
    shaparakTab: "💳 Banka Kartı",
    cryptoTab: "🪙 Kripto Para Birimleri",
    coinsTab: "⚡ Premium Jetonlar",
    cardLabel: "16 Haneli Kart Numarası:",
    cvvLabel: "CVV2 Güvenlik Kodu:",
    cryptoTitle: "Doğrudan Deposit Transferi (USDT-TRC20):",
    cryptoDesc: "Mühendislik ağ doğrulamasını başlatmak için lütfen aşağıdaki güvenli cüzdana tam olarak {USDT} USDT transfer edin:",
    coinDesc: "Doğrudan 1 Kadastro Jetonu tüketin (Şu anda hesabınızda 4 Jeton var)",
    payBtn: "İşlemi Simüle Et ve Alan Kirala",
    processingSecures: "Ödeme geçidi tüneli ile bağlantı kuruluyor...",
    processingDigital: "Blockchain üzerindeki kriptografik imzalar onaylanıyor...",
    processingLedger: "Doğrulanmış dizin anahtarı Ariana Rahnuma kaydına işleniyor...",
    successTitle: "🎉 Ödeme Başarıyla Doğrulandı!",
    successDesc: "İşleminiz blokzincirine kaydedildi ve doğrulandı. İlanınız yayınlanmak üzere sıraya alındı.",
    finishBtn: "Tamamla ve Yayınla",
    baseRegistrationFee: "Temel Kayıt Ücreti:",
    generalDiscount: "Platform Genel İndirimi",
    promoDiscount: "Özel Promosyon İndirimi",
    payableTotal: "Ödenecek Toplam (Net):",
    promocodeLabel: "Yönetici Promosyon Kuponunu Girin",
    promocodePlaceholder: "örn: AFG20",
    promocodeVerify: "Kodu Doğrula",
    expirationDate: "Son Kullanma Tarihi:",
    activeNetwork: "Aktif doğrulama yolu: TRON (TRC20)",
    secureCoinPay: "Kadastro Jetonu Düş",
    backToEdit: "Geri Dön ve Düzenle",
    adminFreePublish: "⭐ Yönetici Ücretsiz Yayınlama",
    adminBypassProcessing: "Yönetici Özel Bypass'ı... Sıfır maliyetle otomatik onaylama",
    processingTransaction: "Ödeme verisi ağda işleniyor...",
    neighborhoodTypeable: "Mahalle / Şehir (Yazılabilir)",
    neighborhoodPlaceholder: "Örn: Herat, Berlin, Gazni...",
    heatingOptional: "Isıtma Sistemi (İsteğe Bağlı)",
    heatingPlaceholder: "Örn: Kombi ve Radyatör, Merkezi Isıtma",
    kitchenOptional: "Mutfak Tipi / Dolap Seçenekleri (İsteğe Bağlı)",
    kitchenPlaceholder: "Örn: Membran, Modern MDF, Parlak Akrilik",
    coolingOptional: "Soğutma Sistemi (İsteğe Bağlı)",
    coolingPlaceholder: "Örn: Split Klima, Evaporatif Soğutucu",
    deedOptional: "Tapu Durumu (İsteğe Bağlı)",
    deedPlaceholder: "Örn: Tek Yaprak Resmi Tapu",
    addressPlaceholder: "Örn: Kabil, Dasht-e-Barchi, Sokak 2 ve 3 arası",
    propertyPhotos: "Mülk Fotoğrafları (En fazla 3)",
    browseGallery: "Galeriden Seç",
    coverPhoto: "Kapak Fotoğrafı",
    photo2: "İkinci Fotoğraf (İsteğe Bağlı)",
    photo3: "Üçüncü Fotoğraf (İsteğe Bağlı)",
    deviceGallery: "Cihaz Galerisi",
    orPasteUrl: "Veya web adresi yapıştırın...",
    currencyAED: "AED",
    cadastralBillingNode: "Kadastro Ödeme Düğümü",
    promocodeSuccess: "Promosyon kodu uygulandı!",
    promocodeInvalid: "Geçersiz promosyon kodu"
  },
  ar: {
    limitAlert: "⚠️ تم الوصول إلى الحد الأقصى للإعلانات المجانية",
    limitDesc: "لقد نشرت إعلانيين مجانيين. تتطلب سجلات الكاداستر الإضافية دفع رسوم الفاتورة لضمان حجز مساحة التخزين في الشبكة.",
    invoiceTarget: "عنوان الكاداستر للملكية:",
    feeTitle: "رسوم معالجة السجل العقاري:",
    feeValue: "٢٥٠,٠٠٠ تومان (ما يعادل ٥ تتر كربتو)",
    shaparakTab: "💳 بطاقة الدفع الإلكتروني",
    cryptoTab: "🪙 العملات الرقمية",
    coinsTab: "⚡ رموز كاداستر العقارية",
    cardLabel: "رقم البطاقة المكون من ١٦ رقماً:",
    cvvLabel: "رمز الأمان CVV2:",
    cryptoTitle: "التحويل المباشر لخدمة العملات الرقمية (USDT-TRC20):",
    cryptoDesc: "يرجى تحويل {USDT} USDT بدقة إلى عنوان المحفظة أدناه لبدء التحقق التلقائي للشبكة فوراً:",
    coinDesc: "استهلاك رمز كاداستر عقاري واحد مباشرة (لديك حالياً ٤ رموز في رصيدك)",
    payBtn: "محاكاة المعاملة والتخزين",
    processingSecures: "الاتصال ببوابة الدفع الدولية الآمنة...",
    processingDigital: "جاري تأكيد التوقيعات الرقمية للعقدة على البلوكشين...",
    processingLedger: "تسجيل مفتاح الفهرس المعتمد في دفاتر ملك‌بان...",
    successTitle: "🎉 تم التحقق من عملية الدفع بنجاح!",
    successDesc: "تمت كتابة وتأكيد معاملتك بنجاح. عقارك جاهز الآن للنشر الفوري.",
    finishBtn: "إكمال ونشر العقار",
    baseRegistrationFee: "رسوم التسجيل الأساسية:",
    generalDiscount: "خصم المنصة العام",
    promoDiscount: "الخصم الترويجي الخاص",
    payableTotal: "الإجمالي المستحق للدفع (صافي):",
    promocodeLabel: "أدخل رمز ترويج المسؤول",
    promocodePlaceholder: "مثال: MELK20",
    promocodeVerify: "التحقق من الرمز",
    expirationDate: "تاريخ الانتهاء:",
    activeNetwork: "مسار التحقق النشط: TRON (TRC20)",
    secureCoinPay: "خصم رموز الكاداستر",
    backToEdit: "العودة والتعديل",
    adminFreePublish: "⭐ نشر مجاني للمسؤول",
    adminBypassProcessing: "تجاوز خاص للمدير الرئيسي... موافقة تلقائية بتكلفة صفر",
    processingTransaction: "جاري معالجة حمولة المعاملة في الشبكة...",
    neighborhoodTypeable: "الحي / المدينة (قابل للكتابة)",
    neighborhoodPlaceholder: "مثال: غزنة، هرات، برلين...",
    heatingOptional: "نظام التدفئة (اختياري)",
    heatingPlaceholder: "مثال: التدفئة المركزية، المبرد",
    kitchenOptional: "تصميم المطبخ / الخزائن (اختياري)",
    kitchenPlaceholder: "مثال: خشب مميز، MDF حديث، لامع",
    coolingOptional: "نظام التبريد (اختياري)",
    coolingPlaceholder: "مثال: تكييف منفصل، مبرد تبخيري",
    deedOptional: "حالة سند الملكية (اختياري)",
    deedPlaceholder: "مثال: سند ملكية رسمي مسجل",
    addressPlaceholder: "مثال: كابل، دشت برچي بين شارع ٢ و ٣",
    propertyPhotos: "صور العقار (بحد أقصى ٣ صور)",
    browseGallery: "تصفح الاستوديو",
    coverPhoto: "الصورة الرئيسية",
    photo2: "الصورة الثانية (اختياري)",
    photo3: "الصورة الثالثة (اختياري)",
    deviceGallery: "معرض الصور للجهاز",
    orPasteUrl: "أو الصق رابط الصورة...",
    currencyAED: "درهم",
    cadastralBillingNode: "عقدة فوترة الكاداستر",
    promocodeSuccess: "تم تطبيق رمز التخفيض بنجاح!",
    promocodeInvalid: "رمز التخفيض غير صحيح أو غير محدد"
  },
  de: {
    limitAlert: "⚠️ Limit für kostenlose Anzeigen erreicht",
    limitDesc: "Sie haben Ihre 2 kostenlos zulässigen Veröffentlichungen aufgebraucht. Zusätzliche Katasterregistrierungen erfordern eine globale Zertifizierungsgebühr für die Speicherzuweisung.",
    invoiceTarget: "Katastertitel:",
    feeTitle: "Verarbeitungsgebühr des Registers:",
    feeValue: "250.000 Toman (entspricht 5 USDT)",
    shaparakTab: "💳 Debitkarte",
    cryptoTab: "🪙 Kryptowährungen",
    coinsTab: "⚡ Premium-Münzen",
    cardLabel: "16-stellige Kartennummer:",
    cvvLabel: "CVV2 Sicherheitscode:",
    cryptoTitle: "Direkte Einzahlung (USDT-TRC20):",
    cryptoDesc: "Bitte überweisen Sie genau {USDT} USDT an die folgende Wallet-Adresse, um die automatische Verifizierung zu starten:",
    coinDesc: "Direkt 1 Kataster-Münze verbrauchen (Sie haben derzeit 4 Münzen Guthaben)",
    payBtn: "Transaktion simulieren & Speicherplatz mieten",
    processingSecures: "Verbindung mit internationalem Zahlungsgateway-tunnel...",
    processingDigital: "Kryptografische Knotensignaturen auf Blockchain bestätigen...",
    processingLedger: "Verifizierter Indexschlüssel im Ariana Rahnuma-Register eintragen...",
    successTitle: "🎉 Zahlung erfolgreich verifiziert!",
    successDesc: "Ihre Transaktion wurde erfolgreich geschrieben. Die Immobilie ist nun zur Veröffentlichung bereit.",
    finishBtn: "Fertigstellen & Veröffentlichen",
    baseRegistrationFee: "Basis-Registrierungsgebühr:",
    generalDiscount: "Allgemeiner Plattformrabatt",
    promoDiscount: "Besondere Werbeaktion",
    payableTotal: "Zahlbarer Gesamtbetrag (Netto):",
    promocodeLabel: "Manager-Gutscheincode einfügen",
    promocodePlaceholder: "z.B. AFG20",
    promocodeVerify: "Code prüfen",
    expirationDate: "Ablaufdatum:",
    activeNetwork: "Aktiver Verifizierungsweg: TRON (TRC20)",
    secureCoinPay: "Katastertocken abziehen",
    backToEdit: "Zurück und Bearbeiten",
    adminFreePublish: "⭐ Admin Gratis-Veröffentlichung",
    adminBypassProcessing: "Spezielle Administrator-Bypass... Freigabe ohne Kosten",
    processingTransaction: "Verarbeitung der Transaktionsdaten im Netzwerk...",
    neighborhoodTypeable: "Stadtteil / Stadt (Eingabe möglich)",
    neighborhoodPlaceholder: "z.B. Ghazni, Herat, Berlin...",
    heatingOptional: "Heizsystem (Optional)",
    heatingPlaceholder: "z.B. Zentralheizung, Heizkörper",
    kitchenOptional: "Küchen- & Schrankstil (Optional)",
    kitchenPlaceholder: "z.B. Modernes MDF, Hochglanz, Massivholz",
    coolingOptional: "Kühlsystem (Optional)",
    coolingPlaceholder: "z.B. Split-Klimaanlage, Verdunstungskühler",
    deedOptional: "Grundbuch-Status (Optional)",
    deedPlaceholder: "z.B. Registrierte Grundbuchurkunde",
    addressPlaceholder: "z.B. Kabul, Dasht-e-Barchi zwischen Straße 2 und 3",
    propertyPhotos: "Immobilienfotos (Max. 3)",
    browseGallery: "Galerie durchsuchen",
    coverPhoto: "Titelbild",
    photo2: "Foto 2 (Optional)",
    photo3: "Foto 3 (Optional)",
    deviceGallery: "Gerätegalerie",
    orPasteUrl: "Oder Web-URL einfügen...",
    currencyAED: "AED",
    cadastralBillingNode: "Kataster-Zahlungsknoten",
    promocodeSuccess: "Rabattcode erfolgreich angewendet!",
    promocodeInvalid: "Ungültiger oder undefinierter Rabattcode"
  },
  ja: {
    limitAlert: "⚠️ 無料掲載制限に達しました",
    limitDesc: "無料掲載可能数の2枠を使い切りました。追加の地籍登録には、ノード容量を確保するためのグローバル認証料の支払いが必要です。",
    invoiceTarget: "地籍物件名:",
    feeTitle: "登録処理料:",
    feeValue: "250,000トマン（5 USDT相当）",
    shaparakTab: "💳 デビットカード",
    cryptoTab: "🪙 暗号資産",
    coinsTab: "⚡ 地籍プレミアムコイン",
    cardLabel: "16桁のカード番号:",
    cvvLabel: "CVV2 セキュリティコード:",
    cryptoTitle: "直接入金転送 (USDT-TRC20):",
    cryptoDesc: "自動確認をすぐに開始するために、以下のウォレットアドレスに正確に {USDT} USDTをご送金ください：",
    coinDesc: "地籍コインを1枚消費します（現在、ウォレットに4枚のコインがあります）",
    payBtn: "トランザクションをシミュレートしてノードを確保する",
    processingSecures: "国際決済ゲートウェイの安全なトンネルに接続中...",
    processingDigital: "ブロックチェーン上の暗号ノード署名を確認中...",
    processingLedger: "検証済みインデックスキーをAriana Rahnuma台帳に書き込み中...",
    successTitle: "🎉 支払いが正常に処理されました！",
    successDesc: "トランザクションの登録が完了しました。物件情報は掲載キューに追加されました。",
    finishBtn: "完了して公開",
    baseRegistrationFee: "基本登録料:",
    generalDiscount: "プラットフォーム一般割引",
    promoDiscount: "特別プロモーション割引",
    payableTotal: "支払総額（ネット）:",
    promocodeLabel: "管理者アカウント用プロモコード入力",
    promocodePlaceholder: "例: AFG20",
    promocodeVerify: "コードを確認",
    expirationDate: "有効期限:",
    activeNetwork: "有効な検証経路: TRON (TRC20)",
    secureCoinPay: "キャッシュコインを引き落とす",
    backToEdit: "戻って修正する",
    adminFreePublish: "⭐ 管理者無料公開",
    adminBypassProcessing: "管理者特別バイパス... 無料で即座に承認中",
    processingTransaction: "ネットワーク内で決済処理中...",
    neighborhoodTypeable: "エリア・都市名（入力可能）",
    neighborhoodPlaceholder: "例：ガズニ、ヘラート、ベルリン...",
    heatingOptional: "暖房設備（任意）",
    heatingPlaceholder: "例：セントラルヒーティング、ラジエーター",
    kitchenOptional: "キッチン・キャビネットスタイル（任意）",
    kitchenPlaceholder: "例：モダンMDF、鏡面仕上げ、木製キャビネット",
    coolingOptional: "冷房設備（任意）",
    coolingPlaceholder: "例：個別エアコン、気化式冷風機",
    deedOptional: "登記簿のステータス（任意）",
    deedPlaceholder: "例：単一シート登録権利書",
    addressPlaceholder: "例：カブール、ダシュテ・バルチ通り2と3の間",
    propertyPhotos: "物件写真（最大3枚）",
    browseGallery: "ファイル選択",
    coverPhoto: "カバー写真",
    photo2: "写真2（任意）",
    photo3: "写真3（任意）",
    deviceGallery: "ギャラリーから選択",
    orPasteUrl: "または画像のWeb URLを貼り付け...",
    currencyAED: "AED",
    cadastralBillingNode: "地籍決済ノード",
    promocodeSuccess: "プロモーションコードが適用されました！",
    promocodeInvalid: "無効なプロモーションコードです"
  },
  zh: {
    limitAlert: "⚠️ 已达到免费发布上限",
    limitDesc: "您已发布2个免费配额的房源。如需添加额外的地籍注册房源，需要支付全局验证发票，以确保节点空间分配。",
    invoiceTarget: "地籍产权名称:",
    feeTitle: "注册处理费:",
    feeValue: "250,000土曼（相当于5美金泰达币）",
    shaparakTab: "💳 借记卡",
    cryptoTab: "🪙 加密货币",
    coinsTab: "⚡ 地籍专属代币",
    cardLabel: "16位银行卡卡号:",
    cvvLabel: "CVV2 安全验证码:",
    cryptoTitle: "数字货币直接转账 (USDT-TRC20):",
    cryptoDesc: "请精确转账 {USDT} USDT 到以下安全钱包地址，以立即触发自动网络确认：",
    coinDesc: "直接扣除1个地籍代币（您的账户中现有余额4枚代币）",
    payBtn: "模拟交易并租用高防存储空间",
    processingSecures: "正在与国际化合规网络网关建立隧道...",
    processingDigital: "正在对区块链上的加密节点签名进行终审确认...",
    processingLedger: "正在将验证通过的指引索引键写入到Ariana Rahnuma全球产权数据库...",
    successTitle: "🎉 费用结算并验证成功！",
    successDesc: "您的交易数据已被持久化并被链上共识。此房源现在已转至全球待发布序列。",
    finishBtn: "完成并全球发布",
    baseRegistrationFee: "基础登记费用:",
    generalDiscount: "生态系统普遍折扣",
    promoDiscount: "专属促销优惠扣率",
    payableTotal: "应付总额 (净额):",
    promocodeLabel: "插入站长/技术专属优惠代码",
    promocodePlaceholder: "例如：AFG20",
    promocodeVerify: "验证代码",
    expirationDate: "到期时间:",
    activeNetwork: "生效结算通道：TRON (TRC20)",
    secureCoinPay: "抵扣数字代币",
    backToEdit: "返回编辑修改",
    adminFreePublish: "⭐ 站长免签免费发布",
    adminBypassProcessing: "管理员特权放行... 零费用秒级过审中",
    processingTransaction: "正在处理区块链及银行渠道网路交易负荷...",
    neighborhoodTypeable: "社区或城市名（可随意输入）",
    neighborhoodPlaceholder: "例如：赫拉特、柏林、加兹尼...",
    heatingOptional: "供暖系统（选填）",
    heatingPlaceholder: "例如：地暖、散热器、中央供暖",
    kitchenOptional: "橱柜及厨具风格（选填）",
    kitchenPlaceholder: "例如：吸塑面板、双饰面板、不锈钢现代厨房",
    coolingOptional: "避暑制冷系统（选填）",
    coolingPlaceholder: "例如：1.5匹分体式空调、冷风机",
    deedOptional: "地产权属凭证状态（选填）",
    deedPlaceholder: "例如：单页正式不动产权证书",
    addressPlaceholder: "例如：喀布尔，Dasht-e-Barchi社区第二和第三大道之间",
    propertyPhotos: "房源配图 (限3张以内)",
    browseGallery: "浏览并上传",
    coverPhoto: "主封面图",
    photo2: "副图二（可选）",
    photo3: "副图三（可选）",
    deviceGallery: "手机及设备相册",
    orPasteUrl: "或直接粘贴图片网络URL...",
    currencyAED: "迪拉姆(AED)",
    cadastralBillingNode: "地籍计费网关账单",
    promocodeSuccess: "促销代码应用成功！",
    promocodeInvalid: "无效或未定义的促销代码"
  },
  uz: {
    limitAlert: "⚠️ E'lonlar limiti tugadi",
    limitDesc: "Siz 2ta bepul e'lon berish imkoniyatidan foydingiz. Qo'shimcha kadastr ro'yxatlari uchun xotira ajratilishini kafolatlovchi to'lov talab etiladi.",
    invoiceTarget: "Kadastr ob'ekti:",
    feeTitle: "Ro'yxatdan o'tkazish to'lovi:",
    feeValue: "250 000 Tuman (5 USDT ekvivalentiga teng)",
    shaparakTab: "💳 Bank Kartasi",
    cryptoTab: "🪙 Kriptovalyutalar",
    coinsTab: "⚡ Premium Tangalar",
    cardLabel: "16-xonali Karta Raqami:",
    cvvLabel: "CVV2 Xavfsizlik Kodi:",
    cryptoTitle: "To'g'ridan-to'g'ri o'tkazma (USDT-TRC20):",
    cryptoDesc: "Avtomatik tarmoq tasdiqlashini boshlash uchun quyidagi hamyonga aniq {USDT} USDT o'tkazing:",
    coinDesc: "To'g'ridan-to'g'ri 1 ta Kadastr Tangasini sarflang (Hisobingizda 4 ta tanga mavjud)",
    payBtn: "To'lovni simulyatsiya qilish va joy ijaraga olish",
    processingSecures: "Xalqaro to'lov serveriga ulanmoqda...",
    processingDigital: "Blokcheyndagi kriptografik imzolar tasdiqlanmoqda...",
    processingLedger: "Tasdiqlangan kalit Ariana Rahnuma reestriga kiritilmoqda...",
    successTitle: "🎉 To'lov muvaffaqiyatli tasdiqlandi!",
    successDesc: "Tranzaktsiya tizimga yozildi. E'lon darhol chiqarish uchun navbatga qo'yildi.",
    finishBtn: "Tugallash va e'lon qilish",
    baseRegistrationFee: "Asosiy ro'yxatdan o'tish to'lovi:",
    generalDiscount: "Platforma umumiy chegirmasi",
    promoDiscount: "Maxsus reklama chegirmasi",
    payableTotal: "To'lanishi kerak bo'lgan jami:",
    promocodeLabel: "Ma'muriy promo-kodni kiriting",
    promocodePlaceholder: "Masalan: AFG20",
    promocodeVerify: "Kodni tekshirish",
    expirationDate: "Amal qilish muddati:",
    activeNetwork: "Xizmat qiluvchi tarmoq: TRON (TRC20)",
    secureCoinPay: "Kadastr tangalarini ushlab qolish",
    backToEdit: "Ortga qaytib tahrirlash",
    adminFreePublish: "⭐ Admin bepul e'lon berishi",
    adminBypassProcessing: "Administrator maxsus tizimi... To'lovsiz tasdiqlash",
    processingTransaction: "To'lov ma'lumotlari tarmoqda qayta ishlanmoqda...",
    neighborhoodTypeable: "Mahalla yoki shahar (yozilishi mumkin)",
    neighborhoodPlaceholder: "Masalan: Kobul, Berlin, Hirot...",
    heatingOptional: "Isitish tizimi (ixtiyoriy)",
    heatingPlaceholder: "Masalan: Kombi radiatori, markaziy isitish",
    kitchenOptional: "Oshxona mebeli va uslubi (ixtiyoriy)",
    kitchenPlaceholder: "Masalan: Model MDF, yaltiroq, massiv yog'och",
    coolingOptional: "Sovutish tizimi (ixtiyoriy)",
    coolingPlaceholder: "Masalan: Split konditsioner, sovitkich",
    deedOptional: "Kadastr hujjati holati (ixtiyoriy)",
    deedPlaceholder: "Masalan: Alohida rasmiy ro'yxatdan o'tgan hujjat",
    addressPlaceholder: "Masalan: Kobul, Dasht-e-Barchi, 2- va 3-ko'chalar oralig'i",
    propertyPhotos: "Mülk suratlari (maksimal 3 ta)",
    browseGallery: "Gallereyadan tanlash",
    coverPhoto: "Asosiy rasm",
    photo2: "Ikkinchi rasm (ixtiyoriy)",
    photo3: "Uchinchi rasm (ixtiyoriy)",
    deviceGallery: "Qurilma rasmlari",
    orPasteUrl: "Yoki rasmning internet manzilini qo'ying...",
    currencyAED: "AED",
    cadastralBillingNode: "Kadastr hisob-kitob filiali",
    promocodeSuccess: "Promo-kod muvaffaqiyatli qo'llanildi!",
    promocodeInvalid: "Yaroqsiz yoki noma'lum promo-kod"
  },
  ru: {
    limitAlert: "⚠️ Лимит бесплатных объявлений исчерпан",
    limitDesc: "Вы уже разместили 2 бесплатных объявления. Для добавления последующих кадастровых записей требуется выполнить платеж для обеспечения места на серверах.",
    invoiceTarget: "Кадастровый объект:",
    feeTitle: "Плата за обработку реестра:",
    feeValue: "250 000 туманов (эквивалент 5 USDT)",
    shaparakTab: "💳 Банковская карта",
    cryptoTab: "🪙 Криптовалюты",
    coinsTab: "⚡ Премиум коины",
    cardLabel: "16-значный номер карты:",
    cvvLabel: "CVV2 код безопасности:",
    cryptoTitle: "Прямой перевод криптовалюты (USDT-TRC20):",
    cryptoDesc: "Пожалуйста, переведите ровно {USDT} USDT на указанный ниже адрес кошелька для автоматического подтверждения в блокчейне:",
    coinDesc: "Списать 1 Кадастровый коин (на балансе вашего счета есть 4 коина)",
    payBtn: "Симулировать транзакцию и бронировать ноду",
    processingSecures: "Установка соединения со шлюзом платежей...",
    processingDigital: "Подтверждение криптографических подписей в блокчейне...",
    processingLedger: "Запись подтвержденного ключа в реестр Ariana Rahnuma...",
    successTitle: "🎉 Платеж успешно подтвержден!",
    successDesc: "Ваша транзакция успешно записана и заверена в цепочке блоков. Объявление добавлено в очередь на публикацию.",
    finishBtn: "Завершить и опубликовать",
    baseRegistrationFee: "Базовая плата за регистрацию:",
    generalDiscount: "Общая скидка платформы",
    promoDiscount: "Специальная скидка по акции",
    payableTotal: "К оплате (нетто):",
    promocodeLabel: "Ввод промокода администратора",
    promocodePlaceholder: "например: AFG20",
    promocodeVerify: "Проверить код",
    expirationDate: "Срок действия:",
    activeNetwork: "Активный способ проверки: TRON (TRC20)",
    secureCoinPay: "Списать кадастровые коины",
    backToEdit: "Вернуться и изменить",
    adminFreePublish: "⭐ Бесплатная публикация администратора",
    adminBypassProcessing: "Специальный обход для администратора... Авто-одобрение без затрат",
    processingTransaction: "Обработка платежа в электронной сети...",
    neighborhoodTypeable: "Район или город (вручную)",
    neighborhoodPlaceholder: "например: Кабул, Герат, Берлин...",
    heatingOptional: "Система отопления (опционально)",
    heatingPlaceholder: "например: котёл и радиаторы, центральное отопление",
    kitchenOptional: "Стиль кухни и шкафов (опционально)",
    kitchenPlaceholder: "например: хай-гласс, массив, современный МДФ",
    coolingOptional: "Система кондиционирования (опционально)",
    coolingPlaceholder: "например: сплит-система, испарительный кондиционер",
    deedOptional: "Статус собственности (опционально)",
    deedPlaceholder: "например: официальный кадастровый акт",
    addressPlaceholder: "например: Кабул, Дашт-е-Барчи между уличными путями 2 и 3",
    propertyPhotos: "Фото собственности (до 3 изображений)",
    browseGallery: "Выбрать из галереи",
    coverPhoto: "Главное фото",
    photo2: "Фото 2 (опционально)",
    photo3: "Фото 3 (опционально)",
    deviceGallery: "Галерея устройства",
    orPasteUrl: "Или вставьте интернет-ссылку на картинку...",
    currencyAED: "дирхам (AED)",
    cadastralBillingNode: "Узел выставления кадастрового счета",
    promocodeSuccess: "Промокод успешно применен!",
    promocodeInvalid: "Неверный или неопределенный промокод"
  },
  ku: {
    limitAlert: "⚠️ ڕێژەی بڵاوکردنەوەی بێ بەرامبەر تەواو بووە",
    limitDesc: "تۆ پێشتر هه‌ردوو ئاگاداری ڕێگەپێدراوی بێ بەرامبەرت تۆمار کردووە. تۆمارکردنی زیاتری کاداستر پێویستی بە دانی تێچووی بڵاوکردنەوەی ناسنامەی دیجیتاڵ هەیە تا شوێنی بۆ تەرخان بکرێت.",
    invoiceTarget: "موڵکی کاداستری تۆمارکراو:",
    feeTitle: "تێچووی نۆژەنکردنەوەی تۆمار:",
    feeValue: "٢٥٠,٠٠٠ تمەن (یەکسانە بە ٥ تەتەری کاداستر)",
    shaparakTab: "💳 دەروازەی بانکی شتاب/کارت",
    cryptoTab: "🪙 دراوە دیجیتاڵییە جیهانییەکان",
    coinsTab: "⚡ کۆینی کاداستری تایبەت",
    cardLabel: "ژمارەی ١٦ ڕەقەمی کارت:",
    cvvLabel: "کۆدی پاراستنی CVV2:",
    cryptoTitle: "گواستنەوەی ڕاستەوخۆی دراوی دیجیتاڵ (USDT-TRC20):",
    cryptoDesc: "تکایە بە تەواوی بڕی {USDT} USDT بنێرە بۆ ئەم جزدانە پارێزراوەی خوارەوە بۆ دەستپێکردنی دڵنیایی پێدانی ڕاستەوخۆ:",
    coinDesc: "کۆمەککردن بە لێبڕینی ١ کۆین کاداستر (لە ئێستادا ٤ کۆینی تەرخانکراوت هەیە)",
    payBtn: "شێوەسازی مامەڵە و تۆمارکردنی زوو",
    processingSecures: "پەیوەندیکردن لەگەڵ دەروازەی پارەدانی جیهانی...",
    processingDigital: "پەسەندکردنی واژۆ دیجیتاڵییەکان لەسەر بلۆکچەین...",
    processingLedger: "تۆمارکردنی کۆدی دڵنیایی لە سیستمەکانی مەلک‌بان...",
    successTitle: "🎉 پارەدانەکە بە سەرکەوتوویی جێبەجێ کرا!",
    successDesc: "پارەدانەکەت پشتڕاستکرایەوە. مۆڵەتەکە بۆ بڵاوکردنەوەی سەرەکی زوو ئامادەیە.",
    finishBtn: "تەواوکردن و بڵاوکردنەوە",
    baseRegistrationFee: "تێچووی بنەڕەتی تۆمارکردن:",
    generalDiscount: "داشکاندنی گشتی پلاتفۆرم",
    promoDiscount: "داشکاندنی کۆپۆنی تایبەت",
    payableTotal: "کۆی گشتی تێچووی کۆتایی:",
    promocodeLabel: "کۆپۆنی داشکاندنی تایبەتی بەڕێوبەر بنووسە",
    promocodePlaceholder: "بۆ نموونە: MELK20",
    promocodeVerify: "پەسەندکردنی کۆد",
    expirationDate: "ڕێکەوتی بەسەرچوون:",
    activeNetwork: "ڕێڕەوی چالاکی دڵنیایی: TRON (TRC20)",
    secureCoinPay: "لێبڕینی کۆینی کاداستر",
    backToEdit: "گەڕانەوە و چاککردن",
    adminFreePublish: "⭐ بڵاوکردنەوەی بێ بەرامبەری بەڕێوبەر",
    adminBypassProcessing: "بایپاسی تایبەتی بەڕێوبەر... بڵاوکردنەوە بە بێ تێچووی دارایی",
    processingTransaction: "چارەسەرکردنی داتاکانی پارەدان لە تۆڕدا...",
    neighborhoodTypeable: "گەڕەک یان شار (دەتوانیت بنووسیت)",
    neighborhoodPlaceholder: "بۆ نموونە: غزنی، هێرات، بەرلین...",
    heatingOptional: "سیستەمی گەرمکەرەوە (ئارەزوومەندانە)",
    heatingPlaceholder: "بۆ نموونە: پکیج ڕادێته‌ر، گەرمی ناوەندی",
    kitchenOptional: "جۆری کابینت و چێشتخانە (ئارەزوومەندانە)",
    kitchenPlaceholder: "بۆ نموونە: هایگلاس، دیزاینی مۆدێرن MDF",
    coolingOptional: "سیستەمی ساردکەرەوە (ئارەزوومەندانە)",
    coolingPlaceholder: "بۆ نموونە: سپلیت، فێنککەرەوەی ئاوی",
    deedOptional: "باری یاسایی سەنەد (ئارەزوومەندانە)",
    deedPlaceholder: "بۆ نموونە: سەنەدی فەرمی فەرمانگەکان",
    addressPlaceholder: "بۆ نموونە: کابول، دشت بەسەری نێوان شەقامی ٢ و ٣",
    propertyPhotos: "وێنەکانی موڵک (زۆرترین ٣ وێنە)",
    browseGallery: "دیاریکردنی وێنە",
    coverPhoto: "وێنەی سەرەکی",
    photo2: "وێنەی دووەم (ئارەزوومەندانە)",
    photo3: "وێنەی سێیەم (ئارەزوومەندانە)",
    deviceGallery: "گالێری ئامێرەکە",
    orPasteUrl: "یان بەستەری خێرای وێنەکە تۆمار بکە...",
    currencyAED: "درهەم",
    cadastralBillingNode: "سیستەمی پارەدانی کاداستر",
    promocodeSuccess: "کۆدی داشکاندن بە سەرکەوتوویی جێبەجێ کرا!",
    promocodeInvalid: "کۆدی داشکاندن نادروستە"
  },
  ps: {
    limitAlert: "⚠️ د وړیا خپرولو وروستی حد ته ورسېدئ",
    limitDesc: "تاسو دمخه خپل ۲ وړیا مجاز خپرونې کارولي دي. د اضافي ثبت لپاره د شبکې تخصیص تضمینولو باندی د لګښت تادیه کول لازم دي.",
    invoiceTarget: "د کاداستر د ملکیت عنوان:",
    feeTitle: "د ثبت پروسس لګښت:",
    feeValue: "۲۵۰،۰۰۰ تومنه (له ۵ تتر سره مساوي)",
    shaparakTab: "💳 بانکي ادرس/کارټ",
    cryptoTab: "🪙 ډیجیټل اسعار",
    coinsTab: "⚡ کاداستري کوین",
    cardLabel: "د کارټ ۱۶ رقمی شمیره:",
    cvvLabel: "د CVV2 امنیتي کوډ:",
    cryptoTitle: "مستقیم ډیجیټل انتقال (USDT-TRC20):",
    cryptoDesc: "مهرباني وکړئ لاندې خوندي والټ پتې ته دقیق {USDT} USDT انتقال کړئ ترڅو اتوماتیک تایید پیل شي:",
    coinDesc: "مستقیم یو کاداستری کوین غوڅ کړئ (اوس مهال تاسو ۴ کوین لری)",
    payBtn: "د مالي معاملي شبیه سازي کول",
    processingSecures: "له نړیوال مالي چینل سره د اړیکې راوستلو په هڅه کې...",
    processingDigital: "په بلاکچین باندې د ډیجیټل نودونو تایید کول...",
    processingLedger: "په آریانا رهنما سیسټم کې د تایید شوي ارقامو ثبتول...",
    successTitle: "🎉 تادیه په بریالیتوب سره تایید شوه!",
    successDesc: "ستاسو تادیه باوري شوه. د ملکیت اعلان د خپرولو په صف کې شامل شو.",
    finishBtn: "نهائي تایید او بېړنی خپرول",
    baseRegistrationFee: "د ثبت اساسي لګښت:",
    generalDiscount: "د پلاتفورم عمومي تخفیف",
    promoDiscount: "د کوډ ځانګړی د نندارې تخفیف",
    payableTotal: "وروستی تادیه کیدونکی قیمت:",
    promocodeLabel: "د مسوول ځانګړی تخفیف کوډ دننه کړئ",
    promocodePlaceholder: "مثلاً: MELK20",
    promocodeVerify: "کوډ درست کړئ",
    expirationDate: "د ختمیدو نیټه:",
    activeNetwork: "فعاله د تایید لاره: TRON (TRC20)",
    secureCoinPay: "د کاداستر سکه تایید کړه",
    backToEdit: "شا ته تګ او اصلاح کول",
    adminFreePublish: "⭐ د مدیر وړیا خپرول",
    adminBypassProcessing: "د لوړپوړي مدیر وړیا تایید کول د صفر قیمت سره",
    processingTransaction: "په شبکه کې د تادیې معلومات پروسس کیږي...",
    neighborhoodTypeable: "محله یا ښار (د لیکلو وړ)",
    neighborhoodPlaceholder: "مثلاً: کابل، هرات، برلین...",
    heatingOptional: "د ګرمۍ سیستم (اختیاري)",
    heatingPlaceholder: "مثلاً: پکیج او رادیاتور، مرکزي ګرمي",
    kitchenOptional: "د اشپزخانې سټایل (اختیاري)",
    kitchenPlaceholder: "مثلاً: عصري ایم ډي ایف، هایګلاس سټایل",
    coolingOptional: "د یخولو سیمټم (اختیاري)",
    coolingPlaceholder: "مثلاً: د اوبو پکه، سپلایټ کولر",
    deedOptional: "د رسمي سند وضعیت (اختیاري)",
    deedPlaceholder: "مثلاً: ثبتی او رسمي اسناد",
    addressPlaceholder: "مثلاً: کابل، دشت برچي د سړک ۲ او ۳ ترمنځ",
    propertyPhotos: "د ملکیت عکسونه (او تر ټولو ډیر ۳ عکسونه)",
    browseGallery: "عکسونه پورته کړئ",
    coverPhoto: "اصلي عکس",
    photo2: "دوهم عکس (اختیاري)",
    photo3: "دریم عکس (اختیاري)",
    deviceGallery: "د موبایل ګالري",
    orPasteUrl: "یا د وېب څخه د عکس ادرس ولیکئ...",
    currencyAED: "درهم",
    cadastralBillingNode: "د کاداستر تادیات پنل",
    promocodeSuccess: "تخفیف کوډ په بریالیتوب سره قبول شو!",
    promocodeInvalid: "تخفیف کوډ غلط یا نامعلوم دی"
  },
  hi: {
    limitAlert: "⚠️ मुफ़्त विज्ञापन देने की अंतिम सीमा समाप्त",
    limitDesc: "आप अपने 2 मुफ़्त विज्ञापन प्रकाशित कर चुके हैं। अतिरिक्त कमरों या संपत्तियों को पंजीकृत करने के लिए नेटवर्क शुल्क का भुगतान करना आवश्यक है।",
    invoiceTarget: "कैडस्ट्रल संपत्ति शीर्षक:",
    feeTitle: "पंजीकरण प्रसंस्करण शुल्क:",
    feeValue: "250,000 तोमन (5 USDT के बराबर)",
    shaparakTab: "💳 डेबिट कार्ड भुगतान",
    cryptoTab: "🪙 वैश्विक क्रिप्टोकरेंसी",
    coinsTab: "⚡ कैडस्ट्रल प्रीमियम कॉइन्स",
    cardLabel: "16-अंकीय बैंक कार्ड नंबर (Shetab):",
    cvvLabel: "CVV2 सुरक्षा पासवर्ड:",
    cryptoTitle: "डायरेक्ट क्रिप्टो ट्रांसफर (USDT-TRC20):",
    cryptoDesc: "स्वचालित सत्यापन तुरंत शुरू करने के लिए कृपया नीचे दिए गए सुरक्षित वॉलेट पते पर सटीक {USDT} USDT स्थानांतरित करें:",
    coinDesc: "सीधे 1 कैडस्ट्रल कॉइन का उपयोग करें (वर्तमान में आपके खाते में 4 कॉइन्स उपलब्ध हैं)",
    payBtn: "लेनदेन का अनुकरण करें और स्थान आरक्षित करें",
    processingSecures: "अंतरराष्ट्रीय सुरक्षित गेटवे से जुड़ रहे हैं...",
    processingDigital: "ब्लॉकचेन पर क्रिप्टोग्राफिक नोड हस्ताक्षर सत्यापित किए जा रहे हैं...",
    processingLedger: "सत्यापित लेनदेन को Ariana Rahnuma लेजर डेटाबेस में दर्ज किया जा रहा है...",
    successTitle: "🎉 भुगतान सफलतापूर्वक सत्यापित हो गया है!",
    successDesc: "आपका भुगतान मान्य हो गया है। आपका संपत्ति विज्ञापन तुरंत प्रकाशित होने के लिए तैयार है।",
    finishBtn: "अंतिम घोषणा पूरी और प्रकाशित करें",
    baseRegistrationFee: "मूल पंजीकरण शुल्क:",
    generalDiscount: "प्लेटफ़ॉर्म सामान्य छूट",
    promoDiscount: "विशेष प्रोमो छूट",
    payableTotal: "कुल देय राशि (शुद्ध):",
    promocodeLabel: "वेबमास्टर प्रोमो कोड दर्ज करें",
    promocodePlaceholder: "जैसे: AFG20",
    promocodeVerify: "कोड सत्यापित करें",
    expirationDate: "समाप्ति तिथि:",
    activeNetwork: "सक्रिय सत्यापन नेटवर्क: TRON (TRC20)",
    secureCoinPay: "कैडस्ट्रल कॉइन काटें",
    backToEdit: "वापस जाएं और संपादित करें",
    adminFreePublish: "⭐ एडमिन मुफ़्त प्रकाशन",
    adminBypassProcessing: "प्रशासक विशेष बाईपास... शून्य लागत पर स्वचालित अनुमोदन",
    processingTransaction: "नेटवर्क में भुगतान प्रक्रिया संसाधित की जा रही है...",
    neighborhoodTypeable: "पड़ोस या शहर (टाइप करने योग्य)",
    neighborhoodPlaceholder: "जैसे: हेरात, बर्लिन, गजनी...",
    heatingOptional: "हीटिंग系统 (वैकल्पिक)",
    heatingPlaceholder: "जैसे: केंद्रीय हीटिंग, रेडिएटर",
    kitchenOptional: "अलमारी / रसोई शैली (वैकल्पिक)",
    kitchenPlaceholder: "जैसे: आधुनिक MDF, हाई-ग्लोस, लकड़ी",
    coolingOptional: "कूलिंग सिस्टम (वैकल्पिक)",
    coolingPlaceholder: "जैसे: स्प्लिट एसी, इवापोरेटिव कूलर",
    deedOptional: "स्वामित्व विलेख की स्थिति (वैकल्पिक)",
    deedPlaceholder: "जैसे: आधिकारिक पंजीकृत स्वामित्व प्रमाण",
    addressPlaceholder: "जैसे: काबुल, दश्त-ए-बरची गली नंबर 2 और 3 के बीच",
    propertyPhotos: "संपत्ति की तस्वीरें (अधिकतम 3 तस्वीरें)",
    browseGallery: "फ़ाइल चुनें",
    coverPhoto: "मुख्य पृष्ठ फोटो",
    photo2: "दूसरी फोटो (वैकल्पिक)",
    photo3: "तीसरी फोटो (वैकल्पिक)",
    deviceGallery: "डिवाइस गैलरी",
    orPasteUrl: "या फोटो का इंटरनेट यूआरएल चिपकाएं...",
    currencyAED: "दिरहम (AED)",
    cadastralBillingNode: "कैडस्ट्रल बिलिंग गेटवे",
    promocodeSuccess: "प्रोमो कोड सफलतापूर्वक लागू किया गया!",
    promocodeInvalid: "अमान्य या अपरिभाषित प्रोमो कोड"
  },
  ur: {
    limitAlert: "⚠️ مفت اشتہار دینے کی حد ختم ہو گئی ہے",
    limitDesc: "آپ اپنے 2 مفت الاٹ کردہ اشتہارات شائع کر چکے ہیں۔ مزید کیڈسٹریل رجسٹریشنز کے لیے نیٹ ورک ادائیگی لازمی ہے تاکہ نوڈ کی گنجائش کو یقینی بنایا جا سکے۔",
    invoiceTarget: "کیڈسٹریل جائیداد کا عنوان:",
    feeTitle: "رجسٹریشن فیس:",
    feeValue: "250,000 تومان (5 USDT کے برابر)",
    shaparakTab: "💳 ڈیبٹ کارڈ ادائیگی",
    cryptoTab: "🪙 کرپٹو کرنسیز",
    coinsTab: "⚡ کیڈسٹریل کوائنز",
    cardLabel: "16-ہندسوں کا بینک کارڈ نمبر:",
    cvvLabel: "CVV2 سیکیورٹی کوڈ:",
    cryptoTitle: "براہ راست کرپٹو ٹرانسفر (USDT-TRC20):",
    cryptoDesc: "خودکار نیٹ ورک تصدیق کو فوری شروع کرنے کے لیے براہ کرم درج ذیل والٹ ایڈریس پر ٹھیک {USDT} USDT منتقل کریں:",
    coinDesc: "براہ راست 1 کیڈسٹریل کوائن استعمال کریں (آپ کے پاس 4 کوائنز موجود ہیں)",
    payBtn: "ادائیگی سمولیشن اور نوڈ بکنگ",
    processingSecures: "محفوظ عالمی گیٹ وے سے رابطہ قائم کیا جا رہا ہے...",
    processingDigital: "بلاک چین पर ڈیجیٹل نوڈ دستخطوں کی تصدیق کی جا رہی ہے...",
    processingLedger: "تصدیق شدہ معلومات کو Ariana Rahnuma فائل پیج پر درج کیا جا رہا ہے...",
    successTitle: "🎉 ادائیگی کی کامیابی سے تصدیق کر دی گئی ہے!",
    successDesc: "آپ کی ادائیگی درست تسلیم کی گئی ہے۔ جائیداد کا اشتہار شائع ہونے والی فہرست میں شامل ہو گیا ہے۔",
    finishBtn: "مکمل اور شائع کریں",
    baseRegistrationFee: "بنیادی رجسٹریشن فیس:",
    generalDiscount: "پلیٹ فارم عام ڈسکاؤنٹ",
    promoDiscount: "خصوصی پرومو ڈسکاؤنٹ",
    payableTotal: "کل قابل ادائیگی رقم (نیٹ):",
    promocodeLabel: "خصوصی پرومو کوپن کوڈ درج کریں",
    promocodePlaceholder: "مثلاً: AFG20",
    promocodeVerify: "کوڈ تصدیق کریں",
    expirationDate: "تاریخِ ختم شدگی:",
    activeNetwork: "فعال تصدیقی نیٹ ورک: TRON (TRC20)",
    secureCoinPay: "کیڈسٹریل ٹوکن منہا کریں",
    backToEdit: "واپس جائیں اور ترمیم کریں",
    adminFreePublish: "⭐ ایڈمن مفت پبلشنگ",
    adminBypassProcessing: "سینئر ایڈمن بائی پاس... صفر قیمت پر خودکار منظوری",
    processingTransaction: "نیٹ ورک میں ٹرانزیکشن پروسیس ہو رہی ہے...",
    neighborhoodTypeable: "محلہ یا شہر (لکھنے کے قابل)",
    neighborhoodPlaceholder: "مثلاً: غزنی، ہرات، برلین...",
    heatingOptional: "ہیٹنگ سسٹم (اختیاری)",
    heatingPlaceholder: "مثلاً: پیکیج اور ریڈی ایٹر، سینٹرل ہیٹنگ",
    kitchenOptional: "الماریوں کا انداز / کچن سائل (اختیاری)",
    kitchenPlaceholder: "مثلاً: ماڈرن MDF، ہائی گلوس، لکڑی",
    coolingOptional: "کولنگ سسٹم (اختیاری)",
    coolingPlaceholder: "مثلاً: سپلٹ اے سی، واٹر کولر",
    deedOptional: "رجسٹرڈ ملکیت کا درجہ (اختیاری)",
    deedPlaceholder: "مثلاً: باقاعدہ رجسٹرڈ ملکیت کا رقعہ",
    addressPlaceholder: "مثلاً: کابل، دشتِ برچی گلی نمبر 2 اور 3 کے درمیان",
    propertyPhotos: "جائیداد کی تصاویر (زیادہ سے زیادہ 3 तस्वीरें)",
    browseGallery: "فوٹوز منتخب کریں",
    coverPhoto: "مرکزی تصویر",
    photo2: "دوسری تصویر (اختیاری)",
    photo3: "تیسری تصویر (اختیاری)",
    deviceGallery: "ڈیوائس گیلری",
    orPasteUrl: "یا تصویر کا آن لائن ایڈریس درج کریں...",
    currencyAED: "درہم (AED)",
    cadastralBillingNode: "کیڈسٹریل ادائیگی گیٹ وے",
    promocodeSuccess: "پرومو کوڈ کامیابی سے لاگو ہو گیا ہے!",
    promocodeInvalid: "غلط یا غیر متعین پرومو کوڈ"
  }
};

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ lang, onClose, onAddProperty, settings, userRole }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRtl = ["fa", "ar", "ku", "ps", "ur"].includes(lang);

  const getT = (key: keyof typeof payTranslations.en) => {
    return (payTranslations[lang] || payTranslations.en)[key];
  };

  // Premium limits states
  const [userAddedCount, setUserAddedCount] = useState<number>(() => {
    const saved = localStorage.getItem("melkban_user_added_count");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [pendingProperty, setPendingProperty] = useState<Partial<Property> | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto" | "coins">("card");
  const [paymentStepIndex, setPaymentStepIndex] = useState<"idle" | "processing" | "success">("idle");
  const [paymentCardNum, setPaymentCardNum] = useState("6104-3379-8854-1240");
  const [paymentCardCVC, setPaymentCardCVC] = useState("458");
  const [loadingText, setLoadingText] = useState("");

  // Promo Code States
  const [userPromoInput, setUserPromoInput] = useState("");
  const [promoDiscountApplied, setPromoDiscountApplied] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Pre-calculate billing information globally inside the component
  const isUAE = pendingProperty?.country === "AE" || !pendingProperty?.country;
  const feeTypeOpt = settings?.feeType || "fixed";
  
  let rawBaseFee = 0; 
  let isLocalAEDUnit = isUAE; 
  
  if (feeTypeOpt === "percentage") {
    if (isUAE) {
      const propPrice = pendingProperty?.totalPrice || 
                       (pendingProperty?.pricePerSqm ? pendingProperty.pricePerSqm * (pendingProperty?.area || 120) : 0) || 
                       (pendingProperty?.rent ? pendingProperty.rent * 12 : 0) || 
                       1500000;
      const pct = settings?.feeRatePct !== undefined ? settings.feeRatePct : 0.05;
      const calculated = Math.round(propPrice * (pct / 100));
      rawBaseFee = Math.max(10, Math.min(5000, calculated));
    } else {
      const propPrice = pendingProperty?.totalPrice || 
                       (pendingProperty?.pricePerSqm ? pendingProperty.pricePerSqm * (pendingProperty?.area || 120) : 0) || 
                       (pendingProperty?.rent ? pendingProperty.rent * 12 : 0) || 
                       500000;
      const pct = settings?.feeRatePct !== undefined ? settings.feeRatePct : 0.05;
      const calculated = propPrice * (pct / 100);
      rawBaseFee = Math.max(1, Math.min(100, Math.round(calculated * 10) / 10));
    }
  } else {
    if (isUAE) {
      rawBaseFee = settings?.listingFeePrice !== undefined ? settings.listingFeePrice : 18;
    } else {
      rawBaseFee = settings?.listingFeeUSDT !== undefined ? settings.listingFeeUSDT : 5;
    }
  }

  const globalDiscountPct = settings?.globalDiscountPct || 0;
  const globalDiscountAmount = Math.round(rawBaseFee * (globalDiscountPct / 100) * 100) / 100;
  
  const promoDiscountPct = promoDiscountApplied;
  const promoDiscountAmount = Math.round(rawBaseFee * (promoDiscountPct / 100) * 100) / 100;
  
  const totalSavings = globalDiscountAmount + promoDiscountAmount;
  const finalFee = Math.max(0, rawBaseFee - totalSavings);

  let usdtEquivalent = "0";
  let localAEDEquivalent = "0";
  if (isLocalAEDUnit) {
    usdtEquivalent = (finalFee / 3.67).toFixed(1);
    localAEDEquivalent = Math.round(finalFee).toLocaleString();
  } else {
    usdtEquivalent = finalFee.toString();
    localAEDEquivalent = Math.round(finalFee * 3.67).toLocaleString();
  }

  const handleApplyPromoCode = () => {
    if (!userPromoInput.trim()) return;
    const enteredCode = userPromoInput.trim().toUpperCase();
    const rawTarget = (settings?.promoCode || "MELK20").trim().toUpperCase();
    
    // Supports multiple codes separated by commas like "MELK20, AFG0:0, SPECIAL100:100"
    const codesList = rawTarget.split(",").map(item => item.trim());
    
    let matched = false;
    let discount = settings?.promoDiscountPct !== undefined ? settings.promoDiscountPct : 20;

    for (const codeItem of codesList) {
      if (codeItem.includes(":")) {
        const [cName, cPct] = codeItem.split(":");
        if (cName.trim() === enteredCode) {
          discount = parseInt(cPct.trim(), 10);
          if (isNaN(discount)) discount = 0;
          matched = true;
          break;
        }
      } else {
        if (codeItem === enteredCode) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      setPromoDiscountApplied(discount);
      const successBase = getT("promocodeSuccess");
      const localPct = toLocalizedDigits(discount.toString(), lang);
      const isFarsish = ["fa", "ar", "ku", "ps", "ur"].includes(lang);
      const suffix = isFarsish ? ` ${localPct}٪ تخفیف اضافه.` : ` Extra ${discount}% off.`;
      setPromoSuccess(`${successBase}${suffix}`);
      setPromoError("");
    } else {
      setPromoDiscountApplied(0);
      setPromoError(getT("promocodeInvalid"));
      setPromoSuccess("");
    }
  };

  // Form states
  const [country, setCountry] = useState("AE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"sale" | "rent">("sale");
  const [pricePerSqm, setPricePerSqm] = useState("");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [area, setArea] = useState("120");
  const [bedrooms, setBedrooms] = useState(2);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [heating, setHeating] = useState("");
  const [cabinets, setCabinets] = useState("");
  const [cooling, setCooling] = useState("");
  const [deed, setDeed] = useState("");
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");

  const activeCountry = COUNTRIES.find((cnt) => cnt.code === country) || COUNTRIES[0];
  const [district, setDistrict] = useState(activeCountry.districts[0]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setCountry(code);
    const cnt = COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
    setDistrict(cnt.districts[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !phone.trim() || !area.trim()) return;

    const parsedArea = parseFloat(area) || 120;
    const parsedPricePerSqm = pricePerSqm ? parseFloat(pricePerSqm) : undefined;
    const calculatedTotal = parsedPricePerSqm ? parsedPricePerSqm * parsedArea : undefined;

    // Use a random center coordinate for this listing based on country
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;

    const imgList: string[] = [];
    if (imageUrl1.trim()) imgList.push(imageUrl1.trim());
    if (imageUrl2.trim()) imgList.push(imageUrl2.trim());
    if (imageUrl3.trim()) imgList.push(imageUrl3.trim());

    if (imgList.length === 0) {
      // placeholder images fallback
      imgList.push(
        [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a5c?w=600&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=60"
        ][Math.floor(Math.random() * 2)]
      );
    }

    const newProp: Partial<Property> = {
      title,
      description: description || "Special luxury property with excellent cadastral scoring.",
      type,
      pricePerSqm: parsedPricePerSqm,
      totalPrice: calculatedTotal,
      rent: rent ? parseFloat(rent) : undefined,
      deposit: deposit ? parseFloat(deposit) : undefined,
      area: parsedArea,
      country,
      district,
      bedrooms,
      phone,
      address: address || `${district}`,
      latitude: activeCountry.center.lat + latOffset,
      longitude: activeCountry.center.lng + lngOffset,
      images: imgList,
      heating: heating.trim() || undefined,
      cabinets: cabinets.trim() || undefined,
      cooling: cooling.trim() || undefined,
      deed: deed.trim() || undefined,
    };

    const freeLimit = settings?.freeListingsLimit !== undefined ? settings.freeListingsLimit : 1;

    if (userAddedCount < freeLimit) {
      const nextCount = userAddedCount + 1;
      setUserAddedCount(nextCount);
      localStorage.setItem("melkban_user_added_count", String(nextCount));
      onAddProperty(newProp);
    } else {
      setPendingProperty(newProp);
      setShowPaymentStep(true);
    }
  };

  const handleSimulatePayment = () => {
    if (!pendingProperty) return;
    setPaymentStepIndex("processing");
    
    const steps = [
      getT("processingSecures"),
      getT("processingDigital"),
      getT("processingLedger")
    ];

    setLoadingText(steps[0]);

    setTimeout(() => {
      setLoadingText(steps[1]);
      setTimeout(() => {
        setLoadingText(steps[2]);
        setTimeout(() => {
          setPaymentStepIndex("success");
          const nextCount = userAddedCount + 1;
          setUserAddedCount(nextCount);
          localStorage.setItem("melkban_user_added_count", String(nextCount));
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const handleFinalPublish = () => {
    if (pendingProperty) {
      onAddProperty(pendingProperty);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in" id="add-listings-backdrop">
      <div className={`w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] ${isRtl ? "rtl text-right" : "ltr text-left"}`}>
        {/* Header bar */}
        <div className="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-950/40">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>📝</span> {showPaymentStep ? getT("cadastralBillingNode") : t.btnPost}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 bg-slate-850 hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {showPaymentStep ? (
          <div className="overflow-y-auto p-6 space-y-5 flex-1 text-xs text-slate-300 animate-fade-in" id="listings-payment-panel">
            {/* Limit notification badge */}
            <div className="p-4 bg-amber-950/25 border border-amber-900/35 rounded-2xl space-y-1">
              <span className="text-amber-400 font-extrabold text-xs uppercase block font-mono">
                {getT("limitAlert")}
              </span>
              <p className="text-[11px] text-amber-300/90 leading-relaxed font-semibold">
                {getT("limitDesc")}
              </p>
            </div>

            {paymentStepIndex === "idle" && (
              <div className="space-y-4">
                {/* Micro Invoice Desk */}
                <div className="p-4.5 bg-slate-950/80 border border-slate-850 rounded-2xl space-y-2.5">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-900">
                    <span className="text-slate-400 font-bold">{getT("invoiceTarget")}</span>
                    <span className="text-slate-100 font-bold text-right max-w-[65%] truncate">{pendingProperty?.title}</span>
                  </div>

                  {/* Base Fee */}
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">
                      {getT("baseRegistrationFee")}
                      {feeTypeOpt === "percentage" && (
                        <span className="text-[10px] text-slate-500 font-mono ml-1">
                          ({settings?.feeRatePct}%)
                        </span>
                      )}
                    </span>
                    <span className="text-slate-300 font-bold font-mono">
                      {isLocalAEDUnit ? (
                        <>
                          {toLocalizedDigits(Math.round(rawBaseFee).toLocaleString(), lang)} {getT("currencyAED")}
                        </>
                      ) : (
                        <>
                          {toLocalizedDigits(rawBaseFee.toString(), lang)} USDT
                        </>
                      )}
                    </span>
                  </div>

                  {/* Global Admin Discount */}
                  {globalDiscountPct > 0 && (
                    <div className="flex justify-between items-center text-[11px] text-indigo-400">
                      <span>🎁 {getT("generalDiscount")} ({toLocalizedDigits(globalDiscountPct.toString(), lang)}%):</span>
                      <span className="font-bold font-mono">
                        -{isLocalAEDUnit ? (
                          <>
                            {toLocalizedDigits(Math.round(globalDiscountAmount).toLocaleString(), lang)} {getT("currencyAED")}
                          </>
                        ) : (
                          <>
                            {toLocalizedDigits(globalDiscountAmount.toString(), lang)} USDT
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Promo Code Discount */}
                  {promoDiscountPct > 0 && (
                    <div className="flex justify-between items-center text-[11px] text-emerald-400">
                      <span>★ {getT("promoDiscount")} ({toLocalizedDigits(promoDiscountPct.toString(), lang)}%):</span>
                      <span className="font-bold font-mono">
                        -{isLocalAEDUnit ? (
                          <>
                            {toLocalizedDigits(Math.round(promoDiscountAmount).toLocaleString(), lang)} {getT("currencyAED")}
                          </>
                        ) : (
                          <>
                            {toLocalizedDigits(promoDiscountAmount.toString(), lang)} USDT
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Final Net Invoice */}
                  <div className="flex justify-between items-center pt-2.5 border-t border-slate-900">
                    <span className="text-slate-200 font-bold text-xs">{getT("payableTotal")}</span>
                    <div className="text-right">
                      <span className="text-emerald-400 font-black text-sm font-mono block">
                        {isLocalAEDUnit ? (
                          <>
                            {toLocalizedDigits(Math.round(finalFee).toLocaleString(), lang)} {getT("currencyAED")}
                          </>
                        ) : (
                          <>
                            {toLocalizedDigits(finalFee.toString(), lang)} USDT
                          </>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {isLocalAEDUnit ? (
                          <>≈ {toLocalizedDigits(usdtEquivalent, lang)} USDT</>
                        ) : (
                          <>≈ {toLocalizedDigits(localAEDEquivalent, lang)} {getT("currencyAED")}</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Input Section */}
                <div className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    🎫 {getT("promocodeLabel")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={getT("promocodePlaceholder")}
                      className="bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono font-bold flex-1 focus:outline-none"
                      value={userPromoInput}
                      onChange={(e) => setUserPromoInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromoCode}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95 transition shrink-0"
                    >
                      {getT("promocodeVerify")}
                    </button>
                  </div>
                  {promoError && <p className="text-[10px] text-rose-450 font-bold font-mono">{promoError}</p>}
                  {promoSuccess && <p className="text-[10px] text-emerald-400 font-extrabold">{promoSuccess}</p>}
                </div>

                {/* Sub Tab selection */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 shrink-0 font-bold text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${paymentMethod === "card" ? "bg-indigo-650 text-white shadow shadow-indigo-600/10" : "text-slate-450 hover:text-white hover:bg-slate-900/40"}`}
                  >
                    {getT("shaparakTab")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("crypto")}
                    className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${paymentMethod === "crypto" ? "bg-indigo-650 text-white shadow shadow-indigo-600/10" : "text-slate-450 hover:text-white hover:bg-slate-900/40"}`}
                  >
                    {getT("cryptoTab")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("coins")}
                    className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${paymentMethod === "coins" ? "bg-indigo-650 text-white shadow shadow-indigo-600/10" : "text-slate-450 hover:text-white hover:bg-slate-900/40"}`}
                  >
                    {getT("coinsTab")}
                  </button>
                </div>

                {/* Sub tabs elements rendering */}
                {paymentMethod === "card" && (
                  <div className="space-y-3.5 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl animate-fade-in">
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-bold">
                        {getT("cardLabel")}
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-mono font-black text-sm tracking-wider text-center focus:outline-none"
                        value={paymentCardNum}
                        onChange={(e) => setPaymentCardNum(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1.5 font-bold">
                          {getT("expirationDate")}
                        </label>
                        <input
                          type="text"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-center"
                          value="1410 / 08"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1.5 font-bold">
                          {getT("cvvLabel")}
                        </label>
                        <input
                          type="password"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-center tracking-widest focus:outline-none"
                          value={paymentCardCVC}
                          onChange={(e) => setPaymentCardCVC(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "crypto" && (
                  <div className="space-y-3 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl animate-fade-in text-slate-300">
                    <span className="text-xs font-black block text-indigo-400">
                      {getT("cryptoTitle")}
                    </span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      {getT("cryptoDesc").replace("{USDT}", toLocalizedDigits(usdtEquivalent, lang))}
                    </p>

                    <div className="flex gap-2 items-center bg-slate-950 p-2 border border-slate-900 rounded-xl">
                      <span className="font-mono text-[9.5px] text-slate-400 select-all truncate flex-1 md:text-xs">
                        {settings?.tetherWalletAddress || "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD"}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(settings?.tetherWalletAddress || "TR7NHqdjwmJZGZ86HnEpv842bC78e146vD")}
                        className="px-2.5 py-1 bg-slate-850 hover:bg-slate-800 text-slate-350 text-[10px] rounded-lg cursor-pointer transition active:scale-95 shrink-0"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5 bg-indigo-950/15 p-2.5 border border-indigo-900/10 rounded-xl text-[10px] text-indigo-300 leading-normal font-semibold">
                      <span>💡</span>
                      <span>{getT("activeNetwork")}</span>
                    </div>
                  </div>
                )}

                {paymentMethod === "coins" && (
                  <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl flex items-center gap-3 animate-fade-in">
                    <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-lg">
                      🪙
                    </div>
                    <div>
                      <p className="text-slate-200 font-extrabold block">{getT("secureCoinPay")}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                        {getT("coinDesc")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submits buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3.5 border-t border-slate-850/60 font-semibold justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentStep(false);
                      setPaymentStepIndex("idle");
                    }}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-2xl text-xs transition cursor-pointer"
                  >
                    {getT("backToEdit")}
                  </button>
                  {userRole === "admin" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!pendingProperty) return;
                        setPaymentStepIndex("processing");
                        setLoadingText(getT("adminBypassProcessing"));
                        setTimeout(() => {
                          setPaymentStepIndex("success");
                        }, 800);
                      }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl text-[11px] transition cursor-pointer shadow-lg shadow-emerald-600/20 active:scale-95 text-center"
                    >
                      {getT("adminFreePublish")}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition cursor-pointer shadow-lg shadow-indigo-600/10"
                  >
                    {getT("payBtn")}
                  </button>
                </div>
              </div>
            )}

            {paymentStepIndex === "processing" && (
              <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-fade-in text-center">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <span className="flex h-12 w-12 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent animate-spin"></span>
                  </span>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] tracking-widest text-indigo-400 font-black uppercase font-mono block">
                    {getT("processingTransaction")}
                  </span>
                  <p className="text-xs font-bold text-slate-200 animate-pulse">
                    {loadingText}
                  </p>
                </div>
              </div>
            )}

            {paymentStepIndex === "success" && (
              <div className="py-8 flex flex-col items-center justify-center space-y-5 animate-fade-in text-center">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center text-emerald-400 text-2xl shadow-lg shadow-emerald-500/10">
                  ✓
                </div>
                
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="text-sm font-black text-white">
                    {getT("successTitle")}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed font-semibold">
                    {getT("successDesc")}
                  </p>
                </div>

                <div className="w-full pt-4 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={handleFinalPublish}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white rounded-xl shadow-lg shadow-emerald-600/10 cursor-pointer transition active:scale-[0.99]"
                  >
                    {getT("finishBtn")}
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* Scrollable contents form */
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1 text-xs text-slate-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Country target */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">{t.labelCountry}</label>
                <select
                  value={country}
                  onChange={handleCountryChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:ring-2 focus:ring-indigo-500 font-mono text-xs cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {lang === "fa" ? c.nameFa : c.nameEn} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>

              {/* Neighborhood / district */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  {getT("neighborhoodTypeable")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    list="districts-suggestions"
                    placeholder={getT("neighborhoodPlaceholder")}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                  />
                  <datalist id="districts-suggestions">
                    {activeCountry && activeCountry.districts && activeCountry.districts.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t.labelTitle} <span className="text-indigo-400">*</span></label>
              <input
                type="text"
                required
                placeholder={isRtl ? "مثال: پنت‌هوس لوکس دوپلکس با دید پانورامیک دریا" : "e.g. Modern duplex penthouse with panoramic window views"}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t.labelDescription}</label>
              <textarea
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 text-xs min-h-[60px] focus:outline-none"
                placeholder={isRtl ? "توضیحات و امکانات کلی ملک را وارد کنید..." : "Provide extra specifications and property highlights..."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Deal Type */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">{t.labelType}</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "sale" | "rent")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:ring-2 focus:ring-indigo-500 text-xs"
                >
                  <option value="sale">💎 {getTranslation(lang, "typeSale", "Purchase & Sale")}</option>
                  <option value="rent">🔑 {getTranslation(lang, "typeRent", "Rental / Lease")}</option>
                </select>
              </div>

              {/* Area Size */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">{t.labelArea} <span className="text-indigo-400">*</span></label>
                <input
                  type="number"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pricing inputs */}
              {type === "sale" ? (
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    {t.labelPriceSqm} ({activeCountry.currency}) <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 8500"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                    value={pricePerSqm}
                    onChange={(e) => setPricePerSqm(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      {t.labelDeposit} ({activeCountry.currency})
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      {t.labelRent} ({activeCountry.currency}) <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1500"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                      value={rent}
                      onChange={(e) => setRent(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bedrooms count */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">{t.labelBedrooms}</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 text-xs font-bold"
                >
                  <option value={0}>{getTranslation(lang, "typeStudio", "Studio")}</option>
                  <option value={1}>1 {getTranslation(lang, "typeBedsSingle", "Bedroom")}</option>
                  <option value={2}>2 {getTranslation(lang, "typeBedsPlural", "Bedrooms")}</option>
                  <option value={3}>3 {getTranslation(lang, "typeBedsPlural", "Bedrooms")}</option>
                  <option value={4}>4+ {getTranslation(lang, "typeBedsPluralPlus", "Bedrooms+")}</option>
                </select>
              </div>

              {/* Owner Phone number */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">{t.labelPhone} <span className="text-indigo-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder={activeCountry.code === "IR" ? "+98 9..." : activeCountry.code === "AE" ? "+971 ..." : "+1 ..."}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Heating */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  {getT("heatingOptional")}
                </label>
                <input
                  type="text"
                  placeholder={getT("heatingPlaceholder")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                  value={heating}
                  onChange={(e) => setHeating(e.target.value)}
                />
              </div>

              {/* Cabinets */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  {getT("kitchenOptional")}
                </label>
                <input
                  type="text"
                  placeholder={getT("kitchenPlaceholder")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                  value={cabinets}
                  onChange={(e) => setCabinets(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cooling */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  {getT("coolingOptional")}
                </label>
                <input
                  type="text"
                  placeholder={getT("coolingPlaceholder")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                  value={cooling}
                  onChange={(e) => setCooling(e.target.value)}
                />
              </div>

              {/* Deed / Legal Deed Status */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  {getT("deedOptional")}
                </label>
                <input
                  type="text"
                  placeholder={getT("deedPlaceholder")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                  value={deed}
                  onChange={(e) => setDeed(e.target.value)}
                />
              </div>
            </div>

            {/* Location Address specifications */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t.labelAddress}</label>
              <input
                type="text"
                placeholder={getT("addressPlaceholder")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 text-xs focus:outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Images Section with Local Gallery Access */}
            <div className="space-y-3 border-t border-slate-850 pt-3">
              <div className="flex items-center justify-between">
                <label className="block text-slate-350 font-bold text-xs">
                  🖼️ {getT("propertyPhotos")}
                </label>
                <span className="text-[10px] text-slate-500 font-semibold font-mono">
                  {getT("browseGallery")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 1, val: imageUrl1, setVal: setImageUrl1, label: getT("coverPhoto") },
                  { id: 2, val: imageUrl2, setVal: setImageUrl2, label: getT("photo2") },
                  { id: 3, val: imageUrl3, setVal: setImageUrl3, label: getT("photo3") }
                ].map((slot) => {
                  return (
                    <div key={slot.id} className="relative bg-slate-950/60 border border-slate-850 rounded-2xl p-2.5 flex flex-col justify-between min-h-[145px] group transition hover:border-slate-800">
                      <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide block mb-1.5 self-start">
                        {slot.label} {slot.id === 1 && <span className="text-indigo-400">*</span>}
                      </span>

                      {slot.val ? (
                        <div className="relative h-20 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                          <img 
                            src={slot.val} 
                            alt={`Upload Preview ${slot.id}`} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => slot.setVal("")}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/80 hover:bg-indigo-600 text-white text-[10px] rounded-full flex items-center justify-center transition cursor-pointer"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="h-20 w-full border-2 border-dashed border-slate-800 hover:border-indigo-500 hover:bg-indigo-950/10 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center group-hover:scale-[0.98]">
                          <span className="text-base">📷</span>
                          <span className="text-[9.5px] text-indigo-400 font-bold">
                            {getT("deviceGallery")}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === "string") {
                                    slot.setVal(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      )}

                      {/* Or URL Manual Input */}
                      <input
                        type="text"
                        placeholder={getT("orPasteUrl")}
                        className="w-full bg-slate-950/85 border border-slate-900 focus:border-slate-850 rounded-lg px-2 py-1 text-[9px] text-slate-300 font-mono focus:ring-1 focus:ring-indigo-500 placeholder-slate-700 mt-2"
                        value={slot.val.startsWith("data:") ? "" : slot.val}
                        onChange={(e) => slot.setVal(e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-850">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-755 text-slate-300 font-bold rounded-2xl text-xs transition cursor-pointer active:scale-95"
              >
                {t.btnCancel}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-2xl text-xs transition cursor-pointer active:scale-95 shadow-lg shadow-indigo-650/15"
              >
                {t.btnSubmit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
