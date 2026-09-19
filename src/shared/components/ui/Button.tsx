import { ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "../../utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-yellow-500 text-brand-black-900 hover:bg-brand-yellow-600 focus-visible:ring-brand-yellow-600",
  secondary:
    "bg-brand-black-900 text-white hover:bg-brand-black-700 focus-visible:ring-brand-black-700",
  outline:
    "border border-brand-black-900 text-brand-black-900 hover:bg-brand-black-900 hover:text-white focus-visible:ring-brand-black-700",
  ghost: "text-brand-black-900 hover:bg-gray-100 focus-visible:ring-gray-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
