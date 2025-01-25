import axios from "axios";
import InvoiceDetailsPage from "./invoice";
import Loader from "@/components/loader";

const getInvoiceData = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER}/api/invoice/get-invoice-by-id?id=${id}`
    );
    return response.data.invoice;
  } catch (error) {
    throw new Error("Failed to fetch blog data");
  }
};

const getMonetizationData = async (photographerId) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER}/api/monetization/getMonetizationByPhotographerId?photographerId=${photographerId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch blog data");
  }
};

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const data = await getInvoiceData(id);
    return {
      title: data.invoiceId,
      description: "Invoice - " + data.invoiceId,
      openGraph: {
        title: "Invoice - " + data.invoiceId,
        description: "Invoice - " + data.invoiceId,
        url: `${process.env.NEXT_PUBLIC_URL}/invoice/${id}`,
      },
    };
  } catch (error) {
    return {
      title: "Invoice Not Found",
      description: "No Invoice found with the given ID.",
    };
  }
}

export default async function BlogPage({ params }) {
  const { id } = await params;
  let photographerId = null;

  try {
    const data = await getInvoiceData(id);
    console.log(data);
    photographerId = data.photographer;
    const monetizationData = await getMonetizationData(photographerId);
    console.log(monetizationData);

    return (
      <InvoiceDetailsPage data={data} monetizationData={monetizationData || null} />
    );
  } catch (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <p className="text-2xl">Invoice Not Found</p>
      </div>
    );
  }
}
