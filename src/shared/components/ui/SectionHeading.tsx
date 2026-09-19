import { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils";

type SectionHeadingProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  as?: "h1" | "h2";
  eyebrow?: ReactNode;
  children: ReactNode;
};

export const SectionHeading = ({
  as = "h2",
  eyebrow,
  children,
  className,
  ...props
}: SectionHeadingProps) => {
  const Heading = as;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 text-center lg:items-start lg:text-left",
        className,
      )}
      {...props}
    >
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-yellow-600">
          {eyebrow}
        </span>
      )}
      <Heading className="text-2xl font-bold text-brand-black-900 lg:text-3xl">
        {children}
      </Heading>
      <span className="h-1 w-16 rounded-full bg-brand-yellow-500" />
    </div>
  );
};
