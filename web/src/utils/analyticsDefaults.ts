import type { AnalyticsAppliedFilters } from "../types/analytics";
import {
  defaultAnalyticsHistoryStart,
  defaultTimeseriesEnd,
} from "./analyticsDate";

/** Default chain for network Analytics (Tempo). */
export const DEFAULT_ANALYTICS_CHAIN_ID = 4217;

export function defaultAnalyticsPageFilters(): AnalyticsAppliedFilters {
  return {
    chainId: DEFAULT_ANALYTICS_CHAIN_ID,
    from: defaultAnalyticsHistoryStart(),
    to: defaultTimeseriesEnd(),
    bucket: "day",
    settlementToken: "",
    useSummaryRange: false,
  };
}
