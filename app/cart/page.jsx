"use client";

import useCartStore from "@/cartStore";
import Button from "@/components/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default function CartPage() {
  const { cart } = useCartStore();
  const [coupon, setCoupon] = React.useState("");
  return (
    <div className="flex flex-col px-32 gap-10 py-20">
      <h5 className="text-heading-05 font-bold">Cart ({cart?.length || 0})</h5>
      <div className="flex flex-col gap-12">
        <div className="px-6 flex shadow-[0_0_6px_rgba(0,_0,_0,_0.1)] rounded-sm p-5 text-heading-06 font-semibold">
          <div className="w-2/6">Product</div>
          <div className="w-1/6">Product Type</div>
          <div className="w-1/6">Price</div>
          <div className="w-1/6">Quantity</div>
          <div className="w-1/6">Subtotal</div>
        </div>
        {cart?.map((product) => (
          <div
            key={product._id}
            className="px-6 flex shadow-[0_0_6px_rgba(0,_0,_0,_0.1)] rounded-sm hover:shadow-[0_0_12px_rgba(0,_0,_0,_0.2)] p-4 transition-all duration-200 ease-in-out"
          >
            <div className="w-2/6 flex flex-row gap-4">
              <img
                src="/assets/images/img6.jpg"
                className="w-1/3"
                alt="Canvas Print 72x30"
              />
              <div className="flex flex-col">
                <p className="text-heading-06 font-semibold">
                  {product.title || "Art Name"}
                </p>
                <p className="text-sm font-medium text-surface-500">
                  {product.artist?.name || "Artist Name"}
                </p>
              </div>
            </div>
            <div className="w-1/6">
              <p className="text-heading-06 font-semibold">
                Canvas Print 72 x 30
              </p>
              <p className="text-sm font-medium text-surface-500">
                White Frame
              </p>
            </div>
            <div className="w-1/6 text-heading-06 font-medium text-surface-600">
              ₹30000
            </div>
            <div className="w-1/6 flex flex-col items-start gap-4">
              <div className="flex flex-row gap-4 text-heading-06 font-semibold">
                <button className="w-8 h-8 pb-3 bg-primary text-white rounded-full hover:bg-primary-dark active:bg-primary-darker">
                  -
                </button>
                1
                <button className="w-8 h-8  bg-primary text-white rounded-full hover:bg-primary-dark active:bg-primary-darker">
                  +
                </button>
              </div>
              <button className="text-primary text-start px-4 underline font-medium hover:text-red-500 active:text-red-700">
                Remove
              </button>
            </div>
            <div className="w-1/6 text-heading-06 font-medium text-surface-600">
              ₹30000
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center w-1/2 gap-2">
          <Input
            value={coupon}
            onChange={(e) => {
              setCoupon(e.target.value);
            }}
            className="w-1/2 h-10 !text-paragraph border-black"
            placeholder="Enter Coupon Code"
          />
          <Button className="font-medium">Apply Coupon</Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-heading-06 font-medium">Subtotal:</p>
          <p className="text-heading-06 font-medium text-surface-600 text-right">
            ₹30000
          </p>
          <p className="text-heading-06 font-medium">Shipping:</p>
          <p className="text-heading-06 font-medium text-surface-600 text-right">
            ₹0
          </p>
          <p className="text-heading-05 font-semibold">Cart Total:</p>
          <p className="text-heading-05 font-semibold text-surface-600 text-right">
            ₹30000
          </p>
        </div>
      </div>
    </div>
  );
}
