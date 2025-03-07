import React, { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { Heart } from "lucide-react";

export default function ImagesLoader() {
  const [aspects, setAspects] = useState([]);

  useEffect(() => {
    setAspects(
      [...Array(9)].map(() =>
        Math.random() < 0.7 ? "aspect-[4/3]" : "aspect-[3/4]"
      )
    );
  }, []);

  return (
    <div className="sm:columns-2 lg:columns-3 gap-2 mt-10 px-4 sm:px-10 md:px-10 lg:px-20">
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          className="relative w-full mb-2 shadow-[0px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden transition-all duration-200 ease-out"
        >
          <Skeleton
            className={`w-full ${aspects[index] || "aspect-[4/3]"} rounded-lg`}
          />
          <div className="flex flex-col gap-4 absolute inset-0 justify-between py-2 px-4 transition-all duration-200 ease-linear">
            <div className="flex justify-between items-center">
              <div className="w-[80%] h-4 bg-white/80 rounded-md animate-pulse" />
              <div className="flex gap-2">
                <Heart
                  size={24}
                  className="text-white transition-all duration-200 ease-linear cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
