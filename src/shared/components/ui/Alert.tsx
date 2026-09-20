import { HTMLAttributes } from "react";

import { cn } from "../../utils";

type AlertVariant = "warning" | "error" | "info";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: string;
};

const variantClasses: Record<AlertVariant, string> = {
  warning: "border-brand-yellow-500 bg-brand-yellow-500/10 text-ink",
  error: "border-red-400 bg-red-500/10 text-danger",
  info: "border-line-strong bg-sunken/50 text-ink-muted",
};

export const Alert = ({
  variant = "info",
  title,
  className,
  children,
  ...props
}: AlertProps) => (
  <div
    className={cn("rounded-xl border-l-4 p-4", variantClasses[variant], className)}
    {...props}
  >
    {title && (
      <p className="mb-1 font-bold uppercase tracking-wide">{title}</p>
    )}
    <div className="text-sm leading-relaxed">{children}</div>
  </div>
);
