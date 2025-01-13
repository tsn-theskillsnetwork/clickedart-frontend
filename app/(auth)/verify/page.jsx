import React, { Suspense } from "react";
import VerifyPage from "./verify-page";
import Loader from "@/components/loader";

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader /></div>}>
      <VerifyPage />
    </Suspense>
  );
}
