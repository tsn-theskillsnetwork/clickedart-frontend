"use client";

import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Button from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ImageIcon, Plus, Trash } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const RegistrationForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    dob: "",
    profileImage: "",
    address: "",
    isCompany: false,
    companyName: "",
    companyEmail: "",
    companyAddress: "",
    companyPhone: "",
    portfolioLink: "",
    photographyStyles: "",
    yearsOfExperience: "",
    accountType: "freelance",
    connectedAccounts: [],
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cropperImage, setCropperImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const cropperRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value ?? "" });
  };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const uploadData = new FormData();
  //   uploadData.append("image", file);

  //   try {
  //     const res = await fetch(
  //       `http://localhost:5000/api/upload/uploadSingleImage`,
  //       {
  //         method: "POST",
  //         body: uploadData,
  //       }
  //     );
  //     const data = await res.text();
  //     if (res.ok) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         profileImage: data,
  //       }));
  //       console.log("Image uploaded successfully", data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCropperImage(reader.result);
        } else {
          toast.error("Failed to load image.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.length < 5)
      newErrors.name = "Name must be at least 5 characters.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.yearsOfExperience && isNaN(formData.yearsOfExperience))
      newErrors.yearsOfExperience = "Years of experience must be a number.";

    if (formData.dob && isNaN(new Date(formData.dob).getTime()))
      newErrors.dob = "Date of birth is invalid.";
    if (
      formData.photographyStyles &&
      !/^[\w\s,]*$/.test(formData.photographyStyles)
    )
      newErrors.photographyStyles =
        "Photography styles must be comma-separated.";
    return newErrors;
  };

  const handleCrop = async () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const toastId = toast.loading("Processing image...");

      // Convert canvas to Blob
      const blob = await new Promise((resolve) =>
        croppedCanvas.toBlob(resolve)
      );

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("image", blob);

      // State to track upload progress

      try {
        // Send FormData with multipart upload
        const res = await axios.post(
          "http://localhost:5000/api/upload/uploadSingleImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Ensure proper headers for multipart
            },
            onUploadProgress: (progressEvent) => {
              // Calculate the upload percentage
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              // Update progress in state
              setUploadProgress(percentCompleted);

              // Update toast message with progress
              toast.loading("Uploading image...", {
                id: toastId,
              });
            },
          }
        );

        // Handle server response
        const data = res.data;

        // Update state with the uploaded image URL
        setCroppedImageUrl(data);
        setFormData((prev) => ({
          ...prev,
          profileImage: data,
        }));
        setCropperImage(null);

        toast.success("Image cropped and uploaded successfully!", {
          id: toastId,
        });
      } catch (error) {
        if (res.status !== 200 || !data.imageUrl) {
          throw new Error("Failed to upload image.");
        }
        console.error("Error uploading cropped image:", error);
        toast.error("Image upload failed.", { id: toastId });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      setMessage(data.message);
      setError("");
      setFormData({
        name: "",
        email: "",
        password: "",
        bio: "",
        dob: "",
        profileImage: "",
        address: "",
        isCompany: false,
        companyName: "",
        companyEmail: "",
        companyAddress: "",
        companyPhone: "",
        portfolioLink: "",
        photographyStyles: "",
        yearsOfExperience: "",
        accountType: "freelance",
        connectedAccounts: [],
      });
      router.push("/photographer/signin");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
            "Something went wrong. Please try again later."
        );
      } else {
        setError("Something went wrong. Please try again later.");
      }
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] mt-5 mb-10">
      <Toaster position="top-center" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-1/2 px-5 gap-4"
      >
        <h2 className="text-heading-04 font-medium text-center">
          Photographer Registration
        </h2>

        <div className="flex flex-col items-center gap-4">
          {cropperImage ? (
            <Cropper
              src={cropperImage}
              style={{ height: 300, width: "100%" }}
              initialAspectRatio={1}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
            />
          ) : formData.profileImage ? (
            <>
              <Image
                src={formData.profileImage}
                alt="Profile Image"
                width={200}
                height={200}
                className="rounded-full object-cover aspect-[1/1]"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, profileImage: "" })}
                className="text-red-500"
              >
                Remove
              </button>
            </>
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
                      onChange={handleImageChange}
                      className="h-full w-full opacity-0 cursor-pointer"
                      type="file"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {cropperImage && (
            <button
              type="button"
              onClick={handleCrop}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Crop Image
            </button>
          )}
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div>
            <progress value={uploadProgress} max={100}></progress>
            <span>{uploadProgress}%</span>
          </div>
        )}
        <div>
          <Label>
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <Label>
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <Label>
            Password <span className="text-red-500">*</span>
          </Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div>
          <Label>
            Address <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label>Bio</Label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label>Account Type</Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) =>
              setFormData({ ...formData, accountType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Account Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="agency">Agency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Date of Birth</Label>
          <Input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
          />
          {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
        </div>

        <div className="flex items-center gap-3">
          <Label>Is this a company account?</Label>
          <input
            type="checkbox"
            name="isCompany"
            checked={formData.isCompany}
            onChange={(e) =>
              setFormData({ ...formData, isCompany: e.target.checked })
            }
          />
        </div>

        {formData.isCompany && (
          <>
            <div>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Company Email</Label>
              <Input
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Company Address</Label>
              <Input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Company Phone</Label>
              <Input
                type="tel"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        <div>
          <Label>Portfolio Link</Label>
          <Input
            type="url"
            name="portfolioLink"
            value={formData.portfolioLink}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label>Photography Styles</Label>
          <Input
            type="text"
            name="photographyStyles"
            value={formData.photographyStyles}
            onChange={handleInputChange}
          />
          {errors.photographyStyles && (
            <p className="text-red-500 text-sm">{errors.photographyStyles}</p>
          )}
        </div>

        <div>
          <Label>Years of Experience</Label>
          <Input
            type="number"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleInputChange}
          />
          {errors.yearsOfExperience && (
            <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>
          )}
        </div>

        <div>
          <Label>Connected Accounts</Label>
          <Textarea
            name="connectedAccounts"
            value={formData.connectedAccounts.join(", ")}
            onChange={handleInputChange}
            placeholder="Comma-separated list of connected accounts"
          />
        </div>

        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <Button type="submit" variant="primary" fullWidth>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
