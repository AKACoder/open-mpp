/**
 * English-only default SEO copy per route (SPA pathnames).
 * Channel detail pages override title/description when data loads.
 */

import { SITE_NAME } from "./site";

const HOME_DESC =
  "Read-only explorer for TempoStreamChannel state on Tempo (Layer 1 for payments). Browse Machine Payments Protocol (MPP) Session channels, lifecycle events, balances, and payer views—aligned with M2M and real-time payment flows on Tempo.";

const GUIDE_DESC =
  "What Tempo and Machine Payments Protocol (MPP) are, how MPP Sessions use TempoStreamChannel on Tempo, how to read channel status here, and how settlement relates to close and grace periods.";

const ACTIONABLE_DESC =
  "Payer-focused view: withdraw-ready, grace-period wait, or request-close—indexed TempoStreamChannel data for MPP Session flows on Tempo.";

const FINALIZED_DESC =
  "Paginated history of finalized TempoStreamChannel contracts on Tempo—payment channel outcomes after settlement.";

const CHANNEL_DESC =
  "Inspect a single TempoStreamChannel: deposits, status, lifecycle events, and balance evolution on Tempo.";

const ADDRESS_DESC =
  "Channels by payer or payee on Tempo—TempoStreamChannel list for MPP Session flows.";

export function getSeoForPath(pathname: string): {
  title: string;
  description: string;
} {
  const p = pathname.split("?")[0] || "/";

  if (p === "/" || p === "") {
    return {
      title: `${SITE_NAME} — Tempo Network Payment Channel Browser`,
      description: HOME_DESC,
    };
  }

  if (p.startsWith("/guide")) {
    return {
      title: `Guide — ${SITE_NAME}`,
      description: GUIDE_DESC,
    };
  }

  if (p.startsWith("/actionable")) {
    return {
      title: `Actionable Channels — ${SITE_NAME}`,
      description: ACTIONABLE_DESC,
    };
  }

  if (p.startsWith("/finalized")) {
    return {
      title: `Finalized Channels — ${SITE_NAME}`,
      description: FINALIZED_DESC,
    };
  }

  if (p.startsWith("/channel/")) {
    return {
      title: `Channel Detail — ${SITE_NAME}`,
      description: CHANNEL_DESC,
    };
  }

  if (p.startsWith("/address/")) {
    return {
      title: `Channels by Address — ${SITE_NAME}`,
      description: ADDRESS_DESC,
    };
  }

  return {
    title: SITE_NAME,
    description: HOME_DESC,
  };
}
