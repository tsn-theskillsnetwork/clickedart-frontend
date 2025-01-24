import React, { useEffect, useState } from "react";
import BestSellingCard from "../cards/bestSellingCard";

export default function BestSelling() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/images/best-seller-photos`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setImages(data.bestSellers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center font-bold text-heading-05 sm:text-heading-03 md:text-heading-02 text-accent-400 mb-10">
        Hot Right Now: Best Selling Artworks!
      </h1>
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-20">
        <BestSellingCard images={images} />
      </div>
    </div>
  );
}
