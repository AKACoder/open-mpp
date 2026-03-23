# open-mpp

**Channel Explorer** is a read-only web frontend for visualizing indexed state of **TempoStreamChannel** contracts on the **Tempo** network. These channels are used by **MPP Session** flows: they can be **opened with top-ups**, **reused for many payments while still open**, and closed when settlement is due—supporting **real-time payment with deferred settlement** and a **prepaid-style** funding model. That design is a natural fit for **high-frequency machine-to-machine payments** and other flows where latency and UX matter.

The UI presents channel lifecycle, balances, and events in a clear, explorer-style layout. There is **no wallet connection** and **no on-chain writes**—only browsing and inspection.

This repository contains **the frontend only**. The indexing service that powers the live app is not open-sourced.

**Ecosystem:** [Tempo](https://tempo.xyz/) (payments-focused L1) · [Machine Payments Protocol](https://mpp.dev/) (MPP)

---

## Who it’s for

| Audience | How it helps |
|----------|----------------|
| **Payers** | See channels where you are the payer, filter **actionable** states (e.g. request close, withdraw-ready, past grace period), and use countdowns when a close is in progress. |
| **Payees & counterparties** | Look up channels by payer or payee address and inspect deposits, status, and history. |
| **Operators & support** | Troubleshoot user issues by channel ID or address and verify status and timelines in one place. |
| **Auditors & analysts** | Review lifecycle events, balance evolution, and finalized history without running chain tooling yourself. |
| **Developers** | Use the UI as a reference for how TempoStreamChannel state surfaces to end users. |

---

## What you can do

- **Browse** all channels and **paginated** finalized channels.
- **Search** by address (payer view) or **channel ID** (66-character `0x…` hash).
- **Open a channel detail** page: metadata, lifecycle timeline, and balance snapshots.
- **Payer-focused “Actionable” view** when you paste a payer address: groupings for withdraw-ready, waiting (with grace countdown), and channels where you can request close.
- **Copy** channel IDs and hashes; **open transaction hashes** on the public Tempo explorer where linked.

Internationalization: **English** and **Chinese** UI.

---

## Stack

The app in `web/` is built with **Vite**, **React**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, and **React Router**. Styling is responsive and mobile-first.

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

## Live site

**[open-mpp.akacoder.net](https://open-mpp.akacoder.net)**
