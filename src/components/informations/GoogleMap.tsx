import { FaLocationDot } from "react-icons/fa6";
import { IoOpenOutline } from "react-icons/io5";

const chipClasses =
  "flex items-center gap-2 rounded-full border border-line bg-raised px-4 py-2 text-sm font-semibold text-ink shadow-card";

export const GoogleMap = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const location = "43.58576366711412, 21.328505615810112";

  if (!apiKey) {
    return null;
  }

  return (
    <a
      href="https://www.google.com/maps/place/Eurocompass/data=!4m2!3m1!1s0x0:0xa504bc5265bd6eee?sa=X&ved=1t:2428&ictx=111"
      target="_blank"
      rel="noopener noreferrer"
      className="relative block h-80 w-full overflow-hidden rounded-2xl border border-line shadow-card sm:h-[26rem]"
    >
      <iframe
        title="Google Map"
        width="100%"
        height="100%"
        style={{ border: 0, pointerEvents: "none" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place/?key=${apiKey}&q=${location}`}
      ></iframe>

      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2">
        <span className={chipClasses}>
          <FaLocationDot className="text-accent-ink" />
          Jug Bogdanova, Kruševac
        </span>

        <span className={chipClasses}>
          Otvori u Google mapama
          <IoOpenOutline className="size-4 text-accent-ink" />
        </span>
      </div>
    </a>
  );
};
