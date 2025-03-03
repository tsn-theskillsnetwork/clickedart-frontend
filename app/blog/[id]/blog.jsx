"use client";

import Button from "@/components/button";
import Button2 from "@/components/button2";
import Loader from "@/components/loader";
import { Skeleton } from "@/components/ui/skeleton";
import { Share } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function BlogPageComponent({ blog }) {
  const pathname = usePathname();
  const [imageLoading, setImageLoading] = useState(true);

  const handleShare = async () => {
    const currentUrl = window.location.origin + pathname;

    try {
      await window.navigator.share({
        title: blog.title,
        text: blog.description,
        url: currentUrl,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Effect hook to handle initial image loading state
  useEffect(() => {
    const img = new Image();
    img.src = blog.coverImage || "/assets/placeholders/image.webp";
    img.onload = () => setImageLoading(false);
  }, [blog.coverImage]);

  return (
    <>
      {blog ? (
        <div className="min-h-screen mb-10 mt-5">
          <div className="flex flex-col sm:flex-row justify-center">
            <div className="flex flex-col gap-4 sm:w-8/12 px-4">
              <div className="flex flex-col">
                <h2 className="text-heading-06 sm:text-heading-05 md:text-heading-04 lg:text-heading-03 text-primary font-bold">
                  {blog.content.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base md:text-paragraph text-primary font-medium">
                  {blog.content.summary}
                </p>
              </div>
              {/* Image with loading state */}
              <div className="relative w-4/5 mx-auto">
                {imageLoading && (
                  <div className="absolute inset-0 flex justify-start items-center">
                    <Skeleton className="w-4/5 h-full" />
                  </div>
                )}
                <img
                  src={blog.coverImage || "/assets/placeholders/image.webp"}
                  alt="placeholder"
                  width={600}
                  height={400}
                  className={`border-8 border-white shadow-md shadow-zinc-500 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  } transition-opacity duration-500`}
                  onLoad={() => setImageLoading(false)}
                />
              </div>
              <div
                className="prose max-w-full"
                dangerouslySetInnerHTML={{
                  __html: blog.content.body,
                }}
              />
            </div>

            <div className="flex flex-col mt-4 sm:mt-0 sm:w-1/5 px-4">
              <div className="flex flex-col gap-4 sm:pt-28">
                <h5 className="text-heading-05 text-primary font-bold">
                  {blog.authorInfo?.authorType === "Photographer" ? (
                    <Link
                      href={`/photographer/${blog.authorInfo?.author?._id}`}
                      passHref
                    >
                      {`${blog.authorInfo?.author?.firstName || ""} ${
                        blog.authorInfo?.author?.lastName || ""
                      }`}
                    </Link>
                  ) : (
                    "Admin"
                  )}
                </h5>
                <p className="text-justify capitalize">
                  Type:{" "}
                  {blog.blogType === "successstory" ? "Success Story" : "Blog"}
                </p>
              </div>

              {blog.blogType === "successstory" && (
                <div className="flex flex-col gap-2 py-4">
                  <h5 className="text-heading-05 text-primary font-bold">
                    Photographer Details
                  </h5>
                  <div className="flex flex-row sm:flex-col xl:flex-row items-center gap-4">
                    <img
                      src={blog.photographer?.profileImage}
                      alt="Photographer"
                      className="rounded-full"
                      width={100}
                      height={100}
                    />
                    <div>
                      <h5 className="text-heading-06 text-primary font-bold">
                        {blog.photographer?.firstName}{" "}
                        {blog.photographer?.lastName}
                      </h5>
                      <p className="text-paragraph text-primary font-medium">
                        Achievements: {blog.achievements.join(", ")}
                      </p>
                    </div>
                  </div>
                  <Link href={`/photographer/${blog.photographer?._id}`}>
                    <Button2 size="base" variant="filled">
                      View Profile
                    </Button2>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:w-4/5 mx-auto px-4 mt-5 justify-start items-start">
            <div className="flex flex-row gap-4 py-4">
              <Button
                onClick={handleShare}
                icon={<Share size={16} />}
                variant="filled"
                size="base"
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
    </>
  );
}
