import { HTMLAttributes } from "react";

import { cn } from "../../utils";

type BadgeVariant = "yellow" | "black" | "outline";

type BadgeSize = "sm" | "md";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
};

const variantClasses: Record<BadgeVariant, string> = {
  yellow: "bg-brand-yellow-500 text-brand-black-900",
  black: "bg-ink text-on-ink",
  outline: "border border-line-strong text-ink-muted",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
};

export const Badge = ({
  variant = "yellow",
  size = "sm",
  className,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full font-semibold uppercase tracking-wide",
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
    {...props}
  />
);
