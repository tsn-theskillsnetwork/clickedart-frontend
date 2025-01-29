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
import toast from "react-hot-toast";
import Link from "next/link";

export default function ThemesResultPage() {
  const { user } = useAuthStore();
  const { wishlist, fetchWishlist } = useWishlistStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [images, setImages] = useState([]);

  const page = searchParams.get("page") || 1;
  const sortValue = searchParams.get("sort") || "date";
  const themeValue = searchParams.get("theme") || "all";
  const searchValue = searchParams.get("search") || "";

  const [filter, setFilter] = useState("price");
  const [themes, setThemes] = useState([]);
  const [theme, setTheme] = useState(themeValue);
  const [sort, setSort] = useState(sortValue);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(12);
  const [pageCount, setPageCount] = useState(1);
  // const [wishlist, setWishlist] = useState([]);

  const addImageToWishlist = async (imageId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/add-images-in-wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?._id,
            imageIds: [imageId],
          }),
        }
      );

      const data = await res.json();
      //console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to add image to wishlist");
      }
      fetchWishlist(user?._id);
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
            userId: user?._id,
            imageIds: [imageId],
          }),
        }
      );

      const data = await res.json();
      //console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove image from wishlist");
      }
      fetchWishlist(user?._id);
    } catch (error) {
      console.error("Error removing image from wishlist:", error);
    }
  };

  useEffect(() => {
    setSort(sortValue);
    setTheme(themeValue);
    setSearch(searchValue);
  }, [themeValue, sortValue, searchValue]);

  const sortedImages = [...images].sort((a, b) => {
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
          `${process.env.NEXT_PUBLIC_SERVER}/api/category/get`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        //console.log(data);
        setThemes(data.categories);
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
          `${process.env.NEXT_PUBLIC_SERVER}/api/category/search-category?Query=${themeValue}&pageNumber=${page}&pageSize=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        //console.log(data);
        setImages(data.results);
        setPageCount(data.pageCount);
        //console.log(data.results);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllImages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-all-images?pageNumber=${page}&pageSize=${pageSize}`,
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
        //console.log(data.photos);
      } catch (error) {
        console.error(error);
      }
    };

    if (!themeValue || themeValue === "all") {
      fetchAllImages();
    } else {
      fetchImages();
    }
  }, [themeValue, pageSize, page]);

  // useEffect(() => {
  //   const fetchWishlist = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/get-my-wishlist?userId=${user?._id}`,
  //         {
  //           method: "GET",
  //         }
  //       );
  //       const data = await response.json();
  //       setWishlist(data.wishlist?.images);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchWishlist();
  // }, [user]);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex my-10 flex-col min-h-screen"
      >
        <div className="flex flex-col sm:flex-row px-20 justify-between gap-5">
          <div className="flex flex-col">
            <p className="font-semibold text-primary-dark text-paragraph">
              Themes
            </p>
            <Select
              className="w-36"
              defaultValue={theme}
              onValueChange={(value) => {
                setTheme(value);
                router.push(
                  `/images?theme=${value}&sort=${sort}${
                    search && `&search=${search}`
                  }`
                );
              }}
            >
              <SelectTrigger className="!text-paragraph py-5 w-full sm:w-40 font-semibold shadow-sm bg-gray-200">
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
          {/* <div className="pl-5 relative flex flex-row bg-white border border-primary-200 text-black group rounded-lg items-center gap-4 w-full focus-within:outline focus-within:outline-blue-500">
            <input
              type="text"
              placeholder="Search Themes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="active:border-none active:outline-none focus:outline-none focus:border-none py-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold my-1 w-full"
            />
            <button
              onClick={handleSearch}
              className="bg-accent-200 h-full aspect-[1/1] text-white rounded-r-lg absolute inset-y-0 right-0"
            >
              <p className="sr-only">Search</p>
              <div className="h-full aspect-[1/1] flex justify-center items-center">
                <Search size={40} className="mx-auto" />
              </div>
            </button>
          </div> */}
          <div className="flex flex-col sm:flex-row gap-5">
            {/* <div className="flex flex-col">
              <p className="font-semibold text-primary-dark text-paragraph">
                Filter by
              </p>
              <Select
                className="w-36"
                defaultValue={filter}
                onValueChange={(value) => setFilter(value)}
              >
                <SelectTrigger className="!text-paragraph w-full sm:w-40 py-5 font-semibold shadow-sm bg-gray-200">
                  <SelectValue />
                  <p className="sr-only">Filter by</p>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <div className="flex flex-col">
              <p className="font-semibold text-primary-dark text-paragraph">
                Sort by
              </p>
              <Select
                className="w-36"
                defaultValue={sort}
                onValueChange={(value) => {
                  setSort(value);
                  router.push(
                    `/images?theme=${theme}&sort=${value}${
                      search && `&search=${search}`
                    }`
                  );
                }}
              >
                <SelectTrigger className="!text-paragraph w-full sm:w-40 py-5 font-semibold shadow-sm bg-gray-200">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-20 px-10 sm:px-10 md:px-10 lg:px-20 xl:px-44">
          {sortedImages.map((image, index) => (
            <div key={index} className="shadow-[0px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden transition-all duration-200 ease-out">
              <div
                onClick={() => {
                  router.push(`/images/${image._id}`);
                }}
                className="relative group"
              >
                <Image
                  width={800}
                  height={800}
                  priority
                  src={image.imageLinks.thumbnail || "/assets/placeholders/image.webp"}
                  alt={image.description}
                  className="object-cover w-full aspect-[1/1] transition-all duration-200 ease-linear opacity-50 blur-[4px] border border-primary-200"
                />
                <Image
                  width={800}
                  height={800}
                  src={image.imageLinks.thumbnail || "/assets/placeholders/image.webp"}
                  alt={image.description}
                  className="absolute inset-0 object-contain w-full aspect-[1/1] transition-all duration-200 ease-linear drop-shadow-md"
                />

                <div className="absolute inset-0">
                  <div className="flex justify-between mx-4 mt-4">
                    <div className="bg-white px-2 text-paragraph group-hover:opacity-0 bg-opacity-75 w-fit transition-all duration-200 ease-linear cursor-default">
                      <p>{image.imageAnalytics?.downloads} Downloads</p>
                    </div>
                    <Heart
                      size={28}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user) {
                          wishlist?.some((item) => item._id === image._id)
                            ? removeImageFromWishlist(image._id)
                            : addImageToWishlist(image._id);
                        } else {
                          toast.error(
                            "Please login as User to add to wishlist"
                          );
                        }
                      }}
                      className={` ${
                        wishlist?.some((item) => item._id === image._id)
                          ? "text-red-400 fill-red-500"
                          : "text-white group-hover:text-red-600"
                      }  transition-all duration-200 ease-linear cursor-pointer`}
                    />
                  </div>
                </div>
              </div>
              <div className="text-neutral-600 p-2">
                <h2 className="text-heading-05 font-semibold">
                  {image.title || "Untitled"}
                </h2>
                <Link
                  href={`/photographer/${image.photographer?._id}`}
                  className="font-medium"
                >
                  {image.photographer?.firstName
                    ? image.photographer?.firstName +
                      " " +
                      image.photographer?.lastName
                    : image.photographer?.name}
                </Link>
                <p className="font-medium text-surface-500">
                  {image.category?.name}
                </p>
                {/* <div className="flex flex-row gap-2 overflow-y-scroll no-scrollbar">
                  {image.keywords?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm sm:text-base md:text-heading-06 lg:text-paragraph font-medium text-surface-700 bg-primary-400 bg-opacity-15 rounded-lg px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div> */}
                {/* <h2 className="text-heading-06 font-medium">
                  {image.description}
                </h2> */}
                <div className="flex justify-between">
                  <p className="text-paragraph font-medium">
                    {image.resolutions?.original?.width}{" "}
                    <span className="font-bold">x</span>{" "}
                    {image.resolutions?.original?.height} px
                  </p>
                  <p className="text-paragraph font-bold">
                    ₹{image.price?.original}
                  </p>
                </div>
                <p className="text-paragraph font-medium">
                  (
                  {(
                    (image.resolutions?.original?.height *
                      image.resolutions?.original?.width) /
                    1000000
                  ).toFixed(1)}{" "}
                  MP)
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center items-center mt-10">
          {pageCount > page && (
            <div
              onClick={() => setPageSize((prev) => prev + 12)}
              className="flex items-center justify-center px-4 rounded-lg mb-10 py-4 bg-primary text-white font-semibold text-heading-06 uppercase cursor-pointer hover:bg-primary-dark transition-all duration-300 ease-in-out"
            >
              View More <ChevronDown size={24} className="ml-2" />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
