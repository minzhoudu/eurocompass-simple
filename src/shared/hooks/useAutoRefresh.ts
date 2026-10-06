import { useSyncExternalStore } from "react";

const STORAGE_KEY = "adminAutoRefresh";

// Polling is paused by react-query while the tab is hidden, and the data is
// refetched when the tab becomes visible again.
export const AUTO_REFRESH_INTERVAL_MS = 30_000;

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

// On by default; only an explicit "off" turns it off.
const getSnapshot = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
};

const setAutoRefreshEnabled = (enabled: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Storage unavailable - the choice just won't survive a reload.
  }

  listeners.forEach((listener) => listener());
};

// One shared on/off setting for every admin page that polls.
export const useAutoRefresh = () => {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, () => true);

  return {
    enabled,
    setEnabled: setAutoRefreshEnabled,
    // Pass straight to a query's `refetchInterval`.
    refetchInterval: enabled ? AUTO_REFRESH_INTERVAL_MS : (false as const),
  };
};
