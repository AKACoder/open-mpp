import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BarChart3, List, BookOpen } from "lucide-react";
import { useAnalyticsSummary } from "../hooks/useAnalytics";
import KpiStrip from "../components/dashboard/KpiStrip";
import QuickSearch from "../components/dashboard/QuickSearch";
import ErrorState from "../components/ui/ErrorState";

export default function Home() {
  const { t } = useTranslation();
  const { data: summary, isLoading, error, refetch } = useAnalyticsSummary();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("pages.home.title")}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-zinc-400">
        {t("pages.home.subtitle")}
      </p>
      <p
        className="mt-2 max-w-2xl border-l-2 border-accent/40 pl-3 text-xs leading-relaxed text-slate-500 dark:text-zinc-500"
        title={t("session.termTooltip")}
      >
        {t("session.termShort")}
      </p>

      <div className="mt-6">
        {error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <KpiStrip summary={summary} isLoading={isLoading} />
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
          {t("pages.home.searchSection")}
        </h2>
        <div className="mt-3">
          <QuickSearch />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
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
