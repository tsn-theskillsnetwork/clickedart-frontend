"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/button";
import { Skeleton } from "@/components/ui/skeleton";
import PhotographerSearch from "@/components/search/photographerSearch";

export default function SearchResultPage() {
  const searchParams = useSearchParams();

  const [images, setImages] = useState([]);
  const page = searchParams.get("page") || "1";
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
            <div className="px-10 sm:px-10 md:px-10 lg:px-20">
              <PhotographerSearch />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-20 px-10 sm:px-10 md:px-10 lg:px-20">
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
