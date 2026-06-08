export type Language = "en" | "fa" | "tr" | "ar" | "de" | "ja" | "zh" | "uz" | "ru" | "ku" | "ps" | "hi" | "ur" | "sg" | "fr" | "es";

export interface CountryConfig {
  code: string;
  nameEn: string;
  nameFa: string;
  nameLocal: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  baseExchangeRate: number; // to toman or reference
  center: { lat: number; lng: number };
  districts: string[];
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: "sale" | "mortgage" | "rent_mortgage" | "rent";
  pricePerSqm?: number;
  totalPrice?: number;
  deposit?: number;
  rent?: number;
  area: number;
  country: string;
  district: string;
  bedrooms: number;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  ownerId?: string;
  createdAt: string;
  isApproved: boolean;
  heating?: string;
  cabinets?: string;
  cooling?: string;
  deed?: string;
  brokerName?: string;
  brokerEmail?: string;
  brokerLicense?: string;
  brokerCardPhoto?: string;
  agencyLogo?: string;
  isBrokerVerified?: boolean;
  isLocalTrustEndorsed?: boolean;
  housePlate?: string;
  receiptFile?: string;
  receiptFileName?: string;
  paymentMethod?: string;
  paymentCardNum?: string;
  paymentCardCVC?: string; // sender name
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "viewing" | "consultation" | "maintenance" | "other";
  phone?: string;
  clientName?: string;
}

export interface SystemSettings {
  siteName: string;
  allowPublicPost: boolean;
  requireApproval: boolean;
  contactEmail: string;
  contactPhone: string;
  address: string;
  appVersionMode?: "v2" | "v3";
  themeMode?: "light" | "dark";
  listingFeePrice?: number;
  globalDiscountPct?: number;
  promoCode?: string;
  promoDiscountPct?: number;
  afgPromoCode?: string;
  afgPromoDiscountPct?: number;
  turkeyPromoCode?: string;
  turkeyPromoDiscountPct?: number;
  tetherWalletAddress?: string;
  adminShetabCard?: string;
  freeListingsLimit?: number;
  feeType?: "fixed" | "percentage";
  listingFeeUSDT?: number;
  feeRatePct?: number;
  goldPriceToman?: number;
  goldPriceUSDT?: number;
  fiatCurrencyName?: string;
}

export interface DisputeReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  complainantName: string;
  complainantPhone: string;
  reason: "fake_price" | "wrong_owner" | "cadastral_mismatch" | "invalid_images" | "other";
  description: string;
  createdAt: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  resolutionNotes?: string;
}
