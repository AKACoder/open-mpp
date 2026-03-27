import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ChainMetadataRow, SyncConfigRow } from "../../types/meta";
import { clsx } from "clsx";

function labelForChain(
  chains: ChainMetadataRow[] | undefined,
  chainId: string,
) {
  const row = chains?.find((c) => String(c.c_chain_id) === String(chainId));
  const name = row?.c_chain_name?.trim();
  return name || `Chain ${chainId}`;
}

interface Props {
  syncRows: SyncConfigRow[] | undefined;
  chains: ChainMetadataRow[] | undefined;
  isLoading: boolean;
  loadError: boolean;
  className?: string;
  "aria-label"?: string;
}

/** Compact per-chain sync height (Overview / Analytics toolbar). */
export default function IndexerSyncStrip({
  syncRows,
  chains,
  isLoading,
  loadError,
  className,
  "aria-label": ariaLabel,
}: Props) {
  const { t } = useTranslation();

  const items = useMemo(() => {
    if (!syncRows?.length) return [];
    return syncRows.map((r) => ({
      id: String(r.c_chain_id),
      label: labelForChain(chains, String(r.c_chain_id)),
      height: r.c_synced_height.toLocaleString(),
    }));
  }, [syncRows, chains]);

  return (
    <aside
      aria-label={ariaLabel}
      className={clsx(
        "rounded-lg border border-slate-200 bg-slate-50/90 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900/50",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
          {t("pages.home.syncStripTitle")}
        </span>
        {loadError ? (
          <span className="text-xs text-slate-600 dark:text-zinc-400">
            {t("analytics.indexerSyncErrorShort")}
          </span>
        ) : isLoading && !syncRows?.length ? (
          <span className="text-xs text-slate-500 dark:text-zinc-500">…</span>
        ) : items.length === 0 ? (
          <span className="text-xs text-slate-500 dark:text-zinc-500">—</span>
        ) : (
          items.map((it) => (
            <span
              key={it.id}
              className="text-xs text-slate-800 dark:text-zinc-200"
            >
              <span className="font-medium">{it.label}</span>
              <span className="mx-1 text-slate-400 dark:text-zinc-600">·</span>
              <span className="font-mono tabular-nums">{it.height}</span>
            </span>
          ))
        )}
      </div>
      <p className="mt-1 text-[10px] leading-snug text-slate-500 dark:text-zinc-500">
        {t("pages.home.syncStripNote")}
      </p>
    </aside>
  );
}
