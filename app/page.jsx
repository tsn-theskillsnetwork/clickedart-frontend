"use client";

import BestSelling from "@/components/home/BestSelling";
import Button from "@/components/Button";
import HeroSection from "@/components/home/HeroSection";
import ProductCategories from "@/components/home/ProductCategories";
import Head from "next/head";
import Discover from "@/components/home/Discover";
import ProductCategoriesMobile from "@/components/home/ProductCategoriesMobile";
import Stats from "@/components/home/Stats";
import Testimonial from "@/components/home/Testimonial";
import DiscoverMobile from "@/components/home/DiscoverMobile";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
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
        <div className="px-4 sm:px-32 mt-28 mb-0">
          <p className="text-paragraph sm:text-heading-05 font-semibold text-surface-600 text-justify">
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
          </p>
          <div className="pt-10">
            <Button size="xl" variant="filled" state="default">
              Know more about us
            </Button>
          </div>
        </div>
        <div className="overflow-hidden hidden lg:block">
          <ProductCategories />
        </div>
        <div className="px-4 block mt-10 lg:hidden">
          <ProductCategoriesMobile />
        </div>
        <div className=" px-4 mb-20">
          <BestSelling />
        </div>
        <div className="hidden sm:block px-4 my-20">
          <Discover />
        </div>
        <div className="block sm:hidden px-6 my-20">
          <DiscoverMobile />
        </div>
        <div className="px-4">
          <Testimonial />
        </div>
        <div className="mt-20">
          <Stats />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
