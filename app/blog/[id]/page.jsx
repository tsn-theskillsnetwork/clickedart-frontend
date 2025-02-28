import axios from "axios";
import BlogPageComponent from "./blog";

const fetchBlogData = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER}/api/blog/get-blog-by-id?id=${id}`
    );
    return response.data.blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw new Error("Failed to fetch blog data");
  }
};

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const blog = await fetchBlogData(id);
    return {
      title: blog.content.title,
      description:
        blog.content.summary?.substring(0, 160) ||
        "Read this amazing blog on our platform.",
      openGraph: {
        title: blog.content.title,
        description: blog.content.summary,
        url: `${process.env.NEXT_PUBLIC_URL}/blog/${id}`,
        images: [
          {
            url: blog.coverImage,
            width: 1200,
            height: 630,
            alt: blog.content.title,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Blog Not Found",
      description: "No blog found with the given ID.",
      openGraph: {
        title: "Blog Not Found",
        description: "No blog found with the given ID.",
        url: `${process.env.NEXT_PUBLIC_URL}/blog/${id}`,
        images: [
          {
            url: "/assets/placeholders/image.webp",
            width: 1200,
            height: 630,
            alt: "Blog Not Found",
          },
        ],
      },
    };
  }
}

export default async function BlogPage({ params }) {
  const { id } = await params;

  try {
    const blog = await fetchBlogData(id);
    return <BlogPageComponent blog={blog} />;
  } catch (error) {
    return <p>Blog not found.</p>;
  }
}
