import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const btn =
  "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors";
const btnEnabled =
  "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800";
const btnDisabled =
  "cursor-not-allowed border-slate-100 text-slate-300 dark:border-zinc-800 dark:text-zinc-700";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        disabled={!hasPrev}
        onClick={() => hasPrev && onPageChange(currentPage - 1)}
        className={clsx(btn, hasPrev ? btnEnabled : btnDisabled)}
      >
        <ChevronLeft className="size-4" />
        {t("pagination.prev")}
      </button>

      <span className="text-sm tabular-nums text-slate-500 dark:text-zinc-500">
        {t("pagination.info", { current: currentPage, total: totalPages })}
      </span>

      <button
        disabled={!hasNext}
        onClick={() => hasNext && onPageChange(currentPage + 1)}
        className={clsx(btn, hasNext ? btnEnabled : btnDisabled)}
      >
        {t("pagination.next")}
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
