import React, { Suspense } from "react";
import Loader from "@/components/loader";
import SearchResultPage from "./search-result";

export default function VerifyPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      }
    >
      <SearchResultPage />
    </Suspense>
  );
}
