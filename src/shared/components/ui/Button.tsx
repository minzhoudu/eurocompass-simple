import { ButtonHTMLAttributes, forwardRef } from "react";

import { ButtonSize, ButtonVariant, getButtonClasses } from "./buttonStyles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, type = "button", ...props }, ref) => (
    // Defaults to "button" so a Button inside a <form> never submits it by
    // accident; submit buttons must say type="submit" explicitly.
    <button
      ref={ref}
      type={type}
      className={getButtonClasses({ variant, size, className })}
      {...props}
    />
  ),
);

Button.displayName = "Button";
