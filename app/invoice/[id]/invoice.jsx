"use client";
import Button2 from "@/components/button2";
import { Mail, Phone } from "lucide-react";
import { useRef} from "react";

export default function InvoiceDetailsPage({ data, monetizationData }) {
  const options = {
    filename: "my-document.pdf",
    margin: 1,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  const contentRef = useRef(null);

  const convertToPdf = async () => {
    const content = contentRef.current;
    const html2pdf = await import("html2pdf.js");

    html2pdf().set(options).from(content).save();
  };
  return (
    <main className="w-[600px] mx-auto -mt-10 ">
      {data && (
        <>
          <div className="flex justify-end">
            <Button2 size="sm" onClick={convertToPdf}>
              Download
            </Button2>
          </div>

          <div ref={contentRef} className="flex-1 rounded-xl px-4">
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex flex-col gap-2 mb-2">
                <h4 className="text-heading-04 font-semibold text-red-500">
                  {data?.photographer?.firstName || ""}{" "}
                  {data?.photographer?.lastName || ""}
                </h4>
                <div>
                  <p className="text-base">
                    PAN: {monetizationData?.panNumber || ""}
                  </p>
                  {monetizationData?.businessAccount?.gstNumber && (
                    <p className="text-base">
                      GST No: {monetizationData?.businessAccount?.gstNumber}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-black rounded-full h-6 w-6 flex items-center justify-center">
                    <Phone
                      strokeWidth={1}
                      className=" h-4 w-4 text-black fill-white"
                    />
                  </div>
                  <p className="text-base">
                    {data?.photographer?.mobile || ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-black rounded-full h-6 w-6 flex items-center justify-center">
                    <Mail
                      strokeWidth={2}
                      className=" h-4 w-4 text-black fill-white"
                    />
                  </div>
                  <p className="text-base">{data?.photographer?.email || ""}</p>
                </div>
              </div>

              <img src="/assets/Logo.png" alt="logo" className="w-2/5" />
            </div>
            <hr className="border border-black" />

            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-col text-left mt-6">
                <p className="text-sm font-medium">Invoice To:</p>
                <p className="text-base font-bold my-1">
                  ForteNet Skills Network Private Limited
                </p>
                <p className="text-sm">
                  {" "}
                  1st Floor, 624/New 1, Hope Villa, Near Wave
                </p>
                <p className="text-sm">
                  Mall, Vibhuti Khand, Gomti Nagar, Lucknow,
                </p>
                <p className="text-sm"> U.P - 226010</p>
              </div>
              <div className="flex flex-col text-right items-start">
                <div className="flex flex-row justify-end items-center text-base font-medium gap-2">
                  <p className="">NO.</p>
                  <p className="text-red-500">{data.invoiceId}</p>
                </div>
                <p className="text-md font-medium">
                  Date: {data.createdAt?.split("T")[0]}
                </p>
                <p className="text-paragraph font-bold my-1">INVOICE PERIOD</p>
                <p className="text-sm font-medium">
                  <span className="font-semibold">FROM</span>{" "}
                  {data.startDate?.split("T")[0]}
                </p>
                <p className="text-sm font-medium">
                  <span className="font-semibold">TO</span>{" "}
                  {data.endDate?.split("T")[0]}
                </p>
                {/* <p className="text-md text-gray-500">AMOUNT:</p>
              <p className="font-semibold text-heading-05">
                ₹ {data.totalAmountPayable}
              </p> */}
              </div>
            </div>
            <div>
              <table className="w-full mt-4">
                <thead className="bg-red-500 h-10 text-white">
                  <tr>
                    <th className="text-center">Description</th>
                    <th className="text-center">Type</th>
                    <th className="text-center">Amount</th>
                    <th className="text-center">QTY</th>
                    <th className="text-center">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orderDetails.map((item, index) => (
                    <tr className="" key={index}>
                      <td className="text-center p-2">{item.image?.title}</td>
                      <td className="text-center p-2">
                        {item.printcutAmount > 0 ? "Print" : "Digital"}
                      </td>
                      <td className="text-center p-2">
                        {item.royaltyAmount || item.printcutAmount}
                      </td>
                      <td className="text-center p-2">1</td>
                      <td>
                        <p className="text-center p-2">
                          {item.royaltyAmount || item.printcutAmount}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-red-500 text-white p-2 mt-2">
                <p className="text-base text-right font-bold mr-5">
                  GRAND TOTAL:{" "}
                  {(data.totalPrintcutAmount + data.totalRoyaltyAmount).toFixed(
                    2
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div>
                  <p className="text-base mt-4 bg-[#ECB2B1] text-black font-semibold px-4 py-2">
                    PAYMENT METHOD
                  </p>
                  <p>
                    <span className="font-semibold">Bank Name:</span>{" "}
                    {monetizationData?.bankName}
                  </p>
                  <p>
                    <span className="font-semibold">Account Number:</span>{" "}
                    {monetizationData?.bankAccNumber}
                  </p>
                  <p>
                    <span className="font-semibold">IFSC Code:</span>{" "}
                    {monetizationData?.ifsc}
                  </p>
                  <p className="text-base mt-4 bg-[#ECB2B1] text-black font-semibold px-4 py-2">
                    INVOICE PERIOD
                  </p>
                  <p>
                    <span className="font-semibold">FROM:</span>{" "}
                    {data.startDate.split("T")[0]}
                  </p>
                  <p>
                    <span className="font-semibold">TO:</span>{" "}
                    {data.endDate.split("T")[0]}
                  </p>
                </div>
                <div className="h-full w-full flex items-end">
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
