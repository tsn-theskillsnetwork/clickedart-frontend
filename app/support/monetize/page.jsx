"use client";

import React, { useEffect, useState } from "react";
import useAuthStore from "@/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import Link from "next/link";

export default function BulkDownloadForm() {
  const router = useRouter();
  const { photographer, isHydrated } = useAuthStore();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    photographer: "",
    t_c: false,
    address: {
      residentialAddress: "",
      state: "",
    },
    panPhoto: "",
    // governmentIdProof: "",
    panNumber: "",
    country: "",
    bankAccountName: "",
    bankName: "",
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.address.residentialAddress) {
      newErrors.address = "Residential Address is required";
    }
    if (!formData.address.state) {
      newErrors.state = "State is required";
    }
    if (!formData.panPhoto) {
      newErrors.panPhoto = "PAN Photo is required";
    }
    // if (!formData.governmentIdProof) {
    //   newErrors.governmentIdProof = "Government ID Proof is required";
    // }
    if (!formData.panNumber) {
      newErrors.panNumber = "PAN Number is required";
    }
    if (!formData.country) {
      newErrors.country = "Country is required";
    }
    if (!formData.bankAccountName) {
      newErrors.bankAccountName = "Bank Account Name is required";
    }
    if (!formData.bankName) {
      newErrors.bankName = "Bank Name is required";
    }
    if (!formData.bankAccNumber) {
      newErrors.bankAccNumber = "Bank Account Number is required";
    }
    if (!formData.ifsc) {
      newErrors.ifsc = "IFSC is required";
    }
    if (!formData.branch) {
      newErrors.branch = "Branch is required";
    }
    if (!formData.passbookOrCancelledCheque) {
      newErrors.passbookOrCancelledCheque =
        "Passbook or Cancelled Cheque is required";
    }
    if (!formData.panNumber) {
      newErrors.panNumber = "PAN Number is required";
    }
    if (formData.isBusinessAccount) {
      if (!formData.businessAccount.businessDetailsInfo.businessName) {
        newErrors.businessName = "Business Name is required";
      }
      if (!formData.businessAccount.businessDetailsInfo.natureOfBusiness) {
        newErrors.natureOfBusiness = "Nature of Business is required";
      }
      if (!formData.businessAccount.businessDetailsInfo.businessAddress) {
        newErrors.businessAddress = "Business Address is required";
      }
      // if (!formData.businessAccount.gstCopy) {
      //   newErrors.gstCopy = "GST Copy is required";
      // }
      if (!formData.businessAccount.firmPan) {
        newErrors.firmPan = "Firm PAN is required";
      }
      // if (!formData.businessAccount.firmGstCertificate) {
      //   newErrors.firmGstCertificate = "Firm GST Certificate is required";
      // }
      // if (!formData.businessAccount.gstNumber) {
      //   newErrors.gstNumber = "GST Number is required";
      // }
      // if (!formData.businessAccount.gstState) {
      //   newErrors.gstState = "GST State is required";
      // }
      // if (!formData.businessAccount.gstType) {
      //   newErrors.gstType = "GST Type is required";
      // }
      // if (!formData.businessAccount.businessAddressProof) {
      //   newErrors.businessAddressProof = "Business Address Proof is required";
      // }
    }
    if (!formData.t_c) {
      newErrors.t_c = "Please agree to the Terms and Conditions";
    }
    return newErrors;
  };

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

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      console.log("errors", errors);
      setErrors(errors);
      return;
    }

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
          <h2 className="text-xl font-medium pt-4">
            Address Details{" "}
            <span className="text-red-600 font-semibold">*</span>
          </h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="address.residentialAddress">
              Residential Address{" "}
              <span className="text-red-600 font-semibold">*</span>
            </Label>
            <Input
              type="text"
              id="address.residentialAddress"
              value={formData.address.residentialAddress}
              name="address.residentialAddress"
              required
              placeholder="Enter Residential Address"
              onChange={handleInputChange}
            />
            {errors.address && (
              <span className="text-red-500">{errors.address}</span>
            )}
          </div>

          <Label htmlFor="address.state">
            State <span className="text-red-600 font-semibold">*</span>
          </Label>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              id="address.state"
              value={formData.address.state}
              name="address.state"
              placeholder="Enter State"
              required
              onChange={handleInputChange}
            />
            {errors.state && (
              <span className="text-red-500">{errors.state}</span>
            )}
          </div>

          {/* Country */}
          <Label htmlFor="country">
            Country <span className="text-red-600 font-semibold">*</span>
          </Label>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              id="country"
              name="country"
              required
              placeholder="Enter Country"
              onChange={handleInputChange}
            />
            {errors.country && (
              <span className="text-red-500">{errors.country}</span>
            )}
          </div>

          {/* Bank Account Details */}
          <h2 className="text-xl font-medium pt-4">
            Bank Account Details{" "}
            <span className="text-red-600 font-semibold">*</span>
          </h2>
          <Label htmlFor="bankAccountName">
            Bank Account Holder Name{" "}
            <span className="text-red-600 font-semibold">*</span>
          </Label>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              id="bankAccountName"
              name="bankAccountName"
              required
              placeholder="Enter Bank Account Name"
              onChange={handleInputChange}
            />
            {errors.bankAccountName && (
              <span className="text-red-500">{errors.bankAccountName}</span>
            )}
          </div>
          <Label htmlFor="bankAccNumber">
            Bank Account Number{" "}
            <span className="text-red-600 font-semibold">*</span>
          </Label>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              id="bankAccNumber"
              required
              name="bankAccNumber"
              placeholder="Enter Bank Account Number"
              onChange={handleInputChange}
            />
            {errors.bankAccNumber && (
              <span className="text-red-500">{errors.bankAccNumber}</span>
            )}
          </div>
          <Label htmlFor="ifsc">
            IFSC <span className="text-red-600 font-semibold">*</span>
          </Label>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              id="ifsc"
              name="ifsc"
              required
              placeholder="Enter IFSC"
              onChange={handleInputChange}
            />
            {errors.ifsc && <span className="text-red-500">{errors.ifsc}</span>}
          </div>
          <Label htmlFor="bankName">
            Bank Name <span className="text-red-600 font-semibold">*</span>
          </Label>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              id="bankName"
              name="bankName"
              required
              placeholder="Enter Bank Name"
              onChange={handleInputChange}
            />
            {errors.bankName && (
              <span className="text-red-500">{errors.bankName}</span>
            )}
          </div>
          <Label htmlFor="branch">
            Branch <span className="text-red-600 font-semibold">*</span>
          </Label>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              id="branch"
              required
              name="branch"
              placeholder="Enter Branch"
              onChange={handleInputChange}
            />
            {errors.branch && (
              <span className="text-red-500">{errors.branch}</span>
            )}
          </div>

          {/* Pan Details */}
          <h2 className="text-xl font-medium pt-4">
            PAN Details <span className="text-red-600 font-semibold">*</span>
          </h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="panNumber">
              PAN Number <span className="text-red-600 font-semibold">*</span>
            </Label>
            <Input
              type="text"
              id="panNumber"
              name="panNumber"
              required
              placeholder="Enter PAN Number"
              onChange={handleInputChange}
            />
            {errors.panNumber && (
              <span className="text-red-500">{errors.panNumber}</span>
            )}
          </div>

          {/* Supporting Documents */}
          <h2 className="text-xl font-medium pt-4">
            Supporting Documents{" "}
            <span className="text-red-600 font-semibold">*</span>
          </h2>
          <Label htmlFor="panPhoto">
            Copy of PAN Card{" "}
            <span className="text-red-600 font-semibold">*</span>
          </Label>
          <span className="text-xs italic font-medium">
            (Required for TDS deduction as per Indian tax laws)
          </span>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Input
                type="file"
                id="panPhoto"
                name="panPhoto"
                required
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
            {errors.panPhoto && (
              <span className="text-red-500">{errors.panPhoto}</span>
            )}
          </div>
          {/* <Label htmlFor="governmentIdProof">
            Copy of Aadhar Card or any Valid Govt. Issued ID{" "}
            <span className="text-red-600 font-semibold">*</span>
          </Label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Input
                type="file"
                id="governmentIdProof"
                required
                name="governmentIdProof"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileSelection}
              />
              {!formData.governmentIdProof && (
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded-md"
                  onClick={() => handleFileUpload("governmentIdProof")}
                >
                  Upload
                </button>
              )}
            </div>
            {errors.governmentIdProof && (
              <span className="text-red-500">{errors.governmentIdProof}</span>
            )}
          </div> */}
          <Label htmlFor="passbookOrCancelledCheque">
            Passbook or Cancelled Cheque{" "}
            <span className="text-red-600 font-semibold">*</span>
          </Label>
          <span className="text-xs italic font-medium">
            (For Bank Account Verification)
          </span>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Input
                type="file"
                id="passbookOrCancelledCheque"
                name="passbookOrCancelledCheque"
                required
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
            {errors.passbookOrCancelledCheque && (
              <span className="text-red-500">
                {errors.passbookOrCancelledCheque}
              </span>
            )}
          </div>

          {/* Switch for Business Account */}
          <div className="flex items-center gap-2">
            <Label htmlFor="isBusinessAccount">Business Account</Label>
            <input
              type="checkbox"
              id="isBusinessAccount"
              name="isBusinessAccount"
              checked={formData.isBusinessAccount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isBusinessAccount: e.target.checked,
                }))
              }
            />
            <span className="font-medium">
              {formData.isBusinessAccount ? "Yes" : "No"}
            </span>
          </div>
          {formData.isBusinessAccount && (
            <div>
              {/* Business Account Section */}
              <h2 className="text-xl font-medium pt-4">
                Business Information{" "}
                <span className="text-red-600 font-semibold">*</span>
              </h2>
              <Label htmlFor="businessAccount.businessDetailsInfo.businessName">
                Business Name{" "}
                <span className="text-red-600 font-semibold">*</span>
              </Label>
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  id="businessAccount.businessDetailsInfo.businessName"
                  name="businessAccount.businessDetailsInfo.businessName"
                  placeholder="Enter Business Name"
                  onChange={handleInputChange}
                />
                {errors.businessName && (
                  <span className="text-red-500">{errors.businessName}</span>
                )}
              </div>
              <Label htmlFor="businessAccount.businessDetailsInfo.natureOfBusiness">
                Nature of Business{" "}
                <span className="text-red-600 font-semibold">*</span>
              </Label>
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  id="businessAccount.businessDetailsInfo.natureOfBusiness"
                  name="businessAccount.businessDetailsInfo.natureOfBusiness"
                  placeholder="Enter Nature of Business"
                  onChange={handleInputChange}
                />
                {errors.natureOfBusiness && (
                  <span className="text-red-500">
                    {errors.natureOfBusiness}
                  </span>
                )}
              </div>
              <Label htmlFor="businessAccount.businessDetailsInfo.businessAddress">
                Business Address{" "}
                <span className="text-red-600 font-semibold">*</span>
              </Label>
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  id="businessAccount.businessDetailsInfo.businessAddress"
                  name="businessAccount.businessDetailsInfo.businessAddress"
                  placeholder="Enter Business Address"
                  onChange={handleInputChange}
                />
                {errors.businessAddress && (
                  <span className="text-red-500">{errors.businessAddress}</span>
                )}
              </div>

              <hr className="mt-4 -mb-2" />
              <h2 className="text-xl font-medium pt-4">GST Details</h2>
              <Label htmlFor="businessAccount.gstNumber">GST Number</Label>
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  id="gstNumber"
                  name="businessAccount.gstNumber"
                  placeholder="Enter GST Number"
                  onChange={handleInputChange}
                />
                {errors.gstNumber && (
                  <span className="text-red-500">{errors.gstNumber}</span>
                )}
              </div>
              <Label htmlFor="businessAccount.gstState">GST State</Label>
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  id="gstState"
                  name="businessAccount.gstState"
                  placeholder="Enter GST State"
                  onChange={handleInputChange}
                />
                {errors.gstState && (
                  <span className="text-red-500">{errors.gstState}</span>
                )}
              </div>

              <Label htmlFor="businessAccount.gstType">GST Type</Label>
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  id="gstType"
                  name="businessAccount.gstType"
                  placeholder="Enter GST Type"
                  onChange={handleInputChange}
                />
                {errors.gstType && (
                  <span className="text-red-500">{errors.gstType}</span>
                )}
              </div>
              <hr className="mt-4 -mb-2" />
              <h2 className="text-xl font-medium pt-4">Documents</h2>
              <Label htmlFor="businessAccount.gstCopy">GST Copy</Label>
              <div className="flex flex-col gap-2">
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
                      onClick={() =>
                        handleFileUpload("businessAccount.gstCopy")
                      }
                    >
                      Upload
                    </button>
                  )}
                </div>
                {errors.gstCopy && (
                  <span className="text-red-500">{errors.gstCopy}</span>
                )}
              </div>

              <Label htmlFor="businessAccount.firmPan">
                Firm PAN <span className="text-red-600 font-semibold">*</span>
              </Label>
              <div className="flex flex-col gap-2">
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
                      onClick={() =>
                        handleFileUpload("businessAccount.firmPan")
                      }
                    >
                      Upload
                    </button>
                  )}
                </div>
                {errors.firmPan && (
                  <span className="text-red-500">{errors.firmPan}</span>
                )}
              </div>
              <Label htmlFor="businessAccount.firmGstCertificate">
                Firm GST Certificate
              </Label>
              <div className="flex flex-col gap-2">
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
                {errors.firmGstCertificate && (
                  <span className="text-red-500">
                    {errors.firmGstCertificate}
                  </span>
                )}
              </div>

              <Label htmlFor="businessAccount.businessAddressProof">
                Business Address Proof
              </Label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    id="businessAddressProof"
                    name="businessAccount.businessAddressProof"
                    accept=".pdf, .jpg, .jpeg, .png"
                    onChange={handleFileSelection}
                  />
                  {!formData.businessAccount.businessAddressProof && (
                    <button
                      type="button"
                      className="bg-blue-500 text-white p-2 rounded-md"
                      onClick={() =>
                        handleFileUpload("businessAccount.businessAddressProof")
                      }
                    >
                      Upload
                    </button>
                  )}
                </div>
                {errors.businessAddressProof && (
                  <span className="text-red-500">
                    {errors.businessAddressProof}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="t_c"
              name="t_c"
              checked={formData.t_c}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  t_c: e.target.checked,
                }))
              }
            />
            <Label htmlFor="t_c">
              I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
              >
                Terms and Conditions
              </Link>{" "}
              <span className="text-red-600 font-semibold">*</span>
            </Label>
          </div>
          {errors.t_c && <span className="text-red-500">{errors.t_c}</span>}

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
