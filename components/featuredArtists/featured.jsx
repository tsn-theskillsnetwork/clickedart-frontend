"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Featured({ photographers }) {
  const router = useRouter();
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    // adaptiveHeight: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="w-full relative">
      <Slider {...settings}>
        {photographers?.map((photographer, index) => (
          <div key={index} className="p-6 h-full">
            <div className=" flex flex-col mx-auto items-center justify-center gap-2 bg-white shadow-md shadow-zinc-400 rounded-md overflow-hidden hover:scale-105 transition-all duration-300 ease-in-out">
              <img
                onClick={() => router.push(`/photographer/${photographer._id}`)}
                src={photographer.profileImage || "/assets/placeholders/profile.jpg"}
                alt={photographer.firstName || `Slide ${index + 1}`}
                className=" object-cover object-top w-full aspect-[1/1]"
              />
              <div className="flex flex-col items-center justify-center gap-2 pb-5 px-2">
                <p className="text-heading-04 font-semibold text-black text-center">
                  {`${photographer.firstName} ${photographer.lastName}`}
                </p>
                <Link
                  href={`/photographer/${photographer._id}`}
                  className="bg-primary text-white px-4 py-2 rounded-lg"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
