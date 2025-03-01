"use client";

import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Featured({ photographers, loading }) {
  const sliderRef = useRef(null);
  const router = useRouter();
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    // speed: 1000,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  //sort by created date
  const sortedPhotographers = photographers.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <div className="w-full relative">
      <Slider className="w-11/12 mx-auto" ref={sliderRef} {...settings}>
        {sortedPhotographers?.map((photographer, index) => (
          <div key={index} className="p-4 h-full">
            <div className="flex flex-col items-center bg-gradient-to-b from-zinc-100 to-white shadow-lg hover:shadow-xl border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform">
              {/* Clickable Image */}
              <div className="w-full overflow-hidden">
                <Image
                  onClick={() =>
                    router.push(`/photographer/${photographer._id}`)
                  }
                  width={300}
                  height={300}
                  src={
                    photographer.profileImage ||
                    "/assets/placeholders/profile.jpg"
                  }
                  alt={photographer.firstName || `Slide ${index + 1}`}
                  className="w-full aspect-[1/1] object-cover rounded-t-2xl cursor-pointer hover:opacity-90 transition-all duration-300 ease-in-out hover:scale-[1.02]"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col items-center gap-2 py-4 px-3 text-center">
                <h3 className="text-lg font-semibold text-zinc-900">
                  {`${photographer.firstName} ${photographer.lastName}`}
                </h3>

                {/* View Profile Button */}
                <Link
                  href={`/photographer/${photographer._id}`}
                  className="bg-gradient-to-r from-primary-300 to-primary text-white font-medium px-5 py-2 rounded-xl hover:from-primary hover:to-primary-dark transition-all duration-300"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={handlePrev}
          className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronLeft size={32} className="text-gray-600" />
        </button>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={handleNext}
          className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronRight size={32} className="text-gray-600" />
        </button>
      </div>
      <Slider {...settings}>
        {loading &&
          [...Array(4).keys()].map((index) => (
            <div key={index} className="p-6 h-full w-full">
              <div className="flex flex-col mx-auto items-center w-full justify-center gap-2 bg-white shadow-md shadow-zinc-400 rounded-md overflow-hidden hover:scale-105 transition-all duration-300 ease-in-out">
                <Skeleton className="w-full aspect-[1/1]" />
                <div className="flex flex-col items-center justify-center gap-2 pb-5 px-2">
                  <Skeleton className="w-1/2 h-8" />
                  <Skeleton className="w-1/2 h-8" />
                </div>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
}
