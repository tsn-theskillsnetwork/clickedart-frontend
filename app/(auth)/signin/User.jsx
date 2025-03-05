"use client";

import { useState } from "react";
import Button from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/authStore";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

const UserSignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signin, setUserType } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/user/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      signin(data.token);
      setUserType("User");
      setMessage("Sign in successful.");
      toast("Sign in successful.", {
        duration: 4000,
        position: "top-center",
      });
      if (searchParams.get("redirect")) {
        router.push(searchParams.get("redirect"));
        return;
      }
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            className="border-black"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            className="border-black"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <p className="text-sm text-right font-medium">
            <Link
              className="text-blue-500"
              href={`/reset-pass?type=user${
                formData.email ? `&email=${formData.email}` : ""
              }`}
            >
              Forgot Password?
            </Link>
          </p>
        </div>

        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col items-center">
          <Button disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>

      <div className="flex flex-col items-center mt-4">
        <p>
          Don't have an account?{" "}
          <Link className="underline" href="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignInPage;
