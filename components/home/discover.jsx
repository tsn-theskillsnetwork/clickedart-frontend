"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Button from "../button";
import Link from "next/link";

export default function Discover({ stories }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-center gap-8 mb-10">
        <h1 className="font-bold text-heading-05 sm:text-heading-03 md:text-heading-02 text-accent-400">
          Every Photo Tells a Story—Discover It
        </h1>
        <Link href="/story">
          <Button size="lg" variant="filled" state="default">
            Explore More
          </Button>
        </Link>
      </div>

      {/* Slider Section */}
      <div className="w-10/12 mx-auto">
        <Slider {...settings}>
          {stories.map((story, index) => (
            <Link href={`/story/${story._id}`} key={index} className="py-10">
              <div className="group relative">
                {/* Image */}
                <Image
                  width={400}
                  height={400}
                  src={story.media_url}
                  alt={story.title || `Slide ${index + 1}`}
                  className="w-full h-[500px] object-cover group-hover:h-[530px] group-hover:-mt-[15px] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                {/* Text */}
                <div className="absolute opacity-0 group-hover:opacity-100 bottom-4 left-0 p-4 transition-all duration-300">
                  <h2 className="font-bold text-heading-06 sm:text-heading-06 md:text-heading-06 text-white">
                    {story.title}
                  </h2>
                  <p className="text-paragraph text-white">{`${story.inspiredBy?.photographer?.firstName} ${story.inspiredBy?.photographer?.lastName}`}</p>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
}
