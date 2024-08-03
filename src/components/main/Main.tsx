import { ReactNode } from "react";

type MainProps = {
  children: ReactNode;
};

export const Main = ({ children }: MainProps) => {
  return (
    <div className="flex w-3/4 flex-1 flex-col items-center justify-center gap-24 bg-slate-500">
      {children}
    </div>
  );
};
