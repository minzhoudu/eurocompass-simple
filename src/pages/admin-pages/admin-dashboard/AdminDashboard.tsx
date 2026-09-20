import { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { IoOpenOutline } from "react-icons/io5";

import { AdminPageHeader, EditableList } from "../../../components";
import { Departures } from "../../../components/departures";
import {
  Alert,
  Card,
  Skeleton,
  UpdateInformationDto,
  useInformation,
  useUpdateInformation,
} from "../../../shared";

type TimesField =
  | "startingTimesKrusevac"
  | "startingTimesBeograd"
  | "saturdayBeograd";

type TimesCardProps = {
  title: string;
  description?: string;
  count: number;
  children: ReactNode;
};

const TimesCard = ({ title, description, count, children }: TimesCardProps) => (
  <Card className="flex flex-col gap-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {description && (
          <p className="text-sm text-ink-muted">{description}</p>
        )}
      </div>

      <span className="shrink-0 rounded-full bg-sunken px-3 py-1 text-xs font-semibold text-ink-muted">
        {count} {count === 1 ? "polazak" : "polazaka"}
      </span>
    </div>

    {children}
  </Card>
);

export const AdminDashboard = () => {
  const { data, isLoading, isError } = useInformation({ staleTime: 0 });
  const { mutateAsync } = useUpdateInformation();

  const info = data?.info;

  const saveTimes = (field: TimesField) => async (times: string[]) => {
    if (!info) throw new Error("Information is not loaded");

    const updatedInfo: UpdateInformationDto = { id: info.id };
    updatedInfo[field] = times;

    await mutateAsync(updatedInfo);
  };

  const timeListProps = {
    inputType: "time",
    layout: "chips",
    sort: true,
    emptyText: "Nema polaznih vremena.",
    addLabel: "Novo vreme polaska",
    emptyMessage: "Izaberite vreme polaska.",
    duplicateMessage: "To vreme već postoji.",
    confirmTitle: (time: string) => `Obrisati polazak u ${time}?`,
    confirmDescription:
      "Polazak će odmah nestati sa sajta i iz forme za rezervaciju.",
  } as const;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Helmet>
        <title>Admin | Polasci</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <AdminPageHeader
        title="Polasci"
        description="Izmene se odmah prikazuju na sajtu i u formi za rezervaciju."
      />

      {isError && (
        <Alert variant="error">
          Učitavanje podataka nije uspelo. Osvežite stranicu i pokušajte ponovo.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-4">
          {isLoading || !info ? (
            <>
              <Skeleton className="h-44" />
              <Skeleton className="h-44" />
              <Skeleton className="h-36" />
            </>
          ) : (
            <>
              <TimesCard
                title="Kruševac"
                count={info.startingTimesKrusevac.length}
              >
                <EditableList
                  {...timeListProps}
                  items={info.startingTimesKrusevac}
                  onChange={saveTimes("startingTimesKrusevac")}
                />
              </TimesCard>

              <TimesCard
                title="Beograd"
                count={info.startingTimesBeograd.length}
              >
                <EditableList
                  {...timeListProps}
                  items={info.startingTimesBeograd}
                  onChange={saveTimes("startingTimesBeograd")}
                />
              </TimesCard>

              <TimesCard
                title="Beograd, nedeljom"
                description="Dodatni polasci nedeljom, pored redovnih."
                count={info.saturdayBeograd.length}
              >
                <EditableList
                  {...timeListProps}
                  items={info.saturdayBeograd}
                  onChange={saveTimes("saturdayBeograd")}
                />
              </TimesCard>
            </>
          )}
        </div>

        <Card className="flex flex-col gap-6 lg:sticky lg:top-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink">Tako izgleda na sajtu</h2>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-semibold text-accent-ink hover:underline"
            >
              Otvori sajt
              <IoOpenOutline className="size-4" />
            </a>
          </div>

          <Departures
            isLoading={isLoading}
            krusevac={info?.startingTimesKrusevac}
            beograd={info?.startingTimesBeograd}
            beogradSunday={info?.saturdayBeograd}
          />
        </Card>
      </div>
    </div>
  );
};
