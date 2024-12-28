"use client";

import useAuthStore from "@/authStore";
import Button from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import useCartStore from "@/store/cart";
import { CheckCircle2 } from "lucide-react";
import React, { use, useEffect, useState } from "react";

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const { cartItems, setCartItems } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [cartItems, setCartItems] = useState([]);
  const [orderData, setOrderData] = useState({
    userId: "",
    imageInfo: {
      image: "",
      photographer: "",
      resolution: "",
      price: "",
    },
    frameInfo: {
      frame: "",
      price: "",
      size: "",
    },
    paperInfo: {
      paper: "",
      price: "",
      size: "",
    },
    subTotal: "",
    paymentMethod: "",
    shippingAddress: {
      address: "",
      city: "",
      landmark: "",
      area: "",
      mobileNumber: "",
      email: "",
      pincode: "",
      state: "",
    },
    totalAmount: "",
    orderStatus: "pending",
    invoiceId: "",
  });

  console.log("cartItems", cartItems);
  console.log("User", user);
  console.log("orderData", orderData);

  useEffect(() => {
    if (user) {
      setOrderData((prev) => ({
        ...prev,
        userId: user._id,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length > 0) {
      const imageInfo = {
        image: cartItems[0]._id,
        photographer: cartItems[0].artist?.name,
        resolution: `${cartItems[0].selectedSize.width} x ${cartItems[0].selectedSize.height}`,
        price: cartItems[0].price[cartItems[0].selectedSize],
      };
      setOrderData((prev) => ({
        ...prev,
        imageInfo,
      }));
    }

    const subTotal = cartItems.reduce((acc, item) => {
      return acc + item.price[item.selectedSize] * item.quantity;
    }, 0);
    setOrderData((prev) => ({
      ...prev,
      subTotal,
    }));
  }, [cartItems]);
  return (
    <div>
      <section className="bg-white py-8 antialiased d md:py-16">
        <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500  sm:text-base">
            <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200  sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center">
                <CheckCircle2 className="me-2 h-4 w-4 sm:h-5 sm:w-5" />
                Cart
              </span>
            </li>
            <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center">
                <CheckCircle2 className="me-2 h-4 w-4 sm:h-5 sm:w-5" />
                Checkout
              </span>
            </li>
            <li className="flex shrink-0 items-center">
              <CheckCircle2 className="me-2 h-4 w-4 sm:h-5 sm:w-5" />
              Order summary
            </li>
          </ol>
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Delivery Details
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input type="text" placeholder="Full Name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Your Email*</Label>
                    <Input type="email" placeholder="name@mail.com" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Label htmlFor="address">Address*</Label>
                    </div>
                    <Input type="text" placeholder="City" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Label htmlFor="city">City*</Label>
                    </div>
                    <Input type="text" placeholder="City" />
                  </div>
                  <div>
                    <Label htmlFor="state">State*</Label>
                    <Input
                      type="text"
                      placeholder="Uttar Pradesh"
                      required=""
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Label htmlFor="country">Country*</Label>
                    </div>
                    <Input type="text" placeholder="India" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Label htmlFor="landmark">Landmark*</Label>
                    </div>
                    <Input type="text" placeholder="Landmark" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number*</Label>
                    <div className="flex items-center">
                      <div className="relative w-full">
                        <Input type="text" placeholder="Phone" required="" />
                      </div>
                    </div>
                  </div>
                  {/* <div>
                    <Label htmlFor="gst">GST number</Label>
                    <Input type="text" placeholder="DE42313253" required="" />
                  </div> */}
                </div>
              </div>
              <div>
                <Label htmlFor="voucher">
                  Enter a gift card, voucher or promotional code
                </Label>
                <div className="flex max-w-md items-center gap-4">
                  <Input
                    type="text"
                    id="voucher"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder=""
                    required=""
                  />
                  <Button type="button">Apply</Button>
                </div>
              </div>
            </div>
            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
              <div className="flow-root">
                <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Subtotal
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      $8,094.00
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Savings
                    </dt>
                    <dd className="text-base font-medium text-green-500">0</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Store Pickup
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      $99
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Tax
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      $199
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Total
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      $8,392.00
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="space-y-3">
                <Button type="submit">Proceed to Payment</Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
