"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RecommendedSection({ category, id }) {
  const [images, setImages] = useState([]);

  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/category/search-category?Query=${category}&pageSize=9`
        );

        setImages(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, [category]);

  return (
    <div className="mb-5">
      <div className="flex flex-cols gap-5 my-5">
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
      </div>
      <div className="relative">
        {/* Slider */}
        <Slider ref={sliderRef} {...settings}>
          {images
            .filter(
              (image) =>
                image.isActive && image.photographer && image._id !== id
            )
            .map((image, index) => (
              <div key={index} className="p-4 capitalize relative">
                <Link href={`/images/${image._id}`}>
                  <Image
                    width={800}
                    height={800}
                    src={image.imageLinks.thumbnail}
                    alt={image.title}
                    className="object-cover w-full aspect-[1/1] rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.5)]"
                  />
                </Link>
                <div className="text-neutral-600 mt-2">
                  <h2 className="font-bold text-lg">{image.title}</h2>
                  <Link
                    href={`/photographer/${image.photographer?._id}`}
                    className="text-sm"
                  >
                    {image.photographer?.firstName}{" "}
                    {image.photographer?.lastName}
                  </Link>
                </div>
              </div>
            ))}
        </Slider>
        <div className=" flex gap-10 justify-center">
          <button
            onClick={handlePrev}
            className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
          >
            <ChevronLeft size={32} className="text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
          >
            <ChevronRight size={32} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
