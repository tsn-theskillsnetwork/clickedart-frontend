"use client";
import React, { useRef, useState, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Plus, Trash } from "lucide-react";
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

const ProfileEditPage = () => {
  const user = useAuthStore((state) => state.user);
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    connectedAccounts: [
      {
        accountName: "",
        accountLink: "",
      },
    ],
    address: "",
    age: "",
    dob: "",
    image: "",
    bio: "",
    interests: [],
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cropperImage, setCropperImage] = useState(null); 
  const [croppedImageUrl, setCroppedImageUrl] = useState(null); 
  const cropperRef = useRef(null);

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
        setFormData({
          userId: data.user._id,
          name: data.user.name,
          email: data.user.email,
          connectedAccounts: data.user.connectedAccounts,
          address: data.user.address,
          age: data.user.age,
          dob: new Date(data.user.dob).toISOString().split("T")[0],
          image: data.user.image,
          bio: data.user.bio,
          interests: data.user.interests,
        });
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
        const res = await fetch(
          "http://localhost:5000/api/upload/uploadSingleImage",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.text(); 

        if (res.ok) {
          setCroppedImageUrl(data); 
          setFormData((prev) => ({
            ...prev,
            image: data, 
          }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const toastId = toast.loading("Updating profile...");

      const res = await fetch(`http://localhost:5000/api/user/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setError("");
        setUser(data.user);
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
    if (isSignedIn) fetchUserData();
  }, [isSignedIn]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {user ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] mt-5 mb-10">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full md:w-1/2 px-5 gap-4"
          >
            <h2 className="text-heading-04 font-medium text-center">
              Edit Profile
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
                value={formData.name || ""}
                onChange={handleInputChange}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
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
                      value={account.accountName || ""}
                      placeholder="Account Name"
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

            {/* <div>
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
                  </div> */}

            <div>
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                value={formData.address || ""}
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
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob}</p>
              )}
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
              ></Textarea>
            </div>

            <div>
              <Label>Interests</Label>
              <Input
                type="text"
                name="interests"
                value={formData.interests.join(", ")} // Join array to display as comma-separated string
                onChange={handleInputChange}
                placeholder="Comma-separated interests"
              />
              {errors.interests && (
                <p className="text-red-500 text-sm">{errors.interests}</p>
              )}
            </div>

            <div className="flex flex-col items-center">
              <button type="submit">Update</button>
            </div>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p>You are not signed in.</p>
        </div>
      )}
    </>
  );
};

export default ProfileEditPage;
