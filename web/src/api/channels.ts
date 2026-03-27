import request from "./request";
import type {
  Channel,
  ChannelBalance,
  ChannelEvent,
  ChannelEventsSummary,
  ChannelMeta,
  PaginatedResponse,
  ActionType,
} from "../types/channel";

/** Channel list + HTTP envelope: see `todo/api-contract-channels-list.md` (D0). */
export function getChannelMeta() {
  return request.get<unknown, ChannelMeta>("/meta/channel");
}

/** `GET /channels` — all channels; query today is only `page`, `pageSize`. */
export function getAllChannels(page = 1, pageSize = 20) {
  return request.get<unknown, PaginatedResponse<Channel>>("/channels", {
    params: { page, pageSize },
  });
}

export function getChannelsByPayer(
  payer: string,
  page = 1,
  pageSize = 20,
) {
  return request.get<unknown, PaginatedResponse<Channel>>(
    `/channels/payer/${payer}`,
    { params: { page, pageSize } },
  );
}

export function getChannelsByPayee(
  payee: string,
  page = 1,
  pageSize = 20,
) {
  return request.get<unknown, PaginatedResponse<Channel>>(
    `/channels/payee/${payee}`,
    { params: { page, pageSize } },
  );
}

export function getChannelById(channelId: string) {
  return request.get<unknown, Channel>(`/channels/${channelId}`);
}

export function getChannelEvents(channelId: string) {
  return request.get<unknown, ChannelEvent[]>(
    `/channels/${channelId}/events`,
  );
}

export function getChannelEventsSummary(channelId: string) {
  return request.get<unknown, ChannelEventsSummary>(
    `/channels/${channelId}/events/summary`,
  );
}

export function getChannelBalance(channelId: string) {
  return request.get<unknown, ChannelBalance[]>(
    `/channels/${channelId}/balance`,
  );
}

/** `GET /channels/finalized` — finalized only (separate path, not a filter on `/channels`). SPA URL uses `?finalized=1` to select this call; see `todo/api-contract-channels-list.md`. */
export function getFinalizedChannels(page = 1, pageSize = 20) {
  return request.get<unknown, PaginatedResponse<Channel>>(
    "/channels/finalized",
    { params: { page, pageSize } },
  );
}

export function getActionableChannels(
  payer: string,
  action: ActionType,
  page = 1,
  pageSize = 20,
) {
  return request.get<unknown, PaginatedResponse<Channel>>(
    `/channels/actions/${action}/${payer}`,
    { params: { page, pageSize } },
  );
}
