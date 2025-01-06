"use client";

import useAuthStore from "@/authStore";
import { AppSidebar } from "@/components/app-sidebar";
import Button2 from "@/components/button2";
import NumberCard from "@/components/cards/numberCard";
import Loader from "@/components/loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import axios from "axios";
import { Dot, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PhotosPage() {
  const router = useRouter();

  const { photographer } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [stats, setStats] = useState([]);
  const [selected, setSelected] = useState("uploaded");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-images-by-photographer?photographer=${photographer._id}`
        );
        console.log(res.data);
        setPhotos(res.data.photos);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/photographeranalytics/get-photographer-analytics?photographer=${photographer._id}`
        );
        console.log("Stats", res.data);
        setStats(res.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPhotos();
    fetchStats();
  }, [photographer]);

  return (
    <SidebarProvider>
      <AppSidebar currentUrl={"/dashboard/photos"} />
      <SidebarInset className="">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Loader />;
          </div>
        ) : (
          <div className="flex flex-col p-4">
            <div className="flex font-medium pl-2">
              {/* <NumberCard
                title="Total Downloads"
                number={String(stats?.downloads) || "0"}
                color="blue"
              />
              <NumberCard
                title="Uploaded Photos"
                number={String(stats?.totalUploadingImgCount) || "0"}
              />
              <NumberCard
                title="Pending Photos"
                number={String(stats?.pendingImagesCount) || "0"}
                color="red"
              /> */}
              <button
                onClick={() => {
                  setSelected("uploaded");
                }}
                className={`${
                  selected === "uploaded"
                    ? "bg-zinc-100 text-black font-semibold"
                    : "text-neutral-600"
                } px-4 py-2 rounded-t-lg`}
              >
                Uploaded ({stats?.totalUploadingImgCount || 0})
              </button>
              <button
                onClick={() => {
                  setSelected("pending");
                }}
                className={`${
                  selected === "pending"
                    ? "bg-zinc-100 text-black font-semibold"
                    : "text-neutral-600"
                } px-4 py-2 rounded-t-lg`}
              >
                Pending ({stats?.pendingImagesCount || 0})
              </button>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-zinc-100 md:min-h-min p-4">
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {photos
                  ?.filter((photo) =>
                    selected === "pending" || selected === "review"
                      ? photo.exclusiveLicenseStatus === selected
                      : true
                  )
                  .map((image) => (
                    <div
                      key={image._id}
                      className="shadow-[0_2px_6px_rgba(0,0,0,0.2)] rounded-lg p-4 bg-white"
                    >
                      <div
                        onClick={() => {
                          router.push(`/images/${image._id}`);
                        }}
                        className="relative group"
                      >
                        <Image
                          width={800}
                          height={800}
                          priority
                          src={
                            image.imageLinks.small ||
                            image.imageLinks.medium ||
                            image.imageLinks.original
                          }
                          alt={image.description}
                          className="object-cover w-full aspect-[1/1] opacity-100 group-hover:opacity-0 transition-all duration-200 ease-linear"
                        />

                        <Image
                          width={400}
                          height={400}
                          src={image.imageLinks.original}
                          alt={image.description}
                          className="absolute inset-0 object-contain w-full aspect-[1/1] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear"
                        />

                        <div className="absolute inset-0">
                          <div className="flex justify-between px-2 pt-2">
                            <div className="">
                              <div className="bg-white px-2 text-paragraph group-hover:opacity-0 bg-opacity-75 w-fit transition-all duration-200 ease-linear cursor-default">
                                <p>
                                  {image.imageAnalytics?.downloads || 0}{" "}
                                  Downloads
                                </p>
                              </div>
                            </div>
                            <div
                              className={`${
                                image.exclusiveLicenseStatus === "approved"
                                  ? "bg-green-600"
                                  : "bg-orange-500"
                              } h-3 w-3 rounded-full border border-white`}
                            >
                              .
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-neutral-600">
                        <h2 className="text-heading-05 font-semibold">
                          {image.title || "Untitled"}
                        </h2>
                        <p className="font-medium">
                          {image.photographer?.firstName
                            ? image.photographer?.firstName +
                              " " +
                              image.photographer?.lastName
                            : image.photographer?.name}
                        </p>
                        <p className="font-medium text-blue-500">
                          {image.category?.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {image.keywords?.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full"
                            >
                              {tag} <Tag size={12} className="inline" />
                            </span>
                          ))}
                        </div>
                        <h2 className="text-heading-06 font-medium">
                          {image.description}
                        </h2>
                        <p className="text-paragraph font-medium">
                          {(
                            (image.resolutions?.original?.height *
                              image.resolutions?.original?.width) /
                            1000000
                          ).toFixed(1)}{" "}
                          MP
                        </p>
                        <p className="capitalize text-paragraph font-medium">
                          Status: {image.exclusiveLicenseStatus || "Pending"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
