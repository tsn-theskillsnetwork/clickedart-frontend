import Image from "next/image";
import React from "react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[70vh]">
      <div className="relative flex flex-col gap-5 items-center justify-center py-20">
        <Image
          src="/assets/images/img4.jpg"
          alt="About us"
          width={1600}
          height={1600}
          className="object-cover absolute inset-0 w-full h-full -z-20"
        />
        <div className="absolute inset-0 bg-black opacity-20 -z-20" />
        <h1 className="text-heading-01 font-semibold text-white">Who We Are</h1>
        <p className="text-heading-04 font-medium text-center text-white">
          We&apos;re a team of passionate photographers turning imagination into
          reality
        </p>
        <button className="bg-white text-surface-500 px-5 py-2 rounded-md">
          Connect with us!
        </button>
      </div>
      <div className="px-20 mb-20">
        <h2 className="text-heading-02 font-semibold mt-10">
          About ClickedArt
        </h2>
        <p className="text-heading-05 font-medium mt-5">
          A comprehensive digital marketplace that allows photographers to reach
          the public, relevant businesses, and corporates in both digital and
          print formats, ensuring fair compensation for their creative work.
        </p>
        <p className="text-heading-05 font-medium mt-10">
          Welcome to ClickedArt.com, a vibrant platform built for photographers
          and visual content enthusiasts! We empower talented photographers
          across India to showcase their creativity, connect with a wider
          audience, and monetize their artistry seamlessly. At the same time, we
          cater to buyers seeking authentic, highquality visuals that capture
          the essence of India&apos;s culture, landscapes, and diversity. We
          believe that every photograph tells a story, and we are here to bridge
          the gap between creators and admirers by offering a dedicated space
          where creativity meets purpose.
        </p>

        <div className="relative flex flex-col gap-5 items-center justify-center py-20 mt-10 rounded-xl overflow-hidden">
          <Image
            src="/assets/images/img6.jpg"
            alt="About us"
            width={1600}
            height={1600}
            className="object-cover absolute inset-0 w-full h-full -z-20"
          />
          <div className="absolute inset-0 bg-black opacity-20 -z-20" />
          <h1 className="text-heading-02 font-semibold text-white">
            Our Vision
          </h1>
          <p className="text-heading-05 font-medium text-center text-white">
            To become India&apos;s most trusted marketplace for connecting
            photographers and buyers, fostering a thriving ecosystem for
            creativity, collaboration, and inspiration.
          </p>
        </div>

        <div className="relative flex flex-col gap-5 items-center justify-center py-20 rounded-xl overflow-hidden mt-10">
          <Image
            src="/assets/images/img2.jpg"
            alt="About us"
            width={1600}
            height={1600}
            className="object-cover absolute inset-0 w-full h-full -z-20"
          />
          <div className="absolute inset-0 bg-black opacity-20 -z-20" />
          <h1 className="text-heading-02 font-semibold text-white">
            Our Mission
          </h1>
          <div className="grid grid-cols-2 gap-10 px-10">
            <div>
              <p className="text-heading-04 text-center text-white font-bold">
                For Photographers
              </p>
              <p className="mt-2 text-heading-05 font-medium text-center text-white">
                Empower photographers with a platform to showcase, sell, and
                monetize their creative work while connecting them with a global
                audience.
              </p>
            </div>
            <div>
              <p className="text-heading-04 text-center text-white font-bold">
                For Buyers
              </p>
              <p className="mt-2 text-heading-05 font-medium text-center text-white">
                Provide buyers with easy access to authentic, high-quality
                original images and prints that cater to their personal,
                commercial, and creative needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
