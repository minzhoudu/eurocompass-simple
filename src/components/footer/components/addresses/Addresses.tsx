import { FaLocationDot } from "react-icons/fa6";

export const Addresses = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-5">
        <h2 className="text-2xl font-bold">Adrese</h2>

        <div className="flex items-center gap-1 text-xl underline underline-offset-2">
          <FaLocationDot />{" "}
          <a
            href="https://maps.app.goo.gl/UMfyWThyuks2yfvVA"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            Jug Bogdanova, Kruševac
          </a>
        </div>
      </div>
    </>
  );
};
