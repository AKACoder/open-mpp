# open-mpp

**Open MPP** (product shell; formal name **Open MPP Explorer** in SEO / footer) — an **on-chain Session funding & lifecycle analytics and explorer** for **TempoStreamChannel** on **[Tempo](https://tempo.xyz/)**. It answers: *how much is in escrow, what changed on-chain, and where is sync up to* — for Machine Payments Protocol (**[MPP](https://mpp.dev/)**) flows **without** wallet connection or off-chain HTTP payment UI.

The UI surfaces indexed channel rows, contract events, balances, network KPIs, time series, rankings, and address-scoped summaries. **Read-only**: no writes, no chain-downstream session replay for every API call (the on-chain unit is the **channel**, not each HTTP session).

This repository contains **the frontend only** (`web/`). The indexing service that backs production is not open-sourced.

---

## Who it’s for

| Audience | How it helps |
|----------|----------------|
| **Payers** | Channels where you are the payer, **actionable** groupings (close / grace / withdraw-ready), countdowns. |
| **Payees & counterparties** | Lists by payee, deposits, status, history. |
| **Operators & support** | Lookup by channel ID or address; timelines in one place. |
| **Auditors & analysts** | Lifecycle events, balance evolution, finalized history, analytics with **metric glossary** and **indexer freshness** notes. |
| **Developers** | How TempoStreamChannel fields and APIs surface to users; explorer links for txs. |

---

## What you can do

| Area | Capabilities |
|------|----------------|
| **Overview** `/` | Network KPIs (from `/analytics/summary`), payer/payee-scoped quick search, links to channels / analytics / guide. |
| **Channels** `/channels` | Paginated all channels; row → detail. **Finalized-only** view: `/channels?finalized=1` (same page; `GET /channels/finalized`). |
| **Analytics** `/analytics` | URL-synced filters (`chain`, `from`, `to`, `bucket`, optional settlement token, summary window); KPIs, optional range metrics, three UTC-bucket time series, rankings, token/contract breakdowns, `/meta/sync` table, **metric definitions** (collapsible), **non-real-time** disclaimer. |
| **Partner analytics** `/analytics/payer/:addr`, `/analytics/payee/:addr` | Summary + payer event time series (with row-limit error UX); query params for chain / dates / bucket. |
| **Address lists** `/address/payer|payee/:addr` | Paginated channel lists. |
| **Channel detail** `/channel/:id` | Metadata, **events summary**, lifecycle timeline, balance history, on-chain storage note, tx hash links. |
| **Actionable** `/actionable` | Payer address → grouped actionable channels (read-only). |
| **Finalized** `/channels?finalized=1` | Paginated finalized channels (legacy path `/finalized` redirects here). |
| **Guide** `/guide` | On-chain-only scope; no voucher / 402 replay claims. |

**Internationalization:** English and Chinese (`web/src/locales`).

---

## Screenshots (optional)

Place marketing or docs screenshots under `docs/screenshots/` when you have them, for example:

- `overview.png` — home KPIs and search  
- `analytics.png` — filters + time series  
- `channel-detail.png` — timeline and balances  

*(None are committed yet; paths are suggestions.)*

---

## Configuration (build-time)

| Variable | Purpose |
|----------|---------|
| `VITE_SITE_URL` | Canonical site origin for SEO / OG URLs (no trailing slash). Default: production URL in `web/src/config/site.ts`. |
| `VITE_EXPLORER_TX_URL` | Base URL for transaction links (no trailing slash), e.g. `https://explore.tempo.xyz/tx`. |

---

## Stack

**Vite**, **React**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, **React Router**, **react-helmet-async**, **i18next**. Responsive, mobile-first.

---

## Development

```bash
cd web
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

---

## Product acceptance (plan §6)

Manual sign-off target (see `todo/session-onchain-analytics-product-plan.md` §6):

| Criterion | Notes |
|-----------|--------|
| **3-minute path** | Overview → search or analytics → channel detail: primary nav and QuickSearch cover this path. |
| **No misleading copy** | Guide + glossary + Session tooltip state on-chain vs off-chain boundaries. |
| **Pagination** | Payer/payee/actionable lists, **channels** (all and `?finalized=1`), and rankings use `PaginatedResponse` + UI pagination. |
| **`c Chain_id` consistency** | Shared filter drives summary, timeseries, rankings, breakdown; partner pages pass `c_chain_id` to summaries and payer TS. |

Re-validate against a live indexer before each release.

---

## Live site

**[open-mpp.akacoder.net](https://open-mpp.akacoder.net)**
