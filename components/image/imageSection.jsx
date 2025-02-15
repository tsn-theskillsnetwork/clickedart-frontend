import Image from "next/image";
import React from "react";

export default function ImageSection({ selectedFrame, image }) {
  console.log(image);
  return (
    <div
      className={`relative flex h-full w-full ${
        selectedFrame ? "p-[2px] sm:p-1" : "p-0"
      } bg-white transition-all  duration-300 ease-in-out`}
    >
      <div className="relative w-full h-full  inner-shadow-3 z-10">
        <Image
          priority
          quality={30}
          width={800}
          height={800}
          src={image.imageLinks?.thumbnail || "/assets/images/img3.jpg"}
          alt={image.title || "Image"}
          className="z-0 object-cover h-full w-full  mx-auto"
        />
      </div>
      {selectedFrame && (
        // <img
        //   className="absolute z-10 inset-0 h-full w-2"
        //   src={selectedFrame.image[0]}
        //   alt={selectedFrame.name}
        // />
        <>
          <Image
            priority
            width={800}
            height={800}
            className="absolute object-cover z-10 inset-0 h-full w-2"
            src={selectedFrame.image[0]}
            alt={selectedFrame.name}
          />
          <Image
            priority
            width={800}
            height={800}
            className="absolute object-cover z-10 rotate-180 right-0 inset-y-0 h-full w-2"
            src={selectedFrame.image[0]}
            alt={selectedFrame.name}
          />
          <Image
            priority
            width={800}
            height={800}
            className="absolute object-cover z-20 inset-0 w-full h-2"
            src={selectedFrame.image[1]}
            alt={selectedFrame.name}
          />
          <Image
            priority
            width={800}
            height={800}
            className="absolute object-cover z-20 rotate-180 bottom-0 inset-x-0 w-full h-2"
            src={selectedFrame.image[1]}
            alt={selectedFrame.name}
          />
        </>
      )}
    </div>
  );
}
