import { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils";

type SectionHeadingAlign = "center" | "responsive";

type SectionHeadingProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  as?: "h1" | "h2";
  align?: SectionHeadingAlign;
  eyebrow?: ReactNode;
  children: ReactNode;
};

const alignClasses: Record<SectionHeadingAlign, string> = {
  center: "items-center text-center",
  responsive: "items-center text-center lg:items-start lg:text-left",
};

export const SectionHeading = ({
  as = "h2",
  align = "center",
  eyebrow,
  children,
  className,
  ...props
}: SectionHeadingProps) => {
  const Heading = as;

  return (
    <div
      className={cn("flex flex-col gap-2", alignClasses[align], className)}
      {...props}
    >
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-widest text-accent-ink">
          {eyebrow}
        </span>
      )}
      <Heading className="text-2xl font-bold text-ink lg:text-3xl">
        {children}
      </Heading>
      <span className="h-1 w-16 rounded-full bg-brand-yellow-500" />
    </div>
  );
};
