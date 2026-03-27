import type { Channel } from "../types/channel";

function tsvCell(value: string): string {
  return String(value).replace(/\r?\n/g, " ").replace(/\t/g, " ");
}

/** Tab-separated export of the current page (API field names as header). */
export function channelsPageToTsv(channels: Channel[]): string {
  const header = [
    "c_channel_id",
    "c_payer",
    "c_payee",
    "c_deposit",
    "c_settled",
    "c_status",
    "c_finalized",
    "c_finalized_reason",
    "c_created_at",
    "c_updated_at",
  ].join("\t");
  const lines = channels.map((ch) =>
    [
      tsvCell(ch.c_channel_id),
      tsvCell(ch.c_payer),
      tsvCell(ch.c_payee),
      tsvCell(ch.c_deposit),
      tsvCell(ch.c_settled),
      tsvCell(ch.c_status),
      String(ch.c_finalized),
      ch.c_finalized_reason == null ? "" : tsvCell(ch.c_finalized_reason),
      tsvCell(ch.c_created_at),
      tsvCell(ch.c_updated_at),
    ].join("\t"),
  );
  return [header, ...lines].join("\n");
}
