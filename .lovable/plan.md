Google Analytics 4 — Centralized Installation

Goal
Install the GA4 global tag (gtag.js) with Measurement ID G-H47NSB1E2H so it loads on every page, tracks page views automatically on route changes, and does not alter the user experience.

Approach

1. Add gtag script to root head
   In `src/routes/__root.tsx`, add the official GA4 gtag.js script tag to the `head` scripts property so it loads on every page render. Include a `<script>` block that initializes `window.dataLayer` and calls `gtag('config', 'G-H47NSB1E2H')`.

2. Create a centralized route-change listener
   Create `src/components/GoogleAnalytics.tsx`. It imports `useRouter` from `@tanstack/react-router`, subscribes to router location changes, and calls `gtag('event', 'page_view', { page_path: location.pathname, page_title: document.title })` whenever the route changes. This replaces manual per-page event tracking and handles TanStack Router client-side navigation automatically.

3. Mount it once in the root component
   Import `<GoogleAnalytics />` into `src/routes/__root.tsx` and render it inside `RootComponent` (near `<Outlet />`). This keeps the implementation in one place and avoids scattering GA code across routes.

No custom events will be added. No existing UI, logic, or payment flows will change. The script loads with `async` and does not block rendering.

Definition of Done
- The GA4 tag is present in `<head>` on every page.
- Navigating between routes fires a new `page_view` event.
- Realtime reports in the GA4 property show visits.
- No other code is touched.