import {
  useQuery,
  keepPreviousData,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  getChannelMeta,
  getAllChannels,
  getFinalizedChannels,
  getChannelsByPayer,
  getChannelsByPayee,
  getChannelById,
  getChannelEvents,
  getChannelEventsSummary,
  getChannelBalance,
  getActionableChannels,
} from "../api/channels";
import type {
  Channel,
  ChannelBalance,
  ChannelEvent,
  ChannelEventsSummary,
  ChannelMeta,
  PaginatedResponse,
  ActionType,
} from "../types/channel";

export const channelKeys = {
  all: ["channels"] as const,
  lists: () => [...channelKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...channelKeys.lists(), { page, pageSize }] as const,
  byPayer: (payer: string, page: number, pageSize: number) =>
    [...channelKeys.all, "payer", payer, { page, pageSize }] as const,
  byPayee: (payee: string, page: number, pageSize: number) =>
    [...channelKeys.all, "payee", payee, { page, pageSize }] as const,
  details: () => [...channelKeys.all, "detail"] as const,
  detail: (id: string) => [...channelKeys.details(), id] as const,
  events: (id: string) => [...channelKeys.all, "events", id] as const,
  balance: (id: string) => [...channelKeys.all, "balance", id] as const,
  finalized: (page: number, pageSize: number) =>
    [...channelKeys.all, "finalized", { page, pageSize }] as const,
  meta: ["channel-meta"] as const,
  actionable: (payer: string, action: ActionType, page: number, pageSize: number) =>
    [...channelKeys.all, "actionable", action, payer, { page, pageSize }] as const,
  eventsSummary: (id: string) =>
    [...channelKeys.all, "eventsSummary", id] as const,
};

export function useChannelMeta(
  options?: Partial<UseQueryOptions<ChannelMeta>>,
) {
  return useQuery({
    queryKey: channelKeys.meta,
    queryFn: getChannelMeta,
    staleTime: Infinity,
    ...options,
  });
}

export function useAllChannels(
  page = 1,
  pageSize = 20,
  options?: Partial<UseQueryOptions<PaginatedResponse<Channel>>>,
) {
  return useQuery<PaginatedResponse<Channel>>({
    queryKey: channelKeys.list(page, pageSize),
    queryFn: () => getAllChannels(page, pageSize),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useFinalizedChannels(
  page = 1,
  pageSize = 20,
  options?: Partial<UseQueryOptions<PaginatedResponse<Channel>>>,
) {
  return useQuery<PaginatedResponse<Channel>>({
    queryKey: channelKeys.finalized(page, pageSize),
    queryFn: () => getFinalizedChannels(page, pageSize),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useChannelsByPayer(
  payer: string,
  page = 1,
  pageSize = 20,
) {
  return useQuery<PaginatedResponse<Channel>>({
    queryKey: channelKeys.byPayer(payer, page, pageSize),
    queryFn: () => getChannelsByPayer(payer, page, pageSize),
    enabled: !!payer,
    placeholderData: keepPreviousData,
  });
}

export function useChannelsByPayee(
  payee: string,
  page = 1,
  pageSize = 20,
) {
  return useQuery<PaginatedResponse<Channel>>({
    queryKey: channelKeys.byPayee(payee, page, pageSize),
    queryFn: () => getChannelsByPayee(payee, page, pageSize),
    enabled: !!payee,
    placeholderData: keepPreviousData,
  });
}

export function useChannelDetail(id: string) {
  return useQuery<Channel>({
    queryKey: channelKeys.detail(id),
    queryFn: () => getChannelById(id),
    enabled: !!id,
  });
}

export function useChannelEvents(id: string) {
  return useQuery<ChannelEvent[]>({
    queryKey: channelKeys.events(id),
    queryFn: () => getChannelEvents(id),
    enabled: !!id,
  });
}

export function useChannelEventsSummary(
  id: string,
  options?: Partial<UseQueryOptions<ChannelEventsSummary>>,
) {
  return useQuery({
    queryKey: channelKeys.eventsSummary(id),
    queryFn: () => getChannelEventsSummary(id),
    enabled: !!id,
    ...options,
  });
}

export function useChannelBalance(id: string) {
  return useQuery<ChannelBalance[]>({
    queryKey: channelKeys.balance(id),
    queryFn: () => getChannelBalance(id),
    enabled: !!id,
  });
}

export function useActionableChannels(
  payer: string,
  action: ActionType,
  page = 1,
  pageSize = 20,
) {
  return useQuery<PaginatedResponse<Channel>>({
    queryKey: channelKeys.actionable(payer, action, page, pageSize),
    queryFn: () => getActionableChannels(payer, action, page, pageSize),
    enabled: !!payer,
    placeholderData: keepPreviousData,
  });
}
