import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import type { AnalyticsPageView } from "../../utils/analyticsUrlState";

const VIEWS: readonly AnalyticsPageView[] = [
  "history",
  "rankings",
  "breakdown",
  "indexer",
];

interface Props {
  active: AnalyticsPageView;
  onChange: (v: AnalyticsPageView) => void;
}

export default function AnalyticsSectionNav({ active, onChange }: Props) {
  const { t } = useTranslation();

  const label = (id: AnalyticsPageView) => {
    switch (id) {
      case "history":
        return t("analytics.navHistory");
      case "rankings":
        return t("analytics.navRankings");
      case "breakdown":
        return t("analytics.navBreakdown");
      case "indexer":
        return t("analytics.navIndexer");
    }
  };

  return (
    <div
      className={clsx(
        "sticky top-14 z-30 -mx-4 border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 sm:-mx-6 sm:px-6",
        "lg:static lg:z-auto lg:mx-0 lg:mt-4 lg:rounded-lg lg:border lg:border-slate-200 lg:bg-slate-50/80 lg:p-1 lg:backdrop-blur-none dark:lg:border-zinc-800 dark:lg:bg-zinc-900/50",
      )}
      role="tablist"
      aria-label={t("analytics.tabListAria")}
    >
      <div className="flex gap-0.5 overflow-x-auto pb-0.5 sm:gap-1 lg:flex-wrap">
        {VIEWS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            onClick={() => onChange(id)}
            className={clsx(
              "shrink-0 rounded-md px-2.5 py-2 text-center text-xs font-medium transition-colors sm:px-3 sm:text-sm",
              active === id
                ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
          >
            {label(id)}
          </button>
        ))}
      </div>
    </div>
  );
}
