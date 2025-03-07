"use client";

import React, { useEffect, useState } from "react";
import useAuthStore from "@/authStore";
import Image from "next/image";
import Button from "@/components/button";
import Link from "next/link";
import Button2 from "@/components/button2";
import Cookies from "js-cookie";
import {
  ArrowUpCircleIcon,
  ClockIcon,
  EllipsisIcon,
  IndianRupeeIcon,
  Pencil,
  Plus,
  Share2Icon,
} from "lucide-react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const router = useRouter();
  const { photographer, user } = useAuthStore();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedCatelogue, setSelectedCatelogue] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [activePlan, setActivePlan] = useState("Basic");
  const [limit, setLimit] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
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

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);
  const [newCatalogue, setNewCatalogue] = useState({
    name: "",
    description: "",
    photographer: undefined,
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCatalogue({ ...newCatalogue, [name]: value });
  };

  const handleTabClick = (newSection) => {
    router.push(`/profile?section=${newSection}`, { scroll: false });
  };

  const catelogueValidation = () => {
    if (!newCatalogue.name) {
      toast.error("Please enter the name of the catalogue.");
      return false;
    }
    if (!newCatalogue.description) {
      toast.error("Please enter the description of the catalogue.");
      return false;
    }
    return true;
  };

  const handleCreateCatelogue = async () => {
    if (!catelogueValidation()) return;
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/create-catalogue`,
        newCatalogue,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      toast.success("Catalogue created successfully!");
      fetchCatalogues();
      closeDialog();
      setMessage("Catalogue created successfully!");
      setError("");
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    setNewCatalogue({ ...newCatalogue, photographer: photographer?._id });
  }, [photographer]);

  const handleCatelogueUpdate = async (catalogueId) => {
    setMessage("");
    setError("");

    if (
      catalogues
        .find((catalogue) => catalogue._id === catalogueId)
        ?.images.some((image) => selectedImage.includes(image._id))
    ) {
      toast.error("Image already exists in the catalogue.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/update-catalogue`,
        {
          catalogueId: catalogueId,
          photographer: photographer?._id,
          name: selectedCatelogue?.name,
          description: selectedCatelogue?.description,
          images: selectedImage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      fetchCatalogues();
      toast.success("Catelogue Updated successfully!");
      setMessage("Catelogue Updated successfully!");
      setError("");
    } catch (err) {
      console.log("err", err.response.data.message);
    }
  };

  const handleCatelogueDelete = async (catalogueId) => {
    setMessage("");
    setError("");

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/delete-catalogue?catalogueId=${catalogueId}`
      );
      toast.success("Catalogue Deleted successfully!");
      fetchCatalogues();
    } catch (err) {
      console.log("err", err);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographeranalytics/get-photographer-analytics?photographer=${photographer._id}`
      );
      setStats(res.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivePlan = async () => {
    if (!photographer || !photographer._id) {
      console.log("Photographer data is missing");
      return;
    }
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/subscriptions/get-user-active-subscription?photographer=${photographer._id}`
      );
      setActivePlan(res.data.subscription?.planId?.name?.toLowerCase());
      if (res.data.subscription?.planId?.name?.toLowerCase() === "basic") {
        setLimit(1);
      } else if (
        res.data.subscription?.planId?.name?.toLowerCase() === "intermediate"
      ) {
        setLimit(5);
      } else if (
        res.data.subscription?.planId?.name?.toLowerCase() === "premium"
      ) {
        setLimit(999999);
      }
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-images-by-photographer?photographer=${photographer._id}&pageSize=1000`
      );
      setPhotos(res.data.photos);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPhotos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/get-pending-images-by-photographer?photographer=${photographer._id}`
      );
      setPendingPhotos(res.data.pendingImages);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchCatalogues = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/get-catalogues-by-photographer?photographer=${photographer?._id}&pageSize=1000`
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
    if (!photographer) return;

    fetchStats();
    fetchPhotos();
    fetchPendingPhotos();
    fetchCatalogues();
    fetchBlogs();
    fetchActivePlan();
  }, [photographer]);

  useEffect(() => {
    if (photographer) {
      const isAlertClosed = Cookies.get("monetizationAlert");
      if (photographer.isMonetized || isAlertClosed) {
        return;
      }

      Swal.fire({
        title: "Monetize Your Account",
        text: "Monetize your account to start earning from your photos",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Monetize Now",
        cancelButtonText: "Later",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/support/monetize");
        } else {
          Cookies.set("monetizationAlert", 1, { expires: 1 });
        }
      });
    }
  }, [photographer]);

  return (
    <>
      {photographer || user ? (
        <div className="flex flex-col min-h-screen pb-20">
          {photographer && (
            <div className="w-full">
              <Image
                src={
                  photographer.coverImage || "/assets/placeholders/image.webp"
                }
                alt="bg1"
                width={1920}
                height={800}
                className="object-cover w-full h-40 lg:h-80"
              />
            </div>
          )}
          <div
            className={`relative flex flex-col items-center ${
              photographer ? "-mt-16 lg:-mt-28" : "mt-8"
            }`}
          >
            <Image
              src={
                photographer?.profileImage ||
                user?.image ||
                "/assets/placeholders/profile.jpg"
              }
              alt="avatar"
              width={150}
              height={150}
              className="rounded-full h-28 w-28 lg:h-52 lg:w-52 object-cover border-[3px] lg:border-[6px] border-white"
            />
            {photographer && (
              <p className="px-4 py-2 rounded-full capitalize bg-black font-medium text-white -mt-6">
                {photographer?.rank}
              </p>
            )}

            <Link
              href={"/profile/edit"}
              className="absolute top-12 lg:top-20 right-[4%] sm:right-[8%] lg:right-[30%] text-surface-500 bg-white rounded-full p-2 cursor-pointer shadow-[1px_1px_2px_rgba(0,0,0,0.25)]"
            >
              <Pencil strokeWidth={2} className="size-4 lg:size-12" />
            </Link>
            {photographer && (
              <div className="absolute top-12 lg:top-20 right-[15%] sm:right-[15%] lg:right-[23%] text-surface-500 bg-white rounded-full p-2 cursor-pointer shadow-[1px_1px_2px_rgba(0,0,0,0.25)]">
                <Share2Icon
                  strokeWidth={2}
                  className="size-4 lg:size-12"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_CLIENT}/photographer/${photographer._id}`
                    );
                    toast.success("Link copied to clipboard!");
                  }}
                />
              </div>
            )}
            <p className="text-heading-06 lg:text-heading-02 font-semibold lg:font-medium">
              {(user || photographer)?.firstName +
                " " +
                (user || photographer)?.lastName}
            </p>
            <p className="text-sm lg:text-heading-05 font-medium lg:font-normal text-surface-500 lg:-mt-4">
              {photographer
                ? photographer.shippingAddress?.city +
                  ", " +
                  photographer.shippingAddress?.country
                : user.shippingAddress?.city +
                  ", " +
                  user.shippingAddress?.country}
            </p>
            <p className="font-normal lg:font-medium text-xs lg:text-heading-06 text-surface-500 mt-2 lg:mt-4 text-center max-w-2xl">
              {photographer?.bio || user?.bio}
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
                        rel="noopener noreferrer"
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

            {user && (
              <div className="flex gap-4 mt-4">
                <Button
                  className="bg-primary text-white"
                  onClick={() => router.push("/profile/orders")}
                >
                  Orders
                </Button>
              </div>
            )}
            {photographer && (
              <div className="flex gap-4 mt-4">
                <Link
                  className="bg-primary hover:bg-primary-dark active:bg-primary-darker font-semibold text-white px-3 py-2 rounded-md shadow-md transition-all duration-100 ease-in-out"
                  href={`/dashboard`}
                >
                  Dashboard
                </Link>
              </div>
            )}

            {photographer && (
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
                        (acc, photo) =>
                          acc + (photo.imageAnalytics?.views || 0),
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
            )}

            {/* Active Plan Show */}
            {photographer && (
              <div className="flex flex-col items-center mt-4">
                <div className="text-xs sm:text-base md:text-heading-05 font-medium capitalize flex gap-4 items-center">
                  Active Plan: {activePlan}{" "}
                  {activePlan.toLowerCase() !== "premium" && (
                    <Link href="/membership">
                      <div className="flex gap-2 items-center">
                        <span className="text-primary">Upgrade</span>
                        <ArrowUpCircleIcon
                          strokeWidth={3}
                          className="text-primary"
                        />
                      </div>
                    </Link>
                  )}
                </div>
                <Link
                  className="font-medium text-blue-600 text-sm bg-blue-200 px-2 py-1 rounded-lg shadow-md shadow-zinc-300 border border-blue-300"
                  href="/profile/subscription"
                >
                  Manage
                </Link>
              </div>
            )}

            {photographer && (
              <div
                className={`text-white ${
                  photographer.isMonetized ? "bg-green-600" : "bg-red-600"
                } rounded-full p-2 shadow-[1px_1px_2px_rgba(0,0,0,0.25)] mt-4`}
              >
                <IndianRupeeIcon className={`size-2 lg:size-8`} />
              </div>
            )}

            {photographer && !photographer?.isMonetized && (
              <div className="flex flex-col gap-2 items-center font-medium mt-4">
                <p className="text-red-600 ">
                  Monetize your account to start earning from your photos
                </p>
                <Link href="/support/monetize">
                  Click here to{" "}
                  <span className="text-green-600">Monetize Now.</span>
                </Link>
              </div>
            )}
          </div>
          {photographer && (
            <div
              id="main"
              className="relative flex gap-10 text-base lg:text-heading-03 px-4 lg:px-24 py-4"
            >
              <button
                onClick={() => handleTabClick("photos")}
                className={`${
                  section !== "catalogues" && section !== "blogs"
                    ? "text-primary font-semibold"
                    : "text-surface-400"
                } cursor-pointer`}
              >
                Photos
              </button>

              <button
                onClick={() => handleTabClick("catalogues")}
                className={`${
                  section === "catalogues"
                    ? "text-primary font-semibold"
                    : "text-surface-400"
                } cursor-pointer`}
              >
                Catalogues
              </button>

              <button
                onClick={() => handleTabClick("blogs")}
                className={`${
                  section === "blogs"
                    ? "text-primary font-semibold"
                    : "text-surface-400"
                } cursor-pointer`}
              >
                Blogs
              </button>
              <div
                className={`h-[2px] lg:h-[4px] bg-primary absolute bottom-3 ${
                  section === "catalogues"
                    ? "left-[7rem] w-[6rem] lg:left-[17rem] lg:w-[15rem]"
                    : section === "blogs"
                    ? "left-[15rem] w-[3.3rem] lg:left-[33.5rem] lg:w-[8rem]"
                    : "left-[0.8rem] w-[4rem] lg:left-[6rem] lg:w-[9rem]"
                } transition-all duration-300 ease-in-out`}
              ></div>
            </div>
          )}
          <hr className="mt-[-14px] lg:-mt-4 border lg:border-2" />
          {photographer && (
            <div className="py-10 px-4 lg:px-24 bg-[#FCFAFA]">
              {section !== "catalogues" && section !== "blogs" ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                  <Link
                    href="/profile/upload"
                    className="relative group w-full min-h-60 shadow-[2px_2px_6px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden"
                  >
                    <div className="h-full w-full flex flex-col items-center justify-center bg-white cursor-pointer">
                      <Plus className="w-20 h-20 text-surface-400" />
                      <p className="text-surface-400 font-semibold">
                        Upload New Photo
                      </p>
                    </div>
                  </Link>
                  {pendingPhotos.map((image) => (
                    <div
                      className="relative group shadow-md hover:shadow-lg rounded-lg opacity-60 cursor-default overflow-hidden transition-all duration-300 "
                      key={image._id}
                    >
                      <div className="relative aspect-[1/1] overflow-hidden">
                        <Image
                          width={800}
                          height={800}
                          priority
                          onContextMenu={(e) => e.preventDefault()}
                          src={
                            image.imageLinks.original ||
                            image.imageLinks.thumbnail
                          }
                          alt={image.description || "Image"}
                          className="object-cover w-full aspect-[1/1]"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center">
                          <ClockIcon className="w-20 h-20 text-white text-shadow" />
                        </div>
                      </div>

                      <div className="p-4 bg-white flex justify-between items-start">
                        <div>
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
                    </div>
                  ))}
                  {photos.map((image) => (
                    <div
                      className="relative group shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300 "
                      key={image._id}
                    >
                      <div className="block aspect-[1/1] overflow-hidden">
                        <Image
                          width={800}
                          height={800}
                          priority
                          onContextMenu={(e) => e.preventDefault()}
                          src={
                            image.imageLinks.original ||
                            image.imageLinks.thumbnail
                          }
                          alt={image.description || "Image"}
                          onClick={() =>
                            router.push(`/profile/print/${image._id}`)
                          }
                          className="object-cover w-full aspect-[1/1] transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                        />
                      </div>
                      <button
                        onClick={() =>
                          router.push(`/profile/print/${image._id}`)
                        }
                        className="absolute top-3 right-3 z-20 text-white bg-black bg-opacity-50 px-3 py-1 rounded-md text-sm font-medium hover:bg-opacity-70 transition-all"
                      >
                        Print
                      </button>

                      <div className="p-4 bg-white flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-zinc-900 capitalize">
                            {image.title || "Untitled"}
                          </h3>
                          {image.category?.length > 0 && (
                            <p className="text-sm font-medium text-zinc-500">
                              {image.category.map((cat) => cat.name).join(", ")}
                            </p>
                          )}
                        </div>

                        <Popover>
                          <PopoverTrigger>
                            <EllipsisIcon className="w-6 h-6 text-zinc-700 hover:text-black cursor-pointer transition-all" />
                          </PopoverTrigger>
                          <PopoverContent className="w-32 bg-white shadow-md rounded-md p-2">
                            <Button
                              className="text-orange-500 w-full"
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={`/profile/edit/${image._id}`}>
                                Edit
                              </Link>
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  ))}
                </div>
              ) : section === "catalogues" ? (
                <div className="flex flex-col gap-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {catalogues.length >= limit ? (
                      <div
                        onClick={() => {
                          toast.error(
                            "Upgrade your plan to create more catalogues."
                          );
                        }}
                        className="w-full h-full flex flex-col aspect-[1/1] items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)] bg-white cursor-pointer"
                      >
                        <Plus className="w-20 h-20 text-surface-400" />
                        <p className="text-surface-400 font-semibold">
                          Create New Catelogue
                        </p>
                      </div>
                    ) : (
                      <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        {/* <DialogTrigger asChild> */}
                        <div
                          onClick={openDialog}
                          className="w-full h-full flex flex-col aspect-[1/1] items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)] bg-white cursor-pointer"
                        >
                          <Plus className="w-20 h-20 text-surface-400" />
                          <p className="text-surface-400 font-semibold">
                            Create New Catelogue
                          </p>
                        </div>
                        {/* </DialogTrigger> */}
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Create Catelogue</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label>Name *</Label>
                              <Input
                                type="text"
                                name="name"
                                value={newCatalogue.name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div>
                              <Label>Description *</Label>
                              <Input
                                type="text"
                                name="description"
                                value={newCatalogue.description}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            {/* <DialogClose asChild> */}
                            <Button2
                              size="sm"
                              onClick={() => handleCreateCatelogue()}
                            >
                              Save changes
                            </Button2>
                            {/* </DialogClose> */}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    {catalogues?.map((catalogue) => (
                      <div
                        key={catalogue._id}
                        className="relative bg-white flex flex-col gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.2)] p-4 rounded-md"
                      >
                        <Link
                          href={`/profile/catalogue/${catalogue._id}`}
                          className="grid grid-cols-2 gap-4 pb-5 aspect-[1/1]"
                        >
                          {catalogue.images?.length > 0 ? (
                            <>
                              {/* //map only 4 images */}
                              {catalogue.images.slice(0, 3).map((image) => (
                                <div
                                  key={image._id}
                                  className="shadow-[0_2px_6px_rgba(0,0,0,0.2)] aspect-[1/1] rounded-md overflow-hidden"
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
                          <Popover>
                            <PopoverTrigger>
                              <EllipsisIcon className="w-6 h-6 text-gray-500" />
                            </PopoverTrigger>
                            <PopoverContent className="w-min">
                              <div className="flex flex-col items-center">
                                <Button
                                  className="text-orange-500"
                                  variant="ghost"
                                  size="sm"
                                >
                                  <div>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <p
                                          onClick={() => {
                                            setSelectedCatelogue(catalogue);
                                          }}
                                        >
                                          Edit
                                        </p>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Edit Catelogue
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                          <Label
                                            htmlFor="name"
                                            className="text-left"
                                          >
                                            Name
                                          </Label>
                                          <Input
                                            onChange={(e) => {
                                              setSelectedCatelogue({
                                                ...catalogue,
                                                name: e.target.value,
                                              });
                                            }}
                                            value={selectedCatelogue?.name}
                                          />
                                          <Label
                                            htmlFor="description"
                                            className="text-left"
                                          >
                                            Description
                                          </Label>
                                          <Input
                                            onChange={(e) => {
                                              setSelectedCatelogue({
                                                ...catalogue,
                                                description: e.target.value,
                                              });
                                            }}
                                            value={
                                              selectedCatelogue?.description
                                            }
                                          />
                                        </div>
                                        <DialogFooter>
                                          <Button2
                                            size="sm"
                                            onClick={() =>
                                              handleCatelogueUpdate(
                                                catalogue._id
                                              )
                                            }
                                          >
                                            Save changes
                                          </Button2>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </Button>
                                <Button
                                  className="text-red-500"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleCatelogueDelete(catalogue._id)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                section === "blogs" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    <Link
                      href="/profile/blog/create"
                      className="relative group w-full min-h-60 shadow-[2px_2px_6px_rgba(0,0,0,0.4)]"
                    >
                      <div className="h-full w-full flex flex-col items-center justify-center bg-white cursor-pointer">
                        <Plus className="w-20 h-20 text-surface-400" />
                        <p className="text-surface-400 font-semibold">
                          Add New Blog
                        </p>
                      </div>
                    </Link>
                    {blogs.map((blog) => (
                      <Link
                        href={`/profile/blog/edit/${blog._id}`}
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
                )
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p>You are not signed in.</p>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
