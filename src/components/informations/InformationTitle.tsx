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
      className={`self-center rounded-md bg-primaryYellow px-3 py-1 text-lg font-bold tracking-wide lg:text-xl ${className}`}
    >
      {children}
    </h2>
  );
};
