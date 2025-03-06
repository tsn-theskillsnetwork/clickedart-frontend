const BASE_URL = process.env.NEXT_PUBLIC_CLIENT || "https://www.clickedart.com";

export async function GET() {
  try {
    const images = await getImages();

    const dynamicRoutes = images.map((i) => ({
      url: `${BASE_URL}/images/${i._id}`,
      lastModified: i.updatedAt || i.createdAt || new Date().toISOString(),
    }));

    if (dynamicRoutes.length === 0) {
      console.error("🚨 No image URLs found for the sitemap!");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${dynamicRoutes
        .map(({ url, lastModified }) =>
          `<url><loc>${url}</loc>${lastModified ? `<lastmod>${lastModified}</lastmod>` : ""}</url>`
        )
        .join("\n")}
    </urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating image sitemap:", error);
    return new Response("Error generating image sitemap", { status: 500 });
  }
}

async function getImages() {
  return fetchData("/api/images/get-all-images");
}

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}${endpoint}?pageSize=9999`);
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const data = await response.json();
    return Object.values(data)[0] || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}
