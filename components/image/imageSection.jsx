import Image from "next/image";
import React from "react";

export default function ImageSection({ selectedFrame, image }) {
  return (
    <div
      className={`relative flex h-full w-full ${
        selectedFrame ? "p-[2px] sm:p-1" : "p-0"
      } bg-white transition-all  duration-300 ease-in-out`}
    >
      <div className="relative w-full h-full  inner-shadow-3 z-10">
        <img
          src={
            image.imageLinks?.thumbnail ||
            image.imageLinks?.small ||
            image.imageLinks?.medium ||
            image.imageLinks?.original ||
            "/assets/images/img3.jpg"
          }
          alt={image.title || "Image"}
          className="z-0 object-cover h-full w-full  mx-auto"
        />
      </div>
      {selectedFrame && (
        <img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute z-10 inset-0 w-full h-full"
          src={selectedFrame.image}
          alt={selectedFrame.name}
        />
      )}
    </div>
  );
}
