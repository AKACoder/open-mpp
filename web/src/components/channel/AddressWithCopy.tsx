import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { shortenAddress } from "../../utils/format";

interface Props {
  value: string;
  chars?: number;
  className?: string;
}

export default function AddressWithCopy({
  value,
  chars = 4,
  className,
}: Props) {
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
        copy();
      }}
      className={
        className ??
        "group inline-flex items-center gap-1 font-mono text-sm text-slate-600 transition-colors hover:text-accent dark:text-zinc-400 dark:hover:text-accent"
      }
      title={value}
    >
      <span>{shortenAddress(value, chars)}</span>
      {copied ? (
        <Check className="size-3.5 text-success" />
      ) : (
        <Copy className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}
