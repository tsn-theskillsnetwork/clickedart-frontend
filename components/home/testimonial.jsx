"use client";

import React, { useEffect, useState } from "react";
import TestimonialCard from "../cards/testimonialCard";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft } from "lucide-react";
import axios from "axios";

export default function Testimonial() {
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
        slides: { perView: 3, spacing: 0 },
      },
    },
  });

  const [testimonials, setTestimonials] = useState([]);

  const handleNavigation = (direction) => {
    if (direction === "left") {
      slider.current?.prev();
    } else if (direction === "right") {
      slider.current?.next();
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/layout/get-layout-content`
      );
      console.log(res.data);
      setTestimonials(res.data.testimonials);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center justify-center text-center sm:w-1/2">
        <div className="text-heading-04 sm:text-heading-02 text-primary font-bold">
          Trusted by Our Community, Loved by You
        </div>
        <div className="text-heading-06 text-primary font-semibold">
          Discover why our community chooses us - real stories from people who
          trust and love our products
        </div>
      </div>

      <div ref={sliderRef} className="keen-slider flex">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="keen-slider__slide p-6">
            <TestimonialCard
              avatar={testimonial.image}
              name={testimonial.name}
              stars={testimonial.stars}
              comment={testimonial.message}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-center gap-28 mt-10">
        <button
          className="bg-zinc-200 rounded-full"
          onClick={() => handleNavigation("left")}
        >
          <p className="sr-only">Testimonial Previous</p>
          <ChevronLeft
            className="text-zinc-500 pr-1 hover:text-white"
            size={64}
          />
        </button>
        <button
          className="bg-zinc-200 rounded-full"
          onClick={() => handleNavigation("right")}
        >
          <p className="sr-only">Testimonial Next</p>
          <ChevronLeft
            className="text-zinc-500 pr-1 hover:text-white transform rotate-180"
            size={64}
          />
        </button>
      </div>
    </div>
  );
}
