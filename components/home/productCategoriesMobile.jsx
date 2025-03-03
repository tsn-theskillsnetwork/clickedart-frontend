"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button2 from "../button2";
import Link from "next/link";
import Button from "../button";

export default function ProductCategoriesMobile() {
  const router = useRouter();

  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [active1, setActive1] = useState(0);
  const [active2, setActive2] = useState(1);
  const [active3, setActive3] = useState(2);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/category/get`
        );
        const data = await response.json();
        setThemes(data.categories);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center">
        {[...Array(3).keys()].map((mainIndex) => (
          <div
            key={mainIndex}
            className="flex mx-2 mt-2 sm:mt-5 gap-2 sm:gap-4 justify-end"
          >
            {[...Array(3).keys()].map((index) => (
              <div
                key={index}
                className={`${
                  mainIndex === index ? "aspect-[16/9]" : "aspect-[1/1]"
                } h-[24.5vw] relative flex flex-row gap-4 shadow-xl shadow-zinc-300 rounded-2xl justify-center overflow-hidden transition-all duration-300 ease-in-out`}
              >
                <div className="absolute bottom-2">
                  <div
                    className={`animate-pulse bg-gray-300 h-4 ${
                      mainIndex === index ? "w-[24vw]" : "w-[18vw]"
                    }`}
                  ></div>
                </div>
                <div className="animate-pulse bg-gray-300 w-full h-full object-cover rounded-2xl"></div>
              </div>
            ))}
          </div>
        ))}
        <Link className="mt-5" href="/themes">
          <Button>View All Themes</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex mx-2 mt-2 sm:mt-5 gap-2 sm:gap-2 justify-end">
        {themes.slice(0, 3).map((theme, index) => (
          <motion.div
            layout
            key={index}
            onHoverStart={() => {
              setActive1(index);
            }}
            onHoverEnd={() => {
              setActive1(0);
            }}
            className={`${
              active1 === index ? "aspect-[16/9]" : "aspect-[1/1]"
            } h-[24.5vw] relative flex flex-row gap-4 shadow-md shadow-zinc-300 rounded-2xl justify-center cursor-pointer overflow-hidden transition-all duration-300 ease-in-out`}
            onClick={() => {
              router.push(`/images?theme=${theme.name.toLowerCase()}`);
            }}
          >
            <div className="absolute bottom-2">
              <h1 className="text-xs sm:text-paragraph md:text-heading-06 lg:text-heading-05 xl:text-heading-04 font-bold text-white drop-shadow-md">
                {theme.name.toUpperCase()}
              </h1>
            </div>
            <Image
              width={800}
              height={800}
              src={theme.coverImage || "/images/placeholder.jpg"}
              alt={theme.name}
              className={`img1 w-full h-full object-cover rounded-2xl transition-all duration-300 ease-in-out`}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex mx-2 mt-2 sm:mt-2 gap-2 sm:gap-2 justify-end">
        {themes.slice(3, 6).map((theme, index) => (
          <motion.div
            layout
            key={index}
            onHoverStart={() => {
              setActive2(index);
            }}
            onHoverEnd={() => {
              setActive2(1);
            }}
            className={`${
              active2 === index ? "aspect-[16/9]" : "aspect-[1/1]"
            } h-[24.5vw] relative flex flex-row gap-4 shadow-md shadow-zinc-300 rounded-2xl justify-center cursor-pointer overflow-hidden transition-all duration-300 ease-in-out`}
            onClick={() => {
              router.push(`/images?theme=${theme.name.toLowerCase()}`);
            }}
          >
            <div className="absolute bottom-2">
              <h1 className="text-xs sm:text-paragraph md:text-heading-06 lg:text-heading-05 xl:text-heading-04 font-bold text-white drop-shadow-md">
                {theme.name.toUpperCase()}
              </h1>
            </div>
            <Image
              width={800}
              height={800}
              src={theme.coverImage || "/images/placeholder.jpg"}
              alt={theme.name}
              className={`img1 w-full h-full object-cover rounded-2xl transition-all duration-300 ease-in-out`}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex mx-2 mt-2 sm:mt-2 gap-2 sm:gap-2 justify-end">
        {themes.slice(6, 9).map((theme, index) => (
          <motion.div
            layout
            key={index}
            onHoverStart={() => {
              setActive3(index);
            }}
            onHoverEnd={() => {
              setActive3(2);
            }}
            className={`${
              active3 === index ? "aspect-[16/9]" : "aspect-[1/1]"
            } h-[24.5vw] relative flex flex-row gap-4 shadow-md shadow-zinc-300 rounded-2xl justify-center cursor-pointer overflow-hidden transition-all duration-300 ease-in-out`}
            onClick={() => {
              router.push(`/images?theme=${theme.name.toLowerCase()}`);
            }}
          >
            <div className="absolute bottom-2">
              <h1 className="text-xs sm:text-paragraph md:text-heading-06 lg:text-heading-05 xl:text-heading-04 font-bold text-white drop-shadow-md">
                {theme.name.toUpperCase()}
              </h1>
            </div>
            <Image
              width={800}
              height={800}
              src={theme.coverImage || "/images/placeholder.jpg"}
              alt={theme.name}
              className={`img1 w-full h-full object-cover rounded-2xl transition-all duration-300 ease-in-out`}
            />
          </motion.div>
        ))}
      </div>
      {themes.length > 6 && (
        <Link className="mt-5" href="/themes">
          <Button>View All Themes</Button>
        </Link>
      )}
    </div>
  );
}
