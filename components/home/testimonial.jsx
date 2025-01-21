"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestimonialCard from "../cards/testimonialCard";
import useLayoutStore from "@/store/layout";

export default function Testimonial() {
  const { layout } = useLayoutStore();

  const settings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
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
        <Slider {...settings}>
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
      </div>
    </div>
  );
}
