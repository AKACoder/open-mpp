import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import type { AnalyticsSummary } from "../../types/analytics";
import { formatAmount, formatIntegerString } from "../../utils/format";

interface Props {
  summary: AnalyticsSummary | undefined;
  compact?: boolean;
}

export default function SummaryRangePanel({
  summary,
  compact = false,
}: Props) {
  const { t } = useTranslation();

  if (
    !summary?.event_count_in_range &&
    !summary?.settlement_volume_in_range &&
    !summary?.events_by_c_event_name
  ) {
    return (
      <p
        className={clsx(
          "text-xs text-slate-500 dark:text-zinc-500",
          compact ? "mt-2" : "mt-4",
        )}
      >
        {t("analytics.rangeHint")}
      </p>
    );
  }

  const byName = summary.events_by_c_event_name ?? {};

  return (
    <div
      className={clsx(
        "rounded-xl border border-slate-200 bg-slate-50/80 dark:border-zinc-800 dark:bg-zinc-900/30",
        compact ? "mt-2 p-3" : "mt-4 p-4",
      )}
    >
      <h3
        className={clsx(
          "font-semibold text-slate-800 dark:text-zinc-200",
          compact ? "text-xs" : "text-sm",
        )}
      >
        {t("analytics.rangeMetricsTitle")}
      </h3>
      <div className={clsx("grid sm:grid-cols-2", compact ? "mt-2 gap-2" : "mt-3 gap-3")}>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            {t("analytics.eventsInRange")}
          </p>
          <p
            className={clsx(
              "mt-1 font-mono tabular-nums",
              compact ? "text-base" : "text-lg",
            )}
          >
            {summary.event_count_in_range != null
              ? formatIntegerString(summary.event_count_in_range)
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            {t("analytics.settlementVolumeInRange")}
          </p>
          <p
            className={clsx(
              "mt-1 font-mono tabular-nums",
              compact ? "text-base" : "text-lg",
            )}
          >
            {summary.settlement_volume_in_range != null
              ? formatAmount(summary.settlement_volume_in_range)
              : "—"}
          </p>
        </div>
      </div>
      {Object.keys(byName).length > 0 && (
        <div className={compact ? "mt-3" : "mt-4"}>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            {t("analytics.eventsByName")}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {Object.entries(byName).map(([name, count]) => (
              <li
                key={name}
                className="rounded-md bg-white px-2 py-1 font-mono dark:bg-zinc-800"
              >
                <span className="text-slate-600 dark:text-zinc-400">{name}</span>{" "}
                <span className="tabular-nums text-slate-900 dark:text-zinc-100">
                  {formatIntegerString(count)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
