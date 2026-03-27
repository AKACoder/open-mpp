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

/** Channel list + HTTP envelope: see `todo/archived/api-contract-channels-list.md` (D0). */
export function getChannelMeta() {
  return request.get<unknown, ChannelMeta>("/meta/channel");
}

export type ChannelsListFilters = {
  c_chain_id?: number;
  c_status?: string;
  c_status_in?: string;
  c_finalized?: 0 | 1;
  sort?: string;
};

function channelsListParams(
  page: number,
  pageSize: number,
  filters?: ChannelsListFilters,
) {
  const params: Record<string, string | number> = { page, pageSize };
  if (!filters) return params;
  if (filters.c_chain_id !== undefined)
    params.c_chain_id = filters.c_chain_id;
  if (filters.c_status !== undefined) params.c_status = filters.c_status;
  if (filters.c_status_in !== undefined)
    params.c_status_in = filters.c_status_in;
  if (filters.c_finalized !== undefined)
    params.c_finalized = filters.c_finalized;
  if (filters.sort !== undefined) params.sort = filters.sort;
  return params;
}

/** `GET /channels` — optional filters per `.temp/docs/api/endpoints/channels-list.md`. */
export function getAllChannels(
  page = 1,
  pageSize = 20,
  filters?: ChannelsListFilters,
) {
  return request.get<unknown, PaginatedResponse<Channel>>("/channels", {
    params: channelsListParams(page, pageSize, filters),
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

/** Same dataset as `GET /channels/finalized` per `.temp/docs` — uses main list with `c_finalized=1` + `sort=c_updated_block`. */
export function getFinalizedChannels(page = 1, pageSize = 20) {
  return getAllChannels(page, pageSize, {
    c_finalized: 1,
    sort: "c_updated_block",
  });
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
