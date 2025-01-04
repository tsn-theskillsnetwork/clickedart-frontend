"use client";

import Button2 from "@/components/button2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [userType, setUserType] = useState("user");

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
      router.push("/signin");
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/user/resent-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend OTP. Please try again.");
      }

      setOtpResent(true);
      setLoading(false);
      setError("");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
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

        <div className="flex justify-center gap-4 mt-4">
          <Button2 size="sm" onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button2>

          <Button2 size="sm" onClick={handleResendOTP} disabled={loading}>
            {loading ? "Resending..." : "Send OTP"}
          </Button2>
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {otpResent && (
          <p className="text-green-500 text-center mt-2">
            OTP has been resent to your email.
          </p>
        )}
      </div>
    </div>
  );
}
