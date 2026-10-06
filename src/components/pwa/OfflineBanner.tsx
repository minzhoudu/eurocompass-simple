import { IoCloudOfflineOutline } from "react-icons/io5";

import { useOnlineStatus } from "../../pwa";

// Shown only while the device has no connection.
export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="flex w-full items-center justify-center gap-2 bg-ink px-4 py-2 text-center text-sm font-semibold text-on-ink"
    >
      <IoCloudOfflineOutline className="size-5 shrink-0" aria-hidden="true" />
      <span>
        Nema internet veze. Prikazani su poslednji sačuvani polasci i cene,
        rezervacija nije moguća dok se veza ne vrati.
      </span>
    </div>
  );
};
