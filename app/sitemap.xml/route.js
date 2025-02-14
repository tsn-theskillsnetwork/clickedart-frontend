const BASE_URL = process.env.NEXT_PUBLIC_CLIENT || "https://www.clickedart.com";

export async function GET() {
  console.log("Fetching dynamic routes...");

  try {
    const [photographers, images, blogPosts, stories] = await Promise.all([
      getPhotographers(),
      getImages(),
      getBlogs(),
      getStories(),
    ]);

    const staticRoutes = [
      `${BASE_URL}/`,
      `${BASE_URL}/photographer`,
      `${BASE_URL}/images`,
      `${BASE_URL}/blog`,
      `${BASE_URL}/story`,
    ];

    const dynamicRoutes = [
      ...photographers.map((p) => ({
        url: `${BASE_URL}/photographer/${p._id}`,
        lastModified: p.updatedAt || p.createdAt || new Date().toISOString(),
      })),
      ...images.map((i) => ({
        url: `${BASE_URL}/images/${i._id}`,
        lastModified: i.updatedAt || i.createdAt || new Date().toISOString(),
      })),
      ...blogPosts.map((b) => ({
        url: `${BASE_URL}/blog/${b._id}`,
        lastModified: b.updatedAt || b.createdAt || new Date().toISOString(),
      })),
      ...stories.map((s) => ({
        url: `${BASE_URL}/story/${s._id}`,
        lastModified: s.updatedAt || s.createdAt || new Date().toISOString(),
      })),
    ];

    const allRoutes = staticRoutes.map((url) => ({ url })).concat(dynamicRoutes);

    console.log("Total routes generated:", allRoutes.length);

    if (allRoutes.length === 0) {
      console.error("🚨 No URLs found for the sitemap!");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allRoutes
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
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}

async function getPhotographers() {
  return fetchData("/api/photographer/get-all-photographers");
}

async function getImages() {
  return fetchData("/api/images/get-all-images");
}

async function getBlogs() {
  return fetchData("/api/blog/get-all-blogs");
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
