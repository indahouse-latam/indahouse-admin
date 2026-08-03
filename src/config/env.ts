/**
 * Environment: QA (develop) vs Production (main).
 * - main branch → production (NEXT_PUBLIC_APP_ENV=production en Vercel)
 * - develop branch → qa (NEXT_PUBLIC_APP_ENV=qa o sin definir en Preview)
 *
 * Por defecto se considera QA si no está definido (más seguro).
 */
export const APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV ?? "qa") as "qa" | "production";

export const isProduction = APP_ENV === "production";
export const isQa = APP_ENV === "qa";

const DEPRECATED_AMOY_RPC_HOST = 'rpc-amoy.polygon.technology';

const normalizeFqdn = (name: string, hostname: string): string => {
    const normalized = hostname.replace(/\.+$/, '');
    const labels = normalized.split('.');
    const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

    if (
        normalized.includes(':')
        || labels.length < 2
        || labels.every((label) => /^\d+$/.test(label))
        || labels.some((label) => !validLabel.test(label))
    ) {
        throw new Error(`${name} must use an FQDN`);
    }

    return normalized;
};

const requireHttpsUrl = (name: string, value: string | undefined): string => {
    if (!value?.trim()) {
        throw new Error(`${name} is required`);
    }

    let url: URL;
    try {
        url = new URL(value);
    } catch {
        throw new Error(`${name} must be a valid URL`);
    }

    if (url.protocol !== 'https:') {
        throw new Error(`${name} must use HTTPS`);
    }
    const hostname = normalizeFqdn(name, url.hostname);
    if (hostname === DEPRECATED_AMOY_RPC_HOST) {
        throw new Error(`${name} uses Polygon's retired Amoy RPC`);
    }
    url.hostname = hostname;

    return url.toString().replace(/\/$/, '');
};

export const POLYGON_AMOY_RPC_URL = requireHttpsUrl(
    'NEXT_PUBLIC_POLYGON_AMOY_RPC_URL',
    process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL,
);
