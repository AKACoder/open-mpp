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
  getChannelBalance,
  getActionableChannels,
} from "../api/channels";
import type {
  Channel,
  ChannelBalance,
  ChannelEvent,
  ChannelMeta,
  PaginatedResponse,
  ActionType,
} from "../types/channel";

export const channelKeys = {
  all: ["channels"] as const,
  lists: () => [...channelKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...channelKeys.lists(), { page, pageSize }] as const,
  byPayer: (payer: string) =>
    [...channelKeys.all, "payer", payer] as const,
  byPayee: (payee: string) =>
    [...channelKeys.all, "payee", payee] as const,
  details: () => [...channelKeys.all, "detail"] as const,
  detail: (id: string) => [...channelKeys.details(), id] as const,
  events: (id: string) => [...channelKeys.all, "events", id] as const,
  balance: (id: string) => [...channelKeys.all, "balance", id] as const,
  finalized: (page: number, pageSize: number) =>
    [...channelKeys.all, "finalized", { page, pageSize }] as const,
  meta: ["channel-meta"] as const,
  actionable: (payer: string, action: ActionType) =>
    [...channelKeys.all, "actionable", action, payer] as const,
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

export function useAllChannels(page = 1, pageSize = 20) {
  return useQuery<PaginatedResponse<Channel>>({
    queryKey: channelKeys.list(page, pageSize),
    queryFn: () => getAllChannels(page, pageSize),
    placeholderData: keepPreviousData,
  });
}

export function useFinalizedChannels(page = 1, pageSize = 20) {
  return useQuery<PaginatedResponse<Channel>>({
    queryKey: channelKeys.finalized(page, pageSize),
    queryFn: () => getFinalizedChannels(page, pageSize),
    placeholderData: keepPreviousData,
  });
}

export function useChannelsByPayer(payer: string) {
  return useQuery<Channel[]>({
    queryKey: channelKeys.byPayer(payer),
    queryFn: () => getChannelsByPayer(payer),
    enabled: !!payer,
  });
}

export function useChannelsByPayee(payee: string) {
  return useQuery<Channel[]>({
    queryKey: channelKeys.byPayee(payee),
    queryFn: () => getChannelsByPayee(payee),
    enabled: !!payee,
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

export function useChannelBalance(id: string) {
  return useQuery<ChannelBalance[]>({
    queryKey: channelKeys.balance(id),
    queryFn: () => getChannelBalance(id),
    enabled: !!id,
  });
}

export function useActionableChannels(payer: string, action: ActionType) {
  return useQuery<Channel[]>({
    queryKey: channelKeys.actionable(payer, action),
    queryFn: () => getActionableChannels(payer, action),
    enabled: !!payer,
  });
}
