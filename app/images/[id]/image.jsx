"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, ShoppingCart } from "lucide-react";
import useCartStore from "@/store/cart";
import "keen-slider/keen-slider.min.css";
import toast from "react-hot-toast";
import { fetchData } from "@/helpers/api";
import ImageSection from "@/components/image/imageSection";
import axios from "axios";
import useAuthStore from "@/authStore";
import { Icon } from "@iconify/react";
import Link from "next/link";
import RecommendedSection from "@/components/image/recommendedSection";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImageSkeleton from "./imageSkeleton";

export default function ImagePage({ image }) {
  const id = useParams().id;
  const { isHydrated } = useAuthStore();
  const { addItemToCart, removeItemFromCart, isItemInCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState("digital");
  const [papers, setPapers] = useState([]);
  const [frames, setFrames] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [desc, setDesc] = useState(true);
  const [buySectionActive, setBuySectionActive] = useState(false);
  const [subTotal, setSubTotal] = useState(image.price?.original || 0);
  const [inCart, setInCart] = useState(false);
  const [customSize, setCustomSize] = useState({
    width: 0,
    height: 0,
  });

  const onAddToCart = () => {
    if (mode === "print" && !selectedPaper) {
      toast.error("Please select a paper!");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    const productToAdd = {
      imageInfo: {
        image: image._id,
        title: image.title,
        photographer: image.photographer,
        resolution: selectedSize,
        price:
          mode === "print"
            ? image.price?.original
            : image.price?.[selectedSize],
        thumbnail: image.imageLinks?.thumbnail || image.imageLinks?.original,
      },
      paperInfo: selectedPaper
        ? {
            paper: selectedPaper._id,
            price: selectedSize.price,
            size: selectedSize,
            name: selectedPaper.name,
          }
        : null,
      frameInfo: selectedFrame
        ? {
            frame: selectedFrame._id,
            price:
              selectedSize?.width *
              selectedSize?.height *
              selectedFrame.basePricePerLinearInch,
            name: selectedFrame.name,
          }
        : null,
      subTotal: subTotal,
      mode,
      delivery:
        mode === "print" ? selectedSize?.width * selectedSize?.height : 0,
    };

    addItemToCart(productToAdd);
    setInCart(true);
    toast.success("Added to cart!");
  };

  const onRemoveFromCart = () => {
    removeItemFromCart(id, mode);
    toast.success("Removed from cart!");
    setInCart(isItemInCart(id, mode));
  };

  useEffect(() => {
    setInCart(isItemInCart(id, mode));
  }, [id, mode]);

  const images = [
    {
      src: image?.imageLinks?.thumbnail,
    },
    {
      src: "/assets/placeholders/Sofa Room Logo Mockup.jpg",
    },
  ];

  const handleMockup = () => {
    setSelected(1);
    setSelectedPaper(papers[0]);
    setSelectedSize(papers[0]?.customDimensions[0]);
    setMode("print");
  };

  const handleDigital = () => {
    setSelected(0);
    setSelectedPaper(null);
    setSelectedSize("original");
    setSelectedFrame(null);
    setMode("digital");
  };

  const calculateSubtotal = () => {
    if (selectedSize) {
      if (mode === "print") {
        const width = selectedSize?.width || 0;
        const height = selectedSize?.height || 0;
        const framePrice = selectedFrame
          ? width * height * selectedFrame.basePricePerLinearInch
          : 0;

        const imagePrice = 0;
        const selectedSizePrice = selectedSize?.price || 0;

        return (
          imagePrice +
          selectedSizePrice +
          framePrice +
          (selectedPaper?.price || 0)
        );
      } else {
        return image.price?.[selectedSize] || 0;
      }
    } else {
      return image.price?.original || 0;
    }
  };

  useEffect(() => {
    setSubTotal(calculateSubtotal());
  }, [selectedSize, selectedPaper, selectedFrame, mode, image]);

  const toastShownRef = useRef(false);

  const handlePaperChange = (paper) => {
    setSelectedSize(paper.customDimensions[0]);
    setCustomSize({
      width: 0,
      height: 0,
    });
    setSelectedPaper(paper);
  };

  useEffect(() => {
    if (!isHydrated || toastShownRef.current) return;

    const addViewCount = async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/api/images/add-image-views-count`,
          { imageId: id }
        );
        toastShownRef.current = true;
      } catch (error) {
        console.log("Error adding view count", error);
      }
    };
    addViewCount();
  }, [isHydrated, id]);

  useEffect(() => {
    const fetch = async () => {
      await fetchData(`paper/get-paper`, "papers", setPapers);
      setPapers((prev) => {
        return prev.sort((a, b) => a.name.localeCompare(b.name));
      });
      await fetchData(`frames/get-frames`, "frames", setFrames);
      setFrames((prev) => {
        return prev.sort((a, b) => a.name.localeCompare(b.name));
      });
      setSubTotal(image.price?.original);
      setLoading(false);
    };

    fetch();
    handleDigital();
  }, []);

  const descriptionSection = (
    <div className="flex flex-col gap-2 mt-5 bg-zinc-100 pb-5 rounded-md shadow-md px-4">
      <div className="flex flex-row gap-5 text-sm sm:text-paragraph md:text-heading-06 lg:text-heading-05 xl:text-heading-04 z-10">
        <motion.p
          layout
          onClick={() => {
            setDesc(true);
          }}
          className={`font-medium ${
            desc
              ? "text-black font-semibold underline decoration-2 underline-offset-[10px]"
              : "text-surface-600"
          } cursor-default`}
        >
          Image Description
        </motion.p>
      </div>
      <hr className="border-surface-200 z-0 -translate-y-1" />
      <AnimatePresence mode="popLayout">
        <motion.div layout key={desc} className="flex flex-col gap-5">
          {desc && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              className="text-xs sm:text-sm md:text-heading-06 lg:text-heading-05 font-medium text-surface-600 min-h-20 "
            >
              {image.description || "..."}
              <div className="flex flex-wrap items-start justify-start gap-4">
                {image.location && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:round-location-on" />
                    <p>Location: {image.location}</p>
                  </div>
                )}
                {image.cameraDetails?.camera && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:outline-camera-alt" />
                    <p>Camera: {image.cameraDetails?.camera}</p>
                  </div>
                )}
                {image.cameraDetails?.lens && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:outline-lens" />
                    <p>Lens: {image.cameraDetails?.lens}</p>
                  </div>
                )}
                {image.cameraDetails?.settings?.aperture && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:round-camera" />
                    <p>Aperture: {image.cameraDetails?.settings?.aperture}</p>
                  </div>
                )}
                {image.cameraDetails?.settings?.shutterSpeed && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:round-shutter-speed" />
                    <p>
                      Shutter Speed:{" "}
                      {image.cameraDetails?.settings?.shutterSpeed}
                    </p>
                  </div>
                )}
                {image.cameraDetails?.settings?.iso && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:round-iso" />
                    <p>ISO: {image.cameraDetails?.settings?.iso}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const buySection = (
    <div className="flex flex-col">
      <h5 className="text-heading-05 uppercase font-bold text-surface-600">
        ₹ {subTotal}
      </h5>
      <div className="flex flex-row relative items-center justify-between w-full py-5 my-10 rounded-full">
        <div
          className={`absolute inset-0 bg-primary-100 shadow-inner inner-shadow rounded-full`}
        ></div>
        <motion.div
          layout
          className={`absolute inset-y-0 z-0 bg-gradient-to-t ${
            mode === "print" && "right-0"
          } from-[#897F75] to-[#BCB0A4] inner-shadow-2 w-1/2 h-full rounded-full`}
        ></motion.div>
        <p
          onClick={() => {
            setMode("digital");
            handleDigital();
          }}
          className={`text-base md:text-paragraph lg:text-base xl:text-heading-06 drop-shadow-md z-10 font-bold ${
            mode === "print" ? "text-surface-500" : "text-zinc-100"
          } text-center w-full cursor-pointer transition-colors duration-200 ease-in-out`}
        >
          Digital Copy
        </p>
        <p
          onClick={() => {
            setMode("print");
            handleMockup();
          }}
          className={`text-base md:text-paragraph lg:text-base xl:text-heading-06 drop-shadow-md z-10 font-bold ${
            mode === "digital" ? "text-surface-500" : "text-zinc-100"
          } text-center w-full cursor-pointer transition-colors duration-200 ease-in-out`}
        >
          Ready to Hang
        </p>
      </div>
      <div className="flex flex-col gap-10">
        {mode === "print" && (
          <>
            <Select
              className="w-36"
              onValueChange={(value) => {
                setSelectedPaper(value);
                handlePaperChange(value);
              }}
            >
              <SelectTrigger className="w-full font-medium !text-paragraph bg-[#E8E8E8] rounded-lg h-12 flex items-center justify-between">
                <SelectValue
                  placeholder={selectedPaper?.name || "Select Paper"}
                />
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

            <a
              href="/support/printing-guide"
              target="_blank"
              className="text-blue-600 -mt-8"
            >
              Printing Guide
            </a>
            <div>
              <Select
                className="w-36"
                value={JSON.stringify(selectedSize)} // Serialized value
                onValueChange={(value) => {
                  setSelectedSize(JSON.parse(value)); // Deserialize value on change
                }}
              >
                <SelectTrigger className="w-full font-medium !text-paragraph bg-[#E8E8E8] rounded-lg h-12 flex items-center justify-between">
                  {/* Manually display selectedSize */}
                  <span>
                    {selectedSize?.width && selectedSize?.height
                      ? `${selectedSize.width} x ${selectedSize.height} in`
                      : "Select Size"}
                  </span>
                  <p className="sr-only">Size</p>
                </SelectTrigger>
                <SelectContent>
                  {selectedPaper?.customDimensions.map((size) => (
                    <SelectItem
                      className="!text-paragraph"
                      key={size._id}
                      value={JSON.stringify(size)} // Serialize options
                    >
                      {size.width} x {size.height} in
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger className="w-full pl-2 !text-paragraph rounded-lg h-12 flex items-center justify-between">
                  Custom Size
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Custom Size</DialogTitle>
                    <div className="flex flex-col gap-4">
                      <div className="space-y-2">
                        <Label>
                          Width (max.{" "}
                          {
                            selectedPaper?.customDimensions[
                              selectedPaper?.customDimensions.length - 1
                            ]?.width
                          }{" "}
                          in)
                        </Label>
                        <Input
                          type="number"
                          placeholder="Width"
                          value={customSize.width || ""}
                          onChange={(e) => {
                            const inputValue = Number(e.target.value);
                            const maxWidth =
                              selectedPaper?.customDimensions[
                                selectedPaper?.customDimensions.length - 1
                              ]?.width || Infinity;
                            setCustomSize({
                              ...customSize,
                              width: Math.min(inputValue, maxWidth),
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height (max. 80 in)</Label>
                        <Input
                          type="number"
                          placeholder="Height"
                          value={customSize.height || ""}
                          onChange={(e) => {
                            const inputValue = Number(e.target.value);
                            setCustomSize({
                              ...customSize,
                              height: Math.min(inputValue, 80),
                            });
                          }}
                        />
                      </div>
                    </div>
                  </DialogHeader>
                  <DialogClose
                    onClick={() => {
                      if (customSize.width < 12 || customSize.height < 12) {
                        toast.error("Minimum size is 12 x 12 inches");
                        return;
                      }
                      const newSize = {
                        width: customSize.width,
                        height: customSize.height,
                        price:
                          selectedPaper.basePricePerSquareInch *
                          customSize.width *
                          customSize.height,
                      };
                      setSelectedSize(newSize); // Update selected size
                    }}
                  >
                    Save
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>

            <Select
              className="w-36"
              onValueChange={(value) => {
                setSelectedFrame(value);
              }}
            >
              <SelectTrigger className="w-full font-medium !text-paragraph bg-[#E8E8E8] rounded-lg h-12 flex items-center justify-between">
                <SelectValue
                  placeholder={selectedFrame?.name || "Select Frame"}
                />
                <p className="sr-only">Frame</p>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>No Frame</SelectItem>
                {selectedPaper && (
                  <>
                    {frames.map((frame) => (
                      <SelectItem key={frame._id} value={frame}>
                        {frame.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </>
        )}
        {mode === "digital" && (
          <>
            <Select
              className="w-36"
              value={selectedSize}
              onValueChange={(value) => {
                setSelectedSize(value);
              }}
            >
              <SelectTrigger className="w-full font-medium !text-paragraph bg-[#E8E8E8] rounded-lg h-12 flex items-center justify-between capitalize">
                <SelectValue placeholder={"Select Size"} />
                <p className="sr-only">Size</p>
              </SelectTrigger>
              <SelectContent>
                {image.price &&
                  Object.entries(image.price).map(([key, value]) => {
                    const resolution = image.resolutions?.[key];

                    return resolution ? (
                      <SelectItem
                        className="!text-paragraph text-surface-500"
                        key={key}
                        value={key}
                      >
                        <span className="text-black capitalize font-medium">
                          {key}
                        </span>{" "}
                        -{" "}
                        {(
                          (resolution.width * resolution.height) /
                          1000000
                        ).toFixed(1)}{" "}
                        MP - {resolution.width} x {resolution.height} px
                      </SelectItem>
                    ) : null;
                  })}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      <div className="mt-10 flex items-center w-full gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
        {inCart ? (
          <>
            <Link
              href="/cart"
              className={`border-primary bg-white text-primary-dark hover:bg-primary-100 flex w-full items-center gap-4 justify-center border-2 py-4 rounded-lg text-base sm:text-paragraph md:text-heading-05 lg:text-paragraph xl:text-heading-05 font-semibold transition-all duration-300 ease-in-out`}
            >
              <span className="flex justify-center items-center gap-2">
                <p className="w-fit">Visit Cart</p>
                <ShoppingCart className="" strokeWidth={3} />
              </span>
            </Link>
            <Link
              href="/images"
              className={`border-primary bg-white text-primary-dark hover:bg-primary-100 flex w-full items-center gap-4 justify-center border-2 py-4 rounded-lg text-base sm:text-paragraph md:text-heading-05 lg:text-paragraph xl:text-heading-05 font-semibold transition-all duration-300 ease-in-out`}
            >
              <span className="flex justify-center items-center gap-2">
                <p className="w-fit">Browse More</p>
              </span>
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              inCart ? onRemoveFromCart(id) : onAddToCart();
            }}
            className={`border-primary bg-primary text-white hover:bg-primary-dark flex w-full items-center gap-4 justify-center border-2 py-4 rounded-lg text-base sm:text-paragraph md:text-heading-05 lg:text-paragraph xl:text-heading-05 font-semibold transition-all duration-300 ease-in-out`}
          >
            <span className="flex justify-center items-center gap-2">
              <p className="w-fit">Add to Cart</p>
              <ShoppingCart className="" strokeWidth={3} />
            </span>
          </button>
        )}
        <button className="btn-secondary flex-shrink-0 p-4 border-2 border-primary rounded-2xl h-full aspect-[1/1] flex items-center justify-center group">
          <Heart
            size={32}
            className="text-primary group-active:text-red-500 group-active:fill-red-500 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300 ease-in-out"
          />
        </button>
      </div>
    </div>
  );

  const minSize = 12 * 18;
  const maxSize = 44 * 72;

  const dynamicHeight =
    selectedPaper && selectedSize
      ? (selectedSize.height * selectedSize.width - minSize) /
        (maxSize - minSize)
      : 0;

  const clampedHeight =
    selectedPaper && selectedSize ? 22 + dynamicHeight * (35 - 22) : 100;

  const height = clampedHeight + "%";

  console.log(selectedSize);

  return (
    <>
      {loading ? (
        <ImageSkeleton />
      ) : (
        <>
          {image.length !== 0 ? (
            <div className={`px-5 lg:px-20`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 pt-10 bg-[#FBFBFB] -mt-2">
                <div className="lg:col-span-2 flex flex-col gap-10  h-full">
                  <motion.div
                    layout
                    className="flex justify-center sticky top-32"
                  >
                    <motion.div
                      layout
                      style={{
                        aspectRatio:
                          selectedPaper &&
                          selectedSize &&
                          `${
                            image.resolutions?.thumbnail?.width >
                            image.resolutions?.thumbnail?.height
                              ? selectedSize.height
                              : selectedSize.width
                          }/${
                            image.resolutions?.thumbnail?.width >
                            image.resolutions?.thumbnail?.height
                              ? selectedSize.width
                              : selectedSize.height
                          }`,
                        height: selectedSize ? height : "100%",
                      }}
                      className={`${
                        selectedPaper &&
                        selectedSize &&
                        `mt-[4%] w-auto -ml-[10%]`
                      } absolute inset-y-0 z-10 shadow-[2px_2px_6px_rgba(0,0,0,0.7)]`}
                    >
                      <ImageSection
                        selectedFrame={selectedFrame}
                        image={image}
                      />
                    </motion.div>

                    <AnimatePresence mode="popLayout">
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Image
                          src="/assets/placeholders/Sofa Room Logo Mockup.jpg"
                          alt="mockup"
                          priority
                          width={800}
                          height={400}
                          className={`w-full h-full object-cover ${
                            selectedPaper && selectedSize
                              ? "opacity-100"
                              : "opacity-0"
                          } transition-all duration-300 ease-in-out`}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
                <div className="">
                  <div className="flex gap-4">
                    <div
                      className={`border-4 ${
                        !selectedPaper
                          ? "border-blue-400"
                          : "border-transparent"
                      }`}
                      onClick={handleDigital}
                    >
                      <img
                        className="object-cover h-24 w-40 border-4 border-white shadow-[0_0_4px_rgba(0,0,0,0.7)]"
                        src={images[0].src}
                        alt=""
                      />
                    </div>
                    <div
                      className={`border-4 ${
                        selectedPaper ? "border-blue-400" : "border-transparent"
                      }`}
                      onClick={handleMockup}
                    >
                      <Image
                        width={400}
                        height={400}
                        className="object-cover h-24 w-40 border-4 border-white shadow-[0_0_4px_rgba(0,0,0,0.7)]"
                        src={images[1].src}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-heading-06 lg:text-heading-02 font-semibold text-surface-600 capitalize">
                      {image.title || "Artwork name"}
                    </h2>
                    <h5 className="text-heading-sm lg:text-heading-05 uppercase font-semibold text-surface-500">
                      {image.photographer?.firstName
                        ? image.photographer?.firstName +
                          " " +
                          image.photographer?.lastName
                        : image.photographer?.name || "Photographer name"}
                    </h5>
                    <div>
                      {mode === "digital" ? (
                        <p className="text-sm lg:text-base font-medium lg:font-semibold text-surface-600">
                          {image?.resolutions[selectedSize]?.width} x{" "}
                          {image?.resolutions[selectedSize]?.height}px
                        </p>
                      ) : (
                        <div>
                          <p className="text-sm lg:text-base font-medium lg:font-semibold text-surface-600">
                            {image?.resolutions?.thumbnail?.width} x{" "}
                            {image?.resolutions?.thumbnail?.height} px
                          </p>
                          <p className="text-sm lg:text-base font-medium lg:font-semibold text-surface-600">
                            Size: {selectedSize?.width} x {selectedSize?.height}{" "}
                            in
                          </p>
                          <p className="text-sm lg:text-base font-medium lg:font-semibold text-surface-600">
                            DPI:{" "}
                            {image?.resolutions?.thumbnail?.width >
                            image?.resolutions?.thumbnail?.height
                              ? Math.floor(
                                  (image?.resolutions?.thumbnail?.width /
                                    selectedSize?.width) *
                                    100
                                ) / 100
                              : Math.floor(
                                  (image?.resolutions?.thumbnail?.height /
                                    selectedSize?.height) *
                                    100
                                ) / 100}
                            {/* {Math.floor((image?.resolutions.original?.width /
                              selectedSize?.width +
                              image?.resolutions.original?.height /
                                selectedSize?.height) /
                              2)} */}
                          </p>
                        </div>
                      )}
                      <hr />
                    </div>
                    <h5 className="lg:hidden text-paragraph lg:text-heading-05 uppercase font-semibold lg:font-bold text-surface-600">
                      ₹ {subTotal}
                    </h5>
                  </div>
                  {/* Mobile Desc */}
                  <div className="lg:hidden">{descriptionSection}</div>
                  {
                    <>
                      <div className="flex justify-center mt-10 lg:hidden">
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
                    </>
                  }
                  <div className="hidden lg:block">{buySection}</div>
                </div>
              </div>
              {/* Desktop Desc */}
              <div className="hidden lg:block">{descriptionSection}</div>
              <RecommendedSection category={image.category[0].name} id={id} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <p>Image not Found</p>
            </div>
          )}
          <div className="lg:hidden w-full p-4 sticky bottom-0 z-20">
            <button
              onClick={() => {
                setBuySectionActive(!buySectionActive);
              }}
              className="bg-primary w-full rounded-md shadow-[2px_2px_4px_rgba(0,0,0,0.4)] text-white p-2 font-medium hover:bg-primary-dark active:bg-primary-darker"
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </>
  );
}
