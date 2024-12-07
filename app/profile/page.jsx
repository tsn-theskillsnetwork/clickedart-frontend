"use client";

import React, { useEffect } from "react";
import useAuthStore from "@/authStore";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import { Icon } from "@iconify/react";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  return (
    <>
      {isSignedIn ? (
        <div className="flex flex-col items-center min-h-[80vh]">
          <div className="relative flex flex-col items-center pb-10 justify-center mt-4 w-full md:w-11/12 lg:w-10/12 xl:w-9/12">
            <div className="absolute inset-0 bg-black opacity-15 z-0">
              <Image
                width={800}
                height={600}
                src={"/assets/hero/bg4.jpg"}
                alt="Profile background"
                priority
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center w-full justify-center md:px-12 sm:px-8 lg:px-16 xl:px-20 pt-5 z-10">
              <div className="w-8/12 md:w-6/12 lg:w-5/12 xl:w-3/12 flex items-center">
                <Image
                  width={300}
                  height={300}
                  src={user?.image || "/assets/default.jpg"}
                  alt={`${user?.name || "Default"}'s profile picture`}
                  className="object-cover border-4 border-white mx-auto w-60 aspect-[1/1] rounded-full"
                />
              </div>
              <div className="sm:w-9/12 p-4 sm:p-8 z-20">
                <h3 className="text-heading-04 font-semibold text-black">
                  {user?.name || "Anonymous"}
                </h3>
                <p className="text-paragraph text-justify text-gray-500 mt-4">
                  {user?.bio || "No bio available."}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-8 z-20">
              <Link href="/profile/edit">
                <Button color="primary" size="lg">
                  Edit Profile
                </Button>
              </Link>
              <div className="flex flex-row gap-4">
                {user?.connectedAccounts?.map((account) => (
                  <Link key={account.accountName} href={account.accountLink}>
                    <Icon
                      icon={`akar-icons:${account.accountName}-fill`}
                      className="text-4xl text-primary"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
