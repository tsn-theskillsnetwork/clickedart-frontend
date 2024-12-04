"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const themes = [
  {
    name: "WILDLIFE",
    image: "/assets/themes/wildlife.jpg",
  },
  {
    name: "RELIGIOUS",
    image: "/assets/themes/religious.jpg",
  },
  {
    name: "PORTRAIT",
    image: "/assets/themes/portrait.jpg",
  },
  {
    name: "NATURE",
    image: "/assets/themes/nature.jpg",
  },
  {
    name: "LANDSCAPE",
    image: "/assets/themes/landscape.jpg",
  },
  {
    name: "GRAYSCALE",
    image: "/assets/themes/grayscale.jpg",
  },
];

export default function ProductCategoriesMobile() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center mb-20">
      <h1 className="font-bold text-heading-04 md:text-heading-02 lg:text-heading-01 text-accent-400 mb-10">
        Product Categories
      </h1>
      <div className="grid grid-cols-2 gap-4 justify-center">
        {themes.map((theme, index) => (
          <div
            key={index}
            className={`relative shadow-md shadow-zinc-400 rounded-2xl`}
            onClick={() => {
              router.push(`/images?theme=${theme.name.toLowerCase()}`);
            }}
          >
            <Image
              width={300}
              height={300}
              src={theme.image}
              alt={theme.name}
              className={`object-cover rounded-2xl h-full w-full`}
            />
            <div className="absolute inset-x-0 bottom-0">
              <h1 className="text-heading-05 font-bold drop-shadow-md text-center text-white">
                {theme.name}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
