/** Canonical site origin (no trailing slash). Override with VITE_SITE_URL in build. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://open-mpp.akacoder.net"
).replace(/\/$/, "");

export const OG_IMAGE_PATH = "/og-image.png";

/** Default keywords for meta tags (GEO / search). */
export const DEFAULT_KEYWORDS =
  "Tempo, Tempo Network, Machine Payments Protocol, MPP, MPP Session, TempoStreamChannel, machine payments, M2M payments, stablecoin payments, Layer 1 payments, Real-time Payment Explorer, Blockchain Payment Frontend, payment channels";

export const SITE_NAME = "Open MPP Explorer";
