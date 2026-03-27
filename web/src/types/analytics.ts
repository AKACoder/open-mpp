import type { Channel, PaginatedResponse } from "./channel";

/** GET /analytics/summary */
export interface AnalyticsSummary {
  active_channel_count: string;
  finalized_channel_count: string;
  remaining_escrow_by_c_token: Record<string, string>;
  /** Present when `from` + `to` query params are sent */
  event_count_in_range?: string;
  events_by_c_event_name?: Record<string, string>;
  settlement_volume_in_range?: string;
  synced_height?: string;
}

export interface TimeseriesChannelsOpenedRow {
  bucket_start: string;
  channel_open_count: string;
}

export interface TimeseriesEventsRow {
  bucket_start: string;
  event_count: string;
  by_c_event_name: Record<string, string>;
}

export interface TimeseriesSettlementVolumeRow {
  bucket_start: string;
  sum_c_delta: string;
}

export interface TimeseriesDataResponse<T> {
  data: T[];
}

export type ChannelRankingSortField = "c_settled" | "c_deposit";

/** GET /analytics/rankings/channels item */
export type RankingChannelRow = Channel & { rank_metric_value: string };

export type RankingsChannelsResponse = PaginatedResponse<RankingChannelRow>;

export interface RankingPayerEntry {
  c_payer: string;
  channel_count: number;
}

export type RankingsPayersResponse = PaginatedResponse<RankingPayerEntry>;

export interface RankingPayeeEntry {
  c_payee: string;
  channel_count: number;
}

export type RankingsPayeesResponse = PaginatedResponse<RankingPayeeEntry>;

/** GET /analytics/breakdown/by-token */
export interface TokenBreakdownRow {
  c_token: string;
  channel_count: number;
  open_channel_count: number;
}

/** GET /analytics/breakdown/by-contract */
export interface ContractBreakdownRow {
  c_contract: string;
  c_chain_id: number;
  event_count: number;
}

/** GET /analytics/payer/:payer/summary and payee summary */
export interface PartnerSummary {
  open_channel_count: number;
  finalized_channel_count: number;
  remaining_escrow_total: string;
  c_tokens: string[];
}

export type AnalyticsTimeseriesBucket = "hour" | "day";

/** Shared analytics page filter shape (UI + URL query). */
export interface AnalyticsAppliedFilters {
  chainId: number | undefined;
  from: string;
  to: string;
  bucket: AnalyticsTimeseriesBucket;
  settlementToken: string;
  useSummaryRange: boolean;
}
