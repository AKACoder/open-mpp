import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useChannelsByPayer, useChannelsByPayee } from "../hooks/useChannels";
import BackButton from "../components/ui/BackButton";
import ChannelList from "../components/channel/ChannelList";
import ErrorState from "../components/ui/ErrorState";
import AddressWithCopy from "../components/channel/AddressWithCopy";
import Pagination from "../components/ui/Pagination";

const PAGE_SIZE = 20;

export default function AddressView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { type = "payer", address = "" } = useParams<{
    type: string;
    address: string;
  }>();

  const payerQuery = useChannelsByPayer(
    type === "payer" ? address : "",
    page,
    PAGE_SIZE,
  );
  const payeeQuery = useChannelsByPayee(
    type === "payee" ? address : "",
    page,
    PAGE_SIZE,
  );

  const query = type === "payee" ? payeeQuery : payerQuery;
  const { data, isLoading, error, refetch } = query;

  useEffect(() => {
    setPage(1);
  }, [type, address]);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <div>
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("pages.addressView.title")}
        </h1>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-500">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium uppercase dark:bg-zinc-800">
          {type}
        </span>
        <AddressWithCopy value={address} chars={10} />
      </div>

      {error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <div className="mt-6">
            <ChannelList
              channels={data?.data ?? []}
              isLoading={isLoading}
            />
          </div>
          {totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
}
