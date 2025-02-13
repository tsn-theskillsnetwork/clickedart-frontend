import EnquiryForm from "@/components/form/Enquiry";
import React from "react";

export default function CustomEnquiryForm() {
  return (
    <div className="flex flex-col px-4 my-10">
      <h1 className="text-4xl font-bold text-center">Custom Enquiry Form</h1>
      <EnquiryForm />
    </div>
  );
}
