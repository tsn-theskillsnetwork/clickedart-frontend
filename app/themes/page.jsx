"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ThemesPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [themes, setThemes] = useState([]);

  const handleSearch = () => {
    alert(`Searching for ${search}`);
  };

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/category/get`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        console.log(data);
        setThemes(data.categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchThemes();
  }, []);

  return (
    <div className="bg-[#F6F5F4] flex flex-col -mt-4 pt-5 items-center">
      <h4 className="block sm:hidden text-heading-04 font-semibold text-primary">
        Themes
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-5 md:gap-8 lg:gap-10 xl:gap-12 my-5 sm:my-20 justify-center w-11/12 sm:w-5/6 px-2">
        {themes.map((theme, index) => (
          <div
            key={index}
            className={`relative border-8 border-transparent shadow-none hover:border-white hover:shadow-[rgba(0,0,15,0.3)_5px_5px_4px_0px] group transition-all duration-300 ease-in-out`}
            onClick={() => {
              router.push(`/images?theme=${theme.name.toLowerCase()}`);
            }}
            aria-label={`Navigate to ${theme.name}`}
          >
            <div className="overflow-hidden shadow-[rgba(0,0,15,0.3)_5px_5px_4px_0px] group-hover:shadow-none transition-all duration-300 ease-in-out">
              <Image
                width={600}
                height={300}
                src={theme.coverImage || "/images/placeholder.jpg"}
                alt={theme.name}
                className={`object-cover h-full w-full aspect-[16/9] group-hover:scale-125 transition-all duration-300 ease-in-out`}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 px-3">
              <h1 className="text-paragraph uppercase sm:text-[2.5vw] font-semibold drop-shadow-md text-white">
                {theme.name}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
