"use client";

import BestSelling from "@/components/home/bestSelling";
import HeroSection from "@/components/home/heroSection";
import Discover from "@/components/home/discover";
import ProductCategoriesMobile from "@/components/home/productCategoriesMobile";
import Stats from "@/components/home/stats";
import Testimonial from "@/components/home/testimonial";
import DiscoverMobile from "@/components/home/discoverMobile";
import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DiscoverMobileLoader from "@/components/home/discoverMobileLoader";
import DiscoverLoader from "@/components/home/discoverLoader";

export default function Home() {
  const [stories, setStories] = useState([]);
  const [storyLoading, setStoryLoading] = useState(true);
  const [layout, setLayout] = useState(null);
  const [layoutLoading, setLayoutLoading] = useState(true);

  const fetchLayout = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/layout/get-layout-content`
      );
      setLayout(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLayoutLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/story/get-all-story`
      );
      setStories(res.data.stories);
    } catch (error) {
      console.log("Failed to fetch stories:", error);
    } finally {
      setStoryLoading(false);
    }
  };

  useEffect(() => {
    fetchLayout();
    fetchStories();
  }, []);
  return (
    <div className="-mt-24 sm:-mt-28">
      <HeroSection layout={layout} />
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
      {/* <Link href={"/explore"} className="pt-10">
            <Button size="xl" variant="filled" state="default">
              Know more about us
            </Button>
          </Link> */}
      {/* </div> */}
      <div className="px-4 my-5">
        <ProductCategoriesMobile />
      </div>
      <div className="hidden sm:block px-4 mb-5">
      {storyLoading ? (
        <DiscoverLoader />
      ) : (
          <Discover stories={stories} />
        )}
      </div>
      <div className="block sm:hidden px-6 mb-5">
        {storyLoading ? (
          <DiscoverMobileLoader />
        ) : (
          <DiscoverMobile stories={stories} />
        )}
      </div>
      {/* <div className=" px-4 mb-5">
        <BestSelling />
      </div> */}
      {/* <div className="px-4">
        <Testimonial />
      </div> */}
      <div className="mt-5">
        <Stats layout={layout} />
      </div>
    </div>
  );
}
