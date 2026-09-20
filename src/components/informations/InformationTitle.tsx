import { ReactNode } from "react";

type InformationTitleProps = {
  children: ReactNode;
  className?: string;
};

export const InformationTitle = ({
  children,
  className,
}: InformationTitleProps) => {
  return (
    <h2
      className={`self-center border-b-4 border-brand-yellow-500 pb-1 text-lg font-bold tracking-wide text-ink lg:text-xl ${className}`}
    >
      {children}
    </h2>
  );
};
