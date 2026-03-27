import { useTranslation } from "react-i18next";
import { useChannelEventsSummary } from "../../hooks/useChannels";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

interface Props {
  channelId: string;
}

export default function ChannelEventsSummaryPanel({ channelId }: Props) {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useChannelEventsSummary(
    channelId,
    { retry: 1 },
  );

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 p-4 dark:border-zinc-800">
        <ErrorState
          message={t("detail.eventsSummaryError")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="py-8">
        <LoadingState />
      </div>
    );
  }

  if (!data) return null;

  const counts = data.event_counts ?? {};
  const hasCounts = Object.keys(counts).length > 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
      <h2 className="text-lg font-semibold tracking-tight">
        {t("detail.eventsSummaryTitle")}
      </h2>

      {!hasCounts &&
      data.min_c_block_number == null &&
      data.max_c_block_number == null ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-zinc-500">
          {t("detail.eventsSummaryEmpty")}
        </p>
      ) : (
        <>
          {hasCounts && (
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {Object.entries(counts).map(([name, n]) => (
                <li
                  key={name}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 dark:bg-zinc-800"
                >
                  <span className="font-medium text-slate-700 dark:text-zinc-300">
                    {name}
                  </span>{" "}
                  <span className="font-mono tabular-nums text-slate-600 dark:text-zinc-400">
                    {n}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {(data.min_c_block_number != null ||
            data.max_c_block_number != null) && (
            <dl className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-zinc-400 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-500">
                  {t("detail.eventsSummaryBlockRange")}
                </dt>
                <dd className="mt-0.5 font-mono">
                  {data.min_c_block_number ?? "—"} —{" "}
                  {data.max_c_block_number ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-500">
                  {t("detail.eventsSummaryTimeRange")}
                </dt>
                <dd className="mt-0.5 text-xs">
                  {data.min_c_block_timestamp ?? "—"} —{" "}
                  {data.max_c_block_timestamp ?? "—"}
                </dd>
              </div>
            </dl>
          )}
        </>
      )}
    </div>
  );
}
