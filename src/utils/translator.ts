// Dynamic on-the-fly AI Translation System powered by Gemini
import { Language } from "../types";

// In-memory cache to prevent redundant API translations
const translationCache: Record<string, string> = {};

// Load cache from sessionStorage for cross-page persistence
try {
  const saved = sessionStorage.getItem("ariana_translation_cache");
  if (saved) {
    Object.assign(translationCache, JSON.parse(saved));
  }
} catch (e) {
  console.warn("Storage access not available:", e);
}

function saveCache() {
  try {
    sessionStorage.setItem("ariana_translation_cache", JSON.stringify(translationCache));
  } catch (e) {
    // ignore
  }
}

/**
 * Returns a translation for a given text into the target language.
 * Checks in-memory cache first, then calls the AI translation server.
 */
export async function translateText(text: string, targetLang: Language): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";
  
  // If target is English or Persian and the source text already seems to be in it, or is very short,
  // we first check cache.
  const cacheKey = `${targetLang}:${trimmed}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  // Skip translation if language is EN / FA and text is already similar, but better is to let Gemini do it
  if (targetLang === "en" && /^[a-zA-Z0-9\s.,!?-]+$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed, targetLang }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result && typeof data.result === "string") {
        translationCache[cacheKey] = data.result;
        saveCache();
        return data.result;
      }
    }
  } catch (err) {
    console.error("Failed to fetch translation for:", trimmed, err);
  }

  return trimmed; // Safely fall back to the original text
}

/**
 * Batch translation of multiple strings to optimize API calls
 */
export async function translateBatch(texts: string[], targetLang: Language): Promise<string[]> {
  const results: string[] = [];
  const indexesToTranslate: number[] = [];
  const textsToTranslate: string[] = [];

  texts.forEach((text, idx) => {
    const cacheKey = `${targetLang}:${text.trim()}`;
    if (translationCache[cacheKey]) {
      results[idx] = translationCache[cacheKey];
    } else {
      indexesToTranslate.push(idx);
      textsToTranslate.push(text.trim());
    }
  });

  if (textsToTranslate.length === 0) {
    return results;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textsToTranslate, targetLang }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result && Array.isArray(data.result)) {
        data.result.forEach((val: string, idx: number) => {
          const originalIdx = indexesToTranslate[idx];
          const cacheKey = `${targetLang}:${textsToTranslate[idx]}`;
          translationCache[cacheKey] = val;
          results[originalIdx] = val;
        });
        saveCache();
        return results;
      }
    }
  } catch (err) {
    console.error("Dynamic batch translation failed:", err);
  }

  // Fallback to individual fallback or original
  indexesToTranslate.forEach((originalIdx, idx) => {
    results[originalIdx] = textsToTranslate[idx];
  });
  return results;
}
