import { ReactNode } from "react";

type FieldErrorProps = {
  id?: string;
  children: ReactNode;
};

export const FieldError = ({ id, children }: FieldErrorProps) => (
  <p id={id} role="alert" className="text-sm font-semibold text-danger">
    {children}
  </p>
);
