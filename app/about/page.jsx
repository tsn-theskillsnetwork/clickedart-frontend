"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs1 = [
  {
    question: "What is ClickedArt.com?",
    answer:
      "ClickedArt.com is an Indian-origin global platform where photographers showcase and sell high-quality images. Buyers can purchase digital downloads or printed versions of these photographs for personal or commercial use.",
  },
  {
    question: "How do I create an account on ClickedArt.com?",
    answer: `You can sign up by clicking on the "Sign In" icon on the right corner of homepage. Provide your email, create a password, and follow the on-screen instructions to complete your registration.`,
  },
  {
    question: "How do I buy a photo?",
    answer:
      "Browse the collection, select the image you like, choose the format (digital or print), add it to your cart, and proceed to checkout.",
  },
  {
    question: "What are the available payment methods?",
    answer:
      "We accept credit/debit cards, net banking, UPI, and digital wallets. International buyers can pay using global payment gateways like PayPal.",
  },
  {
    question: "Can I get a printed version of the photo?",
    answer:
      "Yes, you can order prints in various sizes and formats, including canvas and framed prints",
  },
  {
    question: "What do I get when I purchase a digital download?",
    answer:
      "Upon purchase, you will receive a high-resolution, watermark-free digital file that you can use as per the selected license terms.",
  },
  {
    question: "Can I negotiate prices with photographers?",
    answer:
      "No, the prices are fixed by the photographers and displayed on the platform. However, seasonal discounts and offers may apply.",
  },
  {
    question: "What licenses are available for the photos?",
    answer:
      "Photos are sold with either a standard or extended license. Details of usage rights are provided on the product page before purchase.",
  },
  {
    question: "Can I use purchased photos for commercial purposes?",
    answer:
      "Yes, but only if the photo is purchased with the appropriate license that permits commercial use.",
  },
  {
    question: "What if I want exclusive rights to an image?",
    answer:
      "For exclusive licensing, contact our support team. We will coordinate with the photographer to explore the possibility.",
  },
  {
    question: "How will I receive a digital download?",
    answer:
      "After successful payment, a download link will be made available in order section  of your dashboard.",
  },
  {
    question: "What is the estimated delivery time for printed photos?",
    answer:
      "Printed orders are typically delivered within 7-10 business days, depending on your location.",
  },
  {
    question: "Can I track my print order?",
    answer: "Yes, a tracking link will be provided once your order is shipped.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Digital downloads are non-refundable and cannot be canceled once purchased. For print orders, cancellations are allowed only within 24 hours of placing the order.",
  },
  {
    question: "What if I receive a damaged or incorrect print order?",
    answer:
      "Contact our support team within 48 hours of delivery, and we will assist you in resolving the issue.",
  },
  {
    question: "Are refunds available for digital downloads?",
    answer:
      "No, due to the nature of digital products, refunds for digital downloads are not possible.",
  },
  {
    question: "What if I face issues while purchasing?",
    answer: `Reach out to our support team via the "Contact Us" page or email us at support@clickedart.com`,
  },
  {
    question: "How can I give feedback about a photographer or an image?",
    answer:
      "You can leave a review or rating on the product page after your purchase. Your feedback helps photographers and other buyers.",
  },
  {
    question: "Who do I contact for bulk or custom orders?",
    answer:
      "For bulk orders or custom requests, please email us at support@clickedart.com ",
  },
  {
    question: "Is my payment information secure on ClickedArt.com?",
    answer:
      "Yes, all transactions are encrypted and processed through secure payment gateways.",
  },
  {
    question: "Will my personal information be shared with photographers?",
    answer:
      "No, your personal details remain confidential and are not shared with third parties or photographers.",
  },
];

const faqs2 = [
  {
    question: "What is ClickedArt.com?",
    answer:
      "ClickedArt.com is an Indian platform launched globally to empower photographers by providing a space to showcase their work, create catalogs, and earn through the sale of high-resolution images in digital or print format.",
  },
  {
    question: "Who can register as a photographer on ClickedArt.com?",
    answer:
      "Any creative photographer, whether professional or hobbyist, can register. You must own the rights to the images you upload.",
  },
  {
    question: "Is there a registration fee for photographers?",
    answer:
      "Basic membership is free. However, Intermediate and Premium memberships offer additional features and benefits at a nominal fee.",
  },
  {
    question: "How do I register as a photographer?",
    answer:
      "Visit ClickedArt.com and click on 'Sell your Photos'. Complete the registration form, provide the necessary details, and submit for approval.",
  },
  {
    question: "What information is required to register?",
    answer:
      "You will need to provide basic details (name, email, phone number), upload a portfolio sample, and, for monetization requests, additional information like bank details, PAN card, and GST certificate (if applicable).",
  },
  {
    question: "How long does the approval process take?",
    answer:
      "Approval typically takes 24-72 hours. You will be notified via email about the status of your registration.",
  },
  {
    question: "Can I update my profile later?",
    answer:
      "Yes, you can edit your profile details and upload new photos anytime through your dashboard.",
  },
  {
    question: "How do I upload my photos?",
    answer:
      "After logging into your account, navigate to the Upload New Photo section. Follow the guidelines to ensure your images meet the platform's requirements.",
  },
  {
    question: "Are there specific guidelines for photo uploads?",
    answer:
      "Yes. Ensure your photos are high-resolution, watermark-free, and comply with the platform`s terms of service. For detailed guidelines, refer to the Photo Upload Guidelines section below the upload section.",
  },
  {
    question: "How long does it take for my photos to be approved?",
    answer:
      "Photo approval typically takes 24-72 hours. Once approved, your images will be visible for sale on the platform if your profile is monetized.",
  },
  {
    question: "What happens if my photo is rejected?",
    answer:
      "You will receive an email with the reason for rejection. You can make necessary edits or upload a different image for approval after 24 hours.",
  },
  {
    question: "How do I apply for monetization?",
    answer:
      "Once your profile is approved, go to your dashboard and submit a monetization request. Ensure you provide all necessary information, including payment details.",
  },
  {
    question: "What is the royalty model?",
    answer:
      "Basic Membership: 50% on digital downloads, 10% on print orders.Intermediate Membership: 70% on digital downloads, 10% on print orders.Premium Membership: 90% on digital downloads, 10% on print orders.",
  },
  {
    question: "How will I receive my earnings?",
    answer:
      "Earnings will be credited to your registered bank account once they reach the minimum payout threshold. TDS and other applicable taxes will be deducted as per government norms.",
  },
  {
    question: "Can I upgrade my membership?",
    answer:
      "Yes, you can upgrade to Intermediate or Premium membership from your dashboard to enjoy higher royalties and additional benefits.",
  },
  {
    question: "What are the benefits of upgrading my membership?",
    answer:
      "Intermediate Membership: Higher royalties, advanced analytics, watermarking tools, and social media auto-posting.Premium Membership: Maximum royalties, priority support, marketing assistance, and additional visibility for your catalog.",
  },
  {
    question: "Is there a trial period for paid memberships?",
    answer:
      "Yes, new users can enjoy a 1-month free trial of Premium membership. After the trial, you can choose to continue or switch to another plan.",
  },
  {
    question: "Who owns the rights to the photos I upload?",
    answer:
      "You retain full ownership of your photos. By uploading them, you grant ClickedArt.com the right to sell and distribute them according to the licensing terms.",
  },
  {
    question: "What licensing options are available?",
    answer:
      "You can choose between standard and extended licensing, depending on how you want your photos to be used. Details are available in the Licensing Terms section.",
  },
  {
    question: "Can I remove my photos from the platform?",
    answer:
      "Yes, you can delete your photos from the platform at any time via your dashboard.",
  },
  {
    question: "How do I get support for any issues?",
    answer: "You can contact us via email at support@clickedart.com",
  },
  {
    question: "Where can I track my sales and earnings?",
    answer:
      "All sales, earnings, and analytics are accessible through your personalized dashboard in your profile page.",
  },
  {
    question: "What happens if I forget my password?",
    answer:
      "Use the Forgot Password option on the login page to reset your password.",
  },
];

export default function AboutPage() {
  const [faqType, setFaqType] = useState("user");
  return (
    <div className="flex flex-col min-h-[70vh]">
      <div className="relative flex flex-col gap-5 items-center justify-center py-20">
        <Image
          src="/assets/banners/who-we-are-about-us.png"
          alt="About us"
          width={1600}
          height={1600}
          className="object-cover absolute inset-0 w-full h-full -z-20"
        />
        <div className="absolute inset-0 bg-black opacity-20 -z-20" />
        <h1 className="text-heading-04 sm:text-heading-03 md:text-heading-02 lg:text-heading-01 font-semibold text-white">Who We Are</h1>
        <p className="text-base sm:text-heading-06 md:text-heading-05 lg:text-heading-04 font-medium text-center text-white">
          We&apos;re a team of passionate photographers turning imagination into
          reality
        </p>
        <Link href="/contact">
          <button className="bg-white text-surface-500 px-5 py-2 rounded-md">
            Connect with us!
          </button>
        </Link>
      </div>
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 mb-20">
        <h2 className="text-heading-05 sm:text-heading-04 md:text-heading-03 lg:text-heading-02 font-semibold mt-10">
          About ClickedArt
        </h2>
        <p className="text-base md:text-paragraph lg:text-heading-05 font-medium mt-5">
          A comprehensive digital marketplace that allows photographers to reach
          the public, relevant businesses, and corporates in both digital and
          print formats, ensuring fair compensation for their creative work.
        </p>
        <p className="text-base md:text-paragraph lg:text-heading-05 font-medium mt-10">
          Welcome to ClickedArt.com, a vibrant platform built for photographers
          and visual content enthusiasts! We empower talented photographers
          across India to showcase their creativity, connect with a wider
          audience, and monetize their artistry seamlessly. At the same time, we
          cater to buyers seeking authentic, highquality visuals that capture
          the essence of India&apos;s culture, landscapes, and diversity. We
          believe that every photograph tells a story, and we are here to bridge
          the gap between creators and admirers by offering a dedicated space
          where creativity meets purpose.
        </p>

        <div className="relative flex flex-col gap-5 items-center justify-center py-20 mt-10 rounded-xl overflow-hidden">
          <Image
            src="/assets/banners/vision.png"
            alt="About us"
            width={1600}
            height={1600}
            className="object-cover absolute inset-0 w-full h-full -z-20"
          />
          <div className="absolute inset-0 bg-black opacity-0 -z-20" />
          <h1 className="text-heading-05 sm:text-heading-04 md:text-heading-03 lg:text-heading-02 font-semibold text-black">
            Our Vision
          </h1>
          <p className="text-base md:text-paragraph lg:text-heading-05 font-medium text-center text-black">
            To become India&apos;s most trusted marketplace for connecting
            photographers and buyers, fostering a thriving ecosystem for
            creativity, collaboration, and inspiration.
          </p>
        </div>

        <div className="flex flex-col my-20 w-full items-center">
          <h1 className="text-heading-06 sm:text-heading-04 md:text-heading-03 lg:text-heading-02 xl:text-heading-01 font-bold mb-5 mx-auto">
            Frequently Asked Questions
          </h1>
          <div className="flex flex-row relative items-center justify-between w-full sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] py-3 sm:py-4 md:py-4 lg:py-5 my-10 rounded-full">
            <div
              className={`absolute inset-0 bg-primary-100 shadow-inner inner-shadow rounded-full`}
            ></div>
            <motion.div
              layout
              className={`absolute inset-y-0 z-0 bg-gradient-to-t ${
                faqType === "photographer" && "right-0"
              } from-[#897F75] to-[#BCB0A4] inner-shadow-2 w-1/2 h-full rounded-full`}
            ></motion.div>
            <p
              onClick={() => {
                setFaqType("user");
              }}
              className={`text-base md:text-paragraph lg:text-base xl:text-heading-06 drop-shadow-md z-10 font-bold ${
                faqType === "photographer"
                  ? "text-surface-500"
                  : "text-zinc-100"
              } text-center w-full cursor-pointer transition-colors duration-200 ease-in-out`}
            >
              For Buyers
            </p>
            <p
              onClick={() => {
                setFaqType("photographer");
              }}
              className={`text-base md:text-paragraph lg:text-base xl:text-heading-06 drop-shadow-md z-10 font-bold ${
                faqType === "user" ? "text-surface-500" : "text-zinc-100"
              } text-center w-full cursor-pointer transition-colors duration-200 ease-in-out`}
            >
              For Photographers
            </p>
          </div>
          <Accordion className="flex flex-col gap-5" type="single" collapsible>
            {(faqType === "user" ? faqs1 : faqs2).map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="w-full sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] border px-4 rounded-xl"
              >
                <AccordionTrigger className="sm:!text-heading-06 md:!text-heading-05 lg:!text-heading-04 font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="!text-xs sm:!text-sm md:!text-paragraph lg:!text-heading-06">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="relative flex flex-col gap-5 items-center justify-center py-20 rounded-xl overflow-hidden mt-10">
          <Image
            src="/assets/banners/mission.png"
            alt="About us"
            width={1600}
            height={1600}
            className="object-cover absolute inset-0 w-full h-full -z-20"
          />
          <div className="absolute inset-0 bg-white opacity-20 -z-20" />
          <h1 className="text-heading-05 sm:text-heading-04 md:text-heading-03 lg:ext-heading-02 font-semibold text-black">
            Our Mission
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-10">
            <div>
              <p className="text-paragraph md:text-heading-05 lg:text-heading-04 text-center text-black font-bold">
                For Photographers
              </p>
              <p className="mt-2 text-base md:text-paragraph lg:text-heading-05 font-medium text-center text-black">
                Empower photographers with a platform to showcase, sell, and
                monetize their creative work while connecting them with a global
                audience.
              </p>
            </div>
            <div>
              <p className="text-paragraph md:text-heading-05 lg:text-heading-04 text-center text-black font-bold">
                For Buyers
              </p>
              <p className="mt-2 text-base md:text-paragraph lg:text-heading-05 font-medium text-center text-black">
                Provide buyers with easy access to authentic, high-quality
                original images and prints that cater to their personal,
                commercial, and creative needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
