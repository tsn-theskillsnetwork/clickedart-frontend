const BASE_URL = process.env.NEXT_PUBLIC_CLIENT || "https://www.clickedart.com";

export async function GET() {
  console.log("Fetching static routes...");

  try {
    const staticRoutes = [
      `${BASE_URL}/`,
      `${BASE_URL}/photographer`,
      `${BASE_URL}/featured-artists`,
      `${BASE_URL}/themes`,
      `${BASE_URL}/images`,
      `${BASE_URL}/blog`,
      `${BASE_URL}/story`,
      `${BASE_URL}/membership`,
      `${BASE_URL}/signin`,
      `${BASE_URL}/signup`,
      `${BASE_URL}/terms`,
      `${BASE_URL}/privacy-policy`,
      `${BASE_URL}/explore`,
      `${BASE_URL}/verify`,
      `${BASE_URL}/reset-pass`,
      `${BASE_URL}/signup/photographer`,
      `${BASE_URL}/support/bulk-download`,
      `${BASE_URL}/support/custom-enquiry`,
      `${BASE_URL}/support/printing-guide`,
    ].map((url) => ({
      url,
      lastModified: new Date().toISOString(),
    }));

    console.log("Total static routes generated:", staticRoutes.length);

    if (staticRoutes.length === 0) {
      console.error("🚨 No static URLs found for the sitemap!");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticRoutes
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
    console.error("Error generating static sitemap:", error);
    return new Response("Error generating static sitemap", { status: 500 });
  }
}
