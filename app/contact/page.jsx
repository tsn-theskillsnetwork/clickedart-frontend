"use client"

import useLayoutStore from "@/store/layout";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function ContactPage() {
  const { layout } = useLayoutStore();
  //console.log(layout);
  return (
    <div className="flex flex-col items-center px-4 my-20 h-screen">
      <div className="relative flex flex-col w-full md:w-5/6 overflow-hidden rounded-lg">
        <Image
          src="/assets/themes/nature.jpg"
          className="absolute inset-0 w-full h-full z-0 object-cover "
          alt="Contact"
          width={800}
          height={400}
        />
        <div className="bg-black bg-opacity-30 absolute inset-0 z-0"></div>
        <div className="text-center z-10 my-16 sm:my-20 md:my-24 lg:my-36 text-white">
          <h1 className="2xl:text-heading-lg lg:text-heading-03 sm:text-heading-05 text-heading-06 font-bold">
            CONTACT US
          </h1>
          <h1 className="2xl:text-heading-01 lg:text-heading-04 sm:text-heading-06 text-paragraph font-bold">
            We&apos;d Love to Hear From You!
          </h1>
          <h4 className="2xl:text-heading-04 xl:text-heading-05 lg:text-paragraph sm:text-base text-xs font-semibold">
            Reach out for inquiries, feedback, or just to say hi
          </h4>
        </div>
      </div>
      <div className="grid gap-5 lg:gap-7 2xl:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full md:w-5/6 px-4 md:px-10 -mt-12 z-20">
        <div className="flex flex-col gap-2 px-4 md:px-5 py-6 shadow-[0_5px_10px_rgba(0,0,0,0.15)] rounded-lg bg-white">
          <div className="flex flex-row gap-4">
            <Phone className="mt-1 shrink-0" size={24} />
            <h5 className="md:text-paragraph xl:text-heading-06 2xl:text-heading-05 font-semibold">
              CALL US
            </h5>
          </div>
          <h5 className="xl:text-heading-06 md:text-paragraph 2xl:text-heading-05 font-bold">
            +91 {layout?.footerDetails?.phone}
          </h5>
        </div>
        <div className="flex flex-col gap-2 px-4 md:px-5 py-6 shadow-[0_5px_10px_rgba(0,0,0,0.15)] rounded-lg bg-white">
          <div className="flex flex-row gap-4">
            <Mail className="mt-1 shrink-0" size={24} />
            <h5 className="md:text-paragraph xl:text-heading-06 2xl:text-heading-05 font-semibold">
              MAIL US
            </h5>
          </div>
          <h5 className="xl:text-heading-06 md:text-paragraph 2xl:text-heading-05 font-bold">
            {layout?.footerDetails?.email}
          </h5>
        </div>
        {/* <div className="flex flex-col gap-2 px-4 md:px-5 py-6 shadow-[0_5px_10px_rgba(0,0,0,0.15)] rounded-lg bg-white">
          <div className="flex flex-row gap-4">
            <MapPin className="mt-1 shrink-0" size={24} />
            <h5 className="md:text-paragraph xl:text-heading-06 2xl:text-heading-05 font-semibold">
              ADDRESS
            </h5>
          </div>
          <h5 className="xl:text-heading-06 md:text-paragraph 2xl:text-heading-05 font-bold">
            {layout?.footerDetails?.address}
          </h5>
        </div> */}
      </div>
    </div>
  );
}
