"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MembershipPage() {
  const [active, setActive] = useState(0);

  const plans = [
    {
      id: 0,
      name: "Basic",
      price: "Free",
      features: [
        "Perfect for hobbyists or beginners who want to test the platform.",
        "Upload up to 10 images and create one catalogs.",
        "Includes basic watermarking and a fixed pricing structure.",
        "Monthly sales report.",
      ],
    },
    {
      id: 1,
      name: "Intermediate",
      price: "₹xxxx",
      features: [
        "Tailored for semi-professional photographers. ",
        "Upload up to 10 images and create one catalogs.",
        "Offers flexible pricing options and detailed sales reports.",
        "Social media auto-posting and priority support.",
        "Free 1-month trial for new users.",
      ],
    },
    {
      id: 2,
      name: "Premium",
      price: "₹xxxx",
      features: [
        "Ideal for professional photographers and agencies.",
        "Unlimited uploads, catalogs, and full promotional tools.",
        "Advanced analytics with customer insights and market recommendations.",
        "Custom licensing and branding options for complete control.",
      ],
    },
  ];

  const faqs = [
    {
      question: "How can I manage my billing?",
      answer:
        "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum",
    },
    {
      question: "Do you offer any discounted plans?",
      answer:
        "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum",
    },
    {
      question: "How does our pricing work?",
      answer:
        "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum",
    },
    {
      question: "Does Venture offer plans to nonprofits and NGOs?",
      answer:
        "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum",
    },
    {
      question: "What if I change my mind?",
      answer:
        "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum",
    },
    {
      question: "Can I change my plan?",
      answer:
        "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum",
    },
  ];
  return (
    <div className="flex flex-col -mt-4 overflow-x-hidden">
      <div className="relative flex flex-col py-10 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="absolute inset-0 z-0 opacity-80">
          <Image
            src="/assets/images/img4.jpg"
            className="h-full w-full object-cover"
            alt="bg"
            width={2048}
            height={2048}
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-5 sm:px-6 md:px-10 lg:px-28 h-full z-10">
          <h1 className="text-heading-05 sm:text-heading-04 md:text-heading-03 lg:text-heading-02 font-semibold text-white">
            Choose your Membership Plan
          </h1>
          <p className="text-paragraph sm:text-heading-06 md:text-heading-05 lg:text-heading-03 font-semibold text-white">
            Unlock exclusive features to showcase your creativity and boost your
            sales!
          </p>
          <button className="bg-white text-primary text-xs mx-auto md:mx-0 sm:text-paragraph lg:text-heading-05 font-semibold rounded-lg py-2.5 px-3 mt-2">
            Start with a free 3-month trial of the Advanced Plan
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-10 px-5 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
        <div className="flex flex-col items-center gap-2">
          <h4 className="text-heading-06 sm:text-heading-04 md:text-heading-03 lg:text-heading-02 xl:text-heading-01 text-center font-bold md:font-semibold">
            Choose a Plan That Suits You
          </h4>
          <p className="text-sm sm:text-base md:text-paragraph lg:text-heading-06 text-center font-semibold">
            Explore our membership options and take your creativity to the next
            level.
          </p>
          <div className="hidden md:grid grid-cols-3 sm:gap-2 md:gap-4 lg:gap-10 w-screen pt-20 items-end md:px-2 lg:px-12 xl:px-20">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                onHoverStart={() => setActive(plan.id)}
                onClick={() => setActive(plan.id)}
                className={` flex w-full h-full py-4 md:px-4 lg:px-12 xl:px-20 flex-col items-center justify-between gap-2 border-primary border-2 rounded-2xl transition-all duration-200 ease-linear ${
                  plan.id === active
                    ? "bg-primary ease-in-out text-white scale-y-105 -translate-y-4"
                    : " text-primary-dark scale-y-100 -translate-y-0"
                }`}
              >
                <div
                  className={`flex flex-col items-center transition-transform w-full duration-200 ease-linear ${
                    plan.id === active
                      ? "scale-y-95 -translate-y-3"
                      : "scale-y-100 -translate-y-0"
                  }`}
                >
                  <div
                    className={`border px-4 py-2 rounded-2xl text-heading-05 font-semibold ${
                      plan.id === active
                        ? "border-white text-white"
                        : "border-primary text-primary"
                    }`}
                  >
                    <p>{plan.name}</p>
                  </div>
                  <p
                    className={`text-heading-01 font-semibold ${
                      plan.id === active ? "text-white" : "text-primary"
                    }`}
                  >
                    {plan.price}
                  </p>
                  <p className="text-heading-06 font-medium">User/Month</p>

                  <div className="flex flex-col gap-2 mt-4">
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex flex-row gap-1 sm:gap-2 lg:gap-4 items-start"
                      >
                        <div className="w-fit pt-1">
                          <CheckCircle size={24} />
                        </div>
                        <p className="sm:text-base md:text-paragraph lg:text-heading-06 font-medium">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className={`${
                    plan.id === active ? "scale-y-95" : "scale-y-100"
                  } transition-transform w-40 lg:w-60 duration-200 ease-linear`}
                >
                  <button
                    className={`${
                      plan.id === active
                        ? "bg-white text-primary "
                        : "bg-primary text-white"
                    } md:text-sm w-full lg:text-heading-06 xl:text-heading-05 font-medium rounded-lg py-4 px-6 mt-4`}
                  >
                    Choose Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Mobile view */}
          <div className="md:hidden w-screen grid grid-cols-3 px-2 gap-1 sm:gap-10 pt-10 items-end">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                onHoverStart={() => setActive(plan.id)}
                onClick={() => setActive(plan.id)}
                className={`flex w-full h-full py-5 px-2 flex-col items-center justify-between gap-2 border-primary border-2 rounded-2xl transition-all duration-200 ease-linear ${
                  plan.id === active
                    ? "bg-primary ease-in-out text-white scale-y-110 -translate-y-1.5"
                    : " text-primary-dark scale-y-100 -translate-y-0"
                }`}
              >
                <div
                  className={`flex flex-col items-center transition-transform duration-200 ease-linear ${
                    plan.id === active
                      ? "scale-y-90 translate-y-2"
                      : "scale-y-100 -translate-y-0"
                  }`}
                >
                  <div
                    className={`border px-1 py-1 sm:px-2 w-full text-center rounded-2xl text-xs sm:text-lg font-semibold ${
                      plan.id === active
                        ? "border-white text-white"
                        : "border-primary text-primary"
                    }`}
                  >
                    <p>{plan.name}</p>
                  </div>
                  <p
                    className={`text-heading-06 sm:text-heading-05 font-bold ${
                      plan.id === active ? "text-white" : "text-primary"
                    }`}
                  >
                    {plan.price}
                  </p>
                  <p className="text-xs sm:text-sm font-medium">User/Month</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex md:hidden flex-col w-full gap-2 mt-4">
            {plans[active].features.map((feature, index) => (
              <div key={index} className="flex flex-row gap-4 px-4 items-start">
                <div className="w-fit pt-0.5">
                  <CheckCircle size={16} />
                </div>
                <p className="text-sm sm:text-paragraph font-medium">
                  {feature}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col my-20 w-full items-center">
            <h1 className="text-heading-06 sm:text-heading-04 md:text-heading-03 lg:text-heading-02 xl:text-heading-01 font-bold mb-5 mx-auto">
              Frequently Asked Questions
            </h1>
            <Accordion
              className="flex flex-col gap-5"
              type="single"
              collapsible
            >
              {faqs.map((faq, index) => (
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
        </div>
      </div>
      <div className="flex flex-col gap-10 items-center justify-center w-full sm:w-11/12 lg:w-5/6 mx-auto py-10 mb-10">
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-2 lg:gap-28 items-center bg-[#897F75B0] text-white px-5 py-12 sm:p-12 mx-auto rounded-lg">
          <div className="flex flex-col gap-5 lg:gap-10 sm:px-10">
            <h2 className="text-heading-06 sm:text-heading-05 md:text-heading-04 lg:text-heading-03 xl:text-heading-02 font-semibold">
              Still not sure? Start with the Free Basic Plan and upgrade
              anytime!
            </h2>
            <p className="text-xs sm:text-sm md:text-paragraph lg:text-heading-06 xl:text-heading-04 font-semibold">
              Enjoy professional tools with our Advanced Plan – free for 1
              month!
            </p>
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 xl:gap-10 items-center justify-center w-full">
              <button className=" bg-transparent border-2 border-[#F8F8F8] w-full text-[#F8F8F8] text-paragraph lg:text-paragraph xl:text-heading-06 font-semibold rounded-2xl py-4 px-6 mt-4">
                Get Started for Free
              </button>
              <button className=" bg-[#F8F8F8] border-2 border-[#F8F8F8] text-primary text-paragraph lg:text-paragraph xl:text-heading-06 w-full font-semibold rounded-2xl py-4 px-6 mt-4">
                Start Advanced Trial
              </button>
            </div>
          </div>
          <div className="aspect-[1/1] rounded-lg overflow-hidden w-full lg:w-[80%]">
            <Image
              src="/assets/membership-footer.jpg"
              alt="membership icon"
              className="w-full h-full object-cover"
              width={2048}
              height={2048}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
