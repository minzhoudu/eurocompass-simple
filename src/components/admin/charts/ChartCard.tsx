import { ReactNode, useId, useState } from "react";
import { IoGridOutline, IoStatsChartOutline } from "react-icons/io5";

import { Card, cn } from "../../../shared";

type ChartTable = {
  columns: string[];
  rows: (string | number)[][];
};

type ChartCardProps = {
  title: string;
  subtitle?: string;
  // The table twin of the chart: same numbers, readable without colour.
  table: ChartTable;
  // Previous data stays visible (dimmed) while a new range loads.
  isRefetching?: boolean;
  children: ReactNode;
};

export const ChartCard = ({
  title,
  subtitle,
  table,
  isRefetching = false,
  children,
}: ChartCardProps) => {
  const [showTable, setShowTable] = useState(false);
  const titleId = useId();

  return (
    <Card
      aria-labelledby={titleId}
      role="group"
      className="viz-root flex min-w-0 flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 id={titleId} className="text-lg font-bold text-ink">
            {title}
          </h3>
          {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
        </div>

        <button
          type="button"
          aria-pressed={showTable}
          onClick={() => setShowTable((value) => !value)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold text-ink-muted transition-colors hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500"
        >
          {showTable ? (
            <IoStatsChartOutline className="size-4" aria-hidden="true" />
          ) : (
            <IoGridOutline className="size-4" aria-hidden="true" />
          )}
          {showTable ? "Grafikon" : "Tabela"}
        </button>
      </div>

      <div
        aria-busy={isRefetching}
        className={cn("transition-opacity", isRefetching && "opacity-50")}
      >
        {showTable ? (
          <div className="max-h-80 overflow-auto rounded-lg border border-line">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-sunken text-ink">
                <tr>
                  {table.columns.map((column, index) => (
                    <th
                      key={column}
                      scope="col"
                      className={cn(
                        "px-3 py-2 font-semibold",
                        index > 0 && "text-right",
                      )}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {table.rows.map((row) => (
                  <tr key={String(row[0])}>
                    {row.map((cell, index) => (
                      <td
                        key={index}
                        className={cn(
                          "px-3 py-1.5 text-ink",
                          index > 0 && "text-right tabular-nums",
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
};
