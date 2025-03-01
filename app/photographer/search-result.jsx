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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-16 px-6 sm:px-8 md:px-10 lg:px-16">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col justify-between items-center bg-gradient-to-b from-zinc-100 to-white shadow-lg hover:shadow-xl border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                >
                  <div className="w-full">
                    <div className="w-full">
                      <Image
                        width={300}
                        height={300}
                        src={
                          image.profileImage ||
                          "/assets/placeholders/profile.jpg"
                        }
                        alt={image.firstName}
                        className="w-full aspect-square object-cover rounded-t-2xl"
                      />
                    </div>

                    <div className="flex flex-col items-center p-4 text-center">
                      <h3 className="text-lg font-semibold text-zinc-900">{`${image.firstName} ${image.lastName}`}</h3>
                      <p className="text-sm text-zinc-500">@{image.username}</p>
                    </div>
                  </div>

                  <Link
                    href={`/photographer/${image._id}`}
                    className="w-full px-4 pb-4"
                  >
                    <button className="w-full bg-gradient-to-r from-primary-300 to-primary text-white font-medium py-2 rounded-xl hover:from-primary hover:to-primary-dark transition-all duration-300">
                      View Profile
                    </button>
                  </Link>
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
