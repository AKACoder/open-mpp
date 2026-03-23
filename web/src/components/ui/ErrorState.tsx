import { useTranslation } from "react-i18next";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <AlertTriangle className="size-8 text-danger" strokeWidth={1.5} />
      <p className="text-sm text-slate-600 dark:text-zinc-400">
        {message ?? t("common.error")}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <RotateCcw className="size-3.5" />
          {t("common.retry")}
        </button>
      )}
    </div>
  );
}
