"use client";
import React from "react";
import Button from "../button";
import Image from "next/image";
import Link from "next/link";

export default function DiscoverMobile({ stories }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        {stories.slice(0, 4).map((story, index) => (
          <div key={index} className="my-0 py-0">
            <Link
              href={`/story/${story._id}`}
              className="relative group overflow-hidden"
            >
              <Image
                width={300}
                height={200}
                quality={50}
                priority
                src={story.media_url}
                alt={story.title || `Story ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-between p-4 transition-all duration-200 ease-linear">
                <div className="flex justify-between items-center"></div>
                <div className="flex justify-between items-center">
                  <p
                    style={{
                      textShadow: "-1px 1px 2px #333, 1px 1px 2px #333",
                    }}
                    className="text-white font-medium text-xs"
                  >
                    {story.title}
                  </p>
                </div>
              </div>
              {/* <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 p-4 z-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <h2 className="font-bold text-heading-06 sm:text-heading-06 md:text-heading-06 text-white">
                  {story.title}
                </h2>
                <p className="text-paragraph text-white">{`${story.inspiredBy?.photographer?.firstName} ${story.inspiredBy?.photographer?.lastName}`}</p>
              </div> */}
            </Link>
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
