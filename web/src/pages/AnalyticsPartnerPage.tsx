import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  useAnalyticsPayeeSummary,
  useAnalyticsPayerSummary,
  useAnalyticsPayerTimeseriesEvents,
} from "../hooks/useAnalytics";
import { useMetaChains } from "../hooks/useMeta";
import BackButton from "../components/ui/BackButton";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import PayerEventsTimeseries from "../components/analytics/PayerEventsTimeseries";
import { formatAmount } from "../utils/format";
import {
  defaultTimeseriesEnd,
  defaultTimeseriesStart,
} from "../utils/analyticsDate";
import type { AnalyticsTimeseriesBucket } from "../types/analytics";

export default function AnalyticsPartnerPage() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { address = "" } = useParams<{ address: string }>();
  const variant = pathname.includes("/analytics/payee/") ? "payee" : "payer";

  const chainsQuery = useMetaChains();
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [from, setFrom] = useState(() => defaultTimeseriesStart(7));
  const [to, setTo] = useState(() => defaultTimeseriesEnd());
  const [bucket, setBucket] = useState<AnalyticsTimeseriesBucket>("day");

  const payerParams = useMemo(
    () => ({ c_chain_id: chainId }),
    [chainId],
  );

  const payerSummary = useAnalyticsPayerSummary(address, payerParams, {
    enabled: variant === "payer" && !!address,
  });
  const payeeSummary = useAnalyticsPayeeSummary(address, payerParams, {
    enabled: variant === "payee" && !!address,
  });

  const summaryQ = variant === "payer" ? payerSummary : payeeSummary;

  const tsParams = useMemo(
    () => ({
      from,
      to,
      bucket,
      c_chain_id: chainId,
    }),
    [from, to, bucket, chainId],
  );

  const tsQ = useAnalyticsPayerTimeseriesEvents(address, tsParams, {
    enabled: variant === "payer" && !!address && !!from && !!to,
    retry: false,
  });

  const tsErrorMsg =
    tsQ.error && isAxiosError(tsQ.error)
      ? (() => {
          const d = tsQ.error.response?.data;
          if (d && typeof d === "object" && "error" in d) {
            return String((d as { error: string }).error);
          }
          return undefined;
        })()
      : undefined;

  return (
    <div>
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-2xl font-semibold tracking-tight">
          {variant === "payer"
            ? t("pages.analyticsPartner.payerTitle")
            : t("pages.analyticsPartner.payeeTitle")}
        </h1>
      </div>

      <div className="mt-4 font-mono text-sm text-slate-600 dark:text-zinc-400">
        {address}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <label className="text-xs font-medium text-slate-500 dark:text-zinc-400">
          {t("analytics.filterChain")}
          <select
            value={chainId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setChainId(v === "" ? undefined : Number(v));
            }}
            className="ml-2 h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="">{t("analytics.allChains")}</option>
            {(chainsQuery.data ?? []).map((c) => (
              <option key={c.c_chain_id} value={c.c_chain_id}>
                {c.c_chain_name} ({c.c_chain_id})
              </option>
            ))}
          </select>
        </label>
      </div>

      {summaryQ.error ? (
        <div className="mt-6">
          <ErrorState onRetry={() => summaryQ.refetch()} />
        </div>
      ) : summaryQ.isLoading && !summaryQ.data ? (
        <div className="mt-6">
          <LoadingState />
        </div>
      ) : summaryQ.data ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase text-slate-400">
              {t("pages.analyticsPartner.openCount")}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {summaryQ.data.open_channel_count}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase text-slate-400">
              {t("pages.analyticsPartner.finalizedCount")}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {summaryQ.data.finalized_channel_count}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase text-slate-400">
              {t("pages.analyticsPartner.remainingEscrow")}
            </p>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums">
              {formatAmount(summaryQ.data.remaining_escrow_total)}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-500">
              {(summaryQ.data.c_tokens ?? []).join(", ") || "—"}
            </p>
          </div>
        </div>
      ) : null}

      {variant === "payer" && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">
            {t("pages.analyticsPartner.payerEventsTs")}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
            {t("pages.analyticsPartner.payerTsLimitHint")}
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
              {t("analytics.filterFrom")}
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
              {t("analytics.filterTo")}
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
              {t("analytics.filterBucket")}
              <select
                value={bucket}
                onChange={(e) =>
                  setBucket(e.target.value as AnalyticsTimeseriesBucket)
                }
                className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <option value="day">{t("analytics.bucketDay")}</option>
                <option value="hour">{t("analytics.bucketHour")}</option>
              </select>
            </label>
          </div>
          <div className="mt-4">
            <PayerEventsTimeseries
              rows={tsQ.data}
              isLoading={tsQ.isLoading}
              error={tsQ.error}
              errorMessage={tsErrorMsg}
              onRetry={() => tsQ.refetch()}
            />
          </div>
        </section>
      )}

      <p className="mt-10 text-sm text-slate-500 dark:text-zinc-500">
        <Link
          to="/analytics"
          className="text-accent underline-offset-2 hover:underline"
        >
          {t("nav.analytics")}
        </Link>
        {" · "}
        <Link
          to={`/address/${variant}/${address}`}
          className="text-accent underline-offset-2 hover:underline"
        >
          {t("pages.analyticsPartner.channelList")}
        </Link>
      </p>
    </div>
  );
}
