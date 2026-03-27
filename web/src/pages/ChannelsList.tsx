import { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ClipboardCopy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { useFilteredChannels } from "../hooks/useChannels";
import { useMetaChains } from "../hooks/useMeta";
import ChannelList from "../components/channel/ChannelList";
import Pagination from "../components/ui/Pagination";
import ErrorState from "../components/ui/ErrorState";
import SeoHead from "../components/seo/SeoHead";
import {
  channelsListFromSearchParams,
  channelsListToSearchParams,
  channelsListToApiFilters,
  channelsListStateWithPatch,
  type ChannelsListUrlState,
} from "../utils/channelsUrlState";
import { channelsPageToTsv } from "../utils/channelsTsv";
import type { ChannelStatus } from "../types/channel";

const PAGE_SIZE = 20;

const STATUS_ORDER: ChannelStatus[] = [
  "open",
  "close_requested",
  "closed",
  "expired",
];

function toggleStatus(
  current: ChannelStatus[],
  st: ChannelStatus,
): ChannelStatus[] {
  if (current.includes(st)) return current.filter((x) => x !== st);
  return [...current, st].sort((a, b) => a.localeCompare(b));
}

/** Paginated channel list: filters + `?finalized=1` per API. */
export default function ChannelsList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const chainsQuery = useMetaChains();

  const listState = useMemo(
    () => channelsListFromSearchParams(searchParams),
    [searchParams],
  );

  const apiFilters = useMemo(
    () => channelsListToApiFilters(listState),
    [listState],
  );

  const applyPatch = useCallback(
    (patch: Partial<ChannelsListUrlState> & { page?: number }) => {
      const next = channelsListStateWithPatch(listState, patch);
      setSearchParams(channelsListToSearchParams(next), { replace: true });
    },
    [listState, setSearchParams],
  );

  const listQuery = useFilteredChannels(
    listState.page,
    PAGE_SIZE,
    apiFilters,
  );
  const { data, isLoading, error, refetch, dataUpdatedAt } = listQuery;

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
  const pageRows = data?.data ?? [];

  const sortDefault = listState.finalizedOnly
    ? "c_updated_block"
    : "c_updated_at";
  const sortSelectValue = listState.sort ?? sortDefault;

  const handleCopyPageTsv = async () => {
    if (pageRows.length === 0) return;
    try {
      await navigator.clipboard.writeText(channelsPageToTsv(pageRows));
      toast.success(t("common.copied"));
    } catch {
      toast.error(t("channels.copyPageTsvFailed"));
    }
  };

  const handlePageChange = (newPage: number) => {
    applyPatch({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const lastUpdated =
    dataUpdatedAt > 0
      ? new Date(dataUpdatedAt).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : null;

  const { finalizedOnly } = listState;

  return (
    <div>
      <SeoHead
        title={
          finalizedOnly
            ? t("pages.channelsList.seoTitleFinalized")
            : t("pages.channelsList.seoTitleAll")
        }
        description={
          finalizedOnly
            ? t("pages.channelsList.seoDescFinalized")
            : t("pages.channelsList.seoDescAll")
        }
        path={finalizedOnly ? "/channels?finalized=1" : "/channels"}
      />

      <h1 className="text-2xl font-semibold tracking-tight">
        {finalizedOnly
          ? t("pages.channelsList.titleFinalized")
          : t("pages.channelsList.title")}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-zinc-400">
        {finalizedOnly
          ? t("pages.channelsList.subtitleFinalized")
          : t("pages.channelsList.subtitle")}
      </p>

      <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div
            className="inline-flex h-9 w-fit shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-900"
            role="group"
            aria-label={t("channels.filterScopeAria")}
          >
            <button
              type="button"
              onClick={() => applyPatch({ finalizedOnly: false })}
              className={clsx(
                "rounded-md px-3 py-1.5 transition-colors",
                !finalizedOnly
                  ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              {t("channels.filterAll")}
            </button>
            <button
              type="button"
              onClick={() => applyPatch({ finalizedOnly: true })}
              className={clsx(
                "rounded-md px-3 py-1.5 transition-colors",
                finalizedOnly
                  ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              {t("channels.filterFinalized")}
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
              {t("channels.filterChain")}
              <select
                value={listState.chainId ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  applyPatch({
                    chainId: v === "" ? undefined : Number(v),
                  });
                }}
                className="h-9 min-w-[10rem] rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="">{t("channels.filterChainAll")}</option>
                {(chainsQuery.data ?? []).map((c) => (
                  <option key={c.c_chain_id} value={c.c_chain_id}>
                    {c.c_chain_name} ({c.c_chain_id})
                  </option>
                ))}
              </select>
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
              {t("channels.sortLabel")}
              <select
                value={sortSelectValue}
                onChange={(e) => {
                  const v = e.target.value;
                  applyPatch({
                    sort: v === sortDefault ? undefined : v,
                  });
                }}
                className="h-9 min-w-[11rem] rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="c_updated_at">
                  {t("channels.sortUpdatedAt")}
                </option>
                <option value="c_created_block">
                  {t("channels.sortCreatedBlock")}
                </option>
                <option value="c_updated_block">
                  {t("channels.sortUpdatedBlock")}
                </option>
              </select>
            </label>
          </div>

          <fieldset className="min-w-0 border-0 p-0">
            <legend className="mb-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">
              {t("channels.filterStatusLegend")}
            </legend>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {STATUS_ORDER.map((st) => (
                <label
                  key={st}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-zinc-400"
                >
                  <input
                    type="checkbox"
                    checked={listState.statusFilters.includes(st)}
                    onChange={() =>
                      applyPatch({
                        statusFilters: toggleStatus(listState.statusFilters, st),
                      })
                    }
                    className="rounded border-slate-300 dark:border-zinc-600"
                  />
                  <span>{t(`status.${st}`)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-x-3 gap-y-2 sm:w-auto sm:shrink-0">
          {lastUpdated ? (
            <span className="text-xs text-slate-500 dark:text-zinc-500">
              {t("channels.lastUpdated", { time: lastUpdated })}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => void handleCopyPageTsv()}
            disabled={isLoading || pageRows.length === 0}
            title={t("channels.copyPageTsvAria")}
            aria-label={t("channels.copyPageTsvAria")}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:size-9"
          >
            <ClipboardCopy className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            title={t("channels.refreshList")}
            aria-label={t("channels.refreshList")}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:size-9"
          >
            <RefreshCw
              className={clsx("size-4", isLoading && "animate-spin")}
              aria-hidden
            />
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-6">
          <ErrorState onRetry={() => refetch()} />
        </div>
      ) : (
        <>
          <div className="mt-6">
            <ChannelList
              channels={data?.data ?? []}
              isLoading={isLoading}
            />
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={listState.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
