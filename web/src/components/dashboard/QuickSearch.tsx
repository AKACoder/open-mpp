import { type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { pathFromSearchQuery } from "../../utils/searchNavigation";

export default function QuickSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const q = e.currentTarget.value.trim();
    const res = pathFromSearchQuery(q);
    if (!res.ok) {
      toast.error(t("search.invalidQuery"));
      return;
    }
    navigate(res.path);
    e.currentTarget.value = "";
  };

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
      <input
        type="text"
        onKeyDown={onKeyDown}
        placeholder={t("search.placeholderUnified")}
        className="h-11 w-full max-w-3xl rounded-xl border border-slate-200 bg-white pl-10 pr-4 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-accent"
        aria-label={t("search.aria")}
      />
    </div>
  );
}
