"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/authStore";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/loader";
import UserSignInPage from "./User";
import PhotographerSignInPage from "./Photographer";

const SignInPage = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const { user, photographer, isHydrated } = useAuthStore();
  const router = useRouter();
  const toastShownRef = useRef(false);
  const [userType, setUserType] = useState("user");

  useEffect(() => {
    if (type && (type === "user" || type === "photographer")) {
      setUserType(type);
    }
  }, [type]);

  useEffect(() => {
    if (!isHydrated) return;

    if ((user || photographer) && !toastShownRef.current) {
      toastShownRef.current = true;
      router.push("/");
    }
  }, [isHydrated, user, router]);

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center min-h-[80vh] w-full mt-5 mb-10 px-4">
      <div className="space-y-5 mx-auto w-full max-w-3xl rounded-lg p-5 shadow-[0_4px_8px_rgba(0,0,0,0.4)] bg-white">
        <p
          className={`text-center text-paragraph sm:text-heading-06 md:text-heading-05 lg:text-heading-04 font-semibold capitalize`}
        >
          <span className={userType === "photographer" ? "text-blue-600" : "text-primary"}>{userType} </span>
          Sign In
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-10">
          <button
            onClick={() => {
              setUserType("user");
            }}
            className={`text-xs sm:text-sm drop-shadow-md z-10 font-bold ${
              userType === "user"
                ? "bg-primary-dark text-white"
                : "bg-primary-100 text-primary-dark hover:bg-white"
            } text-center cursor-pointer transition-colors duration-200 ease-in-out p-3 w-40 rounded-full border-2 border-primary`}
          >
            User
          </button>
          <button
            onClick={() => {
              setUserType("photographer");
            }}
            className={`text-xs sm:text-sm drop-shadow-md z-10 font-bold ${
              userType === "photographer"
                ? "bg-primary-dark text-white"
                : "bg-primary-100 text-primary-dark hover:bg-white"
            } text-center cursor-pointer transition-colors duration-200 ease-in-out p-3 w-40 rounded-full border-2 border-primary`}
          >
            Photographer
          </button>
        </div>

        {userType === "photographer" ? (
          <PhotographerSignInPage />
        ) : (
          <UserSignInPage />
        )}
      </div>
    </div>
  );
};

export default SignInPage;
