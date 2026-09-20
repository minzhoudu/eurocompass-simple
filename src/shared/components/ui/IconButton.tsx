import { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils";

type IconButtonTone = "default" | "danger" | "accent";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  label: string;
  tone?: IconButtonTone;
  children: ReactNode;
};

const toneClasses: Record<IconButtonTone, string> = {
  default: "text-ink-muted hover:bg-sunken hover:text-ink",
  danger: "text-ink-muted hover:bg-red-500/10 hover:text-danger",
  accent: "text-accent-ink hover:bg-brand-yellow-500/10",
};

export const IconButton = ({
  label,
  tone = "default",
  className,
  children,
  ...props
}: IconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={cn(
      "inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500 disabled:cursor-not-allowed disabled:opacity-40 sm:size-9",
      toneClasses[tone],
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
