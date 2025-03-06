"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function ThemesPage() {
  const router = useRouter();

  const [themes, setThemes] = useState([]);
  const [pageSize, setPageSize] = useState(24);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/category/get?pageSize=${pageSize}`
        );
        const data = await response.json();
        setThemes(data.categories);
        setPageCount(data.pageCount);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, [pageSize]);

  return (
    <div className="bg-[#F6F5F4] flex flex-col pt-5 items-center">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5 justify-center w-full px-4">
          {[...Array(9).keys()].map((index) => (
            <div
              key={index}
              className={`relative border-8 border-transparent shadow-none group transition-all duration-300 ease-in-out`}
            >
              <div className="overflow-hidden rounded-none shadow-[rgba(0,0,15,0.3)_5px_5px_4px_0px]">
                <Skeleton className="w-full aspect-[16/9]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5 justify-center w-full px-4">
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
                    width={320}
                    height={180}
                    src={theme.coverImage || "/assets/placeholders/image.webp"}
                    alt={theme.name}
                    priority
                    className="object-cover h-full w-full aspect-[16/9] group-hover:scale-125 transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 px-3">
                  <h1 className="text-base uppercase sm:text-[1.5vw] font-semibold drop-shadow-md text-shadow text-white">
                    {theme.name}
                  </h1>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center items-center">
            {pageCount > 1 && (
              <div
                onClick={() => setPageSize((prev) => prev + 12)}
                className="flex items-center justify-center px-4 rounded-lg mb-10 py-3 bg-primary-dark text-white font-semibold text-sm uppercase cursor-pointer hover:bg-primary-dark transition-all duration-300 ease-in-out"
              >
                View More <ChevronDown size={24} className="ml-2" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
