import Slider from "react-slick";
import { CAROUSEL_IMAGES } from "./utils";

export const HomePageCarousel = () => {
  return (
    <>
      <Slider autoplay dots infinite speed={500} autoplaySpeed={10000}>
        {CAROUSEL_IMAGES.map((image) => {
          return (
            <div className="h-96" key={image.id}>
              <img
                src={image.src}
                className="h-full w-full object-cover"
                alt={image.alt}
              />
            </div>
          );
        })}
      </Slider>
    </>
  );
};
