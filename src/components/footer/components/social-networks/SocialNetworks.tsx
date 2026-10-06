import { FaFacebook, FaInstagram, FaWhatsapp, FaViber } from "react-icons/fa";

import { CONTACT } from "../../../../config";
import { FooterHeading } from "../footer-heading";

export const SocialNetworks = () => {
  const socialNetworkClasses =
    "cursor-pointer rounded-full p-2 transition-colors duration-300 ease-in-out hover:bg-brand-yellow-500 hover:text-brand-black-900";
  const socialNetworkSize = 26;

  return (
    <div className="flex flex-col gap-4">
      <FooterHeading>Društvene mreže</FooterHeading>

      <div className="-ml-2 flex gap-1">
        <a
          href="https://www.facebook.com/eurocompasskrusevac"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook (otvara se u novom prozoru)"
          className={socialNetworkClasses}
        >
          <FaFacebook size={socialNetworkSize} aria-hidden="true" />
        </a>
        <a
          href="https://www.instagram.com/eurocompass.rs/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram (otvara se u novom prozoru)"
          className={socialNetworkClasses}
        >
          <FaInstagram size={socialNetworkSize} aria-hidden="true" />
        </a>
      </div>

      <div className="flex items-center gap-2 font-semibold">
        <FaWhatsapp
          className="text-social-whatsapp"
          size={22}
          aria-hidden="true"
        />
        <FaViber className="text-social-viber" size={20} aria-hidden="true" />
        <a
          href={CONTACT.mobileHref}
          className="transition-colors hover:text-accent-ink"
        >
          <span className="sr-only">WhatsApp i Viber: </span>
          {CONTACT.mobile}
        </a>
      </div>
    </div>
  );
};
