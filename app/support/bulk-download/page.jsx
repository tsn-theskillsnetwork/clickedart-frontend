"use client";

import React, { useEffect, useState } from "react";
import useAuthStore from "@/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "react-select";

export default function BulkDownloadForm() {
  const { user, photographer } = useAuthStore();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    userInfo: {
      user: "",
      userType: "",
    },
    orderDetails: {
      orderType: "",
      quantity: "",
      preferredDate: "",
      budget: "",
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
    status: "pending",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const resolutions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.categories);
    };

    fetchCategories();
  }, []);

  const categoriesOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex flex-col px-4">
      <h1 className="text-4xl font-bold text-center">
        Bulk Download Enquiry Form
      </h1>
      <p className="text-center text-lg mt-2">
        Request for bulk download of images
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-2xl font-semibold">User Information</h2>
          <div className="flex flex-col gap-2">
            <p>{user?.name || photographer?.name || ""}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="capitalize">{user ? "User" : photographer ? "Photographer" : ""}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-2xl font-semibold">Order Details</h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="orderType">Order Type</Label>
            <Input
              type="text"
              id="orderType"
              name="orderType"
              value={formData.orderDetails.orderType}
              onChange={handleOrderDetailsChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.orderDetails.quantity}
              onChange={handleOrderDetailsChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="preferredDate">Preferred Date</Label>
            <Input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.orderDetails.preferredDate}
              onChange={handleOrderDetailsChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              type="text"
              id="budget"
              name="budget"
              value={formData.orderDetails.budget}
              onChange={handleOrderDetailsChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
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
