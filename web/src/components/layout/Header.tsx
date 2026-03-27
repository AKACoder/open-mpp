import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Search,
  Sun,
  Moon,
  Languages,
  Menu,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";
import { useTheme } from "../../hooks/useTheme";
import { pathFromSearchQuery } from "../../utils/searchNavigation";
import {
  persistUserLanguage,
  type AppLocale,
} from "../../locales/languagePreference";

const NAV_ITEMS = [
  { to: "/", key: "nav.overview", end: true },
  { to: "/channels", key: "nav.allChannels", end: true },
  { to: "/analytics", key: "nav.analytics", end: false },
  { to: "/guide", key: "nav.guide", end: false },
] as const;

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const showHeaderSearch = location.pathname !== "/";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!showHeaderSearch) {
      setSearchOpen(false);
      setSearchQuery("");
    }
  }, [showHeaderSearch, location.pathname]);

  const toggleLang = () => {
    const next: AppLocale = i18n.language.startsWith("zh") ? "en" : "zh";
    void i18n.changeLanguage(next);
    persistUserLanguage(next);
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !searchQuery.trim()) return;
    const res = pathFromSearchQuery(searchQuery);
    if (!res.ok) {
      toast.error(t("search.invalidQuery"));
      return;
    }
    navigate(res.path);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "text-sm font-medium transition-colors",
      isActive
        ? "text-accent"
        : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100",
    );

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-accent/10 text-accent"
        : "text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
    );

  const iconBtn =
    "flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center gap-3 px-4 py-1.5 sm:gap-4 sm:px-6 sm:py-2 lg:px-8">
        <NavLink
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2"
        >
          <Activity className="size-5 shrink-0 text-accent" strokeWidth={2} />
          <span className="block text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
            {t("app.brandName")}
          </span>
        </NavLink>

        <nav
          className="hidden items-center gap-4 lg:gap-5 xl:gap-6 md:flex"
          aria-label="Main"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={navLinkClass}
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {showHeaderSearch ? (
          <div className="hidden md:flex md:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder={t("search.placeholderUnified")}
                className="h-8 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-accent lg:w-72"
                aria-label={t("search.aria")}
              />
            </div>
          </div>
        ) : null}

        {showHeaderSearch ? (
          <button
            type="button"
            className={clsx(iconBtn, "md:hidden")}
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
          </button>
        ) : null}

        <button type="button" onClick={toggleLang} className={iconBtn} aria-label="Toggle language">
          <Languages className="size-5" />
        </button>

        <button type="button" onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </button>

        <button
          type="button"
          className={clsx(iconBtn, "md:hidden")}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {showHeaderSearch && searchOpen ? (
        <div className="border-t border-slate-200 px-4 py-2 md:hidden dark:border-zinc-800">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder={t("search.placeholderUnified")}
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-accent"
              aria-label={t("search.aria")}
            />
          </div>
        </div>
      ) : null}

      {mobileMenuOpen ? (
        <nav
          className="border-t border-slate-200 md:hidden dark:border-zinc-800"
          aria-label="Mobile"
        >
          <div className="space-y-1 px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                {t(item.key)}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
