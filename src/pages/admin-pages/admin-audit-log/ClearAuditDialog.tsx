import { useEffect, useId, useRef, useState } from "react";

import {
  Alert,
  Button,
  ChoiceButton,
  getApiErrorMessage,
  useClearAuditLog,
} from "../../../shared";

// null = everything.
type Choice = { label: string; olderThanDays: number | null };

const CHOICES: Choice[] = [
  { label: "Starije od 30 dana", olderThanDays: 30 },
  { label: "Starije od 90 dana", olderThanDays: 90 },
  { label: "Starije od 6 meseci", olderThanDays: 180 },
  { label: "Svi zapisi", olderThanDays: null },
];

type ClearAuditDialogProps = {
  onClose: () => void;
  onCleared: (deletedCount: number) => void;
};

// Mounted only while open, so the choice always starts empty.
export const ClearAuditDialog = ({
  onClose,
  onCleared,
}: ClearAuditDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { mutate, isPending, isError, error } = useClearAuditLog();
  const [choice, setChoice] = useState<Choice | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleConfirm = () => {
    if (!choice) return;

    mutate(choice.olderThanDays, {
      onSuccess: (deletedCount) => {
        onCleared(deletedCount);
        onClose();
      },
    });
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
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-2">
          <h2 id={titleId} className="text-xl font-bold">
            Obrisati zapise istorije?
          </h2>
          <p className="text-ink-muted">
            Izabrani zapisi se brišu trajno i ne mogu se vratiti. Sama akcija
            brisanja ostaje zabeležena u istoriji.
          </p>
        </div>

        <div
          role="group"
          aria-label="Koje zapise obrisati"
          className="flex flex-wrap gap-2"
        >
          {CHOICES.map((option) => (
            <ChoiceButton
              key={option.label}
              variant="pill"
              selected={choice === option}
              disabled={isPending}
              onClick={() => setChoice(option)}
            >
              {option.label}
            </ChoiceButton>
          ))}
        </div>

        {isError && (
          <Alert variant="error">
            {getApiErrorMessage(
              error,
              "Brisanje nije uspelo. Pokušajte ponovo.",
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
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            disabled={!choice || isPending}
          >
            {isPending ? "Brisanje..." : "Obriši"}
          </Button>
        </div>
      </div>
    </dialog>
  );
};
