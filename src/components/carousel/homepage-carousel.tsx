import Slider from "react-slick";
import { CAROUSEL_IMAGES } from "./utils";

export const HomePageCarousel = () => {
  return (
    <>
      <Slider dots infinite speed={500}>
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
