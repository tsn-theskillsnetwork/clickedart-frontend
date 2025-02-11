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

export default function SearchResultPage() {
  const { user } = useAuthStore();
  const { wishlist, fetchWishlist } = useWishlistStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [images, setImages] = useState([]);
  const page = searchParams.get("page") || 1;
  const searchValue = searchParams.get("search") || "";
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

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
          className="flex my-10 flex-col min-h-screen"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-20 px-10 sm:px-10 md:px-10 lg:px-20 xl:px-44">
            {images.map((image, index) => (
              <div key={index} className="keen-slider__slide">
                <div className="w-64 aspect-[4/5] flex flex-col mx-auto items-center justify-center gap-2 bg-white shadow-md shadow-zinc-400">
                  <Image
                    width={256}
                    height={256}
                    src={
                      image.profileImage || "/assets/placeholders/profile.jpg"
                    }
                    alt={image.firstName}
                    className=" object-cover object-top w-64 aspect-[1/1]"
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
          <div className="w-full flex justify-center items-center mt-10">
            {[...Array(pageCount).keys()].map((index) => (
              <div
                key={index}
                className={`${
                  page === index + 1
                    ? "bg-primary text-white"
                    : "bg-white text-primary"
                } px-4 py-2 mx-2 rounded-lg cursor-pointer`}
                onClick={() => {
                  router.push(
                    `/search?search=${searchValue}&page=${index + 1}`
                  );
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
}
