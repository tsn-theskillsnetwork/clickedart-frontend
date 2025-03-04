"use client";

import Button2 from "@/components/button2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";

export default function ResetPassPage() {
  const router = useRouter();

  const type = useSearchParams().get("type");
  const emailadd = useSearchParams().get("email");

  const [email, setEmail] = useState(emailadd || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(type || "user");

  const handlePassReset = async () => {
    if (!email) {
      return setError("Email is required");
    }

    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/${userType}/reset-password`,
        {
          email: email,
        }
      );
      Swal.fire({
        title: "Success!",
        text: "New Password has been sent to your email",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        if (userType === "user") router.push("/signin");
        else router.push("/signin?type=photographer");
      });
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-xl font-semibold">Reset Your Password</h1>
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
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <div className="mx-auto">
          <Button2 disabled={loading} size="sm" onClick={handlePassReset}>{
            loading ? "Loading..." : "Reset Password"
            }</Button2>
        </div>
      </div>
    </div>
  );
}
