import { Addresses, Contacts, Devider, SocialNetworks } from "./components";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex w-3/4 flex-col rounded-t-xl bg-[#2a4060] text-center text-white">
      <div className="border-b-2 py-10 text-3xl font-bold tracking-wider">
        <p>{year}.©Eurocompass </p>
      </div>

      <div className="flex justify-evenly py-10">
        <Addresses />

        <Devider />

        <SocialNetworks />

        <Devider />

        <Contacts />
      </div>
    </footer>
  );
};
