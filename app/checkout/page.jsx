"use client";

import useAuthStore from "@/authStore";
import Button from "@/components/button";
import Loader from "@/components/loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCartStore from "@/store/cart";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { user, token } = useAuthStore();
  const { cartItems, removeItemFromCart } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    userId: "",
    imageInfo: { image: "", photographer: "", resolution: "", price: "" },
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
      country: "India",
    },
    totalAmount: "",
    orderStatus: "pending",
    invoiceId: "",
  });

  // console.log("cartItems", cartItems);
  // console.log("User", user);
  // console.log("orderData", orderData);

  const calculateSubtotal = () => {
    return cartItems?.reduce((acc, item) => acc + item.subTotal, 0);
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      for (const item of cartItems) {
        const orderDetails = {
          ...orderData,
          userId: user?._id,
          imageInfo: {
            image: item?._id,
            photographer: item?.photographer?._id,
            resolution:
              item?.mode === "print" ? "original" : item?.selectedSize,
            price: item?.subTotal,
          },
          frameInfo: {
            frame: item?.selectedFrame?._id,
            price: item?.selectedFrame?.price,
            size: item?.selectedFrame ? item.selectedSize : null,
          },
          paperInfo: {
            paper: item?.selectedPaper?._id,
            price: item?.selectedPaper?.price,
            size: item?.selectedPaper ? item.selectedSize : null,
          },
          subTotal: item?.subTotal,
          totalAmount: item?.subTotal + item?.subTotal * 0.18,
        };

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/api/download/create-order`,
          orderDetails,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        console.log("Order created for item", res.data);
        toast.success(`Order placed successfully for item: ${item.title}`);
        removeItemFromCart(item._id);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Something went wrong while creating orders");
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    const newSubtotal = calculateSubtotal();
    const newTotal = newSubtotal + newSubtotal * 0.18;

    setOrderData((prev) => ({
      ...prev,
      userId: user?._id,
      imageInfo: {
        image: cartItems[0]?._id,
        photographer: cartItems[0]?.photographer?._id,
        resolution:
          cartItems[0]?.mode === "print"
            ? "original"
            : cartItems[0]?.selectedSize,
        price: cartItems[0]?.subTotal,
      },
      frameInfo: {
        frame: cartItems[0]?.selectedFrame?._id,
        price: cartItems[0]?.selectedFrame?.price,
        size: cartItems[0]?.selectedFrame ? cartItems[0].selectedSize : null,
      },
      paperInfo: {
        paper: cartItems[0]?.selectedPaper?._id,
        price: cartItems[0]?.selectedPaper?.price,
        size: cartItems[0]?.selectedPaper ? cartItems[0].selectedSize : null,
      },
      subTotal: newSubtotal,
      paymentMethod: "Credit Card",
      shippingAddress: {
        ...prev.shippingAddress,
      },
      totalAmount: newTotal,
      orderStatus: "pending",
      invoiceId: "",
    }));
  }, [user, cartItems]);

  return (
    <div>
      <section className="bg-white py-8 antialiased d md:py-16">
        <form
          action={createOrder}
          className="mx-auto max-w-screen-xl px-4 2xl:px-0"
        >
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
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={user?.name || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Your Email*</Label>
                    <Input
                      type="email"
                      placeholder="name@mail.com"
                      value={orderData.shippingAddress.email || ""}
                      onChange={(e) =>
                        setOrderData((prev) => ({
                          ...prev,
                          shippingAddress: {
                            ...prev.shippingAddress,
                            email: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Label htmlFor="address">Address*</Label>
                    </div>
                    <Input
                      type="text"
                      placeholder="City"
                      value={orderData.shippingAddress.address || ""}
                      onChange={(e) =>
                        setOrderData((prev) => ({
                          ...prev,
                          shippingAddress: {
                            ...prev.shippingAddress,
                            address: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Label htmlFor="city">City*</Label>
                    </div>
                    <Input
                      type="text"
                      placeholder="City"
                      value={orderData.shippingAddress.city || ""}
                      onChange={(e) =>
                        setOrderData((prev) => ({
                          ...prev,
                          shippingAddress: {
                            ...prev.shippingAddress,
                            city: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State*</Label>
                    <Input
                      type="text"
                      placeholder="Uttar Pradesh"
                      required
                      value={orderData.shippingAddress.state || ""}
                      onChange={(e) =>
                        setOrderData((prev) => ({
                          ...prev,
                          shippingAddress: {
                            ...prev.shippingAddress,
                            state: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Label htmlFor="country">Country*</Label>
                    </div>
                    <Input
                      type="text"
                      placeholder="India"
                      value="India"
                      onChange={(e) =>
                        setOrderData((prev) => ({
                          ...prev,
                          shippingAddress: {
                            ...prev.shippingAddress,
                            country: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Label htmlFor="landmark">Landmark*</Label>
                    </div>
                    <Input
                      type="text"
                      placeholder="Landmark"
                      value={orderData.shippingAddress.landmark || ""}
                      onChange={(e) =>
                        setOrderData((prev) => ({
                          ...prev,
                          shippingAddress: {
                            ...prev.shippingAddress,
                            landmark: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number*</Label>
                    <div className="flex items-center">
                      <div className="relative w-full">
                        <Input
                          type="text"
                          placeholder="Phone"
                          value={orderData.shippingAddress.mobileNumber || ""}
                          onChange={(e) =>
                            setOrderData((prev) => ({
                              ...prev,
                              shippingAddress: {
                                ...prev.shippingAddress,
                                mobileNumber: e.target.value,
                              },
                            }))
                          }
                        />
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
                  {cartItems?.map((product) => (
                    <div
                      key={product._id}
                      className="px-6 flex gap-2 shadow-[0_0_6px_rgba(0,_0,_0,_0.1)] rounded-sm hover:shadow-[0_0_12px_rgba(0,_0,_0,_0.2)] p-4 transition-all duration-200 ease-in-out"
                    >
                      <div className="w-1/2 flex flex-col gap-4">
                        <Link
                          className=""
                          href={`/images/${product._id}`}
                          passHref
                        >
                          <img
                            src={
                              product.imageLinks.original ||
                              "/assets/images/img6.jpg"
                            }
                            alt="Canvas Print 72x30"
                          />
                        </Link>
                      </div>
                      <div className="sm:w-1/2 flex flex-col gap-2 border-b sm:border-b-0">
                        <div className="flex flex-col">
                          <p className="text-heading-06 font-semibold">
                            {product.title || "Art Name"}
                          </p>
                          <p className="text-sm font-medium text-surface-500">
                            {product.artist?.name || "Artist Name"}
                          </p>
                        </div>
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

                        <div className="flex justify-between">
                          <p className="sm:hidden">Price</p>
                          <p>₹{product.subTotal}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Subtotal
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      ₹{orderData.subTotal}
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
                      GST
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      ₹{orderData.subTotal * 0.18}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Total
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      ₹{orderData.totalAmount}
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
      {loading && (
        <div className="bg-gray-100 fixed h-screen w-screen top-0 left-0 z-50 flex items-center justify-center bg-opacity-50">
          <Loader />
        </div>
      )}
    </div>
  );
}
