import Image from "next/image";
import React from "react";
import guide1 from "./asset/1.png";
import guide2 from "./asset/2.png";
import guide3 from "./asset/3.png";
import guide4 from "./asset/4.png";
import guide5 from "./asset/5.png";
import delivery from "./asset/delivery.png";
import warranty from "./asset/warranty.png";

export default function PrintingGuide() {
  return (
    <div className="flex flex-col bg-black text-white min-h-screen">
      <h1 className="text-heading-04 sm:text-heading-03 md:text-heading-02 lg:text-heading-01 font-bold text-center">
        OUR PRINT MEDIA
      </h1>
      <h3 className="text-heading-06 sm:text-heading-05 md:text-heading-04 lg:text-heading-03 font-bold text-center">
        Acid Free- 100% Cotton Media
      </h3>
      <h6 className="text-sm sm:text-base md:text-heading-06 font-semibold text-center">
        Museum-Grade Printing for Art Collectors and Photographers
      </h6>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-5">
        <Image src={guide1} width={1080} height={1080} alt="guide1" />
        <Image src={guide2} width={1080} height={1080} alt="guide2" />
        <Image src={guide3} width={1080} height={1080} alt="guide3" />
        <Image src={guide4} width={1080} height={1080} alt="guide4" />
        <Image src={guide5} width={1080} height={1080} alt="guide5" />
      </div>
      <h1 className="text-heading-04 sm:text-heading-03 md:text-heading-02 lg:text-heading-01 font-bold text-center">
        WHY CHOOSE US
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex items-center">
          <Image
            src={warranty}
            width={200}
            height={200}
            className="w-40"
            alt="warranty"
          />
          <p className="text-xs sm:text-sm md:text-base font-medium">
            We guarantee color retention and material durability for up to 10
            years, ensuring timeless beauty.
          </p>
        </div>
        <div className="flex items-center">
          <Image
            src={delivery}
            width={200}
            height={200}
            className="w-40"
            alt="delivery"
          />
          <p className="text-xs sm:text-sm md:text-base font-medium">
            Get your prints delivered anywhere in India and across the globe
            with secure packaging.
          </p>
        </div>
      </div>
    </div>
  );
}
