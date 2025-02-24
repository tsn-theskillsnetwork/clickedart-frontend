import { Icon } from "@iconify/react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ImageSearch({ performSearch }) {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search") || "";
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    router.push(`/search?search=${search}`);
  };

  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (performSearch) {
      handleSearch();
    }
  }, [performSearch]);

  return (
    <div className="mt-4 flex flex-row bg-white text-black shadow-[0_0_8px_rgba(0,0,0,0.4)] px-5 group rounded-lg items-center gap-2 w-full focus-within:outline focus-within:outline-blue-500 mx-auto">
      <div className="h-full aspect-[1/1] flex justify-center items-center shrink-0">
        <Search size={30} color="black" className="mx-auto" />
      </div>
      <input
        type="text"
        placeholder={`Search for Images`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="py-3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold w-full focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="h-full text-black rounded-r-lg flex justify-center items-center shrink-0"
      >
        <p className="sr-only">Search</p>
        <Icon
          icon="mdi:image-search"
          className="mx-auto"
          style={{ fontSize: "2rem" }}
        />
      </button>
    </div>
  );
}
