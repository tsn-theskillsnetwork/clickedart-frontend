"use client";

import Button from "@/components/button";
import Loader from "@/components/loader";
import { Icon } from "@iconify/react";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProfilePage({ photographer }) {
  const id = useParams().id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedTab, setSelectedTab] = useState("photos");
  const [catalogues, setCatalogues] = useState([]);
  const [stats, setStats] = useState(null);
  const brandColors = {
    facebook: "text-[#3b5999]",
    messenger: "text-[#0084ff]",
    twitter: "text-[#55acee]",
    linkedin: "text-[#0077b5]",
    skype: "text-[#00aff0]",
    dropbox: "text-[#007ee5]",
    wordpress: "text-[#21759b]",
    vimeo: "text-[#1ab7ea]",
    slideshare: "text-[#0077b5]",
    vk: "text-[#4c75a3]",
    tumblr: "text-[#34465d]",
    yahoo: "text-[#410093]",
    "google-plus": "text-[#dd4b39]",
    pinterest: "text-[#bd081c]",
    youtube: "text-[#cd201f]",
    stumbleupon: "text-[#eb4924]",
    reddit: "text-[#ff5700]",
    quora: "text-[#b92b27]",
    yelp: "text-[#af0606]",
    weibo: "text-[#df2029]",
    producthunt: "text-[#da552f]",
    hackernews: "text-[#ff6600]",
    soundcloud: "text-[#ff3300]",
    blogger: "text-[#f57d00]",
    whatsapp: "text-[#25d366]",
    wechat: "text-[#09b83e]",
    line: "text-[#00c300]",
    medium: "text-[#02b875]",
    vine: "text-[#00b489]",
    slack: "text-[#3aaf85]",
    instagram: "text-[#e4405f]",
    dribbble: "text-[#ea4c89]",
    flickr: "text-[#ff0084]",
    foursquare: "text-[#f94877]",
    behance: "text-[#131418]",
    snapchat: "text-[#fffc00]",
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-images-by-photographer?photographer=${id}&pageSize=1000`
      );
      setPhotos(res.data.photos);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographeranalytics/get-photographer-analytics?photographer=${id}`
      );
      setStats(res.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogues = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/get-catalogues-by-photographer?photographer=${id}&pageSize=1000`
      );
      setCatalogues(res.data.catalogues);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/blog/get-my-blogs?author=${photographer._id}&pageSize=1000`
      );
      const data = response.data;

      setBlogs(data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPhotos();
    fetchCatalogues();
    fetchBlogs();
  }, [id]);

  return (
    <>
      {photographer ? (
        <div className="flex flex-col min-h-screen pb-20">
          <div className="w-full">
            <Image
              src={photographer.coverImage || "/assets/placeholders/image.webp"}
              alt="bg1"
              width={1920}
              height={800}
              className="object-cover w-full h-40 lg:h-80"
            />
          </div>
          <div className="relative flex flex-col items-center -mt-16 lg:-mt-28">
            <Image
              src={
                photographer?.profileImage || "/assets/placeholders/profile.jpg"
              }
              alt="avatar"
              width={150}
              height={150}
              className="rounded-full h-28 w-28 lg:h-52 lg:w-52 object-cover border-[3px] lg:border-[6px] border-white"
            />
            <p className="px-4 py-2 rounded-full capitalize bg-black font-medium text-white -mt-6">
              {photographer?.rank}
            </p>
            <div className="flex gap-2 items-center">
              <p className="text-heading-06 lg:text-heading-02 font-semibold lg:font-medium">
                {photographer?.firstName + " " + photographer?.lastName}
              </p>
              {photographer?._id === process.env.NEXT_PUBLIC_OFFICIAL_ID && (
                <CheckCircle2 className="text-white fill-blue-500 size-6 lg:size-12" />
              )}
            </div>
            <p className="text-sm lg:text-heading-05 font-medium lg:font-normal text-surface-500 lg:-mt-4">
              {photographer.shippingAddress &&
                photographer.shippingAddress?.city +
                  ", " +
                  photographer.shippingAddress?.country}
            </p>
            <p className="font-normal lg:font-medium text-xs lg:text-heading-06 text-surface-500 mt-2 lg:mt-4 text-center max-w-2xl">
              {photographer?.bio}
            </p>

            {photographer && (
              <div className="flex flex-row justify-center gap-5">
                {photographer.connectedAccounts?.length > 0
                  ? photographer.connectedAccounts.map((account, index) => (
                      <Link
                        key={index}
                        href={
                          !account.accountLink.startsWith("https://")
                            ? `https://${account.accountLink}`
                            : account.accountLink
                        }
                        className="text-sm font-medium"
                        target="_blank" // Opens in a new tab
                        rel="noopener noreferrer" // For security
                      >
                        <Icon
                          icon={"entypo-social:" + account.accountName}
                          width="40"
                          height="40"
                          className={
                            brandColors[account.accountName.toLowerCase()] ||
                            "text-primary"
                          }
                        />
                      </Link>
                    ))
                  : null}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 lg:gap-8 mt-4 px-4 max-w-2xl">
              <div className="flex flex-col items-center text-center border-r-2 border-surface-500 pr-2 lg:pr-8">
                <p className="text-paragraph lg:text-heading-03 font-medium">
                  {photos?.length}
                </p>
                <p className="text-xs lg:text-heading-06 font-medium text-surface-500">
                  Gallery Items
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-paragraph lg:text-heading-03 font-medium">
                  {photos
                    ?.filter((photo) => photo.imageAnalytics?.views)
                    .reduce(
                      (acc, photo) => acc + (photo.imageAnalytics?.views || 0),
                      0
                    )}
                </p>
                <p className="text-xs lg:text-heading-06 font-medium text-surface-500">
                  Impressions This Month
                </p>
              </div>
              <div className="flex flex-col items-center text-center border-l-2 border-surface-500 pl-2 lg:pl-8">
                <p className="text-paragraph lg:text-heading-03 font-medium">
                  {stats?.downloads || 0}
                </p>
                <p className="text-xs lg:text-heading-06 font-medium text-surface-500">
                  Downloads
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex gap-10 text-base lg:text-heading-03 px-4 lg:px-24 py-4">
            <p
              onClick={() => {
                setSelectedTab("photos");
              }}
              className={`${
                selectedTab === "photos"
                  ? "text-primary font-semibold"
                  : "text-surface-400"
              } cursor-pointer`}
            >
              Photos
            </p>
            <p
              onClick={() => {
                setSelectedTab("catalogues");
              }}
              className={`${
                selectedTab === "catalogues"
                  ? "text-primary font-semibold"
                  : "text-surface-400"
              } cursor-pointer`}
            >
              Catalogues
            </p>
            <p
              onClick={() => {
                setSelectedTab("blogs");
              }}
              className={`${
                selectedTab === "blogs"
                  ? "text-primary font-semibold"
                  : "text-surface-400"
              } cursor-pointer`}
            >
              Blogs
            </p>
            <div
              className={`h-[2px] lg:h-[4px] bg-primary absolute bottom-3 ${
                selectedTab === "catalogues"
                  ? "left-[7rem] w-[6rem] lg:left-[17rem] lg:w-[15rem]"
                  : selectedTab === "blogs"
                  ? "left-[15rem] w-[3.3rem] lg:left-[33.5rem] lg:w-[8rem]"
                  : "left-[0.8rem] w-[4rem] lg:left-[6rem] lg:w-[9rem]"
              } transition-all duration-300 ease-in-out`}
            ></div>
          </div>
          <hr className="mt-[-14px] lg:-mt-4 border lg:border-2" />
          <div className="py-10 px-4 lg:px-24 bg-[#FCFAFA]">
            {selectedTab === "photos" ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {photos.map((image) => (
                  <div
                    className="relative group shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                    key={image._id}
                  >
                    <Link
                      href={`/images/${image._id}`}
                      className="block overflow-hidden"
                    >
                      <Image
                        width={800}
                        height={800}
                        priority
                        onContextMenu={(e) => e.preventDefault()}
                        src={
                          image.imageLinks.thumbnail ||
                          "/assets/placeholders/broken-image.png"
                        }
                        alt={image.description || "Image"}
                        className="object-cover w-full aspect-[1/1] transition-transform duration-300 hover:scale-[1.02]"
                      />
                    </Link>

                    <div className="p-4 bg-white flex flex-col gap-1">
                      <h3 className="text-lg font-semibold text-zinc-900 capitalize">
                        {image.title || "Untitled"}
                      </h3>
                      {image.category?.length > 0 && (
                        <p className="text-sm font-medium text-zinc-500">
                          {image.category.map((cat) => cat.name).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {selectedTab === "catalogues" && (
                  <div className="flex flex-col gap-10 py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                      {catalogues?.map((catalogue) => (
                        <div
                          key={catalogue._id}
                          className="relative bg-white flex flex-col gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.2)] p-4 rounded-md"
                        >
                          <Link
                            href={`/catalogue/${catalogue._id}`}
                            className="grid grid-cols-2 gap-4 pb-5 aspect-[1/1]"
                          >
                            {catalogue.images?.length > 0 ? (
                              <>
                                {catalogue.images?.slice(0, 3).map((image) => (
                                  <div
                                    key={image._id}
                                    className="shadow-[0_2px_6px_rgba(0,0,0,0.2)] aspect-[1/1] rounded-md overflow-hidden"
                                  >
                                    <Image
                                      width={800}
                                      height={800}
                                      priority
                                      src={
                                        image.imageLinks.thumbnail ||
                                        image.imageLinks.small ||
                                        image.imageLinks.medium ||
                                        image.imageLinks.original
                                      }
                                      alt={image.description}
                                      className="object-cover w-full aspect-[1/1]"
                                    />
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="flex flex-col col-span-2 items-center justify-center w-full">
                                <p className="text-paragraph font-medium">
                                  No images in this catalogue
                                </p>
                              </div>
                            )}
                            {catalogue.images?.length > 3 && (
                              <div className="shadow-[0_2px_6px_rgba(0,0,0,0.2)] aspect-[1/1] rounded-md overflow-hidden">
                                <div className="bg-black bg-opacity-10 w-full h-full flex items-center justify-center">
                                  <p className="text-paragraph font-medium text-center">
                                    +{catalogue.images?.length - 3}
                                  </p>
                                </div>
                              </div>
                            )}
                          </Link>
                          <div className=" px-4 bottom-0 flex justify-between items-center mt-0">
                            <div className="flex flex-col">
                              <p className="text-heading-05 font-semibold">
                                {catalogue.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTab === "blogs" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {blogs.map((blog) => (
                      <Link
                        href={`/blog/${blog._id}`}
                        key={blog._id}
                        className="flex flex-col w-full aspect-[1/1] justify-between gap-4 p-4 bg-white rounded-lg shadow-md"
                      >
                        <div className="flex flex-col gap-4">
                          <Image
                            width={800}
                            height={800}
                            src={blog.coverImage[0]}
                            alt={blog.content?.title || "Blog cover image"}
                            className="w-full object-cover rounded-lg"
                          />

                          <h2 className="text-lg font-semibold">
                            {blog.content.title}
                          </h2>
                          <p className="text-sm text-gray-700 truncate">
                            {blog.content.summary}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-2 items-center">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold"
                              >
                                {tag}
                              </span>
                            ))}
                            <span className="text-sm text-gray-600 font-semibold">
                              {blog.tags.length > 3 &&
                                `+${blog.tags.length - 3} more`}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader />
        </div>
      )}
    </>
  );
}
