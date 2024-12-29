"use client";

import useCartStore from "@/store/cart";
import Button from "@/components/button";
import { Input } from "@/components/ui/input";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { increaseQuantity, decreaseQuantity, removeItemFromCart, cartItems } =
    useCartStore();
  const [coupon, setCoupon] = React.useState("");

  const onIncreaseQuantity = (productId) => {
    increaseQuantity(productId);
  };

  const onDecreaseQuantity = (productId) => {
    decreaseQuantity(productId);
  };

  const calculateSubtotal = (product) => {
    return product.subTotal * product.quantity;
  };

  const calculateTotal = () => {
    return cartItems?.reduce((acc, item) => acc + calculateSubtotal(item), 0);
  };

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 gap-10 py-20">
      <h5 className="text-heading-05 font-bold">
        Cart ({cartItems?.length || 0})
      </h5>
      <div className="flex flex-col gap-12">
        <div className="px-6 hidden sm:flex shadow-[0_0_6px_rgba(0,_0,_0,_0.1)] rounded-sm p-5 text-heading-06 font-semibold">
          <div className="w-2/6">Product</div>
          <div className="w-1/6">Product Type</div>
          <div className="w-1/6">Price</div>
          <div className="w-1/6">Quantity</div>
          <div className="w-1/6">Subtotal</div>
        </div>
        {cartItems?.map((product) => (
          <div
            key={product._id}
            className="px-6 flex flex-col gap-2 sm:gap-0 sm:flex-row shadow-[0_0_6px_rgba(0,_0,_0,_0.1)] rounded-sm hover:shadow-[0_0_12px_rgba(0,_0,_0,_0.2)] p-4 transition-all duration-200 ease-in-out"
          >
            <div className="sm:w-2/6 flex flex-col sm:flex-row gap-4">
              <Link className="sm:w-1/3" href={`/images/${product._id}`} passHref>
                <img
                  src={product.imageLinks.original || "/assets/images/img6.jpg"}
                  alt="Canvas Print 72x30"
                />
              </Link>
              <div className="flex flex-col">
                <p className="text-heading-06 font-semibold">
                  {product.title || "Art Name"}
                </p>
                <p className="text-sm font-medium text-surface-500">
                  {product.artist?.name || "Artist Name"}
                </p>
              </div>
            </div>
            <div className="sm:w-1/6 flex flex-col gap-2 border-b sm:border-b-0">
              {product.mode === "print" ? (
                <>
                  <p className="text-heading-06 font-semibold">
                    {product.selectedPaper.name}
                  </p>
                  <p className="text-heading-06 font-semibold">
                    {product.selectedSize?.width} x{" "}
                    {product.selectedSize?.height} in
                  </p>
                  <p className="text-sm font-medium text-surface-500">
                    {product.selectedFrame?.name}
                  </p>
                </>
              ) : (
                <p className="text-heading-06 font-semibold">
                  Digital Download
                </p>
              )}
            </div>
            <div className="sm:w-1/6 text-heading-06 font-medium text-surface-600">
              <div className="flex justify-between">
                <p className="sm:hidden">Price</p>
                <p>₹{product.subTotal}</p>
              </div>
            </div>
            <div className="sm:w-1/6 flex flex-col sm:items-start gap-4">
              <div className="flex justify-between">
                <p className="sm:hidden text-heading-06 font-medium text-surface-600">
                  Quantity
                </p>
                <div className="flex flex-row gap-4 text-heading-06 font-semibold">
                  <button
                    onClick={() => onDecreaseQuantity(product._id)}
                    className="w-8 h-8 pb-3 bg-primary text-white rounded-full hover:bg-primary-dark active:bg-primary-darker"
                  >
                    -
                  </button>
                  {product.quantity}
                  <button
                    onClick={() => onIncreaseQuantity(product._id)}
                    className="w-8 h-8  bg-primary text-white rounded-full hover:bg-primary-dark active:bg-primary-darker"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="sm:w-1/6 text-heading-06 font-medium text-surface-600">
              <div className="flex justify-between">
                <p className="sm:hidden">Subtotal</p>
                <p>₹{calculateSubtotal(product)}</p>
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
            <p className="text-heading-06 font-medium">Shipping:</p>
            <p className="text-heading-06 font-medium text-surface-600 text-right">
              ₹0
            </p>
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
        </div>
      </div>
    </div>
  );
}
