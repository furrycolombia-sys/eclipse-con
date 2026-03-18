import type { AnalyticsProfile } from "@/features/analytics/infrastructure/trackingSchema";

const analyticsProfile =
  String(import.meta.env.VITE_ANALYTICS_PROFILE ?? "lean")
    .trim()
    .toLowerCase() === "full"
    ? "full"
    : "lean";
const cloudflareWebAnalyticsEnabled =
  import.meta.env.VITE_CF_WEB_ANALYTICS_ENABLED === "true";
const googleAnalyticsEnabled =
  import.meta.env.VITE_GA_MEASUREMENT_ENABLED === "true";

/** Centralized runtime configuration derived from Vite environment variables. */
export const environment = {
  appName: String(import.meta.env.VITE_APP_NAME ?? "Moonfest 2026"),
  defaultLocale: String(import.meta.env.VITE_DEFAULT_LOCALE ?? "en"),
  supportedLocales: String(
    import.meta.env.VITE_SUPPORTED_LOCALES ?? "en,es"
  ).split(","),
  debug: import.meta.env.VITE_DEBUG === "true",
  analyticsEndpoint: String(
    import.meta.env.VITE_ANALYTICS_ENDPOINT ?? ""
  ).trim(),
  analyticsEnabled: import.meta.env.VITE_ANALYTICS_ENABLED === "true",
  cloudflareWebAnalyticsEnabled,
  cfWebAnalyticsToken: String(
    import.meta.env.VITE_CF_WEB_ANALYTICS_TOKEN ?? ""
  ).trim(),
  googleAnalyticsEnabled,
  gaMeasurementId: String(import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim(),
  posthogApiKey: String(import.meta.env.VITE_POSTHOG_API_KEY ?? "").trim(),
  posthogHost: String(
    import.meta.env.VITE_POSTHOG_HOST ?? "https://us.i.posthog.com"
  ).trim(),
  analyticsProfile: analyticsProfile as AnalyticsProfile,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
