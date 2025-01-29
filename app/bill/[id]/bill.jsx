"use client";
import Button2 from "@/components/button2";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function BillDetailsPage({ data }) {
  const options = {
    filename: data?.invoiceNumber
      ? `${data?.invoiceNumber}.pdf`
      : data?._id
      ? `${data?._id}.pdf`
      : "invoice.pdf",
    margin: 1,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
  };

  const contentRef = useRef(null);

  const convertToPdf = async () => {
    const content = contentRef.current;
    const html2pdf = await import("html2pdf.js");

    html2pdf().set(options).from(content).save();
  };
  return (
    <main className="w-[800px] mx-auto -mt-10 ">
      {data && (
        <>
          <div className="flex justify-end">
            <Button2 size="sm" onClick={convertToPdf}>
              Download
            </Button2>
          </div>
          <div ref={contentRef} className="flex-1 rounded-xl px-4">
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex flex-col items-start gap-2 mb-2">
                <h4 className="text-heading-03 ">TAX</h4>
                <h4 className="text-heading-03 -mt-4">INVOICE</h4>
              </div>
              <div className="flex flex-col items-end gap-2">
                <img src="/assets/Logo.png" alt="logo" className="w-3/5" />
                <p className="text-xs font-medium">
                  ( An Unit of ForteNet Skills Network Private Limited )
                </p>
                <p className="text-xs">GST IIN: 09AADCF5469Q1ZS</p>
              </div>
            </div>
            {/* <hr className="border border-black" /> */}

            <div className="flex flex-row justify-between items-start pt-5 pb-8">
              <div className="flex flex-col text-left mt-6">
                <p className="text-sm">Invoice No:</p>
                <p className="text-sm text-red-500 font-semibold">
                  {data.invoiceNumber || data.invoiceId}
                </p>
                <p className="text-sm mt-2">Date Issued</p>
                <p className="text-sm text-red-500 font-medium">
                  {data.createdAt?.split("T")[0]}
                </p>
              </div>
              <div className="flex flex-col text-right items-start">
                <p className="text-red-500 font-semibold">Issued to:</p>
                <p className="text-sm">
                  Name: {data.userInfo?.user?.firstName}{" "}
                  {data.userInfo?.user?.lastName}
                </p>
                <p className="text-sm">
                  Address: {data.userInfo?.user?.shippingAddress?.address}
                </p>
                <p className="text-sm">
                  City: {data.userInfo?.user?.shippingAddress?.city}
                </p>
                <p className="text-sm">
                  State: {data.userInfo?.user?.shippingAddress?.state}
                </p>
                {data.gst && (
                  <p className="text-md font-medium">GST: {data.gst}</p>
                )}
              </div>
            </div>
            <div>
              <table className="w-full mt-4 border-collapse border-x border-t-2 border-t-red-500 border-black">
                <thead className="bg-[#E1D4CD] h-16 text-black font-normal">
                  <tr>
                    <th className="text-center uppercase font-medium border-x border-black">
                      NO
                    </th>
                    <th className="text-center uppercase font-medium border-x border-black">
                      Description
                    </th>
                    <th className="text-center uppercase font-medium border-x border-black">
                      Type
                    </th>
                    <th className="text-center uppercase font-medium border-x border-black">
                      QTY
                    </th>
                    <th className="text-center uppercase font-medium border-x border-black">
                      Price
                    </th>
                    <th className="text-center uppercase font-medium border-x border-black">
                      SUBTOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.orderItems.map((item, index) => (
                    <tr className="" key={index}>
                      <td className="text-center p-2 border-x border-black">
                        {index + 1}
                      </td>
                      <td className="text-center p-2 border-x border-black">
                        {item.imageInfo?.image?.title}
                      </td>
                      <td className="text-center p-2 border-x border-black">
                        {item.subTotal > 0 ? "Print" : "Digital"}
                      </td>
                      <td className="text-center p-2 border-x border-black">
                        1
                      </td>
                      <td className="text-center p-2 border-x border-black">
                        {item.finalPrice}
                      </td>
                      <td className="text-center p-2 border-x border-black">
                        {item.finalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-primary-200 text-white p-2">
                <div className="grid grid-cols-6 ml-auto">
                  <div className="col-span-5 pb-2">
                    <p className="text-base text-right font-medium mr-5">
                      TOTAL
                    </p>
                    <p className="text-base text-right font-medium mr-5">
                      CGST(9%)
                    </p>
                    <p className="text-base text-right font-medium mr-5">
                      SGST(9%)
                    </p>
                  </div>
                  <div className="border-l pl-4 pb-2 border-white ">
                    <p className="text-base text-right font-bold mr-5">
                      {data.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-base text-right font-bold mr-5">
                      {(data.totalAmount * 0.09).toFixed(2)}
                    </p>
                    <p className="text-base text-right font-bold mr-5">
                      {(data.totalAmount * 0.09).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-6 ml-auto border-t-2 border-white">
                  <div className="col-span-5 pt-2">
                    <p className="text-base text-right font-medium mr-5">
                      GRAND TOTAL
                    </p>
                  </div>
                  <div className="border-l pl-4 pt-2 border-white ">
                    <p className="text-base text-right font-bold mr-5">
                      {data.finalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-justify">
                This is an auto generated invoice, does not require any
                signature. For any clarification, kindly contact us on
                support@clickedart.com
              </p>
              <div className="grid grid-cols-2 gap-2 mt-4 items-center">
                <img
                  src="/assets/clickedart.jpg"
                  alt="logo"
                  className="w-full"
                />
                <div className="h-full w-full flex flex-col justify-end">
                  <Image
                    src="/assets/sign.png"
                    alt="signature"
                    width={150}
                    height={50}
                    className="mx-auto -mb-5 select-none pointer-events-none"
                    style={{ userSelect: "none" }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <p className="text-paragraph text-center border-t border-black mx-auto mt-4 font-semibold px-4 py-2">
                    AUTHORISED SIGN
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
