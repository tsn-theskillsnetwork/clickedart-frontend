"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "./button";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import useLayoutStore from "@/store/layout";
import Swal from "sweetalert2";
import useAuthStore from "@/authStore";

export default function Footer() {
  const { user, photographer } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { layout } = useLayoutStore();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/invoice"))
    return null;
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
                src={layout?.logo || "/assets/Logo.png"}
                alt="ClickedArt.com"
                className="w-full h-auto"
              />
              <p className="mt-5">{layout?.footerDetails?.phone}</p>
              <p>{layout?.footerDetails?.email}</p>
              <div className="flex gap-4 text-sm underline underline-offset-1">
                <Link href="/terms">Terms and Conditions</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">Follow us</p>
              {/* <Link href="#" className="mt-3 text-sm font-medium">
                Facebook
              </Link> */}
              <div className="mt-3 flex flex-col gap-2">
                {layout &&
                  layout.footerDetails?.footerlinks?.map((link, index) => {
                    const formattedLink =
                      link.accountLink?.startsWith("http://") ||
                      link.accountLink?.startsWith("https://")
                        ? link.accountLink
                        : `https://${link.accountLink}`;

                    return (
                      <Link
                        key={index}
                        href={formattedLink || "/"}
                        className="text-sm font-medium"
                        target="_blank" // Optional: Opens the link in a new tab
                        rel="noopener noreferrer" // Security best practice for external links
                      >
                        {link.accountName}
                      </Link>
                    );
                  })}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">Explore</p>
              <Link href="/" className="mt-3 text-sm font-medium">
                Home
              </Link>
              <Link href="/images" className="text-sm font-medium">
                Images
              </Link>
              <Link href="/about" className="text-sm font-medium">
                About us
              </Link>
              <Link href="/contact" className="text-sm font-medium">
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
              <Link
                href="/support/custom-enquiry"
                className="text-sm font-medium"
              >
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
              <div>
                <Button
                  onClick={() => {
                    if (photographer) router.push("/profile");
                    else if (user)
                      Swal.fire(
                        "Please sign in as a Photographer to sell your photos"
                      );
                    else router.push("/signup/photographer");
                  }}
                  size="base"
                  variant="filled"
                  state="default"
                >
                  <p className="font-normal">Start Selling Now</p>
                </Button>
              </div>
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
