"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useAuthStore from "@/authStore";
import Swal from "sweetalert2";
import axios from "axios";

const taglines = [
  "Stunning Clicks, Premium Prints - Experience ClickedArt!",
  "Bridging Creativity & Commerce - ClickedArt for All!",
  "Photographers Create, Buyers Collect - ClickedArt Connects!",
  "Buy Original, Support Artists - ClickedArt Empowers Creativity!",
  "Discover, Download, Print - ClickedArt for Professionals & Collectors!",
  // "ClickedArt - Where Every Image Finds Its Perfect Home, Digitally & in Print!",
];

export default function HeroSection({ layout, layoutLoading }) {
  const router = useRouter();

  const { photographer, user } = useAuthStore();
  const [currentImage, setCurrentImage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("images");

  const handleSearch = () => {
    if (searchType === "images") {
      router.push(`/search?search=${search}`);
    } else if (searchType === "photographers") {
      router.push(`/photographer?search=${search}`);
    }
  };

  const heroPhotos = layout?.heroSectionPhotos || []; // Dynamic images array

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((currentImage) =>
        currentImage === heroPhotos.length - 1 ? 0 : currentImage + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [heroPhotos.length]);

  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-50">
          <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentImage}
              className="relative w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={currentImage === 0 ? {} : { opacity: 0 }} // Skip exit on first render
              transition={{ duration: 0.3 }} // Reduce duration
            >
              {heroPhotos[currentImage] && (
                <Image
                  src={heroPhotos[currentImage]}
                  alt="hero-image"
                  fill
                  priority
                  className="object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full h-[28vw] mt-72">
          <div className="absolute inset-x-0 mx-auto bottom-3 sm:bottom-5 px-2 left-0 w-[90vw] z-40 flex justify-around gap-2 items-end">
            {heroPhotos.map((image, index) => (
              <div key={index}>
                <Image
                  src={image || "/assets/placeholders/broken-image.png"}
                  alt={`Thumbnail ${index}`}
                  width={300}
                  height={300}
                  loading="eager"
                  quality={50}
                  onClick={() => setCurrentImage(index)}
                  className={`object-cover border-2 sm:border-4 w-[90%] transition-all duration-500 cursor-pointer ease-in-out ${
                    currentImage === index ? "aspect-[6/7]" : "aspect-[7/4]"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="z-20 flex flex-col items-center py-4 text-black bg-white bg-opacity-40">
        <div className="mt-4 flex flex-row bg-white border-2 border-black text-black group rounded-lg px-2 items-center gap-2 w-11/12 md:w-4/5 lg:w-2/3 xl:w-1/2 focus-within:outline focus-within:outline-blue-500 mx-auto">
          <div className="h-full aspect-[1/1] flex justify-center items-center shrink-0">
            <Search size={30} color="black" className="mx-auto" />
          </div>
          <input
            type="text"
            placeholder={`Search for ${searchType}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="py-3 text-sm sm:text-base md:text-lg lg:text-xl font-semibold w-full focus:outline-none bg-white text-black"
          />

          <div className="relative shrink-0">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="bg-white border-l-2 active:border-none active:outline-none focus:ring-0 text-black py-2 px-0 w-20 sm:w-40 md:w-full font-semibold text-sm sm:text-base md:text-lg lg:text-xl rounded-md"
            >
              <option value="images">Images</option>
              {/* <option value="categories">Categories</option> */}
              <option value="photographers">Photographers</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="h-full aspect-[1/1] text-black rounded-r-lg flex justify-center items-center shrink-0"
          >
            <p className="sr-only">Search</p>
            <Icon
              icon="mdi:image-search"
              className="mx-auto"
              style={{ fontSize: "2rem", color: "black" }}
            />
          </button>
        </div>

        <div className="relative mt-[2%] w-full flex flex-col gap-2 items-center md:flex-row justify-around">
          <button
            onClick={() => router.push("/images")}
            className="border-2 bg-gradient-to-tr from-transparent to-transparent hover:from-white border-black rounded-2xl px-2 py-2 sm:px-4 sm:py-2 sm:pl-5 w-52 md:w-72 group transition-all duration-200 ease-linear"
          >
            <div className="flex flex-row gap-2 items-center">
              <div className="flex items-center justify-center h-5 w-5 md:h-10  md:w-10">
                <div className="rounded-full bg-black flex outline-offset-2 outline outline-1 group-hover:outline-none outline-black items-center justify-center w-1 h-1 group-hover:w-10 group-hover:h-10 transition-all duration-200">
                  <ChevronRight
                    size={30}
                    className="text-zinc-500 opacity-0 group-hover:opacity-100"
                  />
                </div>
              </div>
              {/* The text with the outline effect */}
              <p className="relative text-black text-sm md:text-base">
                Browse the collection
                <span className="absolute bottom-0 right-0 h-[1.5px] bg-black w-10 group-hover:w-full transition-all duration-200 ease-in-out"></span>
              </p>
            </div>
          </button>
          <button
            onClick={() => {
              if (photographer) router.push("/profile");
              else if (user)
                Swal.fire(
                  "Please sign in as a Photographer to sell your photos"
                );
              else router.push("/signin?type=photographer");
            }}
            className="border-2 bg-gradient-to-tr from-transparent to-transparent hover:from-white border-black rounded-2xl px-2 py-2 sm:px-4 sm:py-2 sm:pl-5 w-52 md:w-72 group transition-all duration-200 ease-linear"
          >
            <div className="flex flex-row gap-2 items-center">
              <div className="flex items-center justify-center h-5 w-5 md:h-10 md:w-10">
                <div className="rounded-full bg-black flex outline-offset-2 outline outline-1 group-hover:outline-none outline-black items-center justify-center w-1 h-1 group-hover:w-10 group-hover:h-10 transition-all duration-200">
                  <ChevronRight
                    size={30}
                    className="text-zinc-500 opacity-0 group-hover:opacity-100"
                  />
                </div>
              </div>
              <p className="relative text-black text-sm md:text-base">
                Sell your photos
                <span className="absolute bottom-0 right-0 h-[1.5px] bg-black w-10 group-hover:w-full transition-all duration-200 ease-in-out"></span>
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
