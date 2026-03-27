/** Row from GET /meta/chains */
export interface ChainMetadataRow {
  c_chain_id: string;
  c_chain_name: string;
  c_chain_symbol: string;
}

/** Row from GET /meta/sync */
export interface SyncConfigRow {
  c_chain_id: string;
  c_contracts: string[];
  c_synced_height: number;
  c_batch_block_size: number;
  c_catchup_threshold: number;
  c_confirm_delay_blocks: number;
  c_normal_interval_ms: number;
  c_catchup_interval_ms: number;
  c_idle_wait_after_latest_ms: number;
  c_max_rpc_failures: number;
}

export interface MetaChainsResponse {
  data: ChainMetadataRow[];
}

export interface MetaSyncResponse {
  data: SyncConfigRow[];
}
