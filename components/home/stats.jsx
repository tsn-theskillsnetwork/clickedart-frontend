"use client";

import React from "react";
import CountUp from "react-countup";
import Image from "next/image";
import useLayoutStore from "@/store/layout";

export default function Stats() {
  const { layout } = useLayoutStore();
  return (
    <div>
      <div className="relative">
        <Image
          width={1600}
          height={900}
          src={
            layout?.footerDetails?.footerImage ||
            "/assets/Strathmore Clean White 300gsm.png"
          }
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top -z-50 opacity-90"
        />
        <div className="h-full bg-black bg-opacity-20 py-10 md:py-10">
          <div className="px-5 sm:px-36 lg:w-1/2 w-full">
            <h1 className="text-heading-05 sm:text-heading-03 md:text-heading-02 font-bold text-white">
              {layout?.footerDetails?.content?.title || "Welcome to ClickedArt"}
            </h1>
            <div className="md:w-5/6 md:mt-4">
              <p className="text-white text-sm sm:text-md md:text-base">
                {layout?.footerDetails?.content?.body ||
                  "We provide high quality images for your projects. Download images for free and use them in your projects. We provide upto 800 Megapixel resolution images for free."}
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:py-8 px-5 md:px-20 text-white w-full md:w-10/12 backdrop-blur-md md:rounded-3xl justify-around mx-auto">
            <div className="grid justify-center items-center">
              <h2 className="text-base md:text-heading-06 text-center font-semibold">
                Empowering Photographers Nationwide
              </h2>
              <p className="text-xs md:text-md text-center">
                Showcase, connect, and monetize your art effortlessly
              </p>
            </div>
            <div className="grid justify-center items-center">
              <h2 className="text-base md:text-heading-06 text-center font-semibold">
                Earn Up to 90% Royalties
              </h2>
              <p className="text-xs md:text-md text-center">
                Flexible plans for maximizing your earnings
              </p>
            </div>
            <div className="grid justify-center items-center">
              <h2 className="text-base md:text-heading-06 text-center font-semibold">
                Global Reach for Your Images
              </h2>
              <p className="text-xs md:text-md text-center">
                Sell your photos to a worldwide audience with ease
              </p>
            </div>
            <div className="grid justify-center items-center">
              <h2 className="text-base md:text-heading-06 text-center font-semibold">
                Advanced Tools for Creators
              </h2>
              <p className="text-xs md:text-md text-center">
                Watermarking, portfolio customization, and performance analytics
              </p>
            </div>
            <div className="grid justify-center items-center">
              <h2 className="text-base md:text-heading-06 text-center font-semibold">
                Secure and Transparent Payments
              </h2>
              <p className="text-xs md:text-md text-center">
                Hassle-free Payouts with full compliance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
