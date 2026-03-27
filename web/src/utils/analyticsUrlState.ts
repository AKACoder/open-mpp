import type {
  AnalyticsAppliedFilters,
  AnalyticsTimeseriesBucket,
} from "../types/analytics";
import {
  defaultAnalyticsHistoryStart,
  defaultTimeseriesEnd,
} from "./analyticsDate";

const CHAIN = "chain";
const FROM = "from";
const TO = "to";
const BUCKET = "bucket";
const TOKEN = "token";
const SUMMARY = "summary";
const VIEW = "view";

/** Primary analytics panel; legacy `explore` → `rankings`, `trends` → `history`. */
export type AnalyticsPageView =
  | "history"
  | "rankings"
  | "breakdown"
  | "indexer";

export function analyticsViewFromSearchParams(
  sp: URLSearchParams,
): AnalyticsPageView {
  const v = sp.get(VIEW);
  if (v === "explore") return "rankings";
  if (v === "trends" || v === "history") return "history";
  if (v === "rankings" || v === "breakdown" || v === "indexer") return v;
  return "history";
}

export function applyAnalyticsViewToSearchParams(
  sp: URLSearchParams,
  view: AnalyticsPageView,
) {
  if (view !== "history") sp.set(VIEW, view);
  else sp.delete(VIEW);
}

/** Merge filter params and preserve or set `view`. */
export function filtersToSearchParamsWithView(
  f: AnalyticsAppliedFilters,
  current: URLSearchParams,
): URLSearchParams {
  const sp = filtersToSearchParams(f);
  applyAnalyticsViewToSearchParams(
    sp,
    analyticsViewFromSearchParams(current),
  );
  return sp;
}

export function filtersFromSearchParams(
  sp: URLSearchParams,
): AnalyticsAppliedFilters {
  const chainRaw = sp.get(CHAIN);
  let chainId: number | undefined;
  if (chainRaw) {
    const n = Number(chainRaw);
    if (Number.isFinite(n)) chainId = n;
  }

  const bucketRaw = sp.get(BUCKET);
  const bucket: AnalyticsTimeseriesBucket =
    bucketRaw === "hour" ? "hour" : "day";

  return {
    chainId,
    from: sp.get(FROM) || defaultAnalyticsHistoryStart(),
    to: sp.get(TO) || defaultTimeseriesEnd(),
    bucket,
    settlementToken: sp.get(TOKEN) || "",
    useSummaryRange: sp.get(SUMMARY) === "1",
  };
}

export function filtersToSearchParams(
  f: AnalyticsAppliedFilters,
): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.chainId != null) sp.set(CHAIN, String(f.chainId));
  sp.set(FROM, f.from);
  sp.set(TO, f.to);
  sp.set(BUCKET, f.bucket);
  if (f.settlementToken) sp.set(TOKEN, f.settlementToken);
  if (f.useSummaryRange) sp.set(SUMMARY, "1");
  return sp;
}

/** Subset used on partner analytics pages (chain + timeseries controls). */
export type AnalyticsTimeseriesSlice = Pick<
  AnalyticsAppliedFilters,
  "chainId" | "from" | "to" | "bucket"
>;

export function timeseriesSliceFromSearchParams(
  sp: URLSearchParams,
): AnalyticsTimeseriesSlice {
  const f = filtersFromSearchParams(sp);
  return {
    chainId: f.chainId,
    from: f.from,
    to: f.to,
    bucket: f.bucket,
  };
}

export function timeseriesSliceToSearchParams(
  s: AnalyticsTimeseriesSlice,
): URLSearchParams {
  const sp = new URLSearchParams();
  if (s.chainId != null) sp.set(CHAIN, String(s.chainId));
  sp.set(FROM, s.from);
  sp.set(TO, s.to);
  sp.set(BUCKET, s.bucket);
  return sp;
}
