import { IoSwapHorizontalOutline } from "react-icons/io5";

import logo from "/images/eurocompass_logo.webp";

export const Brand = () => (
  <div className="flex flex-col items-start gap-4">
    <img src={logo} alt="Eurocompass" className="w-40" />

    <div className="flex flex-col gap-1 text-sm">
      <p className="text-ink-muted">Prevoz putnika na relaciji</p>
      <p className="flex items-center gap-2 font-semibold text-ink">
        Kruševac
        <IoSwapHorizontalOutline className="size-4 text-accent-ink" />
        Beograd
      </p>
    </div>
  </div>
);
