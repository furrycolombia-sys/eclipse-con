import { useEffect } from "react";

import { environment } from "@/shared/infrastructure/config/environment";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...arguments_: unknown[]) => void;
  }
}

const GOOGLE_TAG_SCRIPT_ID = "google-analytics-gtag";
const GOOGLE_TAG_INLINE_SCRIPT_ID = "google-analytics-inline";

interface GoogleAnalyticsProps {
  readonly hasAnalyticsConsent: boolean;
}

function removeGoogleAnalyticsScripts() {
  document.getElementById(GOOGLE_TAG_SCRIPT_ID)?.remove();
  document.getElementById(GOOGLE_TAG_INLINE_SCRIPT_ID)?.remove();
}

function sendPageView(measurementId: string) {
  const pagePath = `${window.location.pathname}${window.location.hash || ""}`;
  window.gtag?.("event", "page_view", {
    send_to: measurementId,
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
  });
}

/** Loads GA4 only after analytics consent and tracks hash-router page views manually. */
export function GoogleAnalytics({ hasAnalyticsConsent }: GoogleAnalyticsProps) {
  useEffect(() => {
    const hasMeasurementId =
      environment.analyticsEnabled &&
      environment.googleAnalyticsEnabled &&
      environment.gaMeasurementId.length > 0;

    if (!hasMeasurementId || !hasAnalyticsConsent) {
      removeGoogleAnalyticsScripts();
      return;
    }

    if (!document.getElementById(GOOGLE_TAG_SCRIPT_ID)) {
      const externalScript = document.createElement("script");
      externalScript.id = GOOGLE_TAG_SCRIPT_ID;
      externalScript.async = true;
      externalScript.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaMeasurementId}`;
      document.head.append(externalScript);
    }

    if (!document.getElementById(GOOGLE_TAG_INLINE_SCRIPT_ID)) {
      const inlineScript = document.createElement("script");
      inlineScript.id = GOOGLE_TAG_INLINE_SCRIPT_ID;
      inlineScript.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
        gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
        gtag('config', '${environment.gaMeasurementId}', {
          send_page_view: false
        });
      `;
      document.head.append(inlineScript);
    } else {
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }

    const onRouteChange = () => {
      sendPageView(environment.gaMeasurementId);
    };

    const onWindowLoad = () => {
      sendPageView(environment.gaMeasurementId);
    };

    if (document.readyState === "complete") {
      sendPageView(environment.gaMeasurementId);
    } else {
      window.addEventListener("load", onWindowLoad, { once: true });
    }

    window.addEventListener("hashchange", onRouteChange);

    return () => {
      window.removeEventListener("load", onWindowLoad);
      window.removeEventListener("hashchange", onRouteChange);
    };
  }, [hasAnalyticsConsent]);

  return null;
}
