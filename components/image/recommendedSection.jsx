"use client";

import React, { useState } from "react";

export default function RecommendedSection({ recommended }) {
  const [recommendedLength, setRecommendedLength] = useState(4);
  return (
    <div className="flex flex-col items-start gap-5 my-5">
      <p className="text-paragraph sm:text-heading-06 md:text-heading-04 lg:text-heading-03 font-semibold">
        Recommended for You
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        {recommended?.slice(0, recommendedLength).map((image, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="relative group">
              <Image
                width={800}
                height={800}
                src={image.src1}
                alt={image.title}
                className="object-cover w-full aspect-[1/1] opacity-100 group-hover:opacity-0 transition-all duration-200 ease-linear"
              />
              <div className="absolute inset-0 bg-white object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear" />
              <Image
                width={800}
                height={800}
                src={image.src2}
                alt={image.title}
                className="absolute inset-0 object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear"
              />
              <div className="absolute inset-0">
                <div className="flex justify-end mx-4 mt-4">
                  <Heart
                    size={28}
                    className="text-white group-hover:text-zinc-400 transition-all duration-200 ease-linear"
                  />
                </div>
              </div>
            </div>
            <div className="text-neutral-600">
              <h2 className="text-base sm:text-paragraph md:text-heading-06 lg:text-heading-05 font-bold">
                {image.title}
              </h2>
              <p className="text-xs sm:text-base lg:text-paragraph font-medium">
                {image.artist}
              </p>
              <p className="text-xs sm:text-base lg:text-paragraph font-medium">
                {image.resolutions?.original} MP
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full">
        {recommendedLength < recommended?.length && (
          <div className="col-span-4 flex justify-center">
            <button
              onClick={() => setRecommendedLength(recommendedLength + 4)}
              className="bg-white text-xs sm:text-base lg:text-primary font-semibold border-2 border-primary px-8 py-2 rounded-md hover:bg-primary hover:text-white transition-all duration-200"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
