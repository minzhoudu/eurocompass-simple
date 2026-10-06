import { ReactNode } from "react";

type ChartTooltipProps = {
  // Anchor point (top-centre of the hovered mark) inside the chart container.
  left: number;
  top: number;
  children: ReactNode;
};

// Floats above the hovered / focused mark. Purely an enhancement: every value
// it shows is also in the chart labels or the table view.
export const ChartTooltip = ({ left, top, children }: ChartTooltipProps) => (
  <div
    role="presentation"
    className="pointer-events-none absolute z-10 w-max max-w-[11rem] rounded-lg border border-line-strong bg-raised px-3 py-2 text-sm text-ink shadow-lg"
    style={{
      // Keep the tooltip inside the container near its edges.
      left: `clamp(5.5rem, ${left}px, calc(100% - 5.5rem))`,
      top,
      transform: "translate(-50%, calc(-100% - 6px))",
    }}
  >
    {children}
  </div>
);

type TooltipRowProps = {
  // CSS colour (var) of the series; omit for a plain row.
  color?: string;
  value: string;
  label: string;
};

// Value first (strong), series name second - the reader already has the
// series and wants the number. A short stroke keys the series colour.
export const TooltipRow = ({ color, value, label }: TooltipRowProps) => (
  <div className="flex items-center gap-2">
    {color && (
      <span
        aria-hidden="true"
        className="h-[3px] w-3 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
    )}
    <span className="font-bold text-ink">{value}</span>
    <span className="text-ink-muted">{label}</span>
  </div>
);
