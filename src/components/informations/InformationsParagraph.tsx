import { ReactNode } from "react";

type InformationsParagraphProps = {
  children: ReactNode;
  className?: string;
};

export const InformationsParagraph = ({
  children,
  className,
}: InformationsParagraphProps) => {
  return <p className={`text-gray-700 ${className}`}>{children}</p>;
};
