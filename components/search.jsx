"use client"

import { Icon } from "@iconify/react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ImageSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    router.push(`/search?search=${search}`);
  };
  return (
    <div className="flex w-full rounded-lg overflow-hidden">
      <input
        type="text"
        placeholder="Search for images"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="active:border-none bg-gray-200 active:outline-none focus:outline-none focus:border-none py-4 px-5 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold  w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-accent-200 h-full aspect-[1/1] text-white rounded-r-lg relative"
      >
        <p className="sr-only">Search</p>
        <Icon
          icon="mdi:image-search"
          className="mx-auto"
          style={{ fontSize: "2.5rem" }}
        />
      </button>
    </div>
  );
}
