import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BarChart3, List, BookOpen } from "lucide-react";
import { useAnalyticsSummary } from "../hooks/useAnalytics";
import { useMetaChains, useMetaSync } from "../hooks/useMeta";
import KpiStrip from "../components/dashboard/KpiStrip";
import QuickSearch from "../components/dashboard/QuickSearch";
import ErrorState from "../components/ui/ErrorState";
import IndexerSyncStrip from "../components/analytics/IndexerSyncStrip";

const OverviewChartsSection = lazy(
  () => import("../components/dashboard/OverviewChartsSection"),
);

function OverviewChartsSkeleton() {
  return (
    <div
      className="mt-4 grid min-h-[220px] gap-4 md:grid-cols-2"
      aria-busy="true"
    >
      <div className="h-[260px] animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 dark:border-zinc-800 dark:bg-zinc-900/40" />
      <div className="h-[260px] animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 dark:border-zinc-800 dark:bg-zinc-900/40" />
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { data: summary, isLoading, error, refetch } = useAnalyticsSummary();
  const syncQuery = useMetaSync();
  const chainsQuery = useMetaChains();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("pages.home.title")}
      </h1>
      <p className="mt-2 flex max-w-2xl flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-zinc-400">
        <span>{t("pages.home.subtitle")}</span>
        <Link
          to="/guide"
          className="text-xs font-medium text-accent underline-offset-2 hover:underline"
        >
          {t("pages.home.scopeLink")}
        </Link>
      </p>

      <div className="mt-5 flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-4">
        <div className="min-w-0 flex-1">
          <QuickSearch />
        </div>
        <IndexerSyncStrip
          className="shrink-0 sm:max-w-[min(100%,18rem)] sm:justify-end"
          syncRows={syncQuery.data}
          chains={chainsQuery.data}
          isLoading={syncQuery.isLoading}
          loadError={!!syncQuery.error}
          aria-label={t("pages.home.indexerFreshnessAria")}
        />
      </div>

      <section
        className="mt-10 w-full"
        aria-labelledby="home-charts-heading"
      >
        <h2
          id="home-charts-heading"
          className="text-lg font-semibold tracking-tight"
        >
          {t("pages.home.chartsSection")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-zinc-400">
          {t("pages.home.chartsIntro")}
        </p>
        <Suspense fallback={<OverviewChartsSkeleton />}>
          <OverviewChartsSection />
        </Suspense>
      </section>

      <div className="mt-12 w-full">
        {error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <KpiStrip summary={summary} isLoading={isLoading} />
        )}
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("pages.home.exploreSection")}
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/channels"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:border-accent/50 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800/80"
          >
            <List className="size-4 text-accent" />
            {t("nav.allChannels")}
          </Link>
          <Link
            to="/analytics"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:border-accent/50 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800/80"
          >
            <BarChart3 className="size-4 text-accent" />
            {t("nav.analytics")}
          </Link>
          <Link
            to="/guide"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:border-accent/50 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800/80"
          >
            <BookOpen className="size-4 text-accent" />
            {t("nav.guide")}
          </Link>
        </div>
      </section>
    </div>
  );
}
