"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Button from "../button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DiscoverLoader() {
  return (
    <div className="flex flex-col relative gap-2">
      {/* Header Section */}

      {/* Slider Section */}
      <div className="w-11/12 mx-auto grid grid-cols-5">
        {[...Array(5).keys()].map((index) => (
          <div key={index} className="py-4">
            <div className="relative">
              {/* Image */}
              <div className={`w-full h-[500px] ${index % 2 === 0 ? "bg-zinc-300" : "bg-zinc-400"} animate-pulse`}></div>
              {/* Text */}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center justify-center gap-8 -mt-1.5 mb-10">
        <h1 className="font-bold text-heading-06 sm:text-heading-05 md:text-heading-04 text-primary">
          Every Photo Tells a Story—Discover It
        </h1>
        <Link href="/story">
          <Button variant="filled" state="default">
            Explore More
          </Button>
        </Link>
      </div>
    </div>
  );
}
