import { useState } from "react";
import {
  IoCheckmark,
  IoCopyOutline,
  IoEyeOffOutline,
  IoEyeOutline,
} from "react-icons/io5";

import { Button, FormInput } from "../../../shared";

// No look-alike characters (0/O, 1/l/I), so a password read out over the
// phone or typed from a message is not misread.
const ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const generatePassword = (length = 14) => {
  const limit = 256 - (256 % ALPHABET.length);
  const chars: string[] = [];

  while (chars.length < length) {
    const [byte] = crypto.getRandomValues(new Uint8Array(1));

    // Skip the top slice so every character is equally likely.
    if (byte < limit) chars.push(ALPHABET[byte % ALPHABET.length]);
  }

  return chars.join("");
};

type PasswordFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

// The owner chooses (or generates) the password and has to pass it on, so it
// can be shown and copied. Hidden until asked for.
export const PasswordField = ({
  label,
  name,
  value,
  onChange,
  error,
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Clipboard blocked: the password is visible, so it can be copied by hand.
      setIsVisible(true);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FormInput
        text={label}
        name={name}
        type={isVisible ? "text" : "password"}
        autoComplete="new-password"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={error}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onChange(generatePassword());
            setIsVisible(true);
          }}
        >
          Generiši lozinku
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={isVisible}
          onClick={() => setIsVisible((visible) => !visible)}
        >
          {isVisible ? (
            <IoEyeOffOutline className="size-4" aria-hidden="true" />
          ) : (
            <IoEyeOutline className="size-4" aria-hidden="true" />
          )}
          {isVisible ? "Sakrij" : "Prikaži"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!value}
          onClick={copy}
        >
          {isCopied ? (
            <IoCheckmark className="size-4" aria-hidden="true" />
          ) : (
            <IoCopyOutline className="size-4" aria-hidden="true" />
          )}
          {isCopied ? "Kopirano" : "Kopiraj"}
        </Button>
      </div>
    </div>
  );
};
