"use client";

import { fetchData } from "@/helpers/api";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function BlogPage() {
  const [blogLength, setBlogLength] = useState(6);
  const [blogPosts, setBlogPosts] = useState([]);
  const [successStories, setSuccessStories] = useState([]);

  console.log(blogPosts);
  console.log(successStories);

  useEffect(() => {
    fetchData(
      `${process.env.NEXT_PUBLIC_SERVER}/api/blog/get-all-blogs`,
      "blogs",
      setBlogPosts,
      null,
      null
    );
    fetchData(
      `${process.env.NEXT_PUBLIC_SERVER}/api/blog/get-all-success-stories`,
      "successstories",
      setSuccessStories,
      null,
      null
    );
  }, []);

  return (
    <div className="flex flex-col px-4 lg:px-20">
      <div className="relative flex flex-col my-5 sm:my-10 md:my-16 xl:my-20 rounded-2xl overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/11061325/pexels-photo-11061325.jpeg"
          className="absolute inset-0 w-full h-full z-0 object-cover"
          alt="Blog"
          width={1800}
          height={1400}
        />
        <div className="bg-[#14162466] bg-opacity-30 absolute inset-0 z-0"></div>
        <div className="flex flex-col gap-2 mt-10 md:mt-20 xl:mt-40 mb-10 md:mb-20 xl:mb-40 items-center z-10 text-white">
          <h1 className="text-center z-10 text-white text-heading-04 sm:text-heading-03 md:text-heading-02 lg:text-heading-01 font-bold">
            From Ideas to Masterpieces
          </h1>
          <p className="text-center z-10 text-white text-paragraph sm:text-heading-06 md:text-heading-05 lg:text-heading-04 font-semibold">
            Inspiration, tips, and stories to bring your creative vision to
            life.
          </p>
        </div>
      </div>
      {successStories?.length > 0 && (
        <>
          <hr className="mb-5 border border-primary-100" />
          <h2 className="text-heading-04 sm:text-heading-03 lg:text-heading-02 font-bold mb-5">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 mb-20">
            {successStories.slice(0, blogLength).map((post, index) => (
              <div key={index} className="flex flex-col gap-4">
                <Link
                  className="flex flex-col gap-4"
                  href={`/blog/${post._id}`}
                  passHref
                >
                  <Image
                    src={post.coverImage[0] || "/assets/placeholders/profile.jpg"}
                    alt={post.content.title || "Blog Post"}
                    width={600}
                    height={400}
                    className="w-full aspect-[16/9] rounded-lg object-cover"
                  />
                  <h5 className="text-heading-06 sm:text-heading-05 lg:text-heading-04 font-semibold">
                    {post.content.title}
                  </h5>
                </Link>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2 text-sm md:text-base text-surface-500">
                      <p className="font-bold border-r-2 border-[#7777778f] pr-2">
                        {post.authorInfo?.authorType === "Photographer" ? (
                          <Link
                            href={`/photographer/${post.authorInfo?.author?._id}`}
                            passHref
                          >
                            {`${post.authorInfo?.author?.firstName || ""} ${
                              post.authorInfo?.author?.lastName || ""
                            }`}
                          </Link>
                        ) : (
                          "Admin"
                        )}
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
                  <p className="text-sm sm:text-base md:text-heading-06 lg:text-paragraph font-medium text-surface-600 truncate">
                    {post.content.summary}
                  </p>
                  <div className="flex gap-2 flex-wrap items-center">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-sm sm:text-base md:text-heading-06 lg:text-paragraph font-medium text-surface-700 bg-primary-400 bg-opacity-15 rounded-lg px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 font-semibold">
                      {post.tags.length > 3 && `+${post.tags.length - 3} more`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <hr className="mb-5 border border-primary-100" />
      <h2 className="text-heading-04 sm:text-heading-03 lg:text-heading-02 font-bold mb-5">
        Blogs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 mb-20">
        {blogPosts.slice(0, blogLength).map((post, index) => (
          <div
            key={index}
            href={`/blog/${post._id}`}
            className="flex flex-col gap-4"
          >
            <Link
              className="flex flex-col gap-4"
              href={`/blog/${post._id}`}
              passHref
            >
              <Image
                src={post.coverImage[0] || "/assets/placeholders/profile.jpg"}
                alt={post.content.title || "Blog Post"}
                width={600}
                height={400}
                className="w-full aspect-[16/9] rounded-lg object-cover"
              />

              <h5 className="text-heading-06 sm:text-heading-05 lg:text-heading-04 font-semibold">
                {post.content.title}
              </h5>
            </Link>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-2 text-sm md:text-base text-surface-500">
                  <p className="font-bold border-r-2 border-[#7777778f] pr-2">
                    {post.authorInfo?.authorType === "Photographer" ? (
                      <Link
                        href={`/photographer/${post.authorInfo?.author?._id}`}
                        passHref
                      >
                        {`${post.authorInfo?.author?.firstName || ""} ${
                          post.authorInfo?.author?.lastName || ""
                        }`}
                      </Link>
                    ) : (
                      "Admin"
                    )}
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
              <p className="text-sm sm:text-base md:text-heading-06 lg:text-paragraph font-medium text-surface-600 truncate">
                {post.content.summary}
              </p>
              <div className="flex gap-2 flex-wrap items-center">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm sm:text-base md:text-heading-06 lg:text-paragraph font-medium text-surface-700 bg-primary-400 bg-opacity-15 rounded-lg px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-sm text-gray-600 font-semibold">
                  {post.tags.length > 3 && `+${post.tags.length - 3} more`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-10">
        {blogLength < blogPosts.length && (
          <button
            onClick={() => setBlogLength(blogLength + 3)}
            className="bg-white text-primary font-semibold border-2 border-primary px-8 py-2 rounded-md hover:bg-primary hover:text-white transition-all duration-200"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
