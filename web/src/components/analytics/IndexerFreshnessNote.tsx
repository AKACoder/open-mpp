import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { SyncConfigRow } from "../../types/meta";
import { clsx } from "clsx";

interface Props {
  syncRows: SyncConfigRow[] | undefined;
  isLoading: boolean;
  loadError: boolean;
  /** When set, highlight this chain’s synced height if present in `syncRows`. */
  chainId?: number;
  className?: string;
  /** Optional a11y name (e.g. home vs analytics page context). */
  "aria-label"?: string;
}

export default function IndexerFreshnessNote({
  syncRows,
  isLoading,
  loadError,
  chainId,
  className,
  "aria-label": ariaLabel,
}: Props) {
  const { t } = useTranslation();

  const summaryLine = useMemo(() => {
    if (!syncRows?.length) return null;
    if (chainId != null) {
      const row = syncRows.find((r) => Number(r.c_chain_id) === chainId);
      if (row) {
        return t("analytics.indexerSyncSelectedChain", {
          chain: row.c_chain_id,
          height: row.c_synced_height.toLocaleString(),
        });
      }
    }
    return t("analytics.indexerSyncAllChains", {
      list: syncRows
        .map(
          (r) =>
            `${r.c_chain_id}: ${r.c_synced_height.toLocaleString()}`,
        )
        .join(" · "),
    });
  }, [chainId, syncRows, t]);

  return (
    <aside
      aria-label={ariaLabel}
      className={clsx(
        "rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-xs leading-relaxed text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100/90",
        className,
      )}
    >
      <p className="font-medium text-amber-900 dark:text-amber-100">
        {t("analytics.indexerNotRealtime")}
      </p>
      {loadError ? (
        <p className="mt-1.5 text-amber-800/90 dark:text-amber-200/80">
          {t("analytics.indexerSyncErrorShort")}
        </p>
      ) : isLoading && !syncRows?.length ? (
        <p className="mt-1.5 text-amber-800/90 dark:text-amber-200/80">{t("analytics.indexerSyncLoading")}</p>
      ) : summaryLine ? (
        <p className="mt-1.5 font-mono text-[0.7rem] text-amber-900/85 dark:text-amber-100/85 sm:text-xs">
          {summaryLine}
        </p>
      ) : null}
    </aside>
  );
}
