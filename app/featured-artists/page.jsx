"use client";

import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Featured from "@/components/featuredArtists/Featured";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const images = [
  {
    src1: "https://s3-alpha-sig.figma.com/img/4d19/b23e/3d228a3fd195bfa60377fd55d160a5b1?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iFkKprzSqDNKTU9LlLwSTHXLfAGis5CwOeNvKaH2Kczk9K-JZntq0VUkJo-DBgltcohdJ9x3iXNrPzCZSNqkto2QzhpoMuFkYEsMkt-katm8EYRoLj89be0Zb~4te0P5WaAhtQX6tzM3dGv9hX4HJic7ZyaIR-ab3DcjK62upJYz0Gylt6zfNjUIv2CZ82vxnL72CW2QuefV7x2hz-exkTS2mXKk7upNDgPlvosOU~u~V1ej33BASAkcjpm2hgLjf0YvZlOejdKFGCBLbPasAAXvhHCUmhkQuQOP95AfDoPMGgZ9KT9T~yTNW3gZRCHoUtYmiLDd4AHu0VZ6QCMaCg__",
    src2: "https://s3-alpha-sig.figma.com/img/2963/f885/97ce761fc4381ad4166c64b7d27aeb70?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EF~kcq~y~gs-UsCxU4FU6aujyBn-hkmQQIagEGmT3uYydJ~xG9QRK5cq-9kDQ0TR15twg0YRj9jKX2DWWLL8P4bd~2lJsRjGJMNjc0qLljsRVGFsl0sxFTA7NRvFKgZ6eEaow8x8f~3iMUHMOX-deRfVcNghn6XtD2basPVR34XL~7SeBkl0CqxMt72G~aVEpLfOlCl1gCabioDsKA-3hBiKBDnTjsYkSFEEMLkm9FZErYF4RdYaXVXugvNizsDkLv5onWRarYmmRrbqzRQqRqutcwbq3F3g1aPeUgtYQ0UeBCpmLlbiEKSCsCczuCfXQa0D6Rw5~ZaVUzxjIRsS9w__",
    title: "Artwork 1",
    artist: "Artist 1",
    downloadCount: 100,
  },
  {
    src1: "https://s3-alpha-sig.figma.com/img/627b/0b6d/20a3bf4dde77d7b1dc1c7d9f234ce523?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=P1P4CGFUcqeUAwJ8ukcMs0CNdoDzCmpslbhU~4eNAiHr0sliOUzk5IXv5tjDXGs5ZrYb7PxsmeQDqWqC~ZSg4t0XAU6wBuwFGIS9X513iWiiuR3doAoDnimLrDT0WUcrDiemoZ~Oe3qUOfx2pQeFzietDvf6a-uWYRfekdZFBPjhqiJRa3tDDotfq3v7DvSRE4lUEDSH~rxZlB68mRJJp9XTFtLcx3d~HsKcJMHiP2lE5x-ztoErFyYPtLa6SqkJ07vU6BAztBLtC9Ix7GM1qoPntgBYgc3Xc1y86pEUGZTsal0wOjqPyxWcxWKr8q2374S7tKk~zm3Pl~v5MworZA__",
    src2: "https://s3-alpha-sig.figma.com/img/e0ba/4075/3ac746689c6de1ed92081be3be7becee?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HSDYuBAZw6z0xUcUEtpf869llLU0P9WVBaVwWfUFGk8KfO0V1SYUkCnaTNtS~a~D62NnSH4OC9nNEHQKaOOOP3ppxn7dDsv-D~aWF55rPqjyRj87XlwZN7d8Ivzn69QUDk1qph20925PU6uPGXPdDJI3sjNhcTUxzVOYeDh3cebTQecqvQCJxJySuwZsuopPu49zK4kARS8OIrupEUFZZ0bSaYb8ZJofBBFJO7hqHpgjRXPkace-gRMlJ1xGMxsF0ookgyvbAPrjpOhEDIKNXakNv1WiKjOPxAWFbCJScFs~QlKwJgjXPSn0bzjPRIr2KygqOQNyGCKMUCjFF7Yg9w__",
    title: "Artwork 2",
    artist: "Artist 2",
    downloadCount: 200,
  },
  {
    src1: "https://s3-alpha-sig.figma.com/img/4d19/b23e/3d228a3fd195bfa60377fd55d160a5b1?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RJleyEbrM8Siv1irCjW28y86eWG8YfloSsB65haSB6pu-SZvxFugBo9IiETrUWj0eDx2Uv2x8z~C4ZTuoAEGSrme1WpWEqgpNW1qejQuAle5yT~Sfu9FW6lb0pkfkass44lHqmhHH12A9tr6zyPseACmzQdoONijSubghjUmFeZx4kgsXOSqt9ttfgdY8AAcSCRZIzRIN4I4ImVNbrinSrVlTRN3Um-NHa5yabAutJVpUyM2PRmrUb2pwGCjoetmKh9SLzxAnAUWzrcRFO2NtZ80gkR6UNXONVLXOuEhpwVin9n29EcbGn92XMHi3PSHW-w8R7QYc2YialXiEq~IQQ__",
    src2: "https://s3-alpha-sig.figma.com/img/d418/6a78/00a8d79ef1d6324d09648113c5ef5719?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AmfsVgifhXFMXSqnItPzdfdRdlL~kzxn8~ijJeamj~X43J1KEEWKwwPlBkVS48luKcfQ~DSBbfGC9rrS6ush9L3P9PLgEFKtKPm1pUErVjtjkwdUuwj7wPiO-6NLL8NJh8UZI6~53j27VSeMnQE8AifFC0DkRNtabGDfuHGYWHV~KOzqzQkjMasQ8ipEeDrx2FD0eBFokcSWC3A-2FoLa3Y-QBC73bTO5u-Zc4Z1Wp6eR5PxuliFqMl9SGlZwP~0Yzs4vCVmQy3yGvQtYuXuCvbyQvIQejrkGm28EFUTbxhHWYobghwjR5kiLXS6hapQeHa6GsfcyTyf5ikhIUWU9A__",
    title: "Artwork 3",
    artist: "Artist 3",
    downloadCount: 300,
  },
  {
    src1: "https://s3-alpha-sig.figma.com/img/4d19/b23e/3d228a3fd195bfa60377fd55d160a5b1?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RJleyEbrM8Siv1irCjW28y86eWG8YfloSsB65haSB6pu-SZvxFugBo9IiETrUWj0eDx2Uv2x8z~C4ZTuoAEGSrme1WpWEqgpNW1qejQuAle5yT~Sfu9FW6lb0pkfkass44lHqmhHH12A9tr6zyPseACmzQdoONijSubghjUmFeZx4kgsXOSqt9ttfgdY8AAcSCRZIzRIN4I4ImVNbrinSrVlTRN3Um-NHa5yabAutJVpUyM2PRmrUb2pwGCjoetmKh9SLzxAnAUWzrcRFO2NtZ80gkR6UNXONVLXOuEhpwVin9n29EcbGn92XMHi3PSHW-w8R7QYc2YialXiEq~IQQ__",
    src2: "https://s3-alpha-sig.figma.com/img/2963/f885/97ce761fc4381ad4166c64b7d27aeb70?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EF~kcq~y~gs-UsCxU4FU6aujyBn-hkmQQIagEGmT3uYydJ~xG9QRK5cq-9kDQ0TR15twg0YRj9jKX2DWWLL8P4bd~2lJsRjGJMNjc0qLljsRVGFsl0sxFTA7NRvFKgZ6eEaow8x8f~3iMUHMOX-deRfVcNghn6XtD2basPVR34XL~7SeBkl0CqxMt72G~aVEpLfOlCl1gCabioDsKA-3hBiKBDnTjsYkSFEEMLkm9FZErYF4RdYaXVXugvNizsDkLv5onWRarYmmRrbqzRQqRqutcwbq3F3g1aPeUgtYQ0UeBCpmLlbiEKSCsCczuCfXQa0D6Rw5~ZaVUzxjIRsS9w__",
    title: "Artwork 4",
    artist: "Artist 4",
    downloadCount: 400,
  },
  {
    src1: "https://s3-alpha-sig.figma.com/img/627b/0b6d/20a3bf4dde77d7b1dc1c7d9f234ce523?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=P1P4CGFUcqeUAwJ8ukcMs0CNdoDzCmpslbhU~4eNAiHr0sliOUzk5IXv5tjDXGs5ZrYb7PxsmeQDqWqC~ZSg4t0XAU6wBuwFGIS9X513iWiiuR3doAoDnimLrDT0WUcrDiemoZ~Oe3qUOfx2pQeFzietDvf6a-uWYRfekdZFBPjhqiJRa3tDDotfq3v7DvSRE4lUEDSH~rxZlB68mRJJp9XTFtLcx3d~HsKcJMHiP2lE5x-ztoErFyYPtLa6SqkJ07vU6BAztBLtC9Ix7GM1qoPntgBYgc3Xc1y86pEUGZTsal0wOjqPyxWcxWKr8q2374S7tKk~zm3Pl~v5MworZA__",
    src2: "https://s3-alpha-sig.figma.com/img/2963/f885/97ce761fc4381ad4166c64b7d27aeb70?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EF~kcq~y~gs-UsCxU4FU6aujyBn-hkmQQIagEGmT3uYydJ~xG9QRK5cq-9kDQ0TR15twg0YRj9jKX2DWWLL8P4bd~2lJsRjGJMNjc0qLljsRVGFsl0sxFTA7NRvFKgZ6eEaow8x8f~3iMUHMOX-deRfVcNghn6XtD2basPVR34XL~7SeBkl0CqxMt72G~aVEpLfOlCl1gCabioDsKA-3hBiKBDnTjsYkSFEEMLkm9FZErYF4RdYaXVXugvNizsDkLv5onWRarYmmRrbqzRQqRqutcwbq3F3g1aPeUgtYQ0UeBCpmLlbiEKSCsCczuCfXQa0D6Rw5~ZaVUzxjIRsS9w__",
    title: "Artwork 5",
    artist: "Artist 5",
    downloadCount: 500,
  },
  {
    src1: "https://s3-alpha-sig.figma.com/img/4d19/b23e/3d228a3fd195bfa60377fd55d160a5b1?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iFkKprzSqDNKTU9LlLwSTHXLfAGis5CwOeNvKaH2Kczk9K-JZntq0VUkJo-DBgltcohdJ9x3iXNrPzCZSNqkto2QzhpoMuFkYEsMkt-katm8EYRoLj89be0Zb~4te0P5WaAhtQX6tzM3dGv9hX4HJic7ZyaIR-ab3DcjK62upJYz0Gylt6zfNjUIv2CZ82vxnL72CW2QuefV7x2hz-exkTS2mXKk7upNDgPlvosOU~u~V1ej33BASAkcjpm2hgLjf0YvZlOejdKFGCBLbPasAAXvhHCUmhkQuQOP95AfDoPMGgZ9KT9T~yTNW3gZRCHoUtYmiLDd4AHu0VZ6QCMaCg__",
    src2: "https://s3-alpha-sig.figma.com/img/2963/f885/97ce761fc4381ad4166c64b7d27aeb70?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EF~kcq~y~gs-UsCxU4FU6aujyBn-hkmQQIagEGmT3uYydJ~xG9QRK5cq-9kDQ0TR15twg0YRj9jKX2DWWLL8P4bd~2lJsRjGJMNjc0qLljsRVGFsl0sxFTA7NRvFKgZ6eEaow8x8f~3iMUHMOX-deRfVcNghn6XtD2basPVR34XL~7SeBkl0CqxMt72G~aVEpLfOlCl1gCabioDsKA-3hBiKBDnTjsYkSFEEMLkm9FZErYF4RdYaXVXugvNizsDkLv5onWRarYmmRrbqzRQqRqutcwbq3F3g1aPeUgtYQ0UeBCpmLlbiEKSCsCczuCfXQa0D6Rw5~ZaVUzxjIRsS9w__",
    title: "Artwork 6",
    artist: "Artist 6",
    downloadCount: 600,
  },
];

const artists = [
  {
    name: "Artist 1",
    image:
      "https://wallpapers.com/images/hd/basic-default-pfp-pxi77qv5o0zuz8j3.jpg",
    profile: "/artist/1",
  },
  {
    name: "Artist 2",
    image:
      "https://wallpapers.com/images/hd/basic-default-pfp-pxi77qv5o0zuz8j3.jpg",
    profile: "artist/2",
  },
  {
    name: "Artist 3",
    image:
      "https://wallpapers.com/images/hd/basic-default-pfp-pxi77qv5o0zuz8j3.jpg",
    profile: "artist/3",
  },
  {
    name: "Artist 4",
    image:
      "https://wallpapers.com/images/hd/basic-default-pfp-pxi77qv5o0zuz8j3.jpg",
    profile: "artist/4",
  },
  {
    name: "Artist 5",
    image:
      "https://wallpapers.com/images/hd/basic-default-pfp-pxi77qv5o0zuz8j3.jpg",
    profile: "artist/5",
  },
  {
    name: "Artist 6",
    image:
      "https://wallpapers.com/images/hd/basic-default-pfp-pxi77qv5o0zuz8j3.jpg",
    profile: "artist/6",
  },
];

const featuredArtwork = [
  {
    title: "Artwork 1",
    artist: "Artist 1",
    src: "/assets/hero/bg2.jpg",
    size: 100,
    downloadCount: 100,
  },
  {
    title: "Artwork 2",
    artist: "Artist 2",
    src: "/assets/hero/bg2.jpg",
    size: 200,
    downloadCount: 200,
  },
  {
    title: "Artwork 3",
    artist: "Artist 3",
    src: "/assets/hero/bg2.jpg",
    size: 300,
    downloadCount: 300,
  },
  {
    title: "Artwork 4",
    artist: "Artist 4",
    src: "/assets/hero/bg2.jpg",
    size: 400,
    downloadCount: 400,
  },
  {
    title: "Artwork 5",
    artist: "Artist 5",
    src: "/assets/hero/bg2.jpg",
    size: 500,
    downloadCount: 500,
  },
  {
    title: "Artwork 6",
    artist: "Artist 6",
    src: "/assets/hero/bg2.jpg",
    size: 600,
    downloadCount: 100,
  },
  {
    title: "Artwork 7",
    artist: "Artist 7",
    src: "/assets/hero/bg2.jpg",
    size: 700,
    downloadCount: 100,
  },
  {
    title: "Artwork 8",
    artist: "Artist 8",
    src: "/assets/hero/bg2.jpg",
    size: 800,
    downloadCount: 100,
  },
  {
    title: "Artwork 1",
    artist: "Artist 1",
    src: "/assets/hero/bg2.jpg",
    size: 100,
    downloadCount: 100,
  },
  {
    title: "Artwork 2",
    artist: "Artist 2",
    src: "/assets/hero/bg2.jpg",
    size: 200,
    downloadCount: 100,
  },
  {
    title: "Artwork 3",
    artist: "Artist 3",
    src: "/assets/hero/bg2.jpg",
    size: 300,
    downloadCount: 100,
  },
  {
    title: "Artwork 4",
    artist: "Artist 4",
    src: "/assets/hero/bg2.jpg",
    size: 400,
    downloadCount: 100,
  },
  {
    title: "Artwork 5",
    artist: "Artist 5",
    src: "/assets/hero/bg2.jpg",
    size: 500,
    downloadCount: 100,
  },
  {
    title: "Artwork 6",
    artist: "Artist 6",
    src: "/assets/hero/bg2.jpg",
    size: 600,
    downloadCount: 100,
  },
  {
    title: "Artwork 7",
    artist: "Artist 7",
    src: "/assets/hero/bg2.jpg",
    size: 700,
    downloadCount: 200,
  },
  {
    title: "Artwork 8",
    artist: "Artist 8",
    src: "/assets/hero/bg2.jpg",
    size: 800,
    downloadCount: 100,
  },
];

export default function page() {
  const [sliderRef, slider] = useKeenSlider({
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 15 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 15 },
      },
    },
  });

  const handleNavigation = (direction) => {
    if (direction === "left") {
      slider.current?.prev();
    } else if (direction === "right") {
      slider.current?.next();
    }
  };
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen flex flex-col items-center"
      >
        <h2 className="text-heading-04 sm:text-heading-03 md:text-heading-02 font-bold text-primary-400">
          Artist of the Month
        </h2>
        <div className="relative flex flex-col items-center justify-center mt-4 w-full md:w-11/12 lg:w-10/12 xl:w-9/12">
          <div className="absolute inset-0 bg-black opacity-15 z-0">
            <Image
              width={800}
              height={600}
              src="/assets/hero/bg4.jpg"
              alt="artist of the month"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center w-full justify-center md:px-12 sm:px-8 lg:px-16 xl:px-20 pt-5 z-10">
            <div className="w-8/12 md:w-6/12 lg:w-5/12 xl:w-3/12 flex items-center">
              <Image
                width={300}
                height={300}
                src="/assets/hero/bg4.jpg"
                alt="artist"
                className="object-cover border-4 border-white mx-auto w-60 aspect-[1/1] rounded-full"
              />
            </div>
            <div className="sm:w-9/12 p-4 sm:p-8 z-20">
              <h3 className="text-heading-04 font-semibold text-black">
                Artist Name
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
          <div className="flex flex-row justify-around items-center w-full">
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
              className=" z-20 rounded-full"
              onClick={() => handleNavigation("right")}
            >
              <p className="sr-only">Featured Artist Photos Right</p>
              <ChevronRight
                size={64}
                className="text-zinc-500 pl-1 hover:text-white"
              />
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col items-center bg-neutral-200 px-4 mt-5 sm:mt-20 mb-10 min-h-20">
          <div className="text-center mt-20 mb-10">
            <h1 className="text-heading-03 sm:text-heading-01 font-bold text-primary">
              Featured Artists
            </h1>
            <p className="text-paragraph sm:text-heading-04 text-primary font-semibold">
              Discover the Masters Behind the Magic
            </p>
          </div>
          <div className="my-5">
            <Featured artists={artists} />
          </div>
        </div>
        <div className="w-full flex flex-col items-center my-10 min-h-20 px-4">
          <h2 className="text-heading-03 text-center sm:text-heading-02 font-bold text-primary">
            Featured Artwork Showcase
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10 px-10 sm:px-10 md:px-10 lg:px-20 xl:px-60">
            {featuredArtwork.map((image, index) => (
              <div key={index}>
                <div className="relative group">
                  <Image
                    width={400}
                    height={400}
                    src={image.src}
                    alt={image.title}
                    className="object-cover w-full aspect-[1/1] opacity-100 group-hover:opacity-0 transition-all duration-200 ease-linear"
                  />
                  <Image
                    width={800}
                    height={800}
                    src={image.src}
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
        <div className="w-full relative">
          <Image
            width={1600}
            height={900}
            src="https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg"
            alt=""
            className="w-full h-80 sm:h-[35vh] md:h-[40vh] xl:h-[80vh] object-cover object-center"
          />
          <div className="absolute flex flex-col md:justify-start justify-center inset-0 bg-white bg-opacity-25">
            <div className="md:pt-10 text-center sm:text-start px-10 sm:px-28 lg:w-3/4">
              <h1 className="text-heading-03 sm:text-heading-04 md:text-heading-03 xl:text-heading-lg font-bold text-white">
                Sell with Us
              </h1>
              <p className="text-paragraph sm:text-heading-06 md:text-heading-05 xl:text-heading-04 text-white font-semibold">
                Are you an artist looking to showcase your work and sell it on
                our platform?
              </p>
              <div className="mt-10">
                <button className="bg-white text-primary rounded-lg font-semibold p-4 text-heading-05 hover:bg-primary hover:text-white transition-all duration-200 ease-linear active:bg-primary-200 active:text-white">
                  Sell Your Artwork
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
