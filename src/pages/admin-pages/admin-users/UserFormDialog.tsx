import { FormEvent, useEffect, useId, useRef, useState } from "react";

import {
  AdminUser,
  Alert,
  Button,
  ChoiceButton,
  FormInput,
  getApiErrorMessage,
  ROLE_LABELS,
  USER_ROLES,
  UserRole,
  useSaveAdminUser,
} from "../../../shared";
import { PasswordField } from "./PasswordField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner:
    "Sve što i administrator, plus istorija izmena i upravljanje administratorima.",
  admin:
    "Rezervacije, putnici, cene, obaveštenja i blokirani termini. Bez istorije izmena i upravljanja nalozima.",
};

type UserFormDialogProps = {
  // Omit to add a new administrator.
  user?: AdminUser;
  // Your own role can't be changed (so there is always an owner).
  isSelf: boolean;
  onClose: () => void;
};

// Mounted only while open (the parent unmounts it on close), so the form
// always starts fresh from the account being edited.
export const UserFormDialog = ({
  user,
  isSelf,
  onClose,
}: UserFormDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { mutate, isPending, isError, error } = useSaveAdminUser();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<UserRole>(user?.role ?? "admin");
  const [password, setPassword] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const errors = {
    firstName: firstName.trim() ? undefined : "Unesite ime",
    lastName: lastName.trim() ? undefined : "Unesite prezime",
    email: EMAIL_PATTERN.test(email.trim())
      ? undefined
      : "Unesite ispravnu email adresu",
    password: user
      ? undefined
      : password.length < MIN_PASSWORD_LENGTH
        ? `Lozinka mora imati najmanje ${MIN_PASSWORD_LENGTH} karaktera`
        : password.length > MAX_PASSWORD_LENGTH
          ? `Lozinka može imati najviše ${MAX_PASSWORD_LENGTH} karaktera`
          : undefined,
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setShowErrors(true);

    if (Object.values(errors).some(Boolean)) return;

    const details = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      role,
    };

    if (user) {
      mutate({ id: user.id, user: details }, { onSuccess: onClose });
    } else {
      mutate({ user: { ...details, password } }, { onSuccess: onClose });
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isPending) onClose();
      }}
      className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-line bg-raised p-0 text-ink shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5 p-6"
      >
        <h2 id={titleId} className="text-xl font-bold">
          {user ? "Izmena naloga" : "Novi administrator"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            text="Ime"
            name="user-first-name"
            required
            autoComplete="off"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            error={showErrors ? errors.firstName : undefined}
          />
          <FormInput
            text="Prezime"
            name="user-last-name"
            required
            autoComplete="off"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            error={showErrors ? errors.lastName : undefined}
          />
        </div>

        <FormInput
          text="Email adresa (korisničko ime)"
          name="user-email"
          type="email"
          inputMode="email"
          required
          autoComplete="off"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={showErrors ? errors.email : undefined}
        />

        <div className="flex flex-col gap-2">
          <span
            id={`${titleId}-role`}
            className="text-sm font-semibold text-ink"
          >
            Uloga
          </span>

          <div
            role="group"
            aria-labelledby={`${titleId}-role`}
            className="flex flex-wrap gap-2"
          >
            {USER_ROLES.map((option) => (
              <ChoiceButton
                key={option}
                variant="pill"
                selected={role === option}
                disabled={isSelf}
                onClick={() => setRole(option)}
              >
                {ROLE_LABELS[option]}
              </ChoiceButton>
            ))}
          </div>

          <p className="text-sm text-ink-muted">
            {isSelf ? "Svoju ulogu ne možete promeniti. " : ""}
            {ROLE_DESCRIPTIONS[role]}
          </p>
        </div>

        {!user && (
          <PasswordField
            label="Lozinka"
            name="user-password"
            value={password}
            onChange={setPassword}
            error={showErrors ? errors.password : undefined}
          />
        )}

        {user && user.email !== email.trim() && (
          <p className="text-sm text-ink-muted">
            Nakon promene email adrese, osoba se prijavljuje novom adresom.
          </p>
        )}

        {isError && (
          <Alert variant="error">
            {getApiErrorMessage(
              error,
              "Čuvanje nije uspelo. Pokušajte ponovo.",
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
            {isPending ? "Čuvanje..." : "Sačuvaj"}
          </Button>
        </div>
      </form>
    </dialog>
  );
};
