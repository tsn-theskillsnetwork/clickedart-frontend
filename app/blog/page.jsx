"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function BlogPage() {
  const [blogLength, setBlogLength] = useState(6);
  const blogPosts = [
    {
      authorInfo: {
        author: {
          name: "John Doe",
          avatar: "/assets/images/avatar.jpg",
        },
        authorType: "Author",
      },
      slug: "from-ideas-to-masterpieces",
      content: {
        title: "From Ideas to Masterpieces Heading Lorem Ipsum",
        summary:
          "Inspiration, tips, and stories to bring your creative vision to life. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt velit ullam omnis nam praesentium officiis.",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      },
      coverImage: "/assets/images/img1.jpg",
      tags: ["Art & Design"],
      date: "2024-12-24",
    },
    {
      authorInfo: {
        author: {
          name: "John Doe",
          avatar: "/assets/images/avatar.jpg",
        },
        authorType: "Author",
      },
      slug: "from-ideas-to-masterpieces",
      content: {
        title: "From Ideas to Masterpieces Heading Lorem Ipsum",
        summary:
          "Inspiration, tips, and stories to bring your creative vision to life. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt velit ullam omnis nam praesentium officiis.",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      },
      coverImage: "/assets/images/img2.jpg",
      tags: ["Art & Design"],
      date: "2024-12-24",
    },
    {
      authorInfo: {
        author: {
          name: "John Doe",
          avatar: "/assets/images/avatar.jpg",
        },
        authorType: "Author",
      },
      slug: "from-ideas-to-masterpieces",
      content: {
        title: "From Ideas to Masterpieces Heading Lorem Ipsum",
        summary:
          "Inspiration, tips, and stories to bring your creative vision to life. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt velit ullam omnis nam praesentium officiis.",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      },
      coverImage: "/assets/images/img3.jpg",
      tags: ["Art & Design"],
      date: "2024-12-24",
    },
    {
      authorInfo: {
        author: {
          name: "John Doe",
          avatar: "/assets/images/avatar.jpg",
        },
        authorType: "Author",
      },
      slug: "from-ideas-to-masterpieces",
      content: {
        title: "From Ideas to Masterpieces Heading Lorem Ipsum",
        summary:
          "Inspiration, tips, and stories to bring your creative vision to life. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt velit ullam omnis nam praesentium officiis.",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      },
      coverImage: "/assets/images/img4.jpg",
      tags: ["Art & Design"],
      date: "2024-12-24",
    },
    {
      authorInfo: {
        author: {
          name: "John Doe",
          avatar: "/assets/images/avatar.jpg",
        },
        authorType: "Author",
      },
      slug: "from-ideas-to-masterpieces",
      content: {
        title: "From Ideas to Masterpieces Heading Lorem Ipsum",
        summary:
          "Inspiration, tips, and stories to bring your creative vision to life. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt velit ullam omnis nam praesentium officiis.",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      },
      coverImage: "/assets/images/img5.jpg",
      tags: ["Art & Design"],
      date: "2024-12-24",
    },
    {
      authorInfo: {
        author: {
          name: "John Doe",
          avatar: "/assets/images/avatar.jpg",
        },
        authorType: "Author",
      },
      slug: "from-ideas-to-masterpieces",
      content: {
        title: "From Ideas to Masterpieces Heading Lorem Ipsum",
        summary:
          "Inspiration, tips, and stories to bring your creative vision to life. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt velit ullam omnis nam praesentium officiis.",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      },
      coverImage: "/assets/images/img6.jpg",
      tags: ["Art & Design"],
      date: "2024-12-24",
    },
    {
      authorInfo: {
        author: {
          name: "John Doe",
          avatar: "/assets/images/avatar.jpg",
        },
        authorType: "Author",
      },
      slug: "from-ideas-to-masterpieces",
      content: {
        title: "From Ideas to Masterpieces Heading Lorem Ipsum",
        summary:
          "Inspiration, tips, and stories to bring your creative vision to life. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt velit ullam omnis nam praesentium officiis.",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      },
      coverImage: "/assets/images/img2.jpg",
      tags: ["Art & Design"],
      date: "2024-12-24",
    },
    {
      authorInfo: {
        author: {
          name: "John Doe",
          avatar: "/assets/images/avatar.jpg",
        },
        authorType: "Author",
      },
      slug: "from-ideas-to-masterpieces",
      content: {
        title: "From Ideas to Masterpieces Heading Lorem Ipsum",
        summary:
          "Inspiration, tips, and stories to bring your creative vision to life. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt velit ullam omnis nam praesentium officiis.",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      },
      coverImage: "/assets/images/img3.jpg",
      tags: ["Art & Design"],
      date: "2024-12-24",
    },
  ];
  return (
    <div className="flex flex-col px-4 lg:px-20">
      <div className="relative flex flex-col my-5 sm:my-10 md:my-16 xl:my-20 rounded-2xl overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/11061325/pexels-photo-11061325.jpeg"
          className="absolute inset-0 w-full h-full z-0 object-cover"
          alt="Blog"
          width={1800}
          height={1400}
        />
        <div className="bg-[#14162466] bg-opacity-30 absolute inset-0 z-0"></div>
        <div className="flex flex-col gap-2 mt-20 md:mt-40 xl:mt-80 mb-10 md:mb-20 xl:mb-40 items-center z-10 text-white">
          <h1 className="text-center z-10 text-white text-heading-04 sm:text-heading-03 md:text-heading-02 lg:text-heading-01 font-bold">
            From Ideas to Masterpieces
          </h1>
          <p className="text-center z-10 text-white text-paragraph sm:text-heading-06 md:text-heading-05 lg:text-heading-04 font-semibold">
            Inspiration, tips, and stories to bring your creative vision to
            life.
          </p>
        </div>
      </div>
      <hr className="mb-5 border border-primary-100" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 mb-20">
        {blogPosts.slice(0, blogLength).map((post, index) => (
          <Link
            key={index}
            href={`/blog/${post.slug}`}
            className="flex flex-col gap-4"
          >
            <Image
              src={post.coverImage}
              alt={post.content.title || "Blog Post"}
              width={600}
              height={400}
              className="w-full aspect-[16/9] rounded-lg object-cover"
            />

            <p>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm sm:text-base md:text-heading-06 lg:text-paragraph font-medium text-surface-700 bg-primary-400 bg-opacity-15 rounded-lg px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </p>
            <div className="flex flex-col gap-2">
              <h5 className="text-heading-06 sm:text-heading-05 lg:text-heading-04 font-semibold">
                {post.content.title}
              </h5>
              <div className="flex items-center gap-2">
                <div className="flex gap-2 text-sm md:text-base text-surface-500">
                  <p className="font-bold border-r-2 border-[#7777778f] pr-2">
                    {post.authorInfo.author.name}
                  </p>
                  <p className=""> {post.date}</p>
                </div>
              </div>
              <p className="text-sm sm:text-base md:text-heading-06 lg:text-paragraph font-medium text-surface-600">
                {post.content.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mb-10">
        {blogLength < blogPosts.length && (
          <button
            onClick={() => setBlogLength(blogLength + 3)}
            className="bg-white text-primary font-semibold border-2 border-primary px-8 py-2 rounded-md hover:bg-primary hover:text-white transition-all duration-200"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
