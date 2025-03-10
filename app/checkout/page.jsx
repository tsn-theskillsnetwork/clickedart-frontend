"use client";

import useAuthStore from "@/authStore";
import Button from "@/components/button";
import Loader from "@/components/loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCartStore from "@/store/cart";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRazorpay } from "react-razorpay";
import Swal from "sweetalert2";

export default function CheckoutPage() {
  const { user, photographer, token, isHydrated } = useAuthStore();
  const { cartItems, clearCart } = useCartStore();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [platformCharges, setPlatformCharges] = useState(0);
  const [orderData, setOrderData] = useState({
    userId: null,
    orderItems: [],
    gst: null,
    orderStatus: "pending",
    isPaid: false,
    paymentMethod: "",
    invoiceId: "",
    finalAmount: 0,
    discount: 0,
    shippingAddress: {
      address: "",
      country: "India",
      city: "",
      landmark: "",
      area: "",
      mobile: "",
      email: "",
      pincode: "",
      state: "",
    },
  });

  const [items, setItems] = useState([]);

  const [price, setPrice] = useState({});

  //razorpay
  const { Razorpay } = useRazorpay();
  const [paymentStatus, setPaymentStatus] = useState();
  const [razorpay_payment_id, setrazorpay_payment_id] = useState();

  useEffect(() => {
    const backendItems = cartItems.map((item) => ({
      imageId: item.imageInfo.image,
      paperId: item.paperInfo?.paper || null,
      frameId: item.frameInfo?.frame || null,
      width: item.mode === "print" ? item.paperInfo.size.width : null,
      height: item.mode === "print" ? item.paperInfo.size.height : null,
      resolution:
        item.mode === "print" ? "original" : item.imageInfo.resolution,
    }));

    setItems(backendItems);
  }, [cartItems]);

  useEffect(() => {
    if (items.length > 0) {
      calculatePrice();
    }
  }, [items]);

  const validateOrder = (orderData) => {
    if (!(user || photographer)) {
      toast.error("Validation: Please login to continue");
      return false;
    }

    const address = orderData?.shippingAddress?.address?.trim();
    const city = orderData?.shippingAddress?.city?.trim();
    const state = orderData?.shippingAddress?.state?.trim();
    const mobile = orderData?.shippingAddress?.mobile;

    if (!address) {
      toast.error(
        "Please enter your address",
        orderData.shippingAddress?.address?.trim()
      );
      return false;
    }

    if (!city) {
      toast.error("Please enter your city");
      return false;
    }

    if (!state) {
      toast.error("Please enter your state");
      return false;
    }

    if (!mobile) {
      toast.error("Please enter your mobile number");
      return false;
    }

    if (!mobile || mobile.toString().length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }

    return true;
  };

  const calculatePrice = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/download/calculate-price`,
        { items, photographerId: photographer?._id }
      );
      setPrice(res.data);
    } catch (error) {
      console.error("Error calculating price:", error);
      alert("Failed to calculate price. Please try again.");
    }
  };

  const handlePayment = useCallback(
    async (orderData) => {
      if (!(user || photographer)) {
        toast.error("Payment: Please login to continue");
        return;
      }

      if (!validateOrder(orderData)) return;
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/download/payment`,
        {
          total: orderData.finalAmount,
          userId: user?._id || photographer?._id,
        }
      );
      const options = {
        key: result.data.result.notes.key,
        amount: result.data.result.amount,
        currency: "INR",
        name: "ClickedArt",
        description: "Total Payment",
        image: "/assets/Logo.png",
        order_id: result.data.id,
        handler: async (res) => {
          try {
            const paymentId = res.razorpay_payment_id;
            if (paymentId) {
              setrazorpay_payment_id(paymentId);
              setPaymentStatus(true);
              setOrderData((prev) => ({
                ...prev,
                invoiceId: paymentId,
              }));
            }
          } catch (error) {
            setUploadVisible(false);
            createFailedOrder();
          }
        },
        prefill: {
          email: user?.email,
          contact: user?.mobile,
          name: `${user?.firstName} ${user?.lastName}`,
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    },
    [Razorpay, user, photographer]
  );

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/download/create-order`,
        orderData,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      clearCart();
      Swal.fire({
        title: "Order Placed Successfully",
        text: "Your order has been placed successfully",
        icon: "success",
        confirmButtonText: "Go to Orders",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/profile/orders");
        }
      });
      // router.push("/profile/orders");
      setLoading(false);
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Something went wrong while creating the order");
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Calculate raw amount (sum of item prices before applying discount)
    const rawAmount = price?.totalFinalPrice || 0;
    // Apply discount to the raw amount
    const discountAmount = discount;

    const amountAfterDiscount = rawAmount - discountAmount;

    // Calculate delivery charges (₹1 per square inch of paper size)
    const calculateDeliveryCharges = () => {
      return cartItems.reduce((total, item) => {
        if (item.paperInfo && item.paperInfo.size) {
          const area = item.paperInfo.size.width * item.paperInfo.size.height;
          setDeliveryCharges(area);
          // return total + area;
          return total;
        }
        return total;
      }, 0);
    };

    const deliveryCharge = calculateDeliveryCharges();

    // Calculate GST (18% on the raw amount)
    const gstAmount = amountAfterDiscount * 0.18; // 18% GST

    // Calculate platform fee
    const platformFee = (amountAfterDiscount + gstAmount) * 0.02; // 2% platform fee
    setPlatformCharges(platformFee);
    // Final amount after adding GST, platform fee, and delivery charge
    const finalAmount = amountAfterDiscount + gstAmount + 0 + deliveryCharge;

    // Update the order data
    setOrderData((prev) => ({
      ...prev,
      userId: (user || photographer)?._id,
      orderItems: cartItems.map((item) => ({
        imageInfo: {
          image: item.imageInfo.image,
          photographer: item.imageInfo.photographer?._id,
          resolution:
            item.mode === "print" ? "original" : item.imageInfo.resolution,
          price: item.paperInfo?.price ? 0 : item.imageInfo.price,
        },
        frameInfo: item.frameInfo
          ? {
              frame: item.frameInfo.frame,
              price: item.frameInfo.price,
              size: item.frameInfo.size,
            }
          : null,
        paperInfo: item.paperInfo
          ? {
              paper: item.paperInfo.paper,
              price: item.paperInfo.price,
              size: item.paperInfo.size,
            }
          : null,
        subTotal: (item.frameInfo?.price || 0) + (item.paperInfo?.price || 0),
        finalPrice: item.paperInfo?.price
          ? (item.frameInfo?.price || 0) + (item.paperInfo?.price || 0)
          : item.imageInfo.price,
      })),
      shippingAddress: {
        ...prev.shippingAddress,
        city: (user || photographer)?.shippingAddress?.city,
        address: (user || photographer)?.shippingAddress?.address,
        state: (user || photographer)?.shippingAddress?.state,
        country: (user || photographer)?.shippingAddress?.country || "India",
        email: (user || photographer)?.email,
        mobile: (user || photographer)?.mobile,
        pincode: (user || photographer)?.shippingAddress?.pincode,
      },
      finalAmount: finalAmount.toFixed(2),
      discount: discountAmount.toFixed(2),
      isPaid: false,
      gst: "",
    }));
  }, [user, cartItems, discount, coupon, price] || []);

  const handleCoupon = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER
        }/api/coupon/apply-coupon?code=${code}&userId=${
          (user || photographer)?._id
        }&type=${user ? "user" : "photographer"}`
      );

      toast.success("Coupon applied successfully");
      setCoupon(res.data.coupon);
      setOrderData((prev) => ({
        ...prev,
        coupon: res.data.coupon.code,
      }));
      setLoading(false);
    } catch (error) {
      setError("Something went wrong while applying coupon", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coupon && coupon.discountPercentage && coupon.maxDiscountAmount) {
      const discountAmount = Math.min(
        price.totalFinalPrice * (coupon.discountPercentage / 100),
        coupon.maxDiscountAmount
      );
      setDiscount(discountAmount);
    }
  }, [coupon, orderData.totalAmount, discount, orderData.finalAmount]);

  useEffect(() => {
    if (paymentStatus === true) {
      const NewOrderData = {
        ...orderData,
        invoiceId: razorpay_payment_id,
        isPaid: true,
        paymentMethod: "razorpay",
        orderStatus: "completed",
      };

      createOrder(NewOrderData);
    }
  }, [paymentStatus]);

  if (!isHydrated) {
    return (
      <div className="bg-gray-100 h-[80vh] w-screen top-0 left-0 z-50 flex items-center justify-center bg-opacity-50">
        <Loader />
      </div>
    );
  }

  useEffect(() => {
    if (isHydrated && !(user || photographer)) {
      router.push("/signin");
    }
  }, [isHydrated]);

  return (
    <div>
      {loading || !isHydrated ? (
        <div className="bg-gray-100 h-[80vh] w-screen top-0 left-0 z-50 flex items-center justify-center bg-opacity-50">
          <Loader />
        </div>
      ) : (
        <section className="bg-white py-8 antialiased d md:py-16">
          {cartItems.length === 0 ? (
            <div className="flex items-center justify-center h-[80vh]">
              <p className="text-lg font-semibold text-gray-600">
                Your cart is empty
              </p>
            </div>
          ) : (
            <form
              action={() => {
                handlePayment(orderData);
              }}
              className="mx-auto max-w-screen-xl px-4 2xl:px-0"
            >
              {/* <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500  sm:text-base">
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
          </ol> */}
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
                          value={`${(user || photographer)?.firstName || ""} ${
                            (user || photographer)?.lastName || ""
                          }`}
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
                          value={orderData.shippingAddress.country || ""}
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
                          <Label htmlFor="landmark">Landmark</Label>
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
                              required
                              value={orderData.shippingAddress.mobile || ""}
                              onChange={(e) =>
                                setOrderData((prev) => ({
                                  ...prev,
                                  shippingAddress: {
                                    ...prev.shippingAddress,
                                    mobile: e.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="gst">GST number</Label>
                        <Input
                          type="text"
                          value={orderData.gst || ""}
                          onChange={(e) =>
                            setOrderData((prev) => ({
                              ...prev,
                              gst: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="voucher">Enter a Coupon Code</Label>
                    <div className="flex max-w-md items-center gap-4">
                      <Input
                        type="text"
                        id="voucher"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        placeholder=""
                        required=""
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                      <Button onClick={handleCoupon}>Apply</Button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
                  <div className="flow-root">
                    <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                      {cartItems?.map((product, index) => (
                        <div
                          key={index}
                          className="px-6 flex gap-2 shadow-[0_0_6px_rgba(0,_0,_0,_0.1)] rounded-sm hover:shadow-[0_0_12px_rgba(0,_0,_0,_0.2)] p-4 transition-all duration-200 ease-in-out"
                        >
                          <div className="w-1/2 flex flex-col gap-4">
                            <Link
                              className=""
                              href={`/images/${product._id}`}
                              passHref
                            >
                              <Image
                                height={100}
                                width={100}
                                src={
                                  product.imageInfo?.thumbnail ||
                                  "/assets/images/img6.jpg"
                                }
                                alt="product"
                              />
                            </Link>
                          </div>
                          <div className="sm:w-1/2 flex flex-col gap-2 border-b sm:border-b-0">
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
                                <p>Delivery: ₹{product.delivery}</p>
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
                          ₹{price?.totalFinalPrice}
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          Savings
                        </dt>
                        <dd className="text-base font-medium text-green-500">
                          {discount ? `- ₹${orderData?.discount}` : "₹0"}
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          Delivery Charges
                        </dt>
                        <dd className="text-base font-medium text-green-500">
                          <span className="line-through mr-2 text-black">
                            ₹{deliveryCharges}
                          </span>
                          ₹0
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          Platform Gateway
                        </dt>
                        <dd className="text-base font-medium text-green-500">
                          <span className="line-through mr-2 text-black">
                            ₹{platformCharges.toFixed(2)}
                          </span>
                          ₹0
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          CGST (9%)
                        </dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                          ₹
                          {((price.totalFinalPrice - discount) * 0.09).toFixed(
                            2
                          )}
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          SGST (9%)
                        </dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                          ₹
                          {((price.totalFinalPrice - discount) * 0.09).toFixed(
                            2
                          )}
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-base font-bold text-gray-900 dark:text-white">
                          Total
                        </dt>
                        <dd className="text-base font-bold text-gray-900 dark:text-white">
                          ₹{orderData.finalAmount}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button type="submit" disabled={loading}>
                      Proceed to Payment
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </section>
      )}
    </div>
  );
}
