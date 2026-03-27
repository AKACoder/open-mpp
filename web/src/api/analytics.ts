import request from "./request";
import type {
  AnalyticsSummary,
  AnalyticsTimeseriesBucket,
  ChannelRankingSortField,
  ContractBreakdownRow,
  PartnerSummary,
  RankingChannelRow,
  RankingsPayeesResponse,
  RankingsPayersResponse,
  TimeseriesChannelsOpenedRow,
  TimeseriesDataResponse,
  TimeseriesEventsRow,
  TimeseriesSettlementVolumeRow,
  TokenBreakdownRow,
} from "../types/analytics";
import type { PaginatedResponse } from "../types/channel";

function pruneParams(p: object): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v === undefined || v === "") continue;
    out[k] = v as string | number;
  }
  return out;
}

export interface AnalyticsSummaryParams {
  c_chain_id?: number;
  from?: string;
  to?: string;
}

export function getAnalyticsSummary(params?: AnalyticsSummaryParams) {
  return request.get<unknown, AnalyticsSummary>("/analytics/summary", {
    params: pruneParams(params ?? {}),
  });
}

export interface TimeseriesBaseParams {
  from: string;
  to: string;
  bucket: AnalyticsTimeseriesBucket;
  c_chain_id?: number;
}

export function getAnalyticsTimeseriesChannelsOpened(
  params: TimeseriesBaseParams,
) {
  return request.get<unknown, TimeseriesDataResponse<TimeseriesChannelsOpenedRow>>(
    "/analytics/timeseries/channels-opened",
    { params: pruneParams(params) },
  );
}

export function getAnalyticsTimeseriesEvents(params: TimeseriesBaseParams) {
  return request.get<unknown, TimeseriesDataResponse<TimeseriesEventsRow>>(
    "/analytics/timeseries/events",
    { params: pruneParams(params) },
  );
}

export interface TimeseriesSettlementVolumeParams extends TimeseriesBaseParams {
  c_token?: string;
}

export function getAnalyticsTimeseriesSettlementVolume(
  params: TimeseriesSettlementVolumeParams,
) {
  return request.get<unknown, TimeseriesDataResponse<TimeseriesSettlementVolumeRow>>(
    "/analytics/timeseries/settlement-volume",
    { params: pruneParams(params) },
  );
}

export interface RankingsChannelsParams {
  page?: number;
  pageSize?: number;
  sort?: ChannelRankingSortField;
  c_chain_id?: number;
}

export function getAnalyticsRankingsChannels(params?: RankingsChannelsParams) {
  return request.get<unknown, PaginatedResponse<RankingChannelRow>>(
    "/analytics/rankings/channels",
    { params: pruneParams(params ?? {}) },
  );
}

export interface RankingsListParams {
  page?: number;
  pageSize?: number;
  c_chain_id?: number;
}

export function getAnalyticsRankingsPayers(params?: RankingsListParams) {
  return request.get<unknown, RankingsPayersResponse>(
    "/analytics/rankings/payers",
    { params: pruneParams(params ?? {}) },
  );
}

export function getAnalyticsRankingsPayees(params?: RankingsListParams) {
  return request.get<unknown, RankingsPayeesResponse>(
    "/analytics/rankings/payees",
    { params: pruneParams(params ?? {}) },
  );
}

export interface BreakdownByTokenParams {
  c_chain_id?: number;
}

export function getAnalyticsBreakdownByToken(params?: BreakdownByTokenParams) {
  return request.get<unknown, { data: TokenBreakdownRow[] }>(
    "/analytics/breakdown/by-token",
    { params: pruneParams(params ?? {}) },
  );
}

export interface BreakdownByContractParams {
  c_chain_id: number;
  from?: string;
  to?: string;
}

export function getAnalyticsBreakdownByContract(
  params: BreakdownByContractParams,
) {
  return request.get<unknown, { data: ContractBreakdownRow[] }>(
    "/analytics/breakdown/by-contract",
    { params: pruneParams(params) },
  );
}

export interface PartnerSummaryParams {
  c_chain_id?: number;
}

export function getAnalyticsPayerSummary(
  payer: string,
  params?: PartnerSummaryParams,
) {
  return request.get<unknown, PartnerSummary>(
    `/analytics/payer/${payer}/summary`,
    { params: pruneParams(params ?? {}) },
  );
}

export function getAnalyticsPayeeSummary(
  payee: string,
  params?: PartnerSummaryParams,
) {
  return request.get<unknown, PartnerSummary>(
    `/analytics/payee/${payee}/summary`,
    { params: pruneParams(params ?? {}) },
  );
}

export function getAnalyticsPayerTimeseriesEvents(
  payer: string,
  params: TimeseriesBaseParams,
) {
  return request.get<unknown, TimeseriesDataResponse<TimeseriesEventsRow>>(
    `/analytics/payer/${payer}/timeseries/events`,
    { params: pruneParams(params) },
  );
}
