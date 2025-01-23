"use client";

import Button2 from "@/components/button2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";
import useAuthStore from "@/authStore";
import Loader from "@/components/loader";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();

  const { user, photographer, isHydrated } = useAuthStore();

  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  const validatePassword = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    }
    if (
      newPassword &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        newPassword
      )
    ) {
      newErrors.newPassword =
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
    }

    if (newPassword !== verifyPassword) {
      newErrors.verifyPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handlePassChange = async () => {
    const newErrors = validatePassword();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setError({});

    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/${userType}/change-password`,
        {
          userId: userId,
          newPassword: newPassword,
        }
      );
      Swal.fire({
        title: "Success!",
        text: "Password has been changed successfully",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        if (userType === "user") router.push("/signin");
        else router.push("/profile");
      });
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUserType("user");
      setUserId(user._id);
    } else if (photographer) {
      setUserType("photographer");
      setUserId(photographer._id);
    }
  }, [isHydrated]);

  return (
    <div className="px-4 flex flex-col items-center justify-center h-[80vh]">
      {user || photographer ? (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4 mt-6">
          <h1 className="text-xl font-semibold">Reset Your Password</h1>
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 mt-6">
            <div className="relative">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              {error.newPassword && (
                <p className="text-red-500 text-sm mt-1">{error.newPassword}</p>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="verify-password">Verify Password</Label>
              <div className="relative">
                <Input
                  id="verify-password"
                  type={showVerifyPassword ? "text" : "password"}
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  placeholder="Verify your new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                >
                  {showVerifyPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              {error.verifyPassword && (
                <p className="text-red-500 text-sm mt-1">{error.verifyPassword}</p>
              )}
            </div>

            <div className="mx-auto">
              <Button2 onClick={handlePassChange} disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
              </Button2>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          {!isHydrated ? (
            <Loader />
          ) : (
            <p className="text-red-500">You are not signed in</p>
          )}
        </div>
      )}
    </div>
  );
}
