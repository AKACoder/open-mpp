import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import type { ChannelEvent } from "../../types/channel";
import { formatDate } from "../../utils/format";
import TxHashLink from "./TxHashLink";

interface Props {
  events: ChannelEvent[];
}

const dotColor: Record<string, string> = {
  ChannelOpened: "bg-emerald-500 ring-emerald-500/20",
  CloseRequested: "bg-amber-500 ring-amber-500/20",
  ChannelClosed:
    "bg-slate-400 ring-slate-400/20 dark:bg-zinc-500 dark:ring-zinc-500/20",
  ChannelExpired:
    "bg-slate-400 ring-slate-400/20 dark:bg-zinc-500 dark:ring-zinc-500/20",
};

const defaultDot = "bg-accent ring-accent/20";

const nodeVariant = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.3 },
  }),
};

export default function ChannelTimeline({ events }: Props) {
  const { t } = useTranslation();

  if (events.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400 dark:text-zinc-600">
        {t("detail.noEvents")}
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[7px] top-0 w-0.5 bg-slate-200 dark:bg-zinc-800" />

      <div className="space-y-6">
        {events.map((ev, i) => (
          <motion.div
            key={`${ev.c_transaction_hash}-${ev.c_log_index}`}
            custom={i}
            variants={nodeVariant}
            initial="hidden"
            animate="visible"
            className="relative flex gap-4"
          >
            <div
              className={clsx(
                "relative z-10 mt-1.5 size-[15px] shrink-0 rounded-full ring-4",
                dotColor[ev.c_event_name] ?? defaultDot,
              )}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-sm font-semibold">
                  {ev.c_event_name}
                </span>
                <span className="text-xs text-slate-400 dark:text-zinc-600">
                  {formatDate(ev.c_block_timestamp)}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-zinc-500">
                <span className="font-mono">
                  {t("timeline.block", {
                    number: ev.c_block_number.toLocaleString(),
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-400 dark:text-zinc-600">
                    {t("timeline.tx")}
                  </span>
                  <TxHashLink hash={ev.c_transaction_hash} chars={8} />
                </span>
              </div>

              {ev.c_event_data &&
                Object.keys(ev.c_event_data).length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-slate-400 transition-colors hover:text-slate-600 dark:text-zinc-600 dark:hover:text-zinc-400">
                      {t("timeline.eventData")}
                    </summary>
                    <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-slate-50 p-2 font-mono text-[11px] leading-relaxed text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                      {JSON.stringify(ev.c_event_data, null, 2)}
                    </pre>
                  </details>
                )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
