"use client";

import Button2 from "@/components/button2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export default function VerifyPage() {
  const type = useSearchParams().get("type");
  const emailadd = useSearchParams().get("email");

  const [email, setEmail] = useState(emailadd || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [userType, setUserType] = useState(type || "user");

  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/${userType}/verify-${userType}-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid OTP. Please try again.");
      }

      setError("");
      setLoading(false);
      toast.success("Account verified successfully.");
      if (userType === "user") router.push("/signin");
      else router.push("/signin?type=photographer");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/${userType}/resent-otp`,
        { email }
      );

      setOtpResent(true);
      toast.success("OTP has been resent to your email.");
      setLoading(false);
      setError("");
    } catch (error) {
      setError(error.message);
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="px-4 flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-xl font-semibold">Verify Your Account</h1>
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 mt-6">
        <div>
          <Label>User Type</Label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="user">User</option>
            <option value="photographer">Photographer</option>
          </select>
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailadd && (
            <p className="text-green-500 text-center mt-2">
              OTP has been sent to your email. If you don't see it in your inbox, check your spam folder.
            </p>
          )}
        </div>

        <div>
          <Label>OTP</Label>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <Button2 size="sm" onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button2>

          <button onClick={handleResendOTP} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {otpResent && (
          <p className="text-green-500 text-center mt-2">
            OTP has been resent to your email. If you don't see it in your inbox, check your spam folder.
          </p>
        )}
      </div>
    </div>
  );
}
