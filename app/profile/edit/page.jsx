"use client";
import React, { useRef, useState, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { CameraIcon, ImageIcon, Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuthStore from "@/authStore";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Button from "@/components/button";
import axios from "axios";
import countries from "@/lib/address/countries.json";
import states from "@/lib/address/states.json";
import cities from "@/lib/address/cities.json";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button2 from "@/components/button2";

const ProfileEditPage = () => {
  const { user, token, photographer, setUser, setPhotographer } =
    useAuthStore();

  const router = useRouter();

  const [formData, setFormData] = useState([]);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cropperImage, setCropperImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const cropperRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("102");
  const [selectedState, setSelectedState] = useState("");
  const [editingCover, setEditingCover] = useState(false);

  const handleInputChange = ({ currentTarget: input }) => {
    if (input.name === "interests") {
      const newInterests = input.value.split(",").map((item) => item.trim());
      setFormData({ ...formData, [input.name]: newInterests });
    } else {
      setFormData({ ...formData, [input.name]: input.value });
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/user/get-user-by-id?userId=${user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setFormData(data.user);
        setFormData((prev) => ({
          ...prev,
          userId: data.user._id,
        }));
        //console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectedCountry(formData.shippingAddress?.country);
    setSelectedState(formData.shippingAddress?.state);
  }, [formData]);

  const fetchPhotographerData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/get-photographer-by-id?photographerId=${photographer._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setFormData(data.photographer);
        setFormData((prev) => ({
          ...prev,
          photographerId: data.photographer._id,
        }));
        //console.log(data);
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
        setCropperImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
          coverImage: data,
        }));
        //console.log("Cover Photo uploaded successfully", data);
      }
    } catch (error) {
      console.log(error);
    }
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

              toast.loading("Uploading image...", {
                id: toastId,
              });
            },
          }
        );

        const data = res.data;

        setCroppedImageUrl(data);
        if (photographer) {
          setFormData((prev) => ({
            ...prev,
            profileImage: data,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            image: data,
          }));
        }
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

    try {
      const toastId = toast.loading("Updating profile...");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/${
          photographer ? "photographer" : "user"
        }/update-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setError("");
        if (photographer) {
          setPhotographer(data.photographer);
        } else {
          setUser(data.user);
        }
        router.push("/profile");
        toast.success("Profile updated successfully!", { id: toastId });
      } else {
        setMessage("");
        setError(data.message);
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (user) fetchUserData();
    if (photographer) fetchPhotographerData();
  }, [user, photographer]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col items-center justify-center group min-h-[80vh] mb-10">
        {photographer ? (
          <>
            <div className="w-full relative">
              <Image
                src={formData.coverImage || "/assets/hero/bg2.jpg"}
                alt="bg1"
                width={1920}
                height={800}
                className="object-cover w-full h-40 lg:h-96"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 ease-in-out">
                <Dialog>
                  <DialogTrigger asChild>
                    <CameraIcon className="w-24 h-24 text-white mx-auto mt-20 lg:mt-40" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Change Cover Photo</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {formData.coverImage && (
                        <Image
                          src={formData.coverImage}
                          alt="Cover Image"
                          width={800}
                          height={600}
                          className="object-contain border-4 border-white"
                        />
                      )}
                      <Input
                        name=""
                        onChange={handleImageUpload}
                        className="h-full w-full cursor-pointer"
                        type="file"
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button2>Save changes</Button2>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="relative flex flex-col items-center -mt-16 lg:-mt-28">
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
                    className="rounded-full object-cover aspect-[1/1] border-4 border-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, profileImage: "" })
                    }
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
          </>
        ) : (
          <>
            <div className="relative flex flex-col items-center mt-2">
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
                    className="rounded-full object-cover aspect-[1/1] border-4 border-white"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
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
          </>
        )}

        {photographer ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full md:w-1/2 px-5 gap-4 mt-5"
          >
            {/* <h2 className="text-heading-04 font-medium text-center">
              Profile Update
            </h2> */}
            <div className="mx-auto">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/profile/change-password");
                }}
              >
                Change Password
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full ">
              <div>
                <Label>
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ""}
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
                  value={formData.lastName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="py-2 my-2 border-y">
              <p className="text-heading-06 font-semibold">Address</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Country*</Label>
                  <Select
                    value={formData.shippingAddress?.country || ""}
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
                  <Input
                    type="text"
                    name="shippingAddress.state"
                    value={formData.shippingAddress?.state || ""}
                    onChange={(e) => {
                      const selectedState = states[2].data.find(
                        (state) => state.name === e.target.value
                      );
                      setSelectedState(selectedState.id);
                      const newAddress = { ...formData.shippingAddress };
                      newAddress.state = e.target.value;
                      setFormData({
                        ...formData,
                        shippingAddress: newAddress,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label>District*</Label>
                  <Input
                    type="text"
                    name="shippingAddress.district"
                    value={formData.shippingAddress?.city || ""}
                    onChange={(e) => {
                      const newAddress = { ...formData.shippingAddress };
                      newAddress.city = e.target.value;
                      setFormData({
                        ...formData,
                        shippingAddress: newAddress,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    type="text"
                    name="shippingAddress.address"
                    value={formData.shippingAddress?.address || ""}
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
                    value={formData.shippingAddress?.landmark || ""}
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
                    value={formData.shippingAddress?.pincode || ""}
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
                    value={formData.shippingAddress?.area || ""}
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
                value={
                  (formData.dob &&
                    new Date(formData.dob).toISOString().split("T")[0]) ||
                  ""
                }
                onChange={handleInputChange}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob}</p>
              )}
            </div>

            <div>
              <Label>Connect Accounts</Label>
              <div className="flex flex-col gap-2">
                {formData.connectedAccounts?.map((account, index) => (
                  <div key={index} className="flex gap-2">
                    <Select
                      className="w-36"
                      defaultValue={account.accountName}
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
                    <Input
                      type="text"
                      name="accountLink"
                      value={account.accountLink || ""}
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
                      connectedAccounts: formData.connectedAccounts.slice(
                        0,
                        -1
                      ),
                    })
                  }
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>

            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col items-center">
              <Button2 type="submit">Update</Button2>
            </div>
          </form>
        ) : user ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full md:w-1/2 px-5 gap-4 mt-5"
          >
            {/* <h2 className="text-heading-04 font-medium text-center">
              User Registration
            </h2> */}
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="mx-auto">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/profile/change-password");
                }}
              >
                Change Password
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full ">
              <div>
                <Label>
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ""}
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
                  value={formData.lastName || ""}
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
                value={formData.email || ""}
                onChange={handleInputChange}
                disabled
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <Label>Mobile</Label>
              <Input
                type="tel"
                name="mobile"
                value={formData.mobile || ""}
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div>
              <Label>WhatsApp</Label>
              <Input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp || ""}
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
                      <SelectValue
                        placeholder="Select Country"
                        value={formData.shippingAddress?.country || ""}
                      />
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
                  <Input
                    type="text"
                    name="shippingAddress.state"
                    value={formData.shippingAddress?.state || ""}
                    onChange={(e) => {
                      const selectedState = states[2].data.find(
                        (state) => state.name === e.target.value
                      );
                      setSelectedState(selectedState.id);
                      const newAddress = { ...formData.shippingAddress };
                      newAddress.state = e.target.value;
                      setFormData({
                        ...formData,
                        shippingAddress: newAddress,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label>District*</Label>
                  <Input
                    type="text"
                    name="shippingAddress.city"
                    value={formData.shippingAddress?.city || ""}
                    onChange={(e) => {
                      const newAddress = { ...formData.shippingAddress };
                      newAddress.city = e.target.value;
                      setFormData({
                        ...formData,
                        shippingAddress: newAddress,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    type="text"
                    name="shippingAddress.address"
                    value={formData.shippingAddress?.address || ""}
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
                    value={formData.shippingAddress?.landmark || ""}
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
                    value={formData.shippingAddress?.pincode || ""}
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
                    value={formData.shippingAddress?.area || ""}
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
                value={
                  (formData.dob &&
                    new Date(formData.dob).toISOString().split("T")[0]) ||
                  ""
                }
                onChange={handleInputChange}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob}</p>
              )}
            </div>

            {/* <div>
              <Label>Interests</Label>
              <Input
                type="text"
                name="interests"
                onChange={(e) => {
                  const newInterests = e.target.value
                    .split(",")
                    .map((item) => item.trim());
                  setFormData({ ...formData, interests: newInterests });
                }}
                placeholder="Comma-separated interests"
              />
              {errors.interests && (
                <p className="text-red-500 text-sm">{errors.interests}</p>
              )}
            </div> */}

            {/* <div>
              <Label>Connect Accounts</Label>
              <div className="flex flex-col gap-2">
                {formData.connectedAccounts?.map((account, index) => (
                  <div key={index} className="flex gap-2">
                    <Select
                      className="w-36"
                      value={account.accountName || ""}
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
                    <Input
                      type="text"
                      name="accountLink"
                      value={account.accountLink || ""}
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
                      connectedAccounts: formData.connectedAccounts.slice(
                        0,
                        -1
                      ),
                    })
                  }
                >
                  <Trash size={16} />
                </button>
              </div>
            </div> */}

            <div className="flex flex-col items-center">
              <Button2 type="submit">Update</Button2>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <p>You are not signed in.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileEditPage;
