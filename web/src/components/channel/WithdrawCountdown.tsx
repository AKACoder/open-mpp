import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { Clock, CircleCheckBig } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  requestedAt: string;
  gracePeriod: number;
  onExpire?: () => void;
}

function calcRemaining(requestedAt: string, gracePeriod: number): number {
  const target = dayjs(requestedAt).add(gracePeriod, "second");
  return Math.max(0, target.diff(dayjs(), "second"));
}

function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

export default function WithdrawCountdown({
  requestedAt,
  gracePeriod,
  onExpire,
}: Props) {
  const { t } = useTranslation();
  const [remaining, setRemaining] = useState(() =>
    calcRemaining(requestedAt, gracePeriod),
  );

  const handleExpire = useCallback(() => onExpire?.(), [onExpire]);

  useEffect(() => {
    if (remaining <= 0) {
      handleExpire();
      return;
    }

    const id = setInterval(() => {
      const next = calcRemaining(requestedAt, gracePeriod);
      setRemaining(next);
      if (next <= 0) {
        clearInterval(id);
        handleExpire();
      }
    }, 1_000);

    return () => clearInterval(id);
  }, [requestedAt, gracePeriod, remaining, handleExpire]);

  if (remaining <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
        <CircleCheckBig className="size-3.5" />
        {t("countdown.ready")}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-amber-600 dark:text-amber-400">
      <Clock className="size-3.5" />
      {formatCountdown(remaining)}
    </span>
  );
}
