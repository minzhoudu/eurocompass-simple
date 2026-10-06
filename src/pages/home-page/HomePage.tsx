import { Seo } from "../../components";
import { Departures, NextDepartures } from "../../components/departures";
import { RouteMap } from "../../components/route-map";
import { CONTACT, SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "../../config";
import {
  Alert,
  Card,
  SectionHeading,
  useBelgradeNow,
  useBlockedDates,
  useDepartureSchedule,
  useInformation,
} from "../../shared";

// What search engines show about the company (name, contact, where it runs).
// Only facts that are already on the site: no address beyond the one in the
// footer, no opening hours or ratings.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: `${SITE_NAME} D.o.o`,
  url: SITE_URL,
  logo: `${SITE_URL}/images/eurocompass_logo.webp`,
  image: `${SITE_URL}${SOCIAL_IMAGE.path}`,
  email: CONTACT.email,
  telephone: "+38137443277",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jug Bogdanova",
    addressLocality: "Kruševac",
    addressCountry: "RS",
  },
  areaServed: [
    { "@type": "City", name: "Kruševac" },
    { "@type": "City", name: "Beograd" },
  ],
  sameAs: [
    "https://www.facebook.com/eurocompasskrusevac",
    "https://www.instagram.com/eurocompass.rs/",
  ],
};

export const HomePage = () => {
  const { data, isError, isLoading } = useInformation();
  const { schedule } = useDepartureSchedule();
  const { blockedDates } = useBlockedDates();
  const now = useBelgradeNow();

  // Live departure info needs the real saved schedule, not the built-in
  // fallback used while it loads.
  const live =
    data?.info && !isError ? { schedule, blockedDates, now } : undefined;

  return (
    <>
      <Seo
        title="Eurocompass | Autobuski prevoz Kruševac – Beograd"
        description="Redovan autobuski prevoz putnika na relaciji Kruševac – Beograd i Beograd – Kruševac. Pogledajte polaske, cene i rezervišite kartu online."
        path="/"
        jsonLd={ORGANIZATION_JSON_LD}
      />
      <div className="relative left-1/2 h-72 w-screen -translate-x-1/2 self-start overflow-hidden bg-brand-yellow-500/10 sm:h-96 lg:h-[30rem]">
        <RouteMap />

        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-8 lg:px-10 lg:pb-12">
            <h1 className="text-3xl font-bold tracking-wide text-ink sm:text-5xl lg:text-6xl">
              Eurocompass
              <span className="sr-only">
                {" "}
                - autobuski prevoz Kruševac - Beograd
              </span>
            </h1>
            <span className="mt-3 block h-1 w-16 rounded-full bg-brand-yellow-500" />
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-4xl flex-col gap-6 px-4 lg:px-0">
        {live && <NextDepartures {...live} />}

        <Card className="flex flex-col gap-8">
          <SectionHeading eyebrow="Prevoz putnika na relaciji">
            Polasci
          </SectionHeading>

          {!isError ? (
            <Departures
              isLoading={isLoading}
              krusevac={data?.info?.startingTimesKrusevac}
              beograd={data?.info?.startingTimesBeograd}
              beogradSunday={data?.info?.saturdayBeograd}
              live={live}
            />
          ) : (
            <Alert variant="error">
              Došlo je do greške prilikom učitavanja podataka. Pokušajte ponovo.
            </Alert>
          )}
        </Card>
      </div>
    </>
  );
};
