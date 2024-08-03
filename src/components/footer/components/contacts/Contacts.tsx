export const Contacts = () => {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold">Kontakti</h2>
      <p className="text-lg">
        Email:{" "}
        <a
          className="underline underline-offset-2"
          href="mailto:info@eurocompass.rs"
        >
          info@eurocompass.rs
        </a>
      </p>
      <p className="text-lg">Telefon: 037/443-277</p>
    </div>
  );
};
