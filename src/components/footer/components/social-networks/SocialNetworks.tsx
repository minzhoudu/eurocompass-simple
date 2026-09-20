import { FaFacebook, FaInstagram, FaWhatsapp, FaViber } from "react-icons/fa";

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
          aria-label="Facebook"
          className={socialNetworkClasses}
        >
          <FaFacebook size={socialNetworkSize} />
        </a>
        <a
          href="https://www.instagram.com/eurocompass.rs/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className={socialNetworkClasses}
        >
          <FaInstagram size={socialNetworkSize} />
        </a>
      </div>

      <div className="flex items-center gap-2 font-semibold">
        <FaWhatsapp className="text-social-whatsapp" size={22} />
        <FaViber className="text-social-viber" size={20} />
        <p>060 / 74-21-006</p>
      </div>
    </div>
  );
};
