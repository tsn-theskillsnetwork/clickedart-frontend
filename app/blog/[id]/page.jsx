"use client";

import Button from "@/components/button";
import Loader from "@/components/loader";
import { fetchData } from "@/helpers/api";
import { Icon } from "@iconify/react";
import axios from "axios";
import {
  Link2,
  MessageSquare,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function BlogPage() {
  const { id } = useParams();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/blog/get-blog-by-id?id=${id}`
      );
      setBlog(response.data.blog);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleShare = async () => {
    const currentUrl = window.location.origin + pathname;

    try {
      await window.navigator.share({
        title: blog.title,
        text: blog.description,
        url: currentUrl,
      });
      console.log("Share successful");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <>
      {blog ? (
        <div className="min-h-screen mb-10 mt-5">
          <div className="flex flex-col sm:flex-row justify-center">
            <div className="flex flex-col gap-4 sm:w-3/5 px-4">
              <div className="flex flex-col">
                <h2 className="text-heading-02 text-primary font-bold">
                  {blog.content.title}
                </h2>
                <p className="text-paragraph text-primary font-medium">
                  {blog.content.summary}
                </p>
              </div>
              <img
                src={blog.coverImage}
                className="w-4/5 border-8 border-white shadow-md shadow-zinc-500 mx-auto"
                alt="placeholder"
              />
              <div className="prose max-w-full space-y-0"
                dangerouslySetInnerHTML={{
                  __html: blog.content.body,
                }}
              />
              {/* <p className="text-lg text-justify">{blog.content.body}</p> */}
            </div>
            <div className="flex flex-col mt-4 sm:mt-0 sm:w-1/5 px-4">
              <div className="flex flex-col gap-4 sm:pt-28">
                <h5 className="text-heading-05 text-primary font-bold">
                  {blog.authorInfo?.author?.name}
                </h5>
                <div className="flex flex-row items-center gap-2">
                  <p className="font-semibold text-md text-primary">
                    {blog.authorInfo?.authorType}
                  </p>
                </div>
                <p className="text-justify">Type: {blog.type}</p>
              </div>
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
          {loading ? <Loader /> : <p>No Story Found</p>}
        </div>
      )}
    </>
  );
}
