"use client";

import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Button from "../button";
import Image from "next/image";

export default function Featured({ artists }) {
  const [sliderRef, slider] = useKeenSlider({
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 15 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4, spacing: 15 },
      },
      "(min-width: 1280px)": {
        slides: { perView: 5, spacing: 15 },
      },
    },
  });

  const handleNavigation = (direction) => {
    if (direction === "left") {
      slider.current?.prev();
    } else if (direction === "right") {
      slider.current?.next();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="w-[90vw] ">
        <div ref={sliderRef} className="keen-slider ">
          {artists.map((artist, index) => (
            <div key={index} className="keen-slider__slide">
              <div className="w-64 aspect-[4/5] flex flex-col mx-auto items-center justify-center gap-2 bg-white shadow-md shadow-zinc-400">
                <Image
                  width={256}
                  height={256}
                  src={artist.image}
                  alt={artist.name || `Slide ${index + 1}`}
                  className=" object-cover object-top w-64 aspect-[1/1]"
                />
                <div className="flex flex-col items-center justify-center gap-2 pb-5">
                  <p className="text-heading-04 font-semibold text-black">
                    {artist.name}
                  </p>
                  <Button size="lg">View Profile</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row gap-10">
        <button
          className="bg-zinc-100 rounded-full"
          onClick={() => handleNavigation("left")}
        >
          <p className="sr-only">Featured Artists Left</p>
          <ChevronLeft
            className="text-zinc-500 pr-1 hover:text-white"
            size={64}
          />
        </button>
        <button
          className="bg-zinc-100 rounded-full"
          onClick={() => handleNavigation("right")}
        >
          <p className="sr-only">Featured Artists Right</p>
          <ChevronRight
            size={64}
            className="text-zinc-500 pl-1 hover:text-white"
          />
        </button>
      </div>
    </div>
  );
}
