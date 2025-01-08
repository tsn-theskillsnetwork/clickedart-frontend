"use client";

import useAuthStore from "@/authStore";
import Button2 from "@/components/button2";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Tag, Trash2Icon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

export default function CataloguesPage() {
  const id = useParams().id;
  const { photographer, token } = useAuthStore();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState();
  const [selectedImage, setSelectedImage] = useState([]);
  const [catalogue, setCatalogue] = useState([]);

  console.log("catalogue", catalogue);
  console.log("images", images);
  console.log("selected", selectedImage);

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (selectedImage.length === 0) {
      toast.error("Please select an image to add to the catalogue.");
      return;
    }

    if (catalogue?.images.some((image) => selectedImage.includes(image._id))) {
      toast.error("Image already exists in the catalogue.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/update-catalogue`,
        {
          catalogueId: id,
          photographer: photographer?._id,
          images: selectedImage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response", response.data);

      setMessage("Image added to catalogue successfully!");
      fetchCatalogue();
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
      fetchCatalogue();
      toast.success("Image removed from catalogue successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      console.log("err", err.response?.data?.message);
    }
  };
  const fetchCatalogue = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/get-catalogue-by-id?catalogueId=${id}`
      );
      console.log("res", res.data);
      setCatalogue(res.data.catalogue);
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
    fetchCatalogue();
  }, [photographer]);

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 gap-5 py-10">
      {!catalogue && (
        <div>
          <p className="text-heading-06 font-semibold">No Catalogues Found</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-heading-03 font-semibold">{catalogue.name}</p>
          <p className="text-base -mt-1">{catalogue.description}</p>
        </div>
        <div></div>
      </div>
      <hr />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative group aspect-[1/1] shadow-[2px_2px_6px_rgba(0,0,0,0.4)]">
              <div className="w-full h-full flex items-center justify-center bg-gray-100 cursor-pointer">
                <Plus className="w-20 h-20 text-black" />
              </div>
            </div>
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
              <DialogClose asChild>
                <Button2 onClick={() => handleSubmit()}>Save changes</Button2>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {catalogue.images?.map((image) => (
          <div className="flex flex-col gap-2">
            <Link
              href={`/images/${image._id}`}
              className="relative group shadow-[2px_2px_6px_rgba(0,0,0,0.4)]"
              key={image._id}
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
                className="object-cover w-full aspect-[1/1] transition-all duration-200 ease-linear"
              />
              <div className="text-white absolute bottom-0 p-4 pt-6 bg-gradient-to-t from-black to-transparent inset-x-0 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear">
                <h2 className="text-heading-05 font-semibold">
                  {image.title || "Untitled"}
                </h2>
                <p className="font-medium text-surface-200">
                  {image.category?.name}
                </p>
              </div>
            </Link>
            <Button
              variant="link"
              className="z-50 text-red-600 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(catalogue._id, image._id);
              }}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
