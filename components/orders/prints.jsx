import React from "react";
import Button from "@/components/button";
import { Dot } from "lucide-react";

export default function PrintOrders({ orders }) {
  if (!orders || orders.length === 0)
    return (
      <div>
        <p className="text-heading-06 font-semibold">No Orders Found</p>
      </div>
    );
  return (
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
            <div className="sm:w-3/5 flex flex-col sm:flex-row gap-5 sm:gap-10">
              <div className="sm:w-1/2">
                <img
                  src={order.imageLinks?.original || "/assets/images/img6.jpg"}
                  className=""
                  alt="Canvas Print 72x30"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-heading-06 font-semibold">
                  {order.imageInfo.image.title || "Art Name"}
                </p>
                {order.paperInfo && (
                  <div className="flex flex-col">
                    <p className="text-base font-semibold text-surface-500">
                      {order.paperInfo.paper.name}
                    </p>
                    <p className="text-sm font-medium text-surface-500">
                      {order.paperInfo.size.width} x{" "}
                      {order.paperInfo.size.height} in
                    </p>
                  </div>
                )}
                {/* {order.paperInfo && order.frameInfo && <hr className="" />} */}
                {order.frameInfo && (
                  <div className="flex flex-col">
                    <p className="text-base font-semibold text-surface-500">
                      {order.frameInfo.frame.name}
                    </p>
                  </div>
                )}
                <hr />
                <div className="flex flex-col">
                  <p className="text-base font-semibold text-surface-500">
                    Shippping Address:
                  </p>
                  <p className="text-sm font-medium text-surface-500">
                    {order.shippingAddress.address}
                  </p>
                  {order.shippingAddress.area && (
                    <p className="text-sm font-medium text-surface-500">
                      Area: {order.shippingAddress.area}
                    </p>
                  )}
                  {order.shippingAddress.landmark && (
                    <p className="text-sm font-medium text-surface-500">
                      Landmark: {order.shippingAddress.landmark}
                    </p>
                  )}
                  {order.shippingAddress.city && (
                    <p className="text-sm font-medium text-surface-500">
                      City: {order.shippingAddress.city}
                    </p>
                  )}
                  {order.shippingAddress.state && (
                    <p className="text-sm font-medium text-surface-500">
                      State: {order.shippingAddress.state}
                    </p>
                  )}
                </div>
              </div>
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
                  order.orderStatus === "cancelled" && "bg-red-100 text-red-600"
                } rounded-full `}
              >
                <Dot strokeWidth={6} />
                <p className="text-base font-semibold capitalize">
                  {order.orderStatus}
                </p>
              </div>
              <Button size="sm">Order Support</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
