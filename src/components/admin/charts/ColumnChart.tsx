import { cn } from "../../../shared";
import { ChartTooltip, TooltipRow } from "./ChartTooltip";
import { getNiceScale, useChartTooltip, useElementWidth } from "./chartUtils";

export type ColumnSeries = {
  key: string;
  label: string;
  // CSS colour, normally a var(--viz-...) token.
  color: string;
};

export type ColumnDatum = {
  key: string;
  // Short text under the column (shown only for some columns if crowded).
  label: string;
  // Heading of the tooltip and the screen-reader description.
  title: string;
  values: Record<string, number>;
};

type ColumnChartProps = {
  data: ColumnDatum[];
  series: ColumnSeries[];
  unit: string;
  ariaLabel: string;
  // Plot height in px, excluding the x-axis labels.
  height?: number;
  // Highlight only the tallest column in the (single) series colour and grey
  // out the rest - for "which one stands out" charts.
  emphasizePeak?: boolean;
  // "all": a value above every column; "peak": only above the tallest.
  valueLabels?: "all" | "peak";
};

const DIM_COLOR = "var(--viz-dim)";
const MAX_COLUMN_WIDTH = "max-w-6"; // 24px: marks stay thin

const getTotal = (datum: ColumnDatum, series: ColumnSeries[]) =>
  series.reduce((sum, item) => sum + (datum.values[item.key] ?? 0), 0);

export const ColumnChart = ({
  data,
  series,
  unit,
  ariaLabel,
  height = 220,
  emphasizePeak = false,
  valueLabels,
}: ColumnChartProps) => {
  const [plotRef, plotWidth] = useElementWidth<HTMLDivElement>();
  const { containerRef, tooltip, show, hide } = useChartTooltip<ColumnDatum>();

  const totals = data.map((datum) => getTotal(datum, series));
  const max = Math.max(0, ...totals);
  const peakIndex = max > 0 ? totals.indexOf(max) : -1;
  const { top, ticks } = getNiceScale(max);

  // Show an axis label only every n-th column so they never collide.
  const maxLabels = Math.max(2, Math.floor(plotWidth / 52));
  const labelEvery = Math.max(1, Math.ceil(data.length / maxLabels));

  return (
    <div className="flex flex-col gap-3">
      {series.length > 1 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
          {series.map((item) => (
            <li key={item.key} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      )}

      <div
        ref={containerRef}
        role="group"
        aria-label={ariaLabel}
        className="relative mt-5 flex"
      >
        <div
          aria-hidden="true"
          className="relative w-8 shrink-0 text-xs tabular-nums text-ink-subtle"
          style={{ height }}
        >
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-2 -translate-y-1/2"
              style={{ bottom: `${(tick / top) * 100}%` }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div ref={plotRef} className="min-w-0 flex-1">
          <div className="relative" style={{ height }}>
            {ticks.map((tick) => (
              <div
                key={tick}
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 border-t",
                  tick === 0 ? "border-line-strong" : "border-line",
                )}
                style={{ bottom: `${(tick / top) * 100}%` }}
              />
            ))}

            <div className="absolute inset-0 flex items-end">
              {data.map((datum, index) => {
                const total = totals[index];
                const segments = series.filter(
                  (item) => (datum.values[item.key] ?? 0) > 0,
                );
                const isPeak = index === peakIndex;
                const showValue =
                  total > 0 &&
                  (valueLabels === "all" || (valueLabels === "peak" && isPeak));
                const description = `${datum.title}: ${total} ${unit}${
                  series.length > 1
                    ? ` (${series
                        .map(
                          (item) =>
                            `${item.label} ${datum.values[item.key] ?? 0}`,
                        )
                        .join(", ")})`
                    : ""
                }`;

                return (
                  <div
                    key={datum.key}
                    tabIndex={0}
                    role="img"
                    aria-label={description}
                    onPointerEnter={(event) => show(event.currentTarget, datum)}
                    onFocus={(event) => show(event.currentTarget, datum)}
                    // Touch: keep the tooltip after the finger lifts; it closes on blur.
                    onPointerLeave={(event) => {
                      if (event.pointerType !== "touch") hide();
                    }}
                    onBlur={hide}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end px-px outline-none hover:bg-sunken/70 focus-visible:bg-sunken/70 focus-visible:ring-2 focus-visible:ring-brand-yellow-500"
                  >
                    {showValue && (
                      <span className="mb-1 text-xs font-semibold text-ink">
                        {total}
                      </span>
                    )}

                    <div
                      className={cn(
                        "flex w-full flex-col-reverse gap-[2px]",
                        MAX_COLUMN_WIDTH,
                      )}
                      style={{ height: `${(total / top) * 100}%` }}
                    >
                      {segments.map((item, segmentIndex) => (
                        <div
                          key={item.key}
                          className={cn(
                            // Rounded 4px data end, square at the baseline.
                            segmentIndex === segments.length - 1 &&
                              "rounded-t-[4px]",
                          )}
                          style={{
                            flex: `${datum.values[item.key]} 1 0%`,
                            backgroundColor:
                              emphasizePeak && !isPeak ? DIM_COLOR : item.color,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div aria-hidden="true" className="flex h-6 pt-1.5">
            {data.map((datum, index) => (
              <div
                key={datum.key}
                className="relative min-w-0 flex-1 px-px text-xs text-ink-muted"
              >
                {index % labelEvery === 0 && (
                  <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                    {datum.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {tooltip && (
          <ChartTooltip left={tooltip.left} top={tooltip.top}>
            <p className="mb-1 text-xs font-semibold text-ink-muted">
              {tooltip.content.title}
            </p>

            {series.map((item) => {
              const value = tooltip.content.values[item.key] ?? 0;

              return series.length === 1 || value > 0 ? (
                <TooltipRow
                  key={item.key}
                  color={item.color}
                  value={`${value}`}
                  label={series.length === 1 ? unit : item.label}
                />
              ) : null;
            })}

            {series.length > 1 && (
              <div className="mt-1 border-t border-line pt-1">
                <TooltipRow
                  value={`${getTotal(tooltip.content, series)}`}
                  label={`ukupno ${unit}`}
                />
              </div>
            )}
          </ChartTooltip>
        )}
      </div>
    </div>
  );
};
