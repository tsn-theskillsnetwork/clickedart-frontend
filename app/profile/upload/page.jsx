"use client";

import React, { useEffect, useState } from "react";
import useAuthStore from "@/authStore";
import Button from "@/components/button";
import Button2 from "@/components/button2";
import Link from "next/link";
import { ArrowLeftIcon, Plus, TextIcon, UploadIcon } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Select from "react-select";
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
import Swal from "sweetalert2";

const ProfilePage = () => {
  const router = useRouter();
  const { photographer, token, isHydrated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [progr, setProgr] = useState(0);
  const [step, setStep] = useState("1");
  const [activePlan, setActivePlan] = useState("basic");
  const [customText, setCustomText] = useState("ClickedArt");
  const [imageUrl, setImageUrl] = useState("");
  const [watermark, setWatermark] = useState(null);
  const [newWatermark, setNewWatermark] = useState("");
  const [limit, setLimit] = useState(10);
  const [photosLength, setPhotosLength] = useState(0);
  const [uploading, setUploading] = useState(false);
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

  const [timeoutId, setTimeoutId] = useState(null);
  const [keywordInput, setKeywordInput] = useState(photo.keywords.join(", "));

  const sendLogToServer = async (message) => {
    try {
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
    } catch (err) {
      console.error("Failed to send log:", err);
    }
  };

  const handlePriceChange = (e) => {
    const newValue = e.target.value;

    let minPrice = 200;

    let maxPrice =
      activePlan === "premium"
        ? 5000
        : activePlan === "intermediate"
        ? 3000
        : 2000;
    setPhoto({ ...photo, price: newValue });

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      let validPrice = Number(newValue);

      if (validPrice >= minPrice && validPrice <= maxPrice) {
        setPhoto({ ...photo, price: validPrice });
      } else if (validPrice < minPrice) {
        setPhoto({ ...photo, price: minPrice });
        toast.error(`Minimum price should be ${minPrice}`);
      } else if (validPrice > maxPrice) {
        setPhoto({ ...photo, price: maxPrice });
        toast.error(`Maximum price should be ${maxPrice}`);
      }
    }, 1000);

    setTimeoutId(id);
  };

  const handleWatermarkImage = async (event) => {
    const file = event.target.files[0];

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
        uploadFormData
      );

      const data = res.data;

      const res2 = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/upload/upload-watermark-image`,
        {
          imageUrl: data,
        }
      );
      setNewWatermark(res2.data.url);

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
      toast.success("Watermark added successfully");
      setWatermark(response.data.watermark);
      setPhoto({ ...photo, imageLinks: { image: imageUrl } });
    } catch (error) {
      console.error("Error adding watermark:", error);
    }
  };

  const handleWatermarkRemove = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/api/customwatermark/delete-custom-watermark?id=${id}`
      );
      toast.success("Watermark removed successfully");
      setWatermark("");
      setPhoto({ ...photo, imageLinks: { image: imageUrl } });
    } catch (error) {
      console.error("Error removing watermark:", error);
    }
  };

  const getWatermarks = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/customwatermark/get-custom-watermark?photographer=${photographer?._id}`
      );
      setWatermark(response.data.watermarkImage);
    } catch (error) {
      console.log("Watermark not found");
    }
  };
  useEffect(() => {
    if (activePlan === "premium") {
      getWatermarks();
    }
  }, [activePlan]);

  const handleDescriptionChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length <= 1000) {
      setPhoto({ ...photo, description: newValue });
    }
  };

  //photo upload
  const handleChange = async (event) => {
    setUploading(true);
    let step = 0;

    await sendLogToServer(
      `Photographer: ${photographer?.firstName || ""} (${
        photographer?._id
      }) started uploading photo`
    );

    try {
      let fileInput = event.target;
      let file = fileInput.files[0];

      if (!file) {
        console.error(`Step ${++step}: No file selected`);
        await sendLogToServer(`Step ${step}: No file selected`);
        toast.error("No file selected for upload!");
        fileInput.value = "";
        setUploading(false);
        return;
      }

      console.log(`Step ${++step}: File selected -`, file.name);
      await sendLogToServer(`Step ${step}: File selected - ${file.name}`);

      // File size validation
      if (file.size > 150 * 1024 * 1024 || file.size < 500 * 1024) {
        console.error(`Step ${++step}: File size out of range -`, file.size);
        await sendLogToServer(
          `Step ${step}: File size out of range - ${file.size}`
        );
        Swal.fire({
          title: "File size must be between 500KB and 150MB",
          icon: "error",
          confirmButtonText: "OK",
        });
        fileInput.value = "";
        setUploading(false);
        return;
      }

      console.log(`Step ${++step}: Checking file format...`);
      await sendLogToServer(`Step ${step}: Checking file format...`);

      // HEIC conversion
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (["heic", "heif"].includes(fileExtension)) {
        console.log(
          `Step ${++step}: HEIC file detected, starting conversion...`
        );
        await sendLogToServer(
          `Step ${step}: HEIC file detected, starting conversion...`
        );

        const toastId = toast.loading("Processing...");
        const heic2any = (await import("heic2any")).default;

        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
          });
          file = new File([convertedBlob], `${file.name.split(".")[0]}.jpeg`, {
            type: "image/jpeg",
          });
          toast.dismiss(toastId);
          console.log(`Step ${++step}: HEIC conversion successful`);
          await sendLogToServer(`Step ${step}: HEIC conversion successful`);
        } catch (conversionError) {
          console.error(
            `Step ${++step}: HEIC conversion failed -`,
            JSON.stringify(conversionError)
          );
          await sendLogToServer(
            `Step ${step}: HEIC conversion failed - ${JSON.stringify(
              conversionError
            )}`
          );
          toast.dismiss(toastId);
          toast.error(
            "HEIC conversion failed. Please use a supported image format."
          );
          fileInput.value = "";
          setUploading(false);
          return;
        }
      }

      console.log(`Step ${++step}: Requesting signed URL...`);
      await sendLogToServer(`Step ${step}: Requesting signed URL...`);

      // Get presigned URL from API
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      const { url, error } = await res.json();
      if (error) {
        throw new Error(error);
      }

      console.log(`Step ${++step}: Uploading to S3...`);
      await sendLogToServer(`Step ${step}: Uploading to S3...`);

      // Upload file with live progress
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          console.log(`Step ${step}: Upload progress - ${percent}%`);
          setProgr(percent);
          sendLogToServer(`Step ${step}: Upload progress - ${percent}%`);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          console.log(`Step ${++step}: File uploaded successfully`);
          const fileUrl = url.split("?")[0];
          await sendLogToServer(
            `Step ${step}: File uploaded successfully - ${fileUrl}`
          );

          setImageUrl(fileUrl);
          setPhoto({ ...photo, imageLinks: { image: fileUrl } });

          setUploading(false);
        } else {
          console.error(
            `Step ${++step}: Upload failed with status: ${xhr.status}`
          );
          await sendLogToServer(
            `Step ${step}: Upload failed with status: ${JSON.stringify(
              xhr.status
            )}`
          );
          toast.error("Upload failed. Please try again.");
          setUploading(false);
        }
      };

      xhr.onerror = async (err) => {
        console.error(`Step ${++step}: Upload failed due to network issues`, JSON.stringify(err));
        await sendLogToServer(
          `Step ${step}: Upload failed due to network issues - ${JSON.stringify(err)}`
        );
        toast.error("Upload failed. Please try again later.");
        setImageUrl("");
        setUploading(false);
      };

      xhr.send(file);
    } catch (uploadError) {
      console.error(`Step ${++step}: Upload failed -`, uploadError);
      await sendLogToServer(
        `Step ${step}: Upload failed - ${JSON.stringify(uploadError)}`
      );
      toast.error("Upload failed. Please try again later.");
      setImageUrl("");
      setUploading(false);
    }
  };

  const getResolutions = async () => {
    try {
      setStep("2");
      window.scrollTo(0, 160);
      setProcessing(true);
      if (photo.imageLinks.original) {
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/upload/handle-photos-with-watermark-and-resolutions-options`,
        {
          photographer: photographer?._id,
          imageUrl,
          plan: activePlan,
          isCustomText: activePlan === "basic" || watermark ? "false" : "true",
          customText:
            watermark || activePlan === "basic"
              ? ""
              : customText || "ClickedArt",
        }
      );
      const data = response.data;
      setPhoto((prevPhoto) => ({
        ...prevPhoto,
        imageLinks: data.urls,
        resolutions: data.resolutions,
      }));
      setProcessing(false);
      setError(false);
    } catch (error) {
      console.error("Error fetching resolutions:", error);
      toast.error("Server error. Please try again later.");
      setError(true);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setLoading(true);
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
      Swal.fire({
        title: "Success!",
        text: "Your photo has uploaded successfully and sent to Admin for Approval and may take 0-3 working days to reflect in your profile.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/profile");
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      toast.error("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(
      `category/get?pageSize=1000`,
      "categories",
      setCategories,
      setLoading
    );
  }, []);

  const categoriesOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  useEffect(() => {
    setPhoto({ ...photo, photographer: photographer?._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photographer]);

  useEffect(() => {
    if (!photographer) return;

    const fetchActivePlan = async () => {
      if (!photographer || !photographer._id) {
        return;
      }
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/subscriptions/get-user-active-subscription?photographer=${photographer._id}`
        );
        setActivePlan(res.data.subscription?.planId?.name?.toLowerCase());
        if (res.data.subscription?.planId?.name?.toLowerCase() === "basic") {
          setLimit(10);
        } else if (
          res.data.subscription?.planId?.name?.toLowerCase() === "intermediate"
        ) {
          setLimit(50);
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
        setPhotosLength(res.data.photos?.length);
      } catch (error) {
        console.log(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePlan();
    fetchPhotos();
  }, [photographer]);

  useEffect(() => {
    if (isHydrated && !photographer) {
      router.push("/profile");
    }
  }, [isHydrated, photographer, router]);

  return (
    <>
      {photographer ? (
        <div className="flex flex-col min-h-screen pb-20">
          <div className="flex flex-col px-2 lg:px-24 py-10 items-center">
            <div className="flex items-start w-full text-heading-06 font-semibold">
              <div
                onClick={() => router.back()}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span>
                  <ArrowLeftIcon className="w-6 h-6" />
                </span>
                Back
              </div>
            </div>
            <div className="relative flex justify-around w-full">
              <hr className="absolute z-0 border-primary w-[50%] top-6 lg:top-8" />
              <div className="flex flex-col items-center gap-4 z-10">
                <div
                  className={`${
                    step === "1" ? "border-primary" : "border-surface-300"
                  } border-2 lg:border-4 rounded-full p-4 bg-white`}
                >
                  <UploadIcon
                    strokeWidth={1.5}
                    className={`${
                      step === "1" ? "text-primary" : "text-surface-300"
                    } w-4 lg:w-8 h-4 lg:h-8`}
                  />
                </div>
                <p
                  className={`text-xs font-medium lg:text-base ${
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
                      step === "2" ? "text-primary" : " text-surface-300"
                    } w-4 lg:w-8 h-4 lg:h-8`}
                  />
                </div>
                <p
                  className={`text-xs font-medium lg:text-base ${
                    step === "2" ? "text-primary" : "text-surface-300"
                  }`}
                >
                  Fill in Details
                </p>
              </div>
            </div>
            {step === "1" && (
              <div className="mt-5">
                {photosLength >= limit ? (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-heading-04 text-center">
                      You have reached the limit of your plan. Please upgrade
                      your plan to upload more photos.
                    </p>
                    <Link href="/membership">
                      <Button>Upgrade Plan</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {imageUrl ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={imageUrl}
                          alt="Uploaded Image"
                          className="max-h-[80vh] mx-auto"
                        />
                        <button
                          onClick={() => {
                            setImageUrl("");
                            setUploading(false);
                            setProgr(0);
                          }}
                          className="bg-black text-white py-2 px-4 rounded-full mt-5"
                        >
                          Change Image
                        </button>
                      </div>
                    ) : (
                      <div className="w-full mx-auto rounded-lg overflow-hidden">
                        <div className="md:flex">
                          <div className="w-full p-3">
                            {uploading ? (
                              <div className="relative w-full bg-primary-100 md:w-8/12 mx-auto aspect-[16/9] rounded-lg border flex justify-center items-center shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-shadow duration-300 ease-in-out">
                                <div className="flex flex-row gap-2">
                                  <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:.7s]"></div>
                                  <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:.3s]"></div>
                                  <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:.7s]"></div>
                                </div>
                              </div>
                            ) : (
                              <div className="relative w-full md:w-8/12 mx-auto aspect-[16/9] rounded-lg border flex justify-center items-center shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-shadow duration-300 ease-in-out">
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
                                  accept="image/*, .heic, .heif"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
                    <div className="grid grid-cols grid-cols-3 gap-4 px-4">
                      <ul className="text-xs text-primary font-medium mt-1">
                        <li className="text-xs mt-1">
                          File size should be more than 5MB
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
                          File size should not exceed 150 MB.
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
                          Ensure the photo does not contain offensive, explicit,
                          or illegal content.
                        </li>
                        <li className="text-xs mt-1">
                          Photos must align with ClickedArt's ethical standards,
                          particularly for wildlife, cultural, and sensitive
                          subjects.
                        </li>
                        <li className="text-xs mt-1">
                          Ensure the uploaded photo is relevant to the
                          categories you&apos;ve selected.
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
                          Composition should follow photography principles, such
                          as the rule of thirds, framing, or leading lines.
                        </li>
                        <li className="text-xs mt-1">
                          Ensure the photo has no distracting elements unless
                          integral to the subject.
                        </li>
                      </ul>
                    </div>
                    <hr className="mt-5" />
                    {activePlan !== "basic" && !watermark && (
                      <div>
                        <Label className="!text-paragraph">
                          Custom Text Watermark
                        </Label>
                        <Input
                          className="!text-paragraph capitalize"
                          value={customText}
                          onChange={(e) => {
                            setCustomText(e.target.value);
                            setPhoto({
                              ...photo,
                              imageLinks: { image: imageUrl },
                            });
                          }}
                        />
                      </div>
                    )}
                    {activePlan === "premium" && (
                      <div className="mt-5">
                        <Label className="!text-paragraph">
                          Custom Watermark
                        </Label>
                        {watermark?.watermarkImage ? (
                          <div className="flex items-center gap-4">
                            <div className="p-4 bg-surface-200 rounded-md">
                              <img
                                src={watermark?.watermarkImage}
                                alt="Watermark"
                                className="w-20 h-20 object-cover rounded-md"
                              />
                            </div>
                            <p
                              className="text-red-600 font-medium cursor-pointer"
                              onClick={() =>
                                handleWatermarkRemove(watermark._id)
                              }
                            >
                              Remove Watermark
                            </p>
                          </div>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <p className="font-medium cursor-pointer text-blue-600">
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
                                  <Button2
                                    disabled={loading}
                                    onClick={() => handleWatermarkAdd()}
                                  >
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
                        }}
                        disabled={
                          !imageUrl ||
                          (activePlan === "intermediate" && !customText) ||
                          (activePlan === "premium" &&
                            !watermark?.watermarkImage &&
                            !customText)
                        }
                        className="bg-primary text-white py-2 px-4 rounded-full disabled:opacity-50"
                      >
                        Proceed
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            {step === "2" && (
              <div className="flex flex-col gap-4 mt-5 w-full">
                <p className="text-paragraph sm:text-heading-06 md:text-heading-05 lg:text-heading-04 text-center">
                  Add essential information to make your photos stand out.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {photo.imageLinks?.thumbnail ? (
                    <img
                      src={
                        photo.imageLinks?.thumbnail ||
                        "/assets/placeholders/broken-image.png"
                      }
                      className="w-full h-auto shadow-[3px_3px_10px_rgba(0,0,0,0.5)]"
                      alt="Uploaded Image"
                    />
                  ) : (
                    <div>
                      <div className="relative w-full">
                        <img
                          src={
                            imageUrl || "/assets/placeholders/broken-image.png"
                          }
                          className="w-full h-auto shadow-[3px_3px_10px_rgba(0,0,0,0.5)]"
                          alt="Uploaded Image"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                          <div className="flex flex-row gap-2">
                            <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.7s]"></div>
                            <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.3s]"></div>
                            <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.7s]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                        options={categoriesOptions}
                        isMulti
                        onChange={(selected) => {
                          setPhoto({
                            ...photo,
                            category: selected.map(
                              (category) =>
                                categories.find(
                                  (cat) => cat.name === category.value
                                )._id
                            ),
                          });
                        }}
                      />
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
                        <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto">
                          {categories
                            ?.filter((category) =>
                              photo.category.includes(category._id)
                            ) // Filter categories that are selected
                            .flatMap((category) => category.tags) // Flatten all tags from selected categories
                            .map((tag, index) => {
                              const isSelected = photo.keywords.includes(tag);
                              return (
                                <span
                                  key={index}
                                  onClick={() => {
                                    const updatedKeywords = isSelected
                                      ? photo.keywords.filter(
                                          (keyword) => keyword !== tag
                                        )
                                      : [...new Set([...photo.keywords, tag])]; // Avoid duplicates

                                    setPhoto({
                                      ...photo,
                                      keywords: updatedKeywords,
                                    });
                                    setKeywordInput(updatedKeywords.join(", "));
                                  }}
                                  className={`text-xs px-2 py-1 rounded-full mr-2 cursor-pointer whitespace-nowrap ${
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
                      <Button2
                        onClick={handleUpload}
                        state={loading || processing ? "loading" : "default"}
                      >
                        {loading
                          ? "Uploading..."
                          : processing
                          ? "Processing..."
                          : "Upload"}
                      </Button2>
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
