/**
 * TanStack Query refetch policies for **indexer freshness** (not list auto-refresh).
 *
 * Product: `todo/next-iteration-priorities.md` §E; tracker D0.3.
 * APIs (existing client only): `GET /meta/sync`, `GET /analytics/summary` per `.temp/docs/api/`.
 */
export const SYNC_REFETCH_INTERVAL_MS = 30_000;
