import { useSyncExternalStore } from "react";

// Chrome / Edge / Android: the browser offers to install the site by firing
// this event (once, early), and lets us show our own button instead.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let isInstalled = false;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

// iPhone / iPad have no install event; installing is done by hand from the
// share menu, so we can only explain how.
const isIos = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// Call once at start-up, before the footer exists, so the event isn't missed.
export const listenForInstallPrompt = () => {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    isInstalled = true;
    notify();
  });
};

export type InstallState = "none" | "prompt" | "ios";

const getState = (): InstallState => {
  if (isInstalled || isStandalone()) return "none";
  if (deferredPrompt) return "prompt";

  return isIos() ? "ios" : "none";
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const useInstallState = () =>
  useSyncExternalStore(subscribe, getState, () => "none" as InstallState);

export const promptInstall = async () => {
  if (!deferredPrompt) return;

  const prompt = deferredPrompt;

  // The browser allows one prompt per event.
  deferredPrompt = null;
  notify();
  await prompt.prompt();
  await prompt.userChoice;
};
