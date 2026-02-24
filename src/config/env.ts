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
