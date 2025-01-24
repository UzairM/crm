/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORY_SDK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 