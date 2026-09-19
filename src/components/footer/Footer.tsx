import { Devider } from "../../shared";
import { Addresses, Contacts, SocialNetworks } from "./components";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-100 bg-white text-center text-brand-black-900">
      <div className="mx-auto flex max-w-6xl justify-center border-b border-gray-100 px-6 py-8 font-semibold tracking-wide lg:text-2xl">
        <div className="rounded-full bg-brand-yellow-100 px-4 py-2 text-brand-yellow-700">
          <p>{year}.©Eurocompass </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col justify-evenly gap-7 px-6 py-10 lg:flex-row lg:gap-0">
        <Addresses />

        <Devider />

        <SocialNetworks />

        <Devider />

        <Contacts />
      </div>
    </footer>
  );
};
