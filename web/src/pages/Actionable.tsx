import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Zap, Clock, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import { useActionableChannels } from "../hooks/useChannels";
import ChannelList from "../components/channel/ChannelList";
import EmptyState from "../components/ui/EmptyState";

const STORAGE_KEY = "payer_address";

function isValidAddress(v: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(v);
}

export default function Actionable() {
  const { t } = useTranslation();
  const [input, setInput] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? "",
  );
  const [payer, setPayer] = useState(
    () => {
      const stored = localStorage.getItem(STORAGE_KEY) ?? "";
      return isValidAddress(stored) ? stored : "";
    },
  );

  useEffect(() => {
    if (isValidAddress(input)) {
      setPayer(input);
      localStorage.setItem(STORAGE_KEY, input);
    } else {
      setPayer("");
    }
  }, [input]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("pages.actionable.title")}
      </h1>

      {/* Address input */}
      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.trim())}
          placeholder={t("actionable.inputPlaceholder")}
          className="h-10 w-full max-w-lg rounded-xl border border-slate-200 bg-white pl-10 pr-4 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-accent"
        />
      </div>

      {!payer ? (
        <EmptyState message={t("actionable.inputHint")} />
      ) : (
        <div className="mt-6 space-y-8">
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
      )}
    </div>
  );
}

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
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  const { t } = useTranslation();
  const { data, isLoading } = useActionableChannels(payer, action);
  const count = data?.length ?? 0;

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
        <h2 className="text-sm font-semibold">{title}</h2>
        {!isLoading && (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
            {count}
          </span>
        )}
      </div>

      <ChannelList
        channels={data ?? []}
        isLoading={isLoading}
        emptyMessage={t("actionable.noChannels")}
      />
    </section>
  );
}
