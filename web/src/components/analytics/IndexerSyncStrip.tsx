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

/** Per-chain synced height — inline metadata (Overview beside search, Analytics in hero row). */
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
        "inline-flex max-w-full flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[11px] leading-snug text-slate-500 dark:text-zinc-500",
        className,
      )}
    >
      <span className="shrink-0 text-slate-400 dark:text-zinc-600">
        {t("pages.home.syncStripTitle")}
      </span>
      {loadError ? (
        <span className="text-slate-600 dark:text-zinc-400">
          {t("analytics.indexerSyncErrorShort")}
        </span>
      ) : isLoading && !syncRows?.length ? (
        <span>…</span>
      ) : items.length === 0 ? (
        <span>—</span>
      ) : (
        items.map((it) => (
          <span key={it.id} className="text-slate-600 dark:text-zinc-400">
            <span className="font-medium text-slate-700 dark:text-zinc-300">
              {it.label}
            </span>
            <span className="mx-1 text-slate-300 dark:text-zinc-600">·</span>
            <span className="font-mono tabular-nums">{it.height}</span>
          </span>
        ))
      )}
    </aside>
  );
}
