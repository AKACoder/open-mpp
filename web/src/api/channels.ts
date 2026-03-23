import request from "./request";
import type {
  Channel,
  ChannelBalance,
  ChannelEvent,
  ChannelMeta,
  PaginatedResponse,
  ActionType,
} from "../types/channel";

export function getChannelMeta() {
  return request.get<unknown, ChannelMeta>("/meta/channel");
}

export function getAllChannels(page = 1, pageSize = 20) {
  return request.get<unknown, PaginatedResponse<Channel>>("/channels", {
    params: { page, pageSize },
  });
}

export function getChannelsByPayer(payer: string) {
  return request.get<unknown, Channel[]>(`/channels/payer/${payer}`);
}

export function getChannelsByPayee(payee: string) {
  return request.get<unknown, Channel[]>(`/channels/payee/${payee}`);
}

export function getChannelById(channelId: string) {
  return request.get<unknown, Channel>(`/channels/${channelId}`);
}

export function getChannelEvents(channelId: string) {
  return request.get<unknown, ChannelEvent[]>(
    `/channels/${channelId}/events`,
  );
}

export function getChannelBalance(channelId: string) {
  return request.get<unknown, ChannelBalance[]>(
    `/channels/${channelId}/balance`,
  );
}

export function getFinalizedChannels(page = 1, pageSize = 20) {
  return request.get<unknown, PaginatedResponse<Channel>>(
    "/channels/finalized",
    { params: { page, pageSize } },
  );
}

export function getActionableChannels(payer: string, action: ActionType) {
  return request.get<unknown, Channel[]>(
    `/channels/actions/${action}/${payer}`,
  );
}
