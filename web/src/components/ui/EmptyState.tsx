import { Inbox, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  message?: string;
  icon?: LucideIcon;
}

export default function EmptyState({ message, icon: Icon = Inbox }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Icon className="size-10 text-slate-300 dark:text-zinc-700" strokeWidth={1} />
      <p className="text-sm text-slate-400 dark:text-zinc-600">
        {message ?? t("common.noData")}
      </p>
    </div>
  );
}
