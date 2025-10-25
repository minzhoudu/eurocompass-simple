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
      style={{ width: "100%", height: "450px" }}
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
    </a>
  );
};
