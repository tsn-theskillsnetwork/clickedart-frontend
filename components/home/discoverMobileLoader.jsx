"use client";
import React from "react";
import Button from "../button";
import Image from "next/image";
import Link from "next/link";

export default function DiscoverMobileLoader() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        {[...Array(4).keys()].map((index) => (
          <div key={index} className="my-0 py-0">
            <div className="relative group overflow-hidden">
              <div className="w-full h-40 object-cover bg-zinc-300 animate-pulse"></div>
              <div className="absolute inset-0 flex flex-col justify-between p-4 transition-all duration-200 ease-linear">
                <div className="flex justify-between items-center w-full"></div>
                <div className="flex justify-between items-center w-full">
                  <div className="bg-gray-300 w-[80%] h-4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center justify-center mt-2">
        <Link href="/story">
          <Button variant="filled" state="default">
            View all Stories
          </Button>
        </Link>
      </div>
    </div>
  );
}
