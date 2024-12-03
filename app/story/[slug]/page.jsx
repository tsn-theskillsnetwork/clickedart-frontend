"use client";

import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import {
  Link2,
  MessageSquare,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function StoryPage() {
  const { slug } = useParams();

  const [visibleComments, setVisibleComments] = useState(2);

  const data = {
    title: "Title",
    photographer: "Photographer Name",
    profile_url: "/profile/photographer",
    photographerPhoto: "https://via.placeholder.com/150",
    photo: "/assets/Hahnemuhle Photo Canvas 320 GSM 2.jpg",
    storyTitle: "Story Title",
    story:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet, odio in ultricies tincidunt, sapien ante consequat nunc, nec volutpat ex nunc sit amet risus. Donec auctor, ligula nectincidunt ultricies, nunc nunc ultricies",
    date: "Date",
    location: "Location",
    camera: "Canon EOS 5D Mark IV",
    lens: "Canon EF 24-70mm f/2.8L II USM",
    aperture: "1.8",
    shutterSpeed: "1/1000",
    iso: "100",
    photographerBio:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet, odio in ultricies tincidunt, sapien ante consequat nunc, nec volutpat ex nunc sit amet risus. Donec auctor, ligula nectincidunt ultricies, nunc nunc ultricies",
    relatedPhotos: [
      {
        title: "Title",
        src: "https://via.placeholder.com/400x300",
      },
      {
        title: "Title",
        src: "https://via.placeholder.com/400x300",
      },
      {
        title: "Title",
        src: "https://via.placeholder.com/400x300",
      },
      {
        title: "Title",
        src: "https://via.placeholder.com/400x300",
      },
    ],
    tags: ["Tag1", "Tag2", "Tag3"],
  };

  const comments = [
    {
      avatar: "https://via.placeholder.com/150",
      user: "User1",
      comment:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum architecto",
      replies: [
        {
          avatar: "https://via.placeholder.com/150",
          user: "User2",
          likes: 5,
          dislikes: 0,
          date: Date(2021, 10, 10),
          comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, dolore, itaque culpa eligendi quos quo nulla alias dolorem repudiandae temporibus aliquam debitis magni, voluptate ratione blanditiis atque molestias earum illum inventore dignissimos.",
        },
      ],
      likes: 20,
      dislikes: 2,
      date: Date(2021, 10, 10),
    },
    {
      avatar: "https://via.placeholder.com/150",
      user: "User2",
      comment:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, dolore, itaque culpa eligendi quos quo nulla alias dolorem repudiandae temporibus aliquam debitis magni, voluptate ratione blanditiis atque molestias earum illum inventore dignissimos.",
      replies: [],
      likes: 10,
      dislikes: 2,
      date: Date(2021, 10, 10),
    },
    {
      avatar: "https://via.placeholder.com/150",
      user: "User3",
      comment:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. doloremque cum modi laudantium eveniet nesciunt ipsam, nihil inventore quod amet maxime molestiae facere perspiciatis voluptas ex omnis deserunt aliquid at?",
      replies: [],
      likes: 15,
      dislikes: 2,
      date: Date(2021, 10, 10),
    },
    {
      avatar: "https://via.placeholder.com/150",
      user: "User4",
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. cumque eos, ab laboriosam esse suscipit.",
      replies: [
        {
          avatar: "https://via.placeholder.com/150",
          user: "User2",
          likes: 5,
          dislikes: 0,
          date: Date(2021, 10, 10),
          comment:
            "Lorem ipsum dolor sit amet  eos, libero nam porro sed labore id autem quis, nemo neque cumque! Harum a quasi ullam illum hic corrupti ex.",
        },
        {
          avatar: "https://via.placeholder.com/150",
          user: "User3",
          likes: 5,
          dislikes: 0,
          date: Date(2021, 10, 10),
          comment:
            "Lorem ipsum dolor sit ducimus molestiae. Tenetur obcaecati incidunt doloremque cum modi laudantium eveniet nesciunt ipsam, nihil inventore quod amet maxime molestiae facere perspiciatis voluptas ex omnis deserunt aliquid at?",
        },
      ],
      likes: 5,
      dislikes: 2,
      date: Date(2021, 10, 10),
    },
  ];

  const loadMoreComments = () => {
    console.log("Load More Clicked");
    setVisibleComments((prev) => prev + 2);
  };

  return (
    <div className="min-h-screen mb-10 mt-5">
      <div className="flex flex-col sm:flex-row justify-center">
        <div className="flex flex-col gap-4 sm:w-3/5 px-4">
          <div className="flex flex-col">
            <h2 className="text-heading-02 text-primary font-bold">
              {data.title}
            </h2>
            <Link
              href={data.profile_url}
              className="flex flex-row gap-2 items-center"
            >
              <p className="font-medium text-primary underline">
                {data.photographer}
              </p>
              <Link2 size={14} className="text-primary-400" />
            </Link>
          </div>
          <img
            src={data.photo}
            className="w-4/5 border-8 border-white shadow-md shadow-zinc-500 mx-auto"
            alt="placeholder"
          />
          <h5 className="text-heading-05 font-semibold text-primary-400">
            {data.storyTitle}
          </h5>
          <p className="text-lg text-justify">{data.story}</p>
          <h5 className="text-heading-05 font-semibold text-primary-400">
            Photo Details
          </h5>
          <div className="flex flex-wrap items-start justify-start gap-4">
            <div className="flex flex-row gap-2 items-center">
              <Icon icon="ic:round-calendar-today" />
              <p>Date: {data.date}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon icon="ic:round-location-on" />
              <p>Location: {data.location}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon icon="ic:outline-camera-alt" />
              <p>Camera: {data.camera}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon icon="ic:outline-lens" />
              <p>Lens: {data.lens}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon icon="ic:round-camera" />
              <p>Aperture: {data.aperture}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon icon="ic:round-shutter-speed" />
              <p>Shutter Speed: {data.shutterSpeed}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon icon="ic:round-iso" />
              <p>ISO: {data.iso}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4 sm:mt-0 sm:w-1/5 px-4">
          <div className="flex flex-col gap-4 sm:pt-28">
            <h5 className="text-heading-05 text-primary font-bold">
              About Photographer
            </h5>
            <div className="flex flex-row items-center gap-2">
              <img
                src={data.photographerPhoto}
                className="w-12 h-12 rounded-full"
                alt="photographer"
              />
              <Link
                href={data.profile_url}
                className="font-semibold text-md text-primary"
              >
                Photographer Name
              </Link>
            </div>
            <p className="text-justify">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              aliquet, odio in ultricies tincidunt, sapien ante consequat nunc,
              nec volutpat ex nunc sit amet risus. Donec auctor, ligula nec
              tincidunt ultricies, nunc nunc ultricies
            </p>
          </div>
          <div className="flex flex-col gap-4 pt-4">
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
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:w-4/5 mx-auto px-4 mt-5 justify-start items-start">
        <div className="flex flex-row gap-4 py-4">
          <Button icon={<ThumbsUp size={16} />} variant="filled" size="base">
            Like
          </Button>
          <Button icon={<Share size={16} />} variant="filled" size="base">
            Share
          </Button>
        </div>
      </div>
      <div className="flex flex-col sm:w-4/5 mx-auto px-4 justify-start items-start">
        <h5 className="text-heading-05 text-primary-400 font-semibold">Tags</h5>
        <div className="flex flex-row gap-4 py-4">
          {data.tags.map((tag, index) => (
            <Button key={index} variant="pill" size="sm" state="default">
              {tag}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:w-4/5 mx-auto px-4 justify-start items-start">
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
      </div>
    </div>
  );
}
