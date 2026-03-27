import { useTranslation } from "react-i18next";
import { formatAmount, shortenAddress } from "../../utils/format";
import type { AnalyticsSummary } from "../../types/analytics";
import LoadingState from "../ui/LoadingState";

interface Props {
  summary: AnalyticsSummary | undefined;
  isLoading: boolean;
  /** From summary API when chain filter matches sync config */
  syncedHeightLabel?: string;
}

export default function KpiStrip({
  summary,
  isLoading,
  syncedHeightLabel,
}: Props) {
  const { t } = useTranslation();

  if (isLoading && !summary) {
    return (
      <div className="py-6">
        <LoadingState />
      </div>
    );
  }

  if (!summary) return null;

  const escrowEntries = Object.entries(summary.remaining_escrow_by_c_token ?? {});

  return (
    <div className="space-y-3">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
          {t("kpi.activeChannels")}
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-zinc-100">
          {summary.active_channel_count}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
          {t("kpi.finalizedChannels")}
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-zinc-100">
          {summary.finalized_channel_count}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2 lg:col-span-1 dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
          {t("kpi.remainingEscrow")}
        </p>
        {escrowEntries.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">—</p>
        ) : (
          <ul className="mt-2 max-h-28 space-y-1.5 overflow-y-auto text-sm">
            {escrowEntries.map(([token, raw]) => (
              <li
                key={token}
                className="flex items-center justify-between gap-2 font-mono tabular-nums"
              >
                <span className="text-slate-500 dark:text-zinc-400" title={token}>
                  {shortenAddress(token, 6)}
                </span>
                <span className="font-medium text-slate-800 dark:text-zinc-200">
                  {formatAmount(raw)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
      {syncedHeightLabel ? (
        <p className="text-xs text-slate-500 dark:text-zinc-500">
          {syncedHeightLabel}
        </p>
      ) : null}
    </div>
  );
}
