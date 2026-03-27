import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import type { ChainMetadataRow } from "../../types/meta";
import type {
  AnalyticsAppliedFilters,
  AnalyticsTimeseriesBucket,
} from "../../types/analytics";
import { clsx } from "clsx";

export type { AnalyticsAppliedFilters };

interface Props {
  chains: ChainMetadataRow[];
  value: AnalyticsAppliedFilters;
  onChange: (next: AnalyticsAppliedFilters) => void;
  className?: string;
}

export default function AnalyticsFilterBar({
  chains,
  value,
  onChange,
  className,
}: Props) {
  const { t } = useTranslation();
  const [advancedOpen, setAdvancedOpen] = useState(
    () => Boolean(value.settlementToken) || value.useSummaryRange,
  );

  const set = (patch: Partial<AnalyticsAppliedFilters>) =>
    onChange({ ...value, ...patch });

  return (
    <div
      className={clsx(
        "rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40",
        className,
      )}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
          {t("analytics.filterChain")}
          <select
            value={value.chainId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              set({ chainId: v === "" ? undefined : Number(v) });
            }}
            className="h-9 w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="">{t("analytics.allChains")}</option>
            {chains.map((c) => (
              <option key={c.c_chain_id} value={c.c_chain_id}>
                {c.c_chain_name} ({c.c_chain_id})
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
          {t("analytics.filterFrom")}
          <input
            type="date"
            value={value.from}
            onChange={(e) => set({ from: e.target.value })}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
          {t("analytics.filterTo")}
          <input
            type="date"
            value={value.to}
            onChange={(e) => set({ to: e.target.value })}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
          {t("analytics.filterBucket")}
          <select
            value={value.bucket}
            onChange={(e) =>
              set({ bucket: e.target.value as AnalyticsTimeseriesBucket })
            }
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="day">{t("analytics.bucketDay")}</option>
            <option value="hour">{t("analytics.bucketHour")}</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={() => setAdvancedOpen((o) => !o)}
        aria-expanded={advancedOpen}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800/80"
      >
        <ChevronDown
          className={clsx(
            "size-4 transition-transform",
            advancedOpen && "rotate-180",
          )}
        />
        {t("analytics.advancedFilters")}
      </button>

      {advancedOpen ? (
        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-zinc-800">
          <label className="flex max-w-xl flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
            {t("analytics.filterSettlementToken")}
            <input
              type="text"
              placeholder={t("analytics.tokenPlaceholder")}
              value={value.settlementToken}
              onChange={(e) =>
                set({ settlementToken: e.target.value.trim().toLowerCase() })
              }
              className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={value.useSummaryRange}
              onChange={(e) => set({ useSummaryRange: e.target.checked })}
              className="rounded border-slate-300"
            />
            {t("analytics.applyRangeToSummary")}
          </label>
          <p className="mt-2 text-xs text-slate-500 dark:text-zinc-500">
            {t("analytics.bucketUtcNote")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
