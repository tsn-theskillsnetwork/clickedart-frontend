"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchData } from "@/helpers/api";
import useAuthStore from "@/authStore";
import PrintOrders from "@/components/orders/prints";
import DownloadOrders from "@/components/orders/downloads";

export default function OrdersPage() {
  const { user, token } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState("downloads");
  const [orders, setOrders] = useState([]);
  const [printOrders, setPrintOrders] = useState([]);
  const [downloadOrders, setDownloadOrders] = useState([]);

  console.log("orders", orders);

  useEffect(() => {
    if (!user) return;
    fetchData(
      `${process.env.NEXT_PUBLIC_SERVER}/api/download/get-my-orders?userId=${user?._id}`,
      "orders",
      setOrders
    );
  }, [user]);

  useEffect(() => {
    const print = orders.filter((order) => order.paperInfo);
    setPrintOrders(print);
    console.log("printOrders", print);

    const download = orders.filter((order) => !order.paperInfo);
    setDownloadOrders(download);
    console.log("downloadOrders", download);
  }, [orders]);

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 gap-10 py-20">
      <h1 className="text-heading-03 font-semibold">Orders</h1>
      <div className="flex flex-row justify-start gap-4 font-semibold text-heading-06">
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
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          exit={{ opacity: 0 }}
        >
          {selectedTab === "downloads" ? (
            <DownloadOrders orders={downloadOrders} />
          ) : (
            <PrintOrders orders={printOrders} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
