"use client";

import React, { useRef, useState, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed, ImageIcon, Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NextImage from "next/image";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import countries from "@/lib/address/countries.json";
import states from "@/lib/address/states.json";
import cities from "@/lib/address/cities.json";
import useAuthStore from "@/authStore";
import Loader from "@/components/loader";
import SpinLoader from "@/components/spinLoader";

const RegistrationForm = () => {
  const router = useRouter();

  const { isHydrated, user, photographer } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
    bio: "",
    mobile: "",
    whatsapp: "",
    shippingAddress: {
      address: "",
      city: "",
      state: "",
      country: "India",
      landmark: "",
      pincode: "",
      area: "",
    },
    expertise: [],
    awards: [],
    achivements: [],
    profileImage: "",
    username: "",
    portfolioLink: "",
    photographyStyles: [],
    yearsOfExperience: undefined,
    photosCount: undefined,
    accountType: "freelance",
    isCompany: false,
    companyName: "",
    companyEmail: "",
    companyAddress: "",
    referralcode: "",
    bestPhotos: [],
    companyPhone: "",
    companyAddress: "",
    certifications: [],
    connectedAccounts: [
      {
        accountName: "",
        accountLink: "",
      },
    ],
    bestPhotos: ["", "", ""],
  });
  const [verifyPassword, setVerifyPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cropperImage, setCropperImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const cropperRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("102");
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value ?? "" });
  };

  const checkUsernameAndEmailExists = async () => {
    const serverErrors = {};
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/checkUsernameAndEmailExists`,
        { username: formData.username, email: formData.email },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      if (data.usernameExists)
        serverErrors.username = "Username already exists.";
      if (data.emailExists) serverErrors.email = "Email already exists.";
    } catch (err) {
      if (err.response?.status === 409) {
        const data = err.response.data;
        if (data.usernameExists) {
          serverErrors.username = "Username already exists.";
          toast.error("Username already exists.");
        }
        if (data.emailExists) {
          serverErrors.email = "Email already exists.";
          toast.error("Email already exists.");
        }
      } else {
        console.error("Error checking username/email:", err);
        toast.error("An error occurred. Please try again.");
      }
    }

    return serverErrors;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Detect HEIC file by extension as a fallback
        const fileExtension = file.name.split(".").pop().toLowerCase();
        const isHEIC =
          file.type === "image/heic" ||
          file.type === "image/heif" ||
          fileExtension === "heic" ||
          fileExtension === "heif";

        if (isHEIC) {
          toast.loading("Processing...");
          const heic2any = (await import("heic2any")).default;

          try {
            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
            });
            const newFile = new File(
              [convertedBlob],
              `${file.name.split(".")[0]}.jpeg`,
              {
                type: "image/jpeg",
              }
            );
            // Use the new JPEG file for cropping
            const reader = new FileReader();
            reader.onload = () => {
              setCropperImage(reader.result);
            };
            reader.readAsDataURL(newFile);
            toast.dismiss();
          } catch (conversionError) {
            console.error("HEIC conversion failed:", conversionError);
            toast.error(
              "HEIC conversion failed. Please use a supported image format."
            );
          }
        } else {
          // If not HEIC, proceed with normal file
          const reader = new FileReader();
          reader.onload = () => {
            setCropperImage(reader.result);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error("Error handling image:", error);
      }
    }
  };

  const validateForm1 = () => {
    const newErrors = {};
    if (!formData.profileImage)
      newErrors.profileImage = "Profile Image is required.";

    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required.";
    else if (formData.firstName.trim().length < 3)
      newErrors.firstName = "First Name must be at least 3 characters.";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last Name is required.";
    else if (formData.lastName.length < 3)
      newErrors.lastName = "Last Name must be at least 3 characters.";

    if (!formData.username.trim()) newErrors.username = "Username is required.";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters.";
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username))
      newErrors.username =
        "Username can only contain letters, numbers, and underscores.";

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format.";

    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain at least 8 characters, including one uppercase, one lowercase, one number, and one special character.";
    }
    if (formData.password !== verifyPassword)
      newErrors.verifyPassword = "Passwords do not match.";

    if (!formData.mobile.trim())
      newErrors.mobile = "Mobile number is required.";
    else if (!/^\d+$/.test(formData.mobile))
      newErrors.mobile = "Invalid mobile number format.";
    else if (formData.mobile.length !== 10)
      newErrors.mobile = "Mobile number must be 10 digits.";

    if (formData.whatsapp && !/^\d+$/.test(formData.whatsapp))
      newErrors.whatsapp = "Invalid WhatsApp number format.";

    if (formData.bio.length > 100)
      newErrors.bio = "Bio must be less than 100 characters.";

    if (!formData.shippingAddress.country)
      newErrors.country = "Country is required.";

    if (!formData.shippingAddress.state) newErrors.state = "State is required.";

    if (!formData.shippingAddress.city) newErrors.city = "City is required.";

    if (!formData.shippingAddress.pincode)
      newErrors.pincode = "Pincode is required.";
    else if (!/^\d+$/.test(formData.shippingAddress.pincode))
      newErrors.pincode = "Invalid pincode format.";

    if (!formData.dob) newErrors.dob = "Date of Birth is required.";

    if (formData.connectedAccounts.length === 0)
      newErrors.connectedAccounts =
        "At least one social media account is required.";
    else if (
      formData.connectedAccounts.length === 1 &&
      formData.connectedAccounts[0].accountName === "" &&
      formData.connectedAccounts[0].accountLink === ""
    )
      newErrors.connectedAccounts =
        "At least one social media account is required.";
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

              toast.loading("Uploading image...", {
                id: toastId,
              });
            },
          }
        );

        const data = res.data;

        setCroppedImageUrl(data);
        setFormData((prev) => ({
          ...prev,
          profileImage: data,
        }));
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
  console.log(loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate client-side fields
    const formErrors = validateForm1();

    // Check server for existing username/email
    const serverErrors = await checkUsernameAndEmailExists();
    const combinedErrors = { ...formErrors, ...serverErrors };

    if (Object.keys(combinedErrors).length > 0) {
      console.log("worked", combinedErrors);
      setLoading(false);
      setErrors(combinedErrors);
      toast.error("Please fill the required fields before submitting.");
      return;
    }

    setErrors({});
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      setMessage(data.message);
      setError("");
      router.push("/verify?type=photographer&email=" + formData.email);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
            "Something went wrong. Please try again later."
        );
      } else {
        setError("Something went wrong. Please try again later.");
      }
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;

    if ((user || photographer) && !toastShownRef.current) {
      toastShownRef.current = true;
      router.push("/");
    }
  }, [isHydrated, user, router]);

  return (
    <div className="flex flex-col items-center  min-h-[80vh] mt-5 mb-10">
      {user || photographer || !isHydrated ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full md:w-1/2 px-5 gap-4"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-heading-04 font-medium text-center">
              Photographer Registration
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
                  <NextImage
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
                      <div
                        className={`relative h-48 rounded-lg border-2 ${
                          errors.profileImage
                            ? "border-red-500 bg-red-50"
                            : "border-blue-500 bg-gray-50"
                        } flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out`}
                      >
                        <div className="absolute flex flex-col items-center">
                          <ImageIcon className="w-12 h-12 text-blue-500" />
                          <span className="block text-gray-500 font-semibold">
                            Drag &amp; drop your Image
                          </span>
                          <span className="block text-gray-400 font-normal mt-1">
                            or click to upload
                          </span>
                          {errors.profileImage && (
                            <p className="text-red-500 text-sm">
                              {errors.profileImage}
                            </p>
                          )}
                        </div>
                        <input
                          name=""
                          onChange={handleImageChange}
                          className="h-full w-full opacity-0 cursor-pointer"
                          type="file"
                          accept="image/*, image/heic, image/heif"
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
                  Save Image
                </button>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div>
                <progress value={uploadProgress} max={100}></progress>
                <span>{uploadProgress}%</span>
              </div>
            )}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full ">
                <div>
                  <Label>
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    placeholder="First Name"
                    onChange={handleInputChange}
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
                    placeholder="Last Name"
                    value={formData.lastName || ""}
                    onChange={handleInputChange}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
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
                    autoComplete="email"
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="new-password"
                    value={formData.password || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    autoComplete="new-password"
                    placeholder="At least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
                  />

                  {showPassword ? (
                    <EyeClosed
                      size={16}
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  ) : (
                    <Eye
                      size={16}
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div>
                <Label>
                  Verify Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="new-password"
                  value={verifyPassword || ""}
                  autoComplete="new-password"
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  placeholder="Verify Password"
                />
                {errors.verifyPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.verifyPassword}
                  </p>
                )}
              </div>

              <Label>
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username || ""}
                autoComplete="username"
                onChange={handleInputChange}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
            <div>
              <Label>Account Type</Label>
              <Select
                value={formData.accountType || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, accountType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>
                Mobile <span className="text-red-500">*</span>
              </Label>
              <Input
                type="tel"
                name="mobile"
                value={formData.mobile || ""}
                onChange={handleInputChange}
                placeholder="Mobile Number"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
            </div>

            <div>
              <Label>WhatsApp</Label>
              <Input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp || ""}
                onChange={handleInputChange}
                placeholder="WhatsApp Number"
              />
            </div>
            {errors.whatsapp && (
              <p className="text-red-500 text-sm">{errors.whatsapp}</p>
            )}

            <div>
              <Label>Bio (Max Length: 100 Words)</Label>
              <Textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
              />
              <p
                className={`${
                  formData.bio.length > 100 && "text-red-600 font-medium"
                } text-sm`}
              >
                {formData.bio.length} / 100
              </p>
            </div>
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}

            <div className="py-2 my-2 border-y">
              <p className="text-heading-06 font-semibold">Address</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Country<span className="text-red-500">*</span>
                  </Label>
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
                        <SelectItem key={country.id} value={country.name || ""}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.country && (
                    <p className="text-red-500 text-sm">{errors.country}</p>
                  )}
                </div>
                <div>
                  <Label>
                    State<span className="text-red-500">*</span>
                  </Label>
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
                          <SelectItem key={state.id} value={state.name || ""}>
                            {state.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-red-500 text-sm">{errors.state}</p>
                  )}
                </div>
                <div>
                  <Label>
                    District<span className="text-red-500">*</span>
                  </Label>
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
                          <SelectItem key={city.id} value={city.name || ""}>
                            {city.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-red-500 text-sm">{errors.city}</p>
                  )}
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
                  <Label>
                    Pincode<span className="text-red-500">*</span>
                  </Label>
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
                  {errors.pincode && (
                    <p className="text-red-500 text-sm">{errors.pincode}</p>
                  )}
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

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Label>
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                label="Date of Birth"
                maxDate={dayjs(Date.now())}
                onChange={(value) => setFormData({ ...formData, dob: value })}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob}</p>
              )}
            </LocalizationProvider>

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
                    value={formData.companyName || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label>Company Email</Label>
                  <Input
                    type="email"
                    name="companyEmail"
                    value={formData.companyEmail || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label>Company Address</Label>
                  <Input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label>Company Phone</Label>
                  <Input
                    type="tel"
                    name="companyPhone"
                    value={formData.companyPhone || ""}
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
                placeholder="https://example.com"
                value={formData.portfolioLink || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Photography Styles</Label>
              <Input
                type="text"
                name="photographyStyles"
                placeholder="e.g. Portrait, Landscape, etc."
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
                placeholder="e.g. Best Photographer 2024, etc."
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
                placeholder="e.g. Best Photographer 2024, etc."
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
                placeholder="e.g. Certified Photographer, etc."
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
                value={formData.yearsOfExperience || ""}
                onChange={handleInputChange}
              />
              {errors.yearsOfExperience && (
                <p className="text-red-500 text-sm">
                  {errors.yearsOfExperience}
                </p>
              )}
            </div>

            <div>
              <Label>
                Social Media <span className="text-red-500">*</span>
              </Label>
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
                        <SelectValue placeholder="Account Name" />
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
              {errors.connectedAccounts && (
                <p className="text-red-500 text-sm">
                  {errors.connectedAccounts}
                </p>
              )}

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
            <Label>Have a Referral Code?</Label>
            <Input
              type="text"
              name="referralCode"
              value={formData.referralcode || ""}
              onChange={(e) =>
                setFormData({ ...formData, referralcode: e.target.value })
              }
            />

            <div className="mt-2 flex justify-center">
              <button
                className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50 disabled:hover:bg-primary disabled:hover:text-white"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <SpinLoader />
                    Registering...
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;
