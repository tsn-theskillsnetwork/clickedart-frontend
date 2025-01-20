"use client";

import React, { useEffect, useState } from "react";
import useAuthStore from "@/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function BulkDownloadForm() {
  const router = useRouter();
  const { photographer, isHydrated } = useAuthStore();

  const [formData, setFormData] = useState({
    photographer: "",
    address: {
      residentialAddress: "",
      state: "",
    },
    panPhoto: "",
    panNumber: "",
    country: "",
    bankAccountName: "",
    bankAccNumber: "",
    ifsc: "",
    branch: "",
    passbookOrCancelledCheque: "",
    isBusinessAccount: false,
    businessAccount: {
      businessDetailsInfo: {
        businessName: "",
        natureOfBusiness: "",
        businessAddress: "",
      },
      gstCopy: "",
      firmPan: "",
      firmPanPhoto: "",
      firmGstCertificate: "",
      gstNumber: "",
      gstState: "",
      gstType: "",
      businessAddressProof: "",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  console.log("formData", formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    const updateNestedField = (path, value, obj) => {
      const fields = path.split(".");
      const field = fields.shift();
  
      if (fields.length === 0) {
        return { ...obj, [field]: value };
      }
  
      return {
        ...obj,
        [field]: updateNestedField(fields.join("."), value, obj[field] || {}),
      };
    };
  
    setFormData((prev) => updateNestedField(name, value, prev));
  };
  

  const handleFileSelection = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    setSelectedFiles((prev) => ({
      ...prev,
      [name]: file,
    }));

    // Reset uploaded URL for this field to make the button reappear
    if (name.startsWith("businessAccount.")) {
      const businessField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        businessAccount: {
          ...prev.businessAccount,
          [businessField]: "",
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileUpload = async (fieldName) => {
    const file = selectedFiles[fieldName];

    if (!file) {
      toast.error("No file selected for upload!");
      return;
    }

    const toastId = toast.loading("Uploading...");
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/upload/uploadSingleImage`,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              [fieldName]: percentCompleted,
            }));
            toast.loading(`Uploading... ${percentCompleted}%`, {
              id: toastId,
            });
          },
        }
      );

      const data = res.data;

      // Update formData with the uploaded file URL
      if (fieldName.startsWith("businessAccount.")) {
        const businessField = fieldName.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          businessAccount: {
            ...prev.businessAccount,
            [businessField]: data,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: data,
        }));
      }

      // Clear the selected file
      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });

      toast.success("File uploaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("File upload failed.", { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/monetization/create-monetization`,
        formData
      );
      toast.success("Form submitted successfully");
      console.log("Form submitted successfully", response.data);
      router.push("/profile");
    } catch (error) {
      toast.error("Error submitting enquiry");
      console.error("Error submitting enquiry:", error);
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      photographerId: photographer?._id,
    });
  }, [photographer]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-semibold text-center">
          You need to be logged in to access this page
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 my-10">
      <h1 className="text-4xl font-bold text-center">Monetization Form</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-10">
        <div className="flex flex-col space-y-4">
          {/* Personal Details Section */}
          <h2 className="text-xl font-medium pt-4">Personal Information</h2>
          <Label htmlFor="fullName">Full Name</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              id="photographer"
              name="photographer"
              value={
                `${photographer?.firstName} ${photographer?.lastName}` || ""
              }
              disabled
            />
          </div>
          <Label htmlFor="dob">Date of Birth</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              id="dob"
              name="dob"
              value={photographer?.dob ? photographer.dob.split("T")[0] : ""}
              disabled
            />
          </div>
          <Label htmlFor="mobile">Contact Number</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              id="mobile"
              name="mobile"
              value={photographer?.mobile || ""}
              disabled
            />
          </div>
          <Label htmlFor="email">Email</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              id="email"
              name="email"
              value={photographer?.email || ""}
              disabled
            />
          </div>
          <h2 className="text-xl font-medium pt-4">Address Details</h2>
          <Label htmlFor="address.residentialAddress">Residential Address</Label>
          <Input
            type="text"
            id="address.residentialAddress"
            value={formData.address.residentialAddress}
            name="address.residentialAddress"
            placeholder="Enter Residential Address"
            onChange={handleInputChange}
          />
          <Label htmlFor="address.state">State</Label>
          <Input
            type="text"
            id="address.state"
            value={formData.address.state}
            name="address.state"
            placeholder="Enter State"
            onChange={handleInputChange}
          />
          {/* PAN Photo */}
          <Label htmlFor="panPhoto">PAN Photo</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="file"
              id="panPhoto"
              name="panPhoto"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileSelection}
            />
            {!formData.panPhoto && (
              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={() => handleFileUpload("panPhoto")}
              >
                Upload
              </button>
            )}
          </div>

          {/* PAN Number */}
          <Label htmlFor="panNumber">PAN Number</Label>
          <Input
            type="text"
            id="panNumber"
            name="panNumber"
            placeholder="Enter PAN Number"
            onChange={handleInputChange}
          />

          {/* Country */}
          <Label htmlFor="country">Country</Label>
          <Input
            type="text"
            id="country"
            name="country"
            placeholder="Enter Country"
            onChange={handleInputChange}
          />

          {/* Bank Account Details */}
          <Label htmlFor="bankAccNumber">Bank Account Number</Label>
          <Input
            type="text"
            id="bankAccNumber"
            name="bankAccNumber"
            placeholder="Enter Bank Account Number"
            onChange={handleInputChange}
          />

          <Label htmlFor="ifsc">IFSC</Label>
          <Input
            type="text"
            id="ifsc"
            name="ifsc"
            placeholder="Enter IFSC"
            onChange={handleInputChange}
          />

          <Label htmlFor="branch">Branch</Label>
          <Input
            type="text"
            id="branch"
            name="branch"
            placeholder="Enter Branch"
            onChange={handleInputChange}
          />

          <Label htmlFor="passbookOrCancelledCheque">
            Passbook or Cancelled Cheque
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              type="file"
              id="passbookOrCancelledCheque"
              name="passbookOrCancelledCheque"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileSelection}
            />
            {!formData.passbookOrCancelledCheque && (
              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={() => handleFileUpload("passbookOrCancelledCheque")}
              >
                Upload
              </button>
            )}
          </div>
          {/* Business Account Section */}
          <h2 className="text-xl font-medium pt-4">
            Business Account (Optional)
          </h2>
          <Label htmlFor="businessAccount.gstCopy">GST Copy</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="file"
              id="gstCopy"
              name="businessAccount.gstCopy"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileSelection}
            />
            {!formData.businessAccount.gstCopy && (
              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={() => handleFileUpload("businessAccount.gstCopy")}
              >
                Upload
              </button>
            )}
          </div>

          <Label htmlFor="businessAccount.firmPan">Firm PAN</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="file"
              id="firmPan"
              name="businessAccount.firmPan"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileSelection}
            />
            {!formData.businessAccount.firmPan && (
              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={() => handleFileUpload("businessAccount.firmPan")}
              >
                Upload
              </button>
            )}
          </div>
          <Label htmlFor="businessAccount.firmGstCertificate">
            Firm GST Certificate
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              type="file"
              id="firmGstCertificate"
              name="businessAccount.firmGstCertificate"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileSelection}
            />
            {!formData.businessAccount.firmGstCertificate && (
              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={() =>
                  handleFileUpload("businessAccount.firmGstCertificate")
                }
              >
                Upload
              </button>
            )}
          </div>

          <Label htmlFor="businessAccount.gstNumber">GST Number</Label>
          <Input
            type="text"
            id="gstNumber"
            name="businessAccount.gstNumber"
            placeholder="Enter GST Number"
            onChange={handleInputChange}
          />

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
