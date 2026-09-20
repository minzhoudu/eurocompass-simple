import {
  ChangeEvent,
  FocusEvent,
  HTMLInputTypeAttribute,
  ReactNode,
} from "react";

import { cn } from "../../utils";
import { FieldError } from "./FieldError";

type FormInputProps = {
  text: string;
  name: string;
  required?: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value?: string;
  type?: HTMLInputTypeAttribute | "textarea";
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email";
  icon?: ReactNode;
  suffix?: ReactNode;
  error?: string;
};

const fieldClasses =
  "w-full rounded-lg border border-line-strong bg-raised text-ink placeholder:text-ink-subtle focus:border-brand-yellow-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow-200 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-200";

export const FormInput = ({
  text,
  name,
  required,
  onChange,
  onBlur,
  value,
  placeholder,
  type,
  autoComplete,
  autoFocus,
  inputMode,
  icon,
  suffix,
  error,
}: FormInputProps) => {
  const errorId = `${name}-error`;
  const sharedProps = {
    id: name,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    autoComplete,
    autoFocus,
    inputMode,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-ink">
        {text}{" "}
        {required && (
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle">
            {icon}
          </span>
        )}

        {type === "textarea" ? (
          <textarea
            {...sharedProps}
            rows={4}
            className={cn(fieldClasses, "px-3 py-3")}
          />
        ) : (
          <input
            {...sharedProps}
            type={type || "text"}
            className={cn(
              fieldClasses,
              "h-12",
              icon ? "pl-11" : "pl-3",
              suffix ? "pr-14" : "pr-3",
            )}
          />
        )}

        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-muted">
            {suffix}
          </span>
        )}
      </div>

      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
};
