"use client";

import { useState } from "react";
import Button from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/authStore";
import Link from "next/link";
import axios from "axios";

const PhotographerSignInPage = () => {
  const { signin, setUserType } = useAuthStore();
  const searchParams = useSearchParams();

  const router = useRouter();

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
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      signin(data.token);
      setUserType("Photographer");
      setMessage("Sign-in successful!");
      setError("");
      if (searchParams.get("redirect")) {
        router.push(searchParams.get("redirect"));
        return;
      }
      router.push("/profile");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Invalid credentials. Please try again."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
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
          <p className="text-sm text-right">
            <Link
              className="text-blue-500 font-medium"
              href={`/reset-pass?type=photographer${
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
          <Link className="underline" href="/signup/photographer">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PhotographerSignInPage;
