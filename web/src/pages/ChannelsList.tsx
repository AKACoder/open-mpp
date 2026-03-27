import { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import {
  useAllChannels,
  useFinalizedChannels,
} from "../hooks/useChannels";
import ChannelList from "../components/channel/ChannelList";
import Pagination from "../components/ui/Pagination";
import ErrorState from "../components/ui/ErrorState";
import SeoHead from "../components/seo/SeoHead";
import {
  channelsListFromSearchParams,
  channelsListToSearchParams,
} from "../utils/channelsUrlState";

const PAGE_SIZE = 20;

/** Paginated channel list: all channels or finalized-only (`?finalized=1`), per API contract. */
export default function ChannelsList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { finalizedOnly, page } = useMemo(
    () => channelsListFromSearchParams(searchParams),
    [searchParams],
  );

  const setListState = useCallback(
    (next: { finalizedOnly?: boolean; page?: number }) => {
      const nextFinal = next.finalizedOnly ?? finalizedOnly;
      let nextPage = next.page ?? page;
      if (
        next.finalizedOnly !== undefined &&
        next.finalizedOnly !== finalizedOnly
      ) {
        nextPage = 1;
      }
      setSearchParams(
        channelsListToSearchParams({
          finalizedOnly: nextFinal,
          page: nextPage,
        }),
        { replace: true },
      );
    },
    [finalizedOnly, page, setSearchParams],
  );

  const allQuery = useAllChannels(page, PAGE_SIZE, {
    enabled: !finalizedOnly,
  });
  const finQuery = useFinalizedChannels(page, PAGE_SIZE, {
    enabled: finalizedOnly,
  });

  const activeQuery = finalizedOnly ? finQuery : allQuery;
  const { data, isLoading, error, refetch, dataUpdatedAt } = activeQuery;

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const handlePageChange = (newPage: number) => {
    setListState({ page: newPage });
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

      <div className="mt-4 flex max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div
          className="inline-flex h-9 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-900"
          role="group"
          aria-label={t("channels.filterScopeAria")}
        >
          <button
            type="button"
            onClick={() => setListState({ finalizedOnly: false })}
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
            onClick={() => setListState({ finalizedOnly: true })}
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

        <div className="flex flex-wrap items-center gap-3">
          {lastUpdated ? (
            <span className="text-xs text-slate-500 dark:text-zinc-500">
              {t("channels.lastUpdated", { time: lastUpdated })}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex h-9 min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:min-h-9"
          >
            <RefreshCw
              className={clsx("size-4", isLoading && "animate-spin")}
            />
            {t("channels.refreshList")}
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
                currentPage={page}
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
