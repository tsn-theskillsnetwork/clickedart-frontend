"use client";

import useAuthStore from "@/authStore";
import Button2 from "@/components/button2";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import React, {useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tag } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CataloguesPage() {
  const { photographer, token } = useAuthStore();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState();
  const [selectedImage, setSelectedImage] = useState([]);
  const [catalogues, setCatalogues] = useState([]);

  console.log("catalogues", catalogues);
  console.log("images", images);
  console.log("selected", selectedImage);

  const handleSubmit = async (catalogueId) => {
    setMessage("");
    setError("");

    if (selectedImage.length === 0) {
      toast.error("Please select an image to add to the catalogue.");
      return;
    }

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
          images: selectedImage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response", response.data);

      setMessage("Image added to catalogue successfully!");
      fetchCatalogues();
      setError("");
    } catch (err) {
      setError(err.response.data.message || "An error occurred.");
      console.log("err", err.response.data.message);
    }
  };

  const removeImage = async (catalogueId, imageIdToRemove) => {
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/remove-images-from-catalogue`,
        {
          catalogueId: catalogueId,
          imagesToRemove: [imageIdToRemove],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response", response.data);

      setMessage("Image removed from catalogue successfully!");
      setError("");

      // Optionally update the UI
      setCatalogues((prevCatalogues) =>
        prevCatalogues.map((catalogue) =>
          catalogue._id === catalogueId
            ? {
                ...catalogue,
                images: catalogue.images.filter(
                  (image) => image._id !== imageIdToRemove
                ),
              }
            : catalogue
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      console.log("err", err.response?.data?.message);
    }
  };
  const fetchCatalogues = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/get-catalogues-by-photographer?photographer=${photographer?._id}`
      );
      console.log("res", res.data);
      setCatalogues(res.data.catalogues);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!photographer) return;

    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-images-by-photographer?photographer=${photographer?._id}`
        );
        console.log("res", res.data);
        setImages(res.data.photos);
      } catch (err) {
        console.log(err);
      }
    };

    fetchImages();
    fetchCatalogues();
  }, [photographer]);

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 gap-10 py-20">
      <div className="flex justify-between">
        <p className="text-heading-04 font-semibold">Catalogue</p>
        <Link href="/profile/catalogues/create">
          <Button2>Create Catalogue</Button2>
        </Link>
      </div>
      {catalogues?.length === 0 && (
        <div>
          <p className="text-heading-06 font-semibold">No Catalogues Found</p>
        </div>
      )}
      {catalogues?.map((catalogue) => (
        <div
          key={catalogue._id}
          className="flex flex-col gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.1)] p-4 rounded-md"
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-heading-05 font-semibold">{catalogue.name}</p>
              <p className="text-base -mt-1">{catalogue.description}</p>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Add Image</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Image</DialogTitle>
                    <DialogDescription>
                      Add your images to the catalogue.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Label htmlFor="image" className="text-left">
                      Select Image
                    </Label>
                    <Select
                      onValueChange={(imageId) => {
                        setSelectedImage((prev) =>
                          prev.includes(imageId)
                            ? prev.filter((id) => id !== imageId)
                            : [...prev, imageId]
                        );
                      }}
                      value={selectedImage._id}
                    >
                      <SelectTrigger className={`${selectedImage && "!h-24"}`}>
                        <SelectValue placeholder="Select Image" />
                      </SelectTrigger>
                      <SelectContent>
                        {images?.map((image) => (
                          <SelectItem key={image._id} value={image?._id}>
                            <div className="flex items-center gap-2">
                              <img
                                src={image.imageLinks.original}
                                alt={image.name}
                                className="w-20 h-20 object-cover rounded-md"
                              />
                              {image.title}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button2 onClick={() => handleSubmit(catalogue._id)}>
                      Save changes
                    </Button2>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <hr />
          <div className="grid grid-cols-4 gap-4">
            {catalogue.images?.map((image) => (
              <div
                key={image._id}
                className="shadow-[0_2px_6px_rgba(0,0,0,0.2)] rounded-lg p-4"
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
                    <div className="flex justify-between mx-4 mt-4">
                      <div className="bg-white px-2 text-paragraph group-hover:opacity-0 bg-opacity-75 w-fit transition-all duration-200 ease-linear cursor-default">
                        <p>{image.imageAnalytics?.downloads || 0} Downloads</p>
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
                  <Button
                    variant="outline"
                    onClick={() => removeImage(catalogue._id, image._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
