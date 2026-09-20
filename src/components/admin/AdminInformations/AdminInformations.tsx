import { ChangeEvent, FormEvent, useState } from "react";
import { Helmet } from "react-helmet";
import { IoCheckmarkCircle } from "react-icons/io5";

import {
  Alert,
  Button,
  Card,
  FormInput,
  Information,
  Skeleton,
  useInformation,
  useUpdateInformation,
} from "../../../shared";
import { AdminPageHeader } from "../admin-shell";
import { EditableList } from "../EditableList";

const PRICE_FIELDS = [
  { name: "regularPrice", label: "Jedan smer" },
  { name: "roundtripPrice", label: "Povratna karta" },
  { name: "studentPrice", label: "Studentska povratna karta" },
] as const;

type PriceName = (typeof PRICE_FIELDS)[number]["name"];

const PRICE_PATTERN = /^\d[\d.]*$/;

const PricesCard = ({ info }: { info: Information }) => {
  const { mutate, isPending, isError, isSuccess, reset } =
    useUpdateInformation();

  const [values, setValues] = useState<Record<PriceName, string>>({
    regularPrice: info.regularPrice,
    roundtripPrice: info.roundtripPrice,
    studentPrice: info.studentPrice,
  });
  const [showErrors, setShowErrors] = useState(false);

  const hasError = (name: PriceName) => !PRICE_PATTERN.test(values[name].trim());
  const isDirty = PRICE_FIELDS.some(
    ({ name }) => values[name].trim() !== info[name].trim(),
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setValues((prev) => ({ ...prev, [name]: value }));
    reset();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setShowErrors(true);

    if (PRICE_FIELDS.some(({ name }) => hasError(name))) return;

    mutate({
      id: info.id,
      regularPrice: values.regularPrice.trim(),
      roundtripPrice: values.roundtripPrice.trim(),
      studentPrice: values.studentPrice.trim(),
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-ink">Cene karata</h2>
          <p className="text-sm text-ink-muted">
            Unesite samo iznos, bez decimala i oznake valute.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {PRICE_FIELDS.map(({ name, label }) => (
            <FormInput
              key={name}
              name={name}
              text={label}
              value={values[name]}
              onChange={handleChange}
              inputMode="numeric"
              suffix="RSD"
              error={
                showErrors && hasError(name)
                  ? "Unesite cenu (samo cifre)."
                  : undefined
              }
            />
          ))}
        </div>

        {isError && (
          <Alert variant="error">
            Došlo je do greške pri čuvanju cena. Pokušajte ponovo.
          </Alert>
        )}

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending ? "ČUVANJE..." : "SAČUVAJ CENE"}
          </Button>

          {isSuccess && !isDirty && (
            <p
              role="status"
              className="flex items-center gap-2 font-semibold text-accent-ink"
            >
              <IoCheckmarkCircle className="size-5" />
              Cene su sačuvane.
            </p>
          )}
        </div>
      </form>
    </Card>
  );
};

const NotesCard = ({ info }: { info: Information }) => {
  const { mutateAsync } = useUpdateInformation();

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-ink">Važne informacije</h2>
        <p className="text-sm text-ink-muted">
          Prikazuju se u žutom obaveštenju VAŽNO na stranici Informacije.
          Promene se čuvaju odmah.
        </p>
      </div>

      <EditableList
        items={info.importantInfo}
        onChange={(importantInfo) =>
          mutateAsync({ id: info.id, importantInfo })
        }
        inputType="text"
        layout="rows"
        emptyText="Nema važnih informacija."
        addLabel="Nova važna informacija"
        placeholder="Nova informacija..."
        emptyMessage="Unesite tekst informacije."
        duplicateMessage="Ta informacija već postoji."
        confirmTitle={() => "Obrisati ovu informaciju?"}
        confirmDescription="Informacija će odmah nestati sa stranice Informacije."
      />
    </Card>
  );
};

export const AdminInformations = () => {
  const { data, isLoading, isError } = useInformation({ staleTime: 0 });
  const info = data?.info;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Helmet>
        <title>Admin | Cene i informacije</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <AdminPageHeader
        title="Cene i informacije"
        description="Cene karata i obaveštenja sa stranice Informacije."
      />

      {isError && (
        <Alert variant="error">
          Učitavanje podataka nije uspelo. Osvežite stranicu i pokušajte ponovo.
        </Alert>
      )}

      {isLoading || !info ? (
        <>
          <Skeleton className="h-56" />
          <Skeleton className="h-64" />
        </>
      ) : (
        <>
          <PricesCard info={info} />
          <NotesCard info={info} />
        </>
      )}
    </div>
  );
};
