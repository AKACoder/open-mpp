import {
  useState,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Navigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { clsx } from "clsx";
import {
  useChannelsByPayer,
  useChannelsByPayee,
} from "../hooks/useChannels";
import BackButton from "../components/ui/BackButton";
import ChannelList from "../components/channel/ChannelList";
import ErrorState from "../components/ui/ErrorState";
import AddressWithCopy from "../components/channel/AddressWithCopy";
import Pagination from "../components/ui/Pagination";
import ActionableChannelSections from "../components/actionable/ActionableChannelSections";
import { isValidAddressParam } from "../utils/searchNavigation";

const PAGE_SIZE = 20;
const ROLE_Q = "role";

export function LegacyAddressRedirect({
  role,
}: {
  role: "payer" | "payee";
}) {
  const { address = "" } = useParams<{ address: string }>();
  return (
    <Navigate
      to={`/address/${address}?${ROLE_Q}=${role}`}
      replace
    />
  );
}

export default function AddressView() {
  const { t } = useTranslation();
  const { address = "" } = useParams<{ address: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const roleParam = searchParams.get(ROLE_Q);
  const role: "payer" | "payee" =
    roleParam === "payee" ? "payee" : "payer";

  const setRole = useCallback(
    (next: "payer" | "payee") => {
      setSearchParams({ [ROLE_Q]: next }, { replace: true });
    },
    [setSearchParams],
  );

  const onRoleTabsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setRole("payee");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setRole("payer");
    }
  };

  useEffect(() => {
    setPage(1);
  }, [address, role]);

  const payerQuery = useChannelsByPayer(
    role === "payer" ? address : "",
    page,
    PAGE_SIZE,
  );
  const payeeQuery = useChannelsByPayee(
    role === "payee" ? address : "",
    page,
    PAGE_SIZE,
  );

  const activeQuery = role === "payee" ? payeeQuery : payerQuery;
  const { data, isLoading, error, refetch } = activeQuery;

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  if (!isValidAddressParam(address)) {
    return (
      <div>
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("pages.addressView.title")}
          </h1>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
          {t("pages.addressView.invalidAddress")}
        </p>
      </div>
    );
  }

  const emptyHint =
    role === "payer"
      ? t("pages.addressView.emptyAsPayer")
      : t("pages.addressView.emptyAsPayee");

  return (
    <div>
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("pages.addressView.title")}
        </h1>
      </div>

      <div className="mt-3">
        <AddressWithCopy value={address} chars={12} />
      </div>

      <div
        className="mt-4 inline-flex h-9 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium outline-none ring-accent focus-within:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        role="tablist"
        aria-label={t("pages.addressView.roleTabsAria")}
        tabIndex={0}
        onKeyDown={onRoleTabsKeyDown}
      >
        <button
          type="button"
          role="tab"
          aria-selected={role === "payer"}
          onClick={() => setRole("payer")}
          className={clsx(
            "rounded-md px-4 py-1.5 transition-colors",
            role === "payer"
              ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
              : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200",
          )}
        >
          {t("search.rolePayer")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={role === "payee"}
          onClick={() => setRole("payee")}
          className={clsx(
            "rounded-md px-4 py-1.5 transition-colors",
            role === "payee"
              ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
              : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200",
          )}
        >
          {t("search.rolePayee")}
        </button>
      </div>

      {role === "payer" ? (
        <div className="mt-8">
          <ActionableChannelSections payer={address} />
        </div>
      ) : (
        <p className="mt-6 text-xs text-slate-500 dark:text-zinc-500">
          {t("pages.addressView.actionablePayeeNote")}
        </p>
      )}

      <h2 className="mt-10 text-lg font-semibold tracking-tight">
        {t("pages.addressView.channelsHeading")}
      </h2>

      {error ? (
        <div className="mt-4">
          <ErrorState onRetry={() => refetch()} />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <ChannelList
              channels={data?.data ?? []}
              isLoading={isLoading}
              emptyMessage={emptyHint}
            />
          </div>
          {totalPages > 1 ? (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
