import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAnalyticsSummary } from "../hooks/useAnalytics";
import { useMetaChains, useMetaSync } from "../hooks/useMeta";
import KpiStrip from "../components/dashboard/KpiStrip";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";

export default function Analytics() {
  const { t } = useTranslation();
  const summaryQuery = useAnalyticsSummary();
  const chainsQuery = useMetaChains();
  const syncQuery = useMetaSync();

  const metaFailed = !!(chainsQuery.error || syncQuery.error);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("pages.analytics.title")}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-zinc-400">
        {t("pages.analytics.subtitle")}
      </p>

      <div className="mt-6">
        {summaryQuery.error ? (
          <ErrorState onRetry={() => summaryQuery.refetch()} />
        ) : (
          <KpiStrip
            summary={summaryQuery.data}
            isLoading={summaryQuery.isLoading}
          />
        )}
      </div>

      {metaFailed ? (
        <div className="mt-10">
          <ErrorState
            onRetry={() => {
              chainsQuery.refetch();
              syncQuery.refetch();
            }}
          />
        </div>
      ) : (
        <>
          <section className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight">
              {t("pages.analytics.syncTitle")}
            </h2>
            {syncQuery.isLoading && syncQuery.data === undefined ? (
              <div className="mt-4">
                <LoadingState />
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                        {t("pages.analytics.colChain")}
                      </th>
                      <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                        {t("pages.analytics.colSyncedHeight")}
                      </th>
                      <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                        {t("pages.analytics.colContracts")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {(syncQuery.data ?? []).map((row) => (
                      <tr key={row.c_chain_id}>
                        <td className="px-3 py-2 font-mono text-xs">
                          {row.c_chain_id}
                        </td>
                        <td className="px-3 py-2 font-mono tabular-nums">
                          {row.c_synced_height.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-slate-600 dark:text-zinc-400">
                          {(row.c_contracts ?? []).join(", ") || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight">
              {t("pages.analytics.chainsTitle")}
            </h2>
            {chainsQuery.isLoading && chainsQuery.data === undefined ? (
              <div className="mt-4">
                <LoadingState />
              </div>
            ) : (
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-zinc-400">
                {(chainsQuery.data ?? []).map((c) => (
                  <li key={c.c_chain_id}>
                    <span className="font-medium text-slate-800 dark:text-zinc-200">
                      {c.c_chain_name}
                    </span>{" "}
                    <span className="font-mono text-xs">({c.c_chain_id})</span>{" "}
                    · {c.c_chain_symbol}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="mt-10 text-sm text-slate-500 dark:text-zinc-500">
            {t("pages.analytics.phaseBNote")}{" "}
            <Link to="/channels" className="text-accent underline-offset-2 hover:underline">
              {t("nav.allChannels")}
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}
