"use client";

import Button from "@/components/button";
import Button2 from "@/components/button2";
import EnquiryForm from "@/components/form/Enquiry";
import useLayoutStore from "@/store/layout";
import { Icon } from "@iconify/react";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ContactUs() {
  const { layout } = useLayoutStore();
  const brandColors = {
    facebook: "text-[#3b5999]",
    messenger: "text-[#0084ff]",
    twitter: "text-[#55acee]",
    linkedin: "text-[#0077b5]",
    skype: "text-[#00aff0]",
    dropbox: "text-[#007ee5]",
    wordpress: "text-[#21759b]",
    vimeo: "text-[#1ab7ea]",
    slideshare: "text-[#0077b5]",
    vk: "text-[#4c75a3]",
    tumblr: "text-[#34465d]",
    yahoo: "text-[#410093]",
    "google-plus": "text-[#dd4b39]",
    pinterest: "text-[#bd081c]",
    youtube: "text-[#cd201f]",
    stumbleupon: "text-[#eb4924]",
    reddit: "text-[#ff5700]",
    quora: "text-[#b92b27]",
    yelp: "text-[#af0606]",
    weibo: "text-[#df2029]",
    producthunt: "text-[#da552f]",
    hackernews: "text-[#ff6600]",
    soundcloud: "text-[#ff3300]",
    blogger: "text-[#f57d00]",
    whatsapp: "text-[#25d366]",
    wechat: "text-[#09b83e]",
    line: "text-[#00c300]",
    medium: "text-[#02b875]",
    vine: "text-[#00b489]",
    slack: "text-[#3aaf85]",
    instagram: "text-[#e4405f]",
    dribbble: "text-[#ea4c89]",
    flickr: "text-[#ff0084]",
    foursquare: "text-[#f94877]",
    behance: "text-[#131418]",
    snapchat: "text-[#fffc00]",
  };
  return (
    <div className="flex flex-col items-center my-10 min-h-screen">
      <div className="relative flex flex-col w-full overflow-hidden rounded-lg">
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
        <div className="text-center z-10 my-4 text-white">
          <h1 className="2xl:text-heading-lg lg:text-heading-03 sm:text-heading-05 text-heading-06 font-bold text-shadow">
            CONTACT US
          </h1>
          <h1 className="2xl:text-heading-01 lg:text-heading-04 sm:text-heading-06 text-paragraph font-bold text-shadow">
            We&apos;d Love to Hear From You!
          </h1>
          <h4 className="2xl:text-heading-04 xl:text-heading-05 lg:text-paragraph sm:text-base text-xs font-semibold text-shadow">
            Reach out for inquiries, feedback, or just to say hi
          </h4>
        </div>
      </div>
      <div className="grid gap-5 lg:gap-7 2xl:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full shadow-[2px_2px_10px_rgba(0,0,0,0.5)] mt-10 rounded-lg bg-white">
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
          <hr />
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
                          className={
                            brandColors[link.accountName.toLowerCase()] ||
                            "text-primary"
                          }
                        />
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 px-4 md:px-5 py-6 border-t border-l-0 md:border-l md:border-t-0">
          <div className="flex flex-col gap-2">
            <h5 className="xl:text-heading-06 md:text-paragraph 2xl:text-heading-05 font-semibold">
              Have an Enquiry?
            </h5>
            <EnquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
