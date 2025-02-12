import axios from "axios";
import sharp from "sharp";
import ImagePage from "./image";

const fetchImage = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-image-by-id?id=${id}`
    );
    return response.data.photo;
  } catch (error) {
    console.log("Error fetching Image data", error);
    throw new Error("Failed to fetch Image data");
  }
};

const optimizeImage = async (imageUrl) => {
  try {
    // Fetch image as binary
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Optimize using Sharp
    const optimizedBuffer = await sharp(Buffer.from(response.data))
      .resize(1200, 630, { fit: "cover" }) // Resize for Open Graph
      .toFormat("webp", { quality: 80 }) // Convert to WebP
      .toBuffer();

    // Convert buffer to base64 data URL
    return `data:image/webp;base64,${optimizedBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error optimizing image:", error);
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const image = await fetchImage(id);

    if (!image) {
      throw new Error("Image not found");
    }

    // Optimize image
    const optimizedImage = await optimizeImage(image.imageLinks?.thumbnail);

    return {
      title: image.title || "Untitled",
      description: image.description || "No description available",
      openGraph: {
        title: image.title || "Untitled",
        description: image.description || "No description available",
        type: "website",
        additionalMetaTags: [
          {
            property: "product:price:amount",
            content: image.price.original || "0.00",
          },
          { property: "product:price:currency", content: "INR" },
        ],
        url: `${process.env.NEXT_PUBLIC_URL}/images/${id}`,
        images: [
          {
            url: optimizedImage || `/assets/placeholders/image.webp`,
            width: 1200,
            height: 630,
            alt: image.title || "Untitled",
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Image not found",
      description: "Image not found",
      openGraph: {
        title: "Image not found",
        description: "Image not found",
        images: [
          {
            url: `/assets/placeholders/image.webp`,
            width: 1200,
            height: 630,
            alt: "Default image",
          },
        ],
      },
    };
  }
}

export default async function BlogPage({ params }) {
  const { id } = await params;

  try {
    const image = await fetchImage(id);
    return <ImagePage image={image} />;
  } catch (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-center mt-20">
          Image not found
        </h1>
      </div>
    );
  }
}
