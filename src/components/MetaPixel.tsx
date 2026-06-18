import { useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import { META_PIXEL_ID, meta } from "@/lib/meta";

// Loads the Meta Pixel script once and fires PageView on every route change.
// Loading is async and wrapped in try/catch so it can never block the UI.
export function MetaPixel() {
  const router = useRouter();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!META_PIXEL_ID) return;
    if (loadedRef.current) return;
    loadedRef.current = true;

    try {
      // Official Meta Pixel bootstrap snippet, inlined.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (function (f: any, b: Document, e: string, v: string) {
        if (f.fbq) return;
        const n: any = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        f.fbq = n;
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        const t = b.createElement(e) as HTMLScriptElement;
        t.async = true;
        t.src = v;
        const s = b.getElementsByTagName(e)[0];
        s?.parentNode?.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js",
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      w.fbq("init", META_PIXEL_ID);
      w.fbq("track", "PageView");
    } catch {
      // Never throw from analytics.
    }
  }, []);

  // Track subsequent SPA page views.
  useEffect(() => {
    if (!META_PIXEL_ID) return;
    const unsub = router.subscribe("onResolved", () => {
      meta.pageView();
    });
    return () => {
      unsub();
    };
  }, [router]);

  return null;
}
