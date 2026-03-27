import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import zh from "./zh.json";
import {
  resolveLocaleFromSearch,
  SUPPORTED_LANGS,
} from "./languagePreference";

const initialSearch =
  typeof window !== "undefined" ? window.location.search : "";
const lng = resolveLocaleFromSearch(initialSearch);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng,
  fallbackLng: "en",
  supportedLngs: [...SUPPORTED_LANGS],
  interpolation: { escapeValue: false },
});

export default i18n;
