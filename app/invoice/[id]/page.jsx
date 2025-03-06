"use client";

import axios from "axios";
import InvoiceDetailsPage from "./invoice";
import Loader from "@/components/loader";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InvoicePage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [monetizationData, setMonetizationData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getInvoiceData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/invoice/get-invoice-by-id?id=${id}`
      );
      setData(response.data.invoice);

      if (response.data.invoice.photographer?._id) {
        getMonetizationData(response.data.invoice.photographer._id);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonetizationData = async (photographerId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/monetization/getMonetizationByPhotographerId?photographerId=${photographerId}`
      );
      setMonetizationData(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (id) {
      getInvoiceData(id);
    }
  }, [id]);

  return (
    <>
      {data && !loading ? (
        <>
          <InvoiceDetailsPage
            data={data}
            monetizationData={monetizationData ? monetizationData : null}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          {loading ? <Loader /> : <p>Invoice not Found</p>}
        </div>
      )}
    </>
  );
}
