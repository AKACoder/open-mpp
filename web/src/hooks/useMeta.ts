import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getMetaChains, getMetaSync } from "../api/meta";
import type { ChainMetadataRow, SyncConfigRow } from "../types/meta";
import { SYNC_REFETCH_INTERVAL_MS } from "../config/queryPolicies";

export const metaKeys = {
  chains: ["meta", "chains"] as const,
  sync: ["meta", "sync"] as const,
};

export function useMetaChains(
  options?: Partial<UseQueryOptions<ChainMetadataRow[]>>,
) {
  return useQuery({
    queryKey: metaKeys.chains,
    queryFn: async () => (await getMetaChains()).data,
    ...options,
  });
}

export function useMetaSync(
  options?: Partial<UseQueryOptions<SyncConfigRow[]>>,
) {
  return useQuery({
    queryKey: metaKeys.sync,
    queryFn: async () => (await getMetaSync()).data,
    refetchInterval: SYNC_REFETCH_INTERVAL_MS,
    ...options,
  });
}
