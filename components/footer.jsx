"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "./button";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const [settings, setSettings] = useState({});

  const fetchSettings = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/layout/get-layout-content`
      );
      console.log(res.data);
      setSettings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);
  if (pathname.startsWith("/dashboard")) return null;
  return (
    <div className={`bg-primary-100 min-h-96 px-10 sm:px-24 z-50`}>
      <div className="pt-20 pb-10">
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-wrap gap-10 sm:gap-28">
            <div className="flex flex-col gap-2">
              <Image
                width={192}
                height={48}
                onClick={() => {
                  router.push("/");
                }}
                src={settings?.logo || "/assets/Logo.png"}
                alt="ClickedArt.com"
                className="w-full h-auto"
              />
              <p className="mt-5">{settings?.footerDetails?.phone}</p>
              <p>{settings?.footerDetails?.address}</p>
              <div className="flex gap-4 text-sm underline underline-offset-1">
                <Link href="#">Terms of Use</Link>
                <Link href="#">Privacy Policy</Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">Follow us</p>
              <Link href="#" className="mt-3 text-sm font-medium">
                Facebook
              </Link>
              <Link href="#" className="text-sm font-medium">
                Instagram
              </Link>
              <Link href="#" className="text-sm font-medium">
                Youtube
              </Link>
              <Link href="#" className="text-sm font-medium">
                LinkedIn
              </Link>
              <Link href="#" className="text-sm font-medium">
                Twitter
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">Explore</p>
              <Link href="#" className="mt-3 text-sm font-medium">
                Home
              </Link>
              <Link href="#" className="text-sm font-medium">
                Catalog
              </Link>
              <Link href="#" className="text-sm font-medium">
                About us
              </Link>
              <Link href="#" className="text-sm font-medium">
                Contact us
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">Support</p>
              <Link
                href="/support/bulk-download"
                className="mt-3 text-sm font-medium"
              >
                Bulk Download
              </Link>
              <Link href="#" className="text-sm font-medium">
                Custom Enquiry
              </Link>
              <Link href="/verify" className="text-sm font-medium">
                Verify Email
              </Link>
            </div>
          </div>
          <div className="flex max-w-[28%] sm:mr-20">
            <div className="flex flex-col gap-2 items-start">
              <p className="font-semibold text-lg">
                Sell your photography on ClickedArt!
              </p>
              <p className="mt-3 text-sm font-medium">
                Turn Your Passion into Profit — Join Our Community of Creators
              </p>
              <Link href="/signup/photographer">
                <Button size="base" variant="filled" state="default">
                  <p className="font-normal">Start Selling Now</p>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-surface-300" />
      <div className="h-2"></div>
      <p className="text-sm font-medium">
        ©2024 ClickedArt® is a registered trademark.
      </p>
    </div>
  );
}
