"use client";
import React from "react";
import Button from "../button";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function DiscoverMobile({ stories }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col text-center items-center justify-center gap-8 mb-10">
        <h1 className="font-bold text-heading-05 sm:text-heading-03 md:text-heading-02 text-accent-400">
          Every Photo Tells a Story—Discover It
        </h1>
        <Button
          size="lg"
          variant="filled"
          state="default"
          onClick={() => {
            toast.success("Explore More");
          }}
        >
          Explore More
        </Button>
      </div>
      <div className="flex flex-col">
        {stories.map((story, index) => (
          <div key={index} className="my-0 py-0">
            <Link
              href={`/story/${story._id}`}
              className="relative group overflow-hidden"
            >
              <Image
                width={300}
                height={200}
                src={story.media_url}
                alt={story.title || `Story ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 p-4 z-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <h2 className="font-bold text-heading-06 sm:text-heading-06 md:text-heading-06 text-white">
                  {story.title}
                </h2>
                <p className="text-paragraph text-white">{`${story.inspiredBy?.photographer?.firstName} ${story.inspiredBy?.photographer?.lastName}`}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
