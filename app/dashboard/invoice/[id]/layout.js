import Page from "./page";

export async function generateMetadata({ params }) {
  const { id } = await Promise.resolve(params);
  const invoiceNumber = id;

  return {
    title: `Invoice - ${invoiceNumber}`,
    description: `View the details for Invoice #${invoiceNumber}`,
  };
}

export default Page;
