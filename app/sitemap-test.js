const BASE_URL = process.env.NEXT_PUBLIC_CLIENT || "https://clickedart.com";

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
}

export default async function sitemap({ id }) {
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000;
  const end = start + 50000;
  const products = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-all-images?pageNumber=1&pageSize=50000`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  console.log(products);

  return products?.photos.map((product) => ({
    url: `${BASE_URL}/images/${product._id}`,
    lastModified:
      product.updatedAt || product.createdAt || new Date().toISOString(),
  }));
}
