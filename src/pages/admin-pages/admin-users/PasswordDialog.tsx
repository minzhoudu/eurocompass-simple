import { FormEvent, useEffect, useId, useRef, useState } from "react";

import {
  AdminUser,
  Alert,
  Button,
  getApiErrorMessage,
  useResetAdminPassword,
} from "../../../shared";
import { PasswordField } from "./PasswordField";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;

type PasswordDialogProps = {
  user: AdminUser;
  isSelf: boolean;
  onClose: () => void;
};

export const PasswordDialog = ({
  user,
  isSelf,
  onClose,
}: PasswordDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { mutate, isPending, isError, error } = useResetAdminPassword();

  const [password, setPassword] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const passwordError =
    password.length < MIN_PASSWORD_LENGTH
      ? `Lozinka mora imati najmanje ${MIN_PASSWORD_LENGTH} karaktera`
      : password.length > MAX_PASSWORD_LENGTH
        ? `Lozinka može imati najviše ${MAX_PASSWORD_LENGTH} karaktera`
        : undefined;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setShowErrors(true);

    if (passwordError) return;

    mutate({ id: user.id, password }, { onSuccess: onClose });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isPending) onClose();
      }}
      className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-line bg-raised p-0 text-ink shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5 p-6"
      >
        <div className="flex flex-col gap-1">
          <h2 id={titleId} className="text-xl font-bold">
            Nova lozinka
          </h2>
          <p className="text-ink-muted">
            {user.firstName} {user.lastName} ({user.email})
          </p>
        </div>

        <PasswordField
          label="Nova lozinka"
          name="user-new-password"
          value={password}
          onChange={setPassword}
          error={showErrors ? passwordError : undefined}
        />

        <p className="text-sm text-ink-muted">
          {isSelf
            ? "Ostajete prijavljeni na ovom uređaju."
            : "Ova osoba će biti odjavljena sa svih uređaja i prijavljuje se novom lozinkom. Prosledite joj je lično."}
        </p>

        {isError && (
          <Alert variant="error">
            {getApiErrorMessage(
              error,
              "Promena lozinke nije uspela. Pokušajte ponovo.",
            )}
          </Alert>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
          >
            Otkaži
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Čuvanje..." : "Postavi lozinku"}
          </Button>
        </div>
      </form>
    </dialog>
  );
};
