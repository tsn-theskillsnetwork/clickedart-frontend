"use client";

import Button from "@/components/button";
import Loader from "@/components/loader";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";

export default function ProfilePage() {
  const id = useParams().id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/user/get-user-by-id?userId=${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();
      console.log(data);
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user data", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return (
    <div className="flex flex-col items-center min-h-[80vh]">
      {loading || !user ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader />
        </div>
      ) : (
        <div className="relative flex flex-col items-center pb-10 justify-center mt-4 w-full md:w-11/12 lg:w-10/12 xl:w-9/12">
          <div className="absolute inset-0 bg-black opacity-15 z-0">
            <Image
              width={800}
              height={600}
              src={"/assets/hero/bg4.jpg"}
              alt="artist of the month"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center w-full justify-center md:px-12 sm:px-8 lg:px-16 xl:px-20 pt-5 z-10">
            <div className="w-8/12 md:w-6/12 lg:w-5/12 xl:w-3/12 flex items-center">
              <Image
                width={300}
                height={300}
                src={user?.image || "/assets/default.jpg"}
                alt="artist"
                className="object-cover border-4 border-white mx-auto w-60 aspect-[1/1] rounded-full"
              />
            </div>
            <div className="sm:w-9/12 p-4 sm:p-8 z-20">
              <h3 className="text-heading-04 font-semibold text-black">
                {user?.name}
              </h3>
              <p className="text-paragraph text-justify text-gray-500 mt-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellat nobis quam consequuntur nisi aut cumque omnis ratione
                facere eaque iste ipsa dignissimos tempora, tempore commodi,
                velit soluta quisquam! Provident, et itaque. Velit tempora,
                porro assumenda voluptate harum minima recusandae totam
                cupiditate architecto,
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center mt-8 z-20">
            {/* <Button color="primary" size="lg" className="">
              View Profile
            </Button> */}
            <div className="flex flex-row gap-4">
              <Icon
                icon="akar-icons:instagram-fill"
                className="text-4xl text-primary"
              />
              <Icon
                icon="akar-icons:twitter-fill"
                className="text-4xl text-primary"
              />
              <Icon
                icon="akar-icons:facebook-fill"
                className="text-4xl text-primary"
              />
            </div>
          </div>
          {/* <div className="flex flex-row justify-around items-center w-full">
          <button
            className=" z-20 rounded-full"
            onClick={() => handleNavigation("left")}
          >
            <p className="sr-only">Featured Artist Photos Left</p>
            <ChevronLeft
              className="text-zinc-500 pr-1 hover:text-white"
              size={64}
            />
          </button>
          <div className="w-4/6 shrink flex-grow my-10">
            <div ref={sliderRef} className="keen-slider">
              {images.map((image, index) => (
                <div key={index} className="keen-slider__slide">
                  <div className="relative group">
                    <Image
                      width={800}
                      height={800}
                      src={image.src1}
                      alt={image.title}
                      className="object-cover w-full aspect-[1/1] opacity-100 group-hover:opacity-0 transition-all duration-200 ease-linear"
                    />
                    <div className="absolute inset-0 bg-white object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear" />
                    <Image
                      width={800}
                      height={800}
                      src={image.src2}
                      alt={image.title}
                      className="absolute inset-0 object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear"
                    />
                    <div className="absolute inset-0">
                      <div className="flex justify-between mx-4 mt-4">
                        <div className="bg-white px-2 text-paragraph group-hover:opacity-0 bg-opacity-75 w-fit transition-all duration-200 ease-linear">
                          <p>{image.downloadCount} Downloads</p>
                        </div>
                        <Heart
                          size={28}
                          className="text-white group-hover:text-zinc-400 transition-all duration-200 ease-linear"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-neutral-600">
                    <h2 className="text-heading-06 font-bold">{image.title}</h2>
                    <p className="text-paragraph">{image.artist}</p>
                    <p className="text-paragraph">{image.size} MP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className=" z-20 rounded-full"
            onClick={() => handleNavigation("right")}
          >
            <p className="sr-only">Featured Artist Photos Right</p>
            <ChevronRight
              size={64}
              className="text-zinc-500 pl-1 hover:text-white"
            />
          </button>
        </div> */}
        </div>
      )}
    </div>
  );
}
