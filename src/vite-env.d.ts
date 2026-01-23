/// \u003creference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AMADEUS_API_KEY: string;
    readonly VITE_AMADEUS_API_SECRET: string;
    readonly VITE_AMADEUS_ENVIRONMENT: 'test' | 'production';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
