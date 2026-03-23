import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import type { ChannelStatus } from "../../types/channel";

interface Props {
  status: ChannelStatus;
  finalized: 0 | 1;
  finalizedReason?: "expired" | "closed" | null;
}

const styles = {
  open: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
  close_requested:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  finalized:
    "bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800",
} as const;

export default function ChannelStatusBadge({
  status,
  finalized,
  finalizedReason,
}: Props) {
  const { t } = useTranslation();

  let variant: keyof typeof styles;
  let label: string;

  if (finalized === 1) {
    variant = "finalized";
    label = finalizedReason
      ? t(`status.${finalizedReason}`)
      : t("status.finalized");
  } else if (status === "close_requested") {
    variant = "close_requested";
    label = t("status.close_requested");
  } else {
    variant = "open";
    label = t(`status.${status}`);
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium leading-tight",
        styles[variant],
      )}
    >
      {label}
    </span>
  );
}
