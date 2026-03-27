import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Zap, Clock, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import { useActionableChannels } from "../../hooks/useChannels";
import ChannelList from "../channel/ChannelList";
import Pagination from "../ui/Pagination";

const ACTION_PAGE_SIZE = 20;

function ActionSection({
  payer,
  action,
  title,
  icon,
  highlight,
}: {
  payer: string;
  action: "withdraw-available" | "withdraw-ready" | "request-withdraw";
  title: string;
  icon: ReactNode;
  highlight?: boolean;
}) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActionableChannels(
    payer,
    action,
    page,
    ACTION_PAGE_SIZE,
  );
  const count = data?.total ?? 0;
  const totalPages = data ? Math.ceil(data.total / ACTION_PAGE_SIZE) : 0;

  return (
    <section
      className={clsx(
        "rounded-xl border p-4",
        highlight
          ? "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20"
          : "border-slate-200 dark:border-zinc-800",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={clsx(
            highlight
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-500 dark:text-zinc-400",
          )}
        >
          {icon}
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
        {!isLoading ? (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
            {count}
          </span>
        ) : null}
      </div>

      <ChannelList
        channels={data?.data ?? []}
        isLoading={isLoading}
        emptyMessage={t("actionable.noChannels")}
      />
      {totalPages > 1 ? (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </section>
  );
}

interface Props {
  payer: string;
}

/** Grouped actionable channel lists (payer-only); uses GET /channels/actions/*. */
export default function ActionableChannelSections({ payer }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold tracking-tight">
        {t("pages.addressView.actionableSectionTitle")}
      </h2>
      <ActionSection
        payer={payer}
        action="withdraw-available"
        title={t("actionable.withdrawAvailable")}
        icon={<Zap className="size-4" />}
        highlight
      />
      <ActionSection
        payer={payer}
        action="withdraw-ready"
        title={t("actionable.withdrawReady")}
        icon={<Clock className="size-4" />}
      />
      <ActionSection
        payer={payer}
        action="request-withdraw"
        title={t("actionable.requestWithdraw")}
        icon={<ShieldCheck className="size-4" />}
      />
    </div>
  );
}
