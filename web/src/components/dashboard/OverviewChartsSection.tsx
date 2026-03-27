import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
} from "../../hooks/useAnalytics";
import {
  defaultTimeseriesEnd,
  defaultTimeseriesStart,
} from "../../utils/analyticsDate";
import dayjs from "../../utils/dayjs";
import { formatIntegerString } from "../../utils/format";

/** ColorBrewer paired scheme: colorblind-friendly, slightly higher contrast on light backgrounds */
const COLOR_CHANNELS_OPENED = "#2166AC";
const COLOR_EVENTS = "#D95F02";

const CHART_HEIGHT = 220;

function formatBucketTick(bucketStart: string) {
  const ymd = bucketStart.slice(0, 10);
  const d = dayjs.utc(ymd);
  return d.isValid() ? d.format("MMM D") : ymd;
}

type Point = { label: string; v: number };

function OverviewChartCard({
  title,
  data,
  color,
  loading,
  hasError,
  onRetry,
  emptyLabel,
}: {
  title: string;
  data: Point[];
  color: string;
  loading: boolean;
  hasError: boolean;
  onRetry: () => void;
  emptyLabel: string;
}) {
  const { t } = useTranslation();

  if (hasError) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-6 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-sm text-slate-600 dark:text-zinc-400">
          {t("pages.home.chartsError")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <button
            type="button"
            onClick={onRetry}
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            {t("common.retry")}
          </button>
          <Link
            to="/analytics"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            {t("pages.home.chartsOpenAnalytics")}
          </Link>
        </div>
      </div>
    );
  }

  if (loading && data.length === 0) {
    return (
      <div
        className="min-h-[220px] animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 dark:border-zinc-800 dark:bg-zinc-900/40"
        aria-hidden
      />
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-sm text-slate-500 dark:text-zinc-500">{emptyLabel}</p>
      </div>
    );
  }

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
              height={36}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "currentColor" }}
              width={40}
              tickFormatter={(x: number) => formatIntegerString(String(x))}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const val = payload[0].value;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs shadow dark:border-zinc-700 dark:bg-zinc-900">
                    <p className="font-medium text-slate-600 dark:text-zinc-300">
                      {label}
                    </p>
                    <p className="tabular-nums text-slate-900 dark:text-zinc-100">
                      {formatIntegerString(String(val))}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2.5}
              fill={color}
              fillOpacity={0.15}
              isAnimationActive={false}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function OverviewChartsSection() {
  const { t } = useTranslation();
  const tsParams = useMemo(
    () => ({
      from: defaultTimeseriesStart(7),
      to: defaultTimeseriesEnd(),
      bucket: "day" as const,
    }),
    [],
  );

  const opened = useAnalyticsTimeseriesChannelsOpened(tsParams);
  const events = useAnalyticsTimeseriesEvents(tsParams);

  const opensChartData = useMemo(
    () =>
      (opened.data ?? []).map((r) => ({
        label: formatBucketTick(r.bucket_start),
        v: Number(r.channel_open_count),
      })),
    [opened.data],
  );

  const eventsChartData = useMemo(
    () =>
      (events.data ?? []).map((r) => ({
        label: formatBucketTick(r.bucket_start),
        v: Number(r.event_count),
      })),
    [events.data],
  );

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <OverviewChartCard
        title={t("analytics.tsChannelsOpened")}
        data={opensChartData}
        color={COLOR_CHANNELS_OPENED}
        loading={opened.isLoading}
        hasError={!!opened.error}
        onRetry={() => void opened.refetch()}
        emptyLabel={t("pages.home.chartsEmpty")}
      />
      <OverviewChartCard
        title={t("analytics.tsEvents")}
        data={eventsChartData}
        color={COLOR_EVENTS}
        loading={events.isLoading}
        hasError={!!events.error}
        onRetry={() => void events.refetch()}
        emptyLabel={t("pages.home.chartsEmpty")}
      />
    </div>
  );
}
