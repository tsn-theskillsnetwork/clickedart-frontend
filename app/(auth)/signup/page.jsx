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
import countries from "@/lib/address/countries.json";
import states from "@/lib/address/states.json";
import cities from "@/lib/address/cities.json";

const RegistrationForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: undefined,
    whatsapp: undefined,
    shippingAddress: {
      address: "",
      city: "",
      state: "",
      country: "India",
      landmark: "",
      pincode: "",
      area: "",
      email: "",
      mobile: undefined,
    },
    isMarried: false,
    anniversary: "",
    dob: "",
    image: "",
    interests: [],
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cropperImage, setCropperImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const cropperRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("102");
  const [selectedState, setSelectedState] = useState("0");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value ?? "" });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/upload/uploadSingleImage`,
        {
          method: "POST",
          body: uploadData,
        }
      );
      const data = await res.text();
      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          image: data,
        }));
        console.log("Image uploaded successfully", data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 5 * 1000 * 1024) {
        toast.error("File with maximum size of 5MB is allowed");
        return false;
      }

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
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.firstName.length < 3)
      newErrors.firstName = "First Name must be at least 3 characters.";
    if (formData.lastName.length < 3)
      newErrors.lastName = "Last Name must be at least 3 characters.";
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

      const blob = await new Promise((resolve) =>
        croppedCanvas.toBlob(resolve)
      );

      const formData = new FormData();
      formData.append("image", blob);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/api/upload/uploadSingleImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
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

        setFormData((prev) => ({
          ...prev,
          image: data,
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
        firstName: "",
        lastName: "",
        email: "",
        connectedAccounts: [],
        password: "",
        mobile: undefined,
        whatsapp: undefined,
        shippingAddress: {
          country: "",
          state: "",
          city: "",
          address: "",
          landmark: "",
          pincode: "",
          area: "",
        },
        isMarried: false,
        anniversary: "",
        dob: "",
        image: "",
        interests: [],
      });
      router.push("/verify");
    } catch (err) {
      console.error(err);
      setError("Failed to register user.");
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
                      accept="image/*"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full ">
          <div>
            <Label>
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          <div>
            <Label>
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
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
          <Label>Mobile</Label>
          <Input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label>WhatsApp</Label>
          <Input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
          />
        </div>

        <div className="py-2 my-2 border-y">
          <p className="text-heading-06 font-semibold">Address</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Country*</Label>
              <Select
                defaultValue={formData.shippingAddress?.country}
                onValueChange={(value) => {
                  const selectedCountry = countries[2].data.find(
                    (country) => country.name === value
                  );
                  setSelectedCountry(selectedCountry.id);
                  const newAddress = { ...formData.shippingAddress };
                  newAddress.country = value;
                  setFormData({
                    ...formData,
                    shippingAddress: newAddress,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries[2].data.map((country) => (
                    <SelectItem key={country.id} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>State*</Label>
              <Select
                defaultValue={formData.shippingAddress?.state}
                onValueChange={(value) => {
                  const selectedState = states[2].data.find(
                    (state) => state.name === value
                  );
                  setSelectedState(selectedState.id);
                  const newAddress = { ...formData.shippingAddress };
                  newAddress.state = value;
                  setFormData({
                    ...formData,
                    shippingAddress: newAddress,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states[2].data
                    .filter((state) => state.countryId === selectedCountry) // Filter states by selected country ID
                    .map((state) => (
                      <SelectItem key={state.id} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City*</Label>
              <Select
                defaultValue={formData.shippingAddress?.city}
                onValueChange={(value) => {
                  const newAddress = { ...formData.shippingAddress };
                  newAddress.city = value;
                  setFormData({
                    ...formData,
                    shippingAddress: newAddress,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities[2].data
                    .filter((city) => city.stateId === selectedState) // Filter cities by selected state ID
                    .map((city) => (
                      <SelectItem key={city.id} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Address</Label>
              <Input
                type="text"
                name="shippingAddress.address"
                value={formData.shippingAddress?.address}
                onChange={(e) => {
                  const newAddress = { ...formData.shippingAddress };
                  newAddress.address = e.target.value;
                  setFormData({
                    ...formData,
                    shippingAddress: newAddress,
                  });
                }}
              />
            </div>
            <div>
              <Label>Landmark</Label>
              <Input
                type="text"
                name="shippingAddress.landmark"
                value={formData.shippingAddress?.landmark}
                onChange={(e) => {
                  const newAddress = { ...formData.shippingAddress };
                  newAddress.landmark = e.target.value;
                  setFormData({
                    ...formData,
                    shippingAddress: newAddress,
                  });
                }}
              />
            </div>
            <div>
              <Label>Pincode*</Label>
              <Input
                type="text"
                name="shippingAddress.pincode"
                value={formData.shippingAddress?.pincode}
                onChange={(e) => {
                  const newAddress = { ...formData.shippingAddress };
                  newAddress.pincode = e.target.value;
                  setFormData({
                    ...formData,
                    shippingAddress: newAddress,
                  });
                }}
              />
            </div>
            <div>
              <Label>Area</Label>
              <Input
                type="text"
                name="shippingAddress.area"
                value={formData.shippingAddress?.area}
                onChange={(e) => {
                  const newAddress = { ...formData.shippingAddress };
                  newAddress.area = e.target.value;
                  setFormData({
                    ...formData,
                    shippingAddress: newAddress,
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Date of Birth</Label>
          <Input
            type="date"
            name="dob"
            value={formData.dob || ""}
            onChange={handleInputChange}
          />
          {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
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
