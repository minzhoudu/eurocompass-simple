import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Devider } from "./devider";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex w-3/4 flex-col rounded-t-xl bg-[#2a4060] pb-10 text-center text-white">
      <div className="py-10 text-3xl font-bold tracking-wider">
        <p>{year}.©Eurocompass </p>
      </div>

      <div className="flex justify-evenly">
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold">Adrese:</h2>
          <p className="text-xl">Jug Bogdanova, Kruševac</p>
        </div>

        <Devider />

        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold">Zapratite nas</h2>

          <div className="flex justify-evenly">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={30} />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={30} />
            </a>
          </div>
        </div>

        <Devider />

        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold">Kontakti:</h2>
          <p>Email: info@eurocompass.rs</p>
          <p>Telefon: 037/443-277</p>
        </div>
      </div>
    </footer>
  );
};
