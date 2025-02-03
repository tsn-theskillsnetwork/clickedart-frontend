"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestimonialCard from "../cards/testimonialCard";
import useLayoutStore from "@/store/layout";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonial() {
  const { layout } = useLayoutStore();
  const sliderRef = React.useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    adaptiveHeight: false,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <div className="flex flex-col items-center space-y-10">
      {/* Heading Section */}
      <div className="flex flex-col items-center justify-center text-center sm:w-1/2">
        <div className="text-heading-04 sm:text-heading-02 text-primary font-bold">
          Trusted by Our Community, Loved by You
        </div>
        <div className="text-heading-06 text-primary font-semibold mt-2">
          Discover why our community chooses us - real stories from people who
          trust and love our products
        </div>
      </div>

      {/* Slider Section */}
      <div className="w-full relative">
        <Slider ref={sliderRef} {...settings} className="!h-full">
          {layout?.testimonials.map((testimonial, index) => (
            <div key={index} className="p-6">
              <TestimonialCard
                avatar={testimonial.image}
                name={testimonial.name}
                stars={testimonial.stars}
                comment={testimonial.message}
              />
            </div>
          ))}
        </Slider>
        <div className="flex justify-center gap-5">
          <button
            onClick={handlePrev}
            className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
          >
            <ChevronLeft size={32} className="text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
          >
            <ChevronRight size={32} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
