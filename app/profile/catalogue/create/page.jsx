"use client";

import useAuthStore from "@/authStore";
import Button2 from "@/components/button2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function CatalogueCreatePage() {
  const { photographer, token } = useAuthStore();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [catalogue, setCatalogue] = useState({
    name: "",
    description: "",
    photographer: undefined,
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCatalogue({ ...catalogue, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/create-catalogue`,
        catalogue,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setMessage("Catalogue created successfully!");
      setError("");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "An error occurred.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  //console.log("catalogue", catalogue);

  useEffect(() => {
    setCatalogue({ ...catalogue, photographer: photographer?._id });
  }, [photographer]);

  return (
    <div className="flex flex-col items-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 gap-10 py-20">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-1/2 gap-4 px-5"
      >
        <h2 className="text-heading-04 font-medium text-center">
          Create Catalogue
        </h2>

        <div>
          <Label>Name *</Label>
          <Input
            type="text"
            name="name"
            value={catalogue.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label>Description *</Label>
          <Input
            type="text"
            name="description"
            value={catalogue.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mx-auto">
          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="flex flex-col items-center">
          <Button2 type="submit">Create Catalogue</Button2>
        </div>
      </form>
    </div>
  );
}
