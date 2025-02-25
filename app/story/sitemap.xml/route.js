const BASE_URL = process.env.NEXT_PUBLIC_CLIENT || "https://www.clickedart.com";

export async function GET() {
  console.log("Fetching story routes...");

  try {
    const stories = await getStories();

    const storyRoutes = stories.map((s) => ({
      url: `${BASE_URL}/story/${s._id}`,
      lastModified: s.updatedAt || s.createdAt || new Date().toISOString(),
    }));

    console.log("Total story routes generated:", storyRoutes.length);

    if (storyRoutes.length === 0) {
      console.error("🚨 No story URLs found for the sitemap!");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${storyRoutes
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
    console.error("Error generating story sitemap:", error);
    return new Response("Error generating story sitemap", { status: 500 });
  }
}

async function getStories() {
  return fetchData("/api/story/get-all-story");
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
