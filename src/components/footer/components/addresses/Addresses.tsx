import { FaLocationDot } from "react-icons/fa6";

import { FooterHeading } from "../footer-heading";

export const Addresses = () => {
  return (
    <div className="flex flex-col gap-4">
      <FooterHeading>Adrese</FooterHeading>

      <div className="flex items-start gap-2">
        <FaLocationDot className="mt-1 shrink-0 text-accent-ink" />
        <a
          href="https://maps.app.goo.gl/UMfyWThyuks2yfvVA"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-accent-ink"
        >
          Jug Bogdanova, Kruševac
        </a>
      </div>
    </div>
  );
};
