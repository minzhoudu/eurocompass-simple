import { ReactNode } from "react";

type InformationsContainerProps = {
  children: ReactNode;
  textCenter?: boolean;
};

export const InformationsContainer = ({
  children,
  textCenter,
}: InformationsContainerProps) => {
  return (
    <div
      className={`flex w-full flex-col ${textCenter ? "text-center lg:text-left" : ""} gap-2 rounded-2xl border border-t-4 border-gray-200 border-t-brand-yellow-500 bg-white p-5 font-semibold text-brand-black-900 shadow-card lg:text-xl`}
    >
      {children}
    </div>
  );
};
