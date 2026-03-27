import request from "./request";
import type { MetaChainsResponse, MetaSyncResponse } from "../types/meta";

export function getMetaChains() {
  return request.get<unknown, MetaChainsResponse>("/meta/chains");
}

export function getMetaSync() {
  return request.get<unknown, MetaSyncResponse>("/meta/sync");
}
