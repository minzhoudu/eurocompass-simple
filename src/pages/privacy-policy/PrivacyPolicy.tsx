import { Helmet } from "react-helmet";

import { Card, SectionHeading } from "../../shared";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="flex flex-col gap-3">
    <h2 className="text-lg font-bold text-ink">{title}</h2>
    <div className="flex flex-col gap-2 text-ink-muted">{children}</div>
  </Card>
);

export const PrivacyPolicy = () => {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-6 px-4 lg:px-0">
      <Helmet>
        <title>Eurocompass doo | Politika privatnosti</title>
        <meta
          name="description"
          content="Politika privatnosti Eurocompass doo - koji podaci se prikupljaju prilikom rezervacije karte, zašto, koliko dugo se čuvaju i kako ostvariti svoja prava."
        />
      </Helmet>

      <SectionHeading as="h1" className="mt-10">
        Politika privatnosti
      </SectionHeading>

      <Section title="Koji podaci se prikupljaju">
        <p>
          Prilikom slanja forme za rezervaciju karte prikupljamo: ime i
          prezime, email adresu, broj telefona, izabranu polaznu stanicu,
          datum i vreme polaska, broj mesta i napomenu, ukoliko je unesete.
        </p>
      </Section>

      <Section title="Zašto prikupljamo ove podatke">
        <p>
          Ovi podaci se koriste da bismo potvrdili i realizovali vašu
          rezervaciju, kontaktirali vas u vezi sa njom ako je potrebno, i
          vodili internu evidenciju o broju rezervacija i putnika. Pravni
          osnov za obradu je izvršenje ugovora — odnosno, obrada je neophodna
          radi realizacije rezervacije koju ste zatražili.
        </p>
      </Section>

      <Section title="Koliko dugo se čuvaju">
        <p>
          Podatke o rezervaciji čuvamo najduže{" "}
          <strong className="text-ink">godinu dana</strong> od trenutka
          slanja rezervacije, nakon čega se trajno brišu iz naše baze
          podataka.
        </p>
      </Section>

      <Section title="Vaša prava">
        <p>
          Imate pravo da zahtevate uvid u podatke koje čuvamo o vama, njihovu
          izmenu, ili brisanje pre isteka navedenog roka. Zahtev možete
          poslati na{" "}
          <a
            href="mailto:eurocompassdoo@gmail.com"
            className="font-semibold text-accent-ink hover:underline"
          >
            eurocompassdoo@gmail.com
          </a>
          .
        </p>
        <p>
          Ako smatrate da su vaša prava povređena, pritužbu možete podneti
          Povereniku za informacije od javnog značaja i zaštitu podataka o
          ličnosti Republike Srbije.
        </p>
      </Section>

      <Section title="Kolačići (cookies)">
        <p>
          Naš sajt ne koristi kolačiće za praćenje ili analitiku posetilaca.
          Jedini kolačić koji postoji je tehnički neophodan kolačić za
          prijavu u admin panel, koji se ne odnosi na posetioce sajta niti na
          podnosioce rezervacije.
        </p>
      </Section>
    </div>
  );
};
