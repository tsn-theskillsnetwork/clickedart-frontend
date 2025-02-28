"use client";

import useAuthStore from "@/authStore";
import PhotographerOnly from "@/components/auth/photographerOnly";
import Loader from "@/components/loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ManageSubscriptionPage() {
  const { photographer, isHydrated } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/subscriptions/get-user-subscription?userId=${photographer?._id}`
      );
      console.log(res.data);
      setSubscriptions(res.data.subscriptions);
    } catch (err) {
      console.log(err);
    }
  };

  const confirmCancelSubscription = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelSubscription(id);
      }
    });
  };

  const cancelSubscription = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/subscriptions/cancel-subscription`,
        { id }
      );
      console.log(res.data);
      fetchSubscriptions();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (photographer) fetchSubscriptions();
  }, [photographer]);

  if (!isHydrated)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  if (!photographer) {
    return <PhotographerOnly />;
  }

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-10 md:px-14 lg:px-20 xl:px-32">
      <p className="font-bold mt-8 text-center text-base sm:text-paragraph md:text-heading-06 lg:text-heading-05 xl:text-heading-04">
        Manage Subscriptions
      </p>
      <p className="text-sm sm:text-base md:text-paragraph font-semibold text-green-600 mt-8">
        Active ({subscriptions.filter((sub) => sub.isActive).length})
      </p>
      {subscriptions.length === 0 && (
        <p className="text-sm sm:text-base md:text-paragraph text-gray-600 font-semibold mt-4">
          No Subscriptions Found
        </p>
      )}
      {subscriptions.filter((sub) => sub.isActive).length === 0 && (
        <p className="text-sm sm:text-base md:text-paragraph text-gray-600 font-semibold mt-4">
          No Active Subscriptions Found
        </p>
      )}
      <div className="mt-4 mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions
          .filter((sub) => sub.isActive)
          .map((sub) => (
            <div
              key={sub._id}
              className="bg-white border p-4 rounded-md shadow-md mb-4 w-full"
            >
              <p className="font-semibold text-heading-06">{sub.planId.name}</p>
              <hr />
              <p className="font-medium text-sm sm:text-base">
                Price: {sub.price}
              </p>
              <p className="font-medium text-sm sm:text-base">
                Start Date:{" "}
                {sub.startDate && new Date(sub.startDate).toDateString()}
              </p>
              <p className="font-medium text-sm sm:text-base">
                End Date: {sub.endDate && new Date(sub.endDate).toDateString()}
              </p>
              <p className="font-medium text-sm sm:text-base capitalize">
                Auto Renew: {sub.autoRenew.toString()}
              </p>
              <button
                onClick={() => confirmCancelSubscription(sub._id)}
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded-md shadow-md"
              >
                Cancel
              </button>
            </div>
          ))}
      </div>
      <hr />
      <p className="text-sm sm:text-base md:text-paragraph text-red-600 font-semibold mt-4">
        Inactive ({subscriptions.filter((sub) => !sub.isActive).length})
      </p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions
          .filter((sub) => !sub.isActive)
          .map((sub) => (
            <div
              key={sub._id}
              className="bg-gray-100 text-gray-700 p-4 rounded-md shadow-md mb-4 w-full"
            >
              <p className="font-semibold text-heading-06">{sub.planId.name}</p>
              <hr />
              <p className="font-medium text-sm sm:text-base">
                Price: {sub.price}
              </p>
              <p className="font-medium text-sm sm:text-base">
                Start Date:{" "}
                {sub.startDate && new Date(sub.startDate).toDateString()}
              </p>
              <p className="font-medium text-sm sm:text-base">
                End Date: {sub.endDate && new Date(sub.endDate).toDateString()}
              </p>
              <p className="font-medium text-sm sm:text-base capitalize">
                Auto Renew: {sub.autoRenew.toString()}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
