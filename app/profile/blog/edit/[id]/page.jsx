"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import axios from "axios";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Link from "next/link";
import useAuthStore from "@/authStore";
import Loader from "@/components/loader";
import Swal from "sweetalert2";
import {
  EditIcon,
  ExternalLinkIcon,
  ImageIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogEdit() {
  const { id } = useParams();
  const { token, photographer, isHydrated } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [
            { align: "" },
            { align: "center" },
            { align: "right" },
            { align: "justify" },
          ],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          [
            {
              color: [
                "#000000",
                "#e60000",
                "#ff9900",
                "#ffff00",
                "#008a00",
                "#0066cc",
                "#9933ff",
                "#ffffff",
                "#facccc",
                "#ffebcc",
                "#ffffcc",
                "#cce8cc",
                "#cce0f5",
                "#ebd6ff",
                "#bbbbbb",
                "#f06666",
                "#ffc266",
                "#ffff66",
                "#66b966",
                "#66a3e0",
                "#c285ff",
                "#888888",
                "#a10000",
                "#b26b00",
                "#b2b200",
                "#006100",
                "#0047b2",
                "#6b24b2",
                "#444444",
                "#5c0000",
                "#663d00",
                "#666600",
                "#003700",
                "#002966",
                "#3d1466",
              ],
            },
          ],
        ],
      },
    }),
    []
  );

  const validateForm = () => {
    if (!blog.content.title.trim()) {
      toast.error("Title is required.");
      return false;
    }
    if (!blog.content.body.trim()) {
      toast.error("Body is required.");
      return false;
    }
    return true;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/upload/uploadSingleImage`,
        {
          method: "POST",
          body: uploadData,
        }
      );
      const data = await res.text();
      if (res.ok) {
        setBlog((prev) => ({
          ...prev,
          coverImage: data,
        }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while uploading the image.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success("Blog ID copied to clipboard!");
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3e3e3e",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_SERVER}/api/blog/delete-blog?blogId=${id}`,
            {
              headers: { "x-auth-token": token },
            }
          );
          router.push("/profile/blog");
          toast.success("Blog deleted successfully!");
        } catch (error) {
          console.error("Error deleting blog:", error);
          toast.error("Failed to delete blog.");
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/blog/update-blog`,
        blog,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.data;
      if (data.error) {
        return toast.error(data.error);
      }
      Swal.fire({
        title: "Blog Updated and sent for review!",
        text: "Your blog has been updated and sent for review. Please wait for the approval.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.back();
      });
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/blog/get-blog-by-id?id=${id}`
        );
        const data = response.data;
        setBlog({ ...data.blog, blogId: data.blog._id, isActive: false });
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

  if (!photographer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        {isHydrated ? (
          <>
            <h1 className="text-3xl font-bold text-center text-gray-800">
              You need to be a photographer to create a blog.
            </h1>
          </>
        ) : (
          <Loader />
        )}
      </div>
    );
  }

  if (
    photographer &&
    blog &&
    blog.authorInfo?.author?._id !== photographer._id
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-5">
      {!isLoading && blog ? (
        <div className=" min-h-screen">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-0 py-5 px-2 md:px-5">
            <div className="flex flex-col w-full px-5 items-start gap-2">
              {blog.coverImage ? (
                <>
                  <img
                    src={blog.coverImage}
                    className="w-full object-contain max-h-[80vh] mx-auto"
                    alt="photo"
                  />
                  <Button
                    variant="link"
                    onClick={() =>
                      setBlog((prev) => ({
                        ...prev,
                        coverImage: "",
                      }))
                    }
                    className="flex items-center gap-2 mx-auto text-red-600"
                  >
                    Remove Cover Image
                  </Button>
                </>
              ) : (
                <div className="w-full mx-auto rounded-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="w-full p-3">
                      <div className="relative h-[60vh] rounded-lg border flex justify-center items-center shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-shadow duration-300 ease-in-out">
                        <div className="absolute flex flex-col items-center">
                          <ImageIcon className="w-12 h-12 text-surface-200" />
                          <span className="block text-gray-500 font-semibold">
                            Drop your image here
                          </span>
                          <span className="block text-gray-400 font-normal mt-1">
                            or click to upload
                          </span>
                        </div>
                        <input
                          name=""
                          onChange={handleImageUpload}
                          className="h-full w-full opacity-0 cursor-pointer"
                          type="file"
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center flex-wrap gap-4">
                <Button
                  variant="link"
                  onClick={handleSubmit}
                  className="flex flex-row gap-2 items-center border-2 border-green-600 rounded-full bg-green-100 text-base text-green-600 mx-auto"
                >
                  <EditIcon size={20} />
                  <div className="font-medium">Update</div>
                </Button>

                <Link
                  className="mx-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.clickedart.com/blog/${id}`}
                >
                  <Button
                    variant="link"
                    className="flex flex-row gap-2 items-center border-2 border-blue-600 rounded-full bg-blue-100 text-base text-blue-600 mx-auto"
                  >
                    <ExternalLinkIcon size={20} />
                    <div className="font-medium">View</div>
                  </Button>
                </Link>

                <Button
                  onClick={handleDelete}
                  variant="link"
                  className="flex flex-row gap-2 items-center border-2 border-red-600 rounded-full bg-red-50 text-base text-red-600 mx-auto"
                >
                  <Trash2Icon size={20} />
                  <div className="font-medium">Delete</div>
                </Button>
              </div>
            </div>

            <div className="flex flex-col w-full p-2 md:p-5 border-2 rounded-xl bg-gray-50">
              <p className="text-xl font-semibold">Blog Details</p>
              <div className="flex flex-col mt-5 gap-5">
                <div className="flex flex-col gap-2">
                  <Label>Blog ID</Label>
                  <div className="flex flex-col sm:flex-row gap-5 ">
                    <div
                      onClick={handleCopy}
                      className="rounded-2xl px-2 py-2 font-semibold border cursor-pointer"
                    >
                      <span className="text-sm md:text-base font-normal text-gray-800">
                        {id}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Title</Label>
                  <Input
                    className="bg-white"
                    value={blog.content?.title}
                    onChange={(e) =>
                      setBlog((prev) => ({
                        ...prev,
                        content: { ...prev.content, title: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Summary</Label>
                  <Textarea
                    className="bg-white h-24"
                    value={blog.content?.summary}
                    onChange={(e) =>
                      setBlog((prev) => ({
                        ...prev,
                        content: { ...prev.content, summary: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 px-2 md:px-5 pb-5 bg-gray-50">
            <div className="flex flex-col gap-2 p-4 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.2)]">
              <Label>Body</Label>
              <ReactQuill
                className="bg-white"
                theme="snow"
                modules={modules}
                value={blog.content?.body}
                onChange={(value) =>
                  setBlog((prev) => ({
                    ...prev,
                    content: { ...prev.content, body: value },
                  }))
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          {isHydrated ? (
            <>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  {!blog ? (
                    <h1 className="text-3xl font-bold text-center text-gray-800">
                      No Blog Found
                    </h1>
                  ) : (
                    <h1 className="text-3xl font-bold text-center text-gray-800">
                      You need to be a photographer to create a blog.
                    </h1>
                  )}
                </>
              )}
            </>
          ) : (
            <Loader />
          )}
        </div>
      )}
    </div>
  );
}
