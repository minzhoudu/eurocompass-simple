import { ReactNode } from "react";

type PriceProps = {
  children: ReactNode;
};

export const Price = ({ children }: PriceProps) => {
  return (
    <span className="text-nowrap rounded-sm px-1 font-bold text-brand-yellow-700">
      {children}
    </span>
  );
};
