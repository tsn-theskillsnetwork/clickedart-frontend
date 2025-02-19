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

  const { photographer, isHydrated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [stats, setStats] = useState([]);
  const [selected, setSelected] = useState("uploaded");

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setPhotos([]);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-images-by-photographer?photographer=${photographer._id}`
      );
      setPhotos(res.data.photos);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchPendingPhotos = async () => {
    try {
      setLoading(true);
      setPhotos([]);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/get-pending-images-by-photographer?photographer=${photographer._id}`
      );
      console.log(res.data);
      setPhotos(res.data.pendingImages);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/photographeranalytics/get-photographer-analytics?photographer=${photographer._id}`
        );
        //console.log("Stats", res.data);
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

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader />;
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <h1 className="text-3xl font-semibold">UNAUTHORIZED</h1>
      </div>
    );
  }

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
              <button
                onClick={() => {
                  setSelected("uploaded");
                  fetchPhotos();
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
                  fetchPendingPhotos();
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
                        className="relative"
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
                          className="object-cover w-full aspect-[1/1]"
                        />
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
