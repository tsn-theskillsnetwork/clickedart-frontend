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
  const [active, setActive] = useState(1);

  const plans = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
    <div className="flex flex-col -mt-4">
      <div className="relative flex flex-col h-[70vh]">
        <div className="absolute inset-0 z-0 opacity-80">
          <Image
            src="/assets/images/img4.jpg"
            className="h-full w-full object-cover"
            alt="bg"
            width={2048}
            height={2048}
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-10 px-28 h-full z-10">
          <h1 className="text-heading-01 font-semibold text-white">
            Choose your Membership Plan
          </h1>
          <p className="text-heading-03 font-semibold text-white">
            Unlock exclusive features to showcase your creativity and boost your
            sales!
          </p>
          <button className="bg-white text-primary text-heading-05 font-semibold rounded-lg py-4 px-6 mt-4">
            Start with a free 3-month trial of the Advanced Plan
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-10 my-20">
        <div className="flex flex-col items-center gap-2">
          <h4 className="text-heading-03 font-semibold">
            Choose a Plan That Suits You
          </h4>
          <p className="text-heading-06 font-semibold">
            Explore our membership options and take your creativity to the next
            level.
          </p>
          <div className="grid grid-cols-3 gap-10 w-full px-20 h-[90vh] items-end">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ height: "80vh" }}
                onHoverStart={() => setActive(plan.id)}
                animate={{ height: plan.id === active ? "85vh" : "80vh" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`flex w-full py-4 px-24 flex-col items-center justify-between gap-2 border-primary border-2 rounded-2xl ${
                  plan.id === active
                    ? "bg-primary transition-colors duration-200 ease-in-out text-white"
                    : "transition-colors duration-200 ease-in-out text-primary-dark"
                }`}
              >
                <div className="flex flex-col items-center">
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
                        className="flex flex-row gap-8 items-start"
                      >
                        <div className="w-fit pt-1">
                          <CheckCircle size={24} />
                        </div>
                        <p className="text-heading-06 font-medium">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className={`${
                    plan.id === active
                      ? "bg-white text-primary"
                      : "bg-primary text-white"
                  } text-heading-05 font-medium rounded-lg py-4 px-6 mt-4`}
                >
                  Choose Plan
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col my-20 w-full items-center">
            <h1 className="text-heading-01 font-bold  mx-auto">
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
                  className="w-[60vw] border px-4 rounded-xl"
                >
                  <AccordionTrigger className="!text-heading-04">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="!text-heading-06">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="flex flex-col gap-10 items-center justify-center w-5/6 bg-[#F8F8F8] pb-10 my-10">
            <div className="flex flex-row gap-28 items-center bg-[#897F75B0] text-white p-12 mx-auto rounded-lg">
              <div className="flex flex-col gap-10 px-10">
                <h2 className="text-heading-02 font-semibold">
                  Still not sure? Start with the Free Basic Plan and upgrade
                  anytime!
                </h2>
                <p className="text-heading-04 font-semibold">
                  Enjoy professional tools with our Advanced Plan – free for 1
                  month!
                </p>
              </div>
              <div className="aspect-[1/1] rounded-lg overflow-hidden w-[80%]">
                <Image
                  src="/assets/membership-footer.jpg"
                  alt="membership icon"
                  className="w-full h-full object-cover"
                  width={2048}
                  height={2048}
                />
              </div>
            </div>
            <div className="flex flex-row gap-10 items-center justify-center w-full">
              <button className="w-4/12 bg-transparent border-2 border-primary text-primary text-heading-05 font-semibold rounded-2xl py-4 px-6 mt-4">
                Get Started for Free
              </button>
              <button className="w-4/12 bg-primary text-white text-heading-05 font-semibold rounded-2xl py-4 px-6 mt-4">
                Start Advanced Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
