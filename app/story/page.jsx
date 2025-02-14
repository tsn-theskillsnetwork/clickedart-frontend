"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchData } from "@/helpers/api";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function BlogPage() {
  const [blogLength, setBlogLength] = useState(6);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(`story/get-all-story`, "stories", setStories, setLoading);
  }, []);

  return (
    <div className="flex flex-col px-4 lg:px-20">
      <div className="relative flex flex-col my-5 sm:my-10 rounded-2xl overflow-hidden">
        <Image
          src="/assets/banners/story-page.png"
          className="absolute inset-0 w-full h-full z-0 object-cover object-bottom"
          alt="Blog"
          width={1800}
          height={1400}
        />
        <div className="bg-black opacity-10 absolute inset-0 z-0"></div>
        <div className="flex flex-col gap-2 my-20 items-center z-10 text-white">
          <h1 className="text-center z-10 text-shadow-dark text-white text-heading-04 sm:text-heading-03 md:text-heading-02 lg:text-heading-01 font-bold">
            Beyond the Click
          </h1>
          <p className="text-center z-10 text-shadow-dark text-white text-paragraph sm:text-heading-06 md:text-heading-05 lg:text-heading-04 font-semibold">
            Where Every Image Speaks a Thousand Words
          </p>
        </div>
      </div>
      <h2 className="text-heading-04 sm:text-heading-03 lg:text-heading-02 font-bold mb-5">
        Stories
      </h2>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 mb-20">
          {[...Array(blogLength)].map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <Skeleton className="w-full aspect-[16/9] rounded-lg" />
              <div className="flex flex-col gap-4">
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-1/4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 mb-20">
        {stories.slice(0, blogLength).map((post, index) => (
          <Link
            key={index}
            href={`/story/${post._id}`}
            className="flex flex-col gap-4"
          >
            <Image
              src={post.media_url || "/assets/placeholders/profile.jpg"}
              alt={post.title || "Blog Post"}
              width={600}
              height={400}
              className="w-full aspect-[16/9] rounded-lg object-cover"
            />
            <div className="flex flex-col gap-2">
              <h5 className="text-heading-sm sm:text-base lg:text-heading-06 font-semibold">
                {post.title}
              </h5>
              <div className="flex items-center gap-2">
                <div className="flex gap-2 text-xs md:text-sm text-surface-500">
                  <p className="font-bold border-r-2 border-[#7777778f] pr-2">
                    {post.inspiredBy?.photographer?.firstName}{" "}
                    {post.inspiredBy?.photographer?.lastName}
                  </p>
                  <p className="">
                    {" "}
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mb-10">
        {stories < stories.length && (
          <button
            onClick={() => setBlogLength(stories + 3)}
            className="bg-white text-primary font-semibold border-2 border-primary px-8 py-2 rounded-md hover:bg-primary hover:text-white transition-all duration-200"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
