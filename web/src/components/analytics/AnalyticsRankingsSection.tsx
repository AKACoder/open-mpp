import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useAnalyticsRankingsChannels,
  useAnalyticsRankingsPayers,
  useAnalyticsRankingsPayees,
} from "../../hooks/useAnalytics";
import type { AnalyticsAppliedFilters } from "./AnalyticsFilterBar";
import type { ChannelRankingSortField } from "../../types/analytics";
import { formatAmount, shortenAddress } from "../../utils/format";
import Pagination from "../ui/Pagination";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import { clsx } from "clsx";

const PAGE_SIZE = 20;
const PREVIEW_ROWS = 5;

interface Props {
  filters: AnalyticsAppliedFilters;
  /** `preview`: top channels hook on Trends panel; `full`: paginated + tabs */
  variant?: "full" | "preview";
  /** When `preview`, call to switch URL view to full rankings */
  onViewFull?: () => void;
}

type Tab = "channels" | "payers" | "payees";

export default function AnalyticsRankingsSection({
  filters,
  variant = "full",
  onViewFull,
}: Props) {
  const { t } = useTranslation();
  const isPreview = variant === "preview";
  const [tab, setTab] = useState<Tab>("channels");
  const [pageCh, setPageCh] = useState(1);
  const [pagePy, setPagePy] = useState(1);
  const [pagePe, setPagePe] = useState(1);
  const [sort, setSort] = useState<ChannelRankingSortField>("c_settled");

  const chain = filters.chainId;

  const channelsQ = useAnalyticsRankingsChannels({
    page: isPreview ? 1 : pageCh,
    pageSize: isPreview ? PREVIEW_ROWS : PAGE_SIZE,
    sort: isPreview ? "c_settled" : sort,
    c_chain_id: chain,
  });
  const payersQ = useAnalyticsRankingsPayers({
    page: pagePy,
    pageSize: PAGE_SIZE,
    c_chain_id: chain,
  });
  const payeesQ = useAnalyticsRankingsPayees({
    page: pagePe,
    pageSize: PAGE_SIZE,
    c_chain_id: chain,
  });

  const tabs: { id: Tab; label: string }[] = [
    { id: "channels", label: t("analytics.rankTabChannels") },
    { id: "payers", label: t("analytics.rankTabPayers") },
    { id: "payees", label: t("analytics.rankTabPayees") },
  ];

  if (isPreview) {
    return (
      <div>
        <p className="text-xs text-slate-500 dark:text-zinc-500">
          {t("analytics.rankingsPreviewHint")}
        </p>
        {channelsQ.error ? (
          <div className="mt-3">
            <ErrorState onRetry={() => channelsQ.refetch()} />
          </div>
        ) : channelsQ.isLoading && !channelsQ.data ? (
          <div className="mt-3">
            <LoadingState />
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <th className="px-3 py-2 font-medium text-slate-500">
                    {t("table.channelId")}
                  </th>
                  <th className="px-3 py-2 font-medium text-slate-500">
                    {t("analytics.colRankMetric")}
                  </th>
                  <th className="px-3 py-2 font-medium text-slate-500">
                    {t("table.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {(channelsQ.data?.data ?? []).map((ch) => (
                  <tr key={ch.c_channel_id}>
                    <td className="px-3 py-2">
                      <Link
                        to={`/channel/${ch.c_channel_id}`}
                        className="font-mono text-xs text-accent hover:underline"
                      >
                        {shortenAddress(ch.c_channel_id, 8)}
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs tabular-nums">
                      {formatAmount(ch.rank_metric_value)}
                    </td>
                    <td className="px-3 py-2 text-xs">{ch.c_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {onViewFull ? (
          <button
            type="button"
            onClick={onViewFull}
            className="mt-3 text-sm font-medium text-accent hover:underline"
          >
            {t("analytics.viewFullRankings")}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-zinc-800">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={clsx(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              tab === id
                ? "border-accent text-accent"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-200",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "channels" && (
        <div className="mt-4">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <label className="text-xs font-medium text-slate-500 dark:text-zinc-400">
              {t("analytics.sortBy")}
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as ChannelRankingSortField);
                  setPageCh(1);
                }}
                className="ml-2 h-8 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="c_settled">{t("table.settled")}</option>
                <option value="c_deposit">{t("table.deposit")}</option>
              </select>
            </label>
          </div>
          {channelsQ.error ? (
            <ErrorState onRetry={() => channelsQ.refetch()} />
          ) : channelsQ.isLoading && !channelsQ.data ? (
            <LoadingState />
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <th className="px-3 py-2 font-medium text-slate-500">
                        {t("table.channelId")}
                      </th>
                      <th className="px-3 py-2 font-medium text-slate-500">
                        {t("analytics.colRankMetric")}
                      </th>
                      <th className="px-3 py-2 font-medium text-slate-500">
                        {t("table.status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {(channelsQ.data?.data ?? []).map((ch) => (
                      <tr key={ch.c_channel_id}>
                        <td className="px-3 py-2">
                          <Link
                            to={`/channel/${ch.c_channel_id}`}
                            className="font-mono text-xs text-accent hover:underline"
                          >
                            {shortenAddress(ch.c_channel_id, 8)}
                          </Link>
                        </td>
                        <td className="px-3 py-2 font-mono text-xs tabular-nums">
                          {formatAmount(ch.rank_metric_value)}
                        </td>
                        <td className="px-3 py-2 text-xs">{ch.c_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {channelsQ.data &&
                Math.ceil(channelsQ.data.total / PAGE_SIZE) > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={pageCh}
                      totalPages={Math.ceil(channelsQ.data.total / PAGE_SIZE)}
                      onPageChange={(p) => {
                        setPageCh(p);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                )}
            </>
          )}
        </div>
      )}

      {tab === "payers" && (
        <div className="mt-4">
          {payersQ.error ? (
            <ErrorState onRetry={() => payersQ.refetch()} />
          ) : payersQ.isLoading && !payersQ.data ? (
            <LoadingState />
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <th className="px-3 py-2 font-medium text-slate-500">
                        {t("table.payer")}
                      </th>
                      <th className="px-3 py-2 font-medium text-slate-500">
                        {t("analytics.colChannelCount")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(payersQ.data?.data ?? []).map((row) => (
                      <tr key={row.c_payer}>
                        <td className="px-3 py-2">
                          <Link
                            to={`/analytics/payer/${row.c_payer}`}
                            className="font-mono text-xs text-accent hover:underline"
                          >
                            {shortenAddress(row.c_payer, 8)}
                          </Link>
                        </td>
                        <td className="px-3 py-2 tabular-nums">
                          {row.channel_count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {payersQ.data &&
                Math.ceil(payersQ.data.total / PAGE_SIZE) > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={pagePy}
                      totalPages={Math.ceil(payersQ.data.total / PAGE_SIZE)}
                      onPageChange={setPagePy}
                    />
                  </div>
                )}
            </>
          )}
        </div>
      )}

      {tab === "payees" && (
        <div className="mt-4">
          {payeesQ.error ? (
            <ErrorState onRetry={() => payeesQ.refetch()} />
          ) : payeesQ.isLoading && !payeesQ.data ? (
            <LoadingState />
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <th className="px-3 py-2 font-medium text-slate-500">
                        {t("table.payee")}
                      </th>
                      <th className="px-3 py-2 font-medium text-slate-500">
                        {t("analytics.colChannelCount")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(payeesQ.data?.data ?? []).map((row) => (
                      <tr key={row.c_payee}>
                        <td className="px-3 py-2">
                          <Link
                            to={`/analytics/payee/${row.c_payee}`}
                            className="font-mono text-xs text-accent hover:underline"
                          >
                            {shortenAddress(row.c_payee, 8)}
                          </Link>
                        </td>
                        <td className="px-3 py-2 tabular-nums">
                          {row.channel_count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {payeesQ.data &&
                Math.ceil(payeesQ.data.total / PAGE_SIZE) > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={pagePe}
                      totalPages={Math.ceil(payeesQ.data.total / PAGE_SIZE)}
                      onPageChange={setPagePe}
                    />
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
