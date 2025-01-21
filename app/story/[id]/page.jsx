"use client";

import Button from "@/components/button";
import Loader from "@/components/loader";
import { fetchData } from "@/helpers/api";
import { Icon } from "@iconify/react";
import axios from "axios";
import {
  Link2,
  MessageSquare,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function StoryPage() {
  const { id } = useParams();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState(null);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/story/get-story-by-id?storyId=${id}`
      );
      setStory(response.data.story);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [id]);

  const handleShare = async () => {
    const currentUrl = window.location.origin + pathname;

    try {
      await window.navigator.share({
        title: story.title,
        text: story.description,
        url: currentUrl,
      });
      console.log("Share successful");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  console.log(story);

  // const [visibleComments, setVisibleComments] = useState(2);

  return (
    <>
      {story ? (
        <div className="min-h-screen mb-10">
          <div className="flex flex-col sm:flex-row justify-center">
            <div className="flex flex-col gap-4 sm:w-3/5 px-4">
              <div className="flex flex-col">
                <h2 className="text-heading-02 text-primary font-bold">
                  {story.title}
                </h2>
                <Link
                  href={`/photographer/${story.inspiredBy?.photographer._id}`}
                  className="flex flex-row gap-2 items-center"
                >
                  <p className="font-medium text-primary underline">
                    {story.inspiredBy?.photographer.firstName}{" "}
                    {story.inspiredBy?.photographer.lastName}
                  </p>
                  <Link2 size={14} className="text-primary-400" />
                </Link>
              </div>
              <img
                src={story.media_url}
                className="w-4/5 border-8 border-white shadow-md shadow-zinc-500 mx-auto"
                alt="placeholder"
              />

              <div
                className="prose max-w-full"
                dangerouslySetInnerHTML={{
                  __html: story.description,
                }}
              />
              {/* <p className="text-lg text-justify">{story.description}</p> */}
              <h5 className="text-heading-05 font-semibold text-primary-400">
                Photo Details
              </h5>
              <div className="grid grid-cols-2">
                <Image
                  src={story.inspiredBy?.imageLinks.thumbnail}
                  alt="thumbnail"
                  width={800}
                  height={800}
                  className="border-8 border-white shadow-md shadow-zinc-500"
                />
                <h2 className="text-heading-03 text-primary font-bold">
                  {story.inspiredBy?.title}
                </h2>
              </div>
              <div className="flex flex-wrap items-start justify-start gap-4">
                {story.inspiredBy?.location && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:round-location-on" />
                    <p>Location: {story.inspiredBy?.location}</p>
                  </div>
                )}
                {story.inspiredBy?.cameraDetails?.camera && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:outline-camera-alt" />
                    <p>Camera: {story.inspiredBy?.cameraDetails?.camera}</p>
                  </div>
                )}
                {story.inspiredBy?.cameraDetails?.lens && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:outline-lens" />
                    <p>Lens: {story.inspiredBy?.cameraDetails?.lens}</p>
                  </div>
                )}
                {story.inspiredBy?.cameraDetails?.settings?.aperture && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:round-camera" />
                    <p>
                      Aperture:{" "}
                      {story.inspiredBy?.cameraDetails?.settings?.aperture}
                    </p>
                  </div>
                )}
                {story.inspiredBy?.cameraDetails?.settings?.shutterSpeed && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:round-shutter-speed" />
                    <p>
                      Shutter Speed:{" "}
                      {story.inspiredBy?.cameraDetails?.settings?.shutterSpeed}
                    </p>
                  </div>
                )}
                {story.inspiredBy?.cameraDetails?.settings?.iso && (
                  <div className="flex flex-row gap-2 items-center">
                    <Icon icon="ic:round-iso" />
                    <p>ISO: {story.inspiredBy?.cameraDetails?.settings?.iso}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col mt-4 sm:mt-0 sm:w-1/5 px-4">
              <div className="flex flex-col gap-4 sm:pt-28">
                <h5 className="text-heading-05 text-primary font-bold">
                  Inspired By
                </h5>
                <div className="flex flex-row items-center gap-2">
                  <img
                    src={story.inspiredBy?.photographer.profileImage}
                    className="w-12 h-12 rounded-full"
                    alt="photographer"
                  />
                  <Link
                    href={`/photographer/${story.inspiredBy?.photographer._id}`}
                    className="font-semibold text-md text-primary"
                  >
                    {story.inspiredBy?.photographer.firstName}{" "}
                    {story.inspiredBy?.photographer.lastName}
                  </Link>
                </div>
                <p className="text-justify">
                  {story.inspiredBy?.photographer.bio}
                </p>
              </div>
              {/* <div className="flex flex-col gap-4 pt-4">
            <h5 className="text-heading-05 text-primary font-bold">
              Related Photos:
            </h5>
            <div className="flex flex-wrap -m-2">
              <Link href={""} className="group w-1/2 p-2">
                <div className="shadow-md p-2 pb-0 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200 group-active:translate-y-0 group-active:shadow-none">
                  <img
                    src="https://via.placeholder.com/400x300"
                    alt="photographer"
                  />
                  <p className="font-medium text-center text-sm">Title</p>
                </div>
              </Link>
              <Link href={""} className="group w-1/2 p-2">
                <div className="shadow-md p-2 pb-0 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200 group-active:translate-y-0 group-active:shadow-none">
                  <img
                    src="https://via.placeholder.com/400x300"
                    alt="photographer"
                  />
                  <p className="font-medium text-center text-sm">Title</p>
                </div>
              </Link>
              <Link href={""} className="group w-1/2 p-2">
                <div className="shadow-md p-2 pb-0 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200 group-active:translate-y-0 group-active:shadow-none">
                  <img
                    src="https://via.placeholder.com/400x300"
                    alt="photographer"
                  />
                  <p className="font-medium text-center text-sm">Title</p>
                </div>
              </Link>
              <Link href={""} className="group w-1/2 p-2">
                <div className="shadow-md p-2 pb-0 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200 group-active:translate-y-0 group-active:shadow-none">
                  <img
                    src="https://via.placeholder.com/400x300"
                    alt="photographer"
                  />
                  <p className="font-medium text-center text-sm">Title</p>
                </div>
              </Link>
            </div>
          </div> */}
            </div>
          </div>
          <div className="flex flex-col sm:w-4/5 mx-auto px-4 mt-5 justify-start items-start">
            <div className="flex flex-row gap-4 py-4">
              {/* <Button icon={<ThumbsUp size={16} />} variant="filled" size="base">
            Like
          </Button> */}
              <Button
                onClick={handleShare}
                icon={<Share size={16} />}
                variant="filled"
                size="base"
              >
                Share
              </Button>
            </div>
          </div>
          {/* <div className="flex flex-col sm:w-4/5 mx-auto px-4 justify-start items-start">
        <h5 className="text-heading-05 text-primary-400 font-semibold">Tags</h5>
        <div className="flex flex-row gap-4 py-4">
          {data.tags.map((tag, index) => (
            <Button key={index} variant="pill" size="sm" state="default">
              {tag}
            </Button>
          ))}
        </div>
      </div> */}
          {/* <div className="flex flex-col sm:w-4/5 mx-auto px-4 justify-start items-start">
        <h5 className="text-heading-05 text-primary-400 font-semibold">
          Comments
        </h5>
        <div className="flex flex-row gap-4 p-4 items-center w-full bg-gray-100 rounded-xl mb-4 shadow-md">
          <textarea
            className="w-full pb-5 bg-transparent active:bg-transparent focus:bg-transparent outline-none active:outline-none focus:outline-none"
            placeholder="Write a comment..."
          />
          <Button variant="filled" size="base">
            Post
          </Button>
        </div>
        <div className="flex flex-col gap-4 w-full">
          {comments.slice(0, visibleComments).map((comment, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.user}
                  className="w-10 rounded-full"
                />
                <p className="font-semibold text-black">{comment.user}</p>
              </div>
              <p className="text-sm text-black text-justify ml-14">
                {comment.comment}
              </p>
              <div className="flex flex-row gap-4 ml-14">
                <button>
                  <div className="flex flex-row gap-1 items-center group hover:text-blue-500 hover:font-semibold">
                    <ThumbsUp size={16} className="group-hover:stroke-[3px]" />
                    {comment.likes}
                  </div>
                </button>
                <button>
                  <div className="flex flex-row gap-1 items-center group hover:text-red-500 hover:font-semibold">
                    <ThumbsDown
                      size={16}
                      className="group-hover:stroke-[3px]"
                    />
                    {comment.dislikes}
                  </div>
                </button>
                <button>
                  <div className="flex flex-row gap-1 items-center group hover:text-cyan-500 hover:font-semibold">
                    <MessageSquare
                      size={16}
                      className="group-hover:stroke-[3px]"
                    />
                    Reply
                  </div>
                </button>
              </div>
              <div className="flex flex-col gap-4 pl-9 ml-5 border-l-2 border-zinc-100">
                {comment.replies.map((reply, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-3">
                      <img
                        src={reply.avatar}
                        alt={reply.user}
                        className="w-10 rounded-full"
                      />
                      <p className="font-semibold text-black">{reply.user}</p>
                    </div>
                    <p className="text-sm text-black text-justify ml-14">
                      {reply.comment}
                    </p>
                    <div className="flex flex-row gap-4 ml-14">
                      <button>
                        <div className="flex flex-row gap-2 items-center group hover:text-blue-500 hover:font-semibold">
                          <ThumbsUp
                            size={16}
                            className="group-hover:stroke-[3px]"
                          />
                          {reply.likes}
                        </div>
                      </button>
                      <button>
                        <div className="flex flex-row gap-2 items-center group hover:text-red-500 hover:font-semibold">
                          <ThumbsDown
                            size={16}
                            className="group-hover:stroke-[3px]"
                          />
                          {reply.dislikes}
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="flex flex-row justify-center items-center w-full mt-5">
              <p className="text-lg text-gray-400">No comments yet</p>
            </div>
          )}
          {visibleComments < comments.length && (
            <div className="flex flex-row gap-2 justify-center items-center w-full text-secondary-300 hover:text-secondary-400">
              <button
                className="font-medium hover:underline"
                onClick={loadMoreComments}
              >
                Load More
              </button>
              <Icon icon="ic:round-arrow-downward" />
            </div>
          )}
        </div>
      </div> */}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          {loading ? <Loader /> : <p>No Story Found</p>}
        </div>
      )}
    </>
  );
}
