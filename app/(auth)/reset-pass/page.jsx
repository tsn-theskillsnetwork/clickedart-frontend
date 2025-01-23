import React, { Suspense } from "react";
import Loader from "@/components/loader";
import ResetPassPage from "./ResetPass";

export default function ResetPageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader /></div>}>
      <ResetPassPage />
    </Suspense>
  );
}
