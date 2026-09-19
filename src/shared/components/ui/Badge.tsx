import { HTMLAttributes } from "react";

import { cn } from "../../utils";

type BadgeVariant = "yellow" | "black" | "outline";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  yellow: "bg-brand-yellow-500 text-brand-black-900",
  black: "bg-brand-black-900 text-white",
  outline: "border border-gray-300 text-gray-700",
};

export const Badge = ({
  variant = "yellow",
  className,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
      variantClasses[variant],
      className,
    )}
    {...props}
  />
);
