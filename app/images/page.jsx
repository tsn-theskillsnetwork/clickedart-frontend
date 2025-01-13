import React, { Suspense } from "react";
import Loader from "@/components/loader";
import ThemesResultPage from "./themes-result";

export default function VerifyPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      }
    >
      <ThemesResultPage />
    </Suspense>
  );
}
