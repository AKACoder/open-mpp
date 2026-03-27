import { useState, useCallback } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { shortenAddress } from "../../utils/format";
import { EXPLORER_TX_URL_BASE } from "../../config/explorer";

interface Props {
  hash: string;
  chars?: number;
  className?: string;
}

export default function TxHashLink({ hash, chars = 6, className }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopied(true);
      toast.success(t("common.copied"));
      setTimeout(() => setCopied(false), 1500);
    });
  }, [hash, t]);

  return (
    <span
      className={
        className ??
        "inline-flex items-center gap-1 font-mono text-xs text-slate-500 dark:text-zinc-500"
      }
    >
      <span>{shortenAddress(hash, chars)}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          copy();
        }}
        className="inline-flex size-4 items-center justify-center rounded text-slate-400 transition-colors hover:text-accent dark:text-zinc-600 dark:hover:text-accent"
        title={hash}
      >
        {copied ? (
          <Check className="size-3 text-success" />
        ) : (
          <Copy className="size-3" />
        )}
      </button>
      <a
        href={`${EXPLORER_TX_URL_BASE}/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex size-4 items-center justify-center rounded text-slate-400 transition-colors hover:text-accent dark:text-zinc-600 dark:hover:text-accent"
        title="View on Explorer"
      >
        <ExternalLink className="size-3" />
      </a>
    </span>
  );
}
