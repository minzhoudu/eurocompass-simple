import { ButtonHTMLAttributes } from "react";

import { cn } from "../../utils";

type ChoiceVariant = "tile" | "pill" | "date";

type ChoiceButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  selected: boolean;
  variant?: ChoiceVariant;
};

const variantClasses: Record<ChoiceVariant, string> = {
  tile: "rounded-xl px-4 py-3 text-left",
  pill: "rounded-full px-4 py-2 text-sm font-semibold",
  date: "flex min-w-[4.5rem] flex-col items-center rounded-xl px-3 py-2 text-center",
};

export const ChoiceButton = ({
  selected,
  variant = "pill",
  className,
  ...props
}: ChoiceButtonProps) => (
  <button
    type="button"
    aria-pressed={selected}
    className={cn(
      "border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500 disabled:cursor-not-allowed disabled:opacity-40",
      variantClasses[variant],
      selected
        ? "border-brand-yellow-500 bg-brand-yellow-500/10 text-accent-ink ring-1 ring-brand-yellow-500"
        : "border-line-strong bg-raised text-ink-muted hover:border-brand-yellow-500 hover:text-ink",
      className,
    )}
    {...props}
  />
);
