"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useAuthStore from "@/authStore";
import PrintOrders from "@/components/orders/prints";
import DownloadOrders from "@/components/orders/downloads";
import axios from "axios";
import { Dot, Download } from "lucide-react";
import Button from "@/components/button";
import Button2 from "@/components/button2";

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState("downloads");
  const [orders, setOrders] = useState([]);
  const [printOrders, setPrintOrders] = useState([]);
  const [downloadOrders, setDownloadOrders] = useState([]);

  console.log("orders", orders);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/download/get-my-orders?userId=${user?._id}`
      );

      setOrders(response.data.orders);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 gap-10 py-20">
      <h1 className="text-heading-03 font-semibold">Orders</h1>
      {/* <div className="flex flex-row justify-start gap-4 font-semibold text-heading-06">
        <motion.p
          layout
          className={`${
            selectedTab === "downloads" &&
            "underline underline-offset-2 decoration-primary"
          } cursor-pointer`}
          onClick={() => setSelectedTab("downloads")}
        >
          Downloads
        </motion.p>
        <motion.p
          layout
          className={`${
            selectedTab === "print" &&
            "underline underline-offset-2 decoration-primary"
          } cursor-pointer`}
          onClick={() => setSelectedTab("print")}
        >
          Print Orders
        </motion.p>
      </div> */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          exit={{ opacity: 0 }}
        >
          <div>
            <div className="flex flex-col gap-12">
              <div className="px-6 hidden sm:flex shadow-[0_0_6px_rgba(0,_0,_0,_0.1)] rounded-sm p-5 text-heading-06 font-semibold">
                <div className="w-3/5">Product</div>
                <div className="w-1/5">Payment</div>
                <div className="w-1/5">Status</div>
              </div>
              {orders?.map((order) => (
                <div
                  key={order._id}
                  className="px-6 flex flex-col gap-2 sm:gap-0 sm:flex-row shadow-[0_0_6px_rgba(0,_0,_0,_0.1)] rounded-sm hover:shadow-[0_0_12px_rgba(0,_0,_0,_0.2)] p-4 transition-all duration-200 ease-in-out"
                >
                  <div className="flex flex-col w-3/5 gap-5 sm:gap-10">
                    {order.orderItems?.map((item, index) => (
                      <div
                        key={index}
                        className="sm:w-3/5 flex flex-col sm:flex-row gap-5 sm:gap-10"
                      >
                        <div className="sm:w-1/2">
                          <img
                            src={
                              item.imageInfo?.image?.imageLinks?.thumbnail ||
                              item.imageInfo?.image?.imageLinks[
                                item.imageInfo?.resolution
                              ] ||
                              "/assets/images/img6.jpg"
                            }
                            className=""
                            alt="Canvas Print 72x30"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-heading-06 font-semibold capitalize">
                            {item.imageInfo?.image?.title || "Art Name"}
                          </p>
                          {item.paperInfo ? (
                            <div className="flex flex-col">
                              <p className="text-base font-semibold text-surface-500">
                                {item.paperInfo.paper?.name}
                              </p>
                              <p className="text-sm font-medium text-surface-500">
                                {item.paperInfo.size?.width} x{" "}
                                {item.paperInfo.size?.height} in
                              </p>
                            </div>
                          ) : (
                            <p className="text-base font-semibold text-surface-500 capitalize">
                              {item.imageInfo?.resolution} Size
                            </p>
                          )}
                          {item.frameInfo && (
                            <div className="flex flex-col">
                              <p className="text-base font-semibold text-surface-500">
                                {item.frameInfo.frame?.name}
                              </p>
                            </div>
                          )}
                          <hr />
                          <div className="flex flex-col">
                            <p className="text-base font-semibold text-surface-500">
                              Shipping Address:
                            </p>
                            <p className="text-sm font-medium text-surface-500">
                              {order.shippingAddress?.address}
                            </p>
                            {order.shippingAddress?.area && (
                              <p className="text-sm font-medium text-surface-500">
                                Area: {order.shippingAddress?.area}
                              </p>
                            )}
                            {order.shippingAddress?.landmark && (
                              <p className="text-sm font-medium text-surface-500">
                                Landmark: {order.shippingAddress?.landmark}
                              </p>
                            )}
                            {order.shippingAddress?.city && (
                              <p className="text-sm font-medium text-surface-500">
                                City: {order.shippingAddress?.city}
                              </p>
                            )}
                            {order.shippingAddress?.state && (
                              <p className="text-sm font-medium text-surface-500">
                                State: {order.shippingAddress?.state}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sm:px-2 sm:w-1/5 flex flex-col items-start gap-2 border-b sm:border-b-0">
                    <p className="text-base font-medium text-surface-500 capitalize">
                      Method: {order.paymentMethod}
                    </p>
                    <p className="text-sm font-medium text-surface-500">
                      Invoice: {order.invoiceId}
                    </p>
                    <p className="text-base mt-5 font-semibold text-surface-500">
                      Sub Total: {order.subTotal}
                    </p>
                    <p className="text-paragraph font-semibold text-surface-500">
                      Total: {order.totalAmount}
                    </p>
                    {order.isPaid === true ? (
                      <p className="text-paragraph font-semibold text-green-600">
                        Paid
                      </p>
                    ) : (
                      <p className="text-paragraph font-semibold text-red-600">
                        Not Paid
                      </p>
                    )}
                  </div>
                  <div className="sm:px-2 sm:w-1/5 flex flex-col items-start gap-2 border-b sm:border-b-0">
                    <div
                      className={`flex items-center p-1 pr-3 ${
                        order.orderStatus === "completed" &&
                        "bg-green-100 text-green-600"
                      } ${
                        order.orderStatus === "pending" &&
                        "bg-orange-100 text-orange-600"
                      } ${
                        order.orderStatus === "cancelled" &&
                        "bg-red-100 text-red-600"
                      } rounded-full `}
                    >
                      <Dot strokeWidth={6} />
                      <p className="text-base font-semibold capitalize">
                        {order.orderStatus}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        toast.success("Order Support Requested");
                      }}
                      size="sm"
                    >
                      Order Support
                    </Button>
                  </div>
                  {order.orderStatus === "completed" && (
                    <a
                      download
                      href={
                        order?.imageInfo?.image?.imageLinks[
                          order?.imageInfo?.resolution
                        ]
                      }
                    >
                      <Button2
                        size="sm"
                        icon={<Download size={18} strokeWidth={2} />}
                      >
                        Download
                      </Button2>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
