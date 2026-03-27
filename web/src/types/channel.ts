export interface ChannelMeta {
  close_grace_period_seconds: number;
}

export type ChannelStatus = "open" | "close_requested" | "closed" | "expired";

export interface Channel {
  c_channel_id: string;
  c_payer: string;
  c_payee: string;
  c_token: string;
  c_authorized_signer: string;
  c_deposit: string;
  c_settled: string;
  c_status: ChannelStatus;
  c_close_requested_at: string | null;
  c_finalized: 0 | 1;
  c_finalized_reason: "expired" | "closed" | null;
  c_created_block: number;
  c_created_at: string;
  c_updated_block: number;
  c_updated_at: string;
}

export interface ChannelEvent {
  c_channel_id: string;
  c_event_name: string;
  c_block_number: number;
  c_block_timestamp: string;
  c_transaction_hash: string;
  c_transaction_index: number;
  c_log_index: number;
  c_contract: string;
  c_chain_id: number;
  c_event_data: Record<string, unknown>;
  c_created_at: string;
}

export interface ChannelBalance {
  c_channel_id: string;
  c_event_name: string;
  c_deposit: string;
  c_settled: string;
  c_delta: string;
  c_block_number: number;
  c_block_timestamp: string;
  c_transaction_hash: string;
  c_log_index: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** GET /channels/:channel_id/events/summary */
export interface ChannelEventsSummary {
  event_counts: Record<string, number>;
  min_c_block_number: number | null;
  max_c_block_number: number | null;
  min_c_block_timestamp: string | null;
  max_c_block_timestamp: string | null;
}

export type ActionType =
  | "request-withdraw"
  | "withdraw-ready"
  | "withdraw-available";
