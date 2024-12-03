"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function Page({ params: paramsPromise }) {
  const router = useRouter();
  const [id, setId] = useState(null);

  const [data, setData] = useState({
    invoiceNo: "001",
    name: "Bhanu",
    email: "bhanu@mail.com",
    phone: "7000000012",
    address: "123, Address, Lucknow",
    pincode: "226028",
    status: "unpaid",
    amount: 3976.6,
    date: "2021-09-01",
    dueDate: "2021-09-01",
    gst: "18",
    items: [
      {
        name: "Item 1",
        description: "",
        quantity: "1",
        price: "1000",
        discount: "5",
      },
      {
        name: "Item 2",
        description: "",
        quantity: "2",
        price: "500",
        discount: "5",
      },
      {
        name: "Item 3",
        quantity: "1",
        price: "1500",
        discount: "2",
      },
    ],
  });

  const updateTotalAmount = () => {
    const subtotal = data.items.reduce(
      (acc, item) =>
        acc +
        item.quantity * item.price -
        (item.quantity * item.price * item.discount) / 100,
      0
    );
    const total = subtotal + (data.gst / 100) * subtotal;
    setData((prevData) => ({ ...prevData, amount: total }));
  };

  useEffect(() => {
    updateTotalAmount();
  }, [data.items, data.gst]);

  useEffect(() => {
    paramsPromise.then((params) => {
      setId(params.id);
      if (params.id === "edit") {
        router.push(`/dashboard/invoice`);
      }
    });
  }, [paramsPromise, router]);

  if (!id) {
    return <div>Loading...</div>;
  }

  console.log(data);
  return (
    <main className="w-[600px] mx-auto py-5">
      <div className="flex-1 rounded-xl px-4 md:min-h-min">
        <div>
          <h3 className="text-heading-03 font-semibold text-right">INVOICE</h3>
        </div>
        <div className="flex flex-row justify-end items-center">
          <p className="text-paragraph text-right">Invoice #:</p>
          <p className="font-semibold ml-1">{data.invoiceNo}</p>
        </div>
        <div className="flex flex-row justify-between items-start mt-4">
          <div className="flex flex-col text-left">
            <p className="text-sm">Bill To:</p>
            <p className="text-paragraph font-semibold my-1">{data.name}</p>
            <p className="text-sm">{data.email}</p>
            <p className="text-sm">{data.phone}</p>
            <p className="text-sm">{data.address}</p>
            <p className="text-sm">{data.pincode}</p>
          </div>
          <div className="flex flex-col text-right items-end">
            <p className="text-md text-gray-500">STATUS:</p>
            <p
              className={`font-semibold !text-heading-05 border-none shadow-none ${
                data.status === "unpaid" && "text-red-500"
              } ${data.status === "paid" && "text-green-600"} `}
            >
              {data.status === "paid" ? "PAID" : "UNPAID"}
            </p>
            <p className="text-md text-gray-500">DATE:</p>
            <p className="font-semibold">{data.date}</p>
            <p className="text-md text-gray-500">DUE DATE:</p>
            <p className="font-semibold">{data.dueDate}</p>
            <p className="text-md text-gray-500">AMOUNT:</p>
            <p className="font-semibold text-heading-05">
              ₹ {data.amount.toFixed(2)}
            </p>
          </div>
        </div>
        <div>
          <table className="w-full mt-4">
            <thead>
              <tr>
                <th className="text-left">Item</th>
                <th className="text-left">Qty</th>
                <th className="text-left">Price</th>
                <th className="text-left">Disc</th>
                <th className="text-center">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.discount}%</td>
                  <td>
                    <p className="text-center">
                      {item.quantity * item.price -
                        (item.quantity * item.price * item.discount) / 100}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col mt-20 w-1/2 ml-auto items-end gap-5">
            <p className="font-semibold mr-auto">Invoice Summary</p>
            <div className="flex flex-row justify-end items-end gap-40">
              <div className="flex flex-col">
                <p>Subtotal</p>
                <p className="py-1">GST</p>
                <p>Total</p>
              </div>
              <div className="flex flex-col">
                <p>
                  {data.items.reduce(
                    (acc, item) =>
                      acc +
                      item.quantity * item.price -
                      (item.quantity * item.price * item.discount) / 100,
                    0
                  )}
                </p>
                <p>{data.gst} %</p>
                <p className=" font-semibold text-paragraph">
                  <span className=" pr-1">₹</span>
                  {data.amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
