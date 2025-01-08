"use client";
import React, { useRef, useState, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ImageIcon, Plus, Trash } from "lucide-react";
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

const ProfileEditPage = () => {
  const { user, token, photographer, setUser, setPhotographer } = useAuthStore();

  const router = useRouter();

  const [formData, setFormData] = useState([]);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cropperImage, setCropperImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const cropperRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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
        `http://localhost:5000/api/user/get-user-by-id?userId=${user._id}`,
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
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPhotographerData = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/photographer/get-photographer-by-id?photographerId=${photographer._id}`,
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
        console.log(data);
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
          "http://localhost:5000/api/upload/uploadSingleImage",
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
        `http://localhost:5000/api/${
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
      <div className="flex flex-col items-center justify-center min-h-[80vh] mt-5 mb-10">
        {photographer ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full md:w-1/2 px-5 gap-4"
          >
            <h2 className="text-heading-04 font-medium text-center">
              Profile Update
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

            <div>
              <Label>Bio</Label>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>

            <div className="py-2 my-2 border-y">
              <p className="text-heading-06 font-semibold">Shipping Address</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Label>City</Label>
                  <Input
                    type="text"
                    name="shippingAddress.city"
                    value={formData.shippingAddress?.city}
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
                  <Label>State</Label>
                  <Input
                    type="text"
                    name="shippingAddress.state"
                    value={formData.shippingAddress?.state}
                    onChange={(e) => {
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
                  <Label>Country</Label>
                  <Input
                    type="text"
                    name="shippingAddress.country"
                    value={formData.shippingAddress?.country}
                    onChange={(e) => {
                      const newAddress = { ...formData.shippingAddress };
                      newAddress.country = e.target.value;
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
                  <Label>Pincode</Label>
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
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="shippingAddress.email"
                    value={formData.shippingAddress?.email}
                    onChange={(e) => {
                      const newAddress = { ...formData.shippingAddress };
                      newAddress.email = e.target.value;
                      setFormData({
                        ...formData,
                        shippingAddress: newAddress,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input
                    type="tel"
                    name="shippingAddress.mobile"
                    value={formData.shippingAddress?.mobile}
                    onChange={(e) => {
                      const newAddress = { ...formData.shippingAddress };
                      newAddress.mobile = e.target.value;
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
                value={formData.dob}
                onChange={handleInputChange}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob}</p>
              )}
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
                value={formData.photographyStyles?.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    photographyStyles: e.target.value
                      .split(",")
                      .map((s) => s.trim()),
                  })
                }
              />
              {errors.photographyStyles && (
                <p className="text-red-500 text-sm">
                  {errors.photographyStyles}
                </p>
              )}
            </div>

            <div>
              <Label>Awards</Label>
              <Input
                type="text"
                name="awards"
                value={formData.awards?.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    awards: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
            </div>

            <div>
              <Label>Achivements</Label>
              <Input
                type="text"
                name="achivements"
                value={formData.achivements?.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    achivements: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
            </div>

            <div>
              <Label>Certifications</Label>
              <Input
                type="text"
                name="certifications"
                value={formData.certifications?.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    certifications: e.target.value
                      .split(",")
                      .map((s) => s.trim()),
                  })
                }
              />
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
                <p className="text-red-500 text-sm">
                  {errors.yearsOfExperience}
                </p>
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

            <Button type="submit" variant="primary" fullWidth>
              Update Profile
            </Button>
          </form>
        ) : user ? (
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
              <p className="text-heading-06 font-semibold">Shipping Address</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Label>City</Label>
                  <Input
                    type="text"
                    name="shippingAddress.city"
                    value={formData.shippingAddress?.city}
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
                  <Label>State</Label>
                  <Input
                    type="text"
                    name="shippingAddress.state"
                    value={formData.shippingAddress?.state}
                    onChange={(e) => {
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
                  <Label>Country</Label>
                  <Input
                    type="text"
                    name="shippingAddress.country"
                    value={formData.shippingAddress?.country}
                    onChange={(e) => {
                      const newAddress = { ...formData.shippingAddress };
                      newAddress.country = e.target.value;
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
                  <Label>Pincode</Label>
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
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="shippingAddress.email"
                    value={formData.shippingAddress?.email}
                    onChange={(e) => {
                      const newAddress = { ...formData.shippingAddress };
                      newAddress.email = e.target.value;
                      setFormData({
                        ...formData,
                        shippingAddress: newAddress,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input
                    type="tel"
                    name="shippingAddress.mobile"
                    value={formData.shippingAddress?.mobile}
                    onChange={(e) => {
                      const newAddress = { ...formData.shippingAddress };
                      newAddress.mobile = e.target.value;
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
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob}</p>
              )}
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

            <div className="flex flex-col items-center">
              <Button type="submit">Register</Button>
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
