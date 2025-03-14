import Slider from "react-slick";
import { CAROUSEL_IMAGES } from "./utils";

export const HomePageCarousel = () => {
  return (
    <>
      <Slider
        autoplay
        dots
        infinite
        arrows={false}
        speed={500}
        autoplaySpeed={10000}
      >
        {CAROUSEL_IMAGES.map((image) => {
          return (
            <div className="h-[500px]" key={image.id}>
              <img
                src={image.src}
                className={`h-full w-full ${image.id !== 6 ? "object-cover" : "object-fill"}`}
                alt={image.alt}
                loading={image.id !== 1 ? "lazy" : "eager"}
              />
            </div>
          );
        })}
      </Slider>
    </>
  );
};
