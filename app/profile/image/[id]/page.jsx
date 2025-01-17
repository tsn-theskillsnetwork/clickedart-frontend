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

export default function ImageEdit() {
  const { id } = useParams();
  const router = useRouter();
  const { photographer } = useAuthStore();

  const [photo, setPhoto] = useState();
  const [categories, setCategories] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");

  const handleDescriptionChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length <= 1000) {
      setPhoto({ ...photo, description: newValue });
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    console.log("update triggered");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/update-image-in-vault`,
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
      setPhoto({ ...photo, imageLinks: {} });
      console.log("File URL:", fileUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const categoriesOptions = categories.map((category) => ({
    value: category.name,
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/category/get`
        );
        setCategories(res.data.categories);
        console.log(res.data.categories);
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
      }
    };

    fetchCategories();
    fetchPhoto();
  }, [photographer]);
  return (
    <>
      {photo ? (
        <div className="flex flex-col gap-4 mt-20 w-full">
          <p className="text-heading-04 text-center">
            Add essential information to make your photos stand out.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <img
              src={photo.imageLinks?.thumbnail || "/assets/placeholder.webp"}
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
                  options={categoriesOptions}
                  isMulti
                  onChange={(selected) => {
                    setPhoto({
                      ...photo,
                      category: selected.map(
                        (category) =>
                          categories.find((cat) => cat.name === category.value)
                            ._id
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
                <Button2 onClick={handleUpdate}>Update</Button2>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
    </>
  );
}
