"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, ShoppingCart } from "lucide-react";
import useCartStore from "@/cartStore";

export default function ImagePage() {
  const id = useParams().id;
  const { addToCart, removeFromCart, cart } = useCartStore();

  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("print");

  const [selectedProduct, setSelectedProduct] = useState({});

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
            <div className="grid grid-cols-3 gap-16 px-20 py-20 bg-[#FBFBFB] -mt-2">
              <div className="relative aspect-[16/9] bg-white col-span-2 shadow-lg shadow-gray-500 flex items-center justify-center border border-gray-300">
                <Image
                  // src={image.imageLinks?.original || "/images/placeholder.jpg"}
                  src={"/assets/images/img3.jpg"}
                  alt={image.title || "Image"}
                  width={800}
                  height={800}
                />
              </div>
              <div className="">
                <div className="flex flex-col gap-2">
                  <h2 className="text-heading-02 font-semibold text-surface-600">
                    {image.title || "Artwork name"}
                  </h2>
                  <h5 className="text-heading-05 uppercase font-semibold text-surface-500">
                    Artist Name
                  </h5>
                  <h5 className="text-heading-05 uppercase font-bold text-surface-600">
                    ₹ 55,000
                  </h5>
                </div>
                <div className="relative flex flex-row items-center justify-between w-full py-5 my-10  rounded-full">
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
                      mode === "digital" ? "text-surface-500" : "text-zinc-100"
                    } text-center w-full cursor-pointer transition-colors duration-200 ease-in-out`}
                  >
                    Ready to Hang
                  </p>
                  <p
                    onClick={() => {
                      setMode("digital");
                    }}
                    className={`text-heading-06 drop-shadow-md z-10 font-bold ${
                      mode === "print" ? "text-surface-500" : "text-zinc-100"
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
                <div className="grid grid-cols-10 gap-10 mt-32">
                  <button
                    onClick={() => {
                      const isInCart = cart.some(
                        (item) => item._id === image._id
                      );
                      console.log("Is in cart:", isInCart); // Debugging: Check if the item is detected in the cart
                      console.log("Image ID:", image._id); // Debugging: Ensure the correct ID is being passed
                      isInCart ? removeFromCart(image._id) : addToCart(image);
                    }}
                    className={`col-span-8 flex items-center gap-4 justify-center border-2 border-primary py-5 ${
                      cart?.some((item) => item._id === image._id)
                        ? "bg-transparent  text-red-700 hover:bg-primary-100"
                        : "bg-primary text-white hover:bg-primary-dark hover:border-primary-dark"
                    } rounded-lg w-full text-heading-05 font-semibold transition-all duration-300 ease-in-out`}
                  >
                    <p>
                      {cart?.some((item) => item._id === image._id)
                        ? "Remove from Cart"
                        : "Add to Cart"}
                    </p>
                    <ShoppingCart scale={32} strokeWidth={3} />
                  </button>

                  <button className="col-span-2 btn-secondary p-4 border-2 border-primary rounded-2xl h-full aspect-[1/1] flex items-center justify-center group">
                    <Heart
                      size={32}
                      className="text-primary group-active:text-red-500 group-active:fill-red-500 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300 ease-in-out"
                    />
                  </button>
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
