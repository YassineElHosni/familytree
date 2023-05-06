/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DATABASE: string
    readonly VITE_JWT_SECRET: string
    readonly VITE_ORIGIN_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
