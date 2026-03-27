import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useAnalyticsTimeseriesChannelsOpened,
  useAnalyticsTimeseriesEvents,
  useAnalyticsTimeseriesSettlementVolume,
} from "../../hooks/useAnalytics";
import type { AnalyticsAppliedFilters } from "./AnalyticsFilterBar";
import type { AnalyticsTimeseriesBucket } from "../../types/analytics";
import dayjs from "../../utils/dayjs";
import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";
import { formatAmount, formatIntegerString } from "../../utils/format";

const COLOR_CHANNELS_OPENED = "#2166AC";
const COLOR_EVENTS = "#D95F02";
const COLOR_SETTLEMENT = "#7570B3";

const CHART_HEIGHT = 240;

function settlementDeltaToChartNumber(raw: string): number {
  try {
    return Number(BigInt(raw)) / 1_000_000;
  } catch {
    return 0;
  }
}

function formatBucketAxisLabel(bucketStart: string, bucket: AnalyticsTimeseriesBucket) {
  const d = dayjs.utc(bucketStart.trim());
  if (!d.isValid()) return bucketStart.slice(0, 16);
  return bucket === "hour" ? d.format("MMM D, HH:mm") : d.format("MMM D, YYYY");
}

type ChartRowInt = { label: string; v: number };
type ChartRowAmount = { label: string; v: number; rawDelta: string };

function HistoryChartCard<T extends ChartRowInt | ChartRowAmount>({
  title,
  data,
  color,
  loading,
  error,
  onRetry,
  emptyLabel,
  valueMode,
}: {
  title: string;
  data: T[];
  color: string;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  emptyLabel: string;
  valueMode: "int" | "amount";
}) {
  const { t } = useTranslation();

  if (error) return <ErrorState onRetry={onRetry} />;
  if (loading && data.length === 0)
    return (
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          {title}
        </h3>
        <div className="mt-2">
          <LoadingState />
        </div>
      </div>
    );

  if (data.length === 0)
    return (
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">
          {emptyLabel}
        </p>
      </div>
    );

  const formatY = (x: number) =>
    valueMode === "amount"
      ? formatAmount(String(BigInt(Math.round(x * 1_000_000))))
      : formatIntegerString(String(Math.round(x)));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
        {title}
      </h3>
      <div
        className="mt-1 text-slate-600 dark:text-zinc-400 [&_.recharts-cartesian-grid_line]:opacity-25"
        style={{ height: CHART_HEIGHT }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 6, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "currentColor" }}
              interval="preserveStartEnd"
              height={40}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "currentColor" }}
              width={52}
              tickFormatter={(x: number) => formatY(x)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as T;
                const formatted =
                  valueMode === "amount" && "rawDelta" in row
                    ? formatAmount(row.rawDelta)
                    : formatIntegerString(String(Math.round(row.v as number)));
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs shadow dark:border-zinc-700 dark:bg-zinc-900">
                    <p className="font-medium text-slate-600 dark:text-zinc-300">
                      {label}
                    </p>
                    <p className="tabular-nums text-slate-900 dark:text-zinc-100">
                      {formatted}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.15}
              isAnimationActive={false}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-500">
        {t("analytics.historyChartsFootnote")}
      </p>
    </div>
  );
}

interface Props {
  filters: AnalyticsAppliedFilters;
}

export default function AnalyticsHistoryChartsSection({ filters }: Props) {
  const { t } = useTranslation();
  const enabled = !!(filters.from && filters.to);
  const base = {
    from: filters.from,
    to: filters.to,
    bucket: filters.bucket,
    c_chain_id: filters.chainId,
  };

  const opened = useAnalyticsTimeseriesChannelsOpened(base, { enabled });
  const events = useAnalyticsTimeseriesEvents(base, { enabled });
  const volume = useAnalyticsTimeseriesSettlementVolume(
    {
      ...base,
      c_token: filters.settlementToken || undefined,
    },
    { enabled },
  );

  const openedData = useMemo(
    () =>
      (opened.data ?? []).map((r) => ({
        label: formatBucketAxisLabel(r.bucket_start, filters.bucket),
        v: Number(r.channel_open_count),
      })),
    [opened.data, filters.bucket],
  );

  const eventsData = useMemo(
    () =>
      (events.data ?? []).map((r) => ({
        label: formatBucketAxisLabel(r.bucket_start, filters.bucket),
        v: Number(r.event_count),
      })),
    [events.data, filters.bucket],
  );

  const volumeData = useMemo(
    () =>
      (volume.data ?? []).map((r) => ({
        label: formatBucketAxisLabel(r.bucket_start, filters.bucket),
        v: settlementDeltaToChartNumber(r.sum_c_delta),
        rawDelta: r.sum_c_delta,
      })),
    [volume.data, filters.bucket],
  );

  if (!enabled) {
    return (
      <p className="text-sm text-slate-500 dark:text-zinc-500">
        {t("analytics.timeseriesNeedDates")}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <HistoryChartCard
        title={t("analytics.tsChannelsOpened")}
        data={openedData}
        color={COLOR_CHANNELS_OPENED}
        loading={opened.isLoading}
        error={opened.error}
        onRetry={() => void opened.refetch()}
        emptyLabel={t("pages.home.chartsEmpty")}
        valueMode="int"
      />
      <HistoryChartCard
        title={t("analytics.tsEvents")}
        data={eventsData}
        color={COLOR_EVENTS}
        loading={events.isLoading}
        error={events.error}
        onRetry={() => void events.refetch()}
        emptyLabel={t("pages.home.chartsEmpty")}
        valueMode="int"
      />
      <HistoryChartCard
        title={t("analytics.tsSettlementVolume")}
        data={volumeData}
        color={COLOR_SETTLEMENT}
        loading={volume.isLoading}
        error={volume.error}
        onRetry={() => void volume.refetch()}
        emptyLabel={t("pages.home.chartsEmpty")}
        valueMode="amount"
      />
    </div>
  );
}
