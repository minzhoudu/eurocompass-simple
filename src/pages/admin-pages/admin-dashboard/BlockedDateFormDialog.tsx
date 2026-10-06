import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";

import { DateField, SelectField } from "../../../components";
import {
  Alert,
  BlockedDate,
  Button,
  CITY_NAMES,
  DEFAULT_RESERVATION_FILTERS,
  FormInput,
  getCurrentDate,
  pluralize,
  SaveBlockedDateDto,
  useDepartureSchedule,
  useReservations,
  useSaveBlockedDate,
} from "../../../shared";

const REASON_MAX_LENGTH = 200;

type BlockedDateFormDialogProps = {
  // Omit to create a new block.
  blockedDate?: BlockedDate;
  onClose: () => void;
};

// Mounted only while open (the parent unmounts it on close), so the form
// state always starts fresh from the block being edited.
export const BlockedDateFormDialog = ({
  blockedDate,
  onClose,
}: BlockedDateFormDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { mutate, isPending, isError, error } = useSaveBlockedDate();
  const { schedule } = useDepartureSchedule();

  const [startsOn, setStartsOn] = useState<string | null>(
    blockedDate?.startsOn ?? null,
  );
  // A single-day block is stored with endsOn == startsOn; show that as empty.
  const [endsOn, setEndsOn] = useState<string | null>(
    blockedDate && blockedDate.endsOn !== blockedDate.startsOn
      ? blockedDate.endsOn
      : null,
  );
  const [city, setCity] = useState(blockedDate?.city ?? "");
  const [time, setTime] = useState(blockedDate?.time ?? "");
  const [reason, setReason] = useState(blockedDate?.reason ?? "");
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const lastDay = endsOn ?? startsOn;

  const startError = !startsOn ? "Izaberite datum početka" : undefined;
  const rangeError =
    startsOn && endsOn && endsOn < startsOn
      ? "Datum završetka ne može biti pre datuma početka"
      : undefined;
  const reasonError =
    reason.length > REASON_MAX_LENGTH
      ? `Razlog može imati najviše ${REASON_MAX_LENGTH} karaktera`
      : undefined;

  // Existing bookings that fall inside the block: they are kept, but the admin
  // should know to contact those passengers.
  const hasValidRange = !!startsOn && !!lastDay && lastDay >= startsOn;
  const { data: affected } = useReservations({
    page: 1,
    search: "",
    filters: {
      ...DEFAULT_RESERVATION_FILTERS,
      travelFrom: startsOn ?? "",
      travelTo: lastDay ?? "",
      location: city,
      time,
    },
    enabled: hasValidRange,
  });
  const affectedCount = hasValidRange ? (affected?.total ?? 0) : 0;

  const cityOptions = useMemo(
    () => [
      { value: "", label: "Svi polasci (oba grada)" },
      ...CITY_NAMES.map((name) => ({ value: name, label: name })),
    ],
    [],
  );

  const timeOptions = useMemo(
    () => [
      { value: "", label: "Svi polasci tog dana" },
      ...[
        ...new Set([
          ...schedule.krusevac,
          ...schedule.beograd,
          ...schedule.beogradSunday,
        ]),
      ]
        .sort()
        .map((value) => ({ value, label: `Samo polazak u ${value}` })),
    ],
    [schedule],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setShowErrors(true);

    if (startError || rangeError || reasonError || !startsOn) return;

    const dto: SaveBlockedDateDto = {
      startsOn,
      endsOn: endsOn ?? startsOn,
      city: city || null,
      time: time || null,
      reason: reason.trim() || null,
    };

    mutate({ id: blockedDate?.id, blockedDate: dto }, { onSuccess: onClose });
  };

  const today = getCurrentDate();

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
          {blockedDate ? "Izmena blokade" : "Nova blokada datuma"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <DateField
            label="Od datuma"
            value={startsOn}
            onChange={setStartsOn}
            placeholder="Izaberite datum"
            allowPastDates={!!blockedDate && (startsOn ?? today) < today}
          />
          <DateField
            label="Do datuma (uključujući)"
            value={endsOn}
            onChange={setEndsOn}
            placeholder="Samo taj dan"
          />
        </div>

        {showErrors && (startError || rangeError) && (
          <Alert variant="error">{startError ?? rangeError}</Alert>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Polazak iz"
            value={city}
            options={cityOptions}
            onChange={setCity}
          />
          <SelectField
            label="Koji polasci"
            value={time}
            options={timeOptions}
            onChange={setTime}
          />
        </div>

        <FormInput
          text="Razlog (prikazuje se putnicima, nije obavezan)"
          name="blocked-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="npr. Državni praznik"
          error={showErrors ? reasonError : undefined}
        />

        {affectedCount > 0 && (
          <Alert variant="warning">
            Za ovaj period{" "}
            {pluralize(
              affectedCount,
              "već postoji",
              "već postoje",
              "već postoji",
            )}{" "}
            {affectedCount}{" "}
            {pluralize(
              affectedCount,
              "rezervacija",
              "rezervacije",
              "rezervacija",
            )}
            . Ostaju sačuvane - obavestite putnike ako je potrebno.
          </Alert>
        )}

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
