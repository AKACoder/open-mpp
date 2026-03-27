import { useTranslation } from "react-i18next";

/** Metric definitions for Guide FAQ (was collapsible block on Analytics). */
export default function AnalyticsMetricsDefinitions() {
  const { t } = useTranslation();

  const items: { term: string; body: string }[] = [
    {
      term: t("analytics.glossary.remainingEscrowTerm"),
      body: t("analytics.glossary.remainingEscrowBody"),
    },
    {
      term: t("analytics.glossary.settlementVolumeTerm"),
      body: t("analytics.glossary.settlementVolumeBody"),
    },
    {
      term: t("analytics.glossary.bucketUtcTerm"),
      body: t("analytics.glossary.bucketUtcBody"),
    },
    {
      term: t("analytics.glossary.eventsByNameTerm"),
      body: t("analytics.glossary.eventsByNameBody"),
    },
    {
      term: t("analytics.glossary.syncedHeightTerm"),
      body: t("analytics.glossary.syncedHeightBody"),
    },
    {
      term: t("analytics.glossary.rankingMetricTerm"),
      body: t("analytics.glossary.rankingMetricBody"),
    },
  ];

  return (
    <div className="text-sm text-slate-600 dark:text-zinc-400">
      <p className="mb-3 text-xs text-slate-500 dark:text-zinc-500">
        {t("guide.analyticsMetricsIntro")}
      </p>
      <dl className="space-y-3">
        {items.map(({ term, body }) => (
          <div key={term}>
            <dt className="font-medium text-slate-800 dark:text-zinc-200">
              {term}
            </dt>
            <dd className="mt-0.5 text-xs leading-relaxed">{body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
