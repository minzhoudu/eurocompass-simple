import { cn } from "../../utils";

export const LoadingBar = ({ className }: { className?: string }) => (
  <div
    role="progressbar"
    aria-label="Učitavanje"
    className={cn(
      "relative h-1 w-full overflow-hidden rounded-full bg-sunken",
      className,
    )}
  >
    <div className="loading-bar-fill absolute inset-y-0 w-1/3 rounded-full bg-brand-yellow-500" />
  </div>
);
