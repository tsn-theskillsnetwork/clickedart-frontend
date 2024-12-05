"use client";
import React from "react";
import Button from "../Button";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const images = [
  {
    src: "/assets/images/img3.jpg",
    title: "Artwork 1",
    artist: "Photographer",
  },
  {
    src: "/assets/images/img5.jpg",
    title: "Artwork 2",
    artist: "Photographer",
  },
  {
    src: "/assets/images/img2.jpg",
    title: "Artwork 3",
    artist: "Photographer",
  },
  {
    src: "/assets/hero/bg2.jpg",
    title: "Artwork 4",
    artist: "Photographer",
  },
  {
    src: "/assets/images/img1.jpg",
    title: "Artwork 5",
    artist: "Photographer",
  },
];

export default function DiscoverMobile() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col text-center items-center justify-center gap-8 mb-10">
        <h1 className="font-bold text-heading-05 sm:text-heading-03 md:text-heading-02 text-accent-400">
          Every Photo Tells a Story—Discover It
        </h1>
        <Button
          size="lg"
          variant="filled"
          state="default"
          onClick={() => {
            toast.success("Explore More");
          }}
        >
          Explore More
        </Button>
      </div>
      <div className="flex flex-col">
        {images.map((image, index) => (
          <div key={index} className="my-0 py-0">
            <div className="relative group overflow-hidden">
              <Image
                width={300}
                height={200}
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 p-4 z-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <h2 className="font-bold text-heading-06 sm:text-heading-06 md:text-heading-06 text-white">
                  {image.title}
                </h2>
                <p className="text-paragraph text-white">{image.artist}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
