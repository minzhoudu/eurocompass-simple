import { useCallback, useEffect, useRef, useState } from "react";

// A "nice" axis for 0..max: the largest step of 1 / 2 / 5 x 10^k that gives at
// most ~4 intervals, so ticks read as clean numbers (0, 10, 20 ...).
export const getNiceScale = (max: number, maxIntervals = 4) => {
  if (max <= 0) return { top: 1, ticks: [0, 1] };

  const rawStep = max / maxIntervals;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step =
    [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStep) ??
    10 * magnitude;
  const top = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);

  return { top, ticks };
};

// Width of an element, kept up to date - used to decide how many axis labels
// fit without colliding.
export const useElementWidth = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const update = () => setWidth(element.getBoundingClientRect().width);

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
};

type TooltipState<T> = { content: T; left: number; top: number } | null;

// Shared hover / focus tooltip plumbing: `show(element, content)` anchors the
// tooltip to the top-centre of the hovered or focused mark, relative to the
// chart container.
export const useChartTooltip = <T>() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState<T>>(null);

  const show = useCallback((element: HTMLElement, content: T) => {
    const container = containerRef.current?.getBoundingClientRect();

    if (!container) return;

    const mark = element.getBoundingClientRect();

    setTooltip({
      content,
      left: mark.left - container.left + mark.width / 2,
      top: mark.top - container.top,
    });
  }, []);

  const hide = useCallback(() => setTooltip(null), []);

  return { containerRef, tooltip, show, hide };
};
