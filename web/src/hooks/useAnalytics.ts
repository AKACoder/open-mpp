import {
  useQuery,
  keepPreviousData,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  getAnalyticsSummary,
  getAnalyticsTimeseriesChannelsOpened,
  getAnalyticsTimeseriesEvents,
  getAnalyticsTimeseriesSettlementVolume,
  getAnalyticsRankingsChannels,
  getAnalyticsRankingsPayers,
  getAnalyticsRankingsPayees,
  getAnalyticsBreakdownByToken,
  getAnalyticsBreakdownByContract,
  getAnalyticsPayerSummary,
  getAnalyticsPayeeSummary,
  getAnalyticsPayerTimeseriesEvents,
  type AnalyticsSummaryParams,
  type TimeseriesBaseParams,
  type TimeseriesSettlementVolumeParams,
  type RankingsChannelsParams,
  type RankingsListParams,
  type BreakdownByTokenParams,
  type BreakdownByContractParams,
  type PartnerSummaryParams,
} from "../api/analytics";
import type {
  AnalyticsSummary,
  TimeseriesChannelsOpenedRow,
  TimeseriesEventsRow,
  TimeseriesSettlementVolumeRow,
  RankingChannelRow,
  TokenBreakdownRow,
  ContractBreakdownRow,
  PartnerSummary,
  RankingPayerEntry,
  RankingPayeeEntry,
} from "../types/analytics";
import type { PaginatedResponse } from "../types/channel";

export const analyticsKeys = {
  all: ["analytics"] as const,
  summary: (p: AnalyticsSummaryParams | undefined) =>
    [
      ...analyticsKeys.all,
      "summary",
      p?.c_chain_id ?? null,
      p?.from ?? null,
      p?.to ?? null,
    ] as const,
  tsChannelsOpened: (p: TimeseriesBaseParams) =>
    [
      ...analyticsKeys.all,
      "ts",
      "channels-opened",
      p.from,
      p.to,
      p.bucket,
      p.c_chain_id ?? null,
    ] as const,
  tsEvents: (p: TimeseriesBaseParams) =>
    [
      ...analyticsKeys.all,
      "ts",
      "events",
      p.from,
      p.to,
      p.bucket,
      p.c_chain_id ?? null,
    ] as const,
  tsSettlementVolume: (p: TimeseriesSettlementVolumeParams) =>
    [
      ...analyticsKeys.all,
      "ts",
      "settlement-volume",
      p.from,
      p.to,
      p.bucket,
      p.c_chain_id ?? null,
      p.c_token ?? null,
    ] as const,
  rankingsChannels: (p: RankingsChannelsParams | undefined) =>
    [
      ...analyticsKeys.all,
      "rankings",
      "channels",
      p?.page ?? 1,
      p?.pageSize ?? 20,
      p?.sort ?? "c_settled",
      p?.c_chain_id ?? null,
    ] as const,
  rankingsPayers: (p: RankingsListParams | undefined) =>
    [
      ...analyticsKeys.all,
      "rankings",
      "payers",
      p?.page ?? 1,
      p?.pageSize ?? 20,
      p?.c_chain_id ?? null,
    ] as const,
  rankingsPayees: (p: RankingsListParams | undefined) =>
    [
      ...analyticsKeys.all,
      "rankings",
      "payees",
      p?.page ?? 1,
      p?.pageSize ?? 20,
      p?.c_chain_id ?? null,
    ] as const,
  breakdownToken: (p: BreakdownByTokenParams | undefined) =>
    [...analyticsKeys.all, "breakdown", "token", p?.c_chain_id ?? null] as const,
  breakdownContract: (p: BreakdownByContractParams) =>
    [
      ...analyticsKeys.all,
      "breakdown",
      "contract",
      p.c_chain_id,
      p.from ?? null,
      p.to ?? null,
    ] as const,
  payerSummary: (address: string, p: PartnerSummaryParams | undefined) =>
    [
      ...analyticsKeys.all,
      "payer-summary",
      address,
      p?.c_chain_id ?? null,
    ] as const,
  payeeSummary: (address: string, p: PartnerSummaryParams | undefined) =>
    [
      ...analyticsKeys.all,
      "payee-summary",
      address,
      p?.c_chain_id ?? null,
    ] as const,
  payerTsEvents: (payer: string, p: TimeseriesBaseParams) =>
    [
      ...analyticsKeys.all,
      "payer-ts-events",
      payer,
      p.from,
      p.to,
      p.bucket,
      p.c_chain_id ?? null,
    ] as const,
};

export function useAnalyticsSummary(
  params?: AnalyticsSummaryParams,
  options?: Partial<UseQueryOptions<AnalyticsSummary>>,
) {
  return useQuery({
    queryKey: analyticsKeys.summary(params),
    queryFn: () => getAnalyticsSummary(params),
    ...options,
  });
}

export function useAnalyticsTimeseriesChannelsOpened(
  params: TimeseriesBaseParams,
  options?: Partial<UseQueryOptions<TimeseriesChannelsOpenedRow[]>>,
) {
  return useQuery({
    queryKey: analyticsKeys.tsChannelsOpened(params),
    queryFn: async () => (await getAnalyticsTimeseriesChannelsOpened(params)).data,
    enabled: !!(params.from && params.to && params.bucket),
    ...options,
  });
}

export function useAnalyticsTimeseriesEvents(
  params: TimeseriesBaseParams,
  options?: Partial<UseQueryOptions<TimeseriesEventsRow[]>>,
) {
  return useQuery({
    queryKey: analyticsKeys.tsEvents(params),
    queryFn: async () => (await getAnalyticsTimeseriesEvents(params)).data,
    enabled: !!(params.from && params.to && params.bucket),
    ...options,
  });
}

export function useAnalyticsTimeseriesSettlementVolume(
  params: TimeseriesSettlementVolumeParams,
  options?: Partial<UseQueryOptions<TimeseriesSettlementVolumeRow[]>>,
) {
  return useQuery({
    queryKey: analyticsKeys.tsSettlementVolume(params),
    queryFn: async () =>
      (await getAnalyticsTimeseriesSettlementVolume(params)).data,
    enabled: !!(params.from && params.to && params.bucket),
    ...options,
  });
}

export function useAnalyticsRankingsChannels(
  params?: RankingsChannelsParams,
  options?: Partial<UseQueryOptions<PaginatedResponse<RankingChannelRow>>>,
) {
  const p = params ?? {};
  return useQuery({
    queryKey: analyticsKeys.rankingsChannels(p),
    queryFn: () => getAnalyticsRankingsChannels(p),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAnalyticsRankingsPayers(
  params?: RankingsListParams,
  options?: Partial<UseQueryOptions<PaginatedResponse<RankingPayerEntry>>>,
) {
  const p = params ?? {};
  return useQuery({
    queryKey: analyticsKeys.rankingsPayers(p),
    queryFn: () => getAnalyticsRankingsPayers(p),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAnalyticsRankingsPayees(
  params?: RankingsListParams,
  options?: Partial<UseQueryOptions<PaginatedResponse<RankingPayeeEntry>>>,
) {
  const p = params ?? {};
  return useQuery({
    queryKey: analyticsKeys.rankingsPayees(p),
    queryFn: () => getAnalyticsRankingsPayees(p),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAnalyticsBreakdownByToken(
  params?: BreakdownByTokenParams,
  options?: Partial<UseQueryOptions<TokenBreakdownRow[]>>,
) {
  return useQuery({
    queryKey: analyticsKeys.breakdownToken(params),
    queryFn: async () => (await getAnalyticsBreakdownByToken(params)).data,
    ...options,
  });
}

export function useAnalyticsBreakdownByContract(
  params: BreakdownByContractParams,
  options?: Partial<UseQueryOptions<ContractBreakdownRow[]>>,
) {
  return useQuery({
    queryKey: analyticsKeys.breakdownContract(params),
    queryFn: async () => (await getAnalyticsBreakdownByContract(params)).data,
    enabled: params.c_chain_id != null,
    ...options,
  });
}

export function useAnalyticsPayerSummary(
  payer: string,
  params?: PartnerSummaryParams,
  options?: Partial<UseQueryOptions<PartnerSummary>>,
) {
  return useQuery({
    queryKey: analyticsKeys.payerSummary(payer, params),
    queryFn: () => getAnalyticsPayerSummary(payer, params),
    enabled: !!payer,
    ...options,
  });
}

export function useAnalyticsPayeeSummary(
  payee: string,
  params?: PartnerSummaryParams,
  options?: Partial<UseQueryOptions<PartnerSummary>>,
) {
  return useQuery({
    queryKey: analyticsKeys.payeeSummary(payee, params),
    queryFn: () => getAnalyticsPayeeSummary(payee, params),
    enabled: !!payee,
    ...options,
  });
}

export function useAnalyticsPayerTimeseriesEvents(
  payer: string,
  params: TimeseriesBaseParams,
  options?: Partial<UseQueryOptions<TimeseriesEventsRow[]>>,
) {
  return useQuery({
    queryKey: analyticsKeys.payerTsEvents(payer, params),
    queryFn: async () =>
      (await getAnalyticsPayerTimeseriesEvents(payer, params)).data,
    enabled: !!payer && !!(params.from && params.to && params.bucket),
    ...options,
  });
}
