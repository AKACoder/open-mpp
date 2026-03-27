import { useTranslation } from "react-i18next";
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

  const set = (patch: Partial<AnalyticsAppliedFilters>) =>
    onChange({ ...value, ...patch });

  return (
    <div
      className={clsx(
        "flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40",
        className,
      )}
    >
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
          {t("analytics.filterChain")}
          <select
            value={value.chainId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              set({ chainId: v === "" ? undefined : Number(v) });
            }}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="">{t("analytics.allChains")}</option>
            {chains.map((c) => (
              <option key={c.c_chain_id} value={c.c_chain_id}>
                {c.c_chain_name} ({c.c_chain_id})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
          {t("analytics.filterFrom")}
          <input
            type="date"
            value={value.from}
            onChange={(e) => set({ from: e.target.value })}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
          {t("analytics.filterTo")}
          <input
            type="date"
            value={value.to}
            onChange={(e) => set({ to: e.target.value })}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
          {t("analytics.filterBucket")}
          <select
            value={value.bucket}
            onChange={(e) =>
              set({ bucket: e.target.value as AnalyticsTimeseriesBucket })
            }
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="day">{t("analytics.bucketDay")}</option>
            <option value="hour">{t("analytics.bucketHour")}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex min-w-[16rem] flex-1 flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
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

        <label className="flex cursor-pointer items-center gap-2 pt-6 text-sm text-slate-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={value.useSummaryRange}
            onChange={(e) => set({ useSummaryRange: e.target.checked })}
            className="rounded border-slate-300"
          />
          {t("analytics.applyRangeToSummary")}
        </label>
      </div>

      <p className="text-xs text-slate-500 dark:text-zinc-500">
        {t("analytics.bucketUtcNote")}
      </p>
    </div>
  );
}
