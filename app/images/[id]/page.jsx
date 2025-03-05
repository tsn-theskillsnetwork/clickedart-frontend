import axios from "axios";
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

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const image = await fetchImage(id);

    if (!image) {
      throw new Error("Image not found");
    }

    const keywords = image.keywords?.join(", ") || "Buy Digital Art, Indian Photographers Platform, Premium Archival Prints";

    return {
      title: `${image.title} | ClickedArt`,
      description: `${image.description} - ${keywords}`,
      openGraph: {
        title: `${image.title} | ClickedArt`,
        description: `${image.description} - ${keywords}`,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_CLIENT}/images/${id}`,
        images: [
          {
            url: image.imageLinks?.thumbnail || `/assets/placeholders/image.webp`,
            width: 1200,
            height: 630,
            alt: image.title || "Untitled",
          },
        ],
        additionalMetaTags: [
          {
            property: "product:price:amount",
            content: image.price.original || "0.00",
          },
          { property: "product:price:currency", content: "INR" },
        ],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_CLIENT}/images/${id}`,
      },
    };
  } catch (error) {
    return {
      title: "Image not found | ClickedArt",
      description: "Image not found",
      openGraph: {
        title: "Image not found | ClickedArt",
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

export default async function Image({ params }) {
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
