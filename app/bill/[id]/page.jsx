"use client";

import axios from "axios";
import Loader from "@/components/loader";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BillDetailsPage from "./bill";

export default function BillPage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getInvoiceData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/download/get-order-by-id?orderId=${id}`
      );
      setData(response.data.order);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
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
          <BillDetailsPage
            data={data}
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
