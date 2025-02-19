"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import useAuthStore from "@/authStore";
import Loader from "@/components/loader";
import Swal from "sweetalert2";
import Button2 from "@/components/button2";

export default function PhotographerBlogs() {
  const { photographer, isHydrated } = useAuthStore();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/blog/get-my-blogs?author=${photographer._id}`
        );
        const data = response.data;

        setBlogs(data.blogs);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (photographer) {
      fetchBlogs();
    }
  }, [photographer]);

  return (
    <div className="p-4 min-h-screen">
      {photographer ? (
        <div className="">
          {/* <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Create Blog
          </h1> */}
          <div className="flex flex-col flex-1 gap-4 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Blogs</h2>
              <Link href="/profile/blog/create">
                <Button2 size="sm">Create Blog</Button2>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader />
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <h1 className="text-xl text-gray-500">No blogs found</h1>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Link
                    href={`/profile/blog/edit/${blog._id}`}
                    key={blog._id}
                    className="flex flex-col justify-between gap-4 p-4 bg-white rounded-lg shadow-md"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Blog Image */}
                      <img
                        src={blog.coverImage}
                        alt={blog.content.title}
                        className="w-full aspect-[16/9] object-cover rounded-lg"
                      />

                      {/* Blog Details */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 font-semibold">
                          {blog.tags.length > 3 &&
                            `+${blog.tags.length - 3} more`}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold">
                        {blog.content.title}
                      </h2>
                      <p className="text-sm text-gray-700 truncate">
                        {blog.content.summary}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Action Buttons */}
                    {/* <div className="flex items-center justify-between mt-4">
                      <Link href={`/blog/${blog._id}`}>
                        <Button2 size="sm">Read More</Button2>
                      </Link>
                      <div className="flex gap-2">
                        <Link href={`/profile/blog/edit/${blog._id}`}>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          className="flex items-center gap-2"
                          onClick={() => handleDelete(blog._id)}
                        >
                          <Trash size={16} />
                          Delete
                        </Button>
                      </div>
                    </div> */}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          {isHydrated ? (
            <h1 className="text-3xl font-bold text-center text-gray-800">
              You need to be a photographer to create a blog.
            </h1>
          ) : (
            <Loader />
          )}
        </div>
      )}
    </div>
  );
}
