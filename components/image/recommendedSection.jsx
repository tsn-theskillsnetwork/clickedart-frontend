"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function RecommendedSection({ category, id }) {
  const [images, setImages] = useState([]);
  const [recommendedLength, setRecommendedLength] = useState(4);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/category/search-category?Query=${category}&pageNumber=${page}&pageSize=40`
        );

        setImages(response.data.results);
        console.log(
          "test",
          response.data.results.filter(
            (image) => image.isActive && image.photographer
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, [category]);

  return (
    <div className="flex flex-col items-start gap-5 my-5">
      <p className="text-paragraph sm:text-heading-06 md:text-heading-04 lg:text-heading-03 font-semibold">
        Recommended for You
      </p>
      {images.filter(
        (image) => image.isActive && image.photographer && image._id !== id
      ).length === 0 && (
        <p className="text-base sm:text-paragraph md:text-heading-06 lg:text-heading-05 text-center mx-auto text-red-700 font-medium">
          No recommended images
        </p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        {images
          .filter(
            (image) => image.isActive && image.photographer && image._id !== id
          )
          .map((image, index) => (
            <div key={index} className="flex flex-col gap-4">
              <Link href={`/images/${image._id}`} className="relative group">
                <Image
                  width={800}
                  height={800}
                  src={image.imageLinks.original}
                  alt={image.title}
                  className="object-contain w-full aspect-[1/1] transition-all duration-200 ease-linear"
                />
                <Image
                  width={800}
                  height={800}
                  src={image.imageLinks.original}
                  alt={image.title}
                  className="object-cover absolute inset-0 w-full aspect-[1/1] transition-all duration-200 ease-linear -z-10 blur-sm"
                />
                <div className="absolute inset-0 bg-white object-contain w-full aspect-[1/1] transition-all opacity-30 -z-10 duration-200 ease-linear" />
                {/* <Image
                width={800}
                height={800}
                src={image.src2}
                alt={image.title}
                className="absolute inset-0 object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear"
              /> */}
                {/* <div className="absolute inset-0">
                <div className="flex justify-end mx-4 mt-4">
                  <Heart
                    size={28}
                    className="text-white group-hover:text-zinc-400 transition-all duration-200 ease-linear"
                  />
                </div>
              </div> */}
              </Link>
              <div className="text-neutral-600">
                <h2 className="text-base sm:text-paragraph md:text-heading-06 lg:text-heading-05 font-bold capitalize">
                  {image.title}
                </h2>
                <p className="text-xs sm:text-base lg:text-paragraph font-semibold">
                  {image.category?.name}
                </p>
                <p className="text-xs sm:text-base lg:text-paragraph font-medium">
                  {image.description}
                </p>
                <Link
                  href={`/photographer/${image.photographer._id}`}
                  className="text-xs sm:text-base lg:text-paragraph font-medium"
                >
                  {`${image.photographer.firstName || ""} ${
                    image.photographer.lastName || ""
                  } ${image.photographer.name || ""}`}
                </Link>
              </div>
            </div>
          ))}
      </div>
      <div className="w-full">
        {recommendedLength <
          images?.filter(
            (image) => image.isActive && image.photographer && image._id !== id
          ).length && (
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
