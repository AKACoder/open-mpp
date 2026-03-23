import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LoadingState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Loader2 className="size-6 animate-spin text-slate-400 dark:text-zinc-500" />
      <p className="text-sm text-slate-500 dark:text-zinc-500">
        {t("common.loading")}
      </p>
    </div>
  );
}
