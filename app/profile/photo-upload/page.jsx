"use client";

import useAuthStore from "@/authStore";
import Button from "@/components/button";
import Button2 from "@/components/button2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchData } from "@/helpers/api";
import axios from "axios";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PhotoUploadPage() {
  const router = useRouter();

  const { user, photographer, token } = useAuthStore();
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
    license: "",
    exclusivityDetails: "",
    exclusiveLicenseStatus: "pending",
    identifiableData: {
      modelRelease: "",
      propertyRelease: "",
    },
    title: "",
    isActive: false,
  });

  console.log(photo);

  const [categories, setCategories] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/upload/uploadPhotoWithSizeCheck`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setUploadProgress(progress); // Update the progress
            }
          },
        }
      );

      console.log(response.data);

      const data = response.data;
      setPhoto({
        ...photo,
        imageLinks: {
          original: data.urls.original,
          medium: data.urls.medium,
          small: data.urls.small,
        },
        resolutions: {
          original: {
            width: data.resolutions.original?.width,
            height: data.resolutions.original?.height,
          },
          medium: {
            width: data.resolutions.medium?.width,
            height: data.resolutions.medium?.height,
          },
          small: {
            width: data.resolutions.small?.width,
            height: data.resolutions.small?.height,
          },
        },
      });

      console.log(photo);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpload = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/add-image-in-vault`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify(photo),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.success) {
        router.push("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    setPhoto({ ...photo, photographer: photographer?._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photographer]);

  if (!photographer) {
    return (
      <div>
        <h1>Not Authenticated</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Upload Image</h1>
      <main className="flex flex-col items-center p-4">
        <div className="flex flex-col gap-4 w-1/2">
          {photo.imageLinks.original?.length > 0 ? (
            <img src={photo.imageLinks.original} alt="Uploaded Image" />
          ) : (
            <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
              <div className="md:flex">
                <div className="w-full p-3">
                  <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <div className="absolute flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 text-blue-500" />
                      <span className="block text-gray-500 font-semibold">
                        Drag &amp; drop your files here
                      </span>
                      <span className="block text-gray-400 font-normal mt-1">
                        or click to upload
                      </span>
                    </div>
                    <input
                      name=""
                      onChange={handleImageUpload}
                      className="h-full w-full opacity-0 cursor-pointer"
                      type="file"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>
            <Label>Title*</Label>
            <Input value={photo.title} onChange={(e) => setPhoto({ ...photo, title: e.target.value })} />
          </div>
          <div>
            <Label>Category</Label>
            <Select
              onValueChange={(value) => setPhoto({ ...photo, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={photo.description}
              onChange={(e) =>
                setPhoto({ ...photo, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Story</Label>
            <Textarea
              value={photo.story}
              onChange={(e) => setPhoto({ ...photo, story: e.target.value })}
            />
          </div>
          <div>
            <Label>Keywords *</Label>
            <Input
              value={photo.keywords.join(", ")}
              onChange={(e) =>
                setPhoto({
                  ...photo,
                  keywords: e.target.value
                    .split(",")
                    .map((keyword) => keyword.trim()),
                })
              }
            />
          </div>
          <div>
            <Label>Photo Privacy</Label>
            <Select
              onValueChange={(value) =>
                setPhoto({ ...photo, photoPrivacy: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Watermark</Label>
            <Select
              onValueChange={(value) =>
                setPhoto({ ...photo, watermark: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Watermark" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={true}>Yes</SelectItem>
                <SelectItem value={false}>No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Camera</Label>
            <Input
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
            <Label>Lens</Label>
            <Input
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
          <div>
            <Label>Focal Length</Label>
            <Input
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
            <Label>Aperture</Label>
            <Input
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
          <div>
            <Label>Shutter Speed</Label>
            <Input
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
            <Label>ISO</Label>
            <Input
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
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={photo.price}
              onChange={(e) => setPhoto({ ...photo, price: e.target.value })}
            />
          </div>
          <div>
            <Label>License Type *</Label>
            <Select
              onValueChange={(value) =>
                setPhoto({ ...photo, license: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select License" />
              </SelectTrigger>
              <SelectContent>
                {licenses.map((license) => (
                  <SelectItem key={license._id} value={license._id}>
                    {license.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Exclusivity Details</Label>
            <Textarea
              value={photo.exclusivityDetails}
              onChange={(e) =>
                setPhoto({ ...photo, exclusivityDetails: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <Button2 onClick={handleUpload}>Upload</Button2>
          <Button onClick={() => navigate("/photos")}>Cancel</Button>
        </div>
      </main>
    </div>
  );
}
