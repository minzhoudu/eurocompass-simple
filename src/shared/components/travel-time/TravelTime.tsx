import { ReactNode } from "react";

type TravelTimeProps = {
  children: ReactNode;
};

export const TravelTime = ({ children }: TravelTimeProps) => {
  return (
    <span className="text-primaryYellow underline underline-offset-2">
      {children}
    </span>
  );
};
