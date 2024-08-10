import { Addresses, Contacts, Devider, SocialNetworks } from "./components";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primaryBlue flex w-full flex-col rounded-t-xl text-center text-white lg:w-3/4">
      <div className="flex justify-center border-b-2 py-8 font-semibold tracking-wide lg:text-3xl">
        <div className="bg-primaryYellow rounded-lg px-3 py-2 text-black">
          <p>{year}.©Eurocompass </p>
        </div>
      </div>

      <div className="flex flex-col justify-evenly gap-7 py-10 lg:flex-row lg:gap-0">
        <Addresses />

        <Devider />

        <SocialNetworks />

        <Devider />

        <Contacts />
      </div>
    </footer>
  );
};
