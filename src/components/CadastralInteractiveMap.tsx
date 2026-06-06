import React, { useEffect, useRef, useState } from "react";
import { Language } from "../types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CadastralInteractiveMapProps {
  lat: number;
  lng: number;
  onChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
  lang?: Language;
  height?: string;
  initialSearchQuery?: string;
}

export const CadastralInteractiveMap: React.FC<CadastralInteractiveMapProps> = ({
  lat,
  lng,
  onChange,
  readOnly = false,
  lang = "fa",
  height = "255px",
  initialSearchQuery = "",
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
        let errorMsg = lang === "fa" ? "خطا در دریافت موقعیت؛ لطفا جی‌پی‌اس گوشی را روشن کنید" : "GPS coordinate discovery failed.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = lang === "fa" 
            ? "دسترسی لوکیشن غیرفعال است؛ لطفاً اجازه دسترسی GPS به مرورگر را صادر کنید." 
            : "Location permissions denied. Please grant browser permissions.";
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
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(
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
              ? "آدرس روی نقشه ابهام دارد؛ لطفا با مکان‌یاب دستی یا جستجو آن را تعیین کنید." 
              : "Exact location not matched. Please locate manually."
          );
        }
      } catch (err) {
        console.error("Auto-geocode failed:", err);
        setSearchStatusMsg(
          lang === "fa" 
            ? "عدم برقراری ارتباط؛ می‌توانید با جابجایی دستی سنجاق موقعیت را پیدا کنید." 
            : "Automatic lookup unavailable. Manual positioning active."
        );
      } finally {
        setIsSearching(false);
      }
    }, 1800);

    return () => clearTimeout(delayDebounceId);
  }, [initialSearchQuery]);

  // Handle address geocoding search via Nominatim
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchStatusMsg(lang === "fa" ? "در حال جستجو لوکیشن..." : "Searching...");
    setSearchResults([]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      if (data && data.length > 0) {
        setSearchResults(data);
        setSearchStatusMsg("");
      } else {
        setSearchStatusMsg(
          lang === "fa"
            ? "مکان دقیقی یافت نشد. لوکیشن کلی‌تر را بنویسید (مثلاً: الهیه، تهران)."
            : "No match found. Please refine search."
        );
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
      setSearchStatusMsg(
        lang === "fa" ? "خطا در اتصال به سرور نقشه. مجدد امتحان فرمایید." : "Connection error. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
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
      
      if (onChange) {
        onChange(selectedLat, selectedLng);
      }

      setSearchResults([]);
      setSearchStatusMsg("");
      setSearchQuery(result.display_name);

      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }
  };

  // Initialize Map safely (Direct ESM bundled leaflet reduces latency, bypasses CORS/integrity, guarantees 100% display rate)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = typeof lat === "number" && !isNaN(lat) && lat !== 0 ? lat : 35.6892;
    const initialLng = typeof lng === "number" && !isNaN(lng) && lng !== 0 ? lng : 51.3890;

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
        onChange(position.lat, position.lng);
      });

      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        marker.setLatLng([clickLat, clickLng]);
        onChange(clickLat, clickLng);
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
    </div>
  );
};

