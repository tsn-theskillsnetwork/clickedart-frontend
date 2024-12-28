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
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import useCartStore from "@/store/cart";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import toast from "react-hot-toast";
import { fetchData } from "@/helpers/api";

export default function ImagePage() {
  const id = useParams().id;
  const { addItemToCart, isItemInCart, removeItemFromCart } = useCartStore();
  const onAddToCart = () => {
    if (mode === "print" && !selectedPaper) {
      toast.error("Please select a paper!");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }
    if (mode === "print" && !selectedPaper) {
      toast.error("Please select a paper!");
      return;
    }

    const productToAdd = {
      ...image,
      mode,
      selectedPaper: selectedPaper,
      selectedSize: selectedSize,
      selectedFrame: selectedFrame,
      quantity: selectedQuantity,
    };

    addItemToCart(productToAdd);
    toast.success("Added to cart!");
    setInCart(true);
  };

  const onRemoveFromCart = (id) => {
    removeItemFromCart(id);
    toast.success("Removed from cart!");
    setInCart(false);
  };

  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendedLength, setRecommendedLength] = useState(4);
  const [inCart, setInCart] = useState(false);

  const [mode, setMode] = useState("print");
  const [papers, setPapers] = useState([]);
  const [frames, setFrames] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [desc, setDesc] = useState(true);
  const [buySectionActive, setBuySectionActive] = useState(false);

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

  console.log("Image", image);
  console.log("Papers", papers);
  console.log("Frames", frames);
  console.log("Selected Paper", selectedPaper);
  console.log("Selected Size", selectedSize);
  console.log("Selected Frame", selectedFrame);

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

  const descriptionSection = (
    <div className="flex flex-col gap-2 mt-5 px-">
      <div className="flex flex-row gap-5 text-sm sm:text-paragraph md:text-heading-05 lg:text-heading-04 xl:text-heading-03 z-10">
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
      <AnimatePresence mode="popLayout">
        <motion.div layout key={desc} className="flex flex-col gap-5">
          {desc ? (
            <motion.p
              layout
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              className="text-xs sm:text-sm md:text-heading-06 lg:text-heading-05 font-medium text-surface-600"
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Architecto cum earum minus, recusandae quidem mollitia nesciunt
              voluptas, consequatur sunt doloribus odio iste. In labore
              laudantium porro expedita tempora repellendus nostrum quisquam?
              Obcaecati laudantium asperiores, totam repellat consectetur porro,
              itaque doloribus incidunt quibusdam ducimus provident aut aliquid
              velit ad, atque et.
            </motion.p>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col gap-5"
            >
              <div ref={sliderRef} className="keen-slider">
                {recommended.map((image, index) => (
                  <div key={index} className="keen-slider__slide">
                    <div className=" flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/assets/images/avatar1.jpg"
                          alt="profile"
                          width={32}
                          height={32}
                          className=" w-8 h-8 object-cover rounded-full"
                        />
                        <div className="flex flex-col">
                          <h5 className="text-sm md:text-base font-semibold text-surface-600">
                            User 1
                          </h5>
                          <p className="text-xs md:text-sm text-surface-600">
                            Verified Purchase
                          </p>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base md:text-paragraph text-surface-800">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Architecto cum earum minus, recusandae quidem mollitia
                        nesciunt voluptas, consequatur sunt doloribus odio iste.
                        In labore laudantium
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute left-0 -ml-6 top-1/2 opacity-50">
                <ChevronLeft className="w-6 h-6 text-surface-600 animate-pulse" />
              </div>
              <div className="absolute -mr-6 right-0 top-1/2 opacity-50">
                <ChevronRight className="w-6 h-6 text-surface-600 animate-pulse" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // const recommendedSection = (
  //   <div className="flex flex-col items-start gap-5 px-4 sm:px-6 md:px-10 lg:px-20 my-5">
  //     <p className="text-paragraph sm:text-heading-06 md:text-heading-04 lg:text-heading-03 font-semibold">
  //       Recommended for You
  //     </p>
  //     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
  //       {recommended.slice(0, recommendedLength).map((image, index) => (
  //         <div key={index} className="flex flex-col gap-4">
  //           <div className="relative group">
  //             <Image
  //               width={800}
  //               height={800}
  //               src={image.src1}
  //               alt={image.title}
  //               className="object-cover w-full aspect-[1/1] opacity-100 group-hover:opacity-0 transition-all duration-200 ease-linear"
  //             />
  //             <div className="absolute inset-0 bg-white object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear" />
  //             <Image
  //               width={800}
  //               height={800}
  //               src={image.src2}
  //               alt={image.title}
  //               className="absolute inset-0 object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear"
  //             />
  //             <div className="absolute inset-0">
  //               <div className="flex justify-end mx-4 mt-4">
  //                 <Heart
  //                   size={28}
  //                   className="text-white group-hover:text-zinc-400 transition-all duration-200 ease-linear"
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //           <div className="text-neutral-600">
  //             <h2 className="text-base sm:text-paragraph md:text-heading-06 lg:text-heading-05 font-bold">
  //               {image.title}
  //             </h2>
  //             <p className="text-xs sm:text-base lg:text-paragraph font-medium">
  //               {image.artist}
  //             </p>
  //             <p className="text-xs sm:text-base lg:text-paragraph font-medium">
  //               {image.resolutions?.original} MP
  //             </p>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //     <div className="w-full">
  //       {recommendedLength < recommended.length && (
  //         <div className="col-span-4 flex justify-center">
  //           <button
  //             onClick={() => setRecommendedLength(recommendedLength + 4)}
  //             className="bg-white text-xs sm:text-base lg:text-primary font-semibold border-2 border-primary px-8 py-2 rounded-md hover:bg-primary hover:text-white transition-all duration-200"
  //           >
  //             Load More
  //           </button>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  const buySection = (
    <div className="flex flex-col">
      <div className="flex flex-row relative items-center justify-between w-full py-5 my-10 rounded-full">
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
            setSelectedPaper(null);
            setSelectedSize(null);
            setSelectedFrame(null);
          }}
          className={`text-base md:text-paragraph lg:text-base xl:text-heading-06 drop-shadow-md z-10 font-bold ${
            mode === "digital" ? "text-surface-500" : "text-zinc-100"
          } text-center w-full cursor-pointer transition-colors duration-200 ease-in-out`}
        >
          Ready to Hang
        </p>
        <p
          onClick={() => {
            setMode("digital");
            setSelectedPaper(null);
            setSelectedSize(null);
            setSelectedFrame(null);
          }}
          className={`text-base md:text-paragraph lg:text-base xl:text-heading-06 drop-shadow-md z-10 font-bold ${
            mode === "print" ? "text-surface-500" : "text-zinc-100"
          } text-surface-600 text-center w-full cursor-pointer transition-colors duration-200 ease-in-out`}
        >
          Digital Copy
        </p>
      </div>
      <div className="flex flex-col gap-10">
        {mode === "print" && (
          <>
            <Select
              className="w-36"
              onValueChange={(value) => {
                setSelectedPaper(value);
              }}
            >
              <SelectTrigger className="w-full font-medium !text-paragraph bg-[#E8E8E8] rounded-lg h-12 flex items-center justify-between">
                <SelectValue placeholder="Select Paper" />
                <p className="sr-only">Paper</p>
              </SelectTrigger>
              <SelectContent>
                {papers.map((paper) => (
                  <SelectItem
                    className="!text-paragraph"
                    key={paper._id}
                    value={paper}
                  >
                    {paper.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              className="w-36"
              onValueChange={(value) => {
                setSelectedSize(value);
              }}
            >
              <SelectTrigger className="w-full font-medium !text-paragraph bg-[#E8E8E8] rounded-lg h-12 flex items-center justify-between">
                <SelectValue placeholder="Select Size" />
                <p className="sr-only">Size</p>
              </SelectTrigger>
              <SelectContent>
                {selectedPaper?.customDimensions.map((size) => (
                  <SelectItem
                    className="!text-paragraph"
                    key={size._id}
                    value={size}
                  >
                    {size.width} x {size.height} in
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              className="w-36"
              onValueChange={(value) => {
                setSelectedFrame(value);
              }}
            >
              <SelectTrigger className="w-full font-medium !text-paragraph bg-[#E8E8E8] rounded-lg h-12 flex items-center justify-between">
                <SelectValue placeholder="Select Frame" />
                <p className="sr-only">Frame</p>
              </SelectTrigger>
              <SelectContent>
                {frames.map((frame) => (
                  <SelectItem key={frame._id} value={frame}>
                    {frame.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
        {mode === "digital" && (
          <>
            <Select
              className="w-36"
              onValueChange={(value) => {
                setSelectedSize(value);
              }}
            >
              <SelectTrigger className="w-full font-medium !text-paragraph bg-[#E8E8E8] rounded-lg h-12 flex items-center justify-between">
                <SelectValue placeholder="Select Size" />
                <p className="sr-only">Size</p>
              </SelectTrigger>
              <SelectContent>
                {image.resolutions &&
                  Object.entries(image.resolutions).map(([key, value]) => (
                    <SelectItem
                      className="!text-paragraph text-surface-500"
                      key={key}
                      value={key}
                    >
                      <span className="text-black capitalize font-medium">
                        {key}
                      </span>{" "}
                      - {((value.width * value.height) / 1000000).toFixed(1)} MP
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      <div className="flex flex-row gap-4 justify-center mt-32 mb-4">
        <p className="text-heading-06 font-semibold text-surface-600">
          Quantity:{" "}
        </p>
        <button
          onClick={() =>
            setSelectedQuantity(selectedQuantity > 1 ? selectedQuantity - 1 : 1)
          }
          className="w-8 h-8 pb-1 bg-primary text-white rounded-full hover:bg-primary-dark active:bg-primary-darker"
        >
          -
        </button>

        <p className="text-heading-06 font-semibold">{selectedQuantity}</p>
        <button
          onClick={() =>
            setSelectedQuantity(
              selectedQuantity < 10 ? selectedQuantity + 1 : 10
            )
          }
          className="w-8 h-8  bg-primary text-white rounded-full hover:bg-primary-dark active:bg-primary-darker"
        >
          +
        </button>
      </div>
      <div className="flex items-center w-full gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
        <button
          onClick={() => {
            inCart ? onRemoveFromCart(id) : onAddToCart();
          }}
          className={`${
            inCart
              ? "border-red-500 bg-white text-red-600 hover:bg-red-200"
              : "border-primary bg-primary text-white hover:bg-primary-dark"
          } flex w-full items-center gap-4 justify-center border-2 py-4 rounded-lg text-base sm:text-paragraph md:text-heading-05 lg:text-paragraph xl:text-heading-05 font-semibold transition-all duration-300 ease-in-out`}
        >
          <span className="flex justify-center items-center gap-2">
            <p className="w-fit">{inCart ? "Remove" : "Add to Cart"}</p>
            <ShoppingCart className="" strokeWidth={3} />
          </span>
        </button>
        <button className="btn-secondary flex-shrink-0 p-4 border-2 border-primary rounded-2xl h-full aspect-[1/1] flex items-center justify-center group">
          <Heart
            size={32}
            className="text-primary group-active:text-red-500 group-active:fill-red-500 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300 ease-in-out"
          />
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    fetchImage();
  }, [id]);

  useEffect(() => {
    fetchData(
      `${process.env.NEXT_PUBLIC_SERVER}/api/paper/get-paper`,
      "papers",
      setPapers,
      setError
    );
    fetchData(
      `${process.env.NEXT_PUBLIC_SERVER}/api/frames/get-frames`,
      "frames",
      setFrames,
      setError
    );

    setInCart(isItemInCart(id));
  }, []);

  return (
    <>
      {loading ? (
        <div
          className={`flex flex-col items-center justify-center min-h-[50vh]`}
        >
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {image && (
            <div className={`px-5 lg:px-20`}>
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
                          src={
                            image.imageLinks?.original ||
                            "/assets/images/img3.jpg"
                          }
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
                  {/* Mobile Desc */}
                  <div className="lg:hidden">{descriptionSection}</div>
                  <div className="flex justify-center mt-10 lg:hidden">
                    <button
                      onClick={() => {
                        setBuySectionActive(!buySectionActive);
                      }}
                      className="bg-primary w-full rounded-md text-white p-2 font-medium hover:bg-primary-dark active:bg-primary-darker"
                    >
                      Buy Now
                    </button>
                    {buySectionActive && (
                      <div className="fixed top-0 lg:hidden bg-white z-50 h-screen pt-20 px-4 w-screen">
                        <button
                          onClick={() => {
                            setBuySectionActive(false);
                          }}
                          className="absolute top-4 right-4 font-extrabold"
                        >
                          X
                        </button>
                        {buySection}
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block">{buySection}</div>
                </div>
              </div>
              {/* Desktop Desc */}
              <div className="hidden lg:block">{descriptionSection}</div>
              {/* {recommendedSection} */}
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
