"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./styles.css";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronLeftCircle,
  ChevronRight,
  Heart,
  ShoppingCart,
} from "lucide-react";
import useCartStore from "@/store/cart";
import Button from "@/components/button";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const recommended = [
  {
    src1: "/assets/images/img3.jpg",
    src2: "/assets/images2/img1.jpg",
    title: "Artwork 1",
    artist: "Artist 1",
    downloadCount: 500,
  },
  {
    src1: "/assets/images/img4.jpg",
    src2: "/assets/images2/img2.jpg",
    title: "Artwork 2",
    artist: "Artist 2",
    downloadCount: 450,
  },
  {
    src1: "/assets/images/img5.jpg",
    src2: "/assets/images2/img3.jpg",
    title: "Artwork 3",
    artist: "Artist 3",
    downloadCount: 400,
  },
  {
    src1: "/assets/images/img6.jpg",
    src2: "/assets/images2/img1.jpg",
    title: "Artwork 4",
    artist: "Artist 4",
    downloadCount: 350,
  },
  {
    src1: "/assets/images/img6.jpg",
    src2: "/assets/images2/img1.jpg",
    title: "Artwork 4",
    artist: "Artist 4",
    downloadCount: 350,
  },
  {
    src1: "/assets/images/img6.jpg",
    src2: "/assets/images2/img1.jpg",
    title: "Artwork 4",
    artist: "Artist 4",
    downloadCount: 350,
  },
  {
    src1: "/assets/images/img6.jpg",
    src2: "/assets/images2/img1.jpg",
    title: "Artwork 4",
    artist: "Artist 4",
    downloadCount: 350,
  },
  {
    src1: "/assets/images/img6.jpg",
    src2: "/assets/images2/img1.jpg",
    title: "Artwork 4",
    artist: "Artist 4",
    downloadCount: 350,
  },
];

export default function ImagePage() {
  const id = useParams().id;
  const { addToCart, removeFromCart, cart } = useCartStore();

  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendedLength, setRecommendedLength] = useState(4);

  const [mode, setMode] = useState("print");
  const [desc, setDesc] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState({});

  const [sliderRef, slider] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 15,
    },
  });

  const fetchImage = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-image-by-id?id=${id}`,
        {
          method: "GET",
        }
      );
      console.log(response);
      if (!response.ok) throw new Error("Failed to fetch image");

      const data = await response.json();
      console.log(data);
      setImage(data.photo);
    } catch (error) {
      console.error("Error fetching image data", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [selected, setSelected] = useState(0);

  const images = [
    {
      id: 1,
      src: "/assets/images/img3.jpg",
    },
    {
      id: 2,
      src: "/assets/themes/nature.jpg",
    },
  ];

  const printSizes = [
    {
      id: 1,
      size: "30 x 10",
    },
    {
      id: 2,
      size: "45 x 15",
    },
    {
      id: 3,
      size: "60 x 25",
    },
    {
      id: 4,
      size: "70 x 30",
    },
  ];

  const digitalSizes = [
    {
      id: 1,
      name: "Small",
      size: "30 x 10",
    },
    {
      id: 2,
      name: "Medium",
      size: "45 x 15",
    },
    {
      id: 3,
      name: "Large",
      size: "60 x 25",
    },
  ];

  useEffect(() => {
    fetchImage();
  }, [id]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] ">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {image && (
            <div className="px-5 lg:px-20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 py-20 bg-[#FBFBFB] -mt-2">
                <div className="lg:col-span-2 flex flex-col gap-10">
                  <div className="relative group h-[50vw] lg:h-[30vw] w-full bg-white lg:col-span-2 shadow-[3px_3px_3px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center border border-gray-300">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={selected}
                        className="relative w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={images[selected].src}
                          alt={images[selected].alt || "Image"}
                          fill
                          priority
                          className="object-contain"
                        />
                      </motion.div>
                    </AnimatePresence>
                    <button
                      disabled={selected === 0}
                      onClick={() => {
                        setSelected(selected - 1);
                      }}
                      className={`hidden lg:block absolute top-1/2 left-0 transform -translate-y-1/2 text-primary cursor-pointer disabled:opacity-50 disabled:cursor-default`}
                    >
                      <ChevronLeft className="opacity-0 border-2 border-white rounded-full group-hover:opacity-100 size-8 lg:size-12" />
                    </button>
                    <button
                      disabled={selected === images.length - 1}
                      onClick={() => {
                        setSelected(selected + 1);
                      }}
                      className={`hidden lg:block absolute top-1/2 right-0 transform -translate-y-1/2 text-primary  cursor-pointer disabled:opacity-50 disabled:cursor-default`}
                    >
                      <ChevronRight className="opacity-0 border-2 border-white rounded-full group-hover:opacity-100 size-8 lg:size-12" />
                    </button>
                  </div>
                  <div className="grid lg:hidden grid-cols-2 gap-4 w-full">
                    {images.map((img, index) => (
                      <Image
                        key={index}
                        src={img.src}
                        alt={image.title || "Image"}
                        width={800}
                        height={400}
                        className={`${
                          selected === index
                            ? "opacity-100 border border-surface-400 shadow-[3px_3px_3px_rgba(0,0,0,0.4)]"
                            : "opacity-50 hover:opacity-80"
                        } w-full h-full object-cover cursor-pointer transition-all duration-300 ease-in-out`}
                        onClick={() => {
                          setSelected(index);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-heading-06 lg:text-heading-02 font-semibold text-surface-600">
                      {image.title || "Artwork name"}
                    </h2>
                    <h5 className="text-heading-sm lg:text-heading-05 uppercase font-semibold text-surface-500">
                      Artist Name
                    </h5>
                    <h5 className="text-paragraph lg:text-heading-05 uppercase font-semibold lg:font-bold text-surface-600">
                      ₹ 55,000
                    </h5>
                  </div>
                  <div className="flex md:hidden flex-col gap-2 mt-5">
                    <div className="flex flex-row gap-5 text-sm z-10">
                      <motion.p
                        layout
                        onClick={() => {
                          setDesc(true);
                        }}
                        className={`font-medium ${
                          desc
                            ? "text-black font-semibold underline decoration-2 underline-offset-8"
                            : "text-surface-600"
                        }`}
                      >
                        Product Description
                      </motion.p>
                      <motion.p
                        layout
                        onClick={() => {
                          setDesc(false);
                        }}
                        className={`font-medium ${
                          !desc
                            ? "text-black font-semibold underline decoration-2 underline-offset-8"
                            : "text-surface-600"
                        }`}
                      >
                        Comments
                      </motion.p>
                    </div>
                    <hr className="border-surface-200 z-0 -translate-y-1" />
                    <AnimatePresence mode="wait">
                      <motion.div
                        layout
                        key={desc}
                        className="flex flex-col gap-5 overflow-x-hidden"
                      >
                        {desc ? (
                          <motion.p
                            layout
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm text-surface-600"
                          >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Architecto cum earum minus, recusandae quidem
                            mollitia nesciunt voluptas, consequatur sunt
                            doloribus odio iste. In labore laudantium porro
                            expedita tempora repellendus nostrum quisquam?
                            Obcaecati laudantium asperiores, totam repellat
                            consectetur porro, itaque doloribus incidunt
                            quibusdam ducimus provident aut aliquid velit ad,
                            atque et.
                          </motion.p>
                        ) : (
                          <motion.div
                            layout
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-5"
                          >
                            <div className="flex flex-col gap-2 border border-gray-300 rounded-lg p-4">
                              <div className="flex items-center gap-2">
                                <Image
                                  src="/assets/images/avatar1.jpg"
                                  alt="profile"
                                  width={32}
                                  height={32}
                                  className=" w-8 h-8 object-cover rounded-full"
                                />
                                <h5 className="text-base font-semibold text-surface-600">
                                  User 1
                                </h5>
                              </div>
                              <p className="text-sm text-surface-600">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Architecto cum earum minus,
                                recusandae quidem mollitia nesciunt voluptas,
                                consequatur sunt doloribus odio iste. In labore
                                laudantium
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 border border-gray-300 rounded-lg p-4">
                              <div className="flex items-center gap-2">
                                <Image
                                  src="/assets/images/avatar2.jpg"
                                  alt="profile"
                                  width={32}
                                  height={32}
                                  className=" w-8 h-8 object-cover rounded-full"
                                />
                                <h5 className="text-base font-semibold text-surface-600">
                                  User 2
                                </h5>
                              </div>
                              <p className="text-sm text-surface-600">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Architecto cum earum minus,
                                recusandae quidem mollitia nesciunt voluptas,
                                consequatur sunt doloribus odio iste. In labore
                                laudantium
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex flex-col my-5">
                      <Button size="lg" className="w-full">
                        Buy Now
                      </Button>
                      <hr className="border border-surface-300" />
                      <div className="flex flex-col items-center gap-5 my-5">
                        <p className="text-heading-06 font-semibold">
                          Recommended for You
                        </p>
                        <div className="flex flex-row justify-around items-center w-full overflow-x-hidden">
                          <div ref={sliderRef} className="keen-slider">
                            {recommended.map((image, index) => (
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
                                    <div className="flex justify-end mx-4 mt-4">
                                      <Heart
                                        size={28}
                                        className="text-white group-hover:text-zinc-400 transition-all duration-200 ease-linear"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="text-neutral-600">
                                  <h2 className="text-base font-bold">
                                    {image.title}
                                  </h2>
                                  <p className="text-xs">{image.artist}</p>
                                  <p className="text-xs">{image.size} MP</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <div className="flex flex-row relative items-center justify-between w-full py-5 my-10  rounded-full">
                      <div
                        className={`absolute inset-0 bg-primary-100 shadow-inner inner-shadow rounded-full`}
                      ></div>
                      <motion.div
                        layout
                        className={`absolute inset-y-0 z-0 bg-gradient-to-t ${
                          mode === "digital" && "right-0"
                        } from-[#897F75] to-[#BCB0A4] inner-shadow-2 w-1/2 h-full rounded-full`}
                      ></motion.div>
                      <p
                        onClick={() => {
                          setMode("print");
                        }}
                        className={`text-heading-06 drop-shadow-md z-10 font-bold ${
                          mode === "digital"
                            ? "text-surface-500"
                            : "text-zinc-100"
                        } text-center w-full cursor-pointer transition-colors duration-200 ease-in-out`}
                      >
                        Ready to Hang
                      </p>
                      <p
                        onClick={() => {
                          setMode("digital");
                        }}
                        className={`text-heading-06 drop-shadow-md z-10 font-bold ${
                          mode === "print"
                            ? "text-surface-500"
                            : "text-zinc-100"
                        } text-surface-600 text-center w-full cursor-pointer transition-colors duration-200 ease-in-out`}
                      >
                        Digital Copy
                      </p>
                    </div>
                    <div className="flex flex-col gap-10">
                      <Select
                        className="w-36"
                        value={selectedProduct.size}
                        onValueChange={(value) => {
                          setSelectedProduct({
                            ...selectedProduct,
                            size: value,
                          });
                        }}
                      >
                        <SelectTrigger className="w-full font-medium !text-paragraph bg-[#E8E8E8] rounded-lg h-12 flex items-center justify-between">
                          <SelectValue placeholder="Select Size" />
                          <p className="sr-only">Size</p>
                        </SelectTrigger>
                        <SelectContent>
                          {mode === "print" &&
                            printSizes.map((size) => (
                              <SelectItem
                                className="!text-paragraph"
                                key={size.id}
                                value={size.size}
                              >
                                {size.size}
                              </SelectItem>
                            ))}
                          {mode === "digital" &&
                            digitalSizes.map((size) => (
                              <SelectItem
                                className="!text-paragraph text-surface-500"
                                key={size.id}
                                value={size.size}
                              >
                                <span className="text-black font-medium">
                                  {size.name}
                                </span>{" "}
                                - {size.size}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {mode === "print" && (
                        <Select
                          className="w-36"
                          value={selectedProduct.size}
                          onValueChange={(value) => {
                            setSelectedProduct({
                              ...selectedProduct,
                              color: value,
                            });
                          }}
                        >
                          <SelectTrigger className="w-full font-medium !text-paragraph bg-[#E8E8E8] rounded-lg h-12 flex items-center justify-between">
                            <SelectValue placeholder="Select Color" />
                            <p className="sr-only">Color</p>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="white">White</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="frameless">Frameless</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="flex items-center gap-10 mt-32">
                      <button
                        onClick={() => {
                          const isInCart = cart.some(
                            (item) => item._id === image._id
                          );
                          isInCart
                            ? removeFromCart(image._id)
                            : addToCart(image);
                        }}
                        className={`flex flex-grow items-center gap-4 justify-center border-2 border-primary py-5 ${
                          cart?.some((item) => item._id === image._id)
                            ? "bg-transparent  text-red-700 hover:bg-primary-100"
                            : "bg-primary text-white hover:bg-primary-dark hover:border-primary-dark"
                        } rounded-lg text-heading-05 font-semibold transition-all duration-300 ease-in-out`}
                      >
                        <p>
                          {cart?.some((item) => item._id === image._id)
                            ? "Remove from Cart"
                            : "Add to Cart"}
                        </p>
                        <ShoppingCart scale={32} strokeWidth={3} />
                      </button>
                      <button className="btn-secondary flex-shrink-0 p-4 border-2 border-primary rounded-2xl h-full aspect-[1/1] flex items-center justify-center group">
                        <Heart
                          size={32}
                          className="text-primary group-active:text-red-500 group-active:fill-red-500 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300 ease-in-out"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Desktop Desc */}
              <div className="hidden md:flex flex-col gap-2 mt-5 px-">
                <div className="flex flex-row gap-5 text-heading-03 z-10">
                  <motion.p
                    layout
                    onClick={() => {
                      setDesc(true);
                    }}
                    className={`font-medium ${
                      desc
                        ? "text-black font-semibold underline decoration-2 underline-offset-8"
                        : "text-surface-600"
                    }`}
                  >
                    Product Description
                  </motion.p>
                  <motion.p
                    layout
                    onClick={() => {
                      setDesc(false);
                    }}
                    className={`font-medium ${
                      !desc
                        ? "text-black font-semibold underline decoration-2 underline-offset-8"
                        : "text-surface-600"
                    }`}
                  >
                    Comments
                  </motion.p>
                </div>
                <hr className="border-surface-200 z-0 -translate-y-1" />
                <AnimatePresence mode="wait">
                  <motion.div
                    layout
                    key={desc}
                    className="flex flex-col gap-5 overflow-x-hidden"
                  >
                    {desc ? (
                      <motion.p
                        layout
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2 }}
                        className="text-heading-05 font-medium text-surface-600"
                      >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Architecto cum earum minus, recusandae quidem mollitia
                        nesciunt voluptas, consequatur sunt doloribus odio iste.
                        In labore laudantium porro expedita tempora repellendus
                        nostrum quisquam? Obcaecati laudantium asperiores, totam
                        repellat consectetur porro, itaque doloribus incidunt
                        quibusdam ducimus provident aut aliquid velit ad, atque
                        et.
                      </motion.p>
                    ) : (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-5"
                      >
                        {/* <div className="flex flex-col gap-2 border border-gray-300 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/assets/images/avatar1.jpg"
                              alt="profile"
                              width={32}
                              height={32}
                              className=" w-8 h-8 object-cover rounded-full"
                            />
                            <h5 className="text-base font-semibold text-surface-600">
                              User 1
                            </h5>
                          </div>
                          <p className="text-sm text-surface-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Architecto cum earum minus, recusandae quidem
                            mollitia nesciunt voluptas, consequatur sunt
                            doloribus odio iste. In labore laudantium
                          </p>
                        </div> */}
                        <div ref={sliderRef} className="keen-slider">
                          {recommended.map((image, index) => (
                            <div key={index} className="keen-slider__slide">
                              <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                  <Image
                                    src="/assets/images/avatar1.jpg"
                                    alt="profile"
                                    width={32}
                                    height={32}
                                    className=" w-8 h-8 object-cover rounded-full"
                                  />
                                  <div className="flex flex-col">
                                    <h5 className="text-base font-semibold text-surface-600">
                                      User 1
                                    </h5>
                                    <p className="text-sm  text-surface-600">
                                      Verified Purchase
                                    </p>
                                  </div>
                                </div>
                                <p className="text-paragraph text-surface-600">
                                  Lorem ipsum dolor sit amet consectetur
                                  adipisicing elit. Architecto cum earum minus,
                                  recusandae quidem mollitia nesciunt voluptas,
                                  consequatur sunt doloribus odio iste. In
                                  labore laudantium
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="flex flex-col my-5">
                  {/* <hr className="border border-surface-300" /> */}
                  <div className="flex flex-col items-start gap-5 px-20 my-5">
                    <p className="text-heading-03 font-semibold">
                      Recommended for You
                    </p>
                    <div className="flex flex-row justify-around items-center w-full overflow-x-hidden">
                      <div className="grid grid-cols-4 gap-8 w-full">
                        {recommended
                          .slice(0, recommendedLength)
                          .map((image, index) => (
                            <div key={index} className="flex flex-col gap-4">
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
                                  <div className="flex justify-end mx-4 mt-4">
                                    <Heart
                                      size={28}
                                      className="text-white group-hover:text-zinc-400 transition-all duration-200 ease-linear"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="text-neutral-600">
                                <h2 className="text-heading-05 font-bold">
                                  {image.title}
                                </h2>
                                <p className="text-paragraph font-medium">
                                  {image.artist}
                                </p>
                                <p className="text-paragraph font-medium">
                                  {image.size} MP
                                </p>
                              </div>
                            </div>
                          ))}
                        {recommendedLength < recommended.length && (
                          <div className="col-span-4 flex justify-center">
                            <button
                              onClick={() =>
                                setRecommendedLength(recommendedLength + 4)
                              }
                              className="bg-white text-primary font-semibold border-2 border-primary px-8 py-2 rounded-md hover:bg-primary hover:text-white transition-all duration-200"
                            >
                              Load More
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p>Error fetching image data</p>
        </div>
      )}
    </>
  );
}
