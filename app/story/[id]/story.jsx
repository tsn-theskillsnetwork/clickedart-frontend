"use client";

import Button from "@/components/button";
import Loader from "@/components/loader";
import { Icon } from "@iconify/react";
import { Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function StoryPageComponent({
    story,
}) {
  const handleShare = async () => {
    const currentUrl = window.location.origin + pathname;

    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title || "Check this out!",
          text:
            story.description ||
            "I found this interesting and wanted to share it with you.",
          url: currentUrl,
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

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
              </div>
              <Image
                width={800}
                height={800}
                src={story.media_url}
                className="w-4/5 border-8 border-white shadow-md shadow-zinc-500 mx-auto"
                alt="placeholder"
              />

              <div
                className="prose max-w-full space-y-0"
                dangerouslySetInnerHTML={{
                  __html: story.description,
                }}
              />
              {/* <p className="text-lg text-justify">{story.description}</p> */}
              <h5 className="text-heading-05 font-semibold text-primary-400">
                Photo Details
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Link
                  href={`/images/${story.inspiredBy?._id}`}
                  className="flex flex-col items-start justify-start gap-4"
                >
                  <Image
                    src={story.inspiredBy?.imageLinks.thumbnail}
                    alt="thumbnail"
                    width={800}
                    height={800}
                    className="border-8 border-white shadow-md shadow-zinc-500"
                  />
                  <h2 className="text-heading-06 text-primary font-bold">
                    {story.inspiredBy?.title}
                  </h2>
                </Link>

                <div className="flex flex-col items-start justify-start gap-4">
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
                        {
                          story.inspiredBy?.cameraDetails?.settings
                            ?.shutterSpeed
                        }
                      </p>
                    </div>
                  )}
                  {story.inspiredBy?.cameraDetails?.settings?.iso && (
                    <div className="flex flex-row gap-2 items-center">
                      <Icon icon="ic:round-iso" />
                      <p>
                        ISO: {story.inspiredBy?.cameraDetails?.settings?.iso}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-4 sm:mt-0 sm:w-1/5 px-4">
              <div className="flex flex-col gap-4 sm:pt-28">
                <h5 className="text-heading-05 text-primary font-bold">
                  Inspired By
                </h5>
                <div className="flex flex-row items-center gap-2">
                  <Image
                    width={48}
                    height={48}
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
            </div>
          </div>
          <div className="flex flex-col sm:w-4/5 mx-auto px-4 mt-5 justify-start items-start">
            <div className="flex flex-row gap-4 py-4">
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
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          {loading ? <Loader /> : <p>No Story Found</p>}
        </div>
      )}
    </>
  );
}
