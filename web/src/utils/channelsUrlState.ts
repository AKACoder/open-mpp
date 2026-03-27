/**
 * URL query for `/channels` list view (SPA state; not all keys are sent to the API).
 * @see `.temp/docs/api/endpoints/channels-list.md`
 */
import type { ChannelsListFilters } from "../api/channels";
import type { ChannelStatus } from "../types/channel";

const FINALIZED = "finalized";
const PAGE = "page";
const CHAIN = "chain";
const STATUS = "status";
const SORT = "sort";

const ALLOWED_STATUS: ReadonlySet<string> = new Set([
  "open",
  "close_requested",
  "closed",
  "expired",
]);

const ALLOWED_SORT: ReadonlySet<string> = new Set([
  "c_updated_at",
  "c_created_block",
  "c_updated_block",
]);

export interface ChannelsListUrlState {
  finalizedOnly: boolean;
  page: number;
  /** When set, passed as `c_chain_id`. */
  chainId?: number;
  /** Selected statuses; empty = no status filter. */
  statusFilters: ChannelStatus[];
  /**
   * API `sort`; `undefined` means default for current mode (`c_updated_at` all / `c_updated_block` ended).
   */
  sort?: string;
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
  const fin = sp.get(FINALIZED);
  const finalizedOnly = fin === "1";
  let page = DEFAULT_PAGE;
  const p = sp.get(PAGE);
  if (p) {
    const n = Number(p);
    if (Number.isFinite(n) && n >= 1) page = Math.floor(n);
  }

  let chainId: number | undefined;
  const chainRaw = sp.get(CHAIN);
  if (chainRaw) {
    const n = Number(chainRaw);
    if (Number.isInteger(n) && n > 0) chainId = n;
  }

  const statusFilters = parseStatusParam(sp.get(STATUS)).sort(sortStatus);

  const sortRaw = sp.get(SORT);
  let sort: string | undefined;
  if (sortRaw && ALLOWED_SORT.has(sortRaw)) sort = sortRaw;

  return {
    finalizedOnly,
    page,
    chainId,
    statusFilters,
    sort,
  };
}

function defaultSortForMode(finalizedOnly: boolean): string {
  return finalizedOnly ? "c_updated_block" : "c_updated_at";
}

/** Serialize URL state; omit params that match API/UX defaults. */
export function channelsListToSearchParams(
  s: ChannelsListUrlState,
): URLSearchParams {
  const sp = new URLSearchParams();
  if (s.finalizedOnly) sp.set(FINALIZED, "1");
  if (s.page > 1) sp.set(PAGE, String(s.page));
  if (s.chainId != null) sp.set(CHAIN, String(s.chainId));

  if (s.statusFilters.length === 1) {
    sp.set(STATUS, s.statusFilters[0]);
  } else if (s.statusFilters.length > 1) {
    sp.set(STATUS, [...s.statusFilters].sort(sortStatus).join(","));
  }

  const defSort = defaultSortForMode(s.finalizedOnly);
  if (s.sort != null && s.sort !== defSort) sp.set(SORT, s.sort);

  return sp;
}

export function channelsListToApiFilters(
  s: ChannelsListUrlState,
): ChannelsListFilters {
  const f: ChannelsListFilters = {};
  if (s.chainId != null) f.c_chain_id = s.chainId;

  if (s.finalizedOnly) {
    f.c_finalized = 1;
    f.sort = s.sort ?? "c_updated_block";
  } else if (s.sort) {
    f.sort = s.sort;
  }

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

  const filterTouched =
    "finalizedOnly" in patch ||
    "chainId" in patch ||
    "statusFilters" in patch ||
    "sort" in patch;

  if (filterTouched && !("page" in patch)) {
    next.page = DEFAULT_PAGE;
  }

  return next;
}
