/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHEETS_API_KEY?: string;
  readonly VITE_SHEETS_SHEET_ID?: string;
  readonly VITE_SHEETS_RANGE?: string;
  readonly VITE_SHEETS_WEB_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
