import React from "react";
import BestSellingCard from "../cards/bestSellingCard";

export default function BestSelling() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center font-bold text-heading-05 sm:text-heading-03 md:text-heading-02 text-accent-400 mb-10">
        Hot Right Now: Best Selling Artworks!
      </h1>
      <div className="w-full">
        <BestSellingCard
          images={[
            {
              src1: "/assets/images/img3.jpg",
              src2: "/assets/images2/img1.jpg",
              title: "Artwork 1",
              artist: "Artist 1",
              downloadCount: 500,
            },
            {
              src1: "/assets/images/img4.jpg",
              src2: "/assets/images2/img2.jpg",
              title: "Artwork 2",
              artist: "Artist 2",
              downloadCount: 450,
            },
            {
              src1: "/assets/images/img5.jpg",
              src2: "/assets/images2/img3.jpg",
              title: "Artwork 3",
              artist: "Artist 3",
              downloadCount: 400,
            },
            {
              src1: "/assets/images/img6.jpg",
              src2: "/assets/images2/img1.jpg",
              title: "Artwork 4",
              artist: "Artist 4",
              downloadCount: 350,
            },
          ]}
        />
      </div>
    </div>
  );
}
