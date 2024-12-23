"use client";
import React from "react";

export default function ProductCard({
  image,
  alt,
  name,
  digitalPrice,
  canvasPrice,
  photographer,
}) {
  return (
    <div className="flex flex-col w-full sm:w-1/4 bg-white rounded-lg shadow-md group shadow-zinc-400 transition-all duration-100 ease-out">
      <div className="w-full h-52  overflow-hidden rounded-t-lg transition-all duration-100 ease-out p-2">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover transition-all duration-100 ease-out rounded-lg drop-shadow-md"
        />
      </div>

      <div className="px-5 mb-4">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col">
            <h2 className="text-3xl">{name}</h2>
            <p className="text-sm text-slate-600">{photographer}</p>
          </div>
          <div className="flex flex-col items-end justify-start">
            <p className="text-md text-slate-700 font-extralight">
              Digital: ₹{digitalPrice}
            </p>
            <p className="text-md text-slate-700 font-extralight">
              Canvas: ₹{canvasPrice}
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-600 px-4 py-2 mt-2 rounded-lg hover:shadow-md transition-all duration-200 ease-out active:scale-95">
            Buy Now
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-slate-600 px-4 py-2 mt-2 rounded-lg hover:shadow-md transition-all duration-200 ease-out active:scale-95">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
