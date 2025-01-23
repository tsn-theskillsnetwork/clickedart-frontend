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
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/loader";

export default function CustomEnquiryForm() {
  const router = useRouter();
  const { user, photographer, isHydrated } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requestType: "",
    requestDescription: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/customenquiry/create-custom-request`,
        formData
      );
      toast.success("Enquiry submitted successfully");
      console.log("Enquiry submitted successfully", response.data);
      router.back();
    } catch (error) {
      toast.error("Error submitting enquiry");
      console.error("Error submitting enquiry:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.mobile,
      }));
    } else if (photographer) {
      setFormData((prev) => ({
        ...prev,
        name: photographer.firstName + " " + photographer.lastName,
        email: photographer.email,
        phone: photographer.mobile,
      }));
    }
  }, [user, photographer]);

  const requestTypes = [
    { value: "Photography", label: "Photography" },
    { value: "Print", label: "Print" },
    { value: "Both Print and Digital", label: "Both Print and Digital" },
    { value: "Others", label: "Others" },
  ];

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 my-10">
      <h1 className="text-4xl font-bold text-center">Custom Enquiry Form</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mx-auto mt-10 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="requestType">Request Type</Label>
          <Select
            id="requestType"
            options={requestTypes}
            value={requestTypes.find(
              (option) => option.value === formData.requestType
            )}
            onChange={(option) =>
              setFormData((prev) => ({
                ...prev,
                requestType: option.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="requestDescription">Request Description</Label>
          <Textarea
            id="requestDescription"
            value={formData.requestDescription}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                requestDescription: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
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
