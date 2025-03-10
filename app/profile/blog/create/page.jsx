"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { ArrowLeftIcon } from "lucide-react";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogCreate() {
  const { token, photographer, isHydrated } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState(null);

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

  const [blog, setBlog] = useState({
    authorInfo: {
      author: undefined,
      authorType: "Photographer",
    },
    slug: "",
    content: {
      title: "",
      summary: "",
      body: "",
    },
    coverImage: "",
    tags: [],
    photographer: undefined,
    achievements: [],
    blogType: "blog",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/blog/add-blog`,
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
      //blog sent for approval
      Swal.fire({
        title: "Blog sent for approval",
        text: "Your blog has been sent for approval. You will be notified once it is approved.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push(`/profile/blog`);
      });
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    if (photographer) {
      setBlog((prev) => ({
        ...prev,
        authorInfo: { author: photographer._id, authorType: "Photographer" },
        photographer: photographer._id,
      }));
    }
  }, [photographer]);

  return (
    <div className="p-4">
      {photographer ? (
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto min-h-screen"
        >
          <div className="flex items-center gap-2 mb-5 text-heading-06 font-semibold">
            <div
              onClick={() => router.back()}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span>
                <ArrowLeftIcon className="w-6 h-6" />
              </span>
              Back
            </div>
          </div>
          {/* <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Create Blog
          </h1> */}
          <div className="bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] rounded-lg p-6 space-y-6">
            <div>
              <Label htmlFor="coverImage">Cover Image</Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt="Cover Preview"
                  className="mt-4 w-full h-48 object-contain rounded-lg shadow-sm"
                />
              )}
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={blog.content.title}
                onChange={(e) =>
                  setBlog({
                    ...blog,
                    content: { ...blog.content, title: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={blog.content.summary}
                onChange={(e) =>
                  setBlog({
                    ...blog,
                    content: { ...blog.content, summary: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <ReactQuill
                modules={modules}
                theme="snow"
                value={blog.content.body}
                onChange={(value) =>
                  setBlog({
                    ...blog,
                    content: { ...blog.content, body: value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                type="text"
                value={blog.tags.join(", ")}
                onChange={(e) =>
                  setBlog({
                    ...blog,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  })
                }
              />
            </div>
            <hr />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              variant="primary"
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Create Blog
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
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
