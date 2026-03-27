import { useTranslation } from "react-i18next";
import type { TimeseriesEventsRow } from "../../types/analytics";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

interface Props {
  rows: TimeseriesEventsRow[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  errorMessage?: string;
}

export default function PayerEventsTimeseries({
  rows,
  isLoading,
  error,
  onRetry,
  errorMessage,
}: Props) {
  const { t } = useTranslation();

  if (error) {
    return (
      <ErrorState message={errorMessage} onRetry={onRetry} />
    );
  }

  if (isLoading && !rows?.length) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-3">
      {!rows?.length ? (
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
                {t("analytics.colTotalEvents")}: {r.event_count}
              </span>
            </div>
            <ul className="mt-2 flex flex-wrap gap-1.5 text-xs">
              {Object.entries(r.by_c_event_name).map(([k, v]) => (
                <li
                  key={k}
                  className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-zinc-800"
                >
                  <span className="text-slate-600 dark:text-zinc-400">{k}</span>{" "}
                  {v}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
