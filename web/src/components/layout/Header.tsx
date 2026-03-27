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
import { useTheme } from "../../hooks/useTheme";

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
  const [searchRole, setSearchRole] = useState<"payer" | "payee">("payer");
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
    i18n.changeLanguage(i18n.language === "en" ? "zh" : "en");
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !searchQuery.trim()) return;
    const q = searchQuery.trim();
    if (/^0x[0-9a-fA-F]{64}$/.test(q)) {
      navigate(`/channel/${q}`);
    } else {
      navigate(`/address/${searchRole}/${q}`);
    }
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
        {/* Logo */}
        <NavLink
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2"
        >
          <Activity className="size-5 shrink-0 text-accent" strokeWidth={2} />
          <span className="block text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
            {t("app.brandName")}
          </span>
        </NavLink>

        {/* Desktop nav */}
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

        {/* Desktop search (hidden on home — search lives in page body) */}
        {showHeaderSearch ? (
          <div className="hidden items-center gap-2 md:flex">
            <div
              className="flex h-8 shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-900"
              role="group"
              aria-label={t("search.roleGroupAria")}
            >
              <button
                type="button"
                onClick={() => setSearchRole("payer")}
                className={clsx(
                  "rounded-md px-2 py-1 transition-colors",
                  searchRole === "payer"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200",
                )}
              >
                {t("search.rolePayer")}
              </button>
              <button
                type="button"
                onClick={() => setSearchRole("payee")}
                className={clsx(
                  "rounded-md px-2 py-1 transition-colors",
                  searchRole === "payee"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200",
                )}
              >
                {t("search.rolePayee")}
              </button>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder={t("search.placeholderHeader")}
                className="h-8 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-accent lg:w-64"
              />
            </div>
          </div>
        ) : null}

        {/* Mobile search toggle */}
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

        {/* Language toggle */}
        <button type="button" onClick={toggleLang} className={iconBtn} aria-label="Toggle language">
          <Languages className="size-5" />
        </button>

        {/* Theme toggle */}
        <button type="button" onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </button>

        {/* Mobile hamburger */}
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

      {/* Mobile search bar */}
      {showHeaderSearch && searchOpen ? (
        <div className="space-y-2 border-t border-slate-200 px-4 py-2 md:hidden dark:border-zinc-800">
          <div
            className="flex h-9 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-900"
            role="group"
            aria-label={t("search.roleGroupAria")}
          >
            <button
              type="button"
              onClick={() => setSearchRole("payer")}
              className={clsx(
                "flex-1 rounded-md py-1 transition-colors",
                searchRole === "payer"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-slate-500 dark:text-zinc-400",
              )}
            >
              {t("search.rolePayer")}
            </button>
            <button
              type="button"
              onClick={() => setSearchRole("payee")}
              className={clsx(
                "flex-1 rounded-md py-1 transition-colors",
                searchRole === "payee"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-slate-500 dark:text-zinc-400",
              )}
            >
              {t("search.rolePayee")}
            </button>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder={t("search.placeholderHeader")}
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-accent"
            />
          </div>
        </div>
      ) : null}

      {/* Mobile nav menu */}
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
