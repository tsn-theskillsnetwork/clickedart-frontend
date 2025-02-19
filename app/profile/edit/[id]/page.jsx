"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import useAuthStore from "@/authStore";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import Button from "@/components/button";
import Button2 from "@/components/button2";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function ImageEdit() {
  const { id } = useParams();
  const router = useRouter();
  const { photographer, token, isHydrated } = useAuthStore();

  const [photo, setPhoto] = useState();
  const [updatedPhoto, setUpdatedPhoto] = useState();
  const [categories, setCategories] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [activePlan, setActivePlan] = useState("basic");
  const [loading, setLoading] = useState(true);

  const handleDescriptionChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length <= 1000) {
      setPhoto({ ...photo, description: newValue });
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/update-image-in-vault`,
        updatedPhoto,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      toast.success("Image uploaded successfully");
      alert("Image updated successfully. Please check your profile.");
      router.push("/profile");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      toast.error("Error uploading image");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/delete-image?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      toast.success("Image deleted successfully");
      alert("Image deleted successfully. Please check your profile.");
      router.push("/profile");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      toast.error("Error deleting image");
    }
  };

  const categoriesOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const handlePriceChange = (e) => {
    const newValue = e.target.value;

    let minPrice = 200;

    let maxPrice =
      activePlan === "premium"
        ? 5000
        : activePlan === "intermediate"
        ? 3000
        : 2000;
    setUpdatedPhoto({ ...updatedPhoto, price: newValue });

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      let validPrice = Number(newValue);

      if (validPrice >= minPrice && validPrice <= maxPrice) {
        setUpdatedPhoto({ ...updatedPhoto, price: validPrice });
      } else if (validPrice < minPrice) {
        setUpdatedPhoto({ ...updatedPhoto, price: minPrice });
        toast.error(`Minimum price should be ${minPrice}`);
      } else if (validPrice > maxPrice) {
        setUpdatedPhoto({ ...updatedPhoto, price: maxPrice });
        toast.error(`Maximum price should be ${maxPrice}`);
      }
    }, 1000);

    setTimeoutId(id);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/category/get`
        );
        setCategories(res.data.categories);
        // //console.log(res.data.categories);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPhoto = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-image-by-id?id=${id}`
        );
        setPhoto(res.data.photo);
      } catch (error) {
        console.log(error);
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

    fetchCategories();
    fetchPhoto();
    fetchActivePlan();
  }, [photographer]);

  useEffect(() => {
    if (photo) {
      setUpdatedPhoto((prev) => ({
        ...prev,
        id: photo._id,
        title: photo.title,
        price: photo.price.original,
        category: photo.category,
        description: photo.description,
        keywords: photo.keywords,
        story: photo.story,
        cameraDetails: photo.cameraDetails,
        location: photo.location,
        imageLinks: photo.imageLinks,
        photographer: photo.photographer._id,
      }));
    }
  }, [photo]);

  if (!photographer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        {isHydrated ? (
          <>
            <h1 className="text-3xl font-bold text-center text-gray-800">
              You need to be a photographer to create a blog.
            </h1>
          </>
        ) : (
          <Loader />
        )}
      </div>
    );
  }

  if (photographer && photo && photo.photographer?._id !== photographer._id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  return (
    <>
      {updatedPhoto ? (
        <div className="flex flex-col gap-4 mt-20 w-full px-10 pb-10">
          <p className="text-heading-04 text-center">
            Add essential information to make your photos stand out.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="flex flex-col items-center gap-4">
              <img
                src={
                  updatedPhoto.imageLinks?.thumbnail ||
                  "/assets/placeholders/broken-image.png"
                }
                className="w-full h-auto shadow-[3px_3px_10px_rgba(0,0,0,0.5)]"
                alt="Uploaded Image"
              />
              <Dialog>
                <DialogTrigger>
                  <div className="font-medium px-4 py-2 rounded-lg text-white shadow-[2px_2px_4px_rgba(0,0,0,0.4)] bg-red-600 hover:bg-red-500 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                    Delete
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose asChild>
                    <div
                      onClick={() => {
                        handleDelete();
                      }}
                      className="font-medium px-4 py-2 rounded-lg text-white shadow-[2px_2px_4px_rgba(0,0,0,0.4)] bg-red-600 hover:bg-red-500 transition-all duration-200 ease-in-out cursor-pointer"
                    >
                      Delete
                    </div>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label className="!text-paragraph">Title*</Label>
                  <Input
                    className="!text-paragraph"
                    value={updatedPhoto.title || ""}
                    onChange={(e) =>
                      setUpdatedPhoto({
                        ...updatedPhoto,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="!text-paragraph">Price*</Label>
                  <Input
                    className="!text-paragraph"
                    type="number"
                    required
                    value={updatedPhoto.price}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>
              <div>
                <Label className="!text-paragraph">Category*</Label>
                <Select
                  options={categoriesOptions}
                  isMulti
                  value={updatedPhoto.category.map((category) => ({
                    value: category._id || category,
                    label:
                      category.name ||
                      categoriesOptions.find((c) => c.value === category).label,
                  }))}
                  onChange={(selected) => {
                    setUpdatedPhoto({
                      ...updatedPhoto,
                      category: selected.map((category) => category.value),
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
                  value={updatedPhoto.description || ""}
                  placeholder="Enter a description for your photo (Max 1000 characters)"
                  onChange={handleDescriptionChange}
                />
              </div>
              <div>
                <Label className="!text-paragraph">Keywords *</Label>
                <Input
                  className="!text-paragraph"
                  placeholder="Enter keywords separated by commas (Min 5)"
                  value={updatedPhoto.keywords || keywordInput || ""}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setKeywordInput(inputValue);
                    setUpdatedPhoto({
                      ...updatedPhoto,
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
                        updatedPhoto.category.includes(category._id)
                      ) // Filter categories that are selected
                      .flatMap((category) => category.tags) // Flatten all tags from selected categories
                      .map((tag, index) => {
                        const isSelected = updatedPhoto.keywords.includes(tag);
                        return (
                          <span
                            key={index}
                            onClick={() => {
                              const updatedKeywords = isSelected
                                ? updatedPhoto.keywords.filter(
                                    (keyword) => keyword !== tag
                                  )
                                : [...new Set([...updatedPhoto.keywords, tag])]; // Avoid duplicates

                              setUpdatedPhoto({
                                ...updatedPhoto,
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
                  value={updatedPhoto.story || ""}
                  onChange={(e) =>
                    setUpdatedPhoto({ ...updatedPhoto, story: e.target.value })
                  }
                />
              </div>

              <hr />
              <div>
                <Label className="!text-paragraph">Camera</Label>
                <Input
                  className="!text-paragraph"
                  value={updatedPhoto.cameraDetails.camera || ""}
                  onChange={(e) =>
                    setUpdatedPhoto({
                      ...updatedPhoto,
                      cameraDetails: {
                        ...updatedPhoto.cameraDetails,
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
                  value={updatedPhoto.cameraDetails.lens || ""}
                  onChange={(e) =>
                    setUpdatedPhoto({
                      ...updatedPhoto,
                      cameraDetails: {
                        ...updatedPhoto.cameraDetails,
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
                    value={
                      updatedPhoto.cameraDetails.settings.focalLength || ""
                    }
                    onChange={(e) =>
                      setUpdatedPhoto({
                        ...updatedPhoto,
                        cameraDetails: {
                          ...updatedPhoto.cameraDetails,
                          settings: {
                            ...updatedPhoto.cameraDetails.settings,
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
                    value={updatedPhoto.cameraDetails.settings.aperture || ""}
                    onChange={(e) =>
                      setUpdatedPhoto({
                        ...updatedPhoto,
                        cameraDetails: {
                          ...updatedPhoto.cameraDetails,
                          settings: {
                            ...updatedPhoto.cameraDetails.settings,
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
                    value={
                      updatedPhoto.cameraDetails.settings.shutterSpeed || ""
                    }
                    onChange={(e) =>
                      setUpdatedPhoto({
                        ...updatedPhoto,
                        cameraDetails: {
                          ...updatedPhoto.cameraDetails,
                          settings: {
                            ...updatedPhoto.cameraDetails.settings,
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
                    value={updatedPhoto.cameraDetails.settings.iso || ""}
                    onChange={(e) =>
                      setUpdatedPhoto({
                        ...updatedPhoto,
                        cameraDetails: {
                          ...updatedPhoto.cameraDetails,
                          settings: {
                            ...updatedPhoto.cameraDetails.settings,
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
                  value={updatedPhoto.location || ""}
                  onChange={(e) =>
                    setUpdatedPhoto({
                      ...updatedPhoto,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/profile">
                  <button className="w-full bg-primary h-full rounded-lg text-white font-semibold hover:bg-primary-dark">
                    Back
                  </button>
                </Link>
                <Button2 onClick={handleUpdate}>Update</Button2>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          {loading ? <Loader /> : "Not found"}
        </div>
      )}
    </>
  );
}
