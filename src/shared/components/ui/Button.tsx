import { ButtonHTMLAttributes, forwardRef } from "react";

import { ButtonSize, ButtonVariant, getButtonClasses } from "./buttonStyles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => (
    <button
      ref={ref}
      className={getButtonClasses({ variant, size, className })}
      {...props}
    />
  ),
);

Button.displayName = "Button";
