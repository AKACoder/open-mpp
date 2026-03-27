import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

interface Props {
  className?: string;
}

export default function AnalyticsMetricsGlossary({ className }: Props) {
  const { t } = useTranslation();

  const items: { term: string; body: string }[] = [
    { term: t("analytics.glossary.remainingEscrowTerm"), body: t("analytics.glossary.remainingEscrowBody") },
    { term: t("analytics.glossary.settlementVolumeTerm"), body: t("analytics.glossary.settlementVolumeBody") },
    { term: t("analytics.glossary.bucketUtcTerm"), body: t("analytics.glossary.bucketUtcBody") },
    { term: t("analytics.glossary.eventsByNameTerm"), body: t("analytics.glossary.eventsByNameBody") },
    { term: t("analytics.glossary.syncedHeightTerm"), body: t("analytics.glossary.syncedHeightBody") },
    { term: t("analytics.glossary.rankingMetricTerm"), body: t("analytics.glossary.rankingMetricBody") },
  ];

  return (
    <details
      className={clsx(
        "rounded-xl border border-slate-200 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/30",
        className,
      )}
    >
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-800 dark:text-zinc-200">
        {t("analytics.metricsGlossaryTitle")}
      </summary>
      <div className="border-t border-slate-200 px-4 pb-4 pt-3 text-sm text-slate-600 dark:border-zinc-800 dark:text-zinc-400">
        <p className="mb-3 text-xs text-slate-500 dark:text-zinc-500">
          {t("analytics.glossary.amountsNote")}
        </p>
        <dl className="space-y-3">
          {items.map(({ term, body }) => (
            <div key={term}>
              <dt className="font-medium text-slate-800 dark:text-zinc-200">{term}</dt>
              <dd className="mt-0.5 text-xs leading-relaxed">{body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </details>
  );
}
