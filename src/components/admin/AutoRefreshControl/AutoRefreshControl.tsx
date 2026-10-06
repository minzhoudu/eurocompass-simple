import { IoRefreshOutline } from "react-icons/io5";

import { AUTO_REFRESH_INTERVAL_MS, cn, IconButton } from "../../../shared";

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("sr-RS", {
    timeZone: "Europe/Belgrade",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

type AutoRefreshControlProps = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  // When the data was last fetched (react-query's `dataUpdatedAt`; 0 = never).
  updatedAt: number;
  // Adds a manual refresh button; leave out if the page already has one.
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
};

export const AutoRefreshControl = ({
  enabled,
  onToggle,
  updatedAt,
  onRefresh,
  isRefreshing = false,
  className,
}: AutoRefreshControlProps) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm text-ink-muted print:hidden",
      className,
    )}
  >
    {updatedAt > 0 && <span>Ažurirano u {formatTime(updatedAt)}</span>}

    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onToggle(!enabled)}
      className="inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500"
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          enabled ? "bg-brand-yellow-500" : "bg-line-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-white shadow transition-all",
            enabled ? "left-[1.1rem]" : "left-0.5",
          )}
        />
      </span>
      Automatsko osvežavanje ({AUTO_REFRESH_INTERVAL_MS / 1000} s)
    </button>

    {onRefresh && (
      <IconButton label="Osveži" onClick={onRefresh} disabled={isRefreshing}>
        <IoRefreshOutline
          className={cn("size-5", isRefreshing && "animate-spin")}
        />
      </IconButton>
    )}
  </div>
);
