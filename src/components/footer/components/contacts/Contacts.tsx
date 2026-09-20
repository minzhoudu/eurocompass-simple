import { FaEnvelope, FaPhone } from "react-icons/fa6";

import { FooterHeading } from "../footer-heading";

export const Contacts = () => {
  return (
    <div className="flex flex-col gap-4">
      <FooterHeading>Kontakti</FooterHeading>

      <div className="flex flex-col gap-3">
        <p className="flex items-start gap-2">
          <FaEnvelope className="mt-1 shrink-0 text-accent-ink" />
          <a
            className="break-words underline underline-offset-2 transition-colors hover:text-accent-ink"
            href="mailto:info@eurocompass.rs"
          >
            eurocompassdoo@gmail.com
          </a>
        </p>

        <p className="flex items-start gap-2">
          <FaPhone className="mt-1 shrink-0 text-accent-ink" />
          037/443-277
        </p>
      </div>
    </div>
  );
};
