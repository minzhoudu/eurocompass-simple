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
      className={`border-primaryYellow flex w-full flex-col ${textCenter ? "text-center lg:text-left" : ""} gap-2 rounded-lg border-4 bg-primaryBlue p-5 font-semibold lg:text-xl`}
    >
      {children}
    </div>
  );
};
