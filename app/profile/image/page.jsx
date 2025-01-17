"use client";

import useAuthStore from "@/authStore";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/loader";

export default function ImagePage() {
  const { photographer } = useAuthStore();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-images-by-photographer?photographer=${photographer._id}`
      );
      setPhotos(res.data.photos);
      console.log(res.data.photos);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [photographer]);

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 py-5 min-h-96">
      {loading && <Loader />}
      {photos.map((image) => (
        <Link
          href={`/profile/image/${image._id}`}
          className="relative group shadow-[2px_2px_6px_rgba(0,0,0,0.4)]"
          key={image._id}
        >
          <Image
            width={800}
            height={800}
            priority
            src={image.imageLinks.original || image.imageLinks.thumbnail}
            alt={image.description}
            className="object-cover w-full aspect-[1/1] transition-all duration-200 ease-linear"
          />

          <div className="absolute inset-0">
            <div className="flex justify-between px-2 pt-2">
              <div className="">
                <div className="bg-white px-2 text-paragraph bg-opacity-75 w-fit transition-all duration-200 ease-linear cursor-default">
                  {/* <p>
                                {image.imageAnalytics?.downloads || 0} Downloads
                              </p> */}
                </div>
              </div>
            </div>
          </div>
          <div className="text-white absolute bottom-0 p-4 pt-6 bg-gradient-to-t from-black to-transparent inset-x-0 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear">
            <h2 className="text-heading-05 font-semibold">
              {image.title || "Untitled"}
            </h2>
            <p className="font-medium text-surface-200">
              {image.category?.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
