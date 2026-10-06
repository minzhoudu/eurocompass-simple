import { useEffect } from "react";

import axiosInstance from "../../config/axiosInstance";

const PING_INTERVAL_MS = 2 * 60 * 1000;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"];

// Tells the server the admin is really using the panel, for the "last active"
// shown on the Administratori page. Only real interaction counts (a click, a
// key, a scroll while the tab is visible), at most once every two minutes -
// not the panel's background refreshing, so a tab left open and forgotten does
// not look "active".
// Module-level, so remounting the tracker (React dev mode does, and so does
// navigating between layouts) never sends a second ping within the interval.
let lastPing = 0;

export const useActivityPing = () => {
  useEffect(() => {
    const ping = () => {
      const now = Date.now();

      if (document.visibilityState !== "visible") return;
      if (now - lastPing < PING_INTERVAL_MS) return;

      lastPing = now;
      axiosInstance.post("/auth/activity").catch(() => {
        // Bookkeeping only: a failure must never bother the admin.
      });
    };

    ping();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, ping, { passive: true }),
    );

    return () =>
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, ping),
      );
  }, []);
};
