import React, { useState, useEffect } from "react";
import { Language } from "../types";
import { translateText } from "../utils/translator";

interface AutoTranslateProps {
  text: string;
  lang: Language;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
}

export const AutoTranslate: React.FC<AutoTranslateProps> = ({
  text,
  lang,
  className = "",
  as: Component = "span",
}) => {
  const [translatedMsg, setTranslatedMsg] = useState<string>(text);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // If language is English and text seems to be English, skip unless it's a dynamic text.
    // However, if the active language is not Persian/Farsi (fa) or English (en) (the primary hardcoded ones),
    // or if the text is English and we switched to Persian / Pashto / Arabic / Turkish, etc.
    let isDefaultMatch = false;
    if (lang === "en" && /^[A-Za-z0-9\s.,!?:()''""&-]+$/.test(text)) {
      isDefaultMatch = true;
    }

    if (isDefaultMatch) {
      setTranslatedMsg(text);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    async function fetchTranslation() {
      setLoading(true);
      const res = await translateText(text, lang);
      if (!isCancelled) {
        setTranslatedMsg(res);
        setLoading(false);
      }
    }

    fetchTranslation();

    return () => {
      isCancelled = true;
    };
  }, [text, lang]);

  return (
    <Component className={`${className} ${loading ? "opacity-60 animate-pulse transition-opacity duration-200" : "transition-opacity duration-200"}`}>
      {translatedMsg}
    </Component>
  );
};
