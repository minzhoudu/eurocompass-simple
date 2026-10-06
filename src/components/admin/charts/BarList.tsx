import { ChartTooltip, TooltipRow } from "./ChartTooltip";
import { useChartTooltip } from "./chartUtils";

export type BarListItem = {
  key: string;
  label: string;
  value: number;
  // CSS colour of the bar, normally the colour of the city it belongs to.
  color: string;
  // Extra line(s) for the tooltip, e.g. "12 rezervacija".
  detail?: string;
};

type BarListProps = {
  items: BarListItem[];
  unit: string;
  ariaLabel: string;
  // Width of the label column (CSS length); long labels wrap.
  labelWidth?: string;
  // Legend entries (rect swatches) when more than one colour is in use.
  legend?: { label: string; color: string }[];
};

export const BarList = ({
  items,
  unit,
  ariaLabel,
  labelWidth = "8.5rem",
  legend,
}: BarListProps) => {
  const { containerRef, tooltip, show, hide } = useChartTooltip<BarListItem>();
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="flex flex-col gap-3">
      {legend && legend.length > 1 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
          {legend.map((entry) => (
            <li key={entry.label} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              {entry.label}
            </li>
          ))}
        </ul>
      )}

      <div
        ref={containerRef}
        role="group"
        aria-label={ariaLabel}
        className="relative flex flex-col gap-1"
      >
        {items.length === 0 && (
          <p className="text-sm text-ink-muted">
            Nema podataka za ovaj period.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.key}
            tabIndex={0}
            role="img"
            aria-label={`${item.label}: ${item.value} ${unit}${item.detail ? `, ${item.detail}` : ""}`}
            onPointerEnter={(event) => show(event.currentTarget, item)}
            onFocus={(event) => show(event.currentTarget, item)}
            // Touch: keep the tooltip after the finger lifts; it closes on blur.
            onPointerLeave={(event) => {
              if (event.pointerType !== "touch") hide();
            }}
            onBlur={hide}
            style={{
              gridTemplateColumns: `minmax(0, ${labelWidth}) minmax(0, 1fr)`,
            }}
            className="grid items-center gap-3 rounded-md px-1 py-1 outline-none hover:bg-sunken/70 focus-visible:bg-sunken/70 focus-visible:ring-2 focus-visible:ring-brand-yellow-500"
          >
            <span className="text-sm leading-tight text-ink">{item.label}</span>

            <div className="flex items-center gap-2">
              <div
                className="h-3.5 rounded-r-[4px]"
                style={{
                  // Leaves room for the value at the bar tip.
                  width: `${Math.max(2, (item.value / max) * 82)}%`,
                  backgroundColor: item.color,
                }}
              />
              <span className="text-sm font-semibold tabular-nums text-ink">
                {item.value}
              </span>
            </div>
          </div>
        ))}

        {tooltip && (
          <ChartTooltip left={tooltip.left} top={tooltip.top}>
            <p className="mb-1 text-xs font-semibold text-ink-muted">
              {tooltip.content.label}
            </p>
            <TooltipRow
              color={tooltip.content.color}
              value={`${tooltip.content.value}`}
              label={unit}
            />
            {tooltip.content.detail && (
              <p className="text-xs text-ink-muted">{tooltip.content.detail}</p>
            )}
          </ChartTooltip>
        )}
      </div>
    </div>
  );
};
