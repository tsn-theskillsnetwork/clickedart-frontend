"use client";

import React, { useEffect, useState } from "react";
import useAuthStore from "@/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import axios from "axios";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BulkDownloadForm() {
  const router = useRouter();
  const { user, photographer } = useAuthStore();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    userInfo: {
      user: "",
      userType: "",
    },
    orderDetails: {
      orderType: "",
      quantity: undefined,
      preferredDate: "",
      budget: undefined,
    },
    enquiryDetails: {
      imageSpecifications: {
        resolutions: [],
        categories: [],
      },
      mediaTypePreference: {
        paperTypes: [],
        frameTypes: [],
        frameColors: [],
        packingPreferences: "",
        deliveryMethod: "",
      },
    },
  });

  // State for checking hydration status
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      userInfo: {
        ...prev.userInfo,
        [name]: value,
      },
    }));
  };

  const handleOrderDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      orderDetails: {
        ...prev.orderDetails,
        [name]: value,
      },
    }));
  };

  const handleEnquiryDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      enquiryDetails: {
        ...prev.enquiryDetails,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/bulkenquiry/create-enquiry`,
        formData
      );
      toast.success("Enquiry submitted successfully");
      //console.log("Enquiry submitted successfully", response.data);
      router.back();
    } catch (error) {
      toast.error("Error submitting enquiry");
      console.error("Error submitting enquiry:", error);
    }
  };

  const resolutions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/category/get`
      );
      const data = response.data;
      setCategories(data.categories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userInfo: {
          user: user._id,
          userType: "User",
        },
      }));
    } else if (photographer) {
      setFormData((prev) => ({
        ...prev,
        userInfo: {
          user: photographer._id,
          userType: "Photographer",
        },
      }));
    }
  }, [user, photographer]);

  const categoriesOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex flex-col px-4 my-10">
      <h1 className="text-4xl font-bold text-center">
        Bulk Download Enquiry Form
      </h1>
      <p className="text-center text-lg mt-2">
        Request for bulk download of images
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-10">
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-2xl font-semibold">User Information</h2>
          <div className="flex flex-col gap-2">
            <p>
              {user
                ? user?.firstName + " " + user?.lastName
                : photographer
                ? photographer?.firstName + " " + photographer?.lastName
                : ""}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="capitalize">
              {user ? "User" : photographer ? "Photographer" : ""}
            </p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Order Details</h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="orderType">Order Type*</Label>
            <Select
              options={[
                { value: "Print", label: "Print" },
                { value: "Digital", label: "Digital" },
                { value: "Both", label: "Both" },
              ]}
              required
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  orderDetails: {
                    ...prev.orderDetails,
                    orderType: selected.value,
                  },
                }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">Quantity*</Label>
            <Input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Enter quantity"
              required
              value={formData.orderDetails.quantity || ""}
              onChange={handleOrderDetailsChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="preferredDate">Preferred Date*</Label>
            <DatePicker
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholderText="Select a date"
              selected={formData.orderDetails.preferredDate}
              onChange={(date) => {
                setFormData((prev) => ({
                  ...prev,
                  orderDetails: {
                    ...prev.orderDetails,
                    preferredDate: date,
                  },
                }));
              }}
              dateFormat="MMMM d, yyyy"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              type="number"
              id="budget"
              name="budget"
              value={formData.orderDetails.budget || ""}
              onChange={handleOrderDetailsChange}
            />
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Enquiry Details</h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="resolutions">Resolutions</Label>
            <Select
              options={resolutions}
              isMulti
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  enquiryDetails: {
                    ...prev.enquiryDetails,
                    imageSpecifications: {
                      ...prev.enquiryDetails.imageSpecifications,
                      resolutions: selected.map((option) => option.value),
                    },
                  },
                }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="categories">Categories</Label>
            <Select
              options={categoriesOptions}
              isMulti
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  enquiryDetails: {
                    ...prev.enquiryDetails,
                    imageSpecifications: {
                      ...prev.enquiryDetails.imageSpecifications,
                      categories: selected.map((option) => option.value),
                    },
                  },
                }));
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="paperTypes">Paper Types</Label>
            <Input
              type="text"
              id="paperTypes"
              name="paperTypes"
              placeholder="(comma separated)"
              value={formData.enquiryDetails.mediaTypePreference.paperTypes.join(
                ", "
              )}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  enquiryDetails: {
                    ...prev.enquiryDetails,
                    mediaTypePreference: {
                      ...prev.enquiryDetails.mediaTypePreference,
                      paperTypes: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    },
                  },
                }));
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="frameTypes">Frame Types</Label>
            <Input
              type="text"
              id="frameTypes"
              name="frameTypes"
              placeholder="(comma separated)"
              value={formData.enquiryDetails.mediaTypePreference.frameTypes.join(
                ", "
              )}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  enquiryDetails: {
                    ...prev.enquiryDetails,
                    mediaTypePreference: {
                      ...prev.enquiryDetails.mediaTypePreference,
                      frameTypes: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    },
                  },
                }));
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="frameColors">Frame Colors</Label>
            <Input
              type="text"
              id="frameColors"
              name="frameColors"
              placeholder="Black, White, etc"
              value={formData.enquiryDetails.mediaTypePreference.frameColors.join(
                ", "
              )}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  enquiryDetails: {
                    ...prev.enquiryDetails,
                    mediaTypePreference: {
                      ...prev.enquiryDetails.mediaTypePreference,
                      frameColors: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    },
                  },
                }));
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="packingPreferences">Packing Preferences</Label>
            <Input
              type="text"
              id="packingPreferences"
              name="packingPreferences"
              placeholder="Enter packing preference"
              value={
                formData.enquiryDetails.mediaTypePreference.packingPreferences
              }
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  enquiryDetails: {
                    ...prev.enquiryDetails,
                    mediaTypePreference: {
                      ...prev.enquiryDetails.mediaTypePreference,
                      packingPreferences: e.target.value,
                    },
                  },
                }));
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="deliveryMethod">Delivery Method</Label>
            <Input
              type="text"
              id="deliveryMethod"
              name="deliveryMethod"
              placeholder="Enter delivery method"
              value={formData.enquiryDetails.mediaTypePreference.deliveryMethod}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  enquiryDetails: {
                    ...prev.enquiryDetails,
                    mediaTypePreference: {
                      ...prev.enquiryDetails.mediaTypePreference,
                      deliveryMethod: e.target.value,
                    },
                  },
                }));
              }}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
