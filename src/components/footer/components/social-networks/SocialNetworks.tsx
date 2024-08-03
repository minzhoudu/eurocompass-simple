import { FaFacebook, FaInstagram } from "react-icons/fa";

export const SocialNetworks = () => {
  const socialNetworkClasses =
    "cursor-pointer rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-[#fff312c5] hover:text-black";
  const socialNetworkSize = 30;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold">Društvene mreže</h2>

      <div className="flex justify-evenly">
        <a
          href="https://www.facebook.com"
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
    </div>
  );
};
