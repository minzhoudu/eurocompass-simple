import { ReactNode } from "react";

import { FieldError } from "./FieldError";

type FormSectionProps = {
  step: number;
  title: string;
  children: ReactNode;
};

export const FormSection = ({ step, title, children }: FormSectionProps) => (
  <section className="flex flex-col gap-5 border-t border-line pt-8 first:border-t-0 first:pt-0">
    <h3 className="flex items-center gap-3 text-lg font-bold text-ink">
      <span className="flex size-7 items-center justify-center rounded-full bg-brand-yellow-500/20 text-sm text-accent-ink">
        {step}
      </span>
      {title}
    </h3>

    {children}
  </section>
);

type FieldLabelProps = {
  id: string;
  required?: boolean;
  children: ReactNode;
};

export const FieldLabel = ({ id, required, children }: FieldLabelProps) => (
  <p id={id} className="text-sm font-semibold text-ink">
    {children}{" "}
    {required && (
      <span className="text-danger" aria-hidden="true">
        *
      </span>
    )}
  </p>
);

type FieldGroupProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export const FieldGroup = ({
  id,
  label,
  required,
  error,
  children,
}: FieldGroupProps) => (
  <div
    id={id}
    tabIndex={-1}
    role="group"
    aria-labelledby={`${id}-label`}
    className="flex flex-col gap-3 outline-none"
  >
    <FieldLabel id={`${id}-label`} required={required}>
      {label}
    </FieldLabel>

    {children}

    {error && <FieldError>{error}</FieldError>}
  </div>
);
