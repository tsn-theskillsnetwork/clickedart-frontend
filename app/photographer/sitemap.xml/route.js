const BASE_URL = process.env.NEXT_PUBLIC_CLIENT || "https://www.clickedart.com";

export async function GET() {
  try {
    const photographers = await getPhotographers();

    const photographerRoutes = photographers.map((p) => ({
      url: `${BASE_URL}/photographer/${p._id}`,
      lastModified: p.updatedAt || p.createdAt || new Date().toISOString(),
    }));


    if (photographerRoutes.length === 0) {
      console.error("🚨 No photographer URLs found for the sitemap!");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${photographerRoutes
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
    console.error("Error generating photographer sitemap:", error);
    return new Response("Error generating photographer sitemap", { status: 500 });
  }
}

async function getPhotographers() {
  return fetchData("/api/photographer/get-all-photographers");
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
