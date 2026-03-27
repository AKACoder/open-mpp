import { useTranslation } from "react-i18next";
import type { AnalyticsSummary } from "../../types/analytics";
import { formatAmount, formatIntegerString } from "../../utils/format";

interface Props {
  summary: AnalyticsSummary | undefined;
}

export default function SummaryRangePanel({ summary }: Props) {
  const { t } = useTranslation();

  if (
    !summary?.event_count_in_range &&
    !summary?.settlement_volume_in_range &&
    !summary?.events_by_c_event_name
  ) {
    return (
      <p className="mt-4 text-xs text-slate-500 dark:text-zinc-500">
        {t("analytics.rangeHint")}
      </p>
    );
  }

  const byName = summary.events_by_c_event_name ?? {};

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
        {t("analytics.rangeMetricsTitle")}
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            {t("analytics.eventsInRange")}
          </p>
          <p className="mt-1 font-mono text-lg tabular-nums">
            {summary.event_count_in_range != null
              ? formatIntegerString(summary.event_count_in_range)
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            {t("analytics.settlementVolumeInRange")}
          </p>
          <p className="mt-1 font-mono text-lg tabular-nums">
            {summary.settlement_volume_in_range != null
              ? formatAmount(summary.settlement_volume_in_range)
              : "—"}
          </p>
        </div>
      </div>
      {Object.keys(byName).length > 0 && (
        <div className="mt-4">
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
