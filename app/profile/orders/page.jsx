"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useAuthStore from "@/authStore";
import axios from "axios";
import { Dot, Download, MapIcon } from "lucide-react";
import Button from "@/components/button";
import { Button as ShadcnButton } from "@/components/ui/button";
import Button2 from "@/components/button2";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/loader";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const { user, photographer } = useAuthStore();
  const router = useRouter();
  const page = Number(searchParams.get("page") || 1);
  const [orders, setOrders] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState({});
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [orderSupport, setOrderSupport] = useState({
    userInfo: {
      user: "",
      userType: "",
    },
    order: "",
    issueType: "",
    issueDescription: "",
    preferredContactMethod: "",
  });

  const validateOrderSupport = () => {
    if (
      orderSupport.issueType === "" ||
      orderSupport.issueDescription === "" ||
      orderSupport.preferredContactMethod === ""
    ) {
      toast.error("Please fill out all fields");
      return false;
    }
    return true;
  };

  const handleOrderSupport = async (order) => {
    const updatedOrderSupport = {
      ...orderSupport,
      order: order,
    };

    if (!validateOrderSupport()) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/ordersupport/create-order-support-request`,
        updatedOrderSupport
      );
      toast.success("Order Support Requested");
    } catch (error) {
      if (
        error.response.data.message === "Support already exist on this order"
      ) {
        toast.error("Order Support already exist on this order");
      } else {
        console.log(error);
        toast.error("Error requesting order support");
      }
    }
  };

  const fetchShipment = async (waybill) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/delivery/track-shipment?waybill=${waybill}`
      );
      setShipment(response.data.ShipmentData[0].Shipment);
    } catch (error) {
      console.log(error);
      setShipment({});
    }
  };

  useEffect(() => {
    if (!(user || photographer)) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_SERVER
          }/api/download/get-my-orders?userId=${
            (user || photographer)?._id
          }&pageNumber=${page}&pageSize=10`
        );
        setOrders(response.data.orders);
        setPageCount(Number(response.data.pageCount));
      } catch (error) {
        console.log(error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, photographer, page]);

  useEffect(() => {
    if (!(user || photographer)) return;
    if (
      orderSupport.userInfo.user === "" ||
      orderSupport.userInfo.userType === ""
    ) {
      setOrderSupport((prev) => ({
        ...prev,
        userInfo: {
          user: (user || photographer)?._id,
          userType: (user || photographer)?.type,
        },
      }));
    }
  }, [user, photographer]);

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 gap-10 py-20">
      <h1 className="text-heading-03 font-semibold">Orders</h1>
      <AnimatePresence mode="popLayout">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          exit={{ opacity: 0 }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader />
            </div>
          ) : (
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
                          className="sm:w-full flex flex-col sm:flex-row gap-5 sm:gap-10"
                        >
                          <div className="sm:w-1/2">
                            <img
                              src={
                                item.imageInfo?.image?.imageLinks?.thumbnail ||
                                "/assets/placeholders/broken-image.png"
                              }
                              className=""
                              alt="Canvas Print 72x30"
                            />
                            <div className="flex gap-2 mt-2 justify-center">
                              {!item.paperInfo && (
                                <Link
                                  href={
                                    (item.imageInfo?.image?.imageLinks &&
                                      item.imageInfo?.resolution &&
                                      item.imageInfo?.image?.imageLinks[
                                        item.imageInfo?.resolution
                                      ]) ||
                                    "/profile/orders"
                                  }
                                >
                                  <Button2
                                    size="sm"
                                    icon={<Download size={20} />}
                                  >
                                    Download
                                  </Button2>
                                </Link>
                              )}
                            </div>
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
                        Sub Total: {order.totalAmount}
                      </p>
                      <p className="text-paragraph font-semibold text-surface-500">
                        Total: {order.finalAmount}
                      </p>
                      {order.printStatus !== "no-print" && (
                        <>
                          <p className="font-medium">Print Status:</p>
                          <div
                            className={`flex items-center p-1 pr-3 ${
                              order.printStatus === "delivered"
                                ? "bg-green-100 text-green-600"
                                : order.printStatus === "processing"
                                ? "bg-orange-100 text-orange-600"
                                : order.printStatus === "returned"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                            } rounded-full `}
                          >
                            <Dot strokeWidth={6} />
                            <p className="text-base font-semibold capitalize">
                              {order.printStatus}
                            </p>
                          </div>
                          {order.waybill && (
                            <p className="font-medium">
                              Tracking ID: {order.waybill}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    <div className="sm:px-2 sm:w-1/5 flex flex-col items-center gap-2 border-b sm:border-b-0">
                      <>
                        <p className="font-medium">Order Status</p>
                        <div
                          className={`flex items-center p-1 pr-3 bg-green-100 text-green-600 rounded-full `}
                        >
                          <Dot strokeWidth={6} />
                          <p className="text-base font-semibold capitalize">
                            {order.orderStatus}
                          </p>
                        </div>
                      </>
                      <Dialog>
                        <DialogTrigger>
                          <div className="bg-primary text-white font-medium p-2 rounded-md">
                            Order Support
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Order Support Form</DialogTitle>
                            <DialogDescription>
                              Have an issue with your order? Please fill out the
                              form.
                            </DialogDescription>
                          </DialogHeader>
                          <form
                            className="flex flex-col gap-4"
                            onSubmit={async (e) => {
                              e.preventDefault();
                              await handleOrderSupport(order._id);
                            }}
                          >
                            <div>
                              <Label>Issue Type</Label>
                              <Select
                                value={orderSupport.issueType}
                                required
                                onValueChange={(value) =>
                                  setOrderSupport((prev) => ({
                                    ...prev,
                                    issueType: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Issue Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Order not received">
                                    Order Not Received
                                  </SelectItem>
                                  <SelectItem value="Wrong item received">
                                    Wrong Item Received
                                  </SelectItem>
                                  <SelectItem value="Damaged Item">
                                    Damaged Item
                                  </SelectItem>
                                  <SelectItem value="Payment issue">
                                    Payment Issue
                                  </SelectItem>
                                  <SelectItem value="Request for cancellation or refund">
                                    Request for Cancellation or Refund
                                  </SelectItem>
                                  <SelectItem value="Digital Download Issue">
                                    Digital Download Issue
                                  </SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Textarea
                              label="Issue Description"
                              required
                              value={orderSupport.issueDescription}
                              onChange={(e) =>
                                setOrderSupport((prev) => ({
                                  ...prev,
                                  issueDescription: e.target.value,
                                }))
                              }
                            />
                            <Label>Preferred Contact Method</Label>
                            <Select
                              required
                              value={orderSupport.preferredContactMethod}
                              onValueChange={(value) =>
                                setOrderSupport((prev) => ({
                                  ...prev,
                                  preferredContactMethod: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Preferred Contact Method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Email">Email</SelectItem>
                                <SelectItem value="Phone">Phone</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button type="submit">Submit</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      {order.printStatus !== "no-print" && order.waybill && (
                        <>
                          <Button
                            onClick={() => {
                              fetchShipment(order.waybill);
                              setTrackDialogOpen(true);
                            }}
                          >
                            Track Order
                          </Button>
                          <Dialog
                            open={trackDialogOpen}
                            onOpenChange={setTrackDialogOpen}
                          >
                            <DialogContent className="max-w-md w-full">
                              <DialogHeader>
                                <DialogTitle>Shipment Tracking</DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="h-80">
                                <Card>
                                  <CardContent className="p-4 space-y-2">
                                    <p>
                                      <strong>AWB:</strong>{" "}
                                      {shipment.AWB || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Status:</strong>{" "}
                                      {shipment.Status?.Status || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Location:</strong>{" "}
                                      {shipment.Status?.StatusLocation || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Pickup Date:</strong>{" "}
                                      {shipment.PickUpDate
                                        ? new Date(
                                            shipment.PickUpDate
                                          ).toLocaleString()
                                        : "N/A"}
                                    </p>
                                    <p>
                                      <strong>Expected Delivery Date:</strong>{" "}
                                      {shipment.ExpectedDeliveryDate
                                        ? new Date(
                                            shipment.ExpectedDeliveryDate
                                          ).toLocaleString()
                                        : "N/A"}
                                    </p>
                                    <p>
                                      <strong>Delivery Date:</strong>{" "}
                                      {shipment.DeliveryDate
                                        ? new Date(
                                            shipment.DeliveryDate
                                          ).toLocaleString()
                                        : "Pending"}
                                    </p>
                                    <p>
                                      <strong>Destination:</strong>{" "}
                                      {shipment.Destination || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Consignee:</strong>{" "}
                                      {shipment.Consignee?.Name || "N/A"} (
                                      {shipment.Consignee?.City || "N/A"},{" "}
                                      {shipment.Consignee?.PinCode || "N/A"})
                                    </p>
                                    <p>
                                      <strong>Contact:</strong>{" "}
                                      {shipment.Consignee?.Telephone1 || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Order Type:</strong>{" "}
                                      {shipment.OrderType || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Charged Weight:</strong>{" "}
                                      {shipment.ChargedWeight || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Invoice Amount:</strong>{" "}
                                      {shipment.InvoiceAmount || "N/A"}
                                    </p>
                                    <p>
                                      <strong>COD Amount:</strong>{" "}
                                      {shipment.CODAmount || "N/A"}
                                    </p>
                                  </CardContent>
                                </Card>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                      {(order.printStatus === "no-print" ||
                        order.printStatus === "delivered") && (
                        <button
                          className="text-blue-600 text-center font-medium p-2 rounded-md border bg-blue-100 hover:bg-white border-blue-600 transition-all duration-200 ease-in-out"
                          onClick={() => {
                            router.push(`/bill/${order._id}`);
                          }}
                        >
                          Invoice
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center space-x-2 py-4 px-4">
                  <ShadcnButton
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => {
                      router.push(`/profile/orders?page=${Number(page - 1)}`);
                    }}
                  >
                    Previous
                  </ShadcnButton>
                  <ShadcnButton
                    variant="outline"
                    size="sm"
                    disabled={page >= pageCount}
                    onClick={() => {
                      router.push(`/profile/orders?page=${Number(page + 1)}`);
                    }}
                  >
                    Next
                  </ShadcnButton>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
