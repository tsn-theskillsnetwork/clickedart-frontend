"use client";

import React, { use, useEffect, useState } from "react";
import useAuthStore from "@/authStore";
import Image from "next/image";
import Button from "@/components/button";
import Link from "next/link";
import Button2 from "@/components/button2";
import { Pencil, Plus, TextIcon, UploadIcon } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchData } from "@/helpers/api";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import toast from "react-hot-toast";
import Loader from "@/components/loader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProfilePage = () => {
  const router = useRouter();
  const { photographer, user, token, isHydrated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [progr, setProgr] = useState(0);
  const [step, setStep] = useState("1");
  const [plan, setPlan] = useState(null);
  const [activePlan, setActivePlan] = useState("basic");
  const [isCustomText, setIsCustomText] = useState(false);
  const [customText, setCustomText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [watermark, setWatermark] = useState([]);
  const [newWatermark, setNewWatermark] = useState("");
  const [photo, setPhoto] = useState({
    category: "",
    photographer: "",
    imageLinks: {},
    resolutions: {},
    description: "",
    story: "",
    keywords: [],
    location: "",
    photoPrivacy: "Public",
    watermark: false,
    cameraDetails: {
      camera: "",
      lens: "",
      settings: {
        focalLength: "",
        aperture: "",
        shutterSpeed: "",
        iso: "",
      },
    },
    price: 0,
    title: "",
    isActive: false,
  });

  // console.log("Active Plan:", activePlan);

  const [timeoutId, setTimeoutId] = useState(null);
  const [keywordInput, setKeywordInput] = useState(photo.keywords.join(", "));

  const handlePriceChange = (e) => {
    const newValue = e.target.value;

    setPhoto({ ...photo, price: newValue });

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      let validPrice = Number(newValue);

      if (validPrice >= 200 && validPrice <= 2000) {
        setPhoto({ ...photo, price: validPrice });
      } else if (validPrice < 200) {
        setPhoto({ ...photo, price: 200 });
        toast.error("Minimum price should be 200");
      } else if (validPrice > 2000) {
        setPhoto({ ...photo, price: 2000 });
        toast.error("Maximum price should be 2000");
      }
    }, 1000);

    setTimeoutId(id);
  };

  const handleWatermarkImage = async (event) => {
    const file = event.target.files[0]; // Get the first file from the input

    if (!file) {
      toast.error("No file selected for upload!");
      return;
    }

    const toastId = toast.loading("Uploading...");
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/upload/uploadSingleImage`,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            toast.loading(`Uploading... ${percentCompleted}%`, {
              id: toastId,
            });
          },
        }
      );

      const data = res.data;
      console.log("Image uploaded successfully:", data);
      setNewWatermark(data);

      toast.success("File uploaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("File upload failed.", { id: toastId });
    }
  };

  const handleWatermarkAdd = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/customwatermark/add-custom-watermark`,
        {
          photographer: photographer?._id,
          watermarkImage: newWatermark,
        }
      );
      console.log("Watermark added:", response.data);
      toast.success("Watermark added successfully");
      setWatermark(response.data.watermark);
    } catch (error) {
      console.error("Error adding watermark:", error);
    }
  };

  const handleWatermarkRemove = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/api/customwatermark/delete-custom-watermark?id=${id}`
      );
      console.log("Watermark removed:", response.data);
      toast.success("Watermark removed successfully");
      setWatermark("");
    } catch (error) {
      console.error("Error removing watermark:", error);
    }
  };

  // console.log("New Watermark",newWatermark)

  const getWatermarks = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/customwatermark/get-custom-watermark?photographer=${photographer?._id}`
      );
      console.log("Watermarks:", response.data);
      setWatermark(response.data.watermarkImage);
    } catch (error) {
      console.log("Error fetching watermarks:", error);
    }
  };
  useEffect(() => {
    if (plan) {
      setActivePlan(getActivePlanType(plan));
      getWatermarks();
    }
  }, [plan]);

  console.log("Watermark:", watermark);

  const handleDescriptionChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length <= 1000) {
      setPhoto({ ...photo, description: newValue });
    }
  };

  const handleChange = async (event) => {
    try {
      const file = event.target.files[0];

      if (!file) {
        console.error("No file selected");
        return;
      }

      const s3 = new S3Client({
        region: "ap-south-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        },
      });

      const target = {
        Bucket: "clickedart-bucket",
        Key: `images/${file.name}`,
        Body: file,
      };

      const upload = new Upload({
        client: s3,
        params: target,
      });

      upload.on("httpUploadProgress", (progress) => {
        const percentCompleted = Math.round(
          (progress.loaded / progress.total) * 100
        );
        setProgr(percentCompleted);
        console.log(`Progress: ${percentCompleted}%`);
      });

      await upload.done().then((r) => console.log(r));
      console.log("File uploaded successfully!");
      const fileUrl = `https://${target.Bucket}.s3.ap-south-1.amazonaws.com/${target.Key}`;
      setImageUrl(fileUrl);
      console.log("File URL:", fileUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const getActivePlanType = (plans) => {
    const activePlans = plans.filter((p) => p.isActive);

    if (activePlans.length === 0) {
      return "basic";
    }

    const premiumPlan = activePlans.find((p) =>
      p.name.toLowerCase().includes("premium")
    );
    if (premiumPlan) {
      return "premium";
    }

    const intermediatePlan = activePlans.find((p) =>
      p.name.toLowerCase().includes("intermediate")
    );
    if (intermediatePlan) {
      return "intermediate";
    }

    return "basic";
  };

  const getResolutions = async () => {
    try {
      const planType = getActivePlanType(plan);
      console.log("Plan type:", planType);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/upload/handle-photos-with-watermark-and-resolutions-options`,
        {
          photographer: photographer?._id,
          imageUrl,
          plan: planType,
          isCustomText: activePlan === "intermediate" ? true : false,
          customText,
        }
      );
      const data = response.data;
      console.log("Resolutions data:", data);
      setPhoto((prevPhoto) => ({
        ...prevPhoto,
        imageLinks: data.urls,
        resolutions: data.resolutions,
      }));
    } catch (error) {
      console.error("Error fetching resolutions:", error);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    console.log("handleUpload triggered");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/add-image-in-vault`,
        photo,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      console.log(response.data);
      toast.success("Image uploaded successfully");
      alert("Image uploaded successfully. Please check your profile.");
      router.push("/profile");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      toast.error("Error uploading image");
    }
  };

  // console.log(photo);

  useEffect(() => {
    fetchData(
      `${process.env.NEXT_PUBLIC_SERVER}/api/category/get`,
      "categories",
      setCategories
    );
    fetchData(
      `${process.env.NEXT_PUBLIC_SERVER}/api/license/get-all-license`,
      "licenses",
      setLicenses
    );
  }, []);

  // useEffect(() => {
  //   if (!imageUrl) return;
  //   getResolutions();
  // }, [imageUrl, plan, isCustomText, customText]);

  useEffect(() => {
    setPhoto({ ...photo, photographer: photographer?._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photographer]);

  useEffect(() => {
    if (!photographer) return;

    const fetchPlan = async () => {
      if (!photographer || !photographer._id) {
        console.log("Photographer data is missing");
        return;
      }
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/subscriptions/get-user-subscription?userId=${photographer._id}`
        );
        console.log(res.data);

        if (res.data.subscriptions) {
          const modifiedPlans = res.data.subscriptions.map((subscription) => ({
            name: subscription.planId?.name,
            isActive: subscription.isActive,
          }));

          setPlan(modifiedPlans);
        }
      } catch (error) {
        console.log(error.response ? error.response.data : error.message);
      }
    };

    fetchPlan();
  }, [photographer]);

  // console.log("plan", plan);
  useEffect(() => {
    if (isHydrated && !photographer) {
      router.push("/profile");
    }
  }, [isHydrated, photographer, router]);

  // console.log("categories", categories);

  return (
    <>
      {photographer ? (
        <div className="flex flex-col min-h-screen pb-20">
          {/* <div className="w-full">
            <Image
              src="/assets/hero/bg2.jpg"
              alt="bg1"
              width={1920}
              height={800}
              className="object-cover w-full h-40 lg:h-96"
            />
          </div>
          <div className="relative flex flex-col items-center -mt-16 lg:-mt-28">
            <Image
              src={
                photographer?.profileImage ||
                user?.image ||
                "/assets/default.jpg"
              }
              alt="avatar"
              width={150}
              height={150}
              className="rounded-full h-28 w-28 lg:h-52 lg:w-52 object-cover border-[3px] lg:border-[6px] border-white"
            />
            <p className="px-4 py-2 rounded-full capitalize bg-black font-medium text-white -mt-6">
              {photographer?.rank}
            </p>
            <Link
              href={"/profile/edit"}
              className="absolute top-12 lg:top-20 right-[4%] sm:right-[8%] lg:right-[30%] text-surface-500 bg-white rounded-full p-2 cursor-pointer shadow-[1px_1px_2px_rgba(0,0,0,0.25)]"
            >
              <Pencil strokeWidth={2} className="size-4 lg:size-14" />
            </Link>
            <p className="text-heading-06 lg:text-heading-01 font-semibold lg:font-medium">
              {(user || photographer)?.firstName +
                " " +
                (user || photographer)?.lastName}
            </p>
            <p className="text-sm lg:text-heading-03 font-medium lg:font-normal text-surface-500 lg:-mt-4">
              {photographer
                ? photographer.shippingAddress?.city +
                  ", " +
                  photographer.shippingAddress?.country
                : user.shippingAddress?.city +
                  ", " +
                  user.shippingAddress?.country}
            </p>
            <p className="font-normal lg:font-medium text-xs lg:text-heading-05 text-surface-500 mt-2 lg:mt-4 text-center max-w-2xl">
              {photographer?.bio || user?.bio}
            </p>
          </div> */}

          <div className="flex flex-col px-2 lg:px-24 py-10 items-center">
            <div className="relative flex justify-around w-full">
              <hr className="absolute z-0 border-primary w-[50%] top-8 lg:top-12" />
              <div className="flex flex-col items-center gap-4 z-10">
                <div
                  className={`${
                    step === "1" ? "border-primary" : "border-surface-300"
                  } border-2 lg:border-4 rounded-full p-4 bg-white`}
                >
                  <UploadIcon
                    strokeWidth={1.5}
                    className={`${
                      step === "1"
                        ? "w-6 lg:w-16 h-6 lg:h-16 text-primary"
                        : "w-4 lg:w-12 h-4 lg:h-12 text-surface-300"
                    }`}
                  />
                </div>
                <p
                  className={`text-xs font-medium lg:text-paragraph ${
                    step === "1" ? "text-primary" : "text-surface-300"
                  }`}
                >
                  Upload Photo
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 z-10">
                <div
                  className={`${
                    step === "2" ? "border-primary" : "border-surface-300"
                  } border-2 lg:border-4 rounded-full p-4 bg-white`}
                >
                  <TextIcon
                    strokeWidth={1.5}
                    className={`${
                      step === "2"
                        ? "w-6 lg:w-16 h-6 lg:h-16 text-primary"
                        : "w-4 lg:w-12 h-4 lg:h-12 text-surface-300"
                    }`}
                  />
                </div>
                <p
                  className={`text-xs font-medium lg:text-paragraph ${
                    step === "2" ? "text-primary" : "text-surface-300"
                  }`}
                >
                  Fill in Details
                </p>
              </div>
            </div>
            {step === "1" && (
              <div className="mt-10">
                {imageUrl ? (
                  <img src={imageUrl} alt="Uploaded Image" />
                ) : (
                  <div className="w-full mx-auto rounded-lg overflow-hidden">
                    <div className="md:flex">
                      <div className="w-full p-3">
                        <div className="relative h-[60vh] rounded-lg border flex justify-center items-center shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-shadow duration-300 ease-in-out">
                          <div className="absolute flex flex-col items-center">
                            <Plus className="w-12 h-12 text-surface-200" />
                            <span className="block text-gray-500 font-semibold">
                              Drop your image here
                            </span>
                            <span className="block text-gray-400 font-normal mt-1">
                              or click to upload
                            </span>
                          </div>
                          <input
                            name=""
                            onChange={handleChange}
                            className="h-full w-full opacity-0 cursor-pointer"
                            type="file"
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols grid-cols-3 gap-4 px-4">
                  <ul className="text-xs text-primary font-medium mt-1">
                    <li className="text-xs mt-1">
                      File size should be less than 5MB
                    </li>
                    <li className="text-xs mt-1">
                      Ensure the resolution is at least 300 DPI for
                      print-quality images.
                    </li>
                    <li className="text-xs mt-1">
                      Minimum dimensions: 2000 x 3000 pixels (or equivalent
                      aspect ratio).
                    </li>
                    <li className="text-xs mt-1">
                      File size should not exceed 20 MB.
                    </li>
                  </ul>
                  <ul className="text-xs text-primary font-medium mt-1">
                    <li className="text-xs mt-1">
                      Only upload original work; plagiarism or copyright
                      infringement will result in account penalties.
                    </li>
                    <li className="text-xs mt-1">
                      Avoid images with watermarks, logos, or text overlays.
                    </li>
                    <li className="text-xs mt-1">
                      Ensure the photo does not contain offensive, explicit, or
                      illegal content.
                    </li>
                    <li className="text-xs mt-1">
                      Photos must align with ClickedArt's ethical standards,
                      particularly for wildlife, cultural, and sensitive
                      subjects.
                    </li>
                    <li className="text-xs mt-1">
                      Ensure the uploaded photo is relevant to the categories
                      you&apos;ve selected.
                    </li>
                  </ul>
                  <ul className="text-xs text-primary font-medium mt-1">
                    <li className="text-xs mt-1">
                      Submit sharp, high-quality images free from excessive
                      noise, blurriness, or pixelation.
                    </li>
                    <li className="text-xs mt-1">
                      Post-process images tastefully; avoid over-saturation,
                      extreme HDR, or unnatural effects.
                    </li>
                    <li className="text-xs mt-1">
                      Composition should follow photography principles, such as
                      the rule of thirds, framing, or leading lines.
                    </li>
                    <li className="text-xs mt-1">
                      Ensure the photo has no distracting elements unless
                      integral to the subject.
                    </li>
                  </ul>
                </div>

                <div className="px-4 lg:px-20 py-5 w-full">
                  <div className="w-full border-2 border-primary-100 p-[2px] rounded-full">
                    <div
                      style={{ width: `${progr}%` }}
                      className={`bg-gradient-to-r from-primary to-primary-100 h-4 rounded-full transition-all duration-200 ease-in-out`}
                    />
                  </div>
                  <div className="flex justify-end items-center mt-3">
                    <span className="text-sm text-zinc-600">
                      {progr}% Uploaded
                    </span>
                  </div>
                </div>
                {activePlan === "intermediate" && (
                  <div>
                    <Label className="!text-paragraph">
                      Custom Text Watermark
                    </Label>
                    <Input
                      className="!text-paragraph capitalize"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                    />
                  </div>
                )}
                {activePlan === "premium" && (
                  <div>
                    <Label className="!text-paragraph">Custom Watermark</Label>
                    {watermark?.watermarkImage ? (
                      <div className="flex items-center gap-4">
                        <img
                          src={watermark?.watermarkImage}
                          alt="Watermark"
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <p
                          className="text-red-600 font-medium cursor-pointer"
                          onClick={() => handleWatermarkRemove(watermark._id)}
                        >
                          Remove Watermark
                        </p>
                      </div>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <p className="text-black font-medium cursor-pointer">
                            Add Watermark
                          </p>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Upload Watermark</DialogTitle>
                            <DialogDescription>
                              Upload a custom watermark for your photos.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <input
                              accept=".png"
                              type="file"
                              onChange={handleWatermarkImage}
                            />
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button2 onClick={() => handleWatermarkAdd()}>
                                Save changes
                              </Button2>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      getResolutions();
                      setStep("2");
                      window.scrollTo(0, 160);
                    }}
                    disabled={!imageUrl}
                    className="bg-primary text-white py-2 px-4 rounded-full disabled:opacity-50"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            )}
            {step === "2" && (
              <div className="flex flex-col gap-4 mt-20 w-full">
                <p className="text-heading-04 text-center">
                  Add essential information to make your photos stand out.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <img
                    src={photo.imageLinks?.thumbnail || "/assets/hero/bg3.jpg"}
                    className="w-full h-auto shadow-[3px_3px_10px_rgba(0,0,0,0.5)]"
                    alt="Uploaded Image"
                  />
                  <form className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label className="!text-paragraph">Title*</Label>
                        <Input
                          className="!text-paragraph"
                          value={photo.title}
                          onChange={(e) =>
                            setPhoto({ ...photo, title: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label className="!text-paragraph">Price*</Label>
                        <Input
                          className="!text-paragraph"
                          type="number"
                          required
                          value={photo.price}
                          onChange={handlePriceChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="!text-paragraph">Category*</Label>
                      <Select
                        required
                        onValueChange={(value) =>
                          setPhoto({ ...photo, category: value })
                        }
                      >
                        <SelectTrigger className="!text-paragraph">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              className="!text-paragraph"
                              key={category._id}
                              value={category._id}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="!text-paragraph">
                        Description (Max 1000 characters)
                      </Label>
                      <Textarea
                        className="!text-paragraph"
                        value={photo.description}
                        placeholder="Enter a description for your photo (Max 1000 characters)"
                        onChange={handleDescriptionChange}
                      />
                    </div>
                    <div>
                      <Label className="!text-paragraph">Keywords *</Label>
                      <Input
                        className="!text-paragraph"
                        placeholder="Enter keywords separated by commas (Min 5)"
                        value={keywordInput}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setKeywordInput(inputValue);
                          setPhoto({
                            ...photo,
                            keywords: inputValue
                              .split(",")
                              .map((keyword) => keyword.trim())
                              .filter((keyword) => keyword !== ""),
                          });
                        }}
                      />
                      <div className="mt-1">
                        {categories
                          ?.find((category) => category._id === photo.category)
                          ?.tags?.map((tag) => {
                            const isSelected = photo.keywords.includes(tag); // Check if tag is already selected
                            return (
                              <span
                                key={tag}
                                onClick={() => {
                                  const updatedKeywords = isSelected
                                    ? photo.keywords.filter(
                                        (keyword) => keyword !== tag
                                      ) // Remove tag if selected
                                    : [...new Set([...photo.keywords, tag])]; // Add tag if not selected
                                  setPhoto({
                                    ...photo,
                                    keywords: updatedKeywords,
                                  });
                                  setKeywordInput(updatedKeywords.join(", ")); // Update input display
                                }}
                                className={`text-xs px-2 py-1 rounded-full mr-2 cursor-pointer ${
                                  isSelected
                                    ? "bg-gray-300 text-black"
                                    : "bg-primary text-white"
                                }`}
                              >
                                {tag} {isSelected ? "×" : "+"}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                    <div>
                      <Label className="!text-paragraph">Story</Label>
                      <Textarea
                        className="!text-paragraph"
                        value={photo.story}
                        onChange={(e) =>
                          setPhoto({ ...photo, story: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label className="!text-paragraph">Plan</Label>
                      <Input
                        className="!text-paragraph capitalize"
                        value={activePlan}
                        disabled
                      />
                    </div>

                    <hr />
                    <div>
                      <Label className="!text-paragraph">Camera</Label>
                      <Input
                        className="!text-paragraph"
                        value={photo.cameraDetails.camera}
                        onChange={(e) =>
                          setPhoto({
                            ...photo,
                            cameraDetails: {
                              ...photo.cameraDetails,
                              camera: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="!text-paragraph">Lens</Label>
                      <Input
                        className="!text-paragraph"
                        value={photo.cameraDetails.lens}
                        onChange={(e) =>
                          setPhoto({
                            ...photo,
                            cameraDetails: {
                              ...photo.cameraDetails,
                              lens: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="!text-paragraph">Focal Length</Label>
                        <Input
                          className="!text-paragraph"
                          value={photo.cameraDetails.settings.focalLength}
                          onChange={(e) =>
                            setPhoto({
                              ...photo,
                              cameraDetails: {
                                ...photo.cameraDetails,
                                settings: {
                                  ...photo.cameraDetails.settings,
                                  focalLength: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="!text-paragraph">Aperture</Label>
                        <Input
                          className="!text-paragraph"
                          value={photo.cameraDetails.settings.aperture}
                          onChange={(e) =>
                            setPhoto({
                              ...photo,
                              cameraDetails: {
                                ...photo.cameraDetails,
                                settings: {
                                  ...photo.cameraDetails.settings,
                                  aperture: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="!text-paragraph">Shutter Speed</Label>
                        <Input
                          className="!text-paragraph"
                          value={photo.cameraDetails.settings.shutterSpeed}
                          onChange={(e) =>
                            setPhoto({
                              ...photo,
                              cameraDetails: {
                                ...photo.cameraDetails,
                                settings: {
                                  ...photo.cameraDetails.settings,
                                  shutterSpeed: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="!text-paragraph">ISO</Label>
                        <Input
                          className="!text-paragraph"
                          value={photo.cameraDetails.settings.iso}
                          onChange={(e) =>
                            setPhoto({
                              ...photo,
                              cameraDetails: {
                                ...photo.cameraDetails,
                                settings: {
                                  ...photo.cameraDetails.settings,
                                  iso: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <hr />
                    <div>
                      <Label className="!text-paragraph">Location</Label>
                      <Input
                        className="!text-paragraph"
                        value={photo.location}
                        onChange={(e) =>
                          setPhoto({ ...photo, location: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={() => setStep("1")}>Back</Button>
                      <Button2 onClick={handleUpload}>Upload</Button2>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          {isHydrated ? <p>You are not signed in.</p> : <Loader />}
        </div>
      )}
    </>
  );
};

export default ProfilePage;
