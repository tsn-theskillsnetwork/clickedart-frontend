import useAuthStore from "@/authStore";
import Link from "next/link";
import React from "react";
import Signout from "./signout";

export default function PhotographerOnly() {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <p>Please Login as Photographer</p>
      {user ? (
        <div className="bg-red-100 px-4 py-2 rounded-md shadow-md mt-4">
          <Signout variant="text" />
        </div>
      ) : (
        <Link href="/signin?type=photographer">
          <button className="bg-blue-100 text-blue-500 font-semibold px-4 py-2 rounded-md shadow-md mt-4">
            Login
          </button>
        </Link>
      )}
    </div>
  );
}
