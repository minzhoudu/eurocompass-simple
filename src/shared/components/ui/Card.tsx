import { HTMLAttributes } from "react";

import { cn } from "../../utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
};

export const Card = ({ padded = true, className, ...props }: CardProps) => (
  <div
    className={cn(
      "rounded-2xl border border-gray-200 bg-white shadow-card",
      padded && "p-6",
      className,
    )}
    {...props}
  />
);
