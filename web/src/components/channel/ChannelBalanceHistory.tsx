import { useTranslation } from "react-i18next";
import type { ChannelBalance } from "../../types/channel";
import { formatAmount, formatDate } from "../../utils/format";
import TxHashLink from "./TxHashLink";

interface Props {
  balances: ChannelBalance[];
}

export default function ChannelBalanceHistory({ balances }: Props) {
  const { t } = useTranslation();

  if (balances.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400 dark:text-zinc-600">
        {t("detail.noBalance")}
      </p>
    );
  }

  return (
    <>
      <DesktopTable balances={balances} />
      <MobileCards balances={balances} />
    </>
  );
}

function DesktopTable({ balances }: { balances: ChannelBalance[] }) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block">
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
              <th className="px-4 py-3 font-medium text-slate-500 dark:text-zinc-500">
                {t("table.event")}
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-zinc-500">
                {t("table.deposit")}
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-zinc-500">
                {t("table.settled")}
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-zinc-500">
                {t("table.delta")}
              </th>
              <th className="px-4 py-3 font-medium text-slate-500 dark:text-zinc-500">
                {t("table.block")}
              </th>
              <th className="px-4 py-3 font-medium text-slate-500 dark:text-zinc-500">
                {t("table.txHash")}
              </th>
              <th className="px-4 py-3 font-medium text-slate-500 dark:text-zinc-500">
                {t("table.timestamp")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {balances.map((b, i) => (
              <tr key={`${b.c_block_number}-${b.c_log_index}-${i}`}>
                <td className="px-4 py-3 text-sm font-medium">
                  {b.c_event_name}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
                  {formatAmount(b.c_deposit)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
                  {formatAmount(b.c_settled)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
                  {formatAmount(b.c_delta)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-zinc-500">
                  {b.c_block_number.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <TxHashLink hash={b.c_transaction_hash} chars={6} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-zinc-500">
                  {formatDate(b.c_block_timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MobileCards({ balances }: { balances: ChannelBalance[] }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-3 md:hidden">
      {balances.map((b, i) => (
        <div
          key={`${b.c_block_number}-${b.c_log_index}-${i}`}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{b.c_event_name}</span>
            <span className="text-xs text-slate-400 dark:text-zinc-600">
              {formatDate(b.c_block_timestamp)}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-slate-400 dark:text-zinc-600">
                {t("table.deposit")}
              </p>
              <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums">
                {formatAmount(b.c_deposit)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-zinc-600">
                {t("table.settled")}
              </p>
              <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums">
                {formatAmount(b.c_settled)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-zinc-600">
                {t("table.delta")}
              </p>
              <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums">
                {formatAmount(b.c_delta)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-500">
            <span className="font-mono">
              Block {b.c_block_number.toLocaleString()}
            </span>
            <TxHashLink hash={b.c_transaction_hash} chars={6} />
          </div>
        </div>
      ))}
    </div>
  );
}
