import { useMemo } from "react";

import { DateField, SelectField } from "../../../components";
import {
  Button,
  Card,
  ChoiceButton,
  CITIES,
  CITY_NAMES,
  getCityName,
  getCurrentDate,
  parseDateValue,
  ReservationFilters,
  ReservationSort,
  toDateValue,
  useDepartureSchedule,
} from "../../../shared";

const SORT_OPTIONS: { value: ReservationSort; label: string }[] = [
  { value: "newest", label: "Najnovije poslato" },
  { value: "travel_asc", label: "Datum putovanja (najraniji prvo)" },
  { value: "travel_desc", label: "Datum putovanja (najkasniji prvo)" },
];

const addDays = (date: string, days: number) => {
  const shifted = parseDateValue(date);
  shifted.setDate(shifted.getDate() + days);

  return toDateValue(shifted);
};

type ReservationFiltersPanelProps = {
  filters: ReservationFilters;
  onChange: (filters: ReservationFilters) => void;
  onReset: () => void;
  canReset: boolean;
};

export const ReservationFiltersPanel = ({
  filters,
  onChange,
  onReset,
  canReset,
}: ReservationFiltersPanelProps) => {
  const { schedule } = useDepartureSchedule();

  const update = (changes: Partial<ReservationFilters>) =>
    onChange({ ...filters, ...changes });

  const today = getCurrentDate();
  const datePresets = [
    { label: "Putuje danas", from: today, to: today },
    { label: "Putuje sutra", from: addDays(today, 1), to: addDays(today, 1) },
    { label: "Narednih 7 dana", from: today, to: addDays(today, 6) },
  ];

  const locationOptions = useMemo(
    () => [
      { value: "", label: "Svi polasci" },
      ...CITY_NAMES.flatMap((city) => [
        { value: city, label: `${city} (sve stanice)` },
        ...CITIES.filter((station) => getCityName(station) === city).map(
          (station) => ({ value: station, label: station }),
        ),
      ]),
    ],
    [],
  );

  const timeOptions = useMemo(
    () => [
      { value: "", label: "Sva vremena" },
      ...[
        ...new Set([
          ...schedule.krusevac,
          ...schedule.beograd,
          ...schedule.beogradSunday,
        ]),
      ]
        .sort()
        .map((time) => ({ value: time, label: time })),
    ],
    [schedule],
  );

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-ink">Datum putovanja</span>

        <div className="flex flex-wrap gap-2">
          {datePresets.map((preset) => (
            <ChoiceButton
              key={preset.label}
              variant="pill"
              selected={
                filters.travelFrom === preset.from &&
                filters.travelTo === preset.to
              }
              onClick={() =>
                update({ travelFrom: preset.from, travelTo: preset.to })
              }
            >
              {preset.label}
            </ChoiceButton>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DateField
          label="Putuje od"
          value={filters.travelFrom || null}
          onChange={(date) => update({ travelFrom: date ?? "" })}
          placeholder="Bilo kada"
          allowPastDates
        />
        <DateField
          label="Putuje do (uključujući)"
          value={filters.travelTo || null}
          onChange={(date) => update({ travelTo: date ?? "" })}
          placeholder="Bilo kada"
          allowPastDates
        />
      </div>

      {filters.travelFrom &&
        filters.travelTo &&
        filters.travelTo < filters.travelFrom && (
          <p role="alert" className="-mt-2 text-sm font-semibold text-danger">
            Datum &quot;do&quot; je pre datuma &quot;od&quot; - nema rezultata.
          </p>
        )}

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Polazak"
          value={filters.location}
          options={locationOptions}
          onChange={(location) => update({ location })}
        />
        <SelectField
          label="Vreme polaska"
          value={filters.time}
          options={timeOptions}
          onChange={(time) => update({ time })}
        />
      </div>

      <div className="grid items-end gap-4 sm:grid-cols-2">
        <SelectField
          label="Sortiranje"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(sort) => update({ sort: sort as ReservationSort })}
        />

        <label className="flex h-12 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={filters.duplicatesOnly}
            onChange={(event) =>
              update({ duplicatesOnly: event.target.checked })
            }
            className="size-5 accent-brand-yellow-500"
          />
          <span className="font-semibold text-ink">
            Samo ponovljene rezervacije
          </span>
        </label>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={!canReset}
        >
          Poništi filtere
        </Button>
      </div>
    </Card>
  );
};
