import { ReactNode } from "react";

type TravelTimeProps = {
  children: ReactNode;
};

export const TravelTime = ({ children }: TravelTimeProps) => {
  return (
    <span className="text-accent-ink underline underline-offset-2">
      {children}
    </span>
  );
};
