"use client";

import React, { useRef, useState, useEffect } from "react";
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
    connectedAccounts: [],
    password: "",
    address: "",
    age: "",
    dob: "",
    image: "", // Initialize with an empty string
    bio: "",
    interests: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cropperImage, setCropperImage] = useState(null); // For image preview and cropping
  const [croppedImageUrl, setCroppedImageUrl] = useState(null); // Final cropped image URL
  const cropperRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value ?? "" }); // Ensure value is not undefined
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return; // Avoid undefined issues

    // Send file to server
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const res = await fetch(
        `http://localhost:5000/api/upload/uploadSingleImage`,
        {
          method: "POST",
          body: uploadData,
        }
      );
      const data = await res.text(); // Parse as plain text
      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          image: data, // Save the file location URL
        }));
        console.log("Image uploaded successfully", data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropperImage(reader.result); // Set the base64 image to Cropper
      };
      reader.readAsDataURL(file);
    }
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    if (formData.name.length < 5)
      newErrors.name = "Name must be at least 5 characters.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.age && (formData.age < 0 || isNaN(formData.age)))
      newErrors.age = "Age must be a positive number.";
    if (formData.dob && isNaN(new Date(formData.dob).getTime()))
      newErrors.dob = "Date of birth is invalid.";
    if (formData.interests && !/^[\w\s,]*$/.test(formData.interests))
      newErrors.interests = "Interests must be comma-separated.";
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
  
      const formData = new FormData();
      formData.append("image", blob);
  
      try {
        const res = await axios.post(
          "http://localhost:5000/api/upload/uploadSingleImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Ensure proper headers for multipart
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
              toast.loading("Uploading image...", { id: toastId });
            },
          }
        );
  
        const data = res.data;
  
        // Save the cropped image URL to formData.image
        setFormData((prev) => ({
          ...prev,
          image: data, // This should be the URL or path of the uploaded image
        }));
        setCropperImage(null);
  
        toast.success("Image cropped and uploaded successfully!", {
          id: toastId,
        });
      } catch (error) {
        console.error("Error uploading cropped image:", error);
        toast.error("Image upload failed.", { id: toastId });
      }
    }
  };
  

  // Form submission handler
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
        `${process.env.NEXT_PUBLIC_SERVER}/api/user/register`,
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
        address: "",
        age: "",
        dob: "",
        image: "",
        bio: "",
        interests: "",
      });
      router.push("/signin");
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

  console.log(formData);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] mt-5 mb-10">
      <Toaster position="top-center" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-1/2 px-5 gap-4"
      >
        <h2 className="text-heading-04 font-medium text-center">
          User Registration
        </h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
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
          ) : formData.image ? (
            <>
              <Image
                src={formData.image}
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
          <Label>Connect Accounts</Label>
          <div className="flex flex-col gap-2">
            {formData.connectedAccounts?.map((account, index) => (
              <div key={index} className="flex gap-2">
                <Select
                  className="w-36"
                  value={account.accountName}
                  onValueChange={(value) => {
                    const newAccounts = [...formData.connectedAccounts];
                    newAccounts[index].accountName = value;
                    setFormData({
                      ...formData,
                      connectedAccounts: newAccounts,
                    });
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                    <p className="sr-only">Account Name</p>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedIn">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
                {/* <Input
                type="text"
                name="accountName"
                value={account.accountName}
                onChange={(e) => {
                  const newAccounts = [...formData.connectedAccounts];
                  newAccounts[index].accountName = e.target.value;
                  setFormData({ ...formData, connectedAccounts: newAccounts });
                  }}
                  placeholder="Account Name"
                  /> */}
                <Input
                  type="text"
                  name="accountLink"
                  value={account.accountLink}
                  onChange={(e) => {
                    const newAccounts = [...formData.connectedAccounts];
                    newAccounts[index].accountLink = e.target.value;
                    setFormData({
                      ...formData,
                      connectedAccounts: newAccounts,
                    });
                  }}
                  placeholder="Account Link"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-2 mt-2">
            <button
              type="button"
              className="p-2 rounded-md border-2 border-green-500 hover:bg-green-500 hover:text-white"
              onClick={() =>
                setFormData({
                  ...formData,
                  connectedAccounts: [
                    ...formData.connectedAccounts,
                    {
                      accountName: "",
                      accountLink: "",
                    },
                  ],
                })
              }
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              className="p-2 rounded-md border-2 border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current"
              disabled={formData.connectedAccounts?.length === 0}
              onClick={() =>
                setFormData({
                  ...formData,
                  connectedAccounts: formData.connectedAccounts.slice(0, -1),
                })
              }
            >
              <Trash size={16} />
            </button>
          </div>
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
          <Label>Address</Label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label>Date of Birth</Label>
          <Input
            type="date"
            name="dob"
            value={formData.dob || ""} // Ensure default empty string
            onChange={handleInputChange}
          />
          {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
        </div>

        <p>{formData.image}</p>

        <div>
          <Label>Bio</Label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          ></Textarea>
        </div>

        <div>
          <Label>Interests</Label>
          <Input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
            placeholder="Comma-separated interests"
          />
          {errors.interests && (
            <p className="text-red-500 text-sm">{errors.interests}</p>
          )}
        </div>

        <div className="flex flex-col items-center">
          <Button type="submit">Register</Button>
        </div>
      </form>
      <div className="flex flex-col items-center mt-4">
        <p>
          Already have an account?{" "}
          <Link className="underline" href="/signin">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
