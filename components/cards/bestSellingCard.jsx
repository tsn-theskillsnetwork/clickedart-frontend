"use client";

import React, { useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";

export default function BestSellingCard({ images }) {
  const [sliderRef, slider] = useKeenSlider({
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 15 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 15 },
      },
    },
  });

  const handleNavigation = (direction) => {
    if (slider.current) {
      if (direction === "left") {
        slider.current.prev();
      } else if (direction === "right") {
        slider.current.next();
      }
    }
  };

  return (
    <div className="flex flex-row justify-around gap-10 md:px-10 items-center w-full">
      <div className="relative left-0 top-0 z-50 hidden sm:block">
        <button
          className="bg-zinc-200 rounded-full"
          onClick={() => handleNavigation("left")}
        >
          <p className="sr-only">Best Selling Previous</p>
          <ChevronLeft
            className="text-zinc-500 pr-1 hover:text-white"
            size={64}
          />
        </button>
      </div>
      <div ref={sliderRef} className="keen-slider md:mx-10">
        {images.map((image, index) => (
          <div key={index} className="keen-slider__slide">
            <div className="group">
              <div className="relative">
                <Image
                  width={800}
                  height={800}
                  src={image.imageLinks.thumbnail}
                  alt={image.title}
                  className="object-cover w-full aspect-[1/1] transition-all duration-200 ease-linear"
                />
              </div>
              <div className="text-neutral-600">
                <h2 className="text-heading-06 font-bold">{image.title}</h2>
                <p className="text-paragraph">
                  {image.photographer?.firstName + " " + image.photographer?.lastName}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative right-0 hidden sm:block">
        <button
          className="bg-zinc-200 rounded-full"
          onClick={() => handleNavigation("right")}
        >
          <p className="sr-only">Best Selling Next</p>
          <ChevronRight
            size={64}
            className="text-zinc-500 pl-1 hover:text-white"
          />
        </button>
      </div>
    </div>
  );
}
