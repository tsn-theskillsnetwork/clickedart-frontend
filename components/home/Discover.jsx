"use client";
import React from "react";
import Button from "../Button";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  {
    src: "/assets/images/img3.jpg",
    title: "Artwork 1",
    artist: "Photographer",
  },
  {
    src: "/assets/images/img5.jpg",
    title: "Artwork 2",
    artist: "Photographer",
  },
  {
    src: "/assets/images/img2.jpg",
    title: "Artwork 3",
    artist: "Photographer",
  },
  {
    src: "/assets/hero/bg2.jpg",
    title: "Artwork 4",
    artist: "Photographer",
  },
  {
    src: "/assets/images/img1.jpg",
    title: "Artwork 5",
    artist: "Photographer",
  },
  {
    src: "/assets/images/img6.jpg",
    title: "Artwork 6",
    artist: "Photographer",
  },
];

export default function Discover() {
  const [sliderRef, slider] = useKeenSlider({
    slides: {
      perView: 1,
      spacing: 0,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 0 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 5, spacing: 0 },
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
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-center gap-8 mb-10">
        <h1 className="font-bold text-heading-05 sm:text-heading-03 md:text-heading-02 text-accent-400">
          Every Photo Tells a Story—Discover It
        </h1>
        <Button size="lg" variant="filled" state="default">
          Explore More
        </Button>
      </div>
      <div className="flex flex-row justify-around items-center">
        <div className="w-10/12">
          <div ref={sliderRef} className="keen-slider ">
            {images.map((image, index) => (
              <div key={index} className="keen-slider__slide">
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="py-10 group hover:z-50 "
                >
                  <div className="w-full h-[500px] bg-black fixed top-10 z-10 opacity-30 group-hover:opacity-0 transition-all duration-500"></div>
                  <Image
                    width={400}
                    height={400}
                    src={image.src}
                    alt={image.alt || `Slide ${index + 1}`}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="bottom-12 left-0 absolute p-4 z-20">
                    <h2 className="font-bold text-heading-06 sm:text-heading-06 md:text-heading-06 text-white">
                      {image.title}
                    </h2>
                    <p className="text-paragraph text-white">{image.artist}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end mr-[8%] gap-5">
        <button
          className="w-[4%] rotate-180 opacity-30"
          onClick={() => handleNavigation("left")}
        >
          <p className="sr-only">Discover Left</p>
          <Image
            width={50}
            height={50}
            className="w-full h-full"
            src="/assets/arrow.png"
            alt="arrow-left"
          />
        </button>
        <button className="w-[4%]" onClick={() => handleNavigation("right")}>
          <p className="sr-only">Discover Right</p>
          <Image
            width={50}
            height={50}
            className="w-full h-full"
            src="/assets/arrow.png"
            alt="arrow-right"
          />
        </button>
      </div>
    </div>
  );
}
