import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import i18n from "../../locales/i18n";
import { resolveLocaleFromSearch } from "../../locales/languagePreference";

/** Keeps i18n in sync with URL query, storage, and browser per documented priority (URL does not persist). */
export default function I18nLocationSync() {
  const location = useLocation();

  useEffect(() => {
    const next = resolveLocaleFromSearch(location.search);
    const current = i18n.resolvedLanguage ?? i18n.language;
    const curBase = current.split("-")[0];
    if (curBase !== next) {
      void i18n.changeLanguage(next);
    }
  }, [location.pathname, location.search]);

  return null;
}
