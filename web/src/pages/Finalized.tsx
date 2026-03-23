import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFinalizedChannels } from "../hooks/useChannels";
import ChannelList from "../components/channel/ChannelList";
import Pagination from "../components/ui/Pagination";
import ErrorState from "../components/ui/ErrorState";

const PAGE_SIZE = 20;

export default function Finalized() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useFinalizedChannels(
    page,
    PAGE_SIZE,
  );

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("pages.finalized.title")}
      </h1>

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
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
