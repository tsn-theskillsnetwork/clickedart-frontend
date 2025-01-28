"use client";

import Button from "@/components/button";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import Featured from "@/components/featuredArtists/featured";
import Image from "next/image";
import "./styles.css";
import axios from "axios";
import Swal from "sweetalert2";
import useAuthStore from "@/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function page() {
  const { user, photographer } = useAuthStore();
  const router = useRouter();
  const [photographers, setPhotographers] = useState([]);
  const [images, setImages] = useState([]);

  const fetchFeaturedArtists = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/get-featured-photographers`
      );
      setPhotographers(res.data.featuredPhotographer);
    } catch (error) {
      console.error("Failed to fetch featured artists:", error);
    }
  };

  const fetchFeaturedArtwork = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-featured-artwork`
      );
      setImages(res.data.featuredArtwork);
      console.log(res.data);
    } catch (error) {
      console.error("Failed to fetch featured artists:", error);
    }
  };

  useEffect(() => {
    fetchFeaturedArtists();
    fetchFeaturedArtwork();
  }, []);

  return (
    <div>
      {/* <h2 className="text-heading-04 sm:text-heading-03 md:text-heading-02 font-bold text-primary-400">
          Artist of the Month
        </h2> */}
      {/* <div className="relative flex flex-col items-center justify-center mt-4 w-full">
          <div className="absolute inset-0 bg-black opacity-0 sm:opacity-15 z-0">
            <Image
              width={800}
              height={600}
              src="/assets/hero/bg4.jpg"
              alt="artist of the month"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center my-10 w-full justify-center md:px-12 sm:px-8 lg:px-16 xl:px-20 pt-5 z-10">
            <div className="w-full px-16 sm:w-[40vh] mb-auto pt-12 flex items-center">
              <Image
                width={800}
                height={800}
                src="/assets/images/avatar4.jpg"
                alt="artist"
                className="object-cover object-top sm:border-4 sm:border-white w-full mx-auto aspect-[1/1] sm:rounded-full sm:!shadow-none profile"
              />
            </div>
            <div className="sm:w-9/12 py-4 px-6 flex-grow sm:p-8 z-20">
              <div className="flex flex-col gap-2 px-12 sm:px-0 justify-between items-center sm:items-start">
                <h3 className="text-heading-04 font-semibold text-black">
                  Artist Name
                </h3>
                <div className="flex sm:hidden flex-row gap-2">
                  <Icon
                    icon="akar-icons:instagram-fill"
                    className="text-2xl text-primary"
                  />
                  <Icon
                    icon="akar-icons:twitter-fill"
                    className="text-2xl text-primary"
                  />
                  <Icon
                    icon="akar-icons:facebook-fill"
                    className="text-2xl text-primary"
                  />
                </div>
              </div>
              <div className="flex sm:hidden pt-4 sm::pt-0 items-center justify-center">
                <Button color="primary" size="lg" className="">
                  View Profile
                </Button>
              </div>
              <p className="text-paragraph text-justify text-gray-500 mt-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellat nobis quam consequuntur nisi aut cumque omnis ratione
                facere eaque iste ipsa dignissimos tempora, tempore commodi,
                velit soluta quisquam! Provident, et itaque. Velit tempora,
                porro assumenda voluptate harum minima recusandae totam
                cupiditate architecto,
              </p>
              <div className="hidden sm:flex flex-col sm:flex-row gap-12 items-center mt-8 z-20">
                <Button color="primary" size="lg" className="">
                  View Profile
                </Button>
                <div className="flex flex-row gap-4">
                  <Icon
                    icon="akar-icons:instagram-fill"
                    className="text-3xl text-primary"
                  />
                  <Icon
                    icon="akar-icons:twitter-fill"
                    className="text-3xl text-primary"
                  />
                  <Icon
                    icon="akar-icons:facebook-fill"
                    className="text-3xl text-primary"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-around items-center w-full px-10">
            <button
              className="hidden sm:block z-20 rounded-full"
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
                      <h2 className="text-heading-06 font-bold">
                        {image.title}
                      </h2>
                      <p className="text-paragraph">{image.artist}</p>
                      <p className="text-paragraph">{image.size} MP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="hidden sm:block z-20 rounded-full"
              onClick={() => handleNavigation("right")}
            >
              <p className="sr-only">Featured Artist Photos Right</p>
              <ChevronRight
                size={64}
                className="text-zinc-500 pl-1 hover:text-white"
              />
            </button>
          </div>
        </div> */}
      <div className="w-full flex flex-col items-center bg-neutral-200 px-4 mb-10 min-h-20">
        <div className="text-center mt-20 mb-10">
          <h1 className="text-heading-03 sm:text-heading-01 font-bold text-primary">
            Featured Artists
          </h1>
          <p className="text-paragraph sm:text-heading-04 text-primary font-semibold">
            Discover the Masters Behind the Magic
          </p>
        </div>
        {/* <div className="my-5"> */}
        <Featured photographers={photographers} />
        {/* </div> */}
      </div>
      <div className="w-full flex flex-col items-center my-10 min-h-20 px-4">
        <h2 className="text-heading-03 text-center sm:text-heading-02 font-bold text-primary">
          Featured Artwork Showcase
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 px-10 sm:px-10 md:px-10 lg:px-20 xl:px-60">
          {images.map((image, index) => (
            <div
              key={index}
              className="shadow-[0px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden transition-all duration-200 ease-out"
            >
              <div
                onClick={() => {
                  router.push(`/images/${image._id}`);
                }}
                className="relative group"
              >
                <Image
                  width={800}
                  height={800}
                  priority
                  src={
                    image.imageLinks.thumbnail ||
                    "/assets/placeholders/image.webp"
                  }
                  alt={image.description}
                  className="object-cover w-full aspect-[1/1] transition-all duration-200 ease-linear opacity-50 blur-[4px] border border-primary-200"
                />
                <Image
                  width={800}
                  height={800}
                  src={
                    image.imageLinks.thumbnail ||
                    "/assets/placeholders/image.webp"
                  }
                  alt={image.description}
                  className="absolute inset-0 object-contain w-full aspect-[1/1] transition-all duration-200 ease-linear drop-shadow-md"
                />
              </div>
              <div className="text-neutral-600 p-2">
                <h2 className="text-heading-05 font-semibold">
                  {image.title || "Untitled"}
                </h2>
                <Link
                  href={`/photographer/${image.photographer?._id}`}
                  className="font-medium"
                >
                  {image.photographer?.firstName
                    ? image.photographer?.firstName +
                      " " +
                      image.photographer?.lastName
                    : image.photographer?.name}
                </Link>
                <p className="font-medium text-surface-500">
                  {image.category?.name}
                </p>
                <div className="flex justify-between">
                  <p className="text-paragraph font-medium">
                    {image.resolutions?.original?.width}{" "}
                    <span className="font-bold">x</span>{" "}
                    {image.resolutions?.original?.height} px
                  </p>
                  <p className="text-paragraph font-bold">
                    ₹{image.price?.original}
                  </p>
                </div>
                <p className="text-paragraph font-medium">
                  (
                  {(
                    (image.resolutions?.original?.height *
                      image.resolutions?.original?.width) /
                    1000000
                  ).toFixed(1)}{" "}
                  MP)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full relative">
        <Image
          width={1600}
          height={900}
          src="https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg"
          alt=""
          className="w-full h-96 sm:h-[35vh] md:h-[40vh] xl:h-[80vh] object-cover object-center"
        />
        <div className="absolute flex flex-col md:justify-start justify-center inset-0 bg-white bg-opacity-25">
          <div className="md:pt-10 flex flex-col gap-4 text-start sm:text-start px-10 sm:px-28 lg:w-3/4">
            <h1 className="text-heading-05 sm:text-heading-04 md:text-heading-03 xl:text-heading-lg font-bold text-white">
              Sell with Us
            </h1>
            <p className="text-paragraph sm:text-heading-06 md:text-heading-05 xl:text-heading-04 text-white font-medium">
              Are you an artist looking to showcase your work and sell it on our
              platform?
            </p>
            <p className="sm:text-paragraph md:text-heading-06 xl:text-heading-05 text-white">
              Turn your passion into profit with ClickedART. Join our platform
              to showcase your art to a global audience, access powerful tools,
              and enjoy secure payments.
            </p>
            <div className="mt-10">
              <button
                onClick={() => {
                  if (photographer) router.push("/profile");
                  else if (user)
                    Swal.fire(
                      "Please sign in as a Photographer to sell your photos"
                    );
                  else router.push("/signin/photographer");
                }}
                className="bg-white text-primary rounded-lg font-semibold p-2 sm:p-4 text-heading-06 sm:text-heading-05 hover:bg-primary hover:text-white transition-all duration-200 ease-linear active:bg-primary-200 active:text-white"
              >
                Sell Your Artwork
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
