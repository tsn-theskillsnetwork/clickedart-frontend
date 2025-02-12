"use client";

import React from "react";
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
          <div className="px-5 sm:px-36 w-full">
            <h1 className="text-heading-05 sm:text-heading-03 md:text-heading-02 text-center font-bold text-white">
              {layout?.footerDetails?.content?.title || "Welcome to ClickedArt"}
            </h1>
            <div className="md:w-5/6 md:mt-4 mx-auto">
              <p className="text-white text-sm sm:text-md md:text-paragraph text-center">
                {layout?.footerDetails?.content?.body ||
                  "We provide high quality images for your projects. Download images for free and use them in your projects. We provide upto 800 Megapixel resolution images for free."}
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-16 flex flex-wrap gap-5 md:py-8 px-5 text-white w-full justify-center">
            <div className="grid justify-center items-center backdrop-blur-md rounded-3xl overflow-hidden p-2 shadow-[2px_2px_8px_rgba(0,0,0,0.2)] w-full sm:w-1/3 lg:w-1/6">
              <h2 className="text-base md:text-heading-06 text-center font-semibold">
                Photographer-Owned Rights- Complete Control
              </h2>
            </div>
            <div className="grid justify-center items-center backdrop-blur-md rounded-3xl overflow-hidden p-2 shadow-[2px_2px_8px_rgba(0,0,0,0.2)] w-full sm:w-1/3 lg:w-1/6">
              <h2 className="text-base md:text-heading-06 text-center font-semibold">
                High Royalty Earnings - Earn up to 90%
              </h2>
            </div>
            <div className="grid justify-center items-center backdrop-blur-md rounded-3xl overflow-hidden p-2 shadow-[2px_2px_8px_rgba(0,0,0,0.2)] w-full sm:w-1/3 lg:w-1/6">
              <h2 className="text-base md:text-heading-06 text-center font-semibold">
                Set Your Prices - Freedom to decide
              </h2>
            </div>
            <div className="grid justify-center items-center backdrop-blur-md rounded-3xl overflow-hidden p-2 shadow-[2px_2px_8px_rgba(0,0,0,0.2)] w-full sm:w-1/3 lg:w-1/6">
              <h2 className="text-base md:text-heading-06 text-center font-semibold">
                Flexible Membership Plans - No upfront cost
              </h2>
            </div>
            <div className="grid justify-center items-center backdrop-blur-md rounded-3xl overflow-hidden p-2 shadow-[2px_2px_8px_rgba(0,0,0,0.2)] w-full sm:w-1/3 lg:w-1/6">
              <h2 className="text-base md:text-heading-06 text-center font-semibold">
                Personalised Dashboard & Insights - A detailed, real-time
                dashboard
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
