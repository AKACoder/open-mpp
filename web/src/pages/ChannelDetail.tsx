import { useTranslation } from "react-i18next";
import { useParams, useLocation } from "react-router-dom";
import {
  useChannelDetail,
  useChannelEvents,
  useChannelBalance,
} from "../hooks/useChannels";
import type { Channel } from "../types/channel";
import { shortenAddress, formatAmount } from "../utils/format";
import BackButton from "../components/ui/BackButton";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import ChannelBasicInfo from "../components/channel/ChannelBasicInfo";
import ChannelTimeline from "../components/channel/ChannelTimeline";
import ChannelBalanceHistory from "../components/channel/ChannelBalanceHistory";
import SeoHead from "../components/seo/SeoHead";

function channelMetaDescription(channel: Channel): string {
  const text = `TempoStreamChannel on Tempo — status ${channel.c_status}; deposit ${formatAmount(channel.c_deposit)}. MPP Session channel.`;
  return text.length > 160 ? `${text.slice(0, 157)}…` : text;
}

export default function ChannelDetail() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { id = "" } = useParams<{ id: string }>();

  const {
    data: channel,
    isLoading,
    error,
    refetch,
  } = useChannelDetail(id);
  const { data: events = [] } = useChannelEvents(id);
  const { data: balances = [] } = useChannelBalance(id);

  return (
    <div>
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("detail.title")}
        </h1>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !channel ? (
        <EmptyState message={t("detail.notFound")} />
      ) : (
        <>
          <SeoHead
            title={`Channel ${shortenAddress(channel.c_channel_id, 8)} — ${channel.c_status}`}
            description={channelMetaDescription(channel)}
            path={pathname}
          />
          <div className="mt-6 space-y-8">
            <ChannelBasicInfo channel={channel} />

            <section>
              <h2 className="mb-4 text-lg font-semibold tracking-tight">
                {t("detail.lifecycle")}
              </h2>
              <ChannelTimeline events={events} />
            </section>

            <section>
              <h2 className="mb-4 text-lg font-semibold tracking-tight">
                {t("detail.balanceHistory")}
              </h2>
              <ChannelBalanceHistory balances={balances} />
            </section>
          </div>
        </>
      )}
    </div>
  );
}
