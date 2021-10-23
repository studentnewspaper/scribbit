interface ImportMetaEnv
  extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_COMMIT: string | undefined;
  readonly VITE_EDITION_DATE: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
