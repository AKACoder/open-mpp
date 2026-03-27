/** Canonical site origin (no trailing slash). Override with VITE_SITE_URL in build. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://open-mpp.akacoder.net"
).replace(/\/$/, "");

export const OG_IMAGE_PATH = "/og-image.png";

/** Default keywords for meta tags (generative-engine / search optimization). */
export const DEFAULT_KEYWORDS =
  "Open MPP Explorer, Tempo, Tempo Network, Machine Payments Protocol, MPP, MPP Session, session funding, lifecycle analytics, TempoStreamChannel, on-chain analytics, machine payments, M2M payments, stablecoin payments, Layer 1, payment channels, escrow, settlement, indexer, blockchain explorer";

export const SITE_NAME = "Open MPP Explorer";
