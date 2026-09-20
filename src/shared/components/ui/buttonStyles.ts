import { cn } from "../../utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-yellow-500 text-brand-black-900 hover:bg-brand-yellow-600 focus-visible:ring-brand-yellow-600",
  secondary:
    "bg-ink text-on-ink hover:bg-ink-muted focus-visible:ring-ink-muted",
  outline:
    "border border-ink text-ink hover:bg-ink hover:text-on-ink focus-visible:ring-ink-muted",
  ghost: "text-ink hover:bg-sunken focus-visible:ring-line-strong",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-lg",
};

type ButtonClassOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

// Shared so links (react-router <Link>) can look like buttons.
export const getButtonClasses = ({
  variant = "primary",
  size = "md",
  className,
}: ButtonClassOptions = {}) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-raised disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
