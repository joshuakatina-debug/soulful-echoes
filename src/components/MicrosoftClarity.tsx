import { useEffect } from "react";

const CLARITY_PROJECT_ID = "x969fgm47g";

function isProduction(): boolean {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  // Production domains — published site and custom domain
  return hostname === "soul-soundscape-quiz.lovable.app" || hostname === "www.getsoulsounds.com" || hostname === "getsoulsounds.com";
}

export function MicrosoftClarity() {
  useEffect(() => {
    if (!isProduction()) return;

    const w = window as unknown as Record<string, unknown>;
    const d = document;

    (function (c: Record<string, unknown>, l: Document, a: string, r: string, i: string, t: HTMLScriptElement | null, y: Node | null) {
      c[a] =
        (c[a] as ((...args: unknown[]) => void) | undefined) ||
        function (...args: unknown[]) {
          (c[a] as { q?: unknown[] }).q = (c[a] as { q?: unknown[] }).q || [];
          (c[a] as { q: unknown[] }).q.push(args);
        };
      t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0] as Node | null;
      if (y && y.parentNode) {
        y.parentNode.insertBefore(t, y);
      }
    })(w, d, "clarity", "script", CLARITY_PROJECT_ID, null, null);
  }, []);

  return null;
}
