import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { Channel } from "../../types/channel";
import { useChannelMeta } from "../../hooks/useChannels";
import { formatAmount, formatDate, shortenAddress } from "../../utils/format";
import AddressWithCopy from "./AddressWithCopy";
import CopyIconButton from "./CopyIconButton";
import ChannelStatusBadge from "./ChannelStatusBadge";
import WithdrawCountdown from "./WithdrawCountdown";
import LoadingState from "../ui/LoadingState";
import EmptyState from "../ui/EmptyState";

interface Props {
  channels: Channel[];
  isLoading: boolean;
  emptyMessage?: string;
}

export default function ChannelList({
  channels,
  isLoading,
  emptyMessage,
}: Props) {
  if (isLoading) return <LoadingState />;

  if (channels.length === 0) {
    if (emptyMessage) {
      return (
        <p className="py-4 text-center text-sm text-slate-400 dark:text-zinc-600">
          {emptyMessage}
        </p>
      );
    }
    return <EmptyState />;
  }

  return (
    <>
      <DesktopTable channels={channels} />
      <MobileCards channels={channels} />
    </>
  );
}

function StatusCell({ channel }: { channel: Channel }) {
  const { data: meta } = useChannelMeta();
  const gracePeriod = meta?.close_grace_period_seconds ?? 900;

  return (
    <div className="flex flex-col gap-1">
      <ChannelStatusBadge
        status={channel.c_status}
        finalized={channel.c_finalized}
        finalizedReason={channel.c_finalized_reason}
      />
      {channel.c_status === "close_requested" &&
        channel.c_close_requested_at && (
          <WithdrawCountdown
            requestedAt={channel.c_close_requested_at}
            gracePeriod={gracePeriod}
          />
        )}
    </div>
  );
}

const rowVariant = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.04, duration: 0.3 },
  }),
};

function DesktopTable({ channels }: { channels: Channel[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="hidden md:block">
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
              <th className="px-4 py-3 font-medium text-slate-500 dark:text-zinc-500">
                {t("table.channelId")}
              </th>
              <th className="px-4 py-3 font-medium text-slate-500 dark:text-zinc-500">
                {t("table.payer")}
              </th>
              <th className="px-4 py-3 font-medium text-slate-500 dark:text-zinc-500">
                {t("table.payee")}
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-zinc-500">
                {t("table.deposit")}
              </th>
              <th className="px-4 py-3 font-medium text-slate-500 dark:text-zinc-500">
                {t("table.status")}
              </th>
              <th className="px-4 py-3 font-medium text-slate-500 dark:text-zinc-500">
                {t("table.createdAt")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {channels.map((ch, i) => (
              <motion.tr
                key={ch.c_channel_id}
                custom={i}
                variants={rowVariant}
                initial="hidden"
                animate="visible"
                onClick={() => navigate(`/channel/${ch.c_channel_id}`)}
                className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/50"
              >
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1">
                    <span className="font-mono text-xs text-accent">
                      {shortenAddress(ch.c_channel_id, 6)}
                    </span>
                    <CopyIconButton value={ch.c_channel_id} />
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AddressWithCopy value={ch.c_payer} />
                </td>
                <td className="px-4 py-3">
                  <AddressWithCopy value={ch.c_payee} />
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
                  {formatAmount(ch.c_deposit)}
                </td>
                <td className="px-4 py-3">
                  <StatusCell channel={ch} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-zinc-500">
                  {formatDate(ch.c_created_at)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

function MobileCards({ channels }: { channels: Channel[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="grid gap-3 md:hidden">
      {channels.map((ch, i) => (
        <motion.div
          key={ch.c_channel_id}
          custom={i}
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          onClick={() => navigate(`/channel/${ch.c_channel_id}`)}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors active:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:active:bg-zinc-800/60"
        >
          <div className="flex items-start justify-between gap-2">
            <StatusCell channel={ch} />
            <span className="shrink-0 text-xs text-slate-400 dark:text-zinc-600">
              {formatDate(ch.c_created_at)}
            </span>
          </div>

          <div className="mt-3 font-mono text-lg font-semibold tabular-nums">
            {formatAmount(ch.c_deposit)}
          </div>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-slate-400 dark:text-zinc-600">
                {t("table.from")}
              </span>
              <AddressWithCopy value={ch.c_payer} chars={6} />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-slate-400 dark:text-zinc-600">
                {t("table.to")}
              </span>
              <AddressWithCopy value={ch.c_payee} chars={6} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
