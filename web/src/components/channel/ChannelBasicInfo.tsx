import { useTranslation } from "react-i18next";
import type { Channel } from "../../types/channel";
import { formatAmount, formatDate } from "../../utils/format";
import AddressWithCopy from "./AddressWithCopy";
import ChannelStatusBadge from "./ChannelStatusBadge";
import WithdrawCountdown from "./WithdrawCountdown";
import { useChannelMeta } from "../../hooks/useChannels";

interface Props {
  channel: Channel;
}

function InfoField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

export default function ChannelBasicInfo({ channel }: Props) {
  const { t } = useTranslation();
  const { data: meta } = useChannelMeta();
  const gracePeriod = meta?.close_grace_period_seconds ?? 900;

  return (
    <div className="rounded-xl border border-slate-200 p-5 shadow-sm sm:p-6 dark:border-zinc-800">
      {/* Header: Channel ID + Status */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            {t("detail.channelId")}
          </p>
          <AddressWithCopy
            value={channel.c_channel_id}
            chars={10}
            className="group mt-1 inline-flex items-center gap-1.5 break-all font-mono text-sm font-medium text-slate-800 transition-colors hover:text-accent dark:text-zinc-200 dark:hover:text-accent"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
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
      </div>

      {/* Grid fields */}
      <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <InfoField label={t("detail.deposit")}>
          <span className="font-mono text-xl font-semibold tabular-nums">
            {formatAmount(channel.c_deposit)}
          </span>
        </InfoField>

        <InfoField label={t("detail.settled")}>
          <span className="font-mono text-xl font-semibold tabular-nums text-slate-600 dark:text-zinc-400">
            {formatAmount(channel.c_settled)}
          </span>
        </InfoField>

        <InfoField label={t("detail.payer")}>
          <AddressWithCopy value={channel.c_payer} chars={6} />
        </InfoField>

        <InfoField label={t("detail.payee")}>
          <AddressWithCopy value={channel.c_payee} chars={6} />
        </InfoField>

        <InfoField label={t("detail.token")}>
          <AddressWithCopy value={channel.c_token} chars={6} />
        </InfoField>

        <InfoField label={t("detail.authorizedSigner")}>
          <AddressWithCopy value={channel.c_authorized_signer} chars={6} />
        </InfoField>

        <InfoField label={t("detail.createdAt")}>
          <span className="text-sm">
            {formatDate(channel.c_created_at)}
          </span>
          <span className="ml-2 font-mono text-xs text-slate-400 dark:text-zinc-600">
            #{channel.c_created_block}
          </span>
        </InfoField>

        <InfoField label={t("detail.updatedAt")}>
          <span className="text-sm">
            {formatDate(channel.c_updated_at)}
          </span>
          <span className="ml-2 font-mono text-xs text-slate-400 dark:text-zinc-600">
            #{channel.c_updated_block}
          </span>
        </InfoField>
      </dl>
    </div>
  );
}
