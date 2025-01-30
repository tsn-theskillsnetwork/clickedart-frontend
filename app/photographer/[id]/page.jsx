"use client";

import Button from "@/components/button";
import Loader from "@/components/loader";
import { Icon } from "@iconify/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const id = useParams().id;

  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedTab, setSelectedTab] = useState("photos");
  const [catalogues, setCatalogues] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchPhotoggrapher = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/get-photographer-by-id?photographerId=${id}`
      );
      setPhotographer(response.data.photographer);
    } catch (error) {
      console.log("Error fetching Photographer data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-images-by-photographer?photographer=${id}`
      );
      // //console.log(res.data);
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
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/get-catalogues-by-photographer?photographer=${id}`
      );
      setCatalogues(res.data.catalogues);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPhotoggrapher();
    fetchPhotos();
    fetchStats();
    fetchCatalogues();
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
              className="object-cover w-full h-40 lg:h-96"
            />
          </div>
          <div className="relative flex flex-col items-center -mt-16 lg:-mt-28">
            <Image
              src={photographer?.profileImage || "/assets/placeholders/profile.jpg"}
              alt="avatar"
              width={150}
              height={150}
              className="rounded-full h-28 w-28 lg:h-52 lg:w-52 object-cover border-[3px] lg:border-[6px] border-white"
            />
            <p className="px-4 py-2 rounded-full capitalize bg-black font-medium text-white -mt-6">
              {photographer?.rank}
            </p>
            <p className="text-heading-06 lg:text-heading-01 font-semibold lg:font-medium">
              {photographer.firstName
                ? photographer?.firstName + " " + photographer?.lastName
                : photographer?.name}
            </p>
            <p className="text-sm lg:text-heading-03 font-medium lg:font-normal text-surface-500 lg:-mt-4">
              {photographer.shippingAddress &&
                photographer.shippingAddress?.city +
                  ", " +
                  photographer.shippingAddress?.country}
            </p>
            <p className="font-normal lg:font-medium text-xs lg:text-heading-05 text-surface-500 mt-2 lg:mt-4 text-center max-w-2xl">
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
                          className="text-primary"
                        />
                      </Link>
                    ))
                  : null}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 lg:gap-8 mt-4 px-4 max-w-2xl">
              <div className="flex flex-col items-center text-center border-r-2 border-surface-500 pr-2 lg:pr-8">
                <p className="text-paragraph lg:text-heading-01 font-normal">
                  {photos?.length}
                </p>
                <p className="text-xs lg:text-heading-04 font-semibold text-surface-500">
                  Gallery Items
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-paragraph lg:text-heading-01 font-normal">
                  {photos
                    ?.filter((photo) => photo.imageAnalytics?.views)
                    .reduce(
                      (acc, photo) => acc + (photo.imageAnalytics?.views || 0),
                      0
                    )}
                </p>
                <p className="text-xs lg:text-heading-04 font-semibold text-surface-500">
                  Impressions This Month
                </p>
              </div>
              <div className="flex flex-col items-center text-center border-l-2 border-surface-500 pl-2 lg:pl-8">
                <p className="text-paragraph lg:text-heading-01 font-normal">
                  {stats?.downloads || 0}
                </p>
                <p className="text-xs lg:text-heading-04 font-semibold text-surface-500">
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
            <div
              className={`h-[2px] lg:h-[4px] bg-primary absolute bottom-3 ${
                selectedTab === "photos"
                  ? "left-[0.8rem] w-[4rem] lg:left-[6rem] lg:w-[9rem]"
                  : "left-[7rem] w-[6rem] lg:left-[17rem] lg:w-[15rem]"
              } transition-all duration-300 ease-in-out`}
            ></div>
          </div>
          <hr className="mt-[-14px] lg:-mt-4 border lg:border-2" />
          <div className="py-10 px-4 lg:px-24 bg-[#FCFAFA]">
            {selectedTab === "photos" ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {photos.map((image) => (
                  <div
                    // href={`/images/${image._id}`}
                    className="relative group shadow-[2px_2px_6px_rgba(0,0,0,0.4)]"
                    key={image._id}
                  >
                    <Link href={`/images/${image._id}`}>
                      <Image
                        width={800}
                        height={800}
                        priority
                        onContextMenu={(e) => e.preventDefault()}
                        src={image.imageLinks.thumbnail || "/assets/placeholders/broken-image.png"}
                        alt={image.description}
                        // onClick={() => {
                        //   router.push(`/images/${image._id}`);
                        // }}
                        className="object-cover w-full aspect-[1/1] transition-all duration-200 ease-linear"
                      />
                    </Link>

                    {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 ease-linear">
                      <div className="flex justify-between px-2 pt-2">
                        <div className="">
                          <div className="bg-white px-2 text-paragraph bg-opacity-75 w-fit transition-all duration-200 ease-linear cursor-default">

                          </div>
                        </div>
                      </div>
                    </div> */}

                    <div className="text-black flex justify-between items-start px-4">
                      <div className="text-heading-05 font-semibold capitalize">
                        {image.title || "Untitled"}
                        <p className="text-base font-medium text-surface-500">
                          {image.category?.map((cat) => cat.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
                            {catalogue.images?.map((image) => (
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
