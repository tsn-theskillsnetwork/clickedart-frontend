"use client";

import React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ThemesPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [themes, setThemes] = useState([
    {
      name: "WILDLIFE",
      src: "/assets/themes/wildlife.jpg",
    },
    {
      name: "RELIGIOUS",
      src: "/assets/themes/religious.jpg",
    },
    {
      name: "PORTRAIT",
      src: "/assets/themes/portrait.jpg",
    },
    {
      name: "NATURE",
      src: "/assets/themes/nature.jpg",
    },
    {
      name: "LANDSCAPE",
      src: "/assets/themes/landscape.jpg",
    },
    {
      name: "GRAYSCALE",
      src: "/assets/themes/grayscale.jpg",
    },
  ]);

  const handleSearch = () => {
    alert(`Searching for ${search}`);
  };

  return (
    <div className="bg-primary-100 flex flex-col -mt-4 pt-4 items-center">
      <div className="mt-[2%] pl-5 relative flex flex-row bg-white border border-primary-200 text-black group rounded-lg items-center gap-4 w-11/12 md:w-4/5 lg:w-2/3 xl:w-4/6 focus-within:outline focus-within:outline-blue-500">
        <input
          type="text"
          placeholder="Search Themes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="active:border-none active:outline-none focus:outline-none focus:border-none py-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold my-1 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-accent-200 h-full aspect-[1/1] text-white rounded-r-lg absolute inset-y-0 right-0"
        >
          {/* <p className="sr-only">Search</p> */}
          <div className="h-full aspect-[1/1] flex justify-center items-center">
            <Search size={40} className="mx-auto" />
          </div>
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-5 md:gap-8 lg:gap-10 xl:gap-12 my-5 sm:my-20 justify-center w-full sm:w-5/6 px-2">
        {themes.map((theme, index) => (
          <div
            key={index}
            className={`relative border-8 border-primary-100 shadow-none hover:border-white hover:shadow-lg hover:shadow-zinc-400 group transition-all duration-300 ease-in-out overflow-hidden`}
            onClick={() => {
              router.push(`/images?theme=${theme.name.toLowerCase()}`);
            }}
            aria-label={`Navigate to ${theme.name}`}
          >
            <Image
              width={600}
              height={300}
              src={theme.src}
              alt={theme.name}
              className={`object-cover h-full w-full aspect-[16/9] group-hover:scale-125 transition-all duration-300 ease-in-out`}
            />
            <div className="absolute inset-x-0 bottom-0 px-3">
              <h1 className="text-paragraph sm:text-[2.5vw] font-bold drop-shadow-md text-white">
                {theme.name}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
