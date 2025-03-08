"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Button from "../button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Discover({ stories }) {
  const sliderRef = React.useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <div className="flex flex-col relative gap-2">
      {/* Header Section */}

      {/* Slider Section */}
      <div className="w-11/12 mx-auto">
        <Slider ref={sliderRef} {...settings}>
          {stories.map((story, index) => (
            <Link href={`/story/${story._id}`} key={index} className="py-4">
              <div className="group relative">
                {/* Image */}
                <Image
                  width={400}
                  height={400}
                  src={story.media_url}
                  alt={story.title || `Slide ${index + 1}`}
                  className="w-full h-[500px] object-cover group-hover:h-[530px] group-hover:-mt-[15px] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                {/* Text */}
                <div className="absolute opacity-0 group-hover:opacity-100 bottom-4 left-0 p-4 transition-all duration-300">
                  <h2 className="font-bold text-heading-06 sm:text-heading-06 md:text-heading-06 text-white">
                    {story.title}
                  </h2>
                  <p className="text-paragraph text-white">{`${story.inspiredBy?.photographer?.firstName} ${story.inspiredBy?.photographer?.lastName}`}</p>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={handlePrev}
          className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
        >
          <ChevronLeft size={32} className="text-gray-600" />
          <p className="sr-only">Previous Story</p>
        </button>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={handleNext}
          className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
        >
          <ChevronRight size={32} className="text-gray-600" />
          <p className="sr-only">Next Story</p>
        </button>
      </div>
      <div className="flex flex-row items-center justify-center gap-8 -mt-3 mb-10">
        <h1 className="font-bold text-heading-06 sm:text-heading-05 md:text-heading-04 text-primary">
          Every Photo Tells a Story—Discover It
        </h1>
        <Link href="/story">
          <Button variant="filled" state="default">
            Explore More
          </Button>
        </Link>
      </div>
    </div>
  );
}
