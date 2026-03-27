import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import type { UseQueryResult } from "@tanstack/react-query";
import { useAnalyticsSummary } from "../hooks/useAnalytics";
import { useMetaChains, useMetaSync } from "../hooks/useMeta";
import KpiStrip from "../components/dashboard/KpiStrip";
import AnalyticsHistoryChartsSection from "../components/analytics/AnalyticsHistoryChartsSection";
import AnalyticsRankingsSection from "../components/analytics/AnalyticsRankingsSection";
import AnalyticsBreakdownSection from "../components/analytics/AnalyticsBreakdownSection";
import AnalyticsSectionNav from "../components/analytics/AnalyticsSectionNav";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import { defaultAnalyticsPageFilters } from "../utils/analyticsDefaults";
import {
  analyticsViewFromSearchParams,
  applyAnalyticsViewToSearchParams,
  type AnalyticsPageView,
} from "../utils/analyticsUrlState";
import { SYNC_REFETCH_INTERVAL_MS } from "../config/queryPolicies";
import SeoHead from "../components/seo/SeoHead";
import IndexerSyncStrip from "../components/analytics/IndexerSyncStrip";
import type { ChainMetadataRow, SyncConfigRow } from "../types/meta";

export default function Analytics() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => defaultAnalyticsPageFilters(), []);

  const pageView = useMemo(
    () => analyticsViewFromSearchParams(searchParams),
    [searchParams],
  );

  useEffect(() => {
    let dirty = false;
    for (const key of searchParams.keys()) {
      if (key !== "view") {
        dirty = true;
        break;
      }
    }
    if (!dirty) return;
    const sp = new URLSearchParams();
    applyAnalyticsViewToSearchParams(
      sp,
      analyticsViewFromSearchParams(searchParams),
    );
    setSearchParams(sp, { replace: true });
  }, [searchParams, setSearchParams]);

  const setPageView = (next: AnalyticsPageView) => {
    const sp = new URLSearchParams();
    applyAnalyticsViewToSearchParams(sp, next);
    setSearchParams(sp, { replace: true });
  };

  const summaryParams = useMemo(
    () => ({ c_chain_id: filters.chainId }),
    [filters.chainId],
  );

  const summaryQuery = useAnalyticsSummary(summaryParams, {
    refetchInterval: SYNC_REFETCH_INTERVAL_MS,
  });
  const chainsQuery = useMetaChains();
  const syncQuery = useMetaSync();

  const metaFailed = !!(chainsQuery.error || syncQuery.error);

  const indexerSection = (
    <IndexerSyncChainsSection
      metaFailed={metaFailed}
      syncQuery={syncQuery}
      chainsQuery={chainsQuery}
      onRetryMeta={() => {
        chainsQuery.refetch();
        syncQuery.refetch();
      }}
    />
  );

  const kpiBlock =
    summaryQuery.error ? (
      <ErrorState onRetry={() => summaryQuery.refetch()} />
    ) : (
      <>
        <KpiStrip
          summary={summaryQuery.data}
          isLoading={summaryQuery.isLoading}
          compact
        />
      </>
    );

  const mainPanel = (() => {
    switch (pageView) {
      case "history":
        return (
          <>
            {kpiBlock}
            <section className="mt-6">
              <h2 className="text-lg font-semibold tracking-tight">
                {t("analytics.sectionHistory")}
              </h2>
              <div className="mt-4">
                <AnalyticsHistoryChartsSection filters={filters} />
              </div>
            </section>
          </>
        );
      case "rankings":
        return (
          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              {t("analytics.sectionRankings")}
            </h2>
            <div className="mt-4">
              <AnalyticsRankingsSection filters={filters} variant="full" />
            </div>
          </section>
        );
      case "breakdown":
        return (
          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              {t("analytics.sectionBreakdown")}
            </h2>
            <div className="mt-4">
              <AnalyticsBreakdownSection
                filters={filters}
                chains={chainsQuery.data ?? []}
              />
            </div>
          </section>
        );
      case "indexer":
        return <div>{indexerSection}</div>;
    }
  })();

  return (
    <div>
      <SeoHead
        title={t("pages.analytics.seoTitle")}
        description={t("pages.analytics.seoDescription")}
        path={pathname}
      />
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("pages.analytics.title")}
      </h1>
      <div className="mt-2 flex flex-wrap items-end justify-end gap-x-4 gap-y-2">
        <IndexerSyncStrip
          className="max-w-full shrink-0 sm:max-w-[20rem] sm:justify-end"
          syncRows={syncQuery.data}
          chains={chainsQuery.data}
          isLoading={syncQuery.isLoading}
          loadError={!!syncQuery.error}
          aria-label={t("pages.analytics.syncStripAria")}
        />
      </div>

      <div className="mt-3">
        <AnalyticsSectionNav active={pageView} onChange={setPageView} />
      </div>

      <div className="mt-6" role="tabpanel">
        {mainPanel}
      </div>
    </div>
  );
}

function IndexerSyncChainsSection({
  metaFailed,
  syncQuery,
  chainsQuery,
  onRetryMeta,
}: {
  metaFailed: boolean;
  syncQuery: UseQueryResult<SyncConfigRow[]>;
  chainsQuery: UseQueryResult<ChainMetadataRow[]>;
  onRetryMeta: () => void;
}) {
  const { t } = useTranslation();

  if (metaFailed) {
    return (
      <div className="mt-2">
        <ErrorState onRetry={onRetryMeta} />
      </div>
    );
  }

  return (
    <>
      <p className="text-xs text-slate-500 dark:text-zinc-500">
        {t("pages.analytics.indexerDetailIntro")}
      </p>
      <section className="mt-4">
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
                <span className="font-mono text-xs">({c.c_chain_id})</span> ·{" "}
                {c.c_chain_symbol}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-10 text-sm text-slate-500 dark:text-zinc-500">
        {t("pages.analytics.phaseBNote")}{" "}
        <Link
          to="/channels"
          className="text-accent underline-offset-2 hover:underline"
        >
          {t("nav.allChannels")}
        </Link>
        .
      </p>
    </>
  );
}
