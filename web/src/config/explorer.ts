/**
 * Base URL for transaction links (no trailing slash). Last path segment is the tx hash.
 * Override with VITE_EXPLORER_TX_URL (e.g. https://explore.tempo.xyz/tx).
 */
export const EXPLORER_TX_URL_BASE = (
  import.meta.env.VITE_EXPLORER_TX_URL ?? "https://explore.tempo.xyz/tx"
).replace(/\/$/, "");
