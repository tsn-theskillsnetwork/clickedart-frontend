"use client";

import useCartStore from "@/store/cart";
import Button from "@/components/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import useAuthStore from "@/authStore";

export default function CartPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { removeItemFromCart, cartItems, clearCart } = useCartStore();
  const [coupon, setCoupon] = React.useState("");

  const onRemoveItem = (id, mode) => {
    removeItemFromCart(id, mode);
    toast.success("Removed from cart!");
  };

  console.log(cartItems);

  const calculateTotal = () => {
    return cartItems?.reduce((acc, item) => acc + item.subTotal, 0);
  };

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 gap-10 py-20">
      <h5 className="text-heading-05 font-bold">
        Cart ({cartItems?.length || 0})
      </h5>
      <div className="flex flex-col gap-12">
        <div className="px-6 hidden sm:flex shadow-[0_0_6px_rgba(0,_0,_0,_0.1)] rounded-sm p-5 text-heading-06 font-semibold">
          <div className="w-2/5">Product</div>
          <div className="w-1/5">Product Type</div>
          <div className="w-1/5">Price</div>
          <div className="w-1/5">Subtotal</div>
        </div>
        {cartItems?.map((product, index) => (
          <div
            key={index}
            className="px-6 flex flex-col gap-2 sm:gap-0 sm:flex-row shadow-[0_0_6px_rgba(0,_0,_0,_0.1)] rounded-sm hover:shadow-[0_0_12px_rgba(0,_0,_0,_0.2)] p-4 transition-all duration-200 ease-in-out"
          >
            <div className="sm:w-2/5 flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/3 flex flex-col gap-2">
                <Link href={`/images/${product._id}`} passHref>
                  <img
                    src={
                      product.imageInfo?.thumbnail || "/assets/images/img6.jpg"
                    }
                    alt="Canvas Print 72x30"
                  />
                </Link>
                <button
                  onClick={() => onRemoveItem(product.imageInfo?.image, product.mode)}
                  className="text-red-600 font-medium"
                >
                  Remove
                </button>
              </div>
              <div className="flex flex-col">
                <p className="text-heading-06 font-semibold capitalize">
                  {product.imageInfo?.title || "Art Name"}
                </p>
                <p className="text-sm font-medium text-surface-500">
                  {product.imageInfo?.photographer?.firstName
                    ? product.imageInfo?.photographer?.firstName +
                      " " +
                      product.imageInfo?.photographer?.lastName
                    : product.imageInfo?.photographer?.name}
                </p>
              </div>
            </div>
            <div className="sm:w-1/5 flex flex-col gap-2 border-b sm:border-b-0">
              {product.mode === "print" ? (
                <>
                  <p className="text-heading-06 font-semibold">
                    {product.paperInfo?.size?.width} x{" "}
                    {product.paperInfo?.size?.height} in
                  </p>
                  <p className="text-sm font-medium text-surface-500">
                    {product.paperInfo?.name}
                  </p>
                  <p className="text-sm font-medium text-surface-500">
                    {product.frameInfo?.name}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-heading-06 font-semibold capitalize">
                    {product.imageInfo?.resolution} Size
                  </p>
                  <p className="text-sm font-medium text-surface-500">
                    Digital Download
                  </p>
                </>
              )}
            </div>
            <div className="sm:w-1/5 text-heading-06 font-medium text-surface-600">
              <div className="flex justify-between">
                <p className="sm:hidden">Price</p>
                <p>₹{product.subTotal}</p>
              </div>
            </div>
            <div className="sm:w-1/5 text-heading-06 font-medium text-surface-600">
              <div className="flex justify-between">
                <p className="sm:hidden">Subtotal</p>
                <p>₹{product.subTotal}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-10">
        <div className="flex flex-row items-center justify-center sm:justify-start sm:w-1/2 gap-2">
          <Input
            value={coupon}
            onChange={(e) => {
              setCoupon(e.target.value);
            }}
            className="w-1/2 h-10 !text-paragraph border-black"
            placeholder="Coupon Code"
          />
          <Button className="font-medium">Apply Coupon</Button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <p className="text-heading-06 font-medium">Subtotal:</p>
            <p className="text-heading-06 font-medium text-surface-600 text-right">
              ₹{calculateTotal()}
            </p>
            {/* <p className="text-heading-06 font-medium">Shipping:</p>
            <p className="text-heading-06 font-medium text-surface-600 text-right">
              ₹0
            </p> */}
            <p className="text-heading-05 font-semibold">Cart Total:</p>
            <p className="text-heading-05 font-semibold text-surface-600 text-right">
              ₹{calculateTotal()}
            </p>
          </div>
          <Button
            onClick={() => {
              router.push("/checkout");
            }}
            size="lg"
            className="font-semibold"
          >
            Checkout
          </Button>
          <button className="font-semibold text-paragraph p-3 rounded-md text-surface-500 border border-surface-600 hover:bg-surface-200">
            Continue Shopping
          </button>
          <button
            onClick={clearCart}
            className="font-semibold text-red-600 p-3 rounded-md border border-red-600 hover:bg-red-600 hover:text-white"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
