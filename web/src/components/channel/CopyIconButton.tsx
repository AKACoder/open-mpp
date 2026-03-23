import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
}

export default function CopyIconButton({ value }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast.success(t("common.copied"));
      setTimeout(() => setCopied(false), 1500);
    });
  }, [value, t]);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        copy();
      }}
      className="inline-flex size-5 items-center justify-center rounded text-slate-400 transition-colors hover:text-accent dark:text-zinc-600 dark:hover:text-accent"
      title={value}
    >
      {copied ? (
        <Check className="size-3 text-success" />
      ) : (
        <Copy className="size-3" />
      )}
    </button>
  );
}
