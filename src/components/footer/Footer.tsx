import { Addresses, Contacts, Devider, SocialNetworks } from "./components";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex w-3/4 flex-col rounded-t-xl bg-[#2a4060] text-center text-white">
      <div className="flex justify-center border-b-2 py-8 text-3xl font-semibold tracking-wide">
        <div className="rounded-lg bg-[#fff312c5] px-3 py-2 text-black">
          <p>{year}.©Eurocompass </p>
        </div>
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
