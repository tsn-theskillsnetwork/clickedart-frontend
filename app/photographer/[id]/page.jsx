import axios from "axios";
import ProfilePage from "./profile";

const fetchPhotoggrapher = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/get-photographer-by-id?photographerId=${id}`
    );
    return response.data.photographer;
  } catch (error) {
    console.log("Error fetching Photographer data", error);
    throw new Error("Failed to fetch Photographer data");
  }
};

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const photographer = await fetchPhotoggrapher(id);

    if (!photographer) {
      throw new Error("Photographer not found");
    }

    return {
      title: `${photographer.firstName} ${photographer.lastName}`,
      description: photographer.bio || "No bio available",
      openGraph: {
        title: `${photographer.firstName} ${photographer.lastName}`,
        description: photographer.bio || "No bio available",
        url: `${process.env.NEXT_PUBLIC_URL}/photographer/${id}`,
        images: [
          {
            url:
              photographer.profileImage || `/assets/placeholders/profile.jpg`,
            width: 1200,
            height: 630,
            alt: `${photographer.firstName} ${photographer.lastName}'s Profile Image`,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Photographer not found",
      description: "Photographer not found",
      openGraph: {
        title: "Photographer not found",
        description: "Photographer not found",
        images: [
          {
            url: `/assets/placeholders/profile.jpg`,
            width: 1200,
            height: 630,
            alt: "Default profile image",
          },
        ],
      },
    };
  }
}

export default async function BlogPage({ params }) {
  const { id } = await params;

  try {
    const photographer = await fetchPhotoggrapher(id);
    return <ProfilePage photographer={photographer} />;
  } catch (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-center mt-20">
          Photographer not found
        </h1>
      </div>
    );
  }
}
