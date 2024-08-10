import { ReactNode } from "react";

type InformationsParagraphProps = {
  children: ReactNode;
  className?: string;
};

export const InformationsParagraph = ({
  children,
  className,
}: InformationsParagraphProps) => {
  return <p className={`text-white ${className}`}>{children}</p>;
};
