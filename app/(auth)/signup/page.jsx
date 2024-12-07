"use client";

import React, { useRef, useState, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Button from "@/components/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Plus, Trash } from "lucide-react";
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
      // Show loading toast
      const toastId = toast.loading("Processing image...");

      // Send the cropped canvas to the server as a file
      const blob = await new Promise((resolve) =>
        croppedCanvas.toBlob(resolve)
      );

      // FormData to send image to the server
      const formData = new FormData();
      formData.append("image", blob);

      try {
        const res = await fetch(
          "http://localhost:5000/api/upload/uploadSingleImage",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.text(); // Expect URL from server

        if (res.ok) {
          setCroppedImageUrl(data); // Store the URL of the uploaded image
          setFormData((prev) => ({
            ...prev,
            image: data, // Save external image URL in formData
          }));
          // Remove cropper and show updated image
          setCropperImage(null);
          toast.success("Image cropped and uploaded successfully!", {
            id: toastId,
          });
        } else {
          toast.error("Image upload failed.", { id: toastId });
        }
      } catch (error) {
        console.log("Error uploading cropped image", error);
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
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
      } else {
        setError(data.message);
        setMessage("");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
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
          ) : (
            <Image
              src={formData.image || "/assets/default.jpg"}
              alt="Profile Image"
              width={200}
              height={200}
              className="rounded-full object-cover"
            />
          )}
          <Label className="w-full">Profile Image</Label>
          <Input type="file" name="image" onChange={handleImageChange} />
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

        <div>
          <Label>Profile Image</Label>
          <Input type="file" name="image" onChange={handleImageUpload} />
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
