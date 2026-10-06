import { useState } from "react";

import { Button } from "../../shared";
import { applyServiceWorkerUpdate, useServiceWorkerUpdate } from "../../pwa";

// A new version of the site is ready. Applying it reloads the page, so it is
// the visitor's call (they may be in the middle of a booking).
export const UpdateBanner = () => {
  const isUpdateReady = useServiceWorkerUpdate();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isUpdateReady || isDismissed) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-raised p-4 text-ink shadow-2xl"
    >
      <p className="font-semibold">Dostupna je nova verzija sajta.</p>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsDismissed(true)}
        >
          Kasnije
        </Button>
        <Button type="button" size="sm" onClick={applyServiceWorkerUpdate}>
          Osveži
        </Button>
      </div>
    </div>
  );
};
