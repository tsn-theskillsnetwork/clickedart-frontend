"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Image data
const images = [
  { url: "/assets/hero/bg1.jpg", alt: "bg1" },
  { url: "/assets/hero/bg2.jpg", alt: "bg2" },
  { url: "/assets/hero/bg3.jpg", alt: "bg3" },
  { url: "/assets/hero/bg4.jpg", alt: "bg4" },
];

const taglines = [
  "Where Creativity Meets Marketplace",
  "Marketplace for the Visionaries",
  "Your canvas, Your market",
  "Turning Creativity into Opportunity",
];

export default function HeroSection() {
  const router = useRouter();

  const [currentImage, setCurrentImage] = useState(0);
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    router.push(`/images?search=${search}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((currentImage) =>
        currentImage === images.length - 1 ? 0 : currentImage + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[60vh] sm:h-[80vh] md:h-[90vh] lg:h-[100vh] xl:h-[110vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImage}
            className="relative w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={images[currentImage].url}
              alt={images[currentImage].alt}
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text content */}
      <div className="absolute inset-0 z-20 flex flex-col mt-20 sm:mt-36 items-center text-white">
        <h1 className="text-heading-03 md:text-heading-02 lg:text-heading-01 xl:text-heading-lg font-semibold">
          ClickedArt
        </h1>
        <div className="h-12 overflow-hidden">
          <div className="absolute w-full z-30 h-12 left-0 right-0 flex items-center overflow-y-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentImage}
                src={images[currentImage].url}
                alt={images[currentImage].alt}
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: -50 }}
                className="mx-auto"
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <p className="text-md sm:text-xl md:text-paragraph lg:text-heading-06 xl:text-heading-05 font-semibold">
                  {taglines[currentImage]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-[2%] flex flex-row bg-white text-black group rounded-lg items-center gap-4 w-11/12 md:w-4/5 lg:w-2/3 xl:w-1/2 focus-within:outline focus-within:outline-blue-500">
          <div className="h-full aspect-[1/1] flex justify-center items-center">
            <Search size={40} color="black" className="mx-auto" />
          </div>
          <input
            type="text"
            placeholder="Search for images"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="active:border-none active:outline-none focus:outline-none focus:border-none py-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold my-1 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-accent-200 h-full aspect-[1/1] text-white rounded-r-lg relative"
          >
            <p className="sr-only">Search</p>
            <Icon
              icon="mdi:image-search"
              className="mx-auto"
              style={{ fontSize: "2.5rem" }}
            />
          </button>
        </div>
        <div className="mt-[5%] w-full hidden sm:flex gap-2 items-center flex-row justify-around">
          <button className="border-2 bg-gradient-to-tr from-transparent to-transparent hover:from-black border-white rounded-2xl px-2 py-1 sm:px-4 sm:py-2 sm:pl-5 w-72 group transition-all duration-200 ease-linear">
            <div className="flex flex-row gap-2 items-center">
              <div className="flex items-center justify-center h-10 w-10">
                <div className="rounded-full bg-white flex outline-offset-2 outline outline-1 group-hover:outline-none outline-white items-center justify-center w-1 h-1 group-hover:w-10 group-hover:h-10 transition-all duration-200">
                  <ChevronRight
                    size={30}
                    className="text-zinc-500 opacity-0 group-hover:opacity-100"
                  />
                </div>
              </div>
              {/* The text with the outline effect */}
              <p className="relative text-white">
                Browse the collection
                <span className="absolute bottom-0 right-0 h-[1.5px] bg-white w-10 group-hover:w-full transition-all duration-200 ease-in-out"></span>
              </p>
            </div>
          </button>
          <button className="border-2 border-white rounded-2xl px-2 py-1 sm:px-4 sm:py-2 sm:pl-5 w-72 group">
            <div className="flex flex-row gap-2 items-center">
              <div className="flex items-center justify-center h-10 w-10">
                <div className="rounded-full bg-white flex outline-offset-2 outline outline-1 group-hover:outline-none outline-white items-center justify-center w-1 h-1 group-hover:w-10 group-hover:h-10 transition-all duration-200">
                  <ChevronRight
                    size={30}
                    className="text-zinc-500 opacity-0 group-hover:opacity-100"
                  />
                </div>
              </div>
              <p className="relative text-white">
                Sell your photos
                <span className="absolute bottom-0 right-0 h-[1.5px] bg-white w-10 group-hover:w-full transition-all duration-200 ease-in-out"></span>
              </p>
            </div>
          </button>
        </div>
      </div>
      <div>
        <div className="absolute bottom-3 sm:bottom-5 px-2 left-0 w-full z-40 flex justify-around gap-2 items-end">
          {images.map((image, index) => (
            <div key={index}>
              <Image
                src={image.url}
                alt={image.alt}
                width={300}
                height={300}
                loading="lazy"
                onClick={() => setCurrentImage(index)}
                className={`object-cover border-2 sm:border-4 transition-all duration-500 cursor-pointer ease-in-out ${
                  currentImage === index ? "aspect-[6/7]" : "aspect-[7/4]"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
