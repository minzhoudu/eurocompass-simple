/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  matchPrecache,
  precacheAndRoute,
} from "workbox-precaching";
import {
  NavigationRoute,
  registerRoute,
  setCatchHandler,
} from "workbox-routing";
import {
  CacheFirst,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

// What this worker does - and, on purpose, does NOT do:
//  - keeps the public site's own files (the "app shell") so it opens instantly
//    and without a connection;
//  - keeps the last departure times and prices the server sent;
//  - never touches anything else: bookings, login, the admin panel, notices
//    and blocked dates always go to the network, so nothing private or stale
//    is ever served from here.

// A new worker waits (instead of taking over a page that is open, which could
// mix old and new files) until the visitor taps "Osveži" on the banner.
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    void self.skipWaiting();
  }
});

clientsClaim();
cleanupOutdatedCaches();

// Built files (admin chunks are left out of the precache list at build time).
precacheAndRoute(self.__WB_MANIFEST);

// Opening any public page, also straight from the home screen or offline,
// serves the cached shell and the app draws the right page. /admin, server
// functions and real files (sitemap.xml, ...) always go to the network.
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("/index.html"), {
    denylist: [/^\/admin(\/|$)/, /^\/\.netlify\//, /\/[^/]+\.[a-z0-9]+$/i],
  }),
);

// Any other page request (the admin panel, a real file) just goes to the
// network. It is registered so that, when there is no connection, the catch
// handler below can answer with the offline page.
registerRoute(({ request }) => request.mode === "navigate", new NetworkOnly());

// Departure times and prices: the freshest copy when online, the last one
// when not. (Matched by path, whichever server address the backend has.)
registerRoute(
  ({ url, request }) =>
    request.method === "GET" && url.pathname === "/information",
  new NetworkFirst({
    cacheName: "api-information",
    networkTimeoutSeconds: 4,
    plugins: [new ExpirationPlugin({ maxEntries: 2 })],
  }),
);

// Photos and the map data are big and rarely change: kept after first view.
registerRoute(
  ({ url, request }) =>
    request.method === "GET" &&
    url.origin === self.location.origin &&
    /^\/images\//.test(url.pathname),
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 40,
        maxAgeSeconds: 60 * 60 * 24 * 60,
      }),
    ],
  }),
);

registerRoute(
  ({ url, request }) =>
    request.method === "GET" &&
    url.origin === self.location.origin &&
    /^\/data\//.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: "map-data",
    plugins: [new ExpirationPlugin({ maxEntries: 4 })],
  }),
);

// A page that is neither cached nor reachable (the admin panel offline, for
// example) shows a plain "no connection" page instead of the browser's error.
setCatchHandler(async ({ request }) => {
  if (request.destination === "document") {
    const offlinePage = await matchPrecache("/offline.html");

    if (offlinePage) return offlinePage;
  }

  return Response.error();
});
