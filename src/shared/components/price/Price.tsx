import { ReactNode } from "react";

type PriceProps = {
  children: ReactNode;
};

export const Price = ({ children }: PriceProps) => {
  return (
    <span className="text-primaryYellow text-nowrap rounded-sm px-1 font-semibold">
      {children}
    </span>
  );
};
