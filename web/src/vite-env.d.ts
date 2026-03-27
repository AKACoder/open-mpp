/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  /** Base URL for tx links, e.g. https://explore.tempo.xyz/tx (no trailing slash). */
  readonly VITE_EXPLORER_TX_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
