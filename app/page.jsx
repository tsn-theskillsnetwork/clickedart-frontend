"use client";

import BestSelling from "@/components/home/bestSelling";
import Button from "@/components/button";
import HeroSection from "@/components/home/heroSection";
import ProductCategories from "@/components/home/productCategories";
import Discover from "@/components/home/discover";
import ProductCategoriesMobile from "@/components/home/productCategoriesMobile";
import Stats from "@/components/home/stats";
import Testimonial from "@/components/home/testimonial";
import DiscoverMobile from "@/components/home/discoverMobile";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [stories, setStories] = useState([]);

  const fetchStories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/story/get-all-story`
      );
      //console.log("STORY", res.data);
      setStories(res.data.stories);
    } catch (error) {
      console.log("Failed to fetch stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="-mt-24 sm:-mt-28"
      >
        <HeroSection />
        {/* <div className="px-4 sm:px-32 mt-28 mb-0"> */}
          {/* <p className="text-paragraph sm:text-heading-05 font-semibold text-surface-600 text-justify">
            <span className="text-heading-04 sm:text-heading-03 font-bold">
              ClickedART{" "}
            </span>
            offers an exclusive collection of large-format photographic wall
            art, featuring breathtaking, ultra-high-resolution images by
            celebrated artists. Customers can choose between digital downloads
            or ready-to-display art pieces. Additionally, our platform is
            dedicated to empowering Indian photographers, providing a
            professional space for them to showcase and sell their exceptional
            work.
          </p> */}
          {/* <Link href={"/about"} className="pt-10">
            <Button size="xl" variant="filled" state="default">
              Know more about us
            </Button>
          </Link> */}
        {/* </div> */}
        <div className="px-4 mt-5">
          <ProductCategoriesMobile />
        </div>
        <div className="hidden sm:block px-4 mb-5">
          <Discover stories={stories} />
        </div>
        <div className="block sm:hidden px-6 mb-5">
          <DiscoverMobile stories={stories} />
        </div>
        <div className=" px-4 mb-5">
          <BestSelling />
        </div>
        <div className="px-4">
          <Testimonial />
        </div>
        <div className="mt-5">
          <Stats />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
