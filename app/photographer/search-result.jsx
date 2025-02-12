"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Heart, Search, Tag } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCartStore from "@/store/cart";
import useAuthStore from "@/authStore";
import useWishlistStore from "@/store/wishlist";
import Link from "next/link";
import toast from "react-hot-toast";
import Button from "@/components/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [images, setImages] = useState([]);
  const page = searchParams.get("page") || "1";
  const searchValue = searchParams.get("search") || "";
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    router.push(`/photographer?search=${search}`);
  };

  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/search-photographer?Query=${searchValue}&pageNumber=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setImages(data.results);
        setPageCount(data.pageCount);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    console.log("page", page);

    const fetchAllPhotographers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/get-all-photographers?pageNumber=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setImages(data.photographers);
        setPageCount(data.pageCount);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (searchValue === "") {
      fetchAllPhotographers();
    } else {
      fetchPhotographer();
    }
  }, [searchValue, page]);

  return (
    <AnimatePresence mode="popLayout">
      {
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex my-10 flex-col min-h-screen justify-between"
        >
          <div>
            <div className="flex flex-col sm:flex-row px-2 justify-between gap-5">
              <div className="mt-4 flex flex-row bg-white text-black shadow-[0_0_8px_rgba(0,0,0,0.4)] group rounded-lg items-center gap-2 w-11/12 md:w-4/5 lg:w-2/3 xl:w-1/2 focus-within:outline focus-within:outline-blue-500 mx-auto">
                <div className="h-full aspect-[1/1] flex justify-center items-center shrink-0">
                  <Search size={30} color="black" className="mx-auto" />
                </div>
                <input
                  type="text"
                  placeholder={`Search for Photographers`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="py-3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold w-full focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="bg-accent-200 h-full aspect-[1/1] text-white rounded-r-lg flex justify-center items-center shrink-0"
                >
                  <p className="sr-only">Search</p>
                  <Icon
                    icon="mdi:image-search"
                    className="mx-auto"
                    style={{ fontSize: "2rem" }}
                  />
                </button>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-20 px-10 sm:px-10 md:px-10 lg:px-20 xl:px-44">
              {images.map((image, index) => (
                <div key={index} className="keen-slider__slide">
                  <div className="w-full  flex flex-col mx-auto items-center justify-center gap-2 bg-white shadow-md shadow-zinc-400">
                    <Image
                      width={256}
                      height={256}
                      src={
                        image.profileImage || "/assets/placeholders/profile.jpg"
                      }
                      alt={image.firstName}
                      className=" object-cover object-top w-full aspect-[1/1]"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 pb-5">
                      <p className="text-heading-04 font-semibold text-black">
                        {`${image.firstName} ${image.lastName}`}
                      </p>
                      <p className="text-paragraph font-medium text-black lowercase">
                        {`@${image.username}`}
                      </p>
                      <Link href={`/photographer/${image._id}`}>
                        <Button size="lg">View Profile</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-center items-center mt-10">
            {[...Array(pageCount).keys()].map((index) => (
              <Link
                href={`/photographer?search=${searchValue}&page=${index + 1}`}
                key={index}
                className={`${
                  index + 1 === parseInt(page)
                    ? "bg-primary text-white"
                    : "bg-secondary-100 text-white"
                } px-4 py-2 mx-2 rounded-lg cursor-pointer`}
              >
                {index + 1}
              </Link>
            ))}
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
}
