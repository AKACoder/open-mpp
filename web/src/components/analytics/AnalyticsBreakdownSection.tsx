import { useTranslation } from "react-i18next";
import {
  useAnalyticsBreakdownByToken,
  useAnalyticsBreakdownByContract,
} from "../../hooks/useAnalytics";
import type { AnalyticsAppliedFilters } from "./AnalyticsFilterBar";
import type { ChainMetadataRow } from "../../types/meta";
import { shortenAddress } from "../../utils/format";
import { summaryRangeParams } from "../../utils/analyticsDate";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

interface Props {
  filters: AnalyticsAppliedFilters;
  chains: ChainMetadataRow[];
}

export default function AnalyticsBreakdownSection({
  filters,
  chains,
}: Props) {
  const { t } = useTranslation();
  const firstChain = chains[0] ? Number(chains[0].c_chain_id) : undefined;
  const contractChainId = filters.chainId ?? firstChain;

  const tokenQ = useAnalyticsBreakdownByToken({
    c_chain_id: filters.chainId,
  });

  const range =
    filters.from && filters.to
      ? summaryRangeParams(filters.from, filters.to)
      : undefined;

  const contractQ = useAnalyticsBreakdownByContract(
    {
      c_chain_id: contractChainId ?? 0,
      ...(range ? { from: range.from, to: range.to } : {}),
    },
    { enabled: contractChainId != null },
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          {t("analytics.breakdownByToken")}
        </h3>
        {tokenQ.error ? (
          <ErrorState onRetry={() => tokenQ.refetch()} />
        ) : tokenQ.isLoading ? (
          <LoadingState />
        ) : (
          <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                    {t("table.token")}
                  </th>
                  <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                    {t("analytics.colChannelCount")}
                  </th>
                  <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                    {t("analytics.colOpenCount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(tokenQ.data ?? []).map((row) => (
                  <tr key={row.c_token}>
                    <td className="px-3 py-2 font-mono text-xs">
                      {shortenAddress(row.c_token, 8)}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{row.channel_count}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {row.open_channel_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          {t("analytics.breakdownByContract")}
        </h3>
        {contractChainId == null ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">
            {t("analytics.breakdownContractNeedChain")}
          </p>
        ) : contractQ.error ? (
          <ErrorState onRetry={() => contractQ.refetch()} />
        ) : contractQ.isLoading ? (
          <LoadingState />
        ) : (
          <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                    {t("pages.analytics.colChain")}
                  </th>
                  <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                    {t("analytics.colContract")}
                  </th>
                  <th className="px-3 py-2 font-medium text-slate-500 dark:text-zinc-500">
                    {t("analytics.colTotalEvents")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(contractQ.data ?? []).map((row) => (
                  <tr key={`${row.c_chain_id}-${row.c_contract}`}>
                    <td className="px-3 py-2 font-mono text-xs">{row.c_chain_id}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {shortenAddress(row.c_contract, 8)}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{row.event_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
