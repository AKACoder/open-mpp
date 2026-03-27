/** YYYY-MM-DD in local calendar (acceptable for indexer day boundaries per API samples). */
export function formatDateYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function defaultTimeseriesEnd(): string {
  return formatDateYmd(new Date());
}

export function defaultTimeseriesStart(daysBack = 7): string {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  return formatDateYmd(d);
}

/** Default Analytics `from` when URL omits it (wide window; backend may cap rows). */
export function defaultAnalyticsHistoryStart(): string {
  return defaultTimeseriesStart(730);
}

/** Summary window as date + time (API doc: UTC `YYYY-MM-DD HH:mm:ss`). */
export function summaryRangeParams(fromYmd: string, toYmd: string) {
  return {
    from: `${fromYmd} 00:00:00`,
    to: `${toYmd} 23:59:59`,
  };
}
