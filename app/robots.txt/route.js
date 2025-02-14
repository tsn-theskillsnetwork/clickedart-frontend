export async function GET() {
    const robots = `User-agent: *
  Allow: /
  Sitemap: ${process.env.NEXT_PUBLIC_CLIENT || "https://clickedart.com"}/sitemap.xml`;
  
    return new Response(robots, {
      headers: { "Content-Type": "text/plain" },
    });
  }
  