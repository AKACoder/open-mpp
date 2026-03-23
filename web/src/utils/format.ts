import dayjs from "./dayjs";

export function shortenAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

const TOKEN_DECIMALS = 6;

export function formatAmount(
  amount: string,
  decimals = TOKEN_DECIMALS,
): string {
  const padded = amount.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, padded.length - decimals);
  const fracPart = padded.slice(padded.length - decimals).replace(/0+$/, "");

  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fracPart ? `${intFormatted}.${fracPart}` : intFormatted;
}

export function formatDate(dateString: string): string {
  return dayjs.utc(dateString).local().format("MMM DD, YYYY HH:mm");
}
