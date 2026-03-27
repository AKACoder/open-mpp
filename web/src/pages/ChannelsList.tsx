import { useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ClipboardCopy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { useFilteredChannels } from "../hooks/useChannels";
import ChannelList from "../components/channel/ChannelList";
import Pagination from "../components/ui/Pagination";
import ErrorState from "../components/ui/ErrorState";
import SeoHead from "../components/seo/SeoHead";
import {
  channelsListFromSearchParams,
  channelsListToSearchParams,
  channelsListToApiFilters,
  channelsListStateWithPatch,
  CHANNELS_LIST_URL_KEYS,
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

/** From “All” (no filter): first explicit status selection sets exactly that set. */
function toggleStatus(
  current: ChannelStatus[],
  st: ChannelStatus,
): ChannelStatus[] {
  if (current.length === 0) return [st];
  if (current.includes(st)) {
    return current.filter((x) => x !== st);
  }
  return [...current, st].sort((a, b) => a.localeCompare(b));
}

/** Paginated channel list; optional status filter; default sort `c_updated_at` (API default). */
export default function ChannelsList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const listState = useMemo(
    () => channelsListFromSearchParams(searchParams),
    [searchParams],
  );

  useEffect(() => {
    let dirty = false;
    const sp = new URLSearchParams(searchParams);
    for (const key of [...sp.keys()]) {
      if (!CHANNELS_LIST_URL_KEYS.has(key)) {
        dirty = true;
        sp.delete(key);
      }
    }
    if (!dirty) return;
    setSearchParams(sp, { replace: true });
  }, [searchParams, setSearchParams]);

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

  const statusAll = listState.statusFilters.length === 0;

  return (
    <div>
      <SeoHead
        title={t("pages.channelsList.seoTitleAll")}
        description={t("pages.channelsList.seoDescAll")}
        path="/channels"
      />

      <h1 className="text-2xl font-semibold tracking-tight">
        {t("pages.channelsList.title")}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-zinc-400">
        {t("pages.channelsList.subtitle")}
      </p>

      <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <fieldset className="min-w-0 flex-1 border-0 p-0">
          <legend className="mb-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">
            {t("channels.filterStatusLegend")}
          </legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={statusAll}
                onChange={() => applyPatch({ statusFilters: [] })}
                className="rounded border-slate-300 dark:border-zinc-600"
              />
              <span>{t("channels.filterStatusAll")}</span>
            </label>
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
