/** Normalize user input for search (trim). */
export type SearchNavigateResult =
  | { ok: true; path: string }
  | { ok: false };

/**
 * Map header / quick search input to a route.
 * - `0x` + 64 hex → channel detail
 * - `0x` + 40 hex → unified address page (default tab payer via query)
 */
export function pathFromSearchQuery(raw: string): SearchNavigateResult {
  const q = raw.trim();
  if (!q) return { ok: false };
  if (/^0x[0-9a-fA-F]{64}$/.test(q)) {
    return { ok: true, path: `/channel/${q}` };
  }
  if (/^0x[0-9a-fA-F]{40}$/.test(q)) {
    return { ok: true, path: `/address/${q}?role=payer` };
  }
  return { ok: false };
}

export function isValidAddressParam(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}
