import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  useChannelDetail,
  useChannelEvents,
  useChannelBalance,
} from "../hooks/useChannels";
import BackButton from "../components/ui/BackButton";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import ChannelBasicInfo from "../components/channel/ChannelBasicInfo";
import ChannelTimeline from "../components/channel/ChannelTimeline";
import ChannelBalanceHistory from "../components/channel/ChannelBalanceHistory";

export default function ChannelDetail() {
  const { t } = useTranslation();
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
      )}
    </div>
  );
}
