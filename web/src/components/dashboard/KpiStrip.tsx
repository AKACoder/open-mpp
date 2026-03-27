import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import { formatAmount, formatIntegerString, shortenAddress } from "../../utils/format";
import type { AnalyticsSummary } from "../../types/analytics";
import LoadingState from "../ui/LoadingState";

interface Props {
  summary: AnalyticsSummary | undefined;
  isLoading: boolean;
  /** From summary API when chain filter matches sync config */
  syncedHeightLabel?: string;
  /** Tighter cards for Analytics-first layout */
  compact?: boolean;
}

export default function KpiStrip({
  summary,
  isLoading,
  syncedHeightLabel,
  compact = false,
}: Props) {
  const { t } = useTranslation();

  if (isLoading && !summary) {
    return (
      <div className={compact ? "py-3" : "py-6"}>
        <LoadingState />
      </div>
    );
  }

  if (!summary) return null;

  const escrowEntries = Object.entries(summary.remaining_escrow_by_c_token ?? {});

  const pad = compact ? "p-3" : "p-4";
  const num = compact ? "text-xl" : "text-2xl";
  const gridGap = compact ? "gap-2" : "gap-3";

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
    <div className={clsx("grid sm:grid-cols-2 lg:grid-cols-3", gridGap)}>
      <div
        className={clsx(
          "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40",
          pad,
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 sm:text-xs">
          {t("kpi.activeChannels")}
        </p>
        <p
          className={clsx(
            "mt-0.5 font-mono font-semibold tabular-nums text-slate-900 dark:text-zinc-100",
            num,
          )}
        >
          {formatIntegerString(summary.active_channel_count)}
        </p>
      </div>
      <div
        className={clsx(
          "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40",
          pad,
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 sm:text-xs">
          {t("kpi.finalizedChannels")}
        </p>
        <p
          className={clsx(
            "mt-0.5 font-mono font-semibold tabular-nums text-slate-900 dark:text-zinc-100",
            num,
          )}
        >
          {formatIntegerString(summary.finalized_channel_count)}
        </p>
      </div>
      <div
        className={clsx(
          "rounded-xl border border-slate-200 bg-white shadow-sm sm:col-span-2 lg:col-span-1 dark:border-zinc-800 dark:bg-zinc-900/40",
          pad,
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 sm:text-xs">
          {t("kpi.remainingEscrow")}
        </p>
        {escrowEntries.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">—</p>
        ) : (
          <ul
            className={clsx(
              "mt-1.5 space-y-1 overflow-y-auto text-sm",
              compact ? "max-h-24" : "max-h-28 space-y-1.5",
            )}
          >
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
