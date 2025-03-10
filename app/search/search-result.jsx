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
import ImageSearch from "@/components/search/imageSearch";

export default function SearchResultPage() {
  const { user, photographer } = useAuthStore();
  const { wishlist, fetchWishlist } = useWishlistStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [images, setImages] = useState([]);
  const page = searchParams.get("page") || 1;
  const sortValue = searchParams.get("sort") || "date";
  const themeValue = searchParams.get("theme") || "all";
  const searchValue = searchParams.get("search") || "";
  const typeValue = searchParams.get("type") || "image";

  const [filter, setFilter] = useState("price");
  const [themes, setThemes] = useState([]);
  const [theme, setTheme] = useState(themeValue);
  const [sort, setSort] = useState(sortValue);
  const [pageSize, setPageSize] = useState(120);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    router.push(`/search?search=${search}`);
  };

  useEffect(() => {
    setSearch(searchValue);
    setTheme(themeValue);
    setSort(sortValue);
  }, [searchValue]);

  const addImageToWishlist = async (imageId) => {
    try {
      if (!(user || photographer)) {
        return router.push("/signin");
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/add-images-in-wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: (user || photographer)?._id,
            imageIds: [imageId],
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add image to wishlist");
      }
      fetchWishlist((user || photographer)?._id);
    } catch (error) {
      console.error("Error adding image to wishlist:", error);
    }
  };

  const removeImageFromWishlist = async (imageId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/remove-images-from-wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: (user || photographer)?._id,
            imageIds: [imageId],
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove image from wishlist");
      }
      fetchWishlist((user || photographer)?._id);
    } catch (error) {
      console.error("Error removing image from wishlist:", error);
    }
  };

  useEffect(() => {
    setSort(sortValue);
    setTheme(themeValue);
    setSearch(searchValue);
  }, [themeValue, sortValue, searchValue]);

  const sortedImages = [...images]
    .filter((image) =>
      theme === "all"
        ? true
        : image.category.some(
            (cat) => cat.name.toLowerCase() === theme.toLowerCase()
          )
    )
    .sort((a, b) => {
      if (sort === "price") return a.price?.original - b.price?.original;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "popularity")
        return b.imageAnalytics?.views - a.imageAnalytics?.views;
      return new Date(b.date) - new Date(a.date);
    });

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/category/get?pageSize=${Infinity}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        const sorted = data.categories.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setThemes(sorted);
      } catch (error) {
        console.error(error);
      }
    };

    fetchThemes();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/images/search-images?Query=${searchValue}&pageSize=${pageSize}`,
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

    const fetchAllImages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-all-images?pageSize=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setImages(data.photos);
        setPageCount(data.pageCount);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (searchValue === "") {
      fetchAllImages();
    } else {
      fetchImages();
    }
  }, [searchValue, pageSize]);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex my-10 flex-col min-h-screen"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 px-4 sm:px-10 lg:px-20 justify-between items-start gap-5">
          <ImageSearch />
          <div className="grid grid-cols-2 2xl:w-1/2 gap-4 md:ml-auto md:justify-end">
            <div className="flex flex-col">
              <p className="font-semibold text-primary-dark text-paragraph">
                Themes
              </p>
              <Select
                className="w-full"
                value={theme}
                onValueChange={(value) => {
                  setTheme(value);
                  if (searchValue) {
                    router.push(
                      `/search?search=${value}&sort=${sort}${
                        search && `&search=${search}`
                      }`
                    );
                  } else {
                    router.push(`/images?theme=${value}&sort=${sort}`);
                  }
                }}
              >
                <SelectTrigger className="!text-base py-5 w-full font-semibold shadow-sm bg-gray-200">
                  <SelectValue />
                  <p className="sr-only">Themes</p>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {themes.map((theme, index) => (
                    <SelectItem key={index} value={theme.name.toLowerCase()}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col">
                <p className="font-semibold text-primary-dark text-paragraph">
                  Sort by
                </p>
                <Select
                  className="w-full"
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value);
                    router.push(
                      `/search?theme=${theme}&sort=${value}${
                        search && `&search=${search}`
                      }`
                    );
                  }}
                >
                  <SelectTrigger className="!text-base w-full py-5 font-semibold shadow-sm bg-gray-200">
                    <SelectValue />
                    <p className="sr-only">Sort by</p>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    {/* <SelectItem value="rating">Rating</SelectItem> */}
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-20 px-10 sm:px-10 md:px-10 lg:px-20 xl:px-44">
            {[...Array(pageSize)].map((_, index) => (
              <div key={index} className="flex flex-col gap-4">
                <Skeleton className="w-full aspect-[1/1] rounded-lg" />
                <div className="flex flex-col gap-4">
                  <Skeleton className="w-full h-6" />
                  <Skeleton className="w-1/2 h-4" />
                  <Skeleton className="w-1/2 h-4" />
                  <Skeleton className="w-1/4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="sm:columns-2 lg:columns-3 gap-2 mt-10 px-4 sm:px-10 md:px-10 lg:px-20">
          {sortedImages.map((image, index) => (
            <div
              key={index}
              className=" w-full mb-2 shadow-[0px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden transition-all duration-200 ease-out"
            >
              <Link
                href={`/images/${image._id}`}
                className="relative cursor-pointer"
              >
                <Image
                  src={
                    image.imageLinks.thumbnail ||
                    "/assets/placeholders/image.webp"
                  }
                  width={500}
                  height={500}
                  alt={image.description}
                  className="w-full"
                />
                <div className="absolute inset-0 flex flex-col justify-between py-2 px-4 transition-all duration-200 ease-linear">
                  <div className="flex justify-between items-center">
                    <p
                      style={{
                        textShadow: "-1px 1px 2px #666, 1px 1px 2px #666",
                      }}
                      className="text-white font-semibold text-xs"
                    >
                      {image.title || "Untitled"}
                    </p>
                    <div className="flex gap-2">
                      <Heart
                        size={24}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (user || photographer) {
                            wishlist?.some((item) => item._id === image._id)
                              ? removeImageFromWishlist(image._id)
                              : addImageToWishlist(image._id);
                          } else {
                            toast.error("Please login to add to wishlist");
                          }
                        }}
                        className={` ${
                          wishlist?.some((item) => item._id === image._id)
                            ? "text-red-400 fill-red-500"
                            : "text-white"
                        }  transition-all duration-200 ease-linear cursor-pointer`}
                      />
                    </div>
                  </div>
                  {/* <div className="flex justify-between items-center drop-shadow-md">
                    <p className="text-white font-medium text-xs sm:text-sm">
                      {image.photographer?.firstName
                        ? image.photographer?.firstName +
                          " " +
                          image.photographer?.lastName
                        : image.photographer?.name}
                    </p>
                    <p
                      style={{
                        textShadow: "-1px 1px 2px #666, 1px 1px 2px #666",
                      }}
                      className="text-white font-semibold text-paragraph"
                    >
                      ₹ {image.price?.original?.toLocaleString()}
                    </p>
                  </div> */}
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center items-center mt-10">
          {pageCount > page && (
            <div
              onClick={() => setPageSize((prev) => prev + 30)}
              className="flex items-center justify-center px-4 rounded-lg mb-10 py-3 bg-primary text-white font-medium text-base uppercase cursor-pointer hover:bg-primary-dark transition-all duration-300 ease-in-out"
            >
              View More <ChevronDown size={18} className="ml-2" />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
