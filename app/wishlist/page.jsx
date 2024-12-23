"use client";

import useAuthStore from "@/authStore";
import useCartStore from "@/cartStore";
import Button from "@/components/button";
import useWishlistStore from "@/wishlistStore";
import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { user } = useAuthStore();
  const { wishlist, fetchWishlist, loading, error } = useWishlistStore();
  const { addToCart, removeFromCart, cart } = useCartStore();
  console.log({ wishlist, loading, error });

  const removeImageFromWishlist = async (imageId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/remove-images-from-wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?._id,
            imageIds: [imageId],
          }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        toast.error("Error removing image from wishlist");
      }
      toast.success("Image removed from wishlist");
      fetchWishlist(user?._id);
    } catch (error) {
      console.error("Error removing image from wishlist:", error);
    }
  };

  return (
    <div className="flex flex-col gap-10 px-40 py-20">
      <div className="flex justify-between items-center">
        <h5 className="text-heading-05 font-bold">
          Wishlist ({wishlist?.length})
        </h5>
        <Button>Move All To Bag</Button>
      </div>
      <div className="grid grid-cols-4 gap-10">
        {wishlist.map((item) => (
          <motion.div
            layout
            key={item._id}
            className="flex flex-col shadow-[2px_2px_6px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_12px_rgba(0,0,0,0.3)] rounded-sm p-4"
          >
            <img
              className="w-full aspect-[1/1] mb-4"
              src={item.image || "/assets/images/img6.jpg"}
              alt={item.title}
            />
            <h5 className="text-heading-06 text-surface-600 font-semibold">
              {item.title || "Art Name"}
            </h5>
            <p className="text-sm font-medium text-surface-500">
              {item.artist?.name || "Artist name"}
            </p>
            <p className="text-sm font-medium text-surface-500">
              {(
                (item.resolutions?.original?.height *
                  item.resolutions?.original?.width) /
                1000000
              ).toFixed(1)}{" "}
              MP
            </p>
            <p className="text-base font-medium text-surface-600">
              ₹{item.price.original}
            </p>
            <div className="flex gap-4 mx-auto">
              <button
                onClick={() => {
                  const isInCart = cart.some(
                    (product) => product._id === item._id
                  );
                  isInCart ? removeFromCart(item._id) 
                  
                  : addToCart(item);
                }}
                className="font-medium hover:bg-green-100 text-surface-600 border border-surface-600 p-2 rounded-md"
              >
                {cart?.some((product) => product._id === item._id)
                  ? "Remove from Cart"
                  : "Add to Cart"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImageFromWishlist(item._id);
                }}
                className="font-medium hover:bg-red-100 text-red-500 border border-red-500 p-2 rounded-md"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
