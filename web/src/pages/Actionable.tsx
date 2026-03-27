import { useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import SeoHead from "../components/seo/SeoHead";
import { isValidAddressParam } from "../utils/searchNavigation";
import { toast } from "sonner";

const STORAGE_KEY = "payer_address";

/** Legacy entry: minimal payer input → unified address page (Payer tab, with actionable lists). */
export default function Actionable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [input, setInput] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? "",
  );

  const submit = () => {
    const q = input.trim();
    if (!isValidAddressParam(q)) {
      toast.error(t("search.invalidQuery"));
      return;
    }
    localStorage.setItem(STORAGE_KEY, q);
    navigate(`/address/${q}?role=payer`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div>
      <SeoHead
        title={t("pages.actionable.seoTitle")}
        description={t("pages.actionable.seoDescription")}
        path="/actionable"
      />
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("pages.actionable.title")}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-zinc-400">
        {t("pages.actionable.subtitle")}
      </p>

      <div className="relative mt-4 max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t("actionable.inputPlaceholder")}
          aria-label={t("actionable.inputAria")}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-accent"
        />
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-zinc-500">
        {t("pages.actionable.landingHint")}
      </p>
      <p className="mt-4 text-xs">
        <Link
          to="/guide"
          className="font-medium text-accent underline-offset-2 hover:underline"
        >
          {t("pages.actionable.linkGuide")}
        </Link>
      </p>
    </div>
  );
}
