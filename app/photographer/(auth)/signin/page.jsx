"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useRouter } from "next/navigation";
import useAuthStore from "@/authStore";
import Link from "next/link";

const SignInPage = () => {
  const { signin, setPhotographer, user, photographer } = useAuthStore();

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Sign-in successful!");
        setError("");

        // Update Zustand store
        signin(data.token);
        setPhotographer(data.photographer);

        // Redirect to home page
        router.push("/");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    if (user || photographer) {
      router.push("/");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] mt-5 mb-10">
      {user || photographer ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p>You are already signed in.</p>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full md:w-1/2 gap-4 px-5"
          >
            <h2 className="text-heading-04 font-medium text-center">
              User Sign In
            </h2>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
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
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mx-auto">
              {message && <p className="text-green-500">{message}</p>}
              {error && <p className="text-red-500">{error}</p>}
            </div>

            <div className="flex flex-col items-center">
              <Button type="submit">Sign In</Button>
            </div>
          </form>
        </>
      )}

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

export default SignInPage;
