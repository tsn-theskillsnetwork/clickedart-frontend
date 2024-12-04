"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Search } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const images = [
  {
    title: "Artwork 1",
    artist: "Artist 1",
    src: "/assets/hero/bg2.jpg",
    theme: "nature",
    rating: 4,
    size: 100,
    price: 1000,
    downloadCount: 100,
    date: "2024-10-10",
  },
  {
    title: "Artwork 2",
    artist: "Artist 2",
    src: "/assets/hero/bg2.jpg",
    theme: "nature",
    rating: 3,
    size: 200,
    price: 2000,
    downloadCount: 200,
    date: "2024-10-11",
  },
  {
    title: "Artwork 2",
    artist: "Artist 2",
    src: "/assets/hero/bg2.jpg",
    theme: "nature",
    rating: 3,
    size: 200,
    price: 2000,
    downloadCount: 200,
    date: "2024-10-11",
  },
  {
    title: "Artwork 2",
    artist: "Artist 2",
    src: "/assets/hero/bg2.jpg",
    theme: "nature",
    rating: 3,
    size: 200,
    price: 2000,
    downloadCount: 200,
    date: "2024-10-11",
  },
  {
    title: "Artwork 3",
    artist: "Artist 3",
    src: "/assets/Hahnemuhle Photo Pearl 310 GSM.png",
    theme: "nature",
    rating: 5,
    size: 300,
    price: 1500,
    downloadCount: 300,
    date: "2024-10-12",
  },
  {
    title: "Artwork 4",
    artist: "Artist 4",
    src: "/assets/hero/bg2.jpg",
    theme: "nature",
    rating: 3,
    size: 400,
    price: 2400,
    downloadCount: 400,
    date: "2024-10-13",
  },
  {
    title: "Artwork 1",
    artist: "Artist 1",
    src: "/assets/hero/bg1.jpg",
    theme: "wildlife",
    rating: 3,
    size: 400,
    price: 2400,
    downloadCount: 400,
    date: "2024-10-13",
  },
  {
    title: "Artwork 2",
    artist: "Artist 2",
    src: "/assets/ST Cuthberts Mill-UK Somerset Photo Satin 300gsm.png",
    theme: "wildlife",
    rating: 3,
    size: 400,
    price: 2400,
    downloadCount: 400,
    date: "2024-10-13",
  },
  {
    title: "Artwork 3",
    artist: "Artist 3",
    src: "/assets/hero/bg1.jpg",
    theme: "wildlife",
    rating: 3,
    size: 400,
    price: 2400,
    downloadCount: 400,
    date: "2024-10-13",
  },
  {
    title: "Artwork 4",
    artist: "Artist 4",
    src: "/assets/ST Cuthberts Mill-UK Somerset Photo Satin 300gsm.png",
    theme: "wildlife",
    rating: 3,
    size: 400,
    price: 2400,
    downloadCount: 400,
    date: "2024-10-13",
  },
  {
    title: "Artwork 1",
    artist: "Artist 1",
    src: "/assets/VMS Luster Photo 240 Gsm  Paper.JPG",
    theme: "religious",
    rating: 3,
    size: 400,
    price: 2400,
    downloadCount: 400,
    date: "2024-10-13",
  },
  {
    title: "Artwork 2",
    artist: "Artist 2",
    src: "/assets/VMS Luster Photo 240 Gsm  Paper.JPG",
    theme: "religious",
    rating: 3,
    size: 400,
    price: 2400,
    downloadCount: 400,
    date: "2024-10-13",
  },
  {
    title: "Artwork 3",
    artist: "Artist 3",
    src: "/assets/VMS Luster Photo 240 Gsm  Paper.JPG",
    theme: "religious",
    rating: 3,
    size: 400,
    price: 2400,
    downloadCount: 400,
    date: "2024-10-13",
  },
  {
    title: "Artwork 4",
    artist: "Artist 4",
    src: "/assets/VMS Luster Photo 240 Gsm  Paper.JPG",
    theme: "religious",
    rating: 3,
    size: 400,
    price: 2400,
    downloadCount: 400,
    date: "2024-10-13",
  },
];

export default function ThemesResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // const { theme } = useParams();

  // const themeValue = searchParams.get("theme") || "nature";
  const sortValue = searchParams.get("sort") || "date";
  const themeValue = searchParams.get("theme") || "all";
  const searchValue = searchParams.get("search") || "";

  const [filter, setFilter] = useState("price");
  const [theme, setTheme] = useState(themeValue);
  const [sort, setSort] = useState(sortValue);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleSearch = () => {
    router.push(`/images?theme=${theme}&sort=${sort}&search=${search}`);
  };

  useEffect(() => {
    setSort(sortValue);
    setTheme(themeValue);
    setSearch(searchValue);
  }, [themeValue, sortValue, searchValue]);

  const sortedImages = [...images]
    .filter((image) => {
      if (theme === "all") return true;
      return image.theme === theme;
    })
    .filter((image) => {
      if (!searchValue) return true;
      return image.title.toLowerCase().includes(searchValue.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "popularity") return b.downloadCount - a.downloadCount;
      return new Date(b.date) - new Date(a.date);
    });

  const totalItems = sortedImages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedImages = sortedImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                  `/images?theme=${value}&sort=${sort}&search=${search}`
                );
              }}
            >
              <SelectTrigger className="!text-paragraph py-5 w-full sm:w-40 font-semibold shadow-sm bg-gray-200">
                <SelectValue />
                <p className="sr-only">Themes</p>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="wildlife">Wildlife</SelectItem>
                <SelectItem value="religious">Religious</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="grayscale">Grayscale</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="pl-5 relative flex flex-row bg-white border border-primary-200 text-black group rounded-lg items-center gap-4 w-full focus-within:outline focus-within:outline-blue-500">
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
              {/* <p className="sr-only">Search</p> */}
              <div className="h-full aspect-[1/1] flex justify-center items-center">
                <Search size={40} className="mx-auto" />
              </div>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col">
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
            </div>
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
                    `/images?theme=${theme}&sort=${value}&search=${search}`
                  );
                }}
              >
                <SelectTrigger className="!text-paragraph w-full sm:w-40 py-5 font-semibold shadow-sm bg-gray-200">
                  <SelectValue />
                  <p className="sr-only">Sort by</p>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-20 px-10 sm:px-10 md:px-10 lg:px-20 xl:px-44">
          {paginatedImages.map((image, index) => (
            <div key={index}>
              <div className="relative group">
                <Image
                  width={400}
                  height={400}
                  src={image.src}
                  alt={image.title}
                  className="object-cover w-full aspect-[1/1] opacity-100 group-hover:opacity-0 transition-all duration-200 ease-linear"
                />
                <Image
                  width={800}
                  height={800}
                  src={image.src}
                  alt={image.title}
                  className="absolute inset-0 object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear"
                />
                <div className="absolute inset-0">
                  <div className="flex justify-between mx-4 mt-4">
                    <div className="bg-white px-2 text-paragraph group-hover:opacity-0 bg-opacity-75 w-fit transition-all duration-200 ease-linear cursor-default">
                      <p>{image.downloadCount} Downloads</p>
                    </div>
                    <Heart
                      size={28}
                      className="text-white group-hover:text-zinc-400 transition-all duration-200 ease-linear"
                    />
                  </div>
                </div>
              </div>
              <div className="text-neutral-600">
                <h2 className="text-heading-06 font-bold">{image.title}</h2>
                <p className="text-paragraph">{image.artist}</p>
                <p className="text-paragraph">{image.size} MP</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-10">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-4 py-2 rounded-full ${
                currentPage === index + 1
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black"
              } rounded`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
