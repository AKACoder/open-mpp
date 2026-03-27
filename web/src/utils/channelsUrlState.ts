/**
 * URL query for `/channels` list view (SPA state; not all keys are sent to the API).
 * @see `.temp/docs/api/endpoints/channels-list.md`
 */
import type { ChannelsListFilters } from "../api/channels";
import type { ChannelStatus } from "../types/channel";

const PAGE = "page";
const STATUS = "status";

const ALLOWED_STATUS: ReadonlySet<string> = new Set([
  "open",
  "close_requested",
  "closed",
  "expired",
]);

export interface ChannelsListUrlState {
  page: number;
  /** Selected statuses; empty = all statuses (no filter). */
  statusFilters: ChannelStatus[];
}

const DEFAULT_PAGE = 1;

function parseStatusParam(raw: string | null): ChannelStatus[] {
  if (!raw) return [];
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => ALLOWED_STATUS.has(s));
  return [...new Set(parts)] as ChannelStatus[];
}

function sortStatus(a: ChannelStatus, b: ChannelStatus) {
  return a.localeCompare(b);
}

export function channelsListFromSearchParams(
  sp: URLSearchParams,
): ChannelsListUrlState {
  let page = DEFAULT_PAGE;
  const p = sp.get(PAGE);
  if (p) {
    const n = Number(p);
    if (Number.isFinite(n) && n >= 1) page = Math.floor(n);
  }

  const statusFilters = parseStatusParam(sp.get(STATUS)).sort(sortStatus);

  return { page, statusFilters };
}

/** Allowed URL keys: `page`, `status`. */
export const CHANNELS_LIST_URL_KEYS = new Set(["page", "status"]);

/** Serialize URL state. Default sort is API default `c_updated_at` (omitted). */
export function channelsListToSearchParams(
  s: ChannelsListUrlState,
): URLSearchParams {
  const sp = new URLSearchParams();
  if (s.page > 1) sp.set(PAGE, String(s.page));

  if (s.statusFilters.length === 1) {
    sp.set(STATUS, s.statusFilters[0]);
  } else if (s.statusFilters.length > 1) {
    sp.set(STATUS, [...s.statusFilters].sort(sortStatus).join(","));
  }

  return sp;
}

export function channelsListToApiFilters(
  s: ChannelsListUrlState,
): ChannelsListFilters {
  const f: ChannelsListFilters = {};
  if (s.statusFilters.length === 1) {
    f.c_status = s.statusFilters[0];
  } else if (s.statusFilters.length > 1) {
    f.c_status_in = [...s.statusFilters].sort(sortStatus).join(",");
  }
  return f;
}

export function channelsListStateWithPatch(
  current: ChannelsListUrlState,
  patch: Partial<ChannelsListUrlState> & { page?: number },
): ChannelsListUrlState {
  const next: ChannelsListUrlState = {
    ...current,
    ...patch,
  };
  if (patch.statusFilters !== undefined) {
    next.statusFilters = [...patch.statusFilters].sort(sortStatus);
  }

  const filterTouched = "statusFilters" in patch;

  if (filterTouched && !("page" in patch)) {
    next.page = DEFAULT_PAGE;
  }

  return next;
}
