import { ReactNode } from "react";

type FooterHeadingProps = {
  children: ReactNode;
};

export const FooterHeading = ({ children }: FooterHeadingProps) => (
  <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">
    {children}
  </h2>
);
