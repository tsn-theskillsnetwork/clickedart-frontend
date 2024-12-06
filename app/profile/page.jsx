"use client";

import React from "react";
import useAuthStore from "@/authStore";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  return (
    <>
      {isSignedIn ? (
        <div className="flex flex-col items-start px-5 min-h-[80vh]">
          <h1 className="text-2xl">Welcome, {user?.name}!</h1>
          <p>Email: {user?.email}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p>You are not signed in.</p>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
