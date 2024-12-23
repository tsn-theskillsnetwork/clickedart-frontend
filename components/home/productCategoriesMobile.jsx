"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductCategoriesMobile() {
  const router = useRouter();

  const [themes, setThemes] = useState([]);

  const [active1, setActive1] = useState(0);
  const [active2, setActive2] = useState(1);

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
      }
    };
    fetchThemes();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-0">
      <h1 className="font-bold text-heading-01 text-accent-400 mb-10">
        Themes
        {/* active: {active1} {active2} */}
      </h1>
      <div className="flex mx-5 gap-2 sm:gap-4 justify-end overflow-hidden">
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
            } h-[23vw] relative flex flex-row gap-4 shadow-xl shadow-zinc-300 rounded-2xl justify-center cursor-pointer overflow-hidden transition-all duration-300 ease-in-out`}
            onClick={() => {
              router.push("/images?theme=wildlife");
            }}
          >
            <div className="absolute bottom-2">
              <h1 className="text-xs sm:text-heading-06 md:text-heading-05 lg:text-heading-04 xl:text-heading-03 font-bold text-white drop-shadow-md">
                {theme.name.toUpperCase()}
              </h1>
            </div>
            <Image
              width={800}
              height={800}
              src="/assets/themes/wildlife.jpg"
              alt="wildlife"
              className={`img1 w-full h-full object-cover rounded-2xl transition-all duration-300 ease-in-out`}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex mx-2 sm:mx-40 mt-2 sm:mt-5 gap-2 sm:gap-4 justify-end mb-16">
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
            } h-[23vw] relative flex flex-row gap-4 shadow-xl shadow-zinc-300 rounded-2xl justify-center cursor-pointer overflow-hidden transition-all duration-300 ease-in-out`}
            onClick={() => {
              router.push("/images?theme=wildlife");
            }}
          >
            <div className="absolute bottom-2">
              <h1 className="sm:text-heading-06 md:text-heading-05 lg:text-heading-04 xl:text-heading-03 font-bold text-white drop-shadow-md">
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
    </div>
  );
}
