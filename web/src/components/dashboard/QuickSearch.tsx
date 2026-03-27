import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

export default function QuickSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !e.currentTarget.value.trim()) return;
    const q = e.currentTarget.value.trim();
    if (/^0x[0-9a-fA-F]{64}$/.test(q)) {
      navigate(`/channel/${q}`);
    } else {
      navigate(`/address/payer/${q}`);
    }
    e.currentTarget.value = "";
  };

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
      <input
        type="text"
        onKeyDown={onKeyDown}
        placeholder={t("search.placeholder")}
        className="h-11 w-full max-w-xl rounded-xl border border-slate-200 bg-white pl-10 pr-4 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-accent"
        aria-label={t("search.aria")}
      />
      <p className="mt-2 text-xs text-slate-500 dark:text-zinc-500">
        {t("search.payeeHint")}
      </p>
    </div>
  );
}
