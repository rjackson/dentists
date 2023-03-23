namespace NodeJS {
    interface ProcessEnv {
        NHSDIGITAL_ODATA_ENDPOINT: string;
        NHSDIGITAL_ODATA_SUBSCRIPTION_KEY: string;
        NEXT_PUBLIC_GEONAMES_USERNAME: string;
        CLOUDFLARE_API_TOKEN: string;
        CLOUDFLARE_ACCOUNT_ID: string;
        CLOUDFLARE_KV_NAMESPACE: string;
        SENDGRID_API_KEY: string;
        EMAIL_FROM_ADDRESS: string;
        MAX_DENTISTS: string;
        NEXT_PUBLIC_FALLBACK_SITE_URL: string;
        NEXT_PUBLIC_FATHOM_CUSTOM_DOMAIN: string;
        NEXT_PUBLIC_FATHOM_TRACKING_CODE: string;

        NEXT_PUBLIC_URL?: string;
        NEXT_PUBLIC_VERCEL_URL?: string;
    }
}