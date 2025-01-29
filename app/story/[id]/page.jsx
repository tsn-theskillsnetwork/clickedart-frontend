import axios from "axios";
import StoryPageComponent from "./story";

const fetchStoryData = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER}/api/story/get-story-by-id?storyId=${id}`
    );
    return response.data.story;
  } catch (error) {
    console.error("Error fetching story:", error);
    throw new Error("Failed to fetch story data");
  }
};

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const story = await fetchStoryData(id);
    return {
      title: story.title,
      description: story.description?.substring(0, 160) || "Read this amazing story on our platform.",
      openGraph: {
        title: story.title,
        description: story.description,
        url: `${process.env.NEXT_PUBLIC_URL}/story/${id}`,
        image: story.media_url,
      },
    };
  } catch (error) {
    return {
      title: "Story Not Found",
      description: "No story found with the given ID.",
    };
  }
}

export default async function StoryPage({ params }) {
  const id = params?.id;

  if (!id) {
    return <p>Invalid Story ID.</p>;
  }

  console.log("Rendering StoryPage with ID:", id);

  try {
    const story = await fetchStoryData(id);
    return <StoryPageComponent story={story} />;
  } catch (error) {
    return <p>Story not found.</p>;
  }
}
