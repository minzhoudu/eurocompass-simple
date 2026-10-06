import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { IoCalendarOutline, IoClose } from "react-icons/io5";

import { NoticeMessage } from "../../../components";
import {
  Alert,
  Button,
  CalendarDialog,
  ChoiceButton,
  FormInput,
  getFormattedDate,
  IconButton,
  Notice,
  NoticeSeverity,
  SaveNoticeDto,
  useSaveNotice,
} from "../../../shared";

const MAX_LENGTH = 500;

const SEVERITY_OPTIONS: { value: NoticeSeverity; label: string }[] = [
  { value: "info", label: "Obaveštenje" },
  { value: "warning", label: "Upozorenje" },
  { value: "danger", label: "Hitno" },
];

type DateFieldProps = {
  label: string;
  value: string | null;
  onChange: (date: string | null) => void;
};

const DateField = ({ label, value, onChange }: DateFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-ink">{label}</span>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 justify-start"
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
        >
          <IoCalendarOutline className="size-5 shrink-0" aria-hidden="true" />
          {value ? getFormattedDate(value) : "Bez ograničenja"}
        </Button>

        {value && (
          <IconButton label="Ukloni datum" onClick={() => onChange(null)}>
            <IoClose className="size-5" />
          </IconButton>
        )}
      </div>

      <CalendarDialog
        open={isOpen}
        value={value ?? ""}
        onSelect={(date) => {
          onChange(date);
          setIsOpen(false);
        }}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

type NoticeFormDialogProps = {
  // Omit to create a new notice.
  notice?: Notice;
  onClose: () => void;
};

// Mounted only while open (the parent unmounts it on close), so the form
// state always starts fresh from the notice being edited.
export const NoticeFormDialog = ({
  notice,
  onClose,
}: NoticeFormDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { mutate, isPending, isError, error } = useSaveNotice();

  const [message, setMessage] = useState(notice?.message ?? "");
  const [severity, setSeverity] = useState<NoticeSeverity>(
    notice?.severity ?? "info",
  );
  const [startsOn, setStartsOn] = useState<string | null>(
    notice?.startsOn ?? null,
  );
  const [endsOn, setEndsOn] = useState<string | null>(notice?.endsOn ?? null);
  const [isEnabled, setIsEnabled] = useState(notice?.isEnabled ?? true);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const trimmedMessage = message.trim();
  const messageError = !trimmedMessage
    ? "Unesite tekst obaveštenja"
    : message.length > MAX_LENGTH
      ? `Tekst može imati najviše ${MAX_LENGTH} karaktera`
      : undefined;
  const datesError =
    startsOn && endsOn && endsOn < startsOn
      ? "Datum završetka ne može biti pre datuma početka"
      : undefined;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setShowErrors(true);

    if (messageError || datesError) return;

    const dto: SaveNoticeDto = {
      message: trimmedMessage,
      severity,
      startsOn,
      endsOn,
      isEnabled,
    };

    mutate({ id: notice?.id, notice: dto }, { onSuccess: onClose });
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
          {notice ? "Izmena obaveštenja" : "Novo obaveštenje"}
        </h2>

        <FormInput
          text="Tekst obaveštenja"
          name="notice-message"
          type="textarea"
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="npr. Zbog praznika 1. januara nema polaska u 07:00."
          error={showErrors ? messageError : undefined}
        />
        <p className="-mt-3 text-right text-xs text-ink-subtle">
          {message.length}/{MAX_LENGTH}
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">Vrsta</span>
          <div className="flex flex-wrap gap-2">
            {SEVERITY_OPTIONS.map((option) => (
              <ChoiceButton
                key={option.value}
                variant="pill"
                selected={severity === option.value}
                onClick={() => setSeverity(option.value)}
              >
                {option.label}
              </ChoiceButton>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DateField
            label="Prikazuj od"
            value={startsOn}
            onChange={setStartsOn}
          />
          <DateField
            label="Prikazuj do (uključujući)"
            value={endsOn}
            onChange={setEndsOn}
          />
        </div>

        {showErrors && datesError && (
          <Alert variant="error">{datesError}</Alert>
        )}

        <p className="-mt-2 text-sm text-ink-muted">
          Bez datuma obaveštenje se prikazuje stalno, dok ga ne isključite ili
          obrišete.
        </p>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(event) => setIsEnabled(event.target.checked)}
            className="size-5 accent-brand-yellow-500"
          />
          <span className="font-semibold text-ink">Uključeno</span>
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">Pregled</span>
          <div className="overflow-hidden rounded-xl border border-line">
            <NoticeMessage
              notice={{
                message: trimmedMessage || "Ovako će izgledati obaveštenje.",
                severity,
              }}
            />
          </div>
        </div>

        {isError && (
          <Alert variant="error">
            {(
              error as { response?: { data?: { message?: unknown } } }
            )?.response?.data?.message?.toString() ??
              "Čuvanje nije uspelo. Pokušajte ponovo."}
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
