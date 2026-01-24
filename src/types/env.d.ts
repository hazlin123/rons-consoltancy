interface ImportMetaEnv {
  readonly VITE_ADMIN_USER?: string;
  readonly VITE_ADMIN_PASS?: string;
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
