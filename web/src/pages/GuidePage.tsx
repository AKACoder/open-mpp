import { Link } from "react-router-dom";

/**
 * English-only documentation page (also helps search and AI summaries).
 */
export default function GuidePage() {
  return (
    <article className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
        Open MPP Explorer — Guide
      </h1>
      <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-zinc-400">
        This page explains how{" "}
        <strong className="font-medium text-slate-800 dark:text-zinc-200">
          MPP Session
        </strong>{" "}
        flows on{" "}
        <strong className="font-medium text-slate-800 dark:text-zinc-200">
          Tempo
        </strong>{" "}
        use{" "}
        <strong className="font-medium text-slate-800 dark:text-zinc-200">
          TempoStreamChannel
        </strong>{" "}
        contracts, how to read channel state in this explorer, and how settlement
        relates to opening, topping up, reusing, and closing a channel.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          Tempo, MPP, and TempoStreamChannel
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          <a
            href="https://tempo.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Tempo
          </a>{" "}
          is a purpose-built Layer 1 blockchain for payments at scale—including
          stablecoin-native flows and use cases such as machine payments.{" "}
          <a
            href="https://mpp.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            MPP (Machine Payments Protocol)
          </a>{" "}
          is the open protocol for machine-to-machine payments (e.g. charging per API
          request, tool call, or content in the same interaction). In this explorer,
          <strong className="text-slate-800 dark:text-zinc-200"> MPP Sessions</strong>{" "}
          refer to flows that coordinate value through{" "}
          <strong className="text-slate-800 dark:text-zinc-200">
            TempoStreamChannel
          </strong>{" "}
          on Tempo.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          A channel can be <strong>opened</strong> and <strong>topped up</strong> with
          collateral, then{" "}
          <strong>reused for many payments while it stays open</strong>
          —similar to a prepaid balance. That supports{" "}
          <strong>real-time payment UX</strong> with{" "}
          <strong>deferred on-chain settlement</strong> when the channel closes or
          finalizes—aligned with high-frequency and{" "}
          <strong>M2M</strong> scenarios where posting every transfer on-chain would be
          too slow or costly.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          How to view channel state in this explorer
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          <li>
            <strong className="text-slate-800 dark:text-zinc-200">All channels</strong>{" "}
            — Browse the home list with deposits, status, and creation time. Use
            pagination for large result sets.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-zinc-200">Search</strong> — Enter
            a payer address or a 66-character channel ID (
            <code className="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-zinc-800">
              0x…
            </code>
            ) in the header. Addresses open a payer-scoped list; channel IDs open the
            detail page.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-zinc-200">Channel detail</strong>{" "}
            — See payer, payee, token, deposits, status, lifecycle events, and balance
            evolution over time. Copy identifiers and follow transaction links to the
            Tempo explorer when available.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-zinc-200">Actionable (payer)</strong>{" "}
            — After entering your payer address, view channels grouped by whether you
            can request close, are waiting in a grace period, or can withdraw—aligned
            with operational decisions on open channels.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-zinc-200">Finalized</strong> — See
            channels that have reached a finalized outcome for historical review.
          </li>
        </ul>
        <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
          This application is <strong>read-only</strong>: it does not connect a wallet or
          submit transactions. Use it to inspect indexed state and timelines.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          Settlement on Tempo (high level)
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          While a <strong className="text-slate-800 dark:text-zinc-200">
            TempoStreamChannel
          </strong>{" "}
          is open, parties can move value according to the protocol’s rules without
          committing every micro-payment on-chain immediately.{" "}
          <strong className="text-slate-800 dark:text-zinc-200">Settlement</strong> is
          tied to channel lifecycle: closing (or expiry) brings the latest agreed
          balances on-chain; there is often a{" "}
          <strong className="text-slate-800 dark:text-zinc-200">grace period</strong>{" "}
          after a close is requested before a withdraw becomes available—this explorer
          surfaces those timers where data is present. Network and contract rules are
          defined by Tempo and the contract set; this UI reflects{" "}
          <strong className="text-slate-800 dark:text-zinc-200">indexed</strong> facts
          (status, events, balances) for transparency and debugging.
        </p>
      </section>

      <p className="mt-10 text-sm text-slate-500 dark:text-zinc-500">
        Back to{" "}
        <Link to="/" className="text-accent underline-offset-2 hover:underline">
          All channels
        </Link>
        .
      </p>
    </article>
  );
}
