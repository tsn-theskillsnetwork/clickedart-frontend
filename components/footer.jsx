"use client";

import Link from "next/link";
import React from "react";
import Button from "./button";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import useLayoutStore from "@/store/layout";
import Swal from "sweetalert2";
import useAuthStore from "@/authStore";
import { AnimatePresence, motion } from "framer-motion";

export default function Footer() {
  const { user, photographer } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { layout } = useLayoutStore();

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/invoice") ||
    pathname.startsWith("/bill")
  )
    return null;
  return (
    <AnimatePresence>
      <motion.div layout className={`bg-primary-100 pb-5 px-4 sm:px-10 md:px-24 z-50`}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 py-5 gap-y-5 gap-x-10 w-full">
          <div className="flex flex-col gap-2 w-full">
            <Image
              width={200}
              height={100}
              onClick={() => {
                router.push("/");
              }}
              src={layout?.logo || "/assets/Logo.png"}
              alt="ClickedArt.com"
              className="w-80"
            />
            {layout?.footerDetails?.phone ? (
              <p className="mt-5">{layout?.footerDetails?.phone}</p>
            ) : (
              <div className="mt-5 animate-pulse w-24 h-5 bg-surface-300 rounded-md"></div>
            )}
            {layout?.footerDetails?.email ? (
              <p>{layout?.footerDetails?.email}</p>
            ) : (
              <div className="animate-pulse w-24 h-5 bg-surface-300 rounded-md"></div>
            )}
            <div className="flex gap-4 text-sm underline underline-offset-1">
              <Link href="/terms">Terms and Conditions</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 w-full">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">Follow us</p>
              <div className="mt-3 flex flex-col gap-2">
                {layout ? (
                  <>
                    {layout.footerDetails?.footerlinks?.map((link, index) => {
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
                  </>
                ) : (
                  <>
                    {[...Array(4).keys()].map((index) => (
                      <div
                        key={index}
                        className="animate-pulse w-24 h-5 bg-surface-300 rounded-md"
                      ></div>
                    ))}
                  </>
                )}
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
              <Link href="/explore" className="text-sm font-medium">
                Explore
              </Link>
              <Link href="/explore?contact" className="text-sm font-medium">
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
              <Link
                href="/explore#supportVideo"
                className="text-sm font-medium"
              >
                Support Videos
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <p className="font-semibold text-lg">
              Sell your photographs on ClickedArt!
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

        <hr className="border-surface-300" />
        <div className="h-2"></div>
        <p className="text-sm font-medium">
          ©2025 ClickedArt® is a registered trademark.
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
