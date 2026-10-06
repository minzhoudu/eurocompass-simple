import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// A single-page app never reloads, so on a page change keyboard focus would stay
// on the old link and screen readers would hear nothing. After each navigation
// (not the first load) this moves focus to the main content, resets the scroll
// and announces the new page title.
export const RouteFocus = () => {
  const { pathname } = useLocation();
  // Compared with the previous path (rather than "is this the first render")
  // so it also holds when React runs effects twice in development.
  const previousPathname = useRef(pathname);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (previousPathname.current === pathname) return;

    previousPathname.current = pathname;

    window.scrollTo(0, 0);
    document.getElementById("main-content")?.focus({ preventScroll: true });

    // The page's own <title> is set a moment after the route renders.
    const timer = setTimeout(() => setAnnouncement(document.title), 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {announcement}
    </div>
  );
};
