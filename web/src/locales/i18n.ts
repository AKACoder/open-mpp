import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import zh from "./zh.json";

const SUPPORTED_LANGS = ["en", "zh"];
const stored = localStorage.getItem("i18nextLng");
const lng = stored && SUPPORTED_LANGS.includes(stored) ? stored : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng,
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LANGS,
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lang) => {
  localStorage.setItem("i18nextLng", lang);
});

export default i18n;
