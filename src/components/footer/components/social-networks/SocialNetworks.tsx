import { FaFacebook, FaInstagram, FaWhatsapp, FaViber } from "react-icons/fa";

export const SocialNetworks = () => {
  const socialNetworkClasses =
    "cursor-pointer rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-primaryYellow hover:text-black";
  const socialNetworkSize = 30;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold">Društvene mreže</h2>

      <div className="flex justify-center lg:justify-evenly">
        <a
          href="https://www.facebook.com/eurocompasskrusevac"
          target="_blank"
          rel="noopener noreferrer"
          className={socialNetworkClasses}
        >
          <FaFacebook size={socialNetworkSize} />
        </a>
        <a
          href="https://www.instagram.com/eurocompass.rs/"
          target="_blank"
          rel="noopener noreferrer"
          className={socialNetworkClasses}
        >
          <FaInstagram size={socialNetworkSize} />
        </a>
      </div>

      <div className="flex justify-center gap-5 lg:justify-evenly">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FaWhatsapp color="#019c4e" size={socialNetworkSize} />
          <FaViber color="#9585ff" size={28} />
          <p>060 / 74-21-006</p>
        </div>
      </div>
    </div>
  );
};
