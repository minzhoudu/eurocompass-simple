import { useSyncExternalStore } from "react";
import { Workbox } from "workbox-window";

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

let workbox: Workbox | null = null;
let isUpdateWaiting = false;
let isApplying = false;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

// Browsers only look for a new worker when a page is opened; an installed app
// can stay open for days, so also look now and then and when it comes back to
// the foreground.
const watchForUpdates = (instance: Workbox) => {
  const check = () => void instance.update().catch(() => undefined);

  window.setInterval(check, UPDATE_CHECK_INTERVAL_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") check();
  });
};

// Only in the production build: during development a service worker would
// serve stale files.
export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  workbox = new Workbox("/sw.js");

  // A new version is downloaded in the background but not activated: swapping
  // files under an open page (or a half-filled booking form) could break it.
  workbox.addEventListener("waiting", () => {
    isUpdateWaiting = true;
    notify();
  });

  workbox.addEventListener("controlling", () => {
    // Only reload for an update the visitor asked for, not when the very first
    // worker takes control.
    if (isApplying) window.location.reload();
  });

  workbox
    .register()
    .then(() => workbox && watchForUpdates(workbox))
    .catch(() => {
      // No service worker (private mode, blocked): the site works as before.
    });
};

export const applyServiceWorkerUpdate = () => {
  if (!workbox) return;

  isApplying = true;
  workbox.messageSkipWaiting();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const useServiceWorkerUpdate = () =>
  useSyncExternalStore(
    subscribe,
    () => isUpdateWaiting,
    () => false,
  );
