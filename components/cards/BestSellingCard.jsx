"use client";

import React from "react";
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
    if (direction === "left") {
      slider.current?.prev();
    } else if (direction === "right") {
      slider.current?.next();
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
                  src={image.src1}
                  alt={image.title}
                  className="object-cover w-full aspect-[1/1] opacity-100 group-hover:opacity-0 transition-all duration-200 ease-linear"
                />
                <div className="absolute inset-0 bg-white object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear" />
                <Image
                  width={500}
                  height={500}
                  src={image.src2?.length > 0 ? image.src2 : image.src1}
                  alt={image.title}
                  className="absolute inset-0 object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear"
                />
                <div className="absolute inset-0">
                  <div className="flex justify-between mx-4 mt-4">
                    <div className="bg-white px-2 text-paragraph group-hover:opacity-0 bg-opacity-75 w-fit transition-all duration-200 ease-linear">
                      <p>{image.downloadCount} Downloads</p>
                    </div>
                    <Heart
                      size={28}
                      className="text-white group-hover:text-zinc-400 transition-all duration-200 ease-linear"
                    />
                  </div>
                </div>
              </div>
              <div className="text-neutral-600">
                <h2 className="text-heading-06 font-bold">{image.title}</h2>
                <p className="text-paragraph">{image.artist}</p>
                <p className="text-paragraph">{image.size} MP</p>
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
