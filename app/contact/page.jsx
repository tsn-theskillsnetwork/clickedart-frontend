"use client";

import Button from "@/components/button";
import Button2 from "@/components/button2";
import useLayoutStore from "@/store/layout";
import { Icon } from "@iconify/react";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ContactPage() {
  const { layout } = useLayoutStore();
  //console.log(layout);
  return (
    <div className="flex flex-col items-center px-4 my-20 h-screen">
      <div className="relative flex flex-col w-full md:w-5/6 overflow-hidden rounded-lg">
        <Image
          src={
            "/assets/banners/contact.jpg" || "/assets/placeholders/image.webp"
          }
          className="absolute inset-0 w-full h-full z-0 object-cover object-top "
          alt="Contact"
          width={1920}
          height={1080}
        />
        <div className="bg-black bg-opacity-10 absolute inset-0 z-0"></div>
        <div className="text-center z-10 my-16 sm:my-20 md:my-24 lg:my-36 text-white">
          <h1 className="2xl:text-heading-lg lg:text-heading-03 sm:text-heading-05 text-heading-06 font-bold drop-shadow-lg">
            CONTACT US
          </h1>
          <h1 className="2xl:text-heading-01 lg:text-heading-04 sm:text-heading-06 text-paragraph font-bold drop-shadow-lg">
            We&apos;d Love to Hear From You!
          </h1>
          <h4 className="2xl:text-heading-04 xl:text-heading-05 lg:text-paragraph sm:text-base text-xs font-semibold drop-shadow-lg">
            Reach out for inquiries, feedback, or just to say hi
          </h4>
        </div>
      </div>
      <div className="grid gap-5 lg:gap-7 2xl:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full md:w-5/6 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] mt-10 rounded-lg bg-white">
        <div className="flex flex-col gap-5 px-4 md:px-5 py-6 ">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4">
              <Phone className="mt-1 shrink-0" size={24} />
              <h5 className="md:text-paragraph xl:text-heading-06 2xl:text-heading-05 font-semibold">
                CALL US
              </h5>
            </div>
            <h5 className="xl:text-heading-06 md:text-paragraph 2xl:text-heading-05 font-medium">
              +91 {layout?.footerDetails?.phone}
            </h5>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4">
              <Mail className="mt-1 shrink-0" size={24} />
              <h5 className="md:text-paragraph xl:text-heading-06 2xl:text-heading-05 font-semibold">
                MAIL US
              </h5>
            </div>
            <h5 className="xl:text-heading-06 md:text-paragraph 2xl:text-heading-05 font-medium">
              {layout?.footerDetails?.email}
            </h5>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4">
              <MapPin className="mt-1 shrink-0" size={24} />
              <h5 className="md:text-paragraph xl:text-heading-06 2xl:text-heading-05 font-semibold">
                ADDRESS
              </h5>
            </div>
            <h5 className="xl:text-heading-06 md:text-paragraph 2xl:text-heading-05 font-medium">
              {layout?.footerDetails?.address}
            </h5>
          </div>
        </div>
        <div className="flex flex-col gap-5 px-4 md:px-5 py-6 border-t border-l-0 md:border-l md:border-t-0">
          <div className="flex flex-col gap-2">
            <h5 className="xl:text-heading-06 md:text-paragraph 2xl:text-heading-05 font-semibold">
              Our Social Media
            </h5>
            <div className="flex flex-wrap gap-4">
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
                      className=""
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex flex-row gap-2 items-center">
                        <Icon
                          icon={
                            "entypo-social:" + link.accountName.toLowerCase()
                          }
                          width="40"
                          height="40"
                          className="text-primary"
                        />
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
          <hr />
          <div className="flex flex-col gap-2">
            <h5 className="xl:text-heading-06 md:text-paragraph 2xl:text-heading-05 font-semibold">
              Have an Enquiry?
            </h5>
            <Link href="/support/custom-enquiry">
              <Button2>Get in Touch</Button2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
