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
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
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

  useEffect(() => {
    const isAlertClosed = Cookies.get("signupAlert");
    const token = Cookies.get("token");
    if (token || isAlertClosed) {
      return;
    }

    Swal.fire({
      // title: "",
      // text: "",
      // icon: "info",
      imageUrl: "/assets/banners/signup-popup.png",
      showCancelButton: true,
      confirmButtonText: "Signup Now",
      cancelButtonText: "Later",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/signup/photographer");
      } else {
        Cookies.set("signupAlert", 1, { expires: 1 });
      }
    });
  }, []);

  return (
    <div className="-mt-24 sm:-mt-28">
      <HeroSection layout={layout} loading={layoutLoading} />
      <div className="px-4 my-5">
        <ProductCategoriesMobile />
      </div>
      <div className="hidden sm:block px-4 mt-10 bg-gray-100 mb-5">
        {storyLoading ? <DiscoverLoader /> : <Discover stories={stories} />}
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
      <div className="px-4">
        <motion.div layout>
          <Testimonial />
        </motion.div>
      </div>
      <div className="mt-5">
        <motion.div layout>
          <Stats layout={layout} />
        </motion.div>
      </div>
    </div>
  );
}
