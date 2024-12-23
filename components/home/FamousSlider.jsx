"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopCard from "../cards/topCard";

const images = [
  {
    image:
      "https://vastphotos.com/files/uploads/photos/10241/abstract-cityscape-modern-art-m.jpg?v=20220712073521",
    title: "Black and white",
    photographer: "Photographer",
  },
  {
    image:
      "https://vastphotos.com/files/uploads/photos/10325/abstract-photograph-of-a-city-m.jpg?v=20220712073521",
    title: "Plant",
    photographer: "Photographer",
  },
  {
    image:
      "https://vastphotos.com/files/uploads/testimonialImages/new-york-transitions-i-by-dan-piech-in-home-400.jpg",
    title: "Nature",
    photographer: "Photographer",
  },
  {
    image:
      "https://vastphotos.com/files/uploads/photos/10241/abstract-cityscape-modern-art-m.jpg?v=20220712073521",
    title: "Cityscape",
    photographer: "Photographer",
  },
  {
    image:
      "https://vastphotos.com/files/uploads/photos/10241/abstract-cityscape-modern-art-m.jpg?v=20220712073521",
    title: "Sunset",
    photographer: "Photographer",
  },
  {
    image:
      "https://vastphotos.com/files/uploads/photos/10241/abstract-cityscape-modern-art-m.jpg?v=20220712073521",
    title: "Forest",
    photographer: "Photographer",
  },
];

export default function FamousSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  return (
    <div>
      <h1 className="text-4xl font-semibold text-center">
        <span>Popular</span> <span className="text-rose-500">Photos</span>
      </h1>
      <div className="flex items-center justify-center gap-4 p-4">
        <button onClick={handlePrev} className="text-2xl px-4">
          {"<"}
        </button>
        <div className="relative w-full sm:w-2/3 h-80 overflow-hidden flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.3 }}
              className="absolute flex gap-4"
            >
              <TopCard
                image={images[index].image}
                title={images[index].title}
                photographer={images[index].photographer}
              />
              <div className="hidden sm:flex gap-4">
                <TopCard
                  image={images[(index + 1) % images.length].image}
                  title={images[(index + 1) % images.length].title}
                  photographer={
                    images[(index + 1) % images.length].photographer
                  }
                />
                <TopCard
                  image={images[(index + 2) % images.length].image}
                  title={images[(index + 2) % images.length].title}
                  photographer={
                    images[(index + 2) % images.length].photographer
                  }
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <button onClick={handleNext} className="text-2xl px-4">
          {">"}
        </button>
      </div>
    </div>
  );
}
