import React, { useEffect, useRef, useState } from "react";
import { Language } from "../types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Navigation
} from "lucide-react";

const KABUL_DISTRICTS_DB = [
  {
    keys: ["وزیر", "wazir", "akbar", "اکبر"],
    display_name_fa: "وزیر اکبر خان، کابل، افغانستان",
    display_name_en: "Wazir Akbar Khan, Kabul, Afghanistan",
    lat: "34.5385",
    lon: "69.1861",
    suburb_fa: "وزیر اکبر خان",
    suburb_en: "Wazir Akbar Khan"
  },
  {
    keys: ["سخی", "saxi", "sakhi", "کارت سخی", "کارته سخی"],
    display_name_fa: "کارته سخی، کابل، افغانستان",
    display_name_en: "Kart-e Sakhi, Kabul, Afghanistan",
    lat: "34.5303",
    lon: "69.1415",
    suburb_fa: "کارته سخی",
    suburb_en: "Kart-e Sakhi"
  },
  {
    keys: ["برچی", "barchi", "دشت برچی", "دشتِ برچی"],
    display_name_fa: "دشت برچی، کابل، افغانستان",
    display_name_en: "Dasht-e Barchi, Kabul, Afghanistan",
    lat: "34.4984",
    lon: "69.0911",
    suburb_fa: "دشت برچی",
    suburb_en: "Dasht-e Barchi"
  },
  {
    keys: ["شیرپور", "sherpur", "شیر پور"],
    display_name_fa: "شیرپور، کابل، افغانستان",
    display_name_en: "Sherpur, Kabul, Afghanistan",
    lat: "34.5358",
    lon: "69.1764",
    suburb_fa: "شیرپور",
    suburb_en: "Sherpur"
  },
  {
    keys: ["خیر", "khair", "خیرخانه", "خیر خانه"],
    display_name_fa: "خیرخانه، کابل، افغانستان",
    display_name_en: "Khair Khana, Kabul, Afghanistan",
    lat: "34.5762",
    lon: "69.1491",
    suburb_fa: "خیرخانه",
    suburb_en: "Khair Khana"
  },
  {
    keys: ["مکروریان", "macrorayan", "ماکروریان", "مکروریانها", "مکروریان‌ها"],
    display_name_fa: "مکروریان، کابل، افغانستان",
    display_name_en: "Macrorayan, Kabul, Afghanistan",
    lat: "34.5312",
    lon: "69.1993",
    suburb_fa: "مکروریان",
    suburb_en: "Macrorayan"
  },
  {
    keys: ["کارته چهار", "karte char", "karte 4", "کارته ۴"],
    display_name_fa: "کارته چهار، کابل، افغانستان",
    display_name_en: "Kart-e Char, Kabul, Afghanistan",
    lat: "34.5126",
    lon: "69.1245",
    suburb_fa: "کارته چهار",
    suburb_en: "Kart-e Char"
  },
  {
    keys: ["کارته سه", "karte se", "karte 3", "کارته ۳"],
    display_name_fa: "کارته سه، کابل، افغانستان",
    display_name_en: "Kart-e Se, Kabul, Afghanistan",
    lat: "34.5152",
    lon: "69.1192",
    suburb_fa: "کارته سه",
    suburb_en: "Kart-e Se"
  },
  {
    keys: ["کارته پروان", "parwan", "پروان"],
    display_name_fa: "کارته پروان، کابل، افغانستان",
    display_name_en: "Kart-e Parwan, Kabul, Afghanistan",
    lat: "34.5422",
    lon: "69.1360",
    suburb_fa: "کارته پروان",
    suburb_en: "Kart-e Parwan"
  },
  {
    keys: ["فتح", "fathullah", "fath", "فتح الله", "قلعه فتح"],
    display_name_fa: "قلعه فتح الله، کابل، افغانستان",
    display_name_en: "Qala-e Fathullah, Kabul, Afghanistan",
    lat: "34.5485",
    lon: "69.1732",
    suburb_fa: "قلعه فتح الله",
    suburb_en: "Qala-e Fathullah"
  },
  {
    keys: ["شهر نو", "shahr", "naw", "شهرنو", "shahr-e naw"],
    display_name_fa: "شهر نو، کابل، افغانستان",
    display_name_en: "Shahr-e Naw, Kabul, Afghanistan",
    lat: "34.5321",
    lon: "69.1678",
    suburb_fa: "شهر نو",
    suburb_en: "Shahr-e Naw"
  },
  {
    keys: ["پل سرخ", "pule surkh", "pul-e surkh", "سرخ"],
    display_name_fa: "پل سرخ، کابل، افغانستان",
    display_name_en: "Pul-e Surkh, Kabul, Afghanistan",
    lat: "34.5165",
    lon: "69.1352",
    suburb_fa: "پل سرخ",
    suburb_en: "Pul-e Surkh"
  },
  {
    keys: ["آریا", "aria", "شهرک آریا"],
    display_name_fa: "شهرک آریا، کابل، افغانستان",
    display_name_en: "Aria City, Kabul, Afghanistan",
    lat: "34.5442",
    lon: "69.1985",
    suburb_fa: "شهرک آریا",
    suburb_en: "Aria City"
  },
  {
    keys: ["دارالامان", "darulaman", "دارالمان", "قصر دارالامان"],
    display_name_fa: "دارالامان، کابل، افغانستان",
    display_name_en: "Darulaman, Kabul, Afghanistan",
    lat: "34.4674",
    lon: "69.1186",
    suburb_fa: "دارالامان",
    suburb_en: "Darulaman"
  },
  {
    keys: ["افشار", "afshar"],
    display_name_fa: "افشار، کابل، افغانستان",
    display_name_en: "Afshar, Kabul, Afghanistan",
    lat: "34.5458",
    lon: "69.1054",
    suburb_fa: "افشار",
    suburb_en: "Afshar"
  },
  {
    keys: ["تایمنی", "taimani", "پروژه تایمنی"],
    display_name_fa: "تایمنی، کابل، افغانستان",
    display_name_en: "Taimani, Kabul, Afghanistan",
    lat: "34.5583",
    lon: "69.1645",
    suburb_fa: "تایمنی",
    suburb_en: "Taimani"
  },
  {
    keys: ["پغمان", "paghman"],
    display_name_fa: "پغمان، کابل، افغانستان",
    display_name_en: "Paghman, Kabul, Afghanistan",
    lat: "34.5886",
    lon: "69.0436",
    suburb_fa: "پغمان",
    suburb_en: "Paghman"
  },
  {
    keys: ["میدان هوایی", "airport", "فرودگاه"],
    display_name_fa: "میدان هوایی کابل، کابل، افغانستان",
    display_name_en: "Kabul International Airport, Kabul, Afghanistan",
    lat: "34.5647",
    lon: "69.2123",
    suburb_fa: "میدان هوایی کابل",
    suburb_en: "Kabul Airport"
  },
  {
    keys: ["خوشحال خان", "khushal khan", "خوشحال"],
    display_name_fa: "خوشحال خان مینه، کابل، افغانستان",
    display_name_en: "Khushal Khan Mena, Kabul, Afghanistan",
    lat: "34.5241",
    lon: "69.1098",
    suburb_fa: "خوشحال خان",
    suburb_en: "Khushal Khan"
  },
  {
    keys: ["کارت مامورین", "کارته مامورین", "mamoorin"],
    display_name_fa: "کارته مامورین، کابل، افغانستان",
    display_name_en: "Kart-e Mamoorin, Kabul, Afghanistan",
    lat: "34.5298",
    lon: "69.1132",
    suburb_fa: "کارته مامورین",
    suburb_en: "Kart-e Mamoorin"
  },
  {
    keys: ["چهلستون", "chehel sotoun", "chehelsotoun", "چهل ستون"],
    display_name_fa: "چهلستون، کابل، افغانستان",
    display_name_en: "Chehel Sotoun, Kabul, Afghanistan",
    lat: "34.4735",
    lon: "69.1554",
    suburb_fa: "چهلستون",
    suburb_en: "Chehel Sotoun"
  },
  {
    keys: ["کمپانی", "company", "سرک کمپانی"],
    display_name_fa: "کمپانی، کابل، افغانستان",
    display_name_en: "Company, Kabul, Afghanistan",
    lat: "34.5121",
    lon: "69.0721",
    suburb_fa: "کمپانی",
    suburb_en: "Company"
  },
  {
    keys: ["ارزان قیمت", "arzan qimat"],
    display_name_fa: "ارزان قیمت، کابل، افغانستان",
    display_name_en: "Arzan Qimat, Kabul, Afghanistan",
    lat: "34.5255",
    lon: "69.2785",
    suburb_fa: "ارزان قیمت",
    suburb_en: "Arzan Qimat"
  },
  {
    keys: ["بگرامی", "bagrami"],
    display_name_fa: "بگرامی، کابل، افغانستان",
    display_name_en: "Bagrami, Kabul, Afghanistan",
    lat: "34.4981",
    lon: "69.2482",
    suburb_fa: "بگرامی",
    suburb_en: "Bagrami"
  },
  {
    keys: ["ده دانا", "deh dana", "دهدانا"],
    display_name_fa: "ده دانا، کابل، افغانستان",
    display_name_en: "Deh Dana, Kabul, Afghanistan",
    lat: "34.4812",
    lon: "69.1411",
    suburb_fa: "ده دانا",
    suburb_en: "Deh Dana"
  },
  {
    keys: ["ده بوری", "deh bouri", "دهبوری"],
    display_name_fa: "ده بوری، کابل، افغانستان",
    display_name_en: "Deh Bouri, Kabul, Afghanistan",
    lat: "34.5198",
    lon: "69.1292",
    suburb_fa: "ده بوری",
    suburb_en: "Deh Bouri"
  },
  {
    keys: ["کلوله پشته", "kolola pushta", "کلوله", "پشته"],
    display_name_fa: "کلوله پشته، کابل، افغانستان",
    display_name_en: "Kolola Pushta, Kabul, Afghanistan",
    lat: "34.5463",
    lon: "69.1611",
    suburb_fa: "کلوله پشته",
    suburb_en: "Kolola Pushta"
  },
  {
    keys: ["کوتاه سنگی", "kote sangi", "کوتی سنگی", "سنگی"],
    display_name_fa: "کوته سنگی، کابل، افغانستان",
    display_name_en: "Kote Sangi, Kabul, Afghanistan",
    lat: "34.5158",
    lon: "69.1111",
    suburb_fa: "کوته سنگی",
    suburb_en: "Kote Sangi"
  },
  {
    keys: ["شاه شهید", "shah shaheed", "شاه شهید"],
    display_name_fa: "شاه شهید، کابل، افغانستان",
    display_name_en: "Shah Shaheed, Kabul, Afghanistan",
    lat: "34.5085",
    lon: "69.2012",
    suburb_fa: "شاه شهید",
    suburb_en: "Shah Shaheed"
  },
  {
    keys: ["هرات", "herat"],
    display_name_fa: "شهر هرات، افغانستان",
    display_name_en: "Herat City, Afghanistan",
    lat: "34.3482",
    lon: "62.1997",
    suburb_fa: "هرات",
    suburb_en: "Herat"
  },
  {
    keys: ["مزار", "mazar"],
    display_name_fa: "مزار شریف، بلخ، افغانستان",
    display_name_en: "Mazar-i-Sharif, Balkh, Afghanistan",
    lat: "36.7011",
    lon: "67.1123",
    suburb_fa: "مزار شریف",
    suburb_en: "Mazar-i-Sharif"
  }
];

interface CadastralInteractiveMapProps {
  lat: number;
  lng: number;
  onChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
  lang?: Language;
  height?: string;
  initialSearchQuery?: string;
  countryCode?: string;
  onAddressResolved?: (address: string, details: any) => void;
  housePlate?: string;
}

export const CadastralInteractiveMap: React.FC<CadastralInteractiveMapProps> = ({
  lat,
  lng,
  onChange,
  readOnly = false,
  lang = "fa",
  height = "255px",
  initialSearchQuery = "",
  countryCode = "AF",
  onAddressResolved,
  housePlate = "",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Default to 'satellite' as requested by the user ("تصویر زنده" / "Live Satellite photo of the streets")
  const [mapStyle, setMapStyle] = useState<"satellite" | "street">("satellite");

  // Search and geolocation tracking states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchStatusMsg, setSearchStatusMsg] = useState<string>("");
  const [addressDetails, setAddressDetails] = useState<any>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);

  const tileUrls = {
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    street: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  };

  // Toggle Map Theme Style smoothly on-the-fly
  const toggleMapStyle = () => {
    const nextStyle = mapStyle === "satellite" ? "street" : "satellite";
    setMapStyle(nextStyle);
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(tileUrls[nextStyle]);
    }
  };

  // Handle active high-accuracy geolocation discovery (like Snapp or Neshan / Balad)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setSearchStatusMsg(
        lang === "fa" 
          ? "مرورگر یا گوشی شما از موقعیت‌یافت فعالِ زنده پشتیبانی نمی‌کند." 
          : "Your device does not support active GPS discovery."
      );
      return;
    }

    setSearchStatusMsg(lang === "fa" ? "در حال دریافت مختصات زنده لوکیشن جی‌پی‌اس..." : "Looking up active GPS lock...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const map = mapRef.current;
        const marker = markerRef.current;

        if (map && marker) {
          marker.setLatLng([userLat, userLng]);
          map.setView([userLat, userLng], 17); // Premium close zoom focus on house level
          
          if (onChange) {
            onChange(userLat, userLng);
          }

          setSearchStatusMsg(lang === "fa" ? "✓ موقعیت زنده شما با موفقیت قفل شد" : "✓ Precise live location locked");
          
          setTimeout(() => {
            setSearchStatusMsg("");
          }, 3000);
        }
      },
      (error) => {
        console.error("GPS lock error:", error);
        let errorMsg = "";
        if (lang === "fa") {
          errorMsg = "توجه: دسترسی به GPS مسدود است. به دلیل محدودیت‌های امنیتیِ پیش‌نمایش، لطفاً دکمه «باز کردن در تب بزرگ/جدید» (Open preview in a new tab) در منوی بالای همین پنجره را فشار دهید تا جی‌پی‌اس فعال شود. همچنین می‌توانید از کادر جستجو بالا استفاده کنید.";
        } else {
          errorMsg = "Note: GPS access blocked. Due to security restrictions on previews, please select the 'Open preview in a new tab' button at the top to activate GPS search. You can also write the neighborhood in the search box.";
        }
        setSearchStatusMsg(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Sync initialSearchQuery prop when it changes and trigger automatic geocoding after the user stops typing
  useEffect(() => {
    if (!initialSearchQuery || initialSearchQuery.trim().length < 5) {
      if (initialSearchQuery) {
        setSearchQuery(initialSearchQuery);
      }
      return;
    }
    
    setSearchQuery(initialSearchQuery);

    const delayDebounceId = setTimeout(async () => {
      const map = mapRef.current;
      const marker = markerRef.current;
      if (!map || !marker) return;

      setIsSearching(true);
      setSearchStatusMsg(lang === "fa" ? "در حال یافتن خودکار آدرس روی نقشه..." : "Locating address automatically on map...");
      
      // 1. Try smart local dictionary search first to ensure 100% success rate for Kabul & Afghanistan sectors
      const queryLower = initialSearchQuery.toLowerCase().trim();
      const cleanQ = queryLower.replace(/[\s,،\-]+/g, "");
      const queryWords = queryLower.split(/[\s,،\-]+/).filter(w => w.length >= 2);

      const scoredMatches = KABUL_DISTRICTS_DB.map(district => {
        let score = 0;
        const cleanKeys = district.keys.map(k => k.replace(/[\s,،\-]+/g, "").toLowerCase());
        
        if (cleanKeys.some(ck => cleanQ.includes(ck) || ck.includes(cleanQ))) {
          score += 10;
        }
        
        district.keys.forEach(k => {
          queryWords.forEach(qw => {
            if (k.toLowerCase().includes(qw) || qw.includes(k.toLowerCase())) {
              score += 2;
            }
          });
        });
        
        return { district, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

      if (scoredMatches.length > 0) {
        const topMatch = scoredMatches[0].district;
        const selectedLat = parseFloat(topMatch.lat);
        const selectedLng = parseFloat(topMatch.lon);

        if (!isNaN(selectedLat) && !isNaN(selectedLng)) {
          marker.setLatLng([selectedLat, selectedLng]);
          map.setView([selectedLat, selectedLng], 17);

          if (onChange) {
            onChange(selectedLat, selectedLng);
          }

          setSearchStatusMsg(
            lang === "fa"
              ? `🎯 نقشه با موفقیت روی آدرس تنظیم شد: ${topMatch.display_name_fa}`
              : `🎯 Map centered on: ${topMatch.display_name_en}`
          );

          setIsSearching(false);
          setTimeout(() => {
            setSearchStatusMsg("");
          }, 5000);
          return;
        }
      }

      // 2. Fallback to server search with live localization support (accept-language query param)
      try {
        const acceptLang = lang === "fa" ? "fa,ps,en" : "en,fa";
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&accept-language=${acceptLang}&q=${encodeURIComponent(
            initialSearchQuery
          )}`
        );
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (data && data.length > 0) {
          const first = data[0];
          const selectedLat = parseFloat(first.lat);
          const selectedLng = parseFloat(first.lon);
          
          if (!isNaN(selectedLat) && !isNaN(selectedLng)) {
            marker.setLatLng([selectedLat, selectedLng]);
            map.setView([selectedLat, selectedLng], 17); 
            
            if (onChange) {
              onChange(selectedLat, selectedLng);
            }
            
            setSearchStatusMsg(
              lang === "fa" 
                ? `🎯 نقشه با موفقیت روی آدرس تنظیم شد: ${first.display_name.split(",")[0] || ""}` 
                : `🎯 Map centered on: ${first.display_name.split(",")[0] || ""}`
            );
            
            setTimeout(() => {
              setSearchStatusMsg("");
            }, 5000);
          }
        } else {
          setSearchStatusMsg(
            lang === "fa" 
              ? "آدرس روی نقشه پیدا نشد؛ لطفاً از مکان‌یاب دستی استفاده کنید یا نقشه را حرکت دهید." 
              : "Exact location not matched. Please locate manually."
          );
        }
      } catch (err) {
        console.error("Auto-geocode failed:", err);
        setSearchStatusMsg(
          lang === "fa" 
            ? "کادر بالا را پر کنید یا سنجاق را مستقیماً روی نقشه جابجا نمایید." 
            : "Automatic lookup unavailable. Manual positioning active."
        );
      } finally {
        setIsSearching(false);
      }
    }, 1800);

    return () => clearTimeout(delayDebounceId);
  }, [initialSearchQuery]);

  // Reverse geocodes coordinates and gets granular details (e.g. house plate)
  const reverseGeocode = async (latitude: number, longitude: number) => {
    if (isNaN(latitude) || isNaN(longitude)) return;
    setIsReverseGeocoding(true);
    try {
      const acceptLang = lang === "fa" ? "fa,ps,en" : "en,fa";
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=${acceptLang}`
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data && data.address) {
        setAddressDetails(data);
        
        // Extract formatted details for callback
        const addr = data.address;
        const countryName = addr.country || "";
        const city = addr.city || addr.town || addr.village || "";
        const road = addr.road || addr.street || "";
        const suburb = addr.suburb || addr.neighbourhood || addr.city_district || "";
        const houseNumber = addr.house_number || addr.building || "";
        
        let formattedStr = "";
        if (lang === "fa") {
          const parts = [
            countryName,
            city,
            suburb,
            road,
            houseNumber ? `پلاک ${houseNumber}` : ""
          ].filter(Boolean);
          formattedStr = parts.join("، ");
        } else {
          const parts = [
            houseNumber ? `No. ${houseNumber}` : "",
            road,
            suburb,
            city,
            countryName
          ].filter(Boolean);
          formattedStr = parts.join(", ");
        }
        
        if (onAddressResolved && formattedStr) {
          onAddressResolved(formattedStr, data);
        }
      }
    } catch (err) {
      console.warn("Reverse geocode failure:", err);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleLocationUpdate = (newLat: number, newLng: number) => {
    if (onChange) {
      onChange(newLat, newLng);
    }
    reverseGeocode(newLat, newLng);
  };

  // Handle address geocoding search via Nominatim with smart Afghanistan/Country fallback iterations and local dictionary integration
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchStatusMsg(lang === "fa" ? "در حال یافتن آدرس هوشمند با ماهواره..." : "Searching smart location...");
    setSearchResults([]);

    const rawQueries: { q: string; limit: boolean }[] = [];
    
    // Core query extractor: strips specific numbers like plate or lane number to find the general area/district first
    const coreQuery = searchQuery
      .split(/[\s,،]+(کوچه|پلاک|سرک|منزل|نمبر|خیابان|آپارتمان|اپارتمان|بلوک|واحد|کوچهٔ|فرعی|اصلی|alley|street|house|plate|no|building)/i)[0]
      .trim();

    // 1. Try exact search with country restriction
    rawQueries.push({ q: searchQuery, limit: true });

    // 2. Try exact search globally without strict region bounding
    rawQueries.push({ q: searchQuery, limit: false });

    // 3. Fallbacks with capital/country name appended
    if (countryCode?.toUpperCase() === "AF") {
      const lowerQ = searchQuery.toLowerCase();
      const hasKabul = lowerQ.includes("kabul") || lowerQ.includes("کابل");
      const hasAfghanistan = lowerQ.includes("afghanistan") || lowerQ.includes("افغانستان");
      
      if (!hasKabul) {
        rawQueries.push({ q: `${searchQuery} کابل`, limit: true });
        rawQueries.push({ q: `${searchQuery} کابل`, limit: false });
      }
      if (!hasAfghanistan) {
        rawQueries.push({ q: `${searchQuery} افغانستان`, limit: true });
        rawQueries.push({ q: `${searchQuery} افغانستان`, limit: false });
      }
    } else {
      rawQueries.push({ q: `${searchQuery} ${countryCode}`, limit: false });
    }

    // 4. Try the extracted general core district/neighbourhood
    if (coreQuery && coreQuery !== searchQuery && coreQuery.length >= 3) {
      rawQueries.push({ q: coreQuery, limit: true });
      rawQueries.push({ q: coreQuery, limit: false });
      if (countryCode?.toUpperCase() === "AF") {
        rawQueries.push({ q: `${coreQuery} کابل`, limit: true });
        rawQueries.push({ q: `${coreQuery} کابل`, limit: false });
        rawQueries.push({ q: `${coreQuery} افغانستان`, limit: false });
      }
    }

    // Deduplicate maintaining order:
    const queriesToTry: { q: string; limit: boolean }[] = [];
    const seen = new Set<string>();
    for (const item of rawQueries) {
      const key = `${item.q.toLowerCase().trim()}::${item.limit}`;
      if (!seen.has(key)) {
        seen.add(key);
        queriesToTry.push(item);
      }
    }

    // A. Intercept using our high-precision local database fallback
    const queryLower = searchQuery.toLowerCase().trim();
    const cleanQ = queryLower.replace(/[\s,،\-]+/g, "");
    const queryWords = queryLower.split(/[\s,،\-]+/).filter(w => w.length >= 2);

    const scoredMatches = KABUL_DISTRICTS_DB.map(district => {
      let score = 0;
      const cleanKeys = district.keys.map(k => k.replace(/[\s,،\-]+/g, "").toLowerCase());
      
      if (cleanKeys.some(ck => cleanQ.includes(ck) || ck.includes(cleanQ))) {
        score += 10;
      }
      
      district.keys.forEach(k => {
        queryWords.forEach(qw => {
          if (k.toLowerCase().includes(qw) || qw.includes(k.toLowerCase())) {
            score += 2;
          }
        });
      });
      
      return { district, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.district);

    const localSearchResults = scoredMatches.map(m => ({
      place_id: `local-${m.lat}-${m.lon}`,
      lat: m.lat,
      lon: m.lon,
      display_name: lang === "fa" ? m.display_name_fa : m.display_name_en,
      address: {
        country: lang === "fa" ? "افغانستان" : "Afghanistan",
        city: lang === "fa" ? "کابل" : "Kabul",
        suburb: lang === "fa" ? m.suburb_fa : m.suburb_en
      }
    }));

    let foundData: any[] = [...localSearchResults];
    
    // B. Call Nominatim for additional server geocoder results as fallback/supplementary with localized outputs
    for (const item of queriesToTry) {
      try {
        const countryLimitParam = item.limit && countryCode ? `&countrycodes=${countryCode.toLowerCase()}` : "";
        const acceptLang = lang === "fa" ? "fa,ps,en" : "en,fa";
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&accept-language=${acceptLang}&q=${encodeURIComponent(
            item.q
          )}${countryLimitParam}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Keep unique results preventing duplicates against local matched locations
            const filteredData = data.filter((item: any) => {
              const itemLat = parseFloat(item.lat);
              const itemLon = parseFloat(item.lon);
              return !foundData.some(fd => {
                const fdLat = parseFloat(fd.lat);
                const fdLon = parseFloat(fd.lon);
                return Math.abs(fdLat - itemLat) < 0.005 && Math.abs(fdLon - itemLon) < 0.005;
              });
            });
            foundData = [...foundData, ...filteredData];
          }
        }
      } catch (err) {
        console.error("Geocoding step failed:", err);
      }
    }

    if (foundData.length > 0) {
      setSearchResults(foundData);
      setSearchStatusMsg("");
    } else {
      setSearchStatusMsg(
        lang === "fa"
          ? "مکان‌یابی هوشمند ناموفق بود. نام کلی‌تر مانند 'دشت برچی کابل' یا 'کارته سخی' را در کادر بنویسید."
          : "No cadastral matches found. Try entering a slightly broader name."
      );
    }
    setIsSearching(false);
  };

  // Teleport map & marker pin to the selected geocode item
  const selectResult = (result: any) => {
    const selectedLat = parseFloat(result.lat);
    const selectedLng = parseFloat(result.lon);

    if (isNaN(selectedLat) || isNaN(selectedLng)) return;

    const map = mapRef.current;
    const marker = markerRef.current;

    if (map && marker) {
      marker.setLatLng([selectedLat, selectedLng]);
      map.setView([selectedLat, selectedLng], 17);
      
      handleLocationUpdate(selectedLat, selectedLng);

      setSearchResults([]);
      setSearchStatusMsg("");
      setSearchQuery(result.display_name);

      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }
  };

  // Run initial reverse geocoding on mount
  useEffect(() => {
    if (lat && lng) {
      reverseGeocode(lat, lng);
    }
  }, []);

  // Initialize Map safely (Direct ESM bundled leaflet reduces latency, bypasses CORS/integrity, guarantees 100% display rate)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = typeof lat === "number" && !isNaN(lat) && lat !== 0 ? lat : 34.5553;
    const initialLng = typeof lng === "number" && !isNaN(lng) && lng !== 0 ? lng : 69.1779;

    // Create Leaflet Map Instance
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: true,
      attributionControl: false,
    });

    mapRef.current = map;

    // Load active street / satellite view tile layers dynamically
    const defaultTileUrl = tileUrls[mapStyle];
    const tileLayer = L.tileLayer(defaultTileUrl, {
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Define premium Custom Pin overlay (Vibrant Indigo with radar flare wave)
    const pinIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-indigo-500/35 animate-ping"></div>
        <div class="relative w-8 h-8 flex items-center justify-center bg-indigo-600 border-2 border-slate-900 rounded-full shadow-xl">
          <span class="text-white text-xs font-bold animate-pulse">📍</span>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: pinIconHtml,
      className: "custom-leaflet-pin-wrapper",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Create Marker pin
    const marker = L.marker([initialLat, initialLng], {
      draggable: !readOnly,
      icon: customIcon,
    }).addTo(map);

    markerRef.current = marker;

    // Bind dragging listeners for real-time location selection
    if (!readOnly && onChange) {
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        handleLocationUpdate(position.lat, position.lng);
      });

      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        marker.setLatLng([clickLat, clickLng]);
        handleLocationUpdate(clickLat, clickLng);
        map.panTo([clickLat, clickLng]);
      });
    }

    // High performance invalidation intervals to accommodate dynamic transitions / modal popups
    const invalidateDelays = [80, 250, 500, 1000, 2500];
    invalidateDelays.forEach((delay) => {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, delay);
    });

    return () => {
      if (map) {
        try {
          map.remove();
        } catch (err) {
          console.warn("Leaflet map soft cleanup:", err);
        }
        mapRef.current = null;
        markerRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  // Synchronously update map position if parent props change externally (like country shifting)
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    const validLat = typeof lat === "number" && !isNaN(lat) && lat !== 0 ? lat : 35.6892;
    const validLng = typeof lng === "number" && !isNaN(lng) && lng !== 0 ? lng : 51.3890;

    const markerLatLng = marker.getLatLng();
    if (Math.abs(markerLatLng.lat - validLat) > 0.0001 || Math.abs(markerLatLng.lng - validLng) > 0.0001) {
      marker.setLatLng([validLat, validLng]);
      map.setView([validLat, validLng], map.getZoom() || 16);
      
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [lat, lng]);

  return (
    <div className="w-full space-y-2.5 relative select-none">
      
      {/* Real-time Search Panel & Suggestion Controls (Positioned cleanly ABOVE the map container) */}
      {!readOnly && (
        <div className="flex flex-col gap-1.5 w-full bg-slate-950 p-2.5 rounded-xl border border-slate-850 shadow-lg">
          <div className="flex gap-2 items-center w-full">
            
            {/* GPS Live Geolocation Button */}
            <button
              type="button"
              onClick={handleLocateMe}
              title={lang === "fa" ? "یافتن زنده مکان شما با جی‌پی‌اس گوش یا لپ‌تاپ" : "Locate me with Live GPS"}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-indigo-400 hover:text-indigo-300 p-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 w-9 h-9 active:scale-95 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <line x1="12" y1="1" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="23" />
                <line x1="1" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="23" y2="12" />
              </svg>
            </button>

            {/* Address Search input box */}
            <input
              type="text"
              placeholder={
                lang === "fa" 
                  ? "جستجو... (مثال: الهیه، برج مریم، تهران)" 
                  : "Search... (e.g. Elahiyeh Tower, Tehran)"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              className="bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-grow font-sans text-right"
            />
            
            {/* Search Submit button */}
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg border border-indigo-500/25 transition-all cursor-pointer shrink-0 flex items-center justify-center min-w-[80px]"
            >
              {isSearching ? (lang === "fa" ? "صبر..." : "Wait...") : (lang === "fa" ? "جستجو" : "Search")}
            </button>
          </div>

          {/* Suggestions Dropdown (Now placed outside above the map canvas so it does not block the marker or map views) */}
          {searchResults.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-850 w-full animate-fadeIn mt-1">
              {searchResults.map((res: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectResult(res)}
                  className="w-full text-right p-3 text-[11px] hover:bg-slate-800 transition text-slate-300 hover:text-white flex items-start gap-2.5 leading-relaxed font-sans cursor-pointer focus:outline-none border-none"
                >
                  <span className="shrink-0 text-xs mt-0.5">🔹</span>
                  <span className="line-clamp-2">{res.display_name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Clean Inline logs and loader messages helper layout */}
          {searchStatusMsg && (
            <div className="bg-indigo-950/40 text-indigo-300 border border-indigo-900/50 text-[10.5px] px-3 py-2 rounded-lg text-center animate-pulse shadow-md leading-relaxed select-none">
              {searchStatusMsg}
            </div>
          )}
        </div>
      )}

      {/* Interactive Map Canvas Container view block */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl" style={{ height }}>
        
        {/* Floating satellite toggle switch widget on map frame */}
        <div className="absolute top-2.5 right-2.5 z-[1000] flex flex-col gap-2">
          <button
            type="button"
            onClick={toggleMapStyle}
            title={lang === "fa" ? "تغییر حالت به نقشه ماهواره‌ای / شهری" : "Switch map view theme"}
            className="h-9 px-3.5 rounded-lg bg-slate-950/95 border border-slate-850 hover:border-indigo-400 text-indigo-300 hover:text-white text-[10px] font-bold tracking-wider hover:bg-slate-900 shadow-2xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 focus:outline-none"
          >
            <span>{mapStyle === "satellite" ? "📡" : "🗺️"}</span>
            <span className="font-sans">
              {lang === "fa" 
                ? (mapStyle === "satellite" ? "نمای نقشه شهری" : "تصویر زنده ماهواره‌ای")
                : (mapStyle === "satellite" ? "Street View" : "Live Satellite View")}
            </span>
          </button>
        </div>

        {/* Floating high precision GPS trigger target button in bottom-left */}
        {!readOnly && (
          <button
            type="button"
            onClick={handleLocateMe}
            title={lang === "fa" ? "یافتن موقعیت زنده شما با جی پی اس" : "Locate via GPS"}
            className="absolute bottom-3 left-3 z-[1000] w-10 h-10 rounded-full bg-slate-950/95 border border-slate-800 hover:border-indigo-400 flex items-center justify-center text-indigo-400 hover:text-white shadow-2xl transition-all cursor-pointer active:scale-95 focus:outline-none animate-pulse"
          >
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" style={{ animationDuration: "3.5s" }}></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 relative z-[10]">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="23" />
              <line x1="1" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="23" y2="12" />
            </svg>
          </button>
        )}

        {/* Static Map elements canvas wrapper */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-[1]"
        />

        {/* Drag pin interactive user notice labels */}
        {!readOnly && !searchQuery && (
          <div className="absolute bottom-3 left-15 z-[1000] pointer-events-none bg-slate-950/85 px-2.5 py-1 rounded-lg border border-slate-850 text-[9px] font-bold text-slate-300 font-sans shadow-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            {lang === "fa" 
              ? "سنجاق را بکشید یا روی هر بخش نقشه کلیک کنید" 
              : "Drag marker pin or click anywhere to reposition"}
          </div>
        )}

        {/* Top layer active map style label tags */}
        <div className="absolute bottom-2.5 right-2.5 z-[1000] bg-slate-950/90 px-2.5 py-1 rounded-md border border-slate-800 text-[8px] font-bold tracking-wide text-slate-400 font-sans select-none">
          {lang === "fa" 
            ? (mapStyle === "satellite" ? "🛰️ تصویر واقعی ماهواره‌ای فعال است" : "🗺️ نقشه کاداستر شهری فعال است")
            : (mapStyle === "satellite" ? "ESRI World Satellite Live" : "CartoDB Cadastral Street")}
        </div>
      </div>

      {/* Smart address elements breakdown layout (e.g. house number / plack / road / suburb) */}
      {addressDetails && addressDetails.address && (
        <div className="bg-slate-950/95 border border-indigo-500/20 rounded-xl p-3.5 space-y-2.5 shadow-2xl animate-fadeIn text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
              <Navigation className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{lang === "fa" ? "آدرس‌یاب هوشمند کاداستر (پلاک و خانه)" : "Smart Cadastral Geocoder"}</span>
            </div>
            {isReverseGeocoding && (
              <span className="text-[10px] text-indigo-400 animate-pulse font-mono bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/30">
                {lang === "fa" ? "بروزرسانی زنده..." : "Updating..."}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            {/* Country and City */}
            <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-900">
              <span className="text-sm">🌍</span>
              <div className="flex-grow">
                <span className="block text-[9px] text-slate-500 uppercase font-black text-right">{lang === "fa" ? "کشور و شهر" : "Country & City"}</span>
                <span className="font-sans font-bold text-slate-200 text-right block">
                  {addressDetails.address.country || "---"}
                  {" / "}
                  {addressDetails.address.city || addressDetails.address.town || addressDetails.address.village || addressDetails.address.state || "---"}
                </span>
              </div>
            </div>

            {/* Suburb / NW */}
            <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-900">
              <span className="text-sm">📍</span>
              <div className="flex-grow">
                <span className="block text-[9px] text-slate-500 uppercase font-black text-right">{lang === "fa" ? "محله / بخش" : "District / Suburb"}</span>
                <span className="font-sans font-bold text-indigo-400 text-right block text-ellipsis overflow-hidden">
                  {addressDetails.address.suburb || addressDetails.address.neighbourhood || addressDetails.address.city_district || addressDetails.address.quarter || (lang === "fa" ? "نامشخص" : "General area")}
                </span>
              </div>
            </div>

            {/* Road / Street */}
            <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-900">
              <span className="text-sm">🛣️</span>
              <div className="flex-grow">
                <span className="block text-[9px] text-slate-500 uppercase font-black text-right">{lang === "fa" ? "خیابان / گذرگاه" : "Street / Road"}</span>
                <span className="font-sans text-slate-200 text-right block">
                  {addressDetails.address.road || addressDetails.address.street || addressDetails.address.suburb || "---"}
                </span>
              </div>
            </div>

            {/* House Number / Plate */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/10 to-transparent p-2 rounded-lg border border-amber-500/10">
              <span className="text-sm">🏢</span>
              <div className="flex-grow">
                <span className="block text-[9px] text-amber-500 uppercase font-black text-right">{lang === "fa" ? "پلاک منزل / پلاک ثبتی" : "House No. / Building Plate"}</span>
                <span className="font-mono text-xs font-black text-amber-400 animate-pulse text-right block">
                  {addressDetails.address.house_number || addressDetails.address.building || addressDetails.address.office || housePlate || (lang === "fa" ? "مشخص نشده (روی کوچه کلیک کنید)" : "Not resolved (click street level)")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-850/60 flex flex-col gap-2 text-right">
            <span className="block text-[9px] text-slate-500 uppercase font-bold">{lang === "fa" ? "آدرس فرمت‌شده کامل" : "Full Formatted Address"}</span>
            <span className="text-[11px] text-slate-300 font-sans leading-relaxed">{addressDetails.display_name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

