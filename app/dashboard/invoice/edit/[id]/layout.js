import Page from "./page";

export async function generateMetadata({ params }) {
  const { id } = await Promise.resolve(params);
  const invoiceNumber = id;

  return {
    title: `Edit Invoice - ${invoiceNumber}`,
    description: `Edit the details for Invoice #${invoiceNumber}`,
  };
}

export default Page;
