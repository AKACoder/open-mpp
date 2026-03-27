import { useTranslation } from "react-i18next";
import {
  useAnalyticsTimeseriesChannelsOpened,
  useAnalyticsTimeseriesEvents,
  useAnalyticsTimeseriesSettlementVolume,
} from "../../hooks/useAnalytics";
import type { AnalyticsAppliedFilters } from "./AnalyticsFilterBar";
import LoadingState from "../ui/LoadingState";
import { formatAmount, formatIntegerString } from "../../utils/format";
import ErrorState from "../ui/ErrorState";

interface Props {
  filters: AnalyticsAppliedFilters;
}

export default function AnalyticsTimeseriesSection({ filters }: Props) {
  const { t } = useTranslation();
  const enabled = !!(filters.from && filters.to);
  const base = {
    from: filters.from,
    to: filters.to,
    bucket: filters.bucket,
    c_chain_id: filters.chainId,
  };

  const opened = useAnalyticsTimeseriesChannelsOpened(base, { enabled });
  const events = useAnalyticsTimeseriesEvents(base, { enabled });
  const volParams = {
    ...base,
    c_token: filters.settlementToken || undefined,
  };
  const volume = useAnalyticsTimeseriesSettlementVolume(volParams, { enabled });

  if (!enabled) {
    return (
      <p className="text-sm text-slate-500 dark:text-zinc-500">
        {t("analytics.timeseriesNeedDates")}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <TimeseriesTable
        title={t("analytics.tsChannelsOpened")}
        loading={opened.isLoading}
        error={opened.error}
        onRetry={() => opened.refetch()}
        headers={[t("analytics.colBucket"), t("analytics.colChannelOpens")]}
        rows={(opened.data ?? []).map((r) => [
          r.bucket_start,
          formatIntegerString(r.channel_open_count),
        ])}
      />
      <TimeseriesEventsTable
        title={t("analytics.tsEvents")}
        loading={events.isLoading}
        error={events.error}
        onRetry={() => events.refetch()}
        rows={events.data ?? []}
      />
      <TimeseriesTable
        title={t("analytics.tsSettlementVolume")}
        loading={volume.isLoading}
        error={volume.error}
        onRetry={() => volume.refetch()}
        headers={[t("analytics.colBucket"), t("analytics.colDeltaSum")]}
        rows={(volume.data ?? []).map((r) => [
          r.bucket_start,
          formatAmount(r.sum_c_delta),
        ])}
      />
    </div>
  );
}

function TimeseriesTable({
  title,
  loading,
  error,
  onRetry,
  headers,
  rows,
}: {
  title: string;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  headers: [string, string];
  rows: [string, string][];
}) {
  if (error) return <ErrorState onRetry={onRetry} />;
  if (loading && rows.length === 0)
    return (
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          {title}
        </h3>
        <LoadingState />
      </div>
    );

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
        {title}
      </h3>
      <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
              <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                {headers[0]}
              </th>
              <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                {headers[1]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-3 py-4 text-center text-slate-500 dark:text-zinc-500"
                >
                  —
                </td>
              </tr>
            ) : (
              rows.map(([a, b]) => (
                <tr key={a}>
                  <td className="px-3 py-2 font-mono text-xs text-slate-700 dark:text-zinc-300">
                    {a}
                  </td>
                  <td className="px-3 py-2 font-mono tabular-nums">{b}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimeseriesEventsTable({
  title,
  loading,
  error,
  onRetry,
  rows,
}: {
  title: string;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  rows: { bucket_start: string; event_count: string; by_c_event_name: Record<string, string> }[];
}) {
  const { t } = useTranslation();
  if (error) return <ErrorState onRetry={onRetry} />;
  if (loading && rows.length === 0)
    return (
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          {title}
        </h3>
        <LoadingState />
      </div>
    );

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
        {title}
      </h3>
      <div className="mt-2 space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-zinc-500">—</p>
        ) : (
          rows.map((r) => (
            <div
              key={r.bucket_start}
              className="rounded-xl border border-slate-200 p-3 dark:border-zinc-800"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-xs text-slate-600 dark:text-zinc-400">
                  {r.bucket_start}
                </span>
                <span className="font-mono text-sm tabular-nums">
                  {t("analytics.colTotalEvents")}:{" "}
                  {formatIntegerString(r.event_count)}
                </span>
              </div>
              <ul className="mt-2 flex flex-wrap gap-1.5 text-xs">
                {Object.entries(r.by_c_event_name).map(([k, v]) => (
                  <li
                    key={k}
                    className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-zinc-800"
                  >
                    <span className="text-slate-600 dark:text-zinc-400">{k}</span>{" "}
                    {formatIntegerString(v)}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
