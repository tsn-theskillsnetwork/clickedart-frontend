"use client";

import Button from "@/components/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
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

  return (
    <main className="w-[700px] mx-auto py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Link
                className="text-blue-500 hover:underline"
                href={"/dashboard"}
              >
                Dashboard
              </Link>
              &nbsp; &gt; &nbsp;
              <Link
                className="text-blue-500 hover:underline"
                href={"/dashboard/invoice"}
              >
                Invoice
              </Link>
              &nbsp; &gt; &nbsp; <span>Edit</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex-1 rounded-xl px-4 py-2 bg-white min-h-min">
        <div>
          <h3 className="text-heading-03 font-semibold text-right">INVOICE</h3>
        </div>
        <div className="flex flex-row justify-end items-center">
          <p className="text-paragraph text-right">Invoice #:</p>
          <Input
            type="text"
            value={data.invoiceNo}
            onChange={(e) => setData({ ...data, invoiceNo: e.target.value })}
            className="px-1 w-16 ml-1 shadow-sm shadow-zinc-400"
            placeholder="0001"
          />
        </div>
        <div className="flex flex-row justify-between items-start mt-4">
          <div className="flex flex-col gap-2 text-left">
            <p className="text-sm">Bill To:</p>
            <p className="text-paragraph font-semibold">
              <Input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="  shadow-sm shadow-zinc-400"
                placeholder="Name"
              />
            </p>
            <p className="text-sm">
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="  shadow-sm shadow-zinc-400"
                placeholder="Email"
              />
            </p>
            <p className="text-sm">
              <Input
                type="tel"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="  shadow-sm shadow-zinc-400"
                placeholder="Phone"
              />
            </p>
            <p className="text-sm">
              <Input
                type="text"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                className="  shadow-sm shadow-zinc-400"
                placeholder="Address"
              />
            </p>
            <p className="text-sm">
              <Input
                type="text"
                value={data.pincode}
                onChange={(e) => setData({ ...data, pincode: e.target.value })}
                className="  shadow-sm shadow-zinc-400"
                placeholder="Pincode"
              />
            </p>
          </div>
          <div className="flex flex-col gap-2 text-right items-end">
            <p className="text-md text-gray-500">STATUS:</p>
            <p>
              <Select
                className="w-36"
                defaultValue={data.status}
                onValueChange={(value) => setData({ ...data, status: value })}
              >
                <SelectTrigger
                  className={`font-semibold !text-heading-05  shadow-sm shadow-zinc-400 ${
                    data.status === "unpaid" && "text-red-500"
                  } ${data.status === "paid" && "text-green-600"} `}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">UNPAID</SelectItem>
                  <SelectItem value="paid">PAID</SelectItem>
                </SelectContent>
              </Select>
            </p>
            <p className="text-md text-gray-500">DATE:</p>
            <p className="font-semibold">
              <Input
                type="date"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
                className="px-0  shadow-sm shadow-zinc-400"
              />
            </p>
            <p className="text-md text-gray-500">DUE DATE:</p>
            <p className="font-semibold">
              <Input
                type="date"
                value={data.dueDate}
                onChange={(e) => setData({ ...data, dueDate: e.target.value })}
                className="px-0  shadow-sm shadow-zinc-400"
              />
            </p>
            <p className="text-md text-gray-500">AMOUNT:</p>
            <p className="font-semibold text-heading-05">
              ₹ {data.amount.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <table className="w-full mt-4 border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="text-left">Item</th>
                <th className="text-left">Qty</th>
                <th className="text-left">Price</th>
                <th className="text-left">Disc(%)</th>
                <th className="text-center">Amount</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const items = [...data.items];
                        items[index].name = e.target.value;
                        setData({ ...data, items });
                      }}
                      className="  shadow-sm shadow-zinc-400"
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const items = [...data.items];
                        items[index].quantity = e.target.value;
                        setData({ ...data, items });
                      }}
                      className="  shadow-sm shadow-zinc-400"
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const items = [...data.items];
                        items[index].price = e.target.value;
                        setData({ ...data, items });
                      }}
                      className="  shadow-sm shadow-zinc-400"
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={item.discount}
                      onChange={(e) => {
                        const items = [...data.items];
                        items[index].discount = e.target.value;
                        setData({ ...data, items });
                      }}
                      className="  shadow-sm shadow-zinc-400"
                    />
                  </td>
                  <td>
                    <p className="text-center">
                      {item.quantity * item.price -
                        (item.quantity * item.price * item.discount) / 100}
                    </p>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() =>
                        setData({
                          ...data,
                          items: data.items.filter((_, i) => i !== index),
                        })
                      }
                      className="text-red-500"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="text-right">
                  <Button
                    onClick={() =>
                      setData({
                        ...data,
                        items: [
                          ...data.items,
                          {
                            name: "",
                            description: "",
                            quantity: 0,
                            price: 0,
                            discount: 0,
                          },
                        ],
                      })
                    }
                  >
                    Add Item
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="flex flex-col mt-10 w-1/2 ml-auto items-end gap-5">
            <p className="font-semibold mr-auto">Invoice Summary</p>
            <div className="flex flex-row justify-end items-end gap-40">
              <div className="flex flex-col">
                <p>Subtotal</p>
                <p className="py-1">GST(%):</p>
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
                <p>
                  <Input
                    type="number"
                    value={data.gst}
                    onChange={(e) => setData({ ...data, gst: e.target.value })}
                    className="  shadow-sm shadow-zinc-400"
                  />
                </p>
                <p className="text-paragraph font-semibold">
                  <span className="mr-1">₹</span>
                  {(
                    data.items.reduce(
                      (acc, item) =>
                        acc +
                        item.quantity * item.price -
                        (item.quantity * item.price * item.discount) / 100,
                      0
                    ) +
                    (data.gst / 100) *
                      data.items.reduce(
                        (acc, item) =>
                          acc +
                          item.quantity * item.price -
                          (item.quantity * item.price * item.discount) / 100,
                        0
                      )
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
