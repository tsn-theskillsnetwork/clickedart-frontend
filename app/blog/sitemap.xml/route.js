const BASE_URL = process.env.NEXT_PUBLIC_CLIENT || "https://www.clickedart.com";

export async function GET() {
  console.log("Fetching blog routes...");

  try {
    const blogPosts = await getBlogs();

    const blogRoutes = blogPosts.map((b) => ({
      url: `${BASE_URL}/blog/${b._id}`,
      lastModified: b.updatedAt || b.createdAt || new Date().toISOString(),
    }));

    console.log("Total blog routes generated:", blogRoutes.length);

    if (blogRoutes.length === 0) {
      console.error("🚨 No blog URLs found for the sitemap!");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${blogRoutes
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
    console.error("Error generating blog sitemap:", error);
    return new Response("Error generating blog sitemap", { status: 500 });
  }
}

async function getBlogs() {
  return fetchData("/api/blog/get-all-blogs");
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
