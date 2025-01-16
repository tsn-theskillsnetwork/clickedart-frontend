"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Link from "next/link";

export default function Featured({ photographers }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
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
          <div key={index} className="p-6">
            <div className="w-64 aspect-[4/5] flex flex-col mx-auto items-center justify-center gap-2 bg-white shadow-md shadow-zinc-400">
              <img
                src={photographer.profileImage}
                alt={photographer.firstName || `Slide ${index + 1}`}
                className=" object-cover object-top w-64 aspect-[1/1]"
              />
              <div className="flex flex-col items-center justify-center gap-2 pb-5">
                <p className="text-heading-04 font-semibold text-black">
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
    // <div className="flex flex-col items-center justify-center gap-10">
    //   <div className="w-[90vw] ">
    //     <div ref={sliderRef} className="keen-slider ">
    //       {artists.map((artist, index) => (
    //         <div key={index} className="keen-slider__slide">
    //           <div className="w-64 aspect-[4/5] flex flex-col mx-auto items-center justify-center gap-2 bg-white shadow-md shadow-zinc-400">
    //             <Image
    //               width={256}
    //               height={256}
    //               src={artist.image}
    //               alt={artist.name || `Slide ${index + 1}`}
    //               className=" object-cover object-top w-64 aspect-[1/1]"
    //             />
    //             <div className="flex flex-col items-center justify-center gap-2 pb-5">
    //               <p className="text-heading-04 font-semibold text-black">
    //                 {artist.name}
    //               </p>
    //               <Button size="lg">View Profile</Button>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    //   <div className="flex flex-row gap-10">
    //     <button
    //       className="bg-zinc-100 rounded-full"
    //       onClick={() => handleNavigation("left")}
    //     >
    //       <p className="sr-only">Featured Artists Left</p>
    //       <ChevronLeft
    //         className="text-zinc-500 pr-1 hover:text-white"
    //         size={64}
    //       />
    //     </button>
    //     <button
    //       className="bg-zinc-100 rounded-full"
    //       onClick={() => handleNavigation("right")}
    //     >
    //       <p className="sr-only">Featured Artists Right</p>
    //       <ChevronRight
    //         size={64}
    //         className="text-zinc-500 pl-1 hover:text-white"
    //       />
    //     </button>
    //   </div>
    // </div>
  );
}
