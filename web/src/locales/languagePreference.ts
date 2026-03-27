/** Shared language resolution: URL query > localStorage > browser > en (via browser rule). */

export const SUPPORTED_LANGS = ["en", "zh"] as const;
export type AppLocale = (typeof SUPPORTED_LANGS)[number];

const STORAGE_KEY = "i18nextLng";

export function isSupportedLocale(s: string): s is AppLocale {
  return (SUPPORTED_LANGS as readonly string[]).includes(s);
}

/** `search` is `location.search` (includes `?`) or a raw query string. */
export function parseLangFromSearch(search: string): AppLocale | null {
  const q = search.startsWith("?") ? search.slice(1) : search;
  const raw = new URLSearchParams(q).get("lang");
  if (!raw) return null;
  const low = raw.toLowerCase();
  if (low === "en" || low === "zh") return low;
  return null;
}

export function readStoredUserLanguage(): AppLocale | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s && isSupportedLocale(s)) return s;
  } catch {
    /* private mode */
  }
  return null;
}

/** Maps browser language to a supported locale; non-Chinese falls back to `en`. */
export function browserPreferredLocale(): AppLocale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language?.toLowerCase() ?? "";
  return lang.startsWith("zh") ? "zh" : "en";
}

/**
 * Priority: URL `lang` > localStorage > browser > en (implicit via browser rule).
 * Does not write to storage.
 */
export function resolveLocaleFromSearch(search: string): AppLocale {
  return (
    parseLangFromSearch(search) ??
    readStoredUserLanguage() ??
    browserPreferredLocale()
  );
}

/** Persist explicit user choice (e.g. header toggle). URL-driven changes must not call this. */
export function persistUserLanguage(locale: AppLocale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}
