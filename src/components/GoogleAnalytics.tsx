import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = "G-H47NSB1E2H";

export function GoogleAnalytics() {
  const router = useRouter();

  useEffect(() => {
    const unsub = router.subscribe("onResolved", ({ toLocation }) => {
      if (typeof window === "undefined" || typeof window.gtag !== "function") return;
      window.gtag("event", "page_view", {
        page_path: toLocation.pathname + toLocation.searchStr,
        page_location: window.location.href,
        page_title: document.title,
        send_to: GA_MEASUREMENT_ID,
      });
    });
    return () => {
      unsub();
    };
  }, [router]);

  return null;
}
