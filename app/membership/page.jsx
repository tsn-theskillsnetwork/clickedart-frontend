"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "axios";
import useAuthStore from "@/authStore";
import { useRazorpay } from "react-razorpay";
import toast from "react-hot-toast";

export default function MembershipPage() {
  const { photographer, token } = useAuthStore();
  const [active, setActive] = useState(0);
  const [plans, setPlans] = useState([]);
  const [userPlan, setUserPlan] = useState("Basic");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);

  //razorpay
  const { Razorpay } = useRazorpay();
  const [paymentStatus, setPaymentStatus] = useState();
  const [razorpay_payment_id, setrazorpay_payment_id] = useState();
  const [selectedPlanId, setSelectedPlanId] = useState();
  const [selectedPlanPrice, setSelectedPlanPrice] = useState();
  const [selectedPlanDuration, setSelectedPlanDuration] = useState();

  const handlePayment = useCallback(
    async (planId, price, duration) => {
      if (!photographer) {
        toast.error("Please login as Photographer to continue");
        return;
      }
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/subscriptions/payment`,
        {
          total: price,
          userId: photographer._id,
        }
      );
      console.log("result", result);

      const options = {
        key: result.data.result.notes.key,
        amount: result.data.result.amount,
        currency: "INR",
        name: "ClickedArt",
        description: "Total Payment",
        image: "/assets/Logo.png",
        order_id: result.data.id,
        handler: async (res) => {
          try {
            const paymentId = res.razorpay_payment_id;
            if (paymentId) {
              setrazorpay_payment_id(paymentId);
              setPaymentStatus(true);
              setSelectedPlanId(planId);
              setSelectedPlanPrice(price);
              setSelectedPlanDuration(duration);
            }
          } catch (error) {
            setUploadVisible(false);
            createFailedOrder();
          }
        },
        prefill: {
          email: photographer?.email,
          contact: photographer?.mobile,
          name: `${photographer?.firstName} ${photographer?.lastName}`,
        },

        theme: {
          color: "#3399cc",
        },
      };

      console.log("options", options);

      const rzpay = new Razorpay(options);
      rzpay.open();
    },
    [Razorpay, photographer]
  );

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/plans/get-all-plans`
        );
        console.log(response.data);
        setPlans(response.data.plans);
        setActive(response.data.plans[0]._id);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchActivePlan = async () => {
      if (!photographer || !photographer._id) {
        console.log("Photographer data is missing");
        return;
      }
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/subscriptions/get-user-active-subscription?photographer=${photographer._id}`
        );
        console.log(
          "Active Subscription ",
          res.data.subscription?.planId?.name
        );
        setUserPlan(res.data.subscription?.planId?.name);
      } catch (error) {
        console.log(error.response ? error.response.data : error.message);
      }
    };

    fetchPlans();
    fetchActivePlan();
  }, [photographer] || []);

  const handleTrial = async (planId, price, duration) => {
    if (!photographer) return;
    const confirm = window.confirm(
      "Are you sure you want to start the free trial?"
    );
    if (confirm) {
      handleSubscribe(planId, price, duration);
    }
  };

  const handleSubscribe = async (planId, price, duration) => {
    if (!photographer) return;
    if (price === "") return;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/subscriptions/add-subscription`,
        {
          userId: photographer._id,
          planId,
          price,
          duration,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      console.log("Worked");
      toast.success("Subscription added successfully");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(selectedPlanId, selectedPlanPrice, selectedPlanDuration);

  useEffect(() => {
    if (paymentStatus === true) {
      console.log(selectedPlanId, selectedPlanPrice, selectedPlanDuration);
      handleSubscribe(selectedPlanId, selectedPlanPrice, selectedPlanDuration);
    }
  }, [selectedPlanDuration]);

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
          {userPlan !== "Premium" && (
            <button
              onClick={() =>
                handleTrial("67853b3d25457a993c90b1a1", 3999, "monthly")
              }
              className="bg-white text-primary text-xs mx-auto md:mx-0 sm:text-paragraph lg:text-heading-05 font-semibold rounded-lg py-2.5 px-3 mt-2"
            >
              Start with a free 1-month trial of the Premium Plan
            </button>
          )}
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
                key={plan._id}
                onHoverStart={() => setActive(plan._id)}
                onClick={() => setActive(plan._id)}
                className={` flex w-full h-full py-4 md:px-4 lg:px-12 xl:px-20 flex-col items-center justify-between gap-2 border-primary border-2 rounded-2xl transition-all duration-200 ease-linear ${
                  plan._id === active
                    ? "bg-primary ease-in-out text-white scale-y-105 -translate-y-4"
                    : " text-primary-dark scale-y-100 -translate-y-0"
                }`}
              >
                <div
                  className={`flex flex-col items-center transition-transform w-full duration-200 ease-linear ${
                    plan._id === active
                      ? "scale-y-95 -translate-y-3"
                      : "scale-y-100 -translate-y-0"
                  }`}
                >
                  <div
                    className={`border px-4 py-2 rounded-2xl text-heading-05 font-semibold ${
                      plan._id === active
                        ? "border-white text-white"
                        : "border-primary text-primary"
                    }`}
                  >
                    <p>{plan.name}</p>
                  </div>
                  <div
                    className={`flex flex-col gap-2 text-heading-02 font-semibold ${
                      plan._id === active ? "text-white" : "text-primary"
                    }`}
                  >
                    {plan.cost.map((cost, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-0"
                      >
                        {cost.price <= 0 ? (
                          <p>Free</p>
                        ) : (
                          <span
                            key={index}
                            className="flex flex-col items-center gap-0 capitalize"
                          >
                            <p>₹{cost.price}</p>
                            <p className="-mt-4 text-heading-06">
                              {cost.duration}
                            </p>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-6 mt-6">
                    <p className="text-base sm:text-heading-05 md:text-heading-04 lg:text-heading-03 font-semibold text-center">
                      Features
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold ">Advanced Tools</h3>
                      <p className="text-center">{plan.advancedTools}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold ">
                        Catalogue Creation
                      </h3>
                      <p className="text-center">
                        {plan.catalogCreation > 999
                          ? "Unlimited"
                          : plan.catalogCreation}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold ">Custom Pricing</h3>
                      <p className="text-center">
                        {plan.customPricing ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold ">
                        Image Upload Limit
                      </h3>
                      <p className="text-center">
                        {plan.imageUploadLimit > 999
                          ? "Unlimited"
                          : plan.imageUploadLimit}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold ">
                        Licensing Options
                      </h3>
                      <p className="text-center">{plan.licensingOptions}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold ">
                        Priority Support
                      </h3>
                      <p className="text-center">{plan.prioritySupport}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold ">
                        Promotional Tools
                      </h3>
                      <p className="text-center">{plan.promotionalTools}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold">Sales Reports</h3>
                      <p className="text-center">{plan.salesReports}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold ">
                        Social Media Auto Posting
                      </h3>
                      <p className="text-center">
                        {plan.socialMediaAutoPosting}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold ">
                        Social Media Integration
                      </h3>
                      <p className="text-center">
                        {plan.socialMediaIntegration}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-lg font-semibold ">
                        Watermarking Tools
                      </h3>
                      <p className="text-center">{plan.watermarkingTools}</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    plan._id === active ? "scale-y-95" : "scale-y-100"
                  } transition-transform w-40 lg:w-60 duration-200 ease-linear`}
                >
                  {userPlan != plan.name && plan.name !== "Basic" && (
                    <div className="w-full">
                      {/* The button */}
                      <button
                        onClick={() => setSelectedPlan(plan._id)}
                        className={`${
                          plan._id === active
                            ? "bg-white text-primary"
                            : "bg-primary text-white"
                        } md:text-sm w-full lg:text-heading-06 xl:text-heading-05 font-medium rounded-lg py-4 px-6 mt-4`}
                      >
                        Choose Plan
                      </button>
                      {plan._id === selectedPlan && (
                        <select
                          placeholder="Select a plan"
                          onChange={(e) => {
                            if (e.target.value === "Select a plan") return;
                            const duration = e.target.value;
                            const price = plan.cost.find(
                              (cost) => cost.duration === duration
                            ).price;
                            handlePayment(plan._id, price, duration);
                          }}
                          className={`${
                            plan._id === active
                              ? "bg-white text-primary"
                              : "bg-primary text-white"
                          } w-full border rounded-lg p-2 mt-2 text-sm`}
                        >
                          <option className="">Select a plan</option>
                          {plan.cost.map((cost) => (
                            <option key={cost._id} value={cost.duration}>
                              {cost.duration.charAt(0).toUpperCase() +
                                cost.duration.slice(1)}{" "}
                              - ₹{cost.price}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          {/* Mobile view */}
          <div className="md:hidden w-screen grid grid-cols-3 px-2 gap-1 sm:gap-10 pt-10 items-end">
            {plans.map((plan) => (
              <motion.div
                key={plan._id}
                onHoverStart={() => setActive(plan._id)}
                onClick={() => setActive(plan._id)}
                className={`flex w-full h-full py-5 px-2 flex-col items-center justify-between gap-2 border-primary border-2 rounded-2xl transition-all duration-200 ease-linear ${
                  plan._id === active
                    ? "bg-primary ease-in-out text-white scale-y-110 -translate-y-1.5"
                    : " text-primary-dark scale-y-100 -translate-y-0"
                }`}
              >
                <div
                  className={`flex flex-col items-center transition-transform duration-200 ease-linear ${
                    plan._id === active
                      ? "scale-y-90 translate-y-2"
                      : "scale-y-100 -translate-y-0"
                  }`}
                >
                  <div
                    className={`border px-1 py-1 sm:px-2 w-full text-center rounded-2xl text-xs sm:text-lg font-semibold ${
                      plan._id === active
                        ? "border-white text-white"
                        : "border-primary text-primary"
                    }`}
                  >
                    <p>{plan.name}</p>
                  </div>
                  <div
                    className={`text-heading-06 flex-flex-col gap-2 sm:text-heading-05 font-bold ${
                      plan._id === active ? "text-white" : "text-primary"
                    }`}
                  >
                    {plan.cost.map((cost, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-0 capitalize"
                      >
                        <p>₹{cost.price}</p>
                        <p className="-mt-2 text-sm font-semibold">
                          {cost.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex md:hidden flex-col w-full gap-2 mt-4">
            {plans &&
              plans.length > 0 &&
              plans
                .filter((plan) => plan._id === active)
                .map((plan) => (
                  <div
                    key={plan._id}
                    className="flex flex-col items-center gap-6 mt-6"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Advanced Tools
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.advancedTools}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Catalogue Creation
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.catalogCreation}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Custom Pricing
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.customPricing ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Image Upload Limit
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.imageUploadLimit}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Licensing Options
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.licensingOptions}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Priority Support
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.prioritySupport}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Promotional Tools
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.promotionalTools}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Sales Reports
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.salesReports}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Social Media Auto Posting
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.socialMediaAutoPosting}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Social Media Integration
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.socialMediaIntegration}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-center">
                        Watermarking Tools
                      </h3>
                      <p className="text-sm sm:text-base text-center">
                        {plan.watermarkingTools}
                      </p>
                    </div>
                    {userPlan != plan.name && plan.name !== "Basic" && (
                      <button
                        onClick={() => setSelectedPlan(plan._id)}
                        className={`bg-primary text-white md:text-sm w-full lg:text-heading-06 xl:text-heading-05 font-medium rounded-lg py-4 px-6 mt-4`}
                      >
                        Choose Plan
                      </button>
                    )}

                    {plan._id === selectedPlan && (
                      <select
                        placeholder="Select a plan"
                        onChange={(e) => {
                          if (e.target.value === "Select a plan") return;
                          const duration = e.target.value;
                          const price = plan.cost.find(
                            (cost) => cost.duration === duration
                          ).price;
                          handlePayment(plan._id, price, duration);
                        }}
                        className={`${
                          plan._id === active
                            ? "bg-white text-primary"
                            : "bg-primary text-white"
                        } w-full border rounded-lg p-2 mt-2 text-sm`}
                      >
                        <option className="">Select a plan</option>
                        {plan.cost.map((cost) => (
                          <option key={cost._id} value={cost.duration}>
                            {cost.duration.charAt(0).toUpperCase() +
                              cost.duration.slice(1)}{" "}
                            - ₹{cost.price}
                          </option>
                        ))}
                      </select>
                    )}
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
              Enjoy professional tools with our Premium Plan - free for 1 month!
            </p>
            {userPlan !== "Premium" && (
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 xl:gap-10 items-center justify-center w-full">
                <button className=" bg-transparent border-2 border-[#F8F8F8] w-full text-[#F8F8F8] text-paragraph lg:text-paragraph xl:text-heading-06 font-semibold rounded-2xl py-4 px-6 mt-4">
                  Get Started for Free
                </button>
              </div>
            )}
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
