const BASE_URL = process.env.NEXT_PUBLIC_CLIENT || "https://www.clickedart.com";

export async function GET() {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap><loc>${BASE_URL}/static/sitemap.xml</loc></sitemap>
    <sitemap><loc>${BASE_URL}/images/sitemap.xml</loc></sitemap>
    <sitemap><loc>${BASE_URL}/blog/sitemap.xml</loc></sitemap>
    <sitemap><loc>${BASE_URL}/photographer/sitemap.xml</loc></sitemap>
    <sitemap><loc>${BASE_URL}/story/sitemap.xml</loc></sitemap>
  </sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
