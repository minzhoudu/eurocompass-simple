import { HTMLAttributes } from "react";

import { cn } from "../../utils";

type AlertVariant = "warning" | "error" | "info";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: string;
};

const variantClasses: Record<AlertVariant, string> = {
  warning: "border-brand-yellow-500 bg-brand-yellow-50 text-brand-black-900",
  error: "border-red-400 bg-red-50 text-red-700",
  info: "border-gray-300 bg-gray-50 text-gray-700",
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
