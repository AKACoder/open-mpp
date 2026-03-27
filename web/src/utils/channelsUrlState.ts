/**
 * URL query for `/channels` list view (SPA state; not all keys are sent to the API).
 * @see todo/api-contract-channels-list.md — `finalized=1` selects `GET /channels/finalized`.
 */
const FINALIZED = "finalized";
const PAGE = "page";

export interface ChannelsListUrlState {
  finalizedOnly: boolean;
  page: number;
}

const DEFAULT_PAGE = 1;

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
  return { finalizedOnly, page };
}

export function channelsListToSearchParams(
  s: ChannelsListUrlState,
): URLSearchParams {
  const sp = new URLSearchParams();
  if (s.finalizedOnly) sp.set(FINALIZED, "1");
  if (s.page > 1) sp.set(PAGE, String(s.page));
  return sp;
}
