import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { HomePageCarousel } from "../../components/carousel";
import { Devider } from "../../components/footer/components";

export const HomePage = () => {
  return (
    <>
      <div className="w-full">
        <HomePageCarousel />
      </div>

      <div className="flex gap-20">
        <div className="flex flex-col items-center gap-5 rounded-lg bg-[#fff312c5] p-5 text-xl font-bold text-black">
          <h2>Prevoz putnika na relaciji</h2>

          <div className="mt-7 flex flex-col gap-10">
            <p className="border border-black p-1">Kruševac - Beograd</p>
            <p className="border border-black p-1">Beograd - Kruševac</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-lg bg-[#fff312c5] p-5 text-center text-xl font-bold text-black">
          <h2>Polasci:</h2>

          <div className="flex flex-row items-center gap-10">
            <div className="flex-1 border border-black p-3">
              <h3>Kruševac</h3>
              <ul className="underline">
                <li>7:00</li>
                <li>13:00</li>
                <li>17:30</li>
              </ul>
            </div>

            <Devider />

            <div className="flex-1 border border-black p-3">
              <h3>Beograd</h3>
              <ol className="underline">
                <li>09:40</li>
                <li>12:50</li>
                <li className="mt-1 border-b-2 border-dashed border-black"></li>
                <li>nedeljom 21:00</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
