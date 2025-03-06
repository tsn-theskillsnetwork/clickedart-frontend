"use client";

import { fetchData } from "@/helpers/api";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function BlogPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const [pageCount, setPageCount] = useState(1);
  const [storyPageCount, setStoryPageCount] = useState(1);
  const [storyPageSize, setStoryPageSize] = useState(4);
  const [blogPosts, setBlogPosts] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/blog/get-all-blogs?pageNumber=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setBlogPosts(data.blogs);
        setPageCount(data.pageCount);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [page]);

  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/blog/get-all-success-stories?pageSize=${storyPageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setSuccessStories(data.successStories);
        setStoryPageCount(data.pageCount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSuccessStories();
  }, [storyPageSize]);

  return (
    <div className="flex flex-col px-4 lg:px-20">
      <div className="relative flex flex-col my-5 sm:my-10 rounded-2xl overflow-hidden">
        <Image
          src={
            "/assets/banners/blog-page.png" || "/assets/placeholders/image.webp"
          }
          className="absolute inset-0 w-full h-full z-0 object-cover"
          alt="Blog"
          fill
          quality={75}
          priority
        />
        <div className="bg-[#14162466] opacity-20 absolute inset-0 z-0"></div>
        <div className="flex flex-col gap-2 my-10 items-center z-10 text-white">
          <h1 className="text-center text-shadow-dark z-10 text-white text-heading-04 sm:text-heading-03 md:text-heading-02 lg:text-heading-01 font-bold">
            From Ideas to Masterpieces
          </h1>
          <p className="text-center text-shadow-dark z-10 text-white text-paragraph sm:text-heading-06 md:text-heading-05 lg:text-heading-04 font-semibold">
            Inspiration, tips, and stories to bring your creative vision to
            life.
          </p>
        </div>
      </div>
      {loading ? (
        <>
          <hr className="mb-5 border border-primary-100" />
          <h2 className="text-heading-04 sm:text-heading-03 lg:text-heading-02 font-bold mb-5">
            <Skeleton className="h-12 w-[200px] mt-5" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 mb-20">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="flex flex-col gap-4">
                <Skeleton className="w-full aspect-[16/9] rounded-lg object-cover" />
                <Skeleton className="text-heading-06 sm:text-heading-05 lg:text-heading-04 font-semibold" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-full h-6 -mt-2" />
                  <Skeleton className="w-full h-6" />
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 flex-wrap items-center">
                    {[1, 2, 3].map((_, index) => (
                      <Skeleton
                        key={index}
                        className="text-sm sm:text-base md:text-heading-06 lg:text-paragraph font-medium text-surface-700 bg-primary-400 bg-opacity-15 rounded-lg px-2 py-1"
                      />
                    ))}
                    <Skeleton className="text-sm text-gray-600 font-semibold" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {successStories?.length > 0 && (
            <>
              <hr className="mb-5 border border-primary-100" />
              <h2 className="text-heading-04 sm:text-heading-03 lg:text-heading-02 font-bold mb-5">
                Success Stories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 mb-20">
                {successStories.map((post, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <Link
                      className="flex flex-col gap-4"
                      href={`/blog/${post._id}`}
                      passHref
                    >
                      <Image
                        src={
                          post.coverImage[0] ||
                          "/assets/placeholders/profile.jpg"
                        }
                        alt={post.content.title || "Blog Post"}
                        width={320}
                        height={180}
                        quality={80}
                        className="w-full aspect-[16/9] rounded-lg object-cover"
                      />
                      <h5 className="text-heading-sm sm:text-base lg:text-heading-06 font-semibold line-clamp-2">
                        {post.content.title}
                      </h5>
                    </Link>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-2 text-sm md:text-base text-surface-500">
                          <p className="font-bold text-sm border-r-2 border-[#7777778f] pr-2">
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
                          <p className="text-sm">
                            {" "}
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm lg:text-base font-medium text-surface-600 line-clamp-2">
                        {post.content.summary}
                      </p>
                      {/* <div className="flex gap-2 flex-wrap items-center">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs sm:text-sm lg:text-base font-medium text-surface-700 bg-primary-400 bg-opacity-15 rounded-lg px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-xs text-gray-600 font-semibold">
                          {post.tags.length > 3 &&
                            `+${post.tags.length - 3} more`}
                        </span>
                      </div> */}
                    </div>
                  </div>
                ))}
                <div className="w-full flex justify-center items-center mt-10">
                  {storyPageCount > 1 && (
                    <div
                      onClick={() => setStoryPageSize((prev) => prev + 4)}
                      className="flex items-center justify-center px-4 rounded-lg mb-10 py-4 bg-primary text-white font-semibold text-heading-06 uppercase cursor-pointer hover:bg-primary-dark transition-all duration-300 ease-in-out"
                    >
                      View More <ChevronDown size={24} className="ml-2" />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          <hr className="mb-5 border border-primary-100" />
          <h2 className="text-heading-04 sm:text-heading-03 lg:text-heading-02 font-bold mb-5">
            Blogs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 mb-20">
            {blogPosts.map((post, index) => (
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
                    src={
                      post.coverImage[0] || "/assets/placeholders/profile.jpg"
                    }
                    alt={post.content.title || "Blog Post"}
                    width={320}
                    height={180}
                    quality={80}
                    className="w-full aspect-[16/9] rounded-lg object-cover"
                  />

                  <h5 className="text-heading-sm sm:text-base lg:text-heading-06 font-semibold line-clamp-2">
                    {post.content.title}
                  </h5>
                </Link>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2 text-sm md:text-base text-surface-500">
                      <p className="font-bold text-sm border-r-2 border-[#7777778f] pr-2">
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
                      <p className="text-sm">
                        {" "}
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base font-medium text-surface-600 line-clamp-2">
                    {post.content.summary}
                  </p>
                  {/* <div className="flex gap-2 flex-wrap items-center">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs sm:text-sm lg:text-base font-medium text-surface-700 bg-primary-400 bg-opacity-15 rounded-lg px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-gray-600 font-semibold">
                      {post.tags.length > 3 && `+${post.tags.length - 3} more`}
                    </span>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center items-center mt-10 mb-5">
            {[...Array(pageCount).keys()].map((index) => (
              <Link
                href={`/blog?page=${index + 1}`}
                key={index}
                className={`${
                  index + 1 === parseInt(page)
                    ? "bg-primary text-white"
                    : "bg-secondary-100 text-white"
                } px-4 py-2 mx-2 rounded-lg cursor-pointer`}
              >
                {index + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
